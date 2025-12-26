import { useState } from 'react';
import { X, Check, Loader, CreditCard } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface StartTrialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StartTrialModal({ isOpen, onClose }: StartTrialModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation();

  if (!isOpen) return null;

  const handleStartTrial = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        successUrl: `${window.location.origin}/dashboard?trial=started`,
        cancelUrl: `${window.location.origin}/dashboard?trial=canceled`,
      });

      // @ts-ignore - testMode is optional
      if (result.testMode) {
        // TEST MODE: Show alert instead of redirecting
        alert(
          '🧪 TEST MODE - Stripe Not Configured\n\n' +
          'This would normally redirect to Stripe Checkout to collect payment details.\n\n' +
          'To enable real payments:\n' +
          '1. Set up Stripe account\n' +
          '2. Add STRIPE_SECRET_KEY and STRIPE_MONTHLY_PRICE_ID to backend/.env\n' +
          '3. See STRIPE_SETUP.md for details\n\n' +
          'For now, you can see the UI and flow!'
        );
        setIsLoading(false);
        onClose();
        return;
      }

      if (result.url) {
        // PRODUCTION: Redirect to Stripe checkout
        window.location.href = result.url;
      } else {
        alert('No checkout URL returned. Please try again.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Failed to create checkout session:', error);
      alert('Failed to start trial. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#561F7A]/50 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md max-h-[90vh] rounded-[20px] bg-white shadow-2xl flex flex-col mx-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 z-10 rounded-full p-2 text-[#561F7A] transition-colors hover:text-[#561F7A]/70"
          disabled={isLoading}
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar-thin px-6 sm:px-8 pt-6 sm:pt-8">
          {/* Header */}
          <div className="mb-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#F9C015] flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-[#561F7A]" />
            </div>
            <h2 className="mb-2 text-2xl sm:text-3xl font-bold text-[#561F7A]">
              Start Your Free Trial
            </h2>
            <div className="space-y-2">
              <p className="text-base sm:text-lg font-bold text-[#F9C015]">
                7 DAYS FREE
              </p>
              <p className="text-sm text-[#561F7A]/80">
                To get started, we need your payment details
              </p>
              <p className="text-xs sm:text-sm font-semibold text-[#561F7A]">
                NO CHARGE FOR 7 DAYS
              </p>
            </div>
          </div>

          {/* Payment Info Box */}
          <div className="mb-6 rounded-[20px] bg-[#F3EBF8] p-6 border border-[#561F7A]/20">
            <div className="mb-4 text-center">
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <span className="text-4xl sm:text-5xl font-bold text-[#561F7A]">$0.00</span>
                <span className="text-lg sm:text-xl text-[#561F7A]/70">today</span>
              </div>
              <p className="text-sm text-[#561F7A]/80 mb-4">
                We'll collect your payment details but won't charge you for 7 days
              </p>
              <div className="border-t border-[#561F7A]/20 pt-4 mt-4">
                <p className="text-base font-semibold text-[#561F7A] mb-1">
                  After your trial:
                </p>
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-3xl font-bold text-[#561F7A]">$19.95</span>
                  <span className="text-base text-[#561F7A]/70">/month</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-3 mt-4">
              {[
                'Full access during trial',
                'Track your progress daily',
                'Access all educational content',
                'Monitor triggers and cravings',
                'Cancel anytime before trial ends',
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
            onClick={handleStartTrial}
            disabled={isLoading}
            className="w-full rounded-[10px] bg-[#F9C015] py-4 font-semibold text-[#131316] shadow-lg transition-all hover:bg-[#F9C015]/90 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader className="h-5 w-5 animate-spin" />
                Loading...
              </span>
            ) : (
              'START MY FREE TRIAL'
            )}
          </button>

          {/* Footer */}
          <p className="mt-4 text-center text-xs text-[#561F7A]/70">
            No charge today. Cancel anytime during your 7-day trial.
          </p>
        </div>
      </div>
    </div>
  );
}



