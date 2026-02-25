import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import LandingPage from './LandingPage';
import D3AppPage from './D3AppPage';

const publicUrl = process.env.PUBLIC_URL || '';
const normalizedPublicUrl = publicUrl
  ? new URL(publicUrl, window.location.origin).pathname.replace(/\/$/, '')
  : '';
const appBasename = normalizedPublicUrl || '/CellCarto-ColdIschemia';

export default function App() {
  return (
    <Router basename={appBasename}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="cold-ischemia-app" element={<D3AppPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
