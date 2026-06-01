import React from 'react';
import './LandingPage.css';
import { Link } from 'react-router-dom';

const links = [
  {
    path: "cold-ischemia-app",
    label: "Launch App",
    image: `${process.env.PUBLIC_URL}/kidney_gif.gif`
  }
];


export default function LandingPage() {
  return (
    <>
      <nav className="navbar">
        <a href="#abstract-authors">Abstract</a>
        <a href="#about">About</a>
        <a href="#tutorial">Tutorial</a>
        <a href="#apps">Interactive Web App</a>
        <a href="#github">GitHub</a>
      </nav>

      <header className="page-header">
        <h1>Spatiotemporal Transcriptomic Analysis During Cold Ischemic Injury to the Murine Kidney Reveals Compartment-Specific Changes
        </h1>
      </header>

      <section className="abstract-authors" id="abstract-authors">
        <p>
          <strong>Abstract:</strong> Kidney transplantation is the preferred treatment strategy for end-stage kidney disease. Deceased donor kidneys usually undergo cold storage until kidney transplantation, leading to cold ischemia injury that may contribute to poor graft outcomes. However, the molecular characterization of potential mechanisms of cold ischemia injury remains incomplete.
            To bridge this knowledge gap, we leveraged the 10x Visium spatial transcriptomic technology to perform full transcriptome profiling of murine kidneys subject to varying durations of cold ischemia typical in a deceased donor kidney transplant setting. We developed a computational workflow to identify and compare spatiotemporal transcriptomic changes that accompany the injury pathophysiology in a tissue compartment-specific manner. We identified proportional enrichment of oxidative phosphorylation (OXPHOS) genes with increasing duration of cold ischemia injury within the oxygen-lean inner medulla region, suggestive of atypical metabolic presentation. This was distinct in cold ischemia injury tissue compared to warm ischemia-reperfusion kidney injury tissue. Spatiotemporal trends were validated by qPCR and immunofluorescence in a larger cohort of mice. We provide an interactive online browser at <a href="https://jef.works/CellCarto-ColdIschemia/">https://jef.works/CellCarto-ColdIschemia/</a> to facilitate exploration of our results by the broader scientific and clinical community. Altogether, our spatiotemporal transcriptomic analysis identified coordinated molecular changes within metabolic pathways such as OXPHOS deep within the cold ischemic kidney, highlighting the need for increased attention to the inner medulla and potential opportunities for new insights beyond those available from superficial biopsy-focused tissue examinations.
          <br /><br />
          <strong>Authors:</strong> Srujan Singh, Shishir Kumar Patel, Ryo Matsuura, Dee Velazquez, Zhaoli Sun, Sanjeev Noel, Hamid Rabb, & Jean Fan 
          <br /><br />
        </p>
        <a href="https://www.biorxiv.org/content/10.1101/2025.05.25.654911v2" target="_blank" className="button">Read Manuscript</a>
      </section>

      <section className="about" id="about">
        <h3>About</h3>
        <p>Our Cold Ischemia Kidney App is an interactive tool designed to make cutting-edge spatial transcriptomics data accessible and explorable. Focused on cold ischemia injury—a common complication during kidney transplant preservation—the app allows users to investigate gene expression changes across distinct kidney compartments: the cortex, outer medulla, and inner medulla. 

        Each of these regions plays a unique biological role. The <strong>cortex</strong> contains proximal convoluted tubules vital for reabsorbing nutrients and water. The <strong>outer medulla</strong> region includes thick ascending limbs involved in salt and water balance. The <strong>inner medulla</strong> is composed largely of collecting ducts responsible for urine concentration. Our analysis revealed that these compartments respond 

        differently to cold ischemia over time. Most notably, the inner medulla exhibited unexpected activation of oxidative phosphorylation, despite limited oxygen—a sign of potential metabolic reprogramming. To generate the data driving the application, we used spatial transcriptomics to capture gene expression in mouse kidneys at various timepoints (0, 12, 24, and 48 hours). 

        We then applied gene enrichment analysis and linear regression modeling to identify the most responsive genes in each compartment. Whether you're a clinician, researcher, or student, the Cold Ischemia Kidney App offers a clear, compartment-specific view into how kidney tissues respond to injury over time—helping translate complex datasets into actionable insights for science and medicine.</p>
      </section>

      <section className="tutorial" id="tutorial">
        <h3>Tutorial</h3>
        <p>Watch the tutorial below to learn how to interact with our data.</p>
        <div className="video-wrapper">
          <iframe width="560" height="315" src="https://www.youtube.com/embed/w4B--g5rDC8?si=HqY9Cep_UoWe8zFv" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
        </div>
      </section>

      <section className="apps" id="apps">
        <h3>Explore the Web App</h3>
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
        <p>&copy; JEFworks-Lab 2026</p>
        <p>
          Web development by <a href="https://dvelazq.github.io/">Dee Velazquez</a>
        </p>
        <p>
          Kidney Icon by <a href="https://www.flaticon.com/free-icons/kidney">Kerismaker - Flaticon</a>
        </p>
      </footer>
    </>
  );
}
