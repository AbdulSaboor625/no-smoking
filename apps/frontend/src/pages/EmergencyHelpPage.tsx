import { useState, useEffect, useRef } from 'react';
import { AppShell } from '../components/layout/AppShell';
import { Clock, Heart, Wind, Brain, CheckCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export function EmergencyHelpPage() {
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  const [breathCountdown, setBreathCountdown] = useState(4); // Countdown for current phase
  const [showReasons, setShowReasons] = useState(false);
  const breathingRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const scriptsRef = useRef<HTMLDivElement>(null);
  
  // Get active quit attempt for reasons
  const { data: quitAttempt } = trpc.quitAttempts.getActive.useQuery();

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

  // Breathing Exercise Animation with Countdown
  useEffect(() => {
    if (!breathingActive) {
      setBreathCountdown(4);
      setBreathPhase('inhale');
      return;
    }

    let countdownInterval: NodeJS.Timeout | null = null;
    let isActive = true;

    // Define phases in order
    const phases: Array<{ phase: 'inhale' | 'hold' | 'exhale'; duration: number }> = [
      { phase: 'inhale', duration: 4 },
      { phase: 'hold', duration: 7 },
      { phase: 'exhale', duration: 8 },
    ];

    let currentPhaseIndex = 0;

    const startNextPhase = () => {
      if (!isActive) return;

      // Move to next phase (or restart cycle)
      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;
      const currentPhase = phases[currentPhaseIndex];

      // Clear any existing interval
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }

      setBreathPhase(currentPhase.phase);
      setBreathCountdown(currentPhase.duration);

      // Countdown every second
      let currentCount = currentPhase.duration;
      countdownInterval = setInterval(() => {
        if (!isActive) {
          if (countdownInterval) {
            clearInterval(countdownInterval);
          }
          return;
        }

        currentCount--;
        if (currentCount > 0) {
          setBreathCountdown(currentCount);
        } else {
          // Phase complete, move to next phase
          if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
          }
          startNextPhase();
        }
      }, 1000);
    };

    // Start with first phase (inhale)
    currentPhaseIndex = -1; // Will be incremented to 0 in startNextPhase
    startNextPhase();

    return () => {
      isActive = false;
      if (countdownInterval) {
        clearInterval(countdownInterval);
      }
    };
  }, [breathingActive]);

  const startTimer = () => {
    setActiveTimer(Date.now());
    setTimerSeconds(300);
    // Scroll to timer after a brief delay to ensure it's rendered
    setTimeout(() => {
      timerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const startBreathing = () => {
    setBreathingActive(true);
    // Scroll to breathing exercise after a brief delay to ensure it's rendered
    setTimeout(() => {
      breathingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const showThoughtReframe = () => {
    // Scroll to Emergency Scripts section
    setTimeout(() => {
      scriptsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const showWhyIQuit = () => {
    setShowReasons(true);
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
    { icon: Wind, title: "Deep Breathing", action: "Start 4-7-8 breathing", onClick: startBreathing },
    { icon: Clock, title: "5-Minute Rule", action: "Start timer", onClick: startTimer },
    { icon: Brain, title: "Thought Reframe", action: "Read scripts", onClick: showThoughtReframe },
    { icon: Heart, title: "Why I Quit", action: "View reasons", onClick: showWhyIQuit },
  ];

  return (
    <AppShell>
      <div className="xl:pb-10 xl:px-10 pb-5 px-5 overflow-y-auto custom-scrollbar-thin">
        <div className="flex flex-col lg:flex-row lg:gap-8 gap-6">
          {/* Left Column - Main Content */}
          <div className="flex-1 space-y-6">
            <div className='bg-white rounded-[10px] p-[30px]'>
              {/* Emergency Help Banner */}
              <div className="bg-[#561F7A] !rounded-t-[15px] xl:px-[33px] xl:py-[23px] px-[20px] py-[15px] mb-5 md:mb-8">
                <h1 className="text-[18px] lg:text-[24px] 2xl:text-[32px] font-semibold text-white mb-3">Emergency Help</h1>
                <p className="text-white text-[14px] font-normal">
                  You're experiencing a strong craving. This is normal. You can get through this.
                </p>
              </div>

              {/* Quick Actions */}
              <div>
                <div className="grid md:grid-cols-2 gap-4">
                  {copingStrategies.map((strategy) => (
                    <button
                      key={strategy.title}
                      onClick={strategy.onClick}
                      className="group p-[20px] bg-[#F2F2F2] hover:bg-[#e0e0e0] rounded-[10px] hover:shadow-sm transition-all text-left group flex items-end md:items-center justify-between"
                    >
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-[33px] h-[33px] flex justify-center items-center bg-[#561F7A] rounded-full">
                          <strategy.icon className="w-5 h-5 text-[#fff]" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-base text-[#561F7A] mb-1">{strategy.title}</h3>
                          <p className="text-[14px] font-normal text-[#000000]">{strategy.action}</p>
                        </div>
                      </div>
                      <div className="p-2 border border-[#561F7A] group-hover:bg-[#561F7A] rounded-full flex-shrink-0 ml-2">
                        <ArrowRight className="w-4 h-4 text-[#561F7A] group-hover:text-[#fff]" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Identify Reminders */}
            <div className='bg-white rounded-[10px] p-[30px]'>
              <div className="flex items-center gap-3 mb-5">
                <AlertCircle className="w-5 h-5 text-[rgb(86,31,122)]" />
                <h2 className="2xl:text-[25px] lg:text-[22px] md:text-[20px] text-[18px] font-semibold text-[#561F7A]">Identify Reminders</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {identityReminders.slice(0, 6).map((reminder, index) => (
                  <div
                    key={index}
                    className="p-4 2xl:h-[82px] lg:h-[72px] md:h-[62px] h-[52px] flex justify-center items-center bg-[#F2F2F2] rounded-[10px]"
                  >
                    <p className="text-[#000000] text-[14px] md:text-base font-medium text-center">{reminder}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Urge Surfing Guide */}
            <div className="bg-white rounded-[10px] p-[30px]">
              <h2 className="text-[25px] font-semibold text-[#561F7A] mb-2">Urge Surfing</h2>
              <p className="text-[#000000] text-[16px] font-normal mb-6">
                Imagine the craving as a wave. It rises, peaks, and falls. You don't have to fight it — just surf it.
              </p>
              <ol className="space-y-4 text-[#000000]">
                <li className="flex items-center text-base gap-3">
                  <span className="flex-shrink-0 2xl:w-[36px] 2xl:h-[36px] lg:w-[33px] lg:h-[33px] md:w-[30px] md:h-[30px] h-[27px] w-[27px] bg-[#561F7A] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </span>
                  <span><strong>Notice</strong> the craving without judgment. "I'm having a craving."</span>
                </li>
                <li className="flex items-center text-base gap-3"> 
                  <span className="flex-shrink-0 2xl:w-[36px] 2xl:h-[36px] lg:w-[33px] lg:h-[33px] md:w-[30px] md:h-[30px] h-[27px] w-[27px] bg-[#561F7A] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </span>
                  <span><strong>Breathe</strong> slowly and deeply. Feel it in your body.</span>
                </li>
                <li className="flex items-center text-base gap-3"> 
                  <span className="flex-shrink-0 2xl:w-[36px] 2xl:h-[36px] lg:w-[33px] lg:h-[33px] md:w-[30px] md:h-[30px] h-[27px] w-[27px] bg-[#561F7A] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </span>
                  <span><strong>Observe</strong> the craving rise and peak. Don't act on it.</span>
                </li>
                <li className="flex items-center text-base gap-3">
                  <span className="flex-shrink-0 2xl:w-[36px] 2xl:h-[36px] lg:w-[33px] lg:h-[33px] md:w-[30px] md:h-[30px] h-[27px] w-[27px] bg-[#561F7A] text-white rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </span>
                  <span><strong>Let it pass</strong>. The wave always crashes. It always does.</span>
                </li>
              </ol>
            </div>

            {/* Need More Support */}
            <div className="bg-[#FEF6E8] rounded-[10px] px-[30px] py-[18px]">
              <h2 className="xl:text-[25px] lg:text-[22px] md:text-[20px] text-[18px] font-semibold text-[#561F7A] mb-4">Need More Support?</h2>
              <div className="space-y-3 text-gray-900">
                <p className="text-[#000000] text-[16px] font-semibold">National Quitline:{' '}
                  <a href="tel:1-800-QUIT-NOW" className="text-[#561F7A] hover:underline font-medium">
                    1-800-QUIT-NOW (1-800-784-8669)
                  </a>
                </p>
                <p className="text-[#000000] text-[16px] font-semibold">
                  Crisis Support:{' '}
                  <a href="tel:988" className="text-[#561F7A] hover:underline font-medium">
                    988 (Suicide & Crisis Lifeline)
                  </a>
                </p>
                <p className="text-[#000000] text-[16px] font-semibold mt-4">
                  You're not alone. Reaching out for help is a sign of strength, not weakness.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Emergency Scripts */}
          <div className="lg:w-[30%] w-full">
            <div ref={scriptsRef} className="bg-white rounded-[10px] px-[30px] py-[18px]">
              <h2 className="2xl:text-[30px] lg:text-[25px] md:text-[20px] text-[18px] font-semibold text-[#561F7A] mb-4">Emergency Scripts</h2>
              <div className="space-y-4 max-h-[800px] overflow-y-auto custom-scrollbar-thin">
                {panicScripts.map((script, index) => (
                  <div
                    key={index}
                    className="2xl:p-[30px] lg:p-[25px] md:p-[20px] p-[15px] bg-[#F2F2F2] xl:rounded-[25px] rounded-[16px]"
                  >
                    <p className="text-gray-900 font-medium italic text-sm">"{script}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 4-7-8 Breathing Exercise */}
        {breathingActive && (
          <div ref={breathingRef} className="mt-6 bg-white rounded-[10px] p-[30px] border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="2xl:text-[30px] lg:text-[25px] md:text-[20px] text-[18px] font-semibold text-[#561F7A]">4-7-8 Breathing</h2>
              <button
                onClick={() => setBreathingActive(false)}
                className="px-4 py-2 bg-[#F2F2F2] hover:bg-[#e0e0e0] rounded-[10px] text-[14px] md:text-base font-medium text-[#561F7A] transition-colors"
              >
                Stop
              </button>
            </div>

            <div className="flex flex-col items-center space-y-8">
              {/* Breathing Circle Animation */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
                <div
                  className={`absolute inset-0 rounded-full transition-all ${
                    breathPhase === 'inhale'
                      ? 'scale-100 bg-[#561F7A] opacity-30'
                      : breathPhase === 'hold'
                      ? 'scale-100 bg-[#561F7A] opacity-50'
                      : 'scale-50 bg-[#F3EBF8] opacity-40'
                  }`}
                  style={{
                    transitionDuration:
                      breathPhase === 'inhale' ? '4s' : breathPhase === 'hold' ? '7s' : '8s',
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#561F7A] capitalize mb-2">
                      {breathPhase}
                    </p>
                    <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#561F7A] font-mono">
                      {breathCountdown}
                    </p>
                    <p className="text-sm sm:text-base text-[#561F7A] mt-2 font-medium">
                      {breathPhase === 'inhale' ? 'seconds' : breathPhase === 'hold' ? 'seconds' : 'seconds'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center max-w-md px-4">
                <p className="text-[#000000] text-sm sm:text-base font-normal">
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
          <div ref={timerRef} className="mt-6 bg-white rounded-[10px] p-[30px] border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="2xl:text-[30px] lg:text-[25px] md:text-[20px] text-[18px] font-semibold text-[#561F7A]">5-Minute Craving Timer</h2>
              <button
                onClick={() => setActiveTimer(null)}
                className="px-4 py-2 bg-[#F2F2F2] hover:bg-[#e0e0e0] rounded-[10px] text-sm font-medium text-[#561F7A] transition-colors"
              >
                Cancel
              </button>
            </div>

            <div className="text-center space-y-6">
              <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-[#561F7A] font-mono">
                {formatTime(timerSeconds)}
              </div>

              {timerSeconds > 240 && (
                <p className="text-[14px] md:text-base text-[#000000] font-normal">
                  Cravings peak and fade in 2-5 minutes. Just wait it out.
                </p>
              )}

              {timerSeconds <= 240 && timerSeconds > 120 && (
                <p className="text-[14px] md:text-base text-[#561F7A] font-semibold">
                  You're halfway there. The craving is weakening.
                </p>
              )}

              {timerSeconds <= 120 && timerSeconds > 60 && (
                <p className="text-[14px] md:text-base text-[#561F7A] font-bold">
                  Almost done! You're beating this craving.
                </p>
              )}

              {timerSeconds <= 60 && timerSeconds > 0 && (
                <p className="text-[14px] md:text-base text-[#561F7A] font-bold animate-pulse">
                  Final minute. You've got this!
                </p>
              )}

              {timerSeconds === 0 && (
                <div className="space-y-4">
                  <CheckCircle className="w-16 h-16 text-[#561F7A] mx-auto" />
                  <p className="text-[14px] md:text-base text-[#561F7A] font-bold">
                    You did it! The craving passed.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Why I Quit - Reasons Dialog */}
        <Dialog open={showReasons} onOpenChange={setShowReasons}>
          <DialogContent className="bg-white rounded-[10px] border border-gray-200 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-[25px] font-semibold text-[#561F7A] flex items-center gap-2">
                <Heart className="w-6 h-6 text-[#561F7A]" />
                Why I Quit
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {quitAttempt && quitAttempt.reasons && quitAttempt.reasons.length > 0 ? (
                <div className="space-y-3">
                  {quitAttempt.reasons.map((reason, index) => (
                    <div
                      key={index}
                      className="p-4 bg-[#F3EBF8] rounded-[10px] border border-[#561F7A]/20"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center bg-[#561F7A] rounded-full mt-0.5">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-[#000000] text-base font-medium flex-1">{reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <p className="text-[#000000] text-base font-normal mb-2">
                    No reasons added yet.
                  </p>
                  <p className="text-[#561F7A] text-sm font-normal">
                    Remember why you started this journey. Your reasons matter.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
