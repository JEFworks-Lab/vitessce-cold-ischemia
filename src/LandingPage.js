import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import './Cortex_Downregulated_genes.png';
import './Cortex_Upregulated_genes.png';
import './OuterMedulla_Downregulated_genes.png';
import './OuterMedulla_Upregulated_genes.png';
import './InnerMedulla_Upregulated_genes.png';
import './InnerMedulla_Downregulated_genes.png';

const links = [
  { path: "/cortex-up", label: "Upregulated Cortex Genes", image: `${process.env.PUBLIC_URL}/Cortex_Upregulated_genes.png` },
  { path: "/outer-medulla-up", label: "Upregulated Outer Medulla Genes", image: `${process.env.PUBLIC_URL}/OuterMedulla_Upregulated_genes.png` },
  { path: "/inner-medulla-up", label: "Upregulated Inner Medulla Genes", image: `${process.env.PUBLIC_URL}/InnerMedulla_Upregulated_genes.png` },
  { path: "/cortex-down", label: "Downregulated Cortex Genes", image: `${process.env.PUBLIC_URL}/Cortex_Downregulated_genes.png` },
  { path: "/outer-medulla-down", label: "Downregulated Outer Medulla Genes", image: `${process.env.PUBLIC_URL}/OuterMedulla_Downregulated_genes.png` },
  { path: "/inner-medulla-down", label: "Downregulated Inner Medulla Genes", image: `${process.env.PUBLIC_URL}/InnerMedulla_Downregulated_genes.png` },
];


export default function LandingPage() {
  return (
    <>
      <nav className="navbar">
        <a href="#abstract-authors">Abstract</a>
        <a href="#about">About</a>
        <a href="#tutorial">Tutorial</a>
        <a href="#apps">Web Apps</a>
        <a href="#github">GitHub</a>
      </nav>

      <header className="page-header">
        <h1>Spatiotemporal Transcriptomic Analysis of the Murine Kidney Reveals Compartment-Specific Changes During Cold Ischemic Injury</h1>
      </header>

      <section className="abstract-authors" id="abstract-authors">
        <p>
          <strong>Abstract:</strong> Kidney transplantation remains the gold standard treatment strategy for end-stage renal disease. Deceased donor kidneys usually undergo cold storage until kidney transplantation, leading to cold ischemia injury that may contribute to poor graft outcomes. However, the molecular characterization of potential mechanisms of cold ischemia injury remains incomplete. To bridge this knowledge gap, we leveraged spatial transcriptomics technology to perform full transcriptome characterization of cold ischemia injury (0-48 hours) using a murine model. We developed a computational workflow to identify spatiotemporal transcriptomic changes that accompany the injury pathophysiology in a compartment-specific manner. We identified potential metabolic reprogramming preferentially within the kidney inner medulla displaying strong oxidative phosphorylation signature in an ischemic environment. We found commonalities between the spatiotemporal transcriptomic presentation of cold ischemia and warm ischemia‒reperfusion injury, including an induction of an anti-viral like immune response throughout the renal tissue. Altogether, these systems-level biological insights enabled by our full transcriptome temporal characterization unveil a molecular basis for how cold ischemia injury may negatively affect graft performance. Moreover, our spatial analyses highlight pathological developments deep within the renal tissue, suggesting potential opportunities for new insights beyond biopsy-focused superficial tissue examinations. 
          <br /><br />
          <strong>Authors:</strong> Srujan Singh, Shishir Kumar Patel, Ryo Matsuura, Dee Velazquez, Zhaoli Sun, Sanjeev Noel, Hamid Rabb, & Jean Fan 
          <br /><br />
        </p>
        <a href="https://www.youtube.com/watch?v=L9qo2XZiQ4Y&t=194s&ab_channel=Prof.JeanFan" target="_blank" className="button">Read Manuscript</a>
      </section>

      <section className="about" id="about">
        <h3>About</h3>
        <p>Our Cold Ischemia Kidney App is an interactive tool designed to make cutting-edge spatial transcriptomics data accessible and explorable. Focused on cold ischemia injury—a common complication during kidney transplant preservation—the app allows users to investigate gene expression changes across distinct kidney compartments: the <strong>cortex</strong>, <strong>outer medulla</strong>, and <strong>inner medulla</strong>.

          Each of these regions plays a unique biological role. The cortex contains proximal convoluted tubules vital for reabsorbing nutrients and water. The interface region includes thick ascending limbs involved in salt and water balance. The inner medulla is composed largely of collecting ducts responsible for urine concentration.

          Our analysis revealed that these compartments respond differently to cold ischemia over time. Most notably, the inner medulla exhibited unexpected activation of oxidative phosphorylation, despite limited oxygen—a sign of potential metabolic reprogramming. Additionally, we observed widespread oxidative stress and immune responses across all compartments, mimicking a viral-like response.

          To generate the data driving the application, we used spatial transcriptomics to capture gene expression in mouse kidneys at various timepoints (0, 12, 24, and 48 hours). We then applied gene enrichment analysis and linear regression modeling to identify the most responsive genes in each compartment. Genes with the highest expression changes (top 10% slope values) were selected. These compartment- and direction-specific gene lists (upregulated, downregulated, global) form the foundation of each visualization in the app.

          Whether you're a clinician, researcher, or student, the Cold Ischemia Kidney App offers a clear, compartment-specific view into how kidney tissues respond to injury over time—helping translate complex datasets into actionable insights for science and medicine.</p>
      </section>

      <section className="tutorial" id="tutorial">
        <h3>Tutorial</h3>
        <p>Watch the tutorial below to learn how to interact with our data.</p>
        <div className="video-wrapper">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/PND06H7RCAw?si=tbb1qlqKaYa6xDgH" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
        </div>
      </section>

      <section className="apps" id="apps">
        <h3>Explore the Web Apps</h3>
        <div className="grid">
          {links.map(({ path, label, image }) => (
            <Link to={path} className="app-card" style={{ backgroundImage: `url(${image})` }} key={path}>
              <span>{label}</span>
            </Link>
          ))}
          
        </div>
      </section>

      <section className="github" id="github">
        <h3>GitHub Repository</h3>
        <p>View the source code, data, and tools used in this project.</p>
        <a href="https://github.com/JEFworks-Lab/vitessce-cold-ischemia" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-github"></i> GitHub
        </a>
      </section>

      <footer className="page-footer">
        <p>&copy; JEFworks-Lab 2025</p>
        <p>
          Web development by <a href="https://dvelazq.github.io/">Dee Velazquez</a>, using <a href="https://vitessce.io/">Vitessce</a>
        </p>
        <p>
          Kidney Icon by <a href="https://www.flaticon.com/free-icons/kidney">Kerismaker - Flaticon</a>
        </p>
      </footer>
    </>
  );
}