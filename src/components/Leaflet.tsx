import React, { useRef, useEffect } from 'react';
import { WebView } from 'react-native-webview';

type LeafletMapProps = {
  users: any[];
};

export default function LeafletMap({ users }: LeafletMapProps) {
  const webviewRef = useRef<WebView>(null);

  // HTML with Leaflet that we’ll load in the WebView
  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Leaflet Map</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
    />
    <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
    <style>
      html, body { margin: 0; padding: 0; height: 100%; }
      #map { width: 100%; height: 100%; }
      .leaflet-popup-content {
        font-size: 14px;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <script>
      // Initialize the map
      var map = L.map('map').setView([14.5995, 120.9842], 12); // Center on Metro Manila
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Helper to pick color based on status
      function getColor(status) {
        switch (status) {
          case 'critical': return 'red';
          case 'warning':  return 'orange';
          case 'safe':     return 'green';
          default:         return 'blue'; // fallback color
        }
      }

      // Listen for messages from React Native
      document.addEventListener('message', function (event) {
        // Clear existing layers each time if you want to refresh
        // If you have a separate layerGroup, you can clear it here.
        
        // Parse data
        var data = JSON.parse(event.data);
        var users = data.users || [];

        // Plot markers for each user
        users.forEach(function (user) {
          if (
            user.geolocation &&
            user.geolocation.latitude &&
            user.geolocation.longitude
          ) {
            var color = getColor(user.status);
            L.circleMarker(
              [user.geolocation.latitude, user.geolocation.longitude],
              {
                color: color,
                fillColor: color,
                fillOpacity: 0.8,
                radius: 10,
              }
            )
              .addTo(map)
              .bindPopup(
                "<b>" +
                  (user.username || user.id) +
                  "</b><br/>Status: " +
                  user.status
              );
          }
        });
      });
    </script>
  </body>
  </html>
  `;

  // Whenever `users` changes, send them to the WebView
  useEffect(() => {
    if (webviewRef.current && users) {
      // Force data into a fully JSON-serializable form
      const safeUsers = JSON.parse(JSON.stringify(users));
  
      // Now post the safe version
      webviewRef.current.postMessage(JSON.stringify({ users: safeUsers }));
    }
  }, [users]);

  return (
    <WebView
      ref={webviewRef}
      source={{ html: htmlContent }}
      style={{ flex: 1 }}
      // Optional: to debug, you can use onMessage or set javaScriptEnabled={true}
      // onMessage={(event) => console.log(event.nativeEvent.data)}
      javaScriptEnabled={true}
      originWhitelist={['*']}
    />
  );
}
