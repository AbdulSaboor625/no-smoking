import { useState } from 'react';
import { Sun, CheckCircle, X } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface MorningCommitmentModalProps {
  quitAttemptId?: string;
  onClose: () => void;
  onCommit: () => void;
}

export function MorningCommitmentModal({ quitAttemptId, onClose, onCommit }: MorningCommitmentModalProps) {
  const [isCommitting, setIsCommitting] = useState(false);
  const commitMutation = trpc.commitments.makeMorningCommitment.useMutation();

  const handleCommit = async () => {
    if (isCommitting) return;

    setIsCommitting(true);
    try {
      await commitMutation.mutateAsync({ quitAttemptId });
      onCommit();
    } catch (error) {
      console.error('Failed to make commitment:', error);
      alert('Failed to save commitment. Please try again.');
      setIsCommitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl shadow-2xl max-w-lg w-full p-8 relative border-2 border-orange-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-orange-400 rounded-full">
            <Sun className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Good Morning!</h2>
            <p className="text-gray-600">Start your day with a commitment</p>
          </div>
        </div>

        {/* Main message */}
        <div className="mb-8 space-y-4">
          <div className="bg-white/70 border-l-4 border-orange-500 p-4 rounded-r-lg">
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Today's commitment lasts only until bedtime.
            </p>
            <p className="text-gray-700">
              You don't have to quit forever — just for today.
            </p>
          </div>

          <div className="text-center py-6">
            <p className="text-2xl font-bold text-gray-900 mb-2">
              Are you willing to stay nicotine-free today?
            </p>
            <p className="text-gray-600">
              One day at a time. That's all you need.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCommit}
            disabled={isCommitting}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCommitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Committing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Yes, I'm Committed Today
              </>
            )}
          </button>
        </div>

        {/* Footer message */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Tomorrow will take care of itself.
        </p>
      </div>
    </div>
  );
}
