import React, { useState, useEffect } from 'react';
import { Shield, Lock, Fingerprint, Scan, AlertTriangle } from 'lucide-react';

export default function SecureGateway({ onAccessGranted }) {
  const [step, setStep] = useState(0); // 0: Idle, 1: Scanning, 2: Granted, 3: Error
  const [accessCode, setAccessCode] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (accessCode.trim() === '') return;
    
    setStep(1);
    
    // Simulate complex authentication process
    setTimeout(() => {
      if (accessCode.toLowerCase() === 'admin' || accessCode === '1234') {
        setStep(2);
        setTimeout(() => {
          onAccessGranted();
        }, 1500);
      } else {
        setStep(3);
        setTimeout(() => setStep(0), 2000);
      }
    }, 2000);
  };

  const handleGuestAccess = () => {
    setStep(1);
    setTimeout(() => {
      setStep(2);
      setTimeout(() => {
        onAccessGranted();
      }, 1500);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex items-center justify-center overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>
      
      {/* Radar sweep effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-blue-500/10 rounded-full opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-blue-500/20 rounded-full opacity-50"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-blue-500/30 rounded-full opacity-50"></div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
          
          {/* Top scanning line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse"></div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-xl mb-4 relative">
              {step === 1 ? (
                <Scan className="w-8 h-8 text-blue-400 animate-spin-slow" />
              ) : step === 2 ? (
                <Shield className="w-8 h-8 text-green-400" />
              ) : step === 3 ? (
                <AlertTriangle className="w-8 h-8 text-red-500" />
              ) : (
                <Lock className="w-8 h-8 text-blue-500" />
              )}
            </div>
            <h1 className="text-2xl font-black text-white tracking-wider">GARUD SYSTEM</h1>
            <p className="text-slate-400 text-xs uppercase tracking-widest mt-2 font-mono">Restricted Government Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <div className="relative">
                <input
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  disabled={step !== 0}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-center text-white font-mono tracking-[0.5em] focus:outline-none focus:border-blue-500 transition-colors disabled:opacity-50"
                  placeholder="••••••••"
                />
                <Fingerprint className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              </div>
              
              {step === 0 && <p className="text-[10px] text-slate-500 text-center mt-3 font-mono">Awaiting Clearance Code (Try 'admin')</p>}
              {step === 1 && <p className="text-[10px] text-blue-400 text-center mt-3 font-mono animate-pulse">Authenticating Handshake...</p>}
              {step === 2 && <p className="text-[10px] text-green-400 text-center mt-3 font-mono">Access Granted. Decrypting Feed...</p>}
              {step === 3 && <p className="text-[10px] text-red-500 text-center mt-3 font-mono">Security Breach Detected. Access Denied.</p>}
            </div>

            <button
              type="submit"
              disabled={step !== 0 || accessCode.trim() === ''}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              INITIALIZE CONNECTION
            </button>
            
            <button
              type="button"
              onClick={handleGuestAccess}
              disabled={step !== 0}
              className="w-full bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 text-xs"
            >
              BYPASS AS GUEST (DEMO MODE)
            </button>
          </form>
          
          <div className="mt-8 text-center border-t border-slate-800 pt-4">
             <p className="text-[9px] text-slate-600 font-mono">UNAUTHORIZED ACCESS IS STRICTLY PROHIBITED. <br/>ALL CONNECTIONS ARE LOGGED (IP: 192.168.1.104)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
