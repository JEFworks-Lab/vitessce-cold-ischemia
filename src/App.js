import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from 'react-router-dom';

import LandingPage from './LandingPage';
import VitessceViewer from './VitessceViewer';

import { myViewConfigCU as cortexUp } from './my-view-config-cortex-up';
import { myViewConfigCD as cortexDown } from './my-view-config-cortex-down';
import { myViewConfigIMU as innerMedullaUp } from './my-view-config-inner-medulla-up';
import { myViewConfigIMD as innerMedullaDown } from './my-view-config-inner-medulla-down';
import { myViewConfigOMU as outerMedullaUp } from './my-view-config-outer-medulla-up';
import { myViewConfigOMD as outerMedullaDown } from './my-view-config-outer-medulla-down';

const isProduction = process.env.NODE_ENV === 'production';

export default function App() {
  return (
    <Router basename={isProduction ? "/vitessce-cold-ischemia" : "/"}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/cortex-up" element={<VitessceViewer config={cortexUp} />} />
        <Route path="/cortex-down" element={<VitessceViewer config={cortexDown} />} />
        <Route path="/inner-medulla-up" element={<VitessceViewer config={innerMedullaUp} />} />
        <Route path="/inner-medulla-down" element={<VitessceViewer config={innerMedullaDown} />} />
        <Route path="/outer-medulla-up" element={<VitessceViewer config={outerMedullaUp} />} />
        <Route path="/outer-medulla-down" element={<VitessceViewer config={outerMedullaDown} />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
}
