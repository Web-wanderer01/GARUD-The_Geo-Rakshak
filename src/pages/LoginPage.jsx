import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, User, ArrowRight, Loader2, KeyRound } from 'lucide-react';
import FadeIn from '../components/common/FadeIn';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState('password');

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-[calc(100vh-140px)] flex">
      {/* Left Panel - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gov-900 via-transparent to-transparent" />
        
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <Shield className="w-12 h-12 text-blue-400 mb-6" />
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4">GARUD Command Center</h2>
            <p className="text-lg text-blue-200 max-w-md leading-relaxed">
              Secure portal for disaster management officials, field personnel, and meteorological experts.
            </p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-6 bg-white/5 p-4 rounded-r-lg backdrop-blur-sm shadow-xl">
            <p className="text-blue-100 text-sm italic">
              "Providing actionable intelligence for proactive disaster response in the North Eastern Region."
            </p>
            <p className="text-white font-medium mt-2 text-sm">— NDMA Central Command</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 bg-white relative">
        <div className="absolute top-4 right-4 flex items-center gap-2 text-xs font-bold text-slate-400">
          <Shield className="w-4 h-4 text-green-500" /> Secure SSL Connection
        </div>

        <div className="w-full max-w-md">
          <FadeIn direction="up">
            <div className="text-center lg:text-left mb-8">
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Official Sign In</h3>
              <p className="text-slate-700 mt-2 font-medium">Authentication required to access the GARUD Operations Network.</p>
            </div>

            {/* Login Type Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-xl mb-6 shadow-inner">
              <button 
                type="button"
                onClick={() => setLoginType('password')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'password' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-700 hover:text-slate-700'}`}
              >
                Gov ID & Password
              </button>
              <button 
                type="button"
                onClick={() => setLoginType('otp')}
                className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${loginType === 'otp' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-700 hover:text-slate-700'}`}
              >
                Mobile OTP
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              {loginType === 'password' ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Gov ID / Username</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-700 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <input 
                        type="text" 
                        required
                        className="block w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-gov-600/10 focus:border-gov-600 bg-slate-50 focus:bg-white transition-all outline-none font-medium" 
                        placeholder="Enter GARUD ID" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                      <a href="#" className="text-xs font-bold text-blue-700 hover:text-slate-900 transition-colors">Forgot password?</a>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-700 transition-colors">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input 
                        type="password" 
                        required
                        className="block w-full pl-10 pr-3 py-3 border-2 border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-gov-600/10 focus:border-gov-600 bg-slate-50 focus:bg-white transition-all outline-none font-medium" 
                        placeholder="••••••••" 
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Registered Mobile Number</label>
                    <div className="relative group flex">
                      <div className="flex items-center justify-center px-4 bg-slate-100 border-2 border-slate-200 border-r-0 rounded-l-xl text-slate-700 font-bold">
                        +91
                      </div>
                      <input 
                        type="tel" 
                        required
                        pattern="[0-9]{10}"
                        className="block w-full px-4 py-3 border-2 border-slate-200 rounded-r-xl text-sm focus:ring-4 focus:ring-gov-600/10 focus:border-gov-600 bg-slate-50 focus:bg-white transition-all outline-none font-medium" 
                        placeholder="10-digit mobile number" 
                      />
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1">OTP will be sent to your official CUG number.</p>
                  </div>
                </>
              )}
              
              <div className="flex items-center pt-2">
                <input id="remember-me" type="checkbox" className="w-4 h-4 rounded border-slate-300 text-blue-700 focus:ring-gov-600 cursor-pointer" />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-slate-700 cursor-pointer">
                  Remember this device (30 days)
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-slate-100 text-white rounded-xl text-sm font-bold hover:bg-slate-50 focus:ring-4 focus:ring-gov-700/30 transition-all active:scale-[0.98] disabled:opacity-70 shadow-lg shadow-gov-700/20 mt-6"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>{loginType === 'password' ? 'Secure Sign In' : 'Request OTP'} <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-700 font-bold">OR</span>
                </div>
              </div>
              <button type="button" className="mt-6 w-full flex items-center justify-center gap-3 py-3 px-4 bg-white text-slate-900 border-2 border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm active:scale-[0.98]">
                <KeyRound className="w-5 h-5 text-indigo-600" />
                Login with Parichay (Gov-SSO)
              </button>
            </div>

            <p className="mt-8 text-center text-sm font-medium text-slate-700">
              New official?{' '}
              <Link to="/signup" className="font-bold text-blue-700 hover:text-slate-900 hover:underline transition-all">
                Request Access via Nodal Officer
              </Link>
            </p>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
