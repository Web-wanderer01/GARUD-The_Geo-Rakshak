const fs = require('fs');

const signUpFile = 'src/pages/SignUpPage.jsx';
let content = fs.readFileSync(signUpFile, 'utf8');
content = content.replace(/Simulation Demo/g, "Virtual Simulations");
content = content.replace(/for the demo page/g, "for the virtual simulations page");
fs.writeFileSync(signUpFile, content);

const footerFile = 'src/components/layout/Footer.jsx';
let footerContent = fs.readFileSync(footerFile, 'utf8');
footerContent = footerContent.replace(/Interactive Demo/, "Virtual Simulations");
fs.writeFileSync(footerFile, footerContent);
