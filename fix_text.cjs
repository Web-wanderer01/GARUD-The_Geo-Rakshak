const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', 'utf8');

content = content.replace(
  'h-8">Real-time severe cloud cover and extreme localized rainfall tracking.</p>',
  'h-8">Live Meteorological Data stream showing localized precipitation intensity.</p>'
);

content = content.replace(
  'h-8">Ground-penetrating thermal imaging for subsurface water pooling.</p>',
  'h-8">Live Meteorological soil saturation data tracking sub-surface pooling.</p>'
);

fs.writeFileSync('src/components/analytics/SatellitePredictionsPanel.jsx', content);
