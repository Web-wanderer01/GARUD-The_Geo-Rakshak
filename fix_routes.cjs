const fs = require('fs');
const file = 'src/App.jsx';
let content = fs.readFileSync(file, 'utf8');

// Add missing imports
content = content.replace(
  /import CitizenDatabasePage from '\.\/pages\/CitizenDatabasePage';/,
  `import CitizenDatabasePage from './pages/CitizenDatabasePage';
import AlertsPage from './pages/AlertsPage';
import ReportingPage from './pages/ReportingPage';
import SafetyGuidelinesPage from './pages/SafetyGuidelinesPage';`
);

// Add missing routes
const oldRoutes = `<Route path="/database"  element={<Wrap><CitizenDatabasePage /></Wrap>} />
          <Route path="/about"     element={<Wrap><AboutPage /></Wrap>} />`;

const newRoutes = `<Route path="/database"  element={<Wrap><CitizenDatabasePage /></Wrap>} />
          <Route path="/alerts"    element={<Wrap><AlertsPage /></Wrap>} />
          <Route path="/reporting" element={<Wrap><ReportingPage /></Wrap>} />
          <Route path="/safety"    element={<Wrap><SafetyGuidelinesPage /></Wrap>} />
          <Route path="/about"     element={<Wrap><AboutPage /></Wrap>} />`;

content = content.replace(oldRoutes, newRoutes);
fs.writeFileSync(file, content);
