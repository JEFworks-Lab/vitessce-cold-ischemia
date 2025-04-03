import React from 'react';
import './LandingPage.css';

const links = [
  { path: "/cortex-up", label: "Upregulated Cortex Genes" },
  { path: "/inner-medulla-up", label: "Upregulated Inner Medulla Genes" },
  { path: "/outer-medulla-up", label: "Upregulated Outer Medulla Genes" },
  { path: "/cortex-down", label: "Downregulated Cortex Genes" },
  { path: "/inner-medulla-down", label: "Downregulated Inner Medulla Genes" },
  { path: "/outer-medulla-down", label: "Downregulated Outer Medulla Genes" },
];

export default function LandingPage() {
  return (
    <div className="landing-wrapper">
      <header>
        <h1>
          Spatiotemporal transcriptomic analysis of the murine kidney reveals compartment-specific changes during cold ischemic injury
        </h1>
      </header>

      <section className="description">
        <p>
          <strong>Abstract:</strong> Deceased donor kidneys usually undergo cold storage until kidney transplantation. Prolonged cold ischemia time leads to poor graft outcomes, however mechanistic understanding is limited. To bridge the knowledge gap, we leveraged spatial transcriptomics technology to perform full transcriptome characterization of cold ischemia injury (0-48 hours) using a murine model. We developed a computational workflow to identify spatiotemporal transcriptomic changes that accompany the injury pathophysiology in a compartment-specific manner. We identified potential metabolic reprogramming preferentially within the kidney inner medulla displaying strong OXPHOS (oxidative phosphorylation) signature while oxidative and ER (endoplasmic reticulum) stress was observed tissue wide. We found commonalities between the spatiotemporal transcriptomic presentation of cold ischemia and warm ischemia‒reperfusion injury, including an induction of an anti-viral like immune response throughout the renal tissue. Altogether, these systems-level biological insights enabled by our full transcriptome temporal characterization unveil a molecular basis for how cold ischemia injury may negatively affect graft performance. Moreover, our spatial analyses highlight pathological developments deep within the renal tissue, suggesting potential opportunities for new insights beyond biopsy-focused superficial tissue examinations.
          <br /><br />
          <br /><br />
          <strong>Authors:</strong> Srujan Singh, Shishir Kumar Patel, Ryo Matsuura, Dee Velazquez, Zhaoli Sun, Sanjeev Noel, Hamid Rabb, & Jean Fan
        </p>
      </section>

      <main>
        <div className="grid">
          {links.map((link, i) => (
            <a key={i} className="box" href={link.path}>
              {link.label}
            </a>
          ))}
        </div>
      </main>

      <footer>
        <p>&copy; Dee Velazquez 2025, using <a href="https://vitessce.io/">Vitessce</a></p>
        <a href="https://www.flaticon.com/free-icons/kidney" title="kidney icons">
          Kidney icon created by kerismaker - Flaticon
        </a>
      </footer>
    </div>
  );
}
