# CellCarto Cold Ischemia Timecourse

Interactive web application and data resource for exploring spatiotemporal transcriptomic changes in murine kidneys during cold ischemic injury.

The app supports compartment-specific exploration of spatial transcriptomics data across cold ischemia timepoints, with views for cortex, outer medulla, and inner medulla responses.

## Links

- Web app: https://jef.works/CellCarto-ColdIschemia/
- Manuscript: https://www.biorxiv.org/content/10.1101/2025.05.25.654911v2
- Repository: https://github.com/JEFworks-Lab/vitessce-cold-ischemia

## Features

- Interactive spatial and harmonized t-SNE views of murine kidney spots.
- Gene search and gene-expression coloring.
- Filters for metadata-driven exploration.
- Adjustable point size, sampling, color palettes, and light/dark theme.
- Timecourse plots for selected genes across kidney compartments.
- Gene tables for compartment-specific upregulated and downregulated gene sets.
- Static GitHub Pages build in `docs/`.

## Data

The `data/` directory contains the processed data used by the browser:

- `cold_ischemia_union.zarr/`: unified AnnData/Zarr dataset for app rendering.
- `CI_cells_*.json`: spatial spot/cell-level data by compartment and regulation direction.
- `CI_clusters_*.json`: gene-expression matrices for compartment-specific gene sets.
- `CI_cell_sets_*.json`: gene-set membership files.
- `CI_timecourse_*.json`: average gene-expression timecourse data.
- `CIS_All_DEGs_Slope_R2_by_section.json`: slope and R2 summaries by kidney section.
- `harmonized_tsne_embeddings.json`: harmonized t-SNE coordinates.

Timepoints represented in the app include 0, 12, 24, and 48 hours of cold ischemia.

## Repository Structure

```text
.
├── data/       Processed JSON and Zarr data used by the app
├── docs/       Production build for GitHub Pages
├── public/     Static public assets copied into builds
├── R/          Early R/Vitessce workflow notes
├── scripts/    Data conversion and asset-copy helper scripts
└── src/        React landing page and D3/Three.js app source
```

## Local Development

Install dependencies once:

```bash
npm install
```

Run the app locally:

```bash
npm start
```

The development server opens at http://localhost:3000.

## Build for GitHub Pages

Build the production app:

```bash
npm run build
```

Replace the GitHub Pages build directory:

```bash
rm -rf docs
mv build docs
```

The `prestart` and `prebuild` scripts run `scripts/copy-d3-assets.js` so the standalone D3 app assets are available to React and the static build.

## Data Conversion

The unified Zarr dataset can be regenerated from the processed JSON files with:

```bash
python scripts/convert_unified_zarr.py
```

See the script docstring and arguments for conversion details.

## Citation

If you use this app, code, or processed data, please cite the associated manuscript and the archived GitHub/Zenodo release DOI for the version used.

```text
Singh S, Patel SK, Matsuura R, Velazquez D, Sun Z, Noel S, Rabb H, Fan J.
Spatiotemporal Transcriptomic Analysis of the Murine Kidney Reveals
Compartment-Specific Changes During Cold Ischemic Injury.
bioRxiv. 2025.
```

```text
Dee Velazquez, & Jean Fan. (2026). JEFworks-Lab/CellCarto-ColdIschemia: v1.0.0 - Initial Release (v1.0.0). Zenodo. https://doi.org/10.5281/zenodo.20417220
```

## License

This repository is released under the MIT License. See `LICENSE` for details.
