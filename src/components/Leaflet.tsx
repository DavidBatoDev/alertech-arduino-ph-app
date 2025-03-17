// LeafletMap.tsx
import React from 'react';
import { WebView } from 'react-native-webview';

export default function LeafletMap() {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="initial-scale=1, maximum-scale=1">
        <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
        <style>
          #map { height: 100%; width: 100%; }
          html, body { height: 100%; margin: 0; padding: 0; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
        <script>
          var map = L.map('map').setView([14.5995, 120.9842], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
          }).addTo(map);
          // Optionally, add more Leaflet code (like markers) here.
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
    />
  );
}
