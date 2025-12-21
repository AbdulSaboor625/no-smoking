import { useState } from 'react';
import { Lock, Loader } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface PaymentWallProps {
  reason: 'trial_expired' | 'no_subscription';
}

export function PaymentWall({ reason }: PaymentWallProps) {
  const [isLoading, setIsLoading] = useState(false);
  const createCheckoutMutation = trpc.subscription.createCheckoutSession.useMutation();

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-2xl">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 p-6">
            <Lock className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          {reason === 'trial_expired' ? 'Your Trial Has Ended' : 'Subscription Required'}
        </h1>

        {/* Description */}
        <p className="mb-8 text-gray-600">
          {reason === 'trial_expired'
            ? 'Continue your smoke-free journey by subscribing for just $7.99/year!'
            : 'Access all features and continue your progress for just $7.99/year!'}
        </p>

        {/* Pricing Box */}
        <div className="mb-8 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-5xl font-bold text-gray-900">$7.99</span>
            <span className="text-xl text-gray-600">/year</span>
          </div>
          <p className="mt-2 text-sm text-gray-600">Less than $0.67/month</p>
        </div>

        {/* Benefits */}
        <div className="mb-8 space-y-3 text-left">
          <h3 className="text-center font-semibold text-gray-900">What You Get:</h3>
          {[
            'Daily progress tracking',
            'Educational content access',
            'Trigger & craving management',
            'Milestone celebrations',
            'Personalized insights',
            'Cancel anytime',
          ].map((benefit, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-shrink-0 rounded-full bg-green-100 p-1">
                <svg
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-sm text-gray-700">{benefit}</span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <button
          onClick={handleSubscribe}
          disabled={isLoading}
          className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-4 font-semibold text-white shadow-lg transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader className="min-h-5 min-w-5 animate-spin" />
            </span>
          ) : (
            'Subscribe Now'
          )}
        </button>

        {/* Footer */}
        <p className="mt-6 text-xs text-gray-500">
          Secure payment powered by Stripe. Cancel anytime.
        </p>
      </div>
    </div>
  );
}
