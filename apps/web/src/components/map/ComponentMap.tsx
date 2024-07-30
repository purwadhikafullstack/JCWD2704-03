import React, { useEffect } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
}

const MapComponent: React.FC<MapProps> = ({ latitude, longitude }) => {
  useEffect(() => {
    const initializeMap = () => {
      const mapElement = document.getElementById('map');
      if (!mapElement) {
        console.error('Map element not found');
        return;
      }

      // Define your custom map style with beige and blue colors
      const customMapStyle = [
        {
          elementType: 'geometry',
          stylers: [{ color: '#D7BBCB' }], // Beige background
        },
        {
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9B9B9B' }], // Text color
        },
        {
          elementType: 'labels.text.stroke',
          stylers: [{ color: '#ffffff' }], // Text stroke color
        },
        {
          featureType: 'administrative',
          elementType: 'geometry',
          stylers: [{ color: '#D7BBCB' }], // Administrative area color
        },
        {
          featureType: 'administrative.country',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9B9B9B' }], // Country labels color
        },
        {
          featureType: 'landscape',
          elementType: 'geometry',
          stylers: [{ color: '#FDEEEE' }], // General landscape color
        },
        {
          featureType: 'poi',
          elementType: 'geometry',
          stylers: [{ color: '#c5e1a5' }], // Points of interest color
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#4a90e2' }], // Water color
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{ color: '#ffffff' }], // Road color
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#000000' }], // Road labels color
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{ color: '#f2f2f2' }], // Transit color
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#000000' }], // Transit station labels color
        },
      ];

      const map = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 16,
        styles: customMapStyle, // Apply custom style here
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID, // Set the Map ID here
      });

      const markerHtml = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 256 256" enable-background="new 0 0 256 256" xml:space="preserve">
        <metadata> Svg Vector Icons : http://www.onlinewebfonts.com/icon </metadata>
        <g>
          <g>
            <path fill="currentColor" d="M128,135.4c-8.6,0-15.7,7-15.7,15.7v38.1h31.4v-38.1C143.7,142.4,136.6,135.4,128,135.4z"></path>
            <path fill="currentColor" d="M127.9,66.5c-2,0-3.9,0.7-5.3,2l-48.3,44.9v56.4c0,4.3,2.5,9.7,6,13.3c3.5,3.5,9,6,13.3,6h10.6v-38.1c0-13.1,10.7-23.8,23.8-23.8c13.1,0,23.8,10.7,23.8,23.8v38.1h14.1l0,0c3.8,0,7.4-1.9,11.5-6c3.5-3.5,4.3-9.2,4.3-13.3v-56.3l-48.5-45C131.8,67.3,129.9,66.5,127.9,66.5z"></path>
            <path fill="currentColor" d="M128,10C62.8,10,10,62.8,10,128c0,65.2,52.8,118,118,118c65.2,0,118-52.8,118-118C246,62.8,193.2,10,128,10z M203.8,128.8c-0.8,0.8-1.8,1.3-2.9,1.3c-0.9,0-1.9-0.3-2.6-1l-8.5-7.9v48.8c0,5.6-1.2,13.5-6.6,19c-5.7,5.7-11.2,8.4-17.3,8.4l0,0h-14.1h-47.6H93.6c-6.5,0-13.9-3.3-19-8.4c-5.1-5.1-8.4-12.5-8.4-19V121l-8.5,7.9c-1.6,1.5-4,1.4-5.5-0.2c-1.5-1.6-1.4-4,0.2-5.5l64.9-60.4c2.8-2.6,6.6-4.1,10.6-4.1c4,0,7.8,1.5,10.6,4.1l65.2,60.4C205.2,124.7,205.3,127.2,203.8,128.8z"></path>
          </g>
        </g>
      </svg>
    `;

      // Create a div to hold the SVG content
      const markerDiv = document.createElement('div');
      markerDiv.style.width = '60px';
      markerDiv.style.height = '60px';
      markerDiv.innerHTML = markerHtml;

      new google.maps.marker.AdvancedMarkerElement({
        position: { lat: latitude, lng: longitude },
        map: map,
        title: 'Property Location',
        content: markerDiv,
        // Optionally set the size if necessary
      });
    };

    const loadScript = (url: string) => {
      const script = document.createElement('script');
      script.src = url;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = () => initializeMap();
      script.onerror = (error) => {
        console.error('Error loading Google Maps script:', error);
      };
    };

    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=maps,marker`,
    );
  }, [latitude, longitude]);

  return <div id="map" style={{ height: '500px', width: '100%' }}></div>;
};

export default MapComponent;
