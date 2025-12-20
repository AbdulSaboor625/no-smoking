import { createBrowserRouter } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ProgressPage } from './pages/ProgressPage';
import { TriggersPage } from './pages/TriggersPage';
import { MilestonesPage } from './pages/MilestonesPage';
import { StatisticsPage } from './pages/StatisticsPage';
import { EducationPage } from './pages/EducationPage';
import { SettingsPage } from './pages/SettingsPage';
import { EmergencyHelpPage } from './pages/EmergencyHelpPage';
import { LandingPage } from './pages/LandingPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <OnboardingPage />,
  },
  {
    path: '/landing',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/progress',
    element: <ProgressPage />,
  },
  {
    path: '/triggers',
    element: <TriggersPage />,
  },
  {
    path: '/milestones',
    element: <MilestonesPage />,
  },
  {
    path: '/statistics',
    element: <StatisticsPage />,
  },
  {
    path: '/education',
    element: <EducationPage />,
  },
  {
    path: '/settings',
    element: <SettingsPage />,
  },
  {
    path: '/emergency',
    element: <EmergencyHelpPage />,
  },
]);
