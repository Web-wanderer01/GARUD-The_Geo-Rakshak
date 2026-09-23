const fs = require('fs');
let content = fs.readFileSync('src/pages/DisasterDemoPage.jsx', 'utf8');

content = content.replace(
`  useEffect(() => {
    return (
    <div className="page-enter max-w-7xl mx-auto p-4 md:p-8 space-y-6">`,
`  useEffect(() => {
    return () => {
      stopSiren();
    };
  }, []);

  return (
    <div className="page-enter max-w-7xl mx-auto p-4 md:p-8 space-y-6">`
);

fs.writeFileSync('src/pages/DisasterDemoPage.jsx', content);
