#!/usr/bin/env python3
"""
Build a unified AnnData Zarr from the Vitessce JSON files in data/.

This script:
- Uses a single CI_cells_*.json for obs + spatial coordinates.
- Unions genes across the six CI_clusters_*.json files.
- Writes membership columns in var for each up/down + compartment set.
- Adds slope and R2 columns per compartment from the DEG stats JSON.
- Adds harmonized tSNE embeddings to obsm.
- Stores X as CSC (cells x genes), which your JS expects for gene lookup.
"""

import argparse
import json
from pathlib import Path

import anndata as ad
import numpy as np
import pandas as pd
import scipy.sparse as sp

DEFAULT_SET_FILES = {
    "cortex_up": "CI_clusters_Cortex_Up.json",
    "cortex_down": "CI_clusters_Cortex_Down.json",
    "inner_medulla_up": "CI_clusters_Inner_Medulla_Up.json",
    "inner_medulla_down": "CI_clusters_Inner_Medulla_Down.json",
    "outer_medulla_up": "CI_clusters_Outer_Medulla_Up.json",
    "outer_medulla_down": "CI_clusters_Outer_Medulla_Down.json",
}
DEFAULT_TIMECOURSE_GLOB = "CI_timecourse_*.json"


def load_json(path: Path):
    with path.open("r") as f:
        return json.load(f)


def load_cells(cell_path: Path, time_as_category: bool):
    data = load_json(cell_path)
    cell_ids = list(data.keys())

    xy = np.array([data[c]["xy"] for c in cell_ids], dtype=np.float32)
    time_vals = [data[c]["factors"].get("time") for c in cell_ids]
    comp_vals = [data[c]["factors"].get("compartment") for c in cell_ids]

    obs = pd.DataFrame({
        "Barcode": cell_ids,
        "Time": time_vals,
        "Compartment": comp_vals,
    }, index=cell_ids)

    if time_as_category:
        obs["Time"] = obs["Time"].astype("category")
    else:
        try:
            obs["Time"] = pd.to_numeric(obs["Time"], errors="raise").astype(int)
        except Exception:
            obs["Time"] = pd.to_numeric(obs["Time"], errors="coerce")

    obs["Compartment"] = obs["Compartment"].astype("category")

    return cell_ids, xy, obs


def verify_all_cell_files(data_dir: Path, reference_ids, verify: bool):
    if not verify:
        return
    for path in sorted(data_dir.glob("CI_cells_*.json")):
        data = load_json(path)
        ids = list(data.keys())
        if ids != reference_ids:
            raise ValueError(f"Cell order mismatch in {path.name}")


def build_union_matrix(data_dir: Path, set_files, cell_ids, verify_cols: bool, check_duplicates: bool):
    gene_names = []
    gene_to_idx = {}
    rows_by_set = {}

    # First pass: union genes
    for set_name, fn in set_files.items():
        cl = load_json(data_dir / fn)
        rows = cl["rows"]
        rows_by_set[set_name] = set(rows)
        for g in rows:
            if g not in gene_to_idx:
                gene_to_idx[g] = len(gene_names)
                gene_names.append(g)

    n_genes = len(gene_names)
    n_cells = len(cell_ids)

    Xg = np.zeros((n_genes, n_cells), dtype=np.float32)
    filled = np.zeros(n_genes, dtype=bool)
    mismatches = []

    # Second pass: fill matrix
    for set_name, fn in set_files.items():
        cl = load_json(data_dir / fn)
        rows = cl["rows"]
        cols = cl["cols"]
        matrix = cl["matrix"]

        if verify_cols and cols != cell_ids:
            raise ValueError(f"Cell IDs in {fn} do not match the cell file order.")
        if len(rows) != len(matrix):
            raise ValueError(f"Row count mismatch in {fn}: rows {len(rows)} vs matrix {len(matrix)}")

        for g, row_vals in zip(rows, matrix):
            gi = gene_to_idx[g]
            row_arr = np.asarray(row_vals, dtype=np.float32)
            if row_arr.shape[0] != n_cells:
                raise ValueError(
                    f"Row length mismatch for gene {g} in {fn}: {row_arr.shape[0]} vs {n_cells}"
                )
            if not filled[gi]:
                Xg[gi, :] = row_arr
                filled[gi] = True
            else:
                if check_duplicates and not np.allclose(Xg[gi, :], row_arr):
                    mismatches.append(g)

    return gene_names, rows_by_set, Xg, mismatches


def load_gene_stats_by_section(stats_path: Path):
    data = load_json(stats_path)
    if isinstance(data, dict):
        if isinstance(data.get("sections"), dict):
            return data["sections"]
        return data
    raise ValueError(f"Unexpected DEG stats file format: {stats_path}")


def load_tsne_embeddings(tsne_path: Path, cell_ids):
    data = load_json(tsne_path)
    if not isinstance(data, dict):
        raise ValueError(f"Unexpected tSNE file format: {tsne_path}")

    n_cells = len(cell_ids)
    emb = np.zeros((n_cells, 2), dtype=np.float32)
    missing = 0
    for i, barcode in enumerate(cell_ids):
        values = data.get(barcode)
        if values is None or len(values) < 2:
            missing += 1
            continue
        emb[i, 0] = values[0]
        emb[i, 1] = values[1]
    if missing:
        print(f"Warning: missing tSNE embeddings for {missing} barcodes")
    return emb


