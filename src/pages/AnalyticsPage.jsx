import React, { useState, useEffect, useContext } from 'react';
import RiskScorePanel from '../components/analytics/RiskScorePanel';
import ForecastChart from '../components/analytics/ForecastChart';
import PredictiveTrendChart from '../components/analytics/PredictiveTrendChart';
import MultiParameterFramework from '../components/analytics/MultiParameterFramework';
import SatellitePredictionsPanel from '../components/analytics/SatellitePredictionsPanel';
import GovDataIntegrationPanel from '../components/analytics/GovDataIntegrationPanel';
import { getRiskLevel } from '../data/zones';
import { MapPin, Download, Printer } from 'lucide-react';
import { LiveDataContext } from '../contexts/LiveDataContext';

import FadeIn from '../components/common/FadeIn';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import BackgroundAnimation from '../components/common/BackgroundAnimation';
import DecisionSupportPanel from '../components/analytics/DecisionSupportPanel';

export default function AnalyticsPage() {
  const { liveZones } = useContext(LiveDataContext);
  const dataZones = liveZones || [];

  const defaultZone = [...dataZones].sort((a, b) => b.riskScore - a.riskScore)[0] || dataZones[0];
  const [selectedZoneId, setSelectedZoneId] = useState(defaultZone?.id);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const selectedZone = dataZones.find(z => z.id === selectedZoneId) || defaultZone;

  const groupedZones = dataZones.reduce((acc, zone) => {
    if (!acc[zone.state]) acc[zone.state] = [];
    acc[zone.state].push(zone);
    return acc;
  }, {});

  const handleExportCSV = () => {
    const headers = ["Zone Name", "State", "Risk Score", "Risk Level", "24h Rainfall (mm)", "Soil Moisture (%)", "Slope Angle"];
    const rows = dataZones.map(z => [
      `"${z.name}"`,
      `"${z.state}"`,
      z.riskScore,
      getRiskLevel(z.riskScore),
      z.rainfall24h,
      z.soilMoisture,
      z.slopeAngle
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `GARUD_Risk_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-enter relative min-h-screen">
      <BackgroundAnimation variant="subtle" />
      
      <div className="relative z-10 mx-auto w-full max-w-[1440px] space-y-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <FadeIn direction="down">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">Live intelligence workspace</span>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Predictive Analytics</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">AI-driven risk analysis and forecasting based on environmental factors across the Northeast response grid.</p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex min-h-11 min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 shadow-sm sm:min-w-[300px]">
                  <MapPin size={18} className="shrink-0 text-blue-700" />
                  <select
                    aria-label="Select analysis zone"
                    className="min-w-0 w-full bg-transparent py-2 text-sm font-semibold text-slate-700 outline-none"
                    value={selectedZoneId}
                    onChange={(e) => setSelectedZoneId(e.target.value)}
                  >
                    {Object.keys(groupedZones).sort().map(state => (
                      <optgroup key={state} label={state}>
                        {groupedZones[state].map(zone => (
                          <option key={zone.id} value={zone.id}>
                            {zone.name} ({zone.district})
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 sm:flex-none"
                  >
                    <Printer className="h-4 w-4" /> <span className="hidden sm:inline">Print</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="analytics-action-primary flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50 sm:flex-none"
                  >
                    <Download className="h-4 w-4" /> <span className="hidden sm:inline">Export CSV</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            <LoadingSkeleton type="card" />
            <LoadingSkeleton type="chart" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-2">
              <FadeIn direction="left" delay={200}>
                <RiskScorePanel zone={selectedZone} />
              </FadeIn>
              
              <FadeIn direction="right" delay={300}>
                <ForecastChart zone={selectedZone} />
              </FadeIn>
            </div>
            
            <FadeIn direction="up" delay={350}>
              <PredictiveTrendChart zone={selectedZone} />
            </FadeIn>
          </>
        )}

        {!isLoading && (
          <FadeIn direction="up" delay={400}>
            <SatellitePredictionsPanel zone={selectedZone} />
          </FadeIn>
        )}

        {!isLoading && (
          <FadeIn direction="up" delay={425}>
            <DecisionSupportPanel />
          </FadeIn>
        )}

        <div className="space-y-8">
          {isLoading ? (
            <LoadingSkeleton type="table" />
          ) : (
            <FadeIn direction="up" delay={450}>
              <MultiParameterFramework />
              <GovDataIntegrationPanel />
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}
