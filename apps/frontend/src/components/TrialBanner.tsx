import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

interface TrialBannerProps {
  daysRemaining: number;
  onUpgradeClick: () => void;
}

export function TrialBanner({ daysRemaining, onUpgradeClick }: TrialBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const urgencyLevel = daysRemaining <= 2 ? 'high' : daysRemaining <= 4 ? 'medium' : 'low';

  const colors = {
    high: {
      bg: 'bg-[#FEF6E8] border-[#F9C015]',
      text: 'text-[#561F7A]',
      icon: 'text-[#561F7A]',
      button: 'bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#131316]',
      badge: 'bg-[#561F7A] text-white',
    },
    medium: {
      bg: 'bg-[#F3EBF8] border-[#561F7A]/30',
      text: 'text-[#561F7A]',
      icon: 'text-[#561F7A]',
      button: 'bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#131316]',
      badge: 'bg-[#561F7A] text-white',
    },
    low: {
      bg: 'bg-[#F3EBF8] border-[#561F7A]/20',
      text: 'text-[#561F7A]',
      icon: 'text-[#561F7A]',
      button: 'bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#131316]',
      badge: 'bg-[#561F7A] text-white',
    },
  };

  const theme = colors[urgencyLevel];

  return (
    <div
      className={`relative flex items-center justify-between gap-4 border-b px-4 sm:px-6 py-3 ${theme.bg} transition-all`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className={`p-1.5 rounded-full ${theme.badge} flex-shrink-0`}>
          <AlertCircle className="h-4 w-4" />
        </div>
        <p className={`text-sm sm:text-base font-semibold ${theme.text} flex items-center gap-2 flex-wrap`}>
          {daysRemaining === 0 ? (
            <span>Your free trial ends today!</span>
          ) : (
            <>
              <span>Free trial:</span>
              <span className={`px-2 py-0.5 rounded-md ${theme.badge} font-bold`}>
                {daysRemaining} {daysRemaining === 1 ? 'day' : 'days'}
              </span>
              <span>remaining</span>
            </>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={onUpgradeClick}
          className={`rounded-[10px] px-4 py-2 text-sm font-semibold transition-all shadow-sm hover:shadow-md ${theme.button}`}
        >
          Upgrade Now
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className={`rounded-full p-1.5 ${theme.text} hover:bg-[#561F7A]/10 transition-colors`}
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
