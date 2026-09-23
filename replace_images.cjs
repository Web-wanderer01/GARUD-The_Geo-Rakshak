const fs = require('fs');
let content = fs.readFileSync('src/components/analytics/MultiParameterFramework.jsx', 'utf8');

content = content.replace('https://loremflickr.com/800/400/monsoon,rain/all', 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=800'); // rain
content = content.replace('https://loremflickr.com/800/400/mud,soil/all', 'https://images.unsplash.com/photo-1589712760237-4d92415d78a8?auto=format&fit=crop&q=80&w=800'); // mud / soil
content = content.replace('https://loremflickr.com/800/400/mountain,steep/all', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800'); // mountains
content = content.replace('https://loremflickr.com/800/400/river,erosion/all', 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&q=80&w=800'); // river
content = content.replace('https://loremflickr.com/800/400/flood,stream/all', 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&q=80&w=800'); // flood
content = content.replace('https://loremflickr.com/800/400/earthquake,damage/all', 'https://images.unsplash.com/photo-1518420377038-f86a7d519bd7?auto=format&fit=crop&q=80&w=800'); // cracked earth

fs.writeFileSync('src/components/analytics/MultiParameterFramework.jsx', content);
