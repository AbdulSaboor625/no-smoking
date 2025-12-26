import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Heart,
  TrendingUp,
  Shield,
  Target,
  Sparkles,
  Award,
  DollarSign,
  Clock
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();

  const stats = [
    { value: '5x', label: 'Higher Success Rate', icon: TrendingUp },
    { value: '10k+', label: 'Lives Changed', icon: Award },
    { value: '72hrs', label: 'To Feel Better', icon: Clock },
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Science-Backed',
      description: 'Evidence-based methods proven to work'
    },
    {
      icon: Target,
      title: 'Personalized Plan',
      description: 'Tailored to your smoking habits'
    },
    {
      icon: Shield,
      title: '24/7 Support',
      description: 'AI-powered help when cravings hit'
    },
    {
      icon: DollarSign,
      title: 'Save Money',
      description: 'Track thousands in savings'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-500 to-orange-400 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-overlay filter blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-yellow-200 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000" />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2 text-white font-bold text-xl">
            <img src="/logo.png" alt="QuitSmart Logo" className="w-10 h-10 object-contain" />
            QuitSmart
          </div>
          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
            className="bg-white/95 hover:bg-white text-purple-700 font-semibold shadow-lg"
          >
            Log In
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12 space-y-6">
            <div className="inline-block">
              <span className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wide shadow-lg">
                Join 10,000+ Success Stories
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-tight">
              Your Last Day Smoking
              <br />
              <span className="text-yellow-300">Starts Today</span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Break free from nicotine in just 72 hours with personalized,
              science-backed support that actually works.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                onClick={() => navigate('/')}
                className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold shadow-2xl transform hover:scale-105 transition-all duration-200 border-4 border-yellow-300"
              >
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Start Your Quit Journey
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/education')}
                className="text-base sm:text-lg md:text-xl px-6 sm:px-8 md:px-12 py-4 sm:py-6 md:py-8 bg-white/10 hover:bg-white/20 text-white border-2 border-white/50 backdrop-blur-sm font-semibold"
              >
                See How It Works
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-xl p-6 transform hover:scale-105 transition-all duration-200">
                  <div className="flex flex-col items-center gap-3">
                    <stat.icon className="w-8 h-8 text-purple-600" />
                    <div className="text-4xl font-bold text-purple-700">{stat.value}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-white/95 backdrop-blur-sm border-0 shadow-lg p-6 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300"
              >
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <benefit.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-purple-900 to-purple-700 border-0 shadow-2xl p-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Ready to Quit for Good?
              </h2>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Your healthier, smoke-free life is just one click away.
                No credit card required to start.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/')}
                className="text-base sm:text-lg md:text-xl lg:text-2xl px-6 sm:px-10 md:px-14 lg:px-16 py-4 sm:py-6 md:py-7 lg:py-8 bg-yellow-400 hover:bg-yellow-300 text-purple-900 font-bold shadow-2xl transform hover:scale-110 transition-all duration-200"
              >
                Begin Your Journey Free
                <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 ml-2" />
              </Button>
              <p className="text-purple-200 text-sm mt-4">
                Takes less than 2 minutes to get started
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
