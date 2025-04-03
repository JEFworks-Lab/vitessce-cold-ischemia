import React from 'react';
import { Vitessce } from 'vitessce';

export default function VitessceViewer({ config }) {
  return (
    <Vitessce
      config={config}
      theme="light"
    />
  );
}
