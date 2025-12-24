import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, BookOpen, Brain, Target, TrendingUp, Heart, Shield, Award, Users, 
  CheckCircle, ArrowRight, Menu, X, Phone, 
  Mail, Facebook, Twitter, Instagram, Youtube,  BarChart3, Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingPage() {
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/landing" className="flex items-center space-x-2">
              <img src="/logo.png" alt="QuitApp Logo" className="w-10 h-10 object-contain" />
              <span className="font-bold text-xl text-[#612F8D]">QuitApp</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-700 hover:text-[#612F8D] transition-colors">How It Works</a>
              <a href="#features" className="text-gray-700 hover:text-[#612F8D] transition-colors">Features</a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#612F8D] transition-colors">Success Stories</a>
              <a href="#faq" className="text-gray-700 hover:text-[#612F8D] transition-colors">FAQ</a>
              <Link to="/login">
                <Button variant="ghost" className="text-[#612F8D]">Login</Button>
              </Link>
              <Link to="/">
                <Button className="bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#131316] font-semibold">
                  Get Started
                </Button>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <nav className="flex flex-col space-y-4">
                <a href="#how-it-works" className="text-gray-700 hover:text-[#612F8D]">How It Works</a>
                <a href="#features" className="text-gray-700 hover:text-[#612F8D]">Features</a>
                <a href="#testimonials" className="text-gray-700 hover:text-[#612F8D]">Success Stories</a>
                <a href="#faq" className="text-gray-700 hover:text-[#612F8D]">FAQ</a>
                <Link to="/login" className="text-[#612F8D]">Login</Link>
                <Link to="/">
                  <Button className="w-full bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#131316]">
                    Get Started
                  </Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#612F8D] via-[#7A3FA8] to-[#612F8D] text-white py-20 md:py-32 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                The New Way to Stop Smoking
              </h1>
              <p className="text-xl md:text-2xl font-light mb-4 text-white/90">
                Quit Effortlessly, One Day at a Time
              </p>
              <p className="text-lg md:text-xl mb-8 text-white/80">
                Education + Awareness + One-Day Commitment = Freedom from Nicotine
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <Link to="/">
                  <Button 
                    size="lg" 
                    className="bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#131316] font-bold text-lg px-8 py-6 rounded-lg w-full sm:w-auto"
                  >
                    Start My Journey <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-lg w-full sm:w-auto"
                >
                  Watch Demo
                </Button>
              </div>

              {/* Trust Indicators */}
              <div className="flex items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#F9C015]" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-[#F9C015]" />
                  <span>30-Day Free Trial</span>
                </div>
              </div>
            </div>

            {/* Right Image/Visual */}
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="aspect-square bg-gradient-to-br from-[#F9C015]/20 to-[#612F8D]/20 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-[#F9C015] rounded-full mx-auto mb-4 flex items-center justify-center">
                      <Phone className="w-16 h-16 text-[#131316]" />
                    </div>
                    <p className="text-white/60 text-sm">App Preview</p>
                  </div>
                </div>
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#F9C015] rounded-full opacity-20 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-[#F9C015] rounded-full opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#612F8D]/5 rounded-xl p-6 border-2 border-[#612F8D]/10 hover:border-[#612F8D]/30 transition-colors">
              <div className="w-14 h-14 bg-[#612F8D] rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#612F8D] mb-2">No Nicotine Replacement</h3>
              <p className="text-gray-600 text-sm">Quit cold turkey the right way with proper education</p>
            </div>
            <div className="bg-[#612F8D]/5 rounded-xl p-6 border-2 border-[#612F8D]/10 hover:border-[#612F8D]/30 transition-colors">
              <div className="w-14 h-14 bg-[#612F8D] rounded-full flex items-center justify-center mb-4">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#612F8D] mb-2">Trigger Awareness</h3>
              <p className="text-gray-600 text-sm">Break automatic behaviors with smart notifications</p>
            </div>
            <div className="bg-[#612F8D]/5 rounded-xl p-6 border-2 border-[#612F8D]/10 hover:border-[#612F8D]/30 transition-colors">
              <div className="w-14 h-14 bg-[#612F8D] rounded-full flex items-center justify-center mb-4">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#612F8D] mb-2">One Day at a Time</h3>
              <p className="text-gray-600 text-sm">No overwhelming "forever" commitments</p>
            </div>
            <div className="bg-[#612F8D]/5 rounded-xl p-6 border-2 border-[#612F8D]/10 hover:border-[#612F8D]/30 transition-colors">
              <div className="w-14 h-14 bg-[#612F8D] rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-lg font-bold text-[#612F8D] mb-2">Real-Time Progress</h3>
              <p className="text-gray-600 text-sm">See your money saved, time freed, and cravings resisted</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="features" className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#612F8D] mb-4">
              Everything You Need to Quit Successfully
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive system covers every aspect of your quit journey
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Category 1: Education */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#612F8D] rounded-xl flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#612F8D] mb-4">Education Modules</h3>
              <p className="text-gray-600 mb-6">
                Learn why cold turkey works when you're properly educated. Short, simple lessons that remove fear and give you control.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Understanding addiction</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Withdrawal timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Coping strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Health benefits</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Education Module Screenshot</p>
                </div>
              </div>
            </div>

            {/* Category 2: Trigger Awareness */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#612F8D] rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#612F8D] mb-4">Trigger Awareness</h3>
              <p className="text-gray-600 mb-6">
                Break the autopilot loop. Identify triggers, set up notifications, and track your success rate.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Personal trigger identification</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Smart notifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Success rate tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Craving log history</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Trigger Tracking Dashboard</p>
                </div>
              </div>
            </div>

            {/* Category 3: Progress Tracking */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#612F8D] rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#612F8D] mb-4">Progress Tracking</h3>
              <p className="text-gray-600 mb-6">
                See your wins in real-time. Track money saved, time freed, cravings resisted, and units avoided.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Money saved calculator</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Time freed up tracker</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Success rate visualization</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Milestone celebrations</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Progress Dashboard Screenshot</p>
                </div>
              </div>
            </div>

            {/* Category 4: Daily Commitment */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#612F8D] rounded-xl flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#612F8D] mb-4">Daily Commitment</h3>
              <p className="text-gray-600 mb-6">
                One day at a time. No overwhelming "forever" thinking. Just today's commitment until bedtime.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Morning commitment</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Evening reflection</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Identity building</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Streak tracking</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Daily Commitment Interface</p>
                </div>
              </div>
            </div>

            {/* Category 5: Emergency Help */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#612F8D] rounded-xl flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#612F8D] mb-4">Emergency Help</h3>
              <p className="text-gray-600 mb-6">
                Your emergency toolkit when cravings strike. The 4 D's: Delay, Distract, Deep Breathe, Drink Water.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>4 D's emergency toolkit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Breathing exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Coping strategies</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Quick access tools</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Emergency Help Screen</p>
                </div>
              </div>
            </div>

            {/* Category 6: Milestones & Rewards */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
              <div className="w-16 h-16 bg-[#612F8D] rounded-xl flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#612F8D] mb-4">Milestones & Rewards</h3>
              <p className="text-gray-600 mb-6">
                Celebrate every win. Track milestones from 24 hours to 1 year and beyond.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>24 hours to 1 year milestones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Money saved milestones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Time freed milestones</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                  <span>Achievement badges</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Milestones & Achievements</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 bg-[#612F8D] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#F9C015] mb-2">10K+</div>
              <p className="text-white/90">Users Quit Successfully</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#F9C015] mb-2">97%</div>
              <p className="text-white/90">Success Rate</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#F9C015] mb-2">$2M+</div>
              <p className="text-white/90">Money Saved by Users</p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-[#F9C015] mb-2">30+</div>
              <p className="text-white/90">Days Average Quit Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#612F8D] mb-4">
              How We Help You Quit
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The Proven 3-Pillar Method That Works
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="w-24 h-24 bg-[#612F8D] rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#612F8D] mb-4">1. EDUCATION</h3>
              <p className="text-gray-600 leading-relaxed">
                Learn why cold turkey works when you're properly educated. 
                Understand that this isn't a "habit" - it's a nicotine addiction.
                Short, simple lessons that remove fear and give you control.
              </p>
              <div className="mt-6 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-400 text-sm">📸 Education Module Image</p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-[#612F8D] rounded-full flex items-center justify-center mx-auto mb-6">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#612F8D] mb-4">2. AWARENESS</h3>
              <p className="text-gray-600 leading-relaxed">
                Break the "autopilot" loop with our Trigger Awareness System.
                Identify your triggers (coffee, meals, driving, stress, etc.)
                Get notifications that interrupt automatic behaviors.
              </p>
              <div className="mt-6 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-400 text-sm">📸 Trigger Awareness Image</p>
              </div>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 bg-[#612F8D] rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-[#612F8D] mb-4">3. ONE-DAY COMMITMENT</h3>
              <p className="text-gray-600 leading-relaxed">
                You don't quit forever - you quit today until bedtime.
                No overwhelming pressure. Just today's commitment.
                Build your identity as a non-smoker, one day at a time.
              </p>
              <div className="mt-6 bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-400 text-sm">📸 One-Day Commitment Image</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#612F8D] mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-gray-600">
              Real people. Real results. Real freedom.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah M.',
                days: '45 days',
                quote: 'I tried everything. This app finally worked because it taught me WHY I was failing. The trigger awareness system changed everything.',
                image: '👩'
              },
              {
                name: 'Mike T.',
                days: '90 days',
                quote: 'The one-day commitment approach removed all the pressure. I\'m not thinking about forever, just today. It\'s been 90 days now!',
                image: '👨'
              },
              {
                name: 'Jessica L.',
                days: '120 days',
                quote: 'Seeing my progress in real-time kept me motivated. I\'ve saved over $1,200 and regained 80+ hours of my life. Worth every moment.',
                image: '👩'
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-[#612F8D] rounded-full flex items-center justify-center text-3xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-[#612F8D] font-semibold">{testimonial.days} smoke-free</p>
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed italic">"{testimonial.quote}"</p>
                <div className="mt-4 flex gap-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-5 h-5 text-[#F9C015]">
                      ★
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#612F8D] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'Do I need nicotine replacement products?',
                a: 'No. This method works without patches, gum, or medications. We educate you first, then you quit cold turkey the right way.'
              },
              {
                q: 'How long does it take to quit?',
                a: 'You quit one day at a time. Most people see significant progress within the first week, and physical withdrawal fades in 2-4 weeks. The mental game gets easier with each passing day.'
              },
              {
                q: 'What if I slip or relapse?',
                a: 'No shame. No guilt. You simply recommit today. The app helps you understand that slips happen, and you can take back control immediately.'
              },
              {
                q: 'Does this work for vaping?',
                a: 'Yes! This works for all nicotine products: cigarettes, vapes (disposable and refillable), nicotine pouches, dip, and chew. The addiction is the same: nicotine dependency.'
              },
              {
                q: 'Is there a free trial?',
                a: 'Yes, we offer a 30-day free trial so you can experience the full system before committing.'
              },
              {
                q: 'How is this different from other quit apps?',
                a: 'We focus on education BEFORE quitting, trigger awareness to break autopilot, and one-day commitments instead of overwhelming "forever" thinking. Created by someone who smoked for 30 years and quit effortlessly.'
              }
            ].map((faq, i) => {
              const faqId = `faq-${i}`;
              return (
                <AccordionSection
                  key={i}
                  id={faqId}
                  title={faq.q}
                  icon={<ChevronDown className="w-5 h-5" />}
                  isOpen={openSection === faqId}
                  onToggle={() => toggleSection(faqId)}
                >
                <p className="text-gray-700 leading-relaxed">{faq.a}</p>
              </AccordionSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Detailed Accordion Sections */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[#612F8D] mb-4">
              Learn More About Our Method
            </h2>
            <p className="text-xl text-gray-600">
              Explore each aspect of our proven system
            </p>
          </div>

          <div className="space-y-4">
            {/* Section 2: Understanding Addiction */}
            <AccordionSection
              id="understanding-addiction"
              title="Why Most People Fail - And How You Won't"
              icon={<Brain className="w-6 h-6" />}
              isOpen={openSection === 'understanding-addiction'}
              onToggle={() => toggleSection('understanding-addiction')}
            >
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Most people fail "cold turkey" not because it doesn't work, 
                  but because they weren't educated before quitting.
                </p>
                <div>
                  <h3 className="text-xl font-bold text-[#612F8D] mb-4">What You'll Learn:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">This is not a habit - it's a nicotine addiction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">How nicotine affects your brain's reward system</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">Why cravings are temporary (they peak in 5 minutes)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">The difference between physical and psychological addiction</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">How your brain can rewire itself</span>
                    </li>
                  </ul>
                </div>
                <p className="text-lg font-semibold text-[#612F8D]">
                  Our education modules prepare you mentally before you quit, 
                  removing fear and giving you the knowledge to succeed.
                </p>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: Brain diagram showing nicotine's effect, timeline visualization</p>
                </div>
              </div>
            </AccordionSection>

            {/* Section 3: Trigger Awareness */}
            <AccordionSection
              id="trigger-awareness"
              title="Break the Autopilot Loop - Your Trigger Awareness System"
              icon={<Brain className="w-6 h-6" />}
              isOpen={openSection === 'trigger-awareness'}
              onToggle={() => toggleSection('trigger-awareness')}
            >
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Smoking isn't "just a habit" - it's automatic behavior tied to triggers.
                </p>
                <div>
                  <h3 className="text-xl font-bold text-[#612F8D] mb-4">Common Triggers We Help You Manage:</h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {['Coffee/Caffeine', 'After Meals', 'Driving', 'Work Breaks', 'Stress', 'Social Situations', 'Boredom', 'Waking Up', 'Before Bed'].map((trigger) => (
                      <div key={trigger} className="bg-[#F5F5F5] rounded-lg p-3 text-center">
                        <span className="text-sm font-medium text-gray-700">{trigger}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-[#612F8D]/5 rounded-xl p-6 border-2 border-[#612F8D]/20">
                  <h3 className="text-xl font-bold text-[#612F8D] mb-4">How It Works:</h3>
                  <ol className="space-y-3 list-decimal list-inside text-gray-700">
                    <li>Identify your personal triggers during onboarding</li>
                    <li>Set up "caution tape" notifications for each trigger</li>
                    <li>Get real-time alerts that interrupt autopilot behavior</li>
                    <li>Track your success rate resisting cravings</li>
                    <li>See which triggers you're conquering</li>
                  </ol>
                </div>
                <div className="bg-[#F9C015]/10 rounded-lg p-4 border-l-4 border-[#F9C015]">
                  <p className="font-semibold text-gray-800 mb-2">Example Notification:</p>
                  <p className="text-gray-700 italic">"You usually smoke with coffee. Today, pause and breathe instead."</p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: Dashboard showing trigger tracking, success rate progress bar (purple card), phone notifications</p>
                </div>
              </div>
            </AccordionSection>

            {/* Section 4: Progress Tracking */}
            <AccordionSection
              id="progress-tracking"
              title="Watch Your Progress in Real-Time"
              icon={<TrendingUp className="w-6 h-6" />}
              isOpen={openSection === 'progress-tracking'}
              onToggle={() => toggleSection('progress-tracking')}
            >
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  See exactly how you're winning every single day:
                </p>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-[#612F8D] rounded-xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">💰</div>
                    <h3 className="text-xl font-bold mb-3">MONEY SAVED</h3>
                    <ul className="space-y-2 text-white/90">
                      <li>• Track daily, weekly, monthly, and yearly savings</li>
                      <li>• See 5-year projections</li>
                      <li>• Works for cigarettes, vapes, pouches, and dip</li>
                    </ul>
                  </div>
                  <div className="bg-[#612F8D] rounded-xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">⏰</div>
                    <h3 className="text-xl font-bold mb-3">TIME FREED UP</h3>
                    <ul className="space-y-2 text-white/90">
                      <li>• Calculate hours and days you've regained</li>
                      <li>• See how much life you've restored</li>
                      <li>• Example: 20 cigarettes/day = 1.67 hours daily</li>
                    </ul>
                  </div>
                  <div className="bg-[#612F8D] rounded-xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">📊</div>
                    <h3 className="text-xl font-bold mb-3">CRAVINGS RESISTED</h3>
                    <ul className="space-y-2 text-white/90">
                      <li>• Track every trigger you successfully resist</li>
                      <li>• See your success rate percentage</li>
                      <li>• Watch your progress bar fill as you win</li>
                    </ul>
                  </div>
                  <div className="bg-[#612F8D] rounded-xl p-6 text-white">
                    <div className="text-4xl font-bold mb-2">📈</div>
                    <h3 className="text-xl font-bold mb-3">UNITS AVOIDED</h3>
                    <ul className="space-y-2 text-white/90">
                      <li>• Count cigarettes, vapes, or pouches you haven't used</li>
                      <li>• Visual progress that motivates daily</li>
                      <li>• See your impact in real numbers</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: Dashboard screenshot, progress bar visualization (purple with yellow fill), money calculator</p>
                </div>
              </div>
            </AccordionSection>

            {/* Section 5: One-Day Commitment */}
            <AccordionSection
              id="one-day-commitment"
              title="You Don't Quit Forever - You Quit Today"
              icon={<Target className="w-6 h-6" />}
              isOpen={openSection === 'one-day-commitment'}
              onToggle={() => toggleSection('one-day-commitment')}
            >
              <div className="space-y-6">
                <p className="text-2xl font-bold text-[#612F8D] text-center">
                  The secret to lasting success? Stop thinking about "forever."
                </p>
                <div className="bg-[#612F8D]/5 rounded-xl p-6 border-2 border-[#612F8D]/20">
                  <h3 className="text-xl font-bold text-[#612F8D] mb-4">Our One-Day Commitment System:</h3>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start gap-3">
                      <span className="text-[#F9C015] font-bold">•</span>
                      <span><strong>Every morning:</strong> "Are you willing to stay nicotine-free today?"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#F9C015] font-bold">•</span>
                      <span><strong>Every night:</strong> Celebrate today's win</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#F9C015] font-bold">•</span>
                      <span><strong>No pressure</strong> about tomorrow</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#F9C015] font-bold">•</span>
                      <span>Build identity: <strong>"I am becoming a non-smoker"</strong></span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-[#F9C015] font-bold">•</span>
                      <span>Tomorrow will take care of itself</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-[#F9C015]/10 rounded-lg p-6 border-l-4 border-[#F9C015]">
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Why This Works:</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Most people fail because "forever" feels impossible.
                    But "today" is always manageable.
                    You're not giving up something - you're gaining freedom.
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: Calendar showing "today" highlighted, morning/evening commitment flow</p>
                </div>
              </div>
            </AccordionSection>

            {/* Section 6: Health Benefits */}
            <AccordionSection
              id="health-benefits"
              title="Your Body's Recovery - What Happens When You Quit"
              icon={<Heart className="w-6 h-6" />}
              isOpen={openSection === 'health-benefits'}
              onToggle={() => toggleSection('health-benefits')}
            >
              <div className="space-y-6">
                <p className="text-lg font-semibold text-gray-800 text-center mb-6">
                  Your body starts healing immediately:
                </p>
                <div className="space-y-4">
                  {[
                    { time: '20 Minutes', benefit: 'Heart rate and blood pressure normalize' },
                    { time: '12 Hours', benefit: 'Carbon monoxide levels drop to normal' },
                    { time: '2 Weeks', benefit: 'Circulation improves, lung function increases 30%' },
                    { time: '1-3 Months', benefit: 'Coughing and shortness of breath decrease' },
                    { time: '1 Year', benefit: 'Heart disease risk cut in half' },
                    { time: '5 Years', benefit: 'Stroke risk reduced to non-smoker levels' },
                    { time: '10 Years', benefit: 'Lung cancer death rate cut in half' },
                    { time: '15 Years', benefit: 'Heart disease risk same as never-smoker' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 bg-[#F5F5F5] rounded-lg">
                      <div className="bg-[#612F8D] text-white rounded-lg px-4 py-2 font-bold min-w-[120px] text-center">
                        {item.time}
                      </div>
                      <p className="text-gray-700 pt-2 flex-1">{item.benefit}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F9C015]/10 rounded-lg p-4 border-l-4 border-[#F9C015]">
                  <p className="text-gray-700">
                    <strong>Plus:</strong> Better breath, improved taste and smell, 
                    increased energy, better sleep, and more.
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: Timeline visualization, health benefits infographic, body diagram</p>
                </div>
              </div>
            </AccordionSection>

            {/* Section 7: Coping Strategies */}
            <AccordionSection
              id="coping-strategies"
              title="Your Emergency Toolkit - When Cravings Strike"
              icon={<Shield className="w-6 h-6" />}
              isOpen={openSection === 'coping-strategies'}
              onToggle={() => toggleSection('coping-strategies')}
            >
              <div className="space-y-6">
                <p className="text-2xl font-bold text-[#612F8D] text-center mb-6">
                  The 4 D's - Your Emergency Toolkit
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { letter: 'D', title: 'DELAY', desc: 'Wait 5-10 minutes. The urge will pass. Cravings peak and fade quickly.' },
                    { letter: 'D', title: 'DISTRACT', desc: 'Do something else immediately. Call someone, play a game, watch a video.' },
                    { letter: 'D', title: 'DEEP BREATHE', desc: 'Take 10 slow, deep breaths. The 4-7-8 technique works wonders.' },
                    { letter: 'D', title: 'DRINK WATER', desc: 'Sip water slowly to occupy yourself. Helps flush nicotine from your system.' },
                  ].map((item, i) => (
                    <div key={i} className="bg-[#612F8D] rounded-xl p-6 text-white text-center">
                      <div className="text-5xl font-bold mb-3 text-[#F9C015]">{item.letter}</div>
                      <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                      <p className="text-sm text-white/90">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="grid md:grid-cols-3 gap-6 mt-6">
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <h4 className="font-bold text-[#612F8D] mb-2">Physical Strategies</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Exercise</li>
                      <li>• Healthy snacks</li>
                      <li>• Stay hydrated</li>
                    </ul>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <h4 className="font-bold text-[#612F8D] mb-2">Mental Strategies</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• The 5-minute rule</li>
                      <li>• Positive self-talk</li>
                      <li>• Track progress</li>
                    </ul>
                  </div>
                  <div className="bg-[#F5F5F5] rounded-lg p-4">
                    <h4 className="font-bold text-[#612F8D] mb-2">Situational</h4>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• After meals</li>
                      <li>• Social situations</li>
                      <li>• Stress moments</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: 4 D's icon set, person using coping strategies, emergency help interface</p>
                </div>
              </div>
            </AccordionSection>

            {/* Section 8: Milestones */}
            <AccordionSection
              id="milestones"
              title="Celebrate Every Win - Your Milestone Journey"
              icon={<Award className="w-6 h-6" />}
              isOpen={openSection === 'milestones'}
              onToggle={() => toggleSection('milestones')}
            >
              <div className="space-y-6">
                <p className="text-lg text-gray-700 text-center mb-6">
                  We celebrate every step of your journey:
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { milestone: '24 Hours', desc: 'Your first day free' },
                    { milestone: '3 Days', desc: 'Physical withdrawal fading' },
                    { milestone: '1 Week', desc: 'You\'re building new patterns' },
                    { milestone: '10 Days', desc: 'Cravings becoming less intense' },
                    { milestone: '30 Days', desc: 'Major health improvements' },
                    { milestone: '60 Days', desc: 'New routines established' },
                    { milestone: '90 Days', desc: 'Freedom path complete' },
                    { milestone: '6 Months', desc: 'Rare cravings' },
                    { milestone: '1 Year', desc: 'Proud non-smoker' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gradient-to-br from-[#612F8D] to-[#7A3FA8] rounded-xl p-6 text-white text-center">
                      <div className="text-3xl font-bold mb-2 text-[#F9C015]">{item.milestone}</div>
                      <p className="text-sm text-white/90">{item.desc}</p>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F9C015]/10 rounded-lg p-4 border-l-4 border-[#F9C015]">
                  <p className="text-gray-700">
                    <strong>Plus:</strong> Money milestones, time milestones, and craving-free streaks
                  </p>
                  <p className="text-gray-700 mt-2 font-semibold">
                    Every milestone is a victory worth celebrating.
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: Milestone badges, progress timeline, celebration visuals</p>
                </div>
              </div>
            </AccordionSection>

            {/* Section 9: Who This Works For */}
            <AccordionSection
              id="who-this-works-for"
              title="Works for All Nicotine Users"
              icon={<Users className="w-6 h-6" />}
              isOpen={openSection === 'who-this-works-for'}
              onToggle={() => toggleSection('who-this-works-for')}
            >
              <div className="space-y-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  This app works for everyone struggling with nicotine:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Cigarette Smokers',
                    'Vape Users (disposable & refillable)',
                    'Nicotine Pouch Users',
                    'Dip & Chew Users',
                    'Mixed Users (multiple products)',
                  ].map((type, i) => (
                    <div key={i} className="bg-[#F5F5F5] rounded-lg p-4 flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-[#612F8D] flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{type}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#612F8D]/5 rounded-xl p-6 border-2 border-[#612F8D]/20">
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>The addiction is the same:</strong> nicotine dependency.
                  </p>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    <strong>The solution is the same:</strong> education, awareness, and commitment.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Whether you smoke 5 cigarettes a day or 2 packs,
                    whether you vape occasionally or constantly,
                    the method works because it addresses the root cause:
                    <strong className="text-[#612F8D]"> the mental addiction to nicotine.</strong>
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: Icons representing different product types, diverse group of people</p>
                </div>
              </div>
            </AccordionSection>

            {/* Section 10: What Makes Different */}
            <AccordionSection
              id="what-makes-different"
              title="Why This Method Works When Others Fail"
              icon={<CheckCircle className="w-6 h-6" />}
              isOpen={openSection === 'what-makes-different'}
              onToggle={() => toggleSection('what-makes-different')}
            >
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-red-50 rounded-xl p-6 border-2 border-red-200">
                    <h3 className="text-xl font-bold text-red-700 mb-4">❌ What Doesn't Work:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Willpower alone (it's not enough)</li>
                      <li>• Nicotine replacement (you're still addicted)</li>
                      <li>• Fear tactics (they create anxiety)</li>
                      <li>• "Forever" thinking (it's overwhelming)</li>
                      <li>• Going in unprepared (knowledge is power)</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 rounded-xl p-6 border-2 border-green-200">
                    <h3 className="text-xl font-bold text-green-700 mb-4">✅ What Does Work:</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Education before quitting (remove fear)</li>
                      <li>• Trigger awareness (break autopilot)</li>
                      <li>• One-day commitment (manageable)</li>
                      <li>• Real-time tracking (see progress)</li>
                      <li>• Support without shame (we've been there)</li>
                    </ul>
                  </div>
                </div>
                <div className="bg-[#612F8D] rounded-xl p-6 text-white text-center">
                  <p className="text-lg font-semibold">
                    Created by someone who smoked for 30 years 
                    and quit effortlessly using this exact method.
                  </p>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: Comparison chart, founder story visual, method comparison</p>
                </div>
              </div>
            </AccordionSection>

            {/* Section 11: Getting Started */}
            <AccordionSection
              id="getting-started"
              title="Start Your Journey Today - It's Simple"
              icon={<ArrowRight className="w-6 h-6" />}
              isOpen={openSection === 'getting-started'}
              onToggle={() => toggleSection('getting-started')}
            >
              <div className="space-y-6">
                <p className="text-lg text-gray-700 text-center mb-6">
                  Your Personalized Quit Plan in 8 Steps:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    'Welcome & Introduction',
                    'Product Type Selection (cigarettes, vape, pouches, etc.)',
                    'Usage Level Assessment',
                    'Trigger Identification',
                    'Reasons to Quit',
                    'Fears Assessment',
                    'Readiness Level (1-10)',
                    'Quit Timing (today, tomorrow, or learn first)',
                  ].map((step, i) => (
                    <div key={i} className="bg-[#612F8D] rounded-lg p-4 text-white flex items-start gap-3">
                      <div className="bg-[#F9C015] text-[#131316] rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <span className="pt-1">{step}</span>
                    </div>
                  ))}
                </div>
                <div className="bg-[#F9C015]/10 rounded-xl p-6 border-2 border-[#F9C015]/30">
                  <h3 className="text-xl font-bold text-[#612F8D] mb-4">Then You Get:</h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {[
                      'Customized education modules',
                      'Personalized trigger alerts',
                      'Daily commitment system',
                      'Real-time progress tracking',
                      'Emergency help tools',
                      'Milestone celebrations',
                    ].map((feature, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-[#612F8D] flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="text-center">
                  <Link to="/">
                    <Button 
                      size="lg" 
                      className="bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#131316] font-bold text-lg px-8 py-6 rounded-lg"
                    >
                      Ready to quit the right way? Let's build your plan. <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                </div>
                <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
                  <p className="text-gray-400 text-sm">📸 Image: Onboarding flow visualization, step-by-step process, app interface preview</p>
                </div>
              </div>
            </AccordionSection>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-gradient-to-r from-[#612F8D] via-[#7A3FA8] to-[#612F8D] text-white py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Ready to Quit the Right Way?</h2>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            Join thousands who've quit using this proven method
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button 
                size="lg" 
                className="bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#131316] font-bold text-lg px-8 py-6 rounded-lg w-full sm:w-auto"
              >
                Start My Journey <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button 
              size="lg" 
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 font-semibold text-lg px-8 py-6 rounded-lg w-full sm:w-auto"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <img src="/logo.png" alt="QuitApp Logo" className="w-10 h-10 object-contain" />
                <span className="font-bold text-xl">QuitApp</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                The new way to stop smoking. Quit effortlessly, one day at a time.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-[#F9C015] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#F9C015] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#F9C015] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-[#F9C015] transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#testimonials" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="font-bold text-lg mb-4">Resources</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Education Modules</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trigger Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Health Benefits</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Coping Strategies</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:support@quitapp.com" className="hover:text-white transition-colors">support@quitapp.com</a>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <a href="tel:+1234567890" className="hover:text-white transition-colors">1-800-QUIT-NOW</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2024 QuitApp. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Accordion Component
function AccordionSection({
  id = '',
  title,
  icon,
  isOpen,
  onToggle,
  children
}: {
  id?: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div key={id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-[#612F8D] transition-colors shadow-sm">
      <button
        onClick={onToggle}
        className="w-full px-6 py-5 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="text-[#612F8D]">
            {icon}
          </div>
          <h2 className="text-xl font-bold text-gray-900">{title}</h2>
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
        <div className="px-6 py-6 bg-white border-t border-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}





