import React, { useState } from 'react';
import { MapPin, Upload, Camera, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import useOnlineStatus from '../../hooks/useOnlineStatus';

export default function ReportForm({ onSubmit }) {
  const isOnline = useOnlineStatus();
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    lat: '',
    lng: '',
    reporterName: '',
    contactNumber: '',
  });
  const [photoPreview, setPhotoPreview] = useState(null);
  const [geoStatus, setGeoStatus] = useState('idle'); // idle, loading, success, error
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, photo: file }));
    }
  };

  const getLocation = () => {
    setGeoStatus('loading');
    if (!navigator.geolocation) {
      setGeoStatus('error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData((prev) => ({
          ...prev,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        }));
        setGeoStatus('success');
      },
      (error) => {
        console.error("Geolocation error:", error);
        setGeoStatus('error');
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.category || !formData.description) return;
    
    // MOCK DATA submission
    onSubmit({
      ...formData,
      id: `rep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'Pending Review',
      photoUrl: photoPreview
    });

    setSubmitStatus('success');
    setTimeout(() => {
      setSubmitStatus(null);
      setFormData({
        category: '',
        description: '',
        lat: '',
        lng: '',
        reporterName: '',
        contactNumber: '',
      });
      setPhotoPreview(null);
      setGeoStatus('idle');
    }, 2000);
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-slate-200 relative overflow-hidden">
      {/* Success Animation Overlay */}
      {submitStatus === 'success' && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center transition-all duration-300 animate-[fadeIn_0.3s_ease-out]">
          <div className="transform scale-0 animate-[counterPop_0.5s_ease-out_forwards]">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">Report Submitted</h3>
          <p className="text-slate-500 mt-2 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">Thank you for your contribution.</p>
        </div>
      )}

      <h2 className="text-xl font-bold text-slate-800 mb-6">Submit Field Report</h2>
      
      {!isOnline && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            You are offline. This report will be queued and submitted when connectivity is restored.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category & Description */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Observation Details</h3>
          
          <div className="group">
            <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-blue-600 group-focus-within:font-semibold">Category <span className="text-red-500">*</span></label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full sm:text-sm p-3 input-animated"
            >
              <option value="">Select a category</option>
              <option value="Crack/Fissure">Crack/Fissure</option>
              <option value="Slope Movement">Slope Movement</option>
              <option value="Road Block">Road Block</option>
              <option value="Water Seepage">Water Seepage</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-blue-600 group-focus-within:font-semibold">Description <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              placeholder="Describe what you see (size, recent changes, impact)..."
              className="w-full sm:text-sm p-3 input-animated resize-none"
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Photo / Video</h3>
          <div className="flex items-center justify-center w-full">
            <label className="group flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-lg cursor-pointer bg-slate-50 transition-all duration-300 hover:bg-slate-100 hover:border-blue-500 hover:scale-[1.01] overflow-hidden relative">
              {photoPreview ? (
                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Camera className="w-8 h-8 mb-2 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  <p className="text-sm text-slate-500"><span className="font-semibold text-slate-700 group-hover:text-blue-600">Click to upload</span> or drag and drop</p>
                </div>
              )}
              <input type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Location</h3>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full space-y-2">
              <div className="flex gap-4">
                <div className="flex-1 group">
                  <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-blue-600 group-focus-within:font-semibold">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    name="lat"
                    value={formData.lat}
                    onChange={handleInputChange}
                    className="w-full sm:text-sm p-3 input-animated"
                  />
                </div>
                <div className="flex-1 group">
                  <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-blue-600 group-focus-within:font-semibold">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    name="lng"
                    value={formData.lng}
                    onChange={handleInputChange}
                    className="w-full sm:text-sm p-3 input-animated"
                  />
                </div>
              </div>
            </div>
            <div className="w-full sm:w-auto">
              <button
                type="button"
                onClick={getLocation}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-700 border border-slate-300 font-medium text-sm btn-interactive hover:bg-slate-200 hover:text-slate-900"
              >
                {geoStatus === 'loading' ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                {geoStatus === 'loading' ? 'Locating...' : 'Use My Location'}
              </button>
            </div>
          </div>
          {geoStatus === 'success' && <p className="text-xs text-green-600 animate-[fadeIn_0.3s_ease-out]">Location acquired successfully.</p>}
          {geoStatus === 'error' && <p className="text-xs text-red-600 animate-[fadeIn_0.3s_ease-out]">Could not acquire location. Please enter manually.</p>}
        </div>

        {/* Optional Contact */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">Contact Info (Optional)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-blue-600 group-focus-within:font-semibold">Name</label>
              <input
                type="text"
                name="reporterName"
                value={formData.reporterName}
                onChange={handleInputChange}
                className="w-full sm:text-sm p-3 input-animated"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-medium text-slate-700 mb-1 transition-colors group-focus-within:text-blue-600 group-focus-within:font-semibold">Phone Number</label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full sm:text-sm p-3 input-animated"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white hover:bg-blue-700 font-semibold text-base btn-interactive btn-ripple shadow-md"
        >
          <Upload className="w-5 h-5" />
          Submit Report
        </button>
      </form>
    </div>
  );
}
