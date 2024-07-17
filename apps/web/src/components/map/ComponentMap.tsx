import { useEffect } from 'react';
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

      const map = new google.maps.Map(mapElement, {
        center: { lat: latitude, lng: longitude },
        zoom: 8,
        mapId: process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID,
      });

      const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        map: map,
        position: { lat: latitude, lng: longitude },
        title: 'Property Location',
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
