const fs = require('fs');
const file = 'src/components/alerts/SubscribeAlerts.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldStates = `const states = [
    'Assam', 'Meghalaya', 'Manipur', 'Mizoram', 
    'Nagaland', 'Tripura', 'Arunachal Pradesh', 'Sikkim'
  ];`;

const newStates = `const states = [
    'Dima Hasao, Assam', 'Cachar, Assam', 'Kamrup, Assam', 'Dibrugarh, Assam',
    'East Khasi Hills, Meghalaya', 'West Garo Hills, Meghalaya', 'Cherrapunji, Meghalaya',
    'Imphal, Manipur', 'Churachandpur, Manipur', 'Ukhrul, Manipur',
    'Aizawl, Mizoram', 'Lunglei, Mizoram', 'Champhai, Mizoram',
    'Kohima, Nagaland', 'Dimapur, Nagaland', 'Mokokchung, Nagaland',
    'Agartala, Tripura', 'North Tripura, Tripura', 'South Tripura, Tripura',
    'Tawang, Arunachal Pradesh', 'Itanagar, Arunachal Pradesh', 'Ziro, Arunachal Pradesh',
    'Gangtok, Sikkim', 'Namchi, Sikkim', 'Mangan, Sikkim'
  ];`;

content = content.replace(oldStates, newStates);

const oldLabel = `Select State...`;
const newLabel = `Select District/State...`;
content = content.replaceAll(oldLabel, newLabel);

fs.writeFileSync(file, content);
