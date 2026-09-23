const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/MultiParameterFramework.jsx', 'utf8');

const regexUrls = [
  /imgUrl="https:\/\/images\.unsplash\.com\/photo-1515694346937[^"]+"/,
  /imgUrl="https:\/\/images\.unsplash\.com\/photo-1589712760237[^"]+"/,
  /imgUrl="https:\/\/images\.unsplash\.com\/photo-1464822759023[^"]+"/,
  /imgUrl="https:\/\/images\.unsplash\.com\/photo-1437482078695[^"]+"/,
  /imgUrl="https:\/\/images\.unsplash\.com\/photo-1547683905[^"]+"/,
  /imgUrl="https:\/\/images\.unsplash\.com\/photo-1518420377038[^"]+"/
];

const newUrls = [
  'imgUrl="https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800"',
  'imgUrl="https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&q=80&w=800"',
  'imgUrl="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800"',
  'imgUrl="https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800"',
  'imgUrl="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800"',
  'imgUrl="https://images.unsplash.com/photo-1508215885820-4585e56135c8?auto=format&fit=crop&q=80&w=800"'
];

for(let i=0; i<6; i++) {
  content = content.replace(regexUrls[i], newUrls[i]);
}

fs.writeFileSync('src/components/analytics/MultiParameterFramework.jsx', content);
