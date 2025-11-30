import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { type ProductType } from '@smoking-quit/shared-types';
import { useToast } from '@/hooks/use-toast';
import { useAuthStore } from '@/stores/authStore';

const productOptions: { value: ProductType; label: string; description: string }[] = [
  { value: 'cigarettes', label: 'Cigarettes', description: 'Traditional cigarettes' },
  { value: 'vape_disposable', label: 'Vape', description: 'E-cigarettes and vaping devices' },
  { value: 'pouches', label: 'Pouches', description: 'Tobacco-free pouches' },
  { value: 'dip', label: 'Dip/Chew', description: 'Smokeless tobacco' },
];

type OnboardingFormData = {
  productType: ProductType | null;
  weeklyUsage: string;
  monthlySpending: string;
  duration: string;
  firstName: string;
  lastName: string;
  name: string; // Kept for backward compatibility
  email: string;
  phone: string;
  optInMessages: boolean;
  password: string;
  declinedInitialOffer: boolean;
};

export function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [showFlashSale, setShowFlashSale] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [seatsLeft, setSeatsLeft] = useState(6);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setAuth } = useAuthStore();
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isValidatingEmail, setIsValidatingEmail] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<ProductType | null>(null);

  // Load saved progress from localStorage
  const [formData, setFormData] = useState<OnboardingFormData>(() => {
    const saved = localStorage.getItem('onboarding-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          productType: parsed.productType || null,
          weeklyUsage: parsed.weeklyUsage || '',
          monthlySpending: parsed.monthlySpending || '',
          duration: parsed.duration || '',
          firstName: parsed.firstName || '',
          lastName: parsed.lastName || '',
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          optInMessages: parsed.optInMessages || false,
          password: parsed.password || '',
          declinedInitialOffer: parsed.declinedInitialOffer || false,
        };
      } catch {
        return {
          productType: null,
          weeklyUsage: '',
          monthlySpending: '',
          duration: '',
          firstName: '',
          lastName: '',
          name: '',
          email: '',
          phone: '',
          optInMessages: false,
          password: '',
          declinedInitialOffer: false,
        };
      }
    }
    return {
      productType: null,
      weeklyUsage: '',
      monthlySpending: '',
      duration: '',
      firstName: '',
      lastName: '',
      name: '',
      email: '',
      phone: '',
      optInMessages: false,
      password: '',
      declinedInitialOffer: false,
    };
  });

  // Auto-save progress to localStorage
  useEffect(() => {
    localStorage.setItem('onboarding-progress', JSON.stringify(formData));
  }, [formData]);

  // Clear product type selection when returning to step 1 (no default selection)
  useEffect(() => {
    if (step === 1) {
      setFormData(prev => ({ ...prev, productType: null }));
    }
  }, [step]);

  // Countdown timer for step 6 and flash sale (5 minutes)
  useEffect(() => {
    if ((step === 6 || showFlashSale) && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [step, showFlashSale, timeLeft]);

  // Seats countdown - random interval between 1-5 seconds
  useEffect(() => {
    if (showFlashSale && seatsLeft > 1) {
      const randomDelay = Math.random() * 4000 + 1000; // 1-5 seconds
      const timer = setTimeout(() => {
        setSeatsLeft((prev) => prev - 1);
      }, randomDelay);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [showFlashSale, seatsLeft]);

  const createQuitAttempt = trpc.quitAttempts.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Your journey begins!',
        description: "You've taken the first step. We're here with you, one day at a time.",
      });
      navigate('/dashboard');
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const validateEmail = async (): Promise<boolean> => {
    setEmailError(null);
    setIsValidatingEmail(true);

    try {
      // Use relative URL if VITE_API_URL is not set (for same-origin deployment)
      const apiUrl = import.meta.env.VITE_API_URL || '';
      // Check if email is already registered
      const response = await fetch(`${apiUrl}/auth/check-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.exists) {
        setEmailError('This email is already registered. Please login instead.');
        setIsValidatingEmail(false);
        return false;
      }

      // User is not registered, proceed forward silently
      setIsValidatingEmail(false);
      return true;
    } catch (error) {
      console.error('Email validation error:', error);
      setEmailError('Unable to check email. Please try again.');
      setIsValidatingEmail(false);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!formData.productType || !formData.name || !formData.email || !formData.password) {
      toast({
        title: 'Error',
        description: 'Please complete all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Use relative URL if VITE_API_URL is not set (for same-origin deployment)
      const apiUrl = import.meta.env.VITE_API_URL || '';
      // First, sign up the user
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          username: formData.name,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Signup failed');
      }

      const { user, token } = await response.json();

      // Store auth in Zustand
      setAuth(user, token);

      // Then create quit attempt with daily usage
      const dailyNum = parseFloat(formData.weeklyUsage) || 0;
      const monthlyNum = parseFloat(formData.monthlySpending) || 0;
      // weeklyUsage now stores daily usage for all product types
      createQuitAttempt.mutate({
        quitDate: new Date().toISOString(),
        productType: formData.productType,
        dailyUsage: Math.round(dailyNum),
        cost: monthlyNum / 30,
        reasons: [],
        triggers: [],
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Registration failed',
        variant: 'destructive',
      });
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 7));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const progressPercent = (step / 7) * 100;

  // Format time for countdown
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Calculate user's habit statistics
  const getHabitStats = () => {
    const dailyNum = parseFloat(formData.weeklyUsage) || 0;
    const monthlyNum = parseFloat(formData.monthlySpending) || 0;
    const durationNum = parseFloat(formData.duration) || 0;

    // weeklyUsage now stores daily usage for all product types
    const yearlyUsage = Math.round(dailyNum * 365); // daily * days in year
    const yearlySpending = Math.round(monthlyNum * 12);
    const totalSpent = Math.round(monthlyNum * 12 * durationNum);

    const productLabels = {
      cigarettes: { singular: 'cigarette', plural: 'cigarettes', unit: 'cigarettes' },
      vape_disposable: { singular: 'vape', plural: 'vapes', unit: 'vapes' },
      vape_refillable: { singular: 'vape', plural: 'vapes', unit: 'vapes' },
      pouches: { singular: 'pouch', plural: 'pouches', unit: 'pouches' },
      dip: { singular: 'can', plural: 'cans', unit: 'cans' },
      multiple: { singular: 'product', plural: 'products', unit: 'units' },
    };

    const label = formData.productType ? productLabels[formData.productType] : productLabels.cigarettes;

    return {
      yearlyUsage,
      yearlySpending,
      totalSpent,
      label,
    };
  };

  // Step-specific handlers
  const selectProductType = (productType: ProductType) => {
    setFormData({ ...formData, productType });
    setTimeout(nextStep, 300);
  };

  // Generate number options based on product type
  const getWeeklyUsageOptions = (): number[] => {
    if (formData.productType === 'cigarettes') {
      // Packs per day: 1-10
      return Array.from({ length: 10 }, (_, i) => i + 1);
    } else if (formData.productType === 'vape_disposable') {
      // Vapes per day: 1-10
      return Array.from({ length: 10 }, (_, i) => i + 1);
    } else if (formData.productType === 'pouches') {
      // Pouches per day: 1-20
      return Array.from({ length: 20 }, (_, i) => i + 1);
    } else if (formData.productType === 'dip') {
      // Cans per day: 1-5
      return Array.from({ length: 5 }, (_, i) => i + 1);
    }
    // Default: 1-10
    return Array.from({ length: 10 }, (_, i) => i + 1);
  };

  const getStepTitle = () => {
    switch (step) {
      case 1:
        return 'What are you quitting?';
      case 2:
        if (formData.productType === 'cigarettes') {
          return 'How Many Packs Per Day?';
        } else if (formData.productType === 'vape_disposable') {
          return 'How Many Vapes Per Day?';
        } else if (formData.productType === 'pouches') {
          return 'How Many Pouches Per Day?';
        } else if (formData.productType === 'dip') {
          return 'How Many Cans Per Day?';
        }
        return 'How Many Per Day?';
      case 3:
        if (formData.productType === 'cigarettes') {
          return 'Cost Per Pack';
        } else if (formData.productType === 'vape_disposable') {
          return 'Cost Per Vape';
        } else if (formData.productType === 'pouches') {
          return 'Cost Per Pouch';
        } else if (formData.productType === 'dip') {
          return 'Cost Per Can';
        }
        return 'Cost Per Unit';
      case 4:
        if (formData.productType === 'cigarettes') {
          return 'How long have you been smoking?';
        } else if (formData.productType === 'vape_disposable') {
          return 'How long have you been vaping?';
        } else if (formData.productType === 'pouches') {
          return 'How long have you been using pouches?';
        } else if (formData.productType === 'dip') {
          return 'How long have you been dipping?';
        }
        return 'How long have you been using?';
      case 5:
        return 'Join - Your information';
      case 6:
        return 'Start your journey';
      case 7:
        return 'Create your account';
      default:
        return '';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 1:
        return ''; // Subtitle removed per design update
      case 2:
        return ''; // Subtitle removed per design update
      case 3:
        return ''; // Subtitle removed per design update
      case 4:
        return ''; // Subtitle removed per design update
      case 5:
        return ''; // Subtitle removed per design update
      case 6:
        return 'Ready to take control?';
      case 7:
        return 'Secure your account';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-xl">
        <CardHeader>
          <div className="mb-4">
            <Progress value={progressPercent} className="h-2" />
            <p className="text-xs text-white mt-2 text-center">
              Step {step} of 7
            </p>
          </div>
          {step !== 6 && <CardTitle className="text-2xl text-center">{getStepTitle()}</CardTitle>}
          {step !== 6 && <CardDescription className="text-center text-white">{getStepDescription()}</CardDescription>}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Step 1: Product Type - Radio Buttons */}
            {step === 1 && (
              <div className="space-y-4">
                <RadioGroup
                  value={formData.productType || ''}
                  onValueChange={(value) => selectProductType(value as ProductType)}
                >
                  {productOptions.map((option) => {
                    const isSelected = formData.productType === option.value;
                    const isHovered = hoveredOption === option.value;

                    return (
                      <Label
                        key={option.value}
                        htmlFor={option.value}
                        className={`border-2 rounded-full p-4 cursor-pointer transition-all flex ${
                          isSelected
                            ? 'border-white bg-gray-50'
                            : isHovered
                            ? 'border-white bg-[#FFC107]'
                            : 'border-white'
                        }`}
                        onMouseEnter={() => {
                          if (!isSelected) {
                            setHoveredOption(option.value);
                          }
                        }}
                        onMouseLeave={() => {
                          if (!isSelected) {
                            setHoveredOption(null);
                          }
                        }}
                      >
                        <div className="flex items-center space-x-3 flex-1">
                          <RadioGroupItem value={option.value} id={option.value} className="mt-1 border-black" />
                          <div className="flex-1">
                            <div className={`font-semibold text-lg ${
                              isHovered ? 'text-black' : 'text-white'
                            }`}>
                              {option.label}
                            </div>
                            <div className={`text-sm ${
                              isSelected
                                ? 'text-black/70'
                                : isHovered
                                ? 'text-black/80'
                                : 'text-white/90'
                            }`}>
                              {option.description}
                            </div>
                          </div>
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Daily Usage Select */}
            {step === 2 && (
              <div className="space-y-4 py-6">
                <div className="space-y-2 text-center">
                  <Select
                    value={formData.weeklyUsage}
                    onValueChange={(value) => setFormData({ ...formData, weeklyUsage: value })}
                  >
                    <SelectTrigger className="text-lg h-12 text-center">
                      <SelectValue placeholder="Select a number" />
                    </SelectTrigger>
                    <SelectContent>
                      {getWeeklyUsageOptions().map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={nextStep}
                  className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold"
                  size="lg"
                  disabled={!formData.weeklyUsage.trim()}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 3: Monthly Spending Input */}
            {step === 3 && (
              <div className="space-y-4 py-6">
                <div className="space-y-2 text-center">
                  <Label htmlFor="monthlySpending" className="text-center block">Amount in dollars</Label>
                  <Input
                    id="monthlySpending"
                    type="number"
                    placeholder="e.g., 300"
                    value={formData.monthlySpending}
                    onChange={(e) => setFormData({ ...formData, monthlySpending: e.target.value })}
                    className="text-lg h-12 text-center"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={nextStep}
                  className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold"
                  size="lg"
                  disabled={!formData.monthlySpending.trim()}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 4: Duration Input */}
            {step === 4 && (
              <div className="space-y-4 py-6">
                <div className="space-y-2 text-center">
                  <Label htmlFor="duration" className="text-center block">Number of years</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="text-lg h-12 text-center"
                    autoFocus
                  />
                </div>
                <Button
                  onClick={nextStep}
                  className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold"
                  size="lg"
                  disabled={!formData.duration.trim()}
                >
                  Continue
                </Button>
              </div>
            )}

            {/* Step 5: User Info Form */}
            {step === 5 && (
              <div className="space-y-4 py-6">
                <div className="space-y-2 text-center">
                  <Label htmlFor="firstName" className="text-center block">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value, name: `${e.target.value} ${formData.lastName}`.trim() })}
                    className="text-lg h-12 text-center"
                    autoFocus
                  />
                </div>
                <div className="space-y-2 text-center">
                  <Label htmlFor="lastName" className="text-center block">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value, name: `${formData.firstName} ${e.target.value}`.trim() })}
                    className="text-lg h-12 text-center"
                  />
                </div>
                <div className="space-y-2 text-center">
                  <Label htmlFor="email" className="text-center block">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      setEmailError(null);
                    }}
                    className="text-lg h-12 text-center"
                  />
                  {emailError && (
                    <p className="text-sm text-red-500">{emailError}</p>
                  )}
                </div>
                <div className="space-y-2 text-center">
                  <Label htmlFor="phone" className="text-center block">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="555-123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="text-lg h-12 text-center"
                  />
                </div>
                {formData.phone && (
                  <div className="flex items-center justify-center space-x-2">
                    <Checkbox
                      id="optInMessages"
                      checked={formData.optInMessages}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, optInMessages: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="optInMessages"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Opt in to receive text messages
                    </label>
                  </div>
                )}
                <Button
                  onClick={async () => {
                    const isValid = await validateEmail();
                    if (isValid) {
                      nextStep();
                    }
                  }}
                  className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold"
                  size="lg"
                  disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || isValidatingEmail}
                >
                  {isValidatingEmail ? 'Checking...' : 'Continue'}
                </Button>
              </div>
            )}

            {/* Step 6: Initial Pricing Offer */}
            {step === 6 && !showFlashSale && (
              <div className="space-y-6 py-6">
                <div className="text-center space-y-4">
                  <img src="/logo.png" alt="QuitApp Logo" className="w-32 h-32 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold">ONE TIME OFFER</h3>
                  {/* 5-minute countdown timer */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-lg font-semibold text-white">⏰ Offer expires in:</span>
                    <span className="text-3xl font-bold text-gray-900">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 rounded-lg p-8 border-4 shadow-2xl relative overflow-hidden" style={{ borderColor: '#AB0FB8' }}>
                    {/* Urgency badge */}
                    <div className="absolute top-2 right-2 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#AB0FB8' }}>
                      ONE TIME OFFER
                    </div>

                    {/* Price display */}
                    <div className="text-6xl font-bold mb-2 text-gray-900">
                      $79
                    </div>
                    <p className="font-bold text-lg mb-2" style={{ color: '#AB0FB8' }}>Lifetime Access</p>
                    <p className="font-semibold text-sm" style={{ color: '#890C94' }}>⏰ This offer expires soon!</p>
                  </div>

                  {/* Personalized Impact Calculations */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 rounded-lg p-4 my-4">
                    <p className="text-sm font-bold text-gray-800 mb-3">
                      💡 {formData.productType === 'cigarettes' ? 'REAL COST OF SMOKING' :
                         formData.productType === 'vape_disposable' ? 'REAL COST OF VAPING' :
                         formData.productType === 'pouches' ? 'REAL COST OF NICOTINE POUCHES' :
                         formData.productType === 'dip' ? 'REAL COST OF DIPPING' :
                         'REAL COST OF YOUR HABIT'}:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Left column: Cost info */}
                      <div className="space-y-3">
                        <div className="bg-white rounded-lg p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Yearly Spending:</span>
                            <span className="text-lg font-extrabold text-red-600">
                              ${getHabitStats().yearlySpending.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-sm border-2 border-red-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800">Total Spent So Far:</span>
                            <span className="text-xl font-extrabold text-red-700">
                              ${getHabitStats().totalSpent.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 shadow-sm border-2 border-purple-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800">Your Life</span>
                            <span className="text-xl font-extrabold" style={{ color: '#AB0FB8' }}>
                              priceless
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Right column: Health risks */}
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <p className="text-xs font-bold text-red-600 mb-2">Health Risks:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          <li>• Heart Attack</li>
                          <li>• Stroke</li>
                          <li>• Weakened Immune System</li>
                          <li>• Amputation</li>
                          <li>• Stinks</li>
                          <li>• Cancer</li>
                          <li>• Poor Circulation</li>
                          <li>• Breathing Problems</li>
                          <li>• Time Commitment</li>
                          <li>• Emphysema</li>
                        </ul>
                      </div>
                    </div>
                    <p className="text-xs text-center text-gray-600 mt-3">
                      🎯 Invest just $79 today to break free and save ${getHabitStats().yearlySpending.toLocaleString()}/year!
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <Button
                    onClick={nextStep}
                    className="w-full text-white font-bold text-lg"
                    style={{
                      backgroundColor: '#AB0FB8',
                    }}
                    size="lg"
                  >
                    🚀 BUY NOW FOR $79 - LIMITED TIME OFFER!
                  </Button>
                  <Button
                    onClick={() => {
                      setFormData({ ...formData, declinedInitialOffer: true });
                      setShowFlashSale(true);
                    }}
                    variant="outline"
                    className="w-full text-gray-500 hover:text-gray-600"
                    size="lg"
                  >
                    No thanks
                  </Button>
                </div>
              </div>
            )}

            {/* Flash Sale Page - Emergency Offer */}
            {step === 6 && showFlashSale && (
              <div className="space-y-4 py-6">
                <div className="text-center space-y-3">
                  {/* Emergency Header with Timer */}
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#AB0FB8' }}>
                    <h3 className="text-xl font-bold text-white">⚠️ WAIT! EXCLUSIVE FLASH SALE ⚠️</h3>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="text-sm text-white/90">⏰ Expires in:</span>
                      <span className="text-3xl font-bold text-white">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Price Comparison + Seats in One Block */}
                  <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 rounded-lg p-6 border-4 shadow-2xl relative overflow-hidden" style={{ borderColor: '#AB0FB8' }}>
                    {/* Flash Sale Badge */}
                    <div className="absolute top-2 right-2 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#AB0FB8' }}>
                      75% OFF!
                    </div>

                    {/* Old Price Strikethrough */}
                    <div className="relative inline-block mb-2">
                      <span className="text-3xl font-bold text-gray-400" style={{ textDecoration: 'line-through', textDecorationColor: '#AB0FB8', textDecorationThickness: '3px' }}>
                        $79
                      </span>
                    </div>

                    {/* New Price */}
                    <div className="text-6xl font-bold mb-2 text-gray-900">
                      $19.99
                    </div>
                    <p className="font-bold text-lg mb-1" style={{ color: '#AB0FB8' }}>One-time payment</p>
                    <p className="text-sm font-semibold text-orange-600">💥 Save $59.01 today!</p>

                    {/* Seats Counter - Compact */}
                    <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#AB0FB8' }}>
                      {seatsLeft > 1 ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-3xl font-bold text-white">{seatsLeft}</span>
                          <span className="text-sm font-bold text-white">SEATS LEFT</span>
                        </div>
                      ) : (
                        <p className="text-sm font-bold text-white">✅ Your spot is RESERVED!</p>
                      )}
                    </div>
                  </div>

                  {/* Personalized ROI - Compact */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 rounded-lg p-3">
                    <p className="text-xs font-bold text-gray-800 mb-2">💰 What You're Really Spending:</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white rounded p-2">
                        <span className="text-xs text-gray-600">Per Year:</span>
                        <span className="text-sm font-bold" style={{ color: '#AB0FB8' }}>
                          {getHabitStats().yearlyUsage.toLocaleString()} {getHabitStats().label.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-white rounded p-2">
                        <span className="text-xs text-gray-600">Yearly Cost:</span>
                        <span className="text-sm font-bold text-red-600">
                          ${getHabitStats().yearlySpending.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-red-100 rounded p-2 border border-red-300">
                        <span className="text-xs font-bold text-gray-800">Total Wasted:</span>
                        <span className="text-base font-extrabold text-red-700">
                          ${getHabitStats().totalSpent.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Single Urgency Message */}
                  <div className="bg-purple-50 border-2 border-purple-400 rounded-lg p-2">
                    <p className="text-xs font-bold text-gray-800">
                      ⚠️ Save ${getHabitStats().yearlySpending.toLocaleString()}/year for just $19.99!
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={nextStep}
                    className="w-full text-white font-bold text-lg"
                    style={{
                      backgroundColor: '#AB0FB8',
                    }}
                    size="lg"
                  >
                    💰 YES! GIVE ME 75% OFF - $19.99!
                  </Button>
                  <Button
                    onClick={nextStep}
                    variant="outline"
                    className="w-full text-xs text-gray-400 hover:text-gray-500 border-gray-300"
                    size="sm"
                  >
                    No, I'll pay $79
                  </Button>
                </div>
              </div>
            )}

            {/* Step 7: Password Creation */}
            {step === 7 && (
              <div className="space-y-4 py-6">
                <div className="space-y-2 text-center">
                  <Label htmlFor="password" className="text-center block">Create a password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="At least 8 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="text-lg h-12 text-center"
                    autoFocus
                  />
                  {formData.password && formData.password.length < 8 && (
                    <p className="text-xs text-muted-foreground">
                      Password must be at least 8 characters
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-semibold"
                  size="lg"
                  disabled={formData.password.length < 8}
                >
                  Create Account & Start Journey
                </Button>
              </div>
            )}

            {/* Navigation Buttons */}
            {step > 1 && step !== 6 && step !== 7 && (
              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={prevStep} className="text-black">
                  Back
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
