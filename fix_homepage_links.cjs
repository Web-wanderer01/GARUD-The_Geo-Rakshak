const fs = require('fs');
let content = fs.readFileSync('src/pages/HomePage.jsx', 'utf8');

content = content.replace(
  `import { ArrowRight, ChevronRight, AlertTriangle, Map, BarChart3, Bell, FileText, Settings, BookOpen, Shield, Route, Users } from 'lucide-react';`,
  `import { ArrowRight, ChevronRight, AlertTriangle, Map, BarChart3, Bell, FileText, Settings, BookOpen, Shield, Route, Users, Truck, Activity, MapPin } from 'lucide-react';`
);

const oldQuickAccess = `  const quickAccess = [
    { title: 'Risk Dashboard', icon: Map, link: '/map', color: 'text-blue-600', hover: 'hover:border-blue-300' },
    { title: 'Analytics', icon: BarChart3, link: '/analytics', color: 'text-indigo-600', hover: 'hover:border-indigo-300' },
    { title: 'Active Alerts', icon: Bell, link: '/alerts', color: 'text-red-600', hover: 'hover:border-red-300' },
    { title: 'Field Report', icon: FileText, link: '/reporting', color: 'text-green-600', hover: 'hover:border-green-300' },
    { title: 'Operations', icon: Settings, link: '/operations', color: 'text-purple-600', hover: 'hover:border-purple-300' },
    { title: 'Safety Guide', icon: BookOpen, link: '/safety', color: 'text-amber-600', hover: 'hover:border-amber-300' },
  ];`;

const newQuickAccess = `  const quickAccess = [
    { title: 'Risk Dashboard', icon: Map, link: '/map', color: 'text-blue-600', hover: 'hover:border-blue-300' },
    { title: 'Analytics', icon: BarChart3, link: '/analytics', color: 'text-indigo-600', hover: 'hover:border-indigo-300' },
    { title: 'Command Center', icon: Settings, link: '/operations', color: 'text-purple-600', hover: 'hover:border-purple-300' },
    { title: 'Smart Logistics', icon: Truck, link: '/logistics', color: 'text-amber-600', hover: 'hover:border-amber-300' },
    { title: 'Virtual Demo', icon: Activity, link: '/demo', color: 'text-red-600', hover: 'hover:border-red-300' },
    { title: 'Citizen DB', icon: Users, link: '/database', color: 'text-green-600', hover: 'hover:border-green-300' },
  ];`;

content = content.replace(oldQuickAccess, newQuickAccess);

const oldOverview = `  const overviewStats = [
    { label: 'Active Alerts', value: criticalAlerts.length, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Max Risk Score', value: 91, icon: Shield, color: 'text-orange-500' },
    { label: 'Roads Affected', value: roadStats.partiallyBlocked + roadStats.fullyBlocked, icon: Route, color: 'text-amber-500' },
    { label: 'States Covered', value: 8, icon: Users, color: 'text-blue-500' }
  ];`;

const newOverview = `  const overviewStats = [
    { label: 'Monitored Zones', value: zoneStats.totalZones, icon: MapPin, color: 'text-blue-500' },
    { label: 'Critical Alerts', value: criticalAlerts.length, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Max Risk Score', value: zoneStats.highestRiskZone?.riskScore || 91, icon: Activity, color: 'text-orange-500' },
    { label: 'Roads Affected', value: roadStats.partiallyBlocked + roadStats.fullyBlocked, icon: Route, color: 'text-amber-500' }
  ];`;

content = content.replace(oldOverview, newOverview);

fs.writeFileSync('src/pages/HomePage.jsx', content);
