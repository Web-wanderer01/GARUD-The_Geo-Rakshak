export function lon2tile(lon, zoom) {
  return Math.floor((lon + 180) / 360 * Math.pow(2, zoom));
}

export function lat2tile(lat, zoom) {
  return Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom));
}

export function tile2lon(x, z) {
  return (x / Math.pow(2, z) * 360 - 180);
}

export function tile2lat(y, z) {
  const n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  return (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));
}

export async function fetchDEMTile(lat, lon, zoom = 11) {
  const x = lon2tile(lon, zoom);
  const y = lat2tile(lat, zoom);
  const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${zoom}/${x}/${y}.png`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0);
      const imgData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imgData.data;

      const elevations = new Float32Array(img.width * img.height);
      let minElevation = Infinity;
      let maxElevation = -Infinity;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const elevation = (r * 256 + g + b / 256) - 32768;
        
        const idx = i / 4;
        elevations[idx] = elevation;
        if (elevation < minElevation) minElevation = elevation;
        if (elevation > maxElevation) maxElevation = elevation;
      }

      resolve({
        elevations,
        width: img.width,
        height: img.height,
        minElevation,
        maxElevation,
        bounds: {
          north: tile2lat(y, zoom),
          south: tile2lat(y + 1, zoom),
          west: tile2lon(x, zoom),
          east: tile2lon(x + 1, zoom)
        },
        tileX: x,
        tileY: y,
        tileZ: zoom
      });
    };
    img.onerror = () => reject(new Error('Failed to load DEM tile'));
    img.src = url;
  });
}

export function getSatelliteTileUrl(lat, lon, zoom = 11) {
  const x = lon2tile(lon, zoom);
  const y = lat2tile(lat, zoom);
  return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${y}/${x}`;
}
