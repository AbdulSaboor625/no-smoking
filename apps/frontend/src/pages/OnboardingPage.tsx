import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
  confirmPassword: string;
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
  const [hoveredNumber, setHoveredNumber] = useState<number | string | null>(null);

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
          confirmPassword: parsed.confirmPassword || '',
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
          confirmPassword: '',
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
      confirmPassword: '',
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
    // Reset hover states when changing steps
    setHoveredOption(null);
    setHoveredNumber(null);
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

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'Passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    if (formData.password.length < 8) {
      toast({
        title: 'Error',
        description: 'Password must be at least 8 characters',
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
    const dailyNum = parseFloat(formData.weeklyUsage) || 0; // packs/units per day
    const costPerUnit = parseFloat(formData.monthlySpending) || 0; // cost per pack/unit
    
    // Calculate daily cost: packs per day × cost per pack
    const dailyCost = dailyNum * costPerUnit;
    
    // Calculate yearly spending: daily cost × 365 days
    const yearlySpending = Math.round(dailyCost * 365);
    
    // Calculate yearly usage
    const yearlyUsage = Math.round(dailyNum * 365);
    
    // Get maximum years in the duration range for calculation
    let maxYears = 0;
    if (formData.duration === 'less_than_5') {
      maxYears = 5;
    } else if (formData.duration === '5_to_10') {
      maxYears = 10;
    } else if (formData.duration === '10_to_20') {
      maxYears = 20;
    } else if (formData.duration === 'over_20') {
      maxYears = 35; // Reasonable upper bound for "over 20"
    } else if (formData.duration === 'less_than_10') {
      // Legacy support
      maxYears = 10;
    } else {
      // Fallback for old numeric values
      maxYears = parseFloat(formData.duration) || 0;
    }
    
    // Calculate total spent using maximum years in the range
    const totalSpent = Math.round(yearlySpending * maxYears);

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
        return 'Create Account';
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
    <div className={`min-h-screen bg-white overflow-x-hidden ${step === 6 ? 'grid grid-cols-1 lg:grid-cols-2 gap-0' : 'flex items-center justify-center p-2 sm:p-4'}`}>
      <Card className={`${step === 6 ? 'w-full h-screen overflow-y-auto' : 'max-w-2xl w-full'} shadow-2xl border-0`} style={{ backgroundColor: '#6B2C91' }}>
        <CardHeader className="pb-2 sm:pb-4 px-3 sm:px-6">
          <div className="mb-3 sm:mb-4">
            <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/20">
              <div 
                className="h-full bg-[#FFC107] transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-white/80 mt-2 text-center font-medium">
              Step {step} of 7
            </p>
          </div>
          {step !== 6 && (
            <CardTitle className="text-xl sm:text-2xl md:text-3xl text-center font-bold text-white mb-2 px-2">
              {getStepTitle()}
            </CardTitle>
          )}
          {step !== 6 && getStepDescription() && (
            <CardDescription className="text-center text-white/90 text-sm sm:text-base px-2">
              {getStepDescription()}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className={`${step === 1 ? "pb-4 sm:pb-8" : ""} px-3 sm:px-6`}>
          <div className="space-y-6">
            {/* Step 1: Product Type - Interactive Cards */}
            {step === 1 && (
              <div className="space-y-2 sm:space-y-3">
                <RadioGroup
                  value={formData.productType || ''}
                  onValueChange={(value) => selectProductType(value as ProductType)}
                  className="space-y-2 sm:space-y-3"
                >
                  {productOptions.map((option) => {
                    const isSelected = formData.productType === option.value;
                    const isHovered = hoveredOption === option.value;

                    // Icons/Emojis for each product type
                    const productIcons = {
                      cigarettes: '🚬',
                      vape_disposable: '💨',
                      pouches: '📦',
                      dip: '🥤',
                    };

                    return (
                      <Label
                        key={option.value}
                        htmlFor={option.value}
                        className={`
                          group relative border-2 rounded-xl p-3 sm:p-4 md:p-5 cursor-pointer 
                          transition-all duration-300 ease-out flex items-center
                          transform hover:scale-[1.02] active:scale-[0.98]
                          ${isSelected
                            ? 'border-[#FFC107] bg-[#FFC107] shadow-lg shadow-[#FFC107]/50 scale-[1.02]'
                            : isHovered
                            ? 'border-[#FFC107] bg-[#FFC107]/20 shadow-md'
                            : 'border-white/30 hover:border-white/60 bg-white/5 backdrop-blur-sm'
                          }
                        `}
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
                        {/* Selection indicator ring */}
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl border-2 border-[#FFC107] animate-pulse" />
                        )}
                        
                        {/* Radio button with custom styling */}
                        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-1">
                          <div className="relative flex-shrink-0">
                            <RadioGroupItem 
                              value={option.value} 
                              id={option.value} 
                              className={`
                                w-5 h-5 sm:w-6 sm:h-6 border-2 transition-all duration-300
                                ${isSelected 
                                  ? 'border-[#AB0FB8] bg-[#AB0FB8]' 
                                  : 'border-white/60 group-hover:border-white'
                                }
                              `}
                            />
                            {isSelected && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white rounded-full animate-in fade-in zoom-in duration-200" />
                              </div>
                            )}
                          </div>
                          
                          {/* Product icon */}
                          <div className={`
                            text-2xl sm:text-3xl transition-transform duration-300 flex-shrink-0
                            ${isHovered || isSelected ? 'scale-110' : 'scale-100'}
                          `}>
                            {productIcons[option.value as keyof typeof productIcons] || '📦'}
                          </div>
                          
                          {/* Text content */}
                          <div className="flex-1 min-w-0">
                            <div className={`
                              font-bold text-base sm:text-lg md:text-xl mb-0.5 sm:mb-1 transition-colors duration-300
                              ${isSelected 
                                ? 'text-gray-900' 
                                : isHovered 
                                ? 'text-white' 
                                : 'text-white'
                              }
                            `}>
                              {option.label}
                            </div>
                            <div className={`
                              text-xs sm:text-sm transition-colors duration-300
                              ${isSelected
                                ? 'text-gray-700'
                                : isHovered
                                ? 'text-white/90'
                                : 'text-white/70'
                              }
                            `}>
                              {option.description}
                            </div>
                          </div>
                          
                          {/* Selection checkmark */}
                          {isSelected && (
                            <div className="flex-shrink-0 ml-1 sm:ml-2">
                              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-[#AB0FB8] flex items-center justify-center animate-in zoom-in duration-300">
                                <svg 
                                  className="w-4 h-4 sm:w-5 sm:h-5 text-white" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24"
                                >
                                  <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={3} 
                                    d="M5 13l4 4L19 7" 
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>
                      </Label>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            {/* Step 2: Daily Usage - Interactive Cards */}
            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-5 gap-2 sm:gap-3">
                  {[1, 2, 3, 4, 5].map((num) => {
                    const isSelected = formData.weeklyUsage === num.toString();
                    const isHovered = hoveredNumber === num;

                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, weeklyUsage: num.toString() });
                          setTimeout(nextStep, 300);
                        }}
                        onMouseEnter={() => setHoveredNumber(num)}
                        onMouseLeave={() => setHoveredNumber(null)}
                        className={`
                          group relative border-2 rounded-xl p-3 sm:p-4 md:p-6 cursor-pointer 
                          transition-all duration-300 ease-out
                          transform hover:scale-[1.05] active:scale-[0.95]
                          flex flex-col items-center justify-center
                          ${isSelected
                            ? 'border-[#FFC107] bg-[#FFC107] shadow-lg shadow-[#FFC107]/50 scale-[1.05]'
                            : isHovered
                            ? 'border-[#FFC107] bg-[#FFC107]/20 shadow-md'
                            : 'border-white/30 hover:border-white/60 bg-white/5 backdrop-blur-sm'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl border-2 border-[#FFC107] animate-pulse" />
                        )}
                        <div className={`
                          text-2xl sm:text-3xl md:text-4xl font-bold transition-colors duration-300
                          ${isSelected 
                            ? 'text-gray-900' 
                            : isHovered 
                            ? 'text-white' 
                            : 'text-white'
                          }
                        `}>
                          {num}
                        </div>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#AB0FB8] flex items-center justify-center animate-in zoom-in duration-300">
                            <svg 
                              className="w-3 h-3 sm:w-4 sm:h-4 text-white" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 3: Cost Per Pack - Interactive Cards */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {[6, 7, 8, 9].map((amount) => {
                    const isSelected = formData.monthlySpending === amount.toString();
                    const isHovered = hoveredNumber === amount;

                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, monthlySpending: amount.toString() });
                          setTimeout(nextStep, 300);
                        }}
                        onMouseEnter={() => setHoveredNumber(amount)}
                        onMouseLeave={() => setHoveredNumber(null)}
                        className={`
                          group relative border-2 rounded-xl p-3 sm:p-4 md:p-6 cursor-pointer 
                          transition-all duration-300 ease-out
                          transform hover:scale-[1.05] active:scale-[0.95]
                          flex flex-col items-center justify-center
                          ${isSelected
                            ? 'border-[#FFC107] bg-[#FFC107] shadow-lg shadow-[#FFC107]/50 scale-[1.05]'
                            : isHovered
                            ? 'border-[#FFC107] bg-[#FFC107]/20 shadow-md'
                            : 'border-white/30 hover:border-white/60 bg-white/5 backdrop-blur-sm'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl border-2 border-[#FFC107] animate-pulse" />
                        )}
                        <div className={`
                          text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-300
                          ${isSelected 
                            ? 'text-gray-900' 
                            : isHovered 
                            ? 'text-white' 
                            : 'text-white'
                          }
                        `}>
                          ${amount}
                        </div>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#AB0FB8] flex items-center justify-center animate-in zoom-in duration-300">
                            <svg 
                              className="w-3 h-3 sm:w-4 sm:h-4 text-white" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 4: Duration - Interactive Cards */}
            {step === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                  {[
                    { value: 'less_than_5', label: 'Less than 5 years' },
                    { value: '5_to_10', label: '5 to 10 years' },
                    { value: '10_to_20', label: '10 to 20' },
                    { value: 'over_20', label: 'Over 20' },
                  ].map((option) => {
                    const isSelected = formData.duration === option.value;
                    const isHovered = hoveredNumber === option.value;

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, duration: option.value });
                          setTimeout(nextStep, 300);
                        }}
                        onMouseEnter={() => setHoveredNumber(option.value)}
                        onMouseLeave={() => setHoveredNumber(null)}
                        className={`
                          group relative border-2 rounded-xl p-4 sm:p-5 md:p-6 cursor-pointer 
                          transition-all duration-300 ease-out
                          transform hover:scale-[1.05] active:scale-[0.95]
                          flex flex-col items-center justify-center
                          ${isSelected
                            ? 'border-[#FFC107] bg-[#FFC107] shadow-lg shadow-[#FFC107]/50 scale-[1.05]'
                            : isHovered
                            ? 'border-[#FFC107] bg-[#FFC107]/20 shadow-md'
                            : 'border-white/30 hover:border-white/60 bg-white/5 backdrop-blur-sm'
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="absolute inset-0 rounded-xl border-2 border-[#FFC107] animate-pulse" />
                        )}
                        <div className={`
                          text-sm sm:text-base md:text-lg font-bold transition-colors duration-300 text-center px-1
                          ${isSelected 
                            ? 'text-gray-900' 
                            : isHovered 
                            ? 'text-white' 
                            : 'text-white'
                          }
                        `}>
                          {option.label}
                        </div>
                        {isSelected && (
                          <div className="absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#AB0FB8] flex items-center justify-center animate-in zoom-in duration-300">
                            <svg 
                              className="w-3 h-3 sm:w-4 sm:h-4 text-white" 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Step 5: User Info Form */}
            {step === 5 && (
              <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                {/* Two-column layout for name fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-white font-semibold block">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value, name: `${e.target.value} ${formData.lastName}`.trim() })}
                      className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-[#FFC107] focus:ring-[#FFC107] rounded-lg"
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-white font-semibold block">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value, name: `${formData.firstName} ${e.target.value}`.trim() })}
                      className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-[#FFC107] focus:ring-[#FFC107] rounded-lg"
                    />
                  </div>
                </div>

                {/* Two-column layout for email and phone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white font-semibold block">
                      Email address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setEmailError(null);
                      }}
                      className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-[#FFC107] focus:ring-[#FFC107] rounded-lg"
                    />
                    {emailError && (
                      <p className="text-xs text-red-300 mt-1">{emailError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white font-semibold block">
                      Phone No.
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Phone no."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-[#FFC107] focus:ring-[#FFC107] rounded-lg"
                    />
                  </div>
                </div>

                {/* Separator with "or" */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#6B2C91] px-4 text-white/70 text-sm">or</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-lg flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-medium">Login with Google</span>
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-12 bg-white/10 border-white/30 text-white hover:bg-white/20 rounded-lg flex items-center justify-center gap-3"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="font-medium">Login with Facebook</span>
                  </Button>
                </div>

                {/* Continue Button */}
                <div className="pt-4">
                  <Button
                    onClick={async () => {
                      const isValid = await validateEmail();
                      if (isValid) {
                        nextStep();
                      }
                    }}
                    className="w-full bg-[#AB0FB8] hover:bg-[#890C94] text-white font-semibold text-lg py-6 rounded-lg transition-all duration-300"
                    size="lg"
                    disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || isValidatingEmail}
                  >
                    {isValidatingEmail ? 'Checking...' : 'Continue'}
                  </Button>
                </div>

                {/* Opt-in checkbox (shown when phone is filled) */}
                {formData.phone && (
                  <div className="flex items-center justify-center space-x-2 pt-2">
                    <Checkbox
                      id="optInMessages"
                      checked={formData.optInMessages}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, optInMessages: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="optInMessages"
                      className="text-sm font-medium text-white/90 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Opt in to receive text messages
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Initial Pricing Offer */}
            {step === 6 && !showFlashSale && (
              <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                <div className="text-center space-y-3 sm:space-y-4">
                  <img src="/logo.png" alt="QuitApp Logo" className="w-24 h-24 sm:w-32 sm:h-32 mx-auto mb-2 sm:mb-4" />
                  <h3 className="text-2xl sm:text-3xl font-bold">ONE TIME OFFER</h3>
                  {/* 5-minute countdown timer */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-lg font-semibold text-white">⏰ Offer expires in:</span>
                    <span className="text-3xl font-bold text-white">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 p-6 sm:p-8 border-4 shadow-2xl relative overflow-hidden" style={{ borderColor: '#FFD700' }}>
                    {/* Urgency badge */}
                    <div className="absolute top-2 right-2 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFD700' }}>
                      ONE TIME OFFER
                    </div>

                    {/* Price display */}
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-gray-900">
                      $79
                    </div>
                    <p className="font-bold text-base sm:text-lg mb-2" style={{ color: '#FFD700' }}>Lifetime Access</p>
                    <p className="font-semibold text-sm" style={{ color: '#B8860B' }}>⏰ This offer expires soon!</p>
                  </div>

                  {/* Personalized Impact Calculations */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 p-4 my-4">
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
                        <div className="bg-white p-3 shadow-sm">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Yearly Spending:</span>
                            <span className="text-lg font-extrabold text-red-600">
                              ${getHabitStats().yearlySpending.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="bg-white p-3 shadow-sm border-2 border-red-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800">Total Spent So Far:</span>
                            <span className="text-xl font-extrabold text-red-700">
                              ${getHabitStats().totalSpent.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 p-3 shadow-sm border-2 border-yellow-300">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-800">Your Life</span>
                            <span className="text-xl font-extrabold" style={{ color: '#FFD700' }}>
                              priceless
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Right column: Health risks */}
                      <div className="bg-white p-3 shadow-sm">
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
                    className="w-full text-white font-bold text-sm sm:text-base md:text-lg px-2 py-4 sm:py-6"
                    style={{
                      backgroundColor: '#FFD700',
                    }}
                    size="lg"
                  >
                    <span className="whitespace-nowrap">🚀 BUY NOW FOR $79 - LIMITED TIME OFFER!</span>
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
              <div className="space-y-3 sm:space-y-4 py-4 sm:py-6">
                <div className="text-center space-y-2 sm:space-y-3">
                  {/* Emergency Header with Timer */}
                  <div className="p-3 sm:p-4" style={{ backgroundColor: '#FFD700' }}>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-white px-1">⚠️ WAIT! EXCLUSIVE FLASH SALE ⚠️</h3>
                    <div className="mt-2 flex items-center justify-center gap-2">
                      <span className="text-sm font-bold text-white/90">⏰ Expires in:</span>
                      <span className="text-3xl font-bold text-white">
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>

                  {/* Price Comparison + Seats in One Block */}
                  <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-yellow-100 p-4 sm:p-6 border-4 shadow-2xl relative overflow-hidden" style={{ borderColor: '#FFD700' }}>
                    {/* Flash Sale Badge */}
                    <div className="absolute top-2 right-2 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ backgroundColor: '#FFD700' }}>
                      75% OFF!
                    </div>

                    {/* Old Price Strikethrough */}
                    <div className="relative inline-block mb-2">
                      <span className="text-2xl sm:text-3xl font-bold text-gray-400" style={{ textDecoration: 'line-through', textDecorationColor: '#FFD700', textDecorationThickness: '3px' }}>
                        $79
                      </span>
                    </div>

                    {/* New Price */}
                    <div className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2 text-gray-900 break-words">
                      $19.99
                    </div>
                    <p className="font-bold text-base sm:text-lg mb-1" style={{ color: '#FFD700' }}>One-time payment</p>
                    <p className="text-sm font-semibold text-orange-600">💥 Save $59.01 today!</p>

                    {/* Seats Counter - Compact */}
                    <div className="mt-3 p-3 rounded-lg" style={{ backgroundColor: '#FFD700' }}>
                      {seatsLeft > 1 ? (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-2xl sm:text-3xl font-bold text-white">{seatsLeft}</span>
                          <span className="text-xs sm:text-sm font-bold text-white">SEATS LEFT</span>
                        </div>
                      ) : (
                        <p className="text-xs sm:text-sm font-bold text-white">✅ Your spot is RESERVED!</p>
                      )}
                    </div>
                  </div>

                  {/* Personalized ROI - Compact */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-400 p-3">
                    <p className="text-xs font-bold text-gray-800 mb-2">💰 What You're Really Spending:</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white rounded p-2">
                        <span className="text-xs text-gray-600">Per Year:</span>
                        <span className="text-sm font-bold" style={{ color: '#FFD700' }}>
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
                  <div className="bg-yellow-50 border-2 border-yellow-400 p-2">
                    <p className="text-xs font-bold text-gray-800">
                      ⚠️ Save ${getHabitStats().yearlySpending.toLocaleString()}/year for just $19.99!
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    onClick={nextStep}
                    className="w-full text-white font-bold text-sm sm:text-base md:text-lg px-2 py-4 sm:py-6"
                    style={{
                      backgroundColor: '#FFD700',
                    }}
                    size="lg"
                  >
                    <span className="whitespace-nowrap">💰 YES! GIVE ME 75% OFF - $19.99!</span>
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
              <div className="space-y-4 sm:space-y-6 py-4 sm:py-6">
                {/* Two-column layout for password fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white font-semibold block">
                      Create a password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-[#FFC107] focus:ring-[#FFC107] rounded-lg"
                      autoFocus
                    />
                    {formData.password && formData.password.length < 8 && (
                      <p className="text-xs text-red-300 mt-1">
                        Password must be at least 8 characters
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white font-semibold block">
                      Confirm password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="h-12 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:border-[#FFC107] focus:ring-[#FFC107] rounded-lg"
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <p className="text-xs text-red-300 mt-1">
                        Passwords do not match
                      </p>
                    )}
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-4">
                  <Button
                    onClick={handleSubmit}
                    className="w-full bg-[#AB0FB8] hover:bg-[#890C94] text-white font-semibold text-sm sm:text-base md:text-lg py-4 sm:py-6 rounded-lg transition-all duration-300 px-2"
                    size="lg"
                    disabled={
                      formData.password.length < 8 || 
                      formData.password !== formData.confirmPassword ||
                      !formData.confirmPassword
                    }
                  >
                    <span className="whitespace-nowrap">Create Account & Start Journey</span>
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            {step > 1 && step !== 6 && step !== 7 && (
              <div className="flex justify-between pt-6 border-t">
                <Button variant="outline" onClick={prevStep} className="text-black">
                  Back
                </Button>
                <div className="flex items-center gap-2">
                  <span>Already have an account?</span>
                  <Link to="/login" className="text-[#FFC107] hover:text-[#c49005] font-bold">Login</Link>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Right side: Video (only for step 6) */}
      {step === 6 && (
        <div className="w-full h-screen bg-black flex items-center justify-center overflow-hidden">
          <div className="w-full h-full overflow-hidden relative">
            <iframe
              className="absolute inset-0 w-full h-full border-0"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Video placeholder"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </div>
  );
}
