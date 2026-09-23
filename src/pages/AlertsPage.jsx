import React, { useState, useEffect } from 'react';
import SimulatedDataBadge from '../components/common/SimulatedDataBadge';
import MultilingualToggle from '../components/alerts/MultilingualToggle';
import AlertsFeed from '../components/alerts/AlertsFeed';
import PhonePreview from '../components/alerts/PhonePreview';
import { alerts } from '../data/alerts';

import FadeIn from '../components/common/FadeIn';
import AnimatedCard from '../components/common/AnimatedCard';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import BackgroundAnimation from '../components/common/BackgroundAnimation';

export default function AlertsPage() {
  const [language, setLanguage] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Find highest severity alert for preview
  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const previewAlert = criticalAlerts.length > 0 ? criticalAlerts[0] : alerts[0];

  return (
    <div className="page-enter relative min-h-screen">
      <BackgroundAnimation variant="subtle" />
      
      <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
        <FadeIn direction="down">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">Real-Time Alerts System</h1>
              <SimulatedDataBadge />
            </div>
            <p className="text-slate-700 text-sm">Automated dissemination of warnings based on risk thresholds.</p>
          </div>
        </FadeIn>

        <FadeIn direction="down" delay={150}>
          <MultilingualToggle 
            selectedLanguage={language} 
            onLanguageChange={setLanguage} 
          />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-6">
          <div className="lg:col-span-2 order-2 lg:order-1">
            {isLoading ? (
              <div className="space-y-4">
                <LoadingSkeleton type="card" />
                <LoadingSkeleton type="card" />
                <LoadingSkeleton type="card" />
              </div>
            ) : (
              <FadeIn direction="left" delay={300}>
                <AlertsFeed alerts={alerts} language={language} />
              </FadeIn>
            )}
          </div>
          
          <div className="lg:col-span-1 order-1 lg:order-2 flex justify-center lg:block">
            {isLoading ? (
              <LoadingSkeleton type="card" />
            ) : (
              <FadeIn direction="right" delay={400}>
                <div className="animate-float">
                  <AnimatedCard>
                    <PhonePreview alert={previewAlert} language={language} />
                  </AnimatedCard>
                </div>
              </FadeIn>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
