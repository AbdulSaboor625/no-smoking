import { useState, useEffect } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { AlertTriangle, Clock, Heart, Wind, Brain, Shield, CheckCircle } from 'lucide-react';

export function EmergencyHelpPage() {
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

  // 5-Minute Craving Timer
  useEffect(() => {
    if (activeTimer === null) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setActiveTimer(null);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTimer]);

  // Breathing Exercise Animation
  useEffect(() => {
    if (!breathingActive) return;

    const cycle = async () => {
      // Inhale: 4 seconds
      setBreathPhase('inhale');
      await new Promise(resolve => setTimeout(resolve, 4000));

      // Hold: 7 seconds
      setBreathPhase('hold');
      await new Promise(resolve => setTimeout(resolve, 7000));

      // Exhale: 8 seconds
      setBreathPhase('exhale');
      await new Promise(resolve => setTimeout(resolve, 8000));
    };

    const interval = setInterval(cycle, 19000); // Full cycle
    cycle(); // Start immediately

    return () => clearInterval(interval);
  }, [breathingActive]);

  const startTimer = () => {
    setActiveTimer(Date.now());
    setTimerSeconds(300);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const panicScripts = [
    "You are not craving — your addiction is.",
    "Cravings fade in 2–5 minutes. Let's breathe together.",
    "This will pass. It always does.",
    "You're stronger than the voice in your head.",
    "Wait 5 minutes. The urge will fade.",
    "You don't want nicotine — the addiction does.",
    "This craving is a memory, not a need."
  ];

  const identityReminders = [
    "I am a non-smoker.",
    "I am in control of my choices.",
    "I am stronger than this craving.",
    "My body is healing.",
    "I don't negotiate with addiction.",
    "This too shall pass.",
    "I am becoming my best self."
  ];

  const copingStrategies = [
    { icon: Wind, title: "Deep Breathing", action: "Start 4-7-8 breathing", onClick: () => setBreathingActive(true) },
    { icon: Clock, title: "5-Minute Rule", action: "Start timer", onClick: startTimer },
    { icon: Brain, title: "Thought Reframe", action: "Read scripts" },
    { icon: Heart, title: "Why I Quit", action: "View reasons" },
  ];

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold text-red-900">Emergency Help</h1>
          </div>
          <p className="text-red-800 text-lg font-medium">
            You're experiencing a strong craving. This is normal. You can get through this.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          {copingStrategies.map((strategy) => (
            <button
              key={strategy.title}
              onClick={strategy.onClick}
              className="p-6 bg-white border-2 border-blue-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all text-left group"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                  <strategy.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{strategy.title}</h3>
                  <p className="text-sm text-gray-600">{strategy.action}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 4-7-8 Breathing Exercise */}
        {breathingActive && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-300 rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">4-7-8 Breathing</h2>
              <button
                onClick={() => setBreathingActive(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Stop
              </button>
            </div>

            <div className="flex flex-col items-center space-y-8">
              {/* Breathing Circle Animation */}
              <div className="relative w-64 h-64">
                <div
                  className={`absolute inset-0 rounded-full transition-all duration-1000 ${
                    breathPhase === 'inhale'
                      ? 'scale-100 bg-blue-400 opacity-50'
                      : breathPhase === 'hold'
                      ? 'scale-100 bg-purple-400 opacity-50'
                      : 'scale-50 bg-green-400 opacity-30'
                  }`}
                  style={{
                    transitionDuration:
                      breathPhase === 'inhale' ? '4s' : breathPhase === 'hold' ? '7s' : '8s',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-gray-800 capitalize">{breathPhase}</p>
                    <p className="text-lg text-gray-600 mt-2">
                      {breathPhase === 'inhale' ? '4 sec' : breathPhase === 'hold' ? '7 sec' : '8 sec'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center max-w-md">
                <p className="text-gray-700">
                  {breathPhase === 'inhale' && "Breathe in slowly through your nose..."}
                  {breathPhase === 'hold' && "Hold your breath gently..."}
                  {breathPhase === 'exhale' && "Exhale slowly through your mouth..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 5-Minute Timer */}
        {activeTimer !== null && (
          <div className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-300 rounded-lg p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">5-Minute Craving Timer</h2>
              <button
                onClick={() => setActiveTimer(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="text-center space-y-6">
              <div className="text-7xl font-bold text-green-600 font-mono">
                {formatTime(timerSeconds)}
              </div>

              {timerSeconds > 240 && (
                <p className="text-lg text-gray-700">
                  Cravings peak and fade in 2-5 minutes. Just wait it out.
                </p>
              )}

              {timerSeconds <= 240 && timerSeconds > 120 && (
                <p className="text-lg text-gray-700 font-medium">
                  You're halfway there. The craving is weakening.
                </p>
              )}

              {timerSeconds <= 120 && timerSeconds > 60 && (
                <p className="text-lg text-green-700 font-bold">
                  Almost done! You're beating this craving.
                </p>
              )}

              {timerSeconds <= 60 && timerSeconds > 0 && (
                <p className="text-lg text-green-700 font-bold animate-pulse">
                  Final minute. You've got this!
                </p>
              )}

              {timerSeconds === 0 && (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto" />
                  <p className="text-2xl text-green-700 font-bold">
                    You did it! The craving passed.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Panic Scripts */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">Emergency Scripts</h2>
          </div>
          <div className="space-y-3">
            {panicScripts.map((script, index) => (
              <div
                key={index}
                className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg"
              >
                <p className="text-gray-800 font-medium italic">"{script}"</p>
              </div>
            ))}
          </div>
        </div>

        {/* Identity Reminders */}
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-bold text-gray-900">Identity Reminders</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {identityReminders.map((reminder, index) => (
              <div
                key={index}
                className="p-4 bg-purple-50 border border-purple-200 rounded-lg"
              >
                <p className="text-gray-800 font-semibold text-center">{reminder}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Urge Surfing Guide */}
        <div className="bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-300 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Urge Surfing</h2>
          <p className="text-gray-700 mb-4">
            Imagine the craving as a wave. It rises, peaks, and falls. You don't have to fight it — just surf it.
          </p>
          <ol className="space-y-3 text-gray-800">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                1
              </span>
              <span><strong>Notice</strong> the craving without judgment. "I'm having a craving."</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                2
              </span>
              <span><strong>Breathe</strong> slowly and deeply. Feel it in your body.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                3
              </span>
              <span><strong>Observe</strong> the craving rise and peak. Don't act on it.</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                4
              </span>
              <span><strong>Let it pass</strong>. The wave always crashes. It always does.</span>
            </li>
          </ol>
        </div>

        {/* Call for Help */}
        <div className="bg-yellow-50 border-2 border-yellow-400 rounded-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">Need More Support?</h2>
          <div className="space-y-2 text-gray-800">
            <p>
              <strong>National Quitline:</strong>{' '}
              <a href="tel:1-800-QUIT-NOW" className="text-blue-600 hover:underline font-medium">
                1-800-QUIT-NOW (1-800-784-8669)
              </a>
            </p>
            <p>
              <strong>Crisis Support:</strong>{' '}
              <a href="tel:988" className="text-blue-600 hover:underline font-medium">
                988 (Suicide & Crisis Lifeline)
              </a>
            </p>
            <p className="text-sm text-gray-600 mt-3">
              You're not alone. Reaching out for help is a sign of strength, not weakness.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
