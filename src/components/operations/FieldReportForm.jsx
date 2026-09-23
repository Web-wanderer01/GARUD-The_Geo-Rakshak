import React, { useState } from 'react';
import { Camera, MapPin, Send, CheckCircle2, WifiOff } from 'lucide-react';
import { saveOfflineReport } from '../../lib/db';
import useOnlineStatus from '../../hooks/useOnlineStatus';

export default function FieldReportForm({ onAddReport }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [location, setLocation] = useState('Fetching GPS...');
  const [photo, setPhoto] = useState(null);
  const isOnline = useOnlineStatus();

  const handleGPS = () => {
    setLocation('Lat: 26.14, Lng: 91.73 (Accuracy: 12m)');
  };

  const handlePhoto = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPhoto(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Extract form data
    const formData = new FormData(e.target);
    const role = formData.get('role');
    const type = formData.get('type');
    const notes = formData.get('notes');
    
    // Create a new report object formatted like the mock data
    const newReport = {
      id: `REP-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      submitterRole: role,
      incidentType: type,
      location: { lat: 26.14, lng: 91.73 },
      notes: notes,
      status: 'Pending Review',
      imageUrl: photo
    };
    
    if (isOnline) {
      if (onAddReport) {
        onAddReport(newReport);
      }
    } else {
      await saveOfflineReport(newReport);
    }
    
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setPhoto(null);
      setLocation('Fetching GPS...');
      e.target.reset();
    }, 4000);
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 flex flex-col items-center justify-center h-full text-center">
        {isOnline ? (
          <>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Report Submitted</h3>
            <p className="text-slate-500 mt-2">Your field report has been sent to district authorities.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <WifiOff className="w-8 h-8 text-amber-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-800">Saved Offline</h3>
            <p className="text-slate-500 mt-2">No internet connection. Report queued securely on device and will sync automatically.</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-bold text-slate-800 mb-6">Submit Field Report</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Submitter Role</label>
          <select name="role" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Role...</option>
            <option value="Field Officer / NDRF">Field Officer / NDRF</option>
            <option value="PWD Staff">PWD Staff</option>
            <option value="Local Citizen">Local Citizen</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Incident Type</label>
          <select name="type" required className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Select Incident...</option>
            <option value="Road Blockage / Landslide">Road Blockage / Landslide</option>
            <option value="Bridge Damage / Flooding">Bridge Damage / Flooding</option>
            <option value="Severe Traffic Delay">Severe Traffic Delay</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Location Coordinates</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              value={location} 
              readOnly 
              className="flex-1 bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600"
            />
            <button 
              type="button" 
              onClick={handleGPS}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-2 rounded-lg transition-colors"
            >
              <MapPin className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Photo/Video Evidence</label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative overflow-hidden">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handlePhoto} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            {photo ? (
              <img src={photo} alt="Preview" className="h-32 mx-auto object-cover rounded" />
            ) : (
              <div className="flex flex-col items-center pointer-events-none">
                <Camera className="w-8 h-8 text-slate-400 mb-2" />
                <span className="text-sm text-slate-500">Tap to capture or upload</span>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-1">Field Notes</label>
          <textarea 
            name="notes"
            required 
            rows="3" 
            placeholder="Describe the situation..." 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <button 
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
          <Send className="w-5 h-5" />
          Submit Geotagged Report
        </button>
      </form>
    </div>
  );
}
