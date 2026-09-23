const https = require('https');
const fs = require('fs');

const urls = [
  'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1589712760237-4d92415d78a8?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1518420377038-f86a7d519bd7?auto=format&fit=crop&q=80&w=800'
];

urls.forEach(url => {
  https.get(url, (res) => {
    console.log(`${res.statusCode} - ${url}`);
  }).on('error', (e) => {
    console.error(e);
  });
});
