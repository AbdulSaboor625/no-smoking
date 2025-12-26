import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TrialBanner } from '../TrialBanner';
import { SubscriptionModal } from '../SubscriptionModal';
import { StartTrialModal } from '../StartTrialModal';
import { PaymentWall } from '../PaymentWall';
import { trpc } from '../../lib/trpc';
import DashboardHeader from './dashboard-header';
import { Loader2 } from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export function AppShell({ children }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showStartTrialModal, setShowStartTrialModal] = useState(false);

  // Check subscription status
  const { data: subscriptionStatus, isLoading } = trpc.subscription.getStatus.useQuery();
  const { data: accessCheck } = trpc.subscription.checkAccess.useQuery();

  // Calculate days remaining in trial
  const daysRemaining = subscriptionStatus?.trialEndDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(subscriptionStatus.trialEndDate).getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0;

  const needsToStartTrial = subscriptionStatus?.status === 'incomplete';
  const isTrialing = subscriptionStatus?.status === 'trialing';
  const isPaid = subscriptionStatus?.status === 'active';
  const hasAccess = accessCheck?.hasAccess ?? true; // Default to true while loading

  // Show start trial modal if user needs to start trial
  useEffect(() => {
    if (needsToStartTrial) {
      // Show immediately - user must start trial to access app
      setShowStartTrialModal(true);
    }
  }, [needsToStartTrial]);

  // Show modal on first login if user is in trial (but not if already paid)
  useEffect(() => {
    // Check if modal has already been shown in this session
    const modalShownKey = 'subscription_modal_shown';
    const hasShownModal = sessionStorage.getItem(modalShownKey);

    if (!hasShownModal && isTrialing && daysRemaining > 0 && !isPaid) {
      // Show modal after 2 seconds on first load
      const timer = setTimeout(() => {
        setShowSubscriptionModal(true);
        // Mark modal as shown in session storage
        sessionStorage.setItem(modalShownKey, 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isTrialing, daysRemaining, isPaid]);

  // Handle trial start and payment success notifications
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('trial') === 'started' && isTrialing) {
      // Clear URL params after trial started
      window.history.replaceState({}, '', window.location.pathname);
      console.log('✅ Free trial started! Enjoy 7 days of full access.');
    }
    
    if (urlParams.get('payment') === 'success' && isPaid) {
      // Clear URL params after successful payment
      window.history.replaceState({}, '', window.location.pathname);
      console.log('✅ Payment successful! Subscription activated.');
    }
  }, [isTrialing, isPaid]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          {/* <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div> */}
          <p className="mt-4 text-[#561F7A] flex items-center justify-center gap-2 font-semibold text-2xl"><Loader2 className="min-h-12 min-w-12 animate-spin" /> Loading...</p>
        </div>
      </div>
    );
  }

  // If user needs to start trial, show start trial modal (block access)
  if (needsToStartTrial) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F2F2F2]">
        <StartTrialModal 
          isOpen={showStartTrialModal} 
          onClose={() => {
            // User can't close this modal - they must start trial or logout
            // Only allow closing if they want to logout
          }} 
        />
      </div>
    );
  }

  // If no access, show payment wall
  if (!hasAccess) {
    const reason = (accessCheck?.reason === 'trial_expired' || accessCheck?.reason === 'no_subscription')
      ? accessCheck.reason
      : 'trial_expired';
    return <PaymentWall reason={reason} />;
  }

  return (
    <div className="flex min-h-[100vh] max-h-[100vh] overflow-hidden bg-[#F2F2F2]">
      {/* Trial Banner - Only show for trial users, not paid users */}
      {isTrialing && daysRemaining >= 0 && !isPaid && (
        <div className="fixed top-0 left-0 right-0 z-30">
          <TrialBanner
            daysRemaining={daysRemaining}
            onUpgradeClick={() => setShowSubscriptionModal(true)}
          />
        </div>
      )}

      {/* Desktop Sidebar - Always visible on xl and above */}
      <aside className={`hidden xl:flex w-64 flex-col ${isTrialing && !isPaid ? '' : ''}`}>
        <Sidebar />
      </aside>

      {/* Sidebar Overlay - Shows when isSidebarOpen is true on all screens below xl */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 xl:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className={`fixed inset-y-0 left-0 w-64 z-50 xl:hidden ${isTrialing && !isPaid ? '' : ''}`}>
            <Sidebar isMobile onClose={() => setIsSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isTrialing && !isPaid ? '' : ''}`}>
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        daysRemaining={daysRemaining}
      />

      {/* Start Trial Modal (shown when needed) */}
      <StartTrialModal
        isOpen={showStartTrialModal && needsToStartTrial}
        onClose={() => setShowStartTrialModal(false)}
      />
    </div>
  );
}
