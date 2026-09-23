const fs = require('fs');
let content = fs.readFileSync('src/pages/DisasterDemoPage.jsx', 'utf8');

// A very basic React JSX bracket counter is not completely reliable, but let's check basic JSX tags.
let openTags = content.match(/<[a-zA-Z0-9]+[^>]*>/g) || [];
let closeTags = content.match(/<\/[a-zA-Z0-9]+>/g) || [];
console.log('Open tags approx:', openTags.length, 'Close tags approx:', closeTags.length);

// Let's just find the mismatch by looking at the diff or inspecting the JSX tree manually.
