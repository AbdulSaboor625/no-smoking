import { MessageCircle, Calendar } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface DailyCoachingCardProps {
  quitAttemptId: string;
}

export function DailyCoachingCard({ quitAttemptId }: DailyCoachingCardProps) {
  const { data, isLoading } = trpc.coaching.getToday.useQuery({ quitAttemptId });

  // Don't show anything while loading to avoid extra skeleton
  if (isLoading) {
    return null;
  }

  if (!data?.script) {
    return null;
  }

  const { dayNumber, script } = data;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-300 rounded-lg p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500 rounded-full">
            <MessageCircle className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{script.title}</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Day {dayNumber}</span>
              {script.category && (
                <>
                  <span>•</span>
                  <span className="capitalize">{script.category.replace(/_/g, ' ')}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Message */}
      <div className="mb-4">
        <div className="bg-white/70 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-gray-800 whitespace-pre-line leading-relaxed">
            {script.message}
          </p>
        </div>
      </div>

      {/* Action Step */}
      {script.actionStep && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            Today's Action
          </h4>
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-3">
            <p className="text-gray-800 text-sm">{script.actionStep}</p>
          </div>
        </div>
      )}

      {/* Identity Reminder */}
      {script.identityReminder && (
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 rounded-lg p-4 text-center">
          <p className="text-purple-900 font-bold text-lg italic">
            "{script.identityReminder}"
          </p>
        </div>
      )}
    </div>
  );
}
