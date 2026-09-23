import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useCallback, Component, useEffect } from 'react';
import { submitFieldReport, listenToFieldReports } from './services/firebase';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import OfflineBanner from './components/layout/OfflineBanner';
import ScrollToTop from './components/common/ScrollToTop';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import RiskMapPage from './pages/RiskMapPage';
import AnalyticsPage from './pages/AnalyticsPage';
import OperationsPage from './pages/OperationsPage';
import LogisticsPage from './pages/LogisticsPage';
import DisasterDemoPage from './pages/DisasterDemoPage';
import CitizenDatabasePage from './pages/CitizenDatabasePage';
import AlertsPage from './pages/AlertsPage';
import ReportingPage from './pages/ReportingPage';
import SafetyGuidelinesPage from './pages/SafetyGuidelinesPage';

import AccessibilityBar from './components/layout/AccessibilityBar';
import AIAssistant from './components/ai/AIAssistant';

import IoTDashboardPage from './pages/IoTDashboardPage';
import StrategicUpgradesPage from './pages/StrategicUpgradesPage';
import CommandCenterPage from './pages/CommandCenterPage';
import SensorsPage from './pages/SensorsPage';
import EvacuationPage from './pages/EvacuationPage';
import CoordinationPage from './pages/CoordinationPage';
import DialectsPage from './pages/DialectsPage';
import GARUDLoginPage from './pages/GARUDLoginPage';

// Global error boundary - prevents one page crash from killing the whole app
class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('Page Error:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">:(</div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Page Error</h2>
          <p className="text-slate-500 mb-6 max-w-md">Something went wrong loading this page. Please try refreshing the browser.</p>
          <button
            onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload(); }}
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-800"
          >
            Refresh Page
          </button>
          <details className="mt-4 text-xs text-slate-400 text-left max-w-lg">
            <summary className="cursor-pointer">Technical details</summary>
            <pre className="mt-2 overflow-auto">{this.state.error?.toString()}</pre>
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

const Wrap = ({ children }) => <ErrorBoundary>{children}</ErrorBoundary>;

export default function App() {
  const [reports, setReports] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = listenToFieldReports((fetchedReports) => { setReports(fetchedReports); });
    return () => unsubscribe();
  }, []);

  const addReport = useCallback(async (report) => {
    try {
      const savedReport = await submitFieldReport(report);
      if (savedReport.status?.includes('local')) { setReports((prev) => [savedReport, ...prev]); }
    } catch (error) { console.error('Failed to submit report', error); }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <AccessibilityBar />
      <AIAssistant />
      <OfflineBanner />
      <Header />
      <main id="main-content" className="flex-1">
        <Routes>
          <Route path="/"             element={<Wrap><HomePage /></Wrap>} />
          <Route path="/map"          element={<Wrap><RiskMapPage reports={reports} /></Wrap>} />
          <Route path="/analytics"    element={<Wrap><AnalyticsPage /></Wrap>} />
          <Route path="/operations"   element={<Wrap><OperationsPage /></Wrap>} />
          <Route path="/logistics"    element={<Wrap><LogisticsPage /></Wrap>} />
          <Route path="/demo"         element={<Wrap><DisasterDemoPage /></Wrap>} />
          <Route path="/database"     element={<Wrap><CitizenDatabasePage /></Wrap>} />
          <Route path="/about"        element={<Wrap><AboutPage /></Wrap>} />
          <Route path="/alerts"       element={<Wrap><AlertsPage /></Wrap>} />
          <Route path="/reporting"    element={<Wrap><ReportingPage addReport={addReport} /></Wrap>} />
          <Route path="/safety"       element={<Wrap><SafetyGuidelinesPage /></Wrap>} />
          <Route path="/iot"          element={<Wrap><IoTDashboardPage /></Wrap>} />
          <Route path="/upgrades"     element={<Wrap><StrategicUpgradesPage /></Wrap>} />
          {/* New Pages */}
          <Route path="/command"      element={<Wrap><CommandCenterPage /></Wrap>} />
          <Route path="/sensors"      element={<Wrap><SensorsPage /></Wrap>} />
          <Route path="/evacuation"   element={<Wrap><EvacuationPage /></Wrap>} />
          <Route path="/coordination" element={<Wrap><CoordinationPage /></Wrap>} />
          <Route path="/dialects"     element={<Wrap><DialectsPage /></Wrap>} />
          <Route path="/login"        element={<GARUDLoginPage onLogin={() => {}} />} />

          <Route path="*"             element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