def load_timecourse_files(data_dir: Path, pattern: str):
    paths = sorted(data_dir.glob(pattern))
    if not paths:
        raise FileNotFoundError(f"No timecourse files matched: {data_dir / pattern}")

    timecourse_by_gene = {}
    compartments = set()
    times = set()
    mismatches = 0

    for path in paths:
        data = load_json(path)
        genes = data.get("genes")
        if not isinstance(genes, dict):
            raise ValueError(f"Unexpected timecourse format in {path.name}: missing 'genes' dict")

        for gene, comp_data in genes.items():
            if not isinstance(comp_data, dict):
                continue
            gene_entry = timecourse_by_gene.setdefault(gene, {})
            for comp, pairs in comp_data.items():
                compartments.add(comp)
                comp_entry = gene_entry.setdefault(comp, {})
                for pair in pairs:
                    if not pair or len(pair) < 2:
                        continue
                    t_raw, v_raw = pair[0], pair[1]
                    try:
                        t_val = int(t_raw)
                    except Exception:
                        t_val = float(t_raw)
                    try:
                        v_val = float(v_raw)
                    except Exception:
                        v_val = np.nan
                    times.add(t_val)
                    if t_val in comp_entry and not np.isclose(comp_entry[t_val], v_val, equal_nan=True):
                        mismatches += 1
                    comp_entry[t_val] = v_val

    return timecourse_by_gene, compartments, times, mismatches


def order_timecourse_compartments(compartments):
    preferred = ["Cortex", "Inner Medulla", "Outer Medulla", "Other"]
    ordered = [c for c in preferred if c in compartments]
    remaining = sorted(c for c in compartments if c not in preferred)
    ordered.extend(remaining)
    return ordered


def build_timecourse_matrix(gene_names, timecourse_by_gene, compartments, times):
    if not timecourse_by_gene:
        return None, None

    ordered_compartments = order_timecourse_compartments(compartments)
    ordered_times = sorted(times)
    n_genes = len(gene_names)
    n_comp = len(ordered_compartments)
    n_times = len(ordered_times)
    matrix = np.full((n_genes, n_comp * n_times), np.nan, dtype=np.float32)

    for i, gene in enumerate(gene_names):
        gene_entry = timecourse_by_gene.get(gene)
        if not gene_entry:
            continue
        for c_idx, comp in enumerate(ordered_compartments):
            comp_entry = gene_entry.get(comp)
            if not comp_entry:
                continue
            for t_idx, t_val in enumerate(ordered_times):
                if t_val in comp_entry:
                    matrix[i, c_idx * n_times + t_idx] = comp_entry[t_val]

    meta = {
        "compartments": ordered_compartments,
        "times": ordered_times,
        "order": "compartment_major",
    }
    return matrix, meta


def build_var(gene_names, rows_by_set, gene_stats_by_section):
    idx = pd.Index(gene_names)
    var = pd.DataFrame(index=idx)
    for set_name, genes in rows_by_set.items():
        var[set_name] = idx.isin(genes)

    section_column_map = {
        "Cortex": {
            "Slope": "Cortex_Slopes",
            "R2": "Cortex_R2",
        },
        "Inner_Medulla": {
            "Slope": "Inner_Medulla_Slopes",
            "R2": "Inner_Medulla_R2",
        },
        "Outer_Medulla": {
            "Slope": "Outer_Medulla_Slopes",
            "R2": "Outer_Medulla_R2",
        },
    }

    for section_key, metric_column_map in section_column_map.items():
        section = gene_stats_by_section.get(section_key)
        if section is None:
            continue
        for metric_key, col_name in metric_column_map.items():
            values = np.full(len(idx), np.nan, dtype=np.float32)
            for i, gene in enumerate(idx):
                if gene not in section:
                    continue
                gene_stats = section[gene]
                if isinstance(gene_stats, dict):
                    metric_value = gene_stats.get(metric_key)
                elif metric_key == "Slope":
                    # Backward compatibility with the older slope-only JSON.
                    metric_value = gene_stats
                else:
                    metric_value = np.nan
                if metric_value is None:
                    continue
                values[i] = np.float32(metric_value)
            var[col_name] = values

    return var


def parse_chunks(chunks_str: str):
    try:
        a, b = chunks_str.split(",")
        return (int(a), int(b))
    except Exception as e:
        raise ValueError("--chunks must be like '1000,500'") from e


