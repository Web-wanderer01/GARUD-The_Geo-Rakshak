const https = require('https');

const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Landslide_in_Cusco_Peru.jpg/800px-Landslide_in_Cusco_Peru.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Earthquake_damage.jpg/800px-Earthquake_damage.jpg',
  'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800', // mud/soil
  'https://images.unsplash.com/photo-1522030999554-15b57f0cc0db?auto=format&fit=crop&q=80&w=800'  // earthquake/cracked
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${res.statusCode} - ${url}`);
  }).on('error', (e) => {
    console.error(e);
  });
});
