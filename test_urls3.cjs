const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1473445761569-8a58f447a1c8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1549488344-c6e736a43d9c?auto=format&fit=crop&q=80&w=800'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${res.statusCode} - ${url}`);
  }).on('error', (e) => {
    console.error(e);
  });
});
