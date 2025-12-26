import { useState } from 'react';
import { X, Check, Loader } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysRemaining: number;
}

export function SubscriptionModal({ isOpen, onClose, daysRemaining }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createBillingPortalMutation = trpc.subscription.createBillingPortalSession.useMutation();

  if (!isOpen) return null;

  const handleManageBilling = async () => {
    setIsLoading(true);
    try {
      const result = await createBillingPortalMutation.mutateAsync({
        returnUrl: `${window.location.origin}/dashboard`,
      });

      if (result.url) {
        // Redirect to Stripe billing portal
        window.location.href = result.url;
      } else {
        alert('Unable to open billing portal. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to open billing portal:', error);
      alert('Unable to access billing settings. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#561F7A]/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md max-h-[90vh] rounded-[20px] bg-white shadow-2xl flex flex-col mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 rounded-full p-2 text-[#561F7A] transition-colors hover:text-[#561F7A]"
          disabled={isLoading}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar-thin px-6 sm:px-8 pt-6 sm:pt-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <img src="/assets/images/logo.svg" alt="QuitApp Logo" className="w-16 h-16 mx-auto mb-4" />
            <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-[#561F7A]">
              Your Free Trial
            </h2>
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-bold text-[#F9C015]">
                {daysRemaining} {daysRemaining === 1 ? 'DAY' : 'DAYS'} REMAINING
              </p>
              <p className="text-sm text-[#561F7A]">
                After your trial, you'll be charged <span className="font-bold">$19.95/month</span>
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#561F7A]">
                CANCEL ANYTIME IN BILLING PORTAL
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="mb-6 rounded-[20px] bg-[#F3EBF8] p-6 border border-[#561F7A]/20">
            <div className="mb-4 text-center">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-bold text-[#561F7A]">$19.95</span>
                <span className="text-lg sm:text-xl text-[#561F7A]/70">/month</span>
              </div>
              {/* <p className="mt-2 text-base sm:text-lg font-bold text-[#F9C015]">
                That's less than $0.67 per Month!
              </p> */}
            </div>

            {/* Features */}
            <ul className="space-y-3">
              {[
                'Track your progress daily',
                'Access all educational content',
                'Monitor triggers and cravings',
                'Celebrate milestones',
                'Get personalized insights',
                'Unlimited access to all features',
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-0.5 h-5 w-5 flex-shrink-0 flex items-center justify-center rounded-full bg-[#561F7A]">
                    <Check className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-sm text-[#561F7A] font-medium">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Fixed Footer Section */}
        <div className="flex-shrink-0 px-6 sm:px-8 pb-4 sm:pb-6 pt-4 border-t border-[#F2F2F2]">
          {/* CTA Button */}
          <button
            onClick={handleManageBilling}
            disabled={isLoading}
            className="w-full rounded-[10px] bg-[#561F7A] py-4 font-semibold text-white shadow-lg transition-all hover:bg-[#561F7A]/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="h-5 w-5 animate-spin" />
                Loading...
              </span>
            ) : (
              'MANAGE SUBSCRIPTION'
            )}
          </button>

          {/* Footer */}
          <p className="mt-4 text-center text-xs text-[#561F7A]/70">
            Cancel or update payment method anytime
          </p>
        </div>
      </div>
    </div>
  );
}
