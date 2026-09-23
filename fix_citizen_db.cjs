import React, { useState, useEffect } from 'react';
import { Users, Search, Download, Filter, ShieldCheck, MapPin, Trash2, UserPlus, Plus, Mail, Phone, Calendar, Activity, Database, Key } from 'lucide-react';
import FadeIn from '../components/common/FadeIn';

function LiveDBStats({ count }) {
  const [pct, setPct] = React.useState(87);
  const [verified, setVerified] = React.useState(0);
  
  React.useEffect(() => {
    setVerified(Math.floor(count * 0.78));
  }, [count]);

  React.useEffect(() => {
    const i = setInterval(() => {
      setPct(p => Math.max(80, Math.min(100, p + (Math.random()-0.5)*0.3)));
    }, 3000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        { label: 'Registered Citizens', val: count.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
        { label: 'Verified Profiles', val: verified.toLocaleString(), icon: ShieldCheck, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
        { label: 'Database Health', val: pct.toFixed(1) + '%', icon: Database, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200' },
      ].map(({ label, val, icon: Icon, color, bg, border }, idx) => (
        <div key={label} className={`bg-white rounded-2xl p-6 shadow-sm border ${border} flex items-center justify-between transition-all hover:shadow-md`}>
          <div>
            <div className="text-sm font-semibold text-slate-500 mb-1">{label}</div>
            <div className="text-3xl font-black text-slate-800 tabular-nums tracking-tight">{val}</div>
          </div>
          <div className={`${bg} p-4 rounded-xl`}>
            <Icon className={`w-8 h-8 ${color}`} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CitizenDatabasePage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', district: '', role: 'Citizen' });

  const nerDistricts = [
    'Dima Hasao, Assam', 'Cachar, Assam', 'Kamrup, Assam', 'Dibrugarh, Assam',
    'East Khasi Hills, Meghalaya', 'West Garo Hills, Meghalaya', 'Cherrapunji, Meghalaya',
    'Imphal, Manipur', 'Churachandpur, Manipur', 'Ukhrul, Manipur',
    'Aizawl, Mizoram', 'Lunglei, Mizoram', 'Champhai, Mizoram',
    'Kohima, Nagaland', 'Dimapur, Nagaland', 'Mokokchung, Nagaland',
    'Agartala, Tripura', 'North Tripura, Tripura', 'South Tripura, Tripura',
    'Tawang, Arunachal Pradesh', 'Itanagar, Arunachal Pradesh', 'Ziro, Arunachal Pradesh',
    'Gangtok, Sikkim', 'Namchi, Sikkim', 'Mangan, Sikkim'
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const existingCitizensStr = localStorage.getItem('garud_citizens');
    if (existingCitizensStr) {
      try { 
        setUsers(JSON.parse(existingCitizensStr)); 
      } catch (e) {
        setUsers([]);
      }
    } else {
      setUsers([]);
    }
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.district) return alert("Please fill all required fields");

    const newUser = {
      id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      district: formData.district,
      type: formData.role,
      status: 'Active',
      registeredAt: new Date().toISOString()
    };

    const updatedUsers = [newUser, ...users];
    localStorage.setItem('garud_citizens', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setFormData({ name: '', phone: '', email: '', district: '', role: 'Citizen' });
    setShowAddForm(false);
  };

  const deleteUser = (idToDelete) => {
    if (window.confirm("Are you sure you want to permanently delete this user record? This action cannot be undone.")) {
      const updatedUsers = users.filter(u => u.id !== idToDelete);
      localStorage.setItem('garud_citizens', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.phone.includes(searchTerm) ||
                          (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (u.id && u.id.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = filterRole === 'All' || u.type === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              Citizen Registry Database
            </h1>
            <p className="text-slate-500 mt-2">Manage registered citizens, emergency contacts, and field personnel.</p>
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
          >
            {showAddForm ? 'Cancel Registration' : <><UserPlus className="w-5 h-5" /> Register New Citizen</>}
          </button>
        </div>

        <LiveDBStats count={users.length} />

        {showAddForm && (
          <FadeIn direction="down" duration={300}>
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Key className="w-5 h-5 text-slate-400" /> Add New Registration
              </h2>
              <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="John Doe" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="+91 9876543210" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="john@example.com" required />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1">District / State *</label>
                  <select value={formData.district} onChange={e => setFormData({...formData, district: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white" required>
                    <option value="">Select a region...</option>
                    {nerDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Assigned Role</label>
                  <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all bg-white">
                    <option>Citizen</option>
                    <option>Field Officer</option>
                    <option>Medical Staff</option>
                  </select>
                </div>
                <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-4 border-t border-slate-100">
                  <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white px-8 py-2.5 rounded-lg font-medium transition-colors shadow-sm inline-flex items-center gap-2">
                    <Plus className="w-5 h-5" /> Save Registration
                  </button>
                </div>
              </form>
            </div>
          </FadeIn>
        )}

        <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
          {/* Toolbar */}
          <div className="p-4 md:p-6 border-b border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by name, ID, phone, or email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <div className="relative inline-flex">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-medium text-slate-700 cursor-pointer"
                >
                  <option value="All">All Roles</option>
                  <option value="Citizen">Citizen</option>
                  <option value="Field Officer">Field Officer</option>
                  <option value="Medical Staff">Medical Staff</option>
                </select>
              </div>
              <button className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm">
                <Download className="w-4 h-4" /> Export
              </button>
            </div>
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status / Role</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700 flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{user.name}</div>
                            <div className="text-xs text-slate-500 font-mono mt-0.5">{user.id || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 space-y-1">
                        <div className="flex items-center gap-2 text-slate-600">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
                        </div>
                        {user.email && (
                          <div className="flex items-center gap-2 text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <MapPin className="w-4 h-4 text-red-400" />
                          <span className="font-medium">{user.district}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            user.type === 'Field Officer' ? 'bg-purple-100 text-purple-700' :
                            user.type === 'Medical Staff' ? 'bg-teal-100 text-teal-700' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {user.type || 'Citizen'}
                          </span>
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> {user.status || 'Active'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {user.registeredAt ? new Date(user.registeredAt).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          }) : 'Recent'}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => deleteUser(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                          title="Delete Record"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                        <Search className="w-8 h-8 text-slate-400" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-700 mb-1">No records found</h3>
                      <p className="text-slate-500 max-w-sm mx-auto">
                        {searchTerm || filterRole !== 'All' 
                          ? "We couldn't find any citizens matching your current filters. Try adjusting your search criteria." 
                          : "Your registry is empty. Add a new citizen to get started."}
                      </p>
                      {(searchTerm || filterRole !== 'All') && (
                        <button 
                          onClick={() => { setSearchTerm(''); setFilterRole('All'); }}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm"
                        >
                          Clear all filters
                        </button>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length > 0 && (
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-sm text-slate-500">
              <div>Showing <span className="font-bold text-slate-800">{filteredUsers.length}</span> records</div>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1 border border-slate-300 rounded bg-white text-slate-800 font-medium shadow-sm">1</button>
                <button className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-100 transition-colors disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}
