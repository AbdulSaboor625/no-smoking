import { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { TrialBanner } from '../TrialBanner';
import { SubscriptionModal } from '../SubscriptionModal';
import { PaymentWall } from '../PaymentWall';
import { trpc } from '../../lib/trpc';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
}

export function AppShell({ children, title }: AppShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

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

  const isTrialing = subscriptionStatus?.status === 'trialing';
  const hasAccess = accessCheck?.hasAccess ?? true; // Default to true while loading

  // Show modal on first login if user is in trial
  useEffect(() => {
    // Check if modal has already been shown in this session
    const modalShownKey = 'subscription_modal_shown';
    const hasShownModal = sessionStorage.getItem(modalShownKey);

    if (!hasShownModal && isTrialing && daysRemaining > 0) {
      // Show modal after 2 seconds on first load
      const timer = setTimeout(() => {
        setShowSubscriptionModal(true);
        // Mark modal as shown in session storage
        sessionStorage.setItem(modalShownKey, 'true');
      }, 2000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isTrialing, daysRemaining]);

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
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
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Trial Banner */}
      {isTrialing && daysRemaining >= 0 && (
        <div className="fixed top-0 left-0 right-0 z-30">
          <TrialBanner
            daysRemaining={daysRemaining}
            onUpgradeClick={() => setShowSubscriptionModal(true)}
          />
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex md:w-64 md:flex-col ${isTrialing ? 'pt-14' : ''}`}>
        <Sidebar />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside className={`fixed inset-y-0 left-0 w-64 z-50 md:hidden ${isTrialing ? 'pt-14' : ''}`}>
            <Sidebar isMobile onClose={() => setIsSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isTrialing ? 'pt-14' : ''}`}>
        <Header onMenuClick={() => setIsSidebarOpen(true)} title={title} />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>

      {/* Subscription Modal */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        daysRemaining={daysRemaining}
      />
    </div>
  );
}
