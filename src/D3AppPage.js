import React from 'react';

export default function D3AppPage() {
  const publicUrl = process.env.PUBLIC_URL || '';
  const baseUrl = publicUrl
    ? new URL(publicUrl, window.location.origin).pathname.replace(/\/$/, '')
    : '';
  const iframeSrc = `${baseUrl}/d3_app.html`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      <iframe
        title="Cold Ischemia D3 App"
        src={iframeSrc}
        style={{ border: 'none', width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  );
}
