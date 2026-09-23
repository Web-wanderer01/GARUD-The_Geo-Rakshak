const fs = require('fs');
const file = 'src/components/alerts/SubscribeAlerts.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldForm = `export default function SubscribeAlerts() {
  const [status, setStatus] = useState('idle');

  const handleSubscribe = (e) => {
    e.preventDefault();
    setStatus('loading');
    // Simulate API call for subscription
    setTimeout(() => setStatus('success'), 1500);
  };`;

const newForm = `export default function SubscribeAlerts() {
  const [status, setStatus] = useState('idle');
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', district: '', role: 'Citizen'
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    setStatus('loading');
    
    // Read existing database
    const existingStr = localStorage.getItem('garud_citizens');
    const existing = existingStr ? JSON.parse(existingStr) : [];
    
    // Add new user
    const newUser = {
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      district: formData.district,
      role: formData.role,
      status: 'Verified'
    };
    
    const updated = [newUser, ...existing];
    
    // Save to citizen portal database
    localStorage.setItem('garud_citizens', JSON.stringify(updated));

    // Simulate network delay for UX
    setTimeout(() => setStatus('success'), 1000);
  };`;
content = content.replace(oldForm, newForm);

// Now update all inputs to bind to formData

const oldInput1 = `<input required type="text" placeholder="Full Name" className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm" />`;
const newInput1 = `<input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm" />`;
content = content.replace(oldInput1, newInput1);

const oldInput2 = `<input required type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm" />`;
const newInput2 = `<input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email Address" className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm" />`;
content = content.replace(oldInput2, newInput2);

const oldInput3 = `<input required type="tel" placeholder="+91 Mobile Number" pattern="[+0-9]{10,13}" title="Enter a valid 10-digit Indian mobile number" className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm" />`;
const newInput3 = `<input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 Mobile Number" pattern="[+0-9]{10,13}" title="Enter a valid 10-digit Indian mobile number" className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm" />`;
content = content.replace(oldInput3, newInput3);

const oldSelect1 = `<select required className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm appearance-none bg-white">
                <option value="" disabled selected>Select State...</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>`;
const newSelect1 = `<select required value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm appearance-none bg-white">
                <option value="" disabled>Select State...</option>
                {states.map(s => <option key={s} value={s}>{s}</option>)}
              </select>`;
content = content.replace(oldSelect1, newSelect1);

const oldSelect2 = `<select required className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm appearance-none bg-white">
                <option value="Citizen" selected>Citizen</option>
                <option value="Field Officer">Field Officer</option>
                <option value="NDRF Personnel">NDRF Personnel</option>
                <option value="Medical Staff">Medical Staff</option>
                <option value="Government Official">Government Official</option>
              </select>`;
const newSelect2 = `<select required value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full pl-10 pr-4 py-3 rounded text-slate-900 border-none focus:ring-2 focus:ring-gov-saffron outline-none text-sm appearance-none bg-white">
                <option value="Citizen">Citizen</option>
                <option value="Field Officer">Field Officer</option>
                <option value="NDRF Personnel">NDRF Personnel</option>
                <option value="Medical Staff">Medical Staff</option>
                <option value="Government Official">Government Official</option>
              </select>`;
content = content.replace(oldSelect2, newSelect2);

fs.writeFileSync(file, content);
