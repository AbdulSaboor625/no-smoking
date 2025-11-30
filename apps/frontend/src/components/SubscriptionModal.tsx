import { useState } from 'react';
import { X, Check, Loader2 } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysRemaining: number;
}

export function SubscriptionModal({ isOpen, onClose, daysRemaining }: SubscriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation();

  if (!isOpen) return null;

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const result = await createCheckoutMutation.mutateAsync({
        successUrl: `${window.location.origin}/dashboard?payment=success`,
        cancelUrl: `${window.location.origin}/dashboard?payment=canceled`,
      });

      // @ts-ignore - testMode is optional
      if (result.testMode) {
        // TEST MODE: Show alert instead of redirecting
        alert(
          '🧪 TEST MODE - Stripe Not Configured\n\n' +
          'This would normally redirect to Stripe Checkout.\n\n' +
          'To enable real payments:\n' +
          '1. Set up Stripe account\n' +
          '2. Add STRIPE_SECRET_KEY to backend/.env\n' +
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
      alert('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          disabled={isLoading}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <img src="/logo.png" alt="QuitApp Logo" className="w-16 h-16 mx-auto mb-4" />
          <h2 className="mb-2 text-3xl font-bold text-gray-900">
            Unlock Your Journey
          </h2>
          <div className="space-y-2">
            <p className="text-lg font-bold text-green-600">
              7 DAY FREE TRIAL
            </p>
            <p className="text-sm text-gray-600">
              You have {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} left in your free trial
            </p>
            <p className="text-sm font-semibold text-gray-700">
              CANCEL ANY TIME
            </p>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="mb-4 text-center">
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-bold text-gray-900">$7.99</span>
              <span className="text-xl text-gray-600">/year</span>
            </div>
            <p className="mt-2 text-lg font-bold text-blue-600">
              That's less than $0.67 per Month!
            </p>
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
                <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" />
                <span className="text-sm text-gray-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading...
            </span>
          ) : (
            'QUIT NOW'
          )}
        </button>

        {/* Footer */}
        <p className="mt-4 text-center text-xs text-gray-500">
          Cancel anytime. No hidden fees.
        </p>
      </div>
    </div>
  );
}
