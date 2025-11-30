import { AppShell } from '@/components/layout/AppShell';
import { useState } from 'react';
import { ChevronDown, Minus } from 'lucide-react';

type SectionId = 'addiction' | 'withdrawal' | 'coping' | 'health' | 'tips';

export function EducationPage() {
  const [openSection, setOpenSection] = useState<SectionId | null>(null);

  const toggleSection = (section: SectionId) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <AppShell title="Education & Resources">
      <div className="max-w-4xl mx-auto px-6 py-16">
        {/* Hero Introduction */}
        <div className="mb-20 text-center">
          <h1 className="text-6xl font-extralight tracking-tight text-gray-900 mb-6">
            Your Journey to Freedom
          </h1>
          <p className="text-xl text-gray-500 font-light max-w-2xl mx-auto leading-relaxed">
            Understanding what lies ahead is the first step toward lasting change
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="space-y-2">
          {/* Understanding Addiction */}
          <AccordionSection
            title="Understanding Addiction"
            subtitle="How nicotine affects your brain"
            isOpen={openSection === 'addiction'}
            onToggle={() => toggleSection('addiction')}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">How Nicotine Works</h3>
                <p className="text-gray-600 leading-relaxed">
                  Nicotine is a highly addictive substance that affects your brain's reward system.
                  When you use nicotine, it triggers the release of dopamine - a "feel-good" chemical.
                  Your brain learns to crave this feeling, creating a powerful habit loop.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">The Addiction Cycle</h3>
                <div className="space-y-3">
                  {[
                    "Use nicotine → Brain releases dopamine → Feel pleasure",
                    "Nicotine leaves system → Dopamine drops → Feel discomfort",
                    "Crave nicotine to feel normal again → Repeat cycle"
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-light">
                        {i + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-l-2 border-blue-400 pl-6 py-2">
                <p className="text-gray-700 italic">
                  Breaking this cycle is possible. Your brain can rewire itself and create new,
                  healthier patterns. The first few weeks are the hardest, but it gets easier.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Physical Addiction</h4>
                  <p className="text-sm text-gray-600">
                    Your body becomes dependent on nicotine. Withdrawal symptoms appear when you quit.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 pt-2">
                    <li>Lasts 2-4 weeks</li>
                    <li>Includes cravings, irritability, headaches</li>
                    <li>Easier to overcome than psychological</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Psychological Addiction</h4>
                  <p className="text-sm text-gray-600">
                    Mental and emotional habits tied to using nicotine in certain situations.
                  </p>
                  <ul className="text-sm text-gray-600 space-y-1 pt-2">
                    <li>Lasts longer (months to years)</li>
                    <li>Triggered by routines, stress, emotions</li>
                    <li>Requires conscious habit replacement</li>
                  </ul>
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Withdrawal Timeline */}
          <AccordionSection
            title="Withdrawal Timeline"
            subtitle="What to expect and when"
            isOpen={openSection === 'withdrawal'}
            onToggle={() => toggleSection('withdrawal')}
          >
            <div className="space-y-6">
              {[
                {
                  time: "First 24 Hours",
                  desc: "Strong cravings, irritability, anxiety, difficulty concentrating. Stay busy, drink water, avoid triggers.",
                  intensity: 3
                },
                {
                  time: "2-3 Days",
                  desc: "Peak withdrawal symptoms, headaches, increased appetite, mood swings. Exercise helps, get plenty of sleep.",
                  intensity: 3
                },
                {
                  time: "Week 1",
                  desc: "Cravings become less intense, improved sleep, still irritable at times. Celebrate small wins, stay connected.",
                  intensity: 2
                },
                {
                  time: "Week 2-4",
                  desc: "Withdrawal symptoms fade, energy improves, occasional cravings. Build new routines, focus on benefits.",
                  intensity: 2
                },
                {
                  time: "Month 2-3",
                  desc: "Physical withdrawal mostly gone, psychological cravings may persist. Avoid complacency, keep tracking progress.",
                  intensity: 1
                },
                {
                  time: "Month 4+",
                  desc: "Rare cravings, new normal established, proud of progress. Stay aware of triggers, maintain healthy habits.",
                  intensity: 1
                }
              ].map((phase, i) => (
                <div key={i} className="border-l-4 pl-6 py-3" style={{
                  borderColor: phase.intensity === 3 ? '#ef4444' : phase.intensity === 2 ? '#f59e0b' : '#10b981'
                }}>
                  <h4 className="font-medium text-gray-900 mb-2">{phase.time}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{phase.desc}</p>
                </div>
              ))}
            </div>
          </AccordionSection>

          {/* Coping Strategies */}
          <AccordionSection
            title="Coping Strategies"
            subtitle="Tools to help you succeed"
            isOpen={openSection === 'coping'}
            onToggle={() => toggleSection('coping')}
          >
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Physical Strategies</h3>
                  <div className="space-y-3">
                    {[
                      { title: "Exercise", desc: "Walk, run, or do yoga to release endorphins" },
                      { title: "Deep Breathing", desc: "4-7-8 technique: inhale 4s, hold 7s, exhale 8s" },
                      { title: "Stay Hydrated", desc: "Water helps flush nicotine from your system" },
                      { title: "Healthy Snacks", desc: "Keep hands and mouth busy with carrots, gum, nuts" }
                    ].map((item, i) => (
                      <div key={i} className="hover:bg-gray-50 p-3 rounded transition-colors">
                        <p className="font-medium text-sm text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Mental Strategies</h3>
                  <div className="space-y-3">
                    {[
                      { title: "The 5-Minute Rule", desc: "Cravings peak and pass in ~5 minutes. Ride them out" },
                      { title: "Distract Yourself", desc: "Call someone, play a game, watch a video" },
                      { title: "Positive Self-Talk", desc: "\"I can do this. This feeling will pass.\"" },
                      { title: "Track Progress", desc: "Review your milestones and savings regularly" }
                    ].map((item, i) => (
                      <div key={i} className="hover:bg-gray-50 p-3 rounded transition-colors">
                        <p className="font-medium text-sm text-gray-900">{item.title}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h3 className="text-xl font-light text-gray-900 mb-6 text-center">
                  The 4 D's: Your Emergency Toolkit
                </h3>
                <div className="grid md:grid-cols-4 gap-6">
                  {[
                    { title: "Delay", desc: "Wait 5-10 minutes. The urge will pass." },
                    { title: "Distract", desc: "Do something else immediately." },
                    { title: "Deep Breathe", desc: "Take 10 slow, deep breaths." },
                    { title: "Drink Water", desc: "Sip water slowly to occupy yourself." }
                  ].map((item, i) => (
                    <div key={i} className="text-center">
                      <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
                      <p className="text-sm text-gray-600">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Health Benefits */}
          <AccordionSection
            title="Health Benefits"
            subtitle="Your body's recovery timeline"
            isOpen={openSection === 'health'}
            onToggle={() => toggleSection('health')}
          >
            <div className="space-y-8">
              <div className="space-y-4">
                {[
                  { time: "20 Minutes", benefit: "Heart rate and blood pressure drop to normal levels" },
                  { time: "12 Hours", benefit: "Carbon monoxide in blood drops to normal" },
                  { time: "2 Weeks", benefit: "Circulation improves, lung function increases up to 30%" },
                  { time: "1-3 Months", benefit: "Coughing and shortness of breath decrease significantly" },
                  { time: "1 Year", benefit: "Heart disease risk is cut in half" },
                  { time: "5 Years", benefit: "Stroke risk reduced to that of a non-smoker" },
                  { time: "10 Years", benefit: "Lung cancer death rate is half that of a smoker" },
                  { time: "15 Years", benefit: "Heart disease risk same as someone who never smoked" }
                ].map((item, i) => (
                  <div key={i} className="flex items-baseline gap-6 hover:bg-gray-50 p-4 rounded transition-colors">
                    <div className="flex-shrink-0 w-24">
                      <span className="font-medium text-sm text-gray-900">{item.time}</span>
                    </div>
                    <p className="text-sm text-gray-600">{item.benefit}</p>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-3 gap-6 pt-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Financial</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Save thousands per year</li>
                    <li>Lower insurance premiums</li>
                    <li>Reduced healthcare costs</li>
                    <li>More disposable income</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Social</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>No more social stigma</li>
                    <li>Better breath and smell</li>
                    <li>More time with loved ones</li>
                    <li>Positive role model</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Personal</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>Increased self-esteem</li>
                    <li>Better physical fitness</li>
                    <li>Improved taste and smell</li>
                    <li>Freedom from addiction</li>
                  </ul>
                </div>
              </div>
            </div>
          </AccordionSection>

          {/* Tips for Success */}
          <AccordionSection
            title="Tips for Success"
            subtitle="Strategies for common situations"
            isOpen={openSection === 'tips'}
            onToggle={() => toggleSection('tips')}
          >
            <div className="space-y-10">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    situation: "After Meals",
                    tips: ["Brush teeth immediately", "Go for a short walk", "Chew sugar-free gum", "Have a healthy dessert ready"]
                  },
                  {
                    situation: "Social Situations",
                    tips: ["Tell friends you've quit", "Avoid smoking areas", "Keep hands busy with a drink", "Plan an exit strategy"]
                  },
                  {
                    situation: "With Coffee or Alcohol",
                    tips: ["Switch to tea temporarily", "Avoid alcohol for first few weeks", "Create new coffee routines", "Drink water between beverages"]
                  },
                  {
                    situation: "During Stress",
                    tips: ["Practice deep breathing", "Use a stress ball or fidget toy", "Take a quick walk outside", "Call a supportive friend"]
                  },
                  {
                    situation: "While Driving",
                    tips: ["Remove lighters from car", "Keep healthy snacks in car", "Listen to engaging podcasts", "Take different routes if needed"]
                  },
                  {
                    situation: "First Thing in Morning",
                    tips: ["Change your morning routine", "Exercise or shower first", "Have breakfast ready", "Set positive intentions"]
                  }
                ].map((item, i) => (
                  <div key={i} className="border border-gray-200 p-5 rounded-lg hover:border-gray-300 transition-colors">
                    <h4 className="font-medium text-gray-900 mb-3">{item.situation}</h4>
                    <ul className="space-y-2">
                      {item.tips.map((tip, j) => (
                        <li key={j} className="text-sm text-gray-600 flex items-start">
                          <Minus className="h-3 w-3 mr-2 mt-1 flex-shrink-0 text-gray-400" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="text-xl font-light text-gray-900">Get Support</h3>

                <div className="space-y-4">
                  <div className="border-l-2 border-gray-300 pl-6 py-2">
                    <h4 className="font-medium text-gray-900 mb-2">Tell People You're Quitting</h4>
                    <p className="text-sm text-gray-600">
                      Share your goal with friends, family, and coworkers. Their support and
                      accountability can be incredibly powerful.
                    </p>
                  </div>

                  <div className="border-l-2 border-gray-300 pl-6 py-2">
                    <h4 className="font-medium text-gray-900 mb-2">Join Support Groups</h4>
                    <p className="text-sm text-gray-600 mb-2">Connect with others on the same journey:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Online forums and communities (Reddit r/stopsmoking)</li>
                      <li>Local support groups</li>
                      <li>Quitlines: 1-800-QUIT-NOW (free coaching)</li>
                    </ul>
                  </div>

                  <div className="border-l-2 border-gray-300 pl-6 py-2">
                    <h4 className="font-medium text-gray-900 mb-2">Consider Professional Help</h4>
                    <p className="text-sm text-gray-600 mb-2">Don't hesitate to seek professional support:</p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>Talk to your doctor about nicotine replacement therapy</li>
                      <li>Counseling or cognitive behavioral therapy (CBT)</li>
                      <li>Prescription medications (if appropriate)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-8 rounded-lg text-center">
                <p className="text-lg text-gray-700 mb-2 italic">
                  "Every craving you resist makes the next one easier."
                </p>
                <p className="text-sm text-gray-600">
                  You're not giving up something - you're gaining freedom.
                </p>
              </div>
            </div>
          </AccordionSection>
        </div>
      </div>
    </AppShell>
  );
}

// Accordion Section Component
function AccordionSection({
  title,
  subtitle,
  isOpen,
  onToggle,
  children
}: {
  title: string;
  subtitle: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
      <button
        onClick={onToggle}
        className="w-full px-8 py-6 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div>
          <h2 className="text-2xl font-light text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
        </div>
        <ChevronDown
          className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[5000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-8 py-8 bg-white border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}
