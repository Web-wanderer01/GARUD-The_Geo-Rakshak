import { useMap } from 'react-leaflet';
import { useEffect } from 'react';

export default function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom(), {
        animate: true,
        duration: 1
      });
    }
  }, [center, zoom, map]);
  return null;
}
