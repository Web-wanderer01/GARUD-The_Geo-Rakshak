import React from 'react';
import { Database, Languages, Server, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import FadeIn from '../common/FadeIn';

export default function GovDataIntegrationPanel() {
  return (
    <FadeIn delay={0.3}>
      <div className="mt-8 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-blue-100 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">GovTech API Integrations</h2>
            <p className="text-sm text-slate-500">Live data synchronization with national public infrastructure</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Data.gov.in Integration */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-2 bg-green-500 w-full"></div>
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
                  <Database className="w-6 h-6 text-green-600" />
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  Connected
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Open Government Data</h3>
              <a href="https://www.data.gov.in/" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mb-3 block">data.gov.in</a>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                Ingesting 10 years of historical landslide vulnerability catalogs and meteorological datasets for continuous model training.
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex justify-between text-xs text-slate-500 mb-1">
                  <span>Data Sync Pipeline</span>
                  <span className="font-medium text-slate-700">100%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full w-full"></div>
                </div>
              </div>
            </div>
          </div>

          {/* API Setu Integration */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-2 bg-blue-500 w-full"></div>
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <Server className="w-6 h-6 text-blue-600" />
                </div>
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
                  Live Stream
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">API Setu (NDMA / IMD)</h3>
              <a href="https://www.apisetu.gov.in/" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mb-3 block">apisetu.gov.in</a>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                Real-time telemetry integration with the National Disaster Management Authority and IMD weather radar APIs.
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Activity className="w-4 h-4 text-blue-500" />
                  Receiving 45 payloads/sec
                </div>
              </div>
            </div>
          </div>

          {/* Bhashini Integration */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
            <div className="h-2 bg-purple-500 w-full"></div>
            <div className="p-5 flex-1">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center border border-purple-100">
                  <Languages className="w-6 h-6 text-purple-600" />
                </div>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></span>
                  Active
                </span>
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Bhashini Translation</h3>
              <a href="https://bhashini.gov.in/" target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline mb-3 block">bhashini.gov.in</a>
              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                National Language Translation Mission integration to automatically convert early warnings into Assamese, Bodo, Mizo, and Khasi.
              </p>
              
              <div className="mt-auto pt-4 border-t border-slate-100 flex gap-1 flex-wrap">
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">Assamese</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">Bodo</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">Mizo</span>
                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">Khasi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </FadeIn>
  );
}
