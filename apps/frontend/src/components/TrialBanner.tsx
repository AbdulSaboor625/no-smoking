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
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: 'text-red-600',
      button: 'bg-red-600 hover:bg-red-700 text-white',
    },
    medium: {
      bg: 'bg-orange-50 border-orange-200',
      text: 'text-orange-800',
      icon: 'text-orange-600',
      button: 'bg-orange-600 hover:bg-orange-700 text-white',
    },
    low: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-600',
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
  };

  const theme = colors[urgencyLevel];

  return (
    <div
      className={`relative flex items-center justify-between gap-4 border-b px-4 py-3 ${theme.bg} border transition-all`}
    >
      <div className="flex items-center gap-3">
        <AlertCircle className={`h-5 w-5 flex-shrink-0 ${theme.icon}`} />
        <p className={`text-sm font-medium ${theme.text}`}>
          {daysRemaining === 0 ? (
            <span>Your free trial ends today!</span>
          ) : (
            <span>
              Free trial: <strong>{daysRemaining}</strong> {daysRemaining === 1 ? 'day' : 'days'}{' '}
              remaining
            </span>
          )}
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onUpgradeClick}
          className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${theme.button}`}
        >
          Upgrade Now
        </button>
        <button
          onClick={() => setIsDismissed(true)}
          className={`rounded-full p-1 ${theme.text} hover:bg-black/5`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
