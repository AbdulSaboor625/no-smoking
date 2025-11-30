import { useState } from 'react';
import { Moon, CheckCircle, X, Star } from 'lucide-react';
import { trpc } from '../lib/trpc';

interface EveningReflectionModalProps {
  onClose: () => void;
  onReflect: () => void;
}

export function EveningReflectionModal({ onClose, onReflect }: EveningReflectionModalProps) {
  const [daySuccess, setDaySuccess] = useState<boolean | null>(null);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const reflectMutation = trpc.commitments.makeEveningReflection.useMutation();

  const handleSubmit = async () => {
    if (daySuccess === null || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await reflectMutation.mutateAsync({
        daySuccess,
        eveningNotes: notes.trim() || undefined,
      });
      onReflect();
    } catch (error) {
      console.error('Failed to save reflection:', error);
      alert('Failed to save reflection. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl shadow-2xl max-w-lg w-full p-8 relative border-2 border-indigo-200">
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
          <div className="p-4 bg-indigo-500 rounded-full">
            <Moon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Evening Reflection</h2>
            <p className="text-gray-600">How did today go?</p>
          </div>
        </div>

        {/* Main content */}
        <div className="space-y-6">
          {/* Success question */}
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-3">
              Did you stay nicotine-free today?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setDaySuccess(true)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  daySuccess === true
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-green-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <CheckCircle className={`w-6 h-6 ${daySuccess === true ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`font-bold ${daySuccess === true ? 'text-green-700' : 'text-gray-600'}`}>
                    Yes!
                  </span>
                </div>
              </button>
              <button
                onClick={() => setDaySuccess(false)}
                className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                  daySuccess === false
                    ? 'border-orange-500 bg-orange-50 shadow-md'
                    : 'border-gray-300 bg-white hover:border-orange-300'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <X className={`w-6 h-6 ${daySuccess === false ? 'text-orange-600' : 'text-gray-400'}`} />
                  <span className={`font-bold ${daySuccess === false ? 'text-orange-700' : 'text-gray-600'}`}>
                    Not today
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Success message */}
          {daySuccess === true && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-r-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <Star className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-green-900 text-lg mb-1">Another day won!</p>
                  <p className="text-green-800">
                    You kept your promise to yourself. Be proud of what you accomplished today.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Slip message */}
          {daySuccess === false && (
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-500 p-4 rounded-r-lg animate-in fade-in slide-in-from-top-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-orange-900 text-lg mb-1">You didn't fail</p>
                  <p className="text-orange-800">
                    You slipped. That's different from failing. Tomorrow is a new commitment. One day at a time.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Optional notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Any thoughts about today? (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What did you learn today? What was challenging? What helped?"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
              rows={3}
            />
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={daySuccess === null || isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Complete Reflection
              </>
            )}
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Rest knowing you showed up today.
        </p>
      </div>
    </div>
  );
}