def main():
    parser = argparse.ArgumentParser(
        description="Convert Vitessce JSONs into a unified AnnData Zarr"
    )
    parser.add_argument("--data-dir", default="data", help="Path to JSON data directory")
    parser.add_argument(
        "--cell-file",
        default="CI_cells_Cortex_Down.json",
        help="Which CI_cells_*.json file to use for obs + coords",
    )
    parser.add_argument(
        "--out",
        default="data/cold_ischemia_union.zarr",
        help="Output Zarr directory",
    )
    parser.add_argument(
        "--time-as-category",
        action="store_true",
        help="Keep obs.Time as a categorical column",
    )
    parser.add_argument(
        "--slopes-file",
        default="CIS_All_DEGs_Slope_R2_by_section.json",
        help=(
            "Gene DEG stats JSON file name or path "
            "(default: CIS_All_DEGs_Slope_R2_by_section.json)"
        ),
    )
    parser.add_argument(
        "--tsne-file",
        default="harmonized_tsne_embeddings.json",
        help="Harmonized tSNE JSON file name or path (default: harmonized_tsne_embeddings.json)",
    )
    parser.add_argument(
        "--timecourse-glob",
        default=DEFAULT_TIMECOURSE_GLOB,
        help="Glob pattern for timecourse JSON files (default: CI_timecourse_*.json)",
    )
    parser.add_argument(
        "--verify-all-cell-files",
        action="store_true",
        help="Check that all CI_cells_*.json files have the same cell order",
    )
    parser.add_argument(
        "--no-verify-cols",
        dest="verify_cols",
        action="store_false",
        help="Skip checking CI_clusters_*.json cols against cell IDs",
    )
    parser.set_defaults(verify_cols=True)
    parser.add_argument(
        "--check-duplicate-values",
        action="store_true",
        help="Check that duplicate genes across sets have identical values",
    )
    parser.add_argument(
        "--chunks",
        default="1000,500",
        help="Zarr chunks as 'cells,genes'",
    )
    parser.add_argument(
        "--sets",
        nargs="*",
        default=list(DEFAULT_SET_FILES.keys()),
        choices=list(DEFAULT_SET_FILES.keys()),
        help="Which gene sets to include",
    )

    args = parser.parse_args()

    data_dir = Path(args.data_dir)
    out_path = Path(args.out)

    set_files = {k: DEFAULT_SET_FILES[k] for k in args.sets}

    cell_path = data_dir / args.cell_file
    if not cell_path.exists():
        raise FileNotFoundError(f"Cell file not found: {cell_path}")

    cell_ids, xy, obs = load_cells(cell_path, args.time_as_category)

    verify_all_cell_files(data_dir, cell_ids, args.verify_all_cell_files)

    slopes_path = Path(args.slopes_file)
    if not slopes_path.is_absolute():
        slopes_path = data_dir / slopes_path
    if not slopes_path.exists():
        raise FileNotFoundError(f"DEG stats file not found: {slopes_path}")
    gene_stats_by_section = load_gene_stats_by_section(slopes_path)

    gene_names, rows_by_set, Xg, mismatches = build_union_matrix(
        data_dir,
        set_files,
        cell_ids,
        verify_cols=args.verify_cols,
        check_duplicates=args.check_duplicate_values,
    )

    var = build_var(gene_names, rows_by_set, gene_stats_by_section)

    timecourse_by_gene, timecourse_compartments, timecourse_times, timecourse_mismatches = (
        load_timecourse_files(data_dir, args.timecourse_glob)
    )
    timecourse_matrix, timecourse_meta = build_timecourse_matrix(
        gene_names,
        timecourse_by_gene,
        timecourse_compartments,
        timecourse_times,
    )

    X = sp.csc_matrix(Xg.T)
    X.sort_indices()

    adata = ad.AnnData(X=X, obs=obs, var=var)
    adata.uns["expression_units"] = "Normalized CPM"
    if timecourse_matrix is not None:
        adata.varm["timecourse"] = timecourse_matrix
        adata.uns["timecourse"] = timecourse_meta

    tsne_path = Path(args.tsne_file)
    if not tsne_path.is_absolute():
        tsne_path = data_dir / tsne_path
    if not tsne_path.exists():
        raise FileNotFoundError(f"tSNE file not found: {tsne_path}")
    tsne_embeddings = load_tsne_embeddings(tsne_path, cell_ids)

    # DataFrame encoding keeps named columns in obsm for your JS
    adata.obsm["Global_Spatial"] = pd.DataFrame(
        {
            "global_x": xy[:, 0],
            "global_y": xy[:, 1],
            "global_z": np.zeros(len(xy), dtype=np.float32),
        },
        index=adata.obs_names,
    )
    adata.obsm["Harmonized_tSNE"] = pd.DataFrame(
        {
            "tsne_1": tsne_embeddings[:, 0],
            "tsne_2": tsne_embeddings[:, 1],
        },
        index=adata.obs_names,
    )
    # Also store a simple spatial array for compatibility
    adata.obsm["spatial"] = xy[:, :2].copy()

    chunks = parse_chunks(args.chunks)
    adata.write_zarr(out_path.as_posix(), chunks=chunks)

    print("Wrote Zarr:", out_path)
    print("Cells:", adata.n_obs, "Genes:", adata.n_vars)
    if mismatches:
        print("Warning: duplicate genes with differing values:", len(mismatches))
    if timecourse_mismatches:
        print("Warning: duplicate timecourse values with differing values:", timecourse_mismatches)


if __name__ == "__main__":
    main()
