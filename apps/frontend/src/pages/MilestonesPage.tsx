import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { trpc } from '@/lib/trpc';
import { format, addHours, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, addMonths, subMonths } from 'date-fns';
import { Check, Lock, Award, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type MilestoneDefinition = {
  id: string;
  type: string;
  title: string;
  description: string;
  hours: number;
  healthBenefits: string[];
  icon: typeof Award;
};

const milestoneDefinitions: MilestoneDefinition[] = [
  {
    id: '1_hour',
    type: '1_hour',
    title: '1 Hour Smoke-Free',
    description: 'The first hour is the hardest. You did it!',
    hours: 1,
    healthBenefits: ['Heart rate begins to drop', 'Blood pressure starts to normalize'],
    icon: Clock,
  },
  {
    id: '24_hours',
    type: '24_hours',
    title: '24 Hours',
    description: 'One full day without nicotine!',
    hours: 24,
    healthBenefits: ['Carbon monoxide level in blood drops to normal', 'Risk of heart attack begins to decrease'],
    icon: Award,
  },
  {
    id: '3_days',
    type: '3_days',
    title: '3 Days',
    description: 'The worst is behind you!',
    hours: 72,
    healthBenefits: ['Nicotine is fully out of your system', 'Breathing becomes easier', 'Energy levels increase'],
    icon: Award,
  },
  {
    id: '1_week',
    type: '1_week',
    title: '1 Week',
    description: 'A full week smoke-free!',
    hours: 168,
    healthBenefits: ['Sense of taste and smell improve dramatically', 'Lungs begin to clear out mucus'],
    icon: Award,
  },
  {
    id: '2_weeks',
    type: '2_weeks',
    title: '2 Weeks',
    description: 'Two weeks strong!',
    hours: 336,
    healthBenefits: ['Circulation improves', 'Walking and exercise become easier'],
    icon: Award,
  },
  {
    id: '1_month',
    type: '1_month',
    title: '1 Month',
    description: 'A whole month nicotine-free!',
    hours: 720,
    healthBenefits: ['Lung function increases up to 30%', 'Coughing and shortness of breath decrease'],
    icon: Award,
  },
  {
    id: '3_months',
    type: '3_months',
    title: '3 Months',
    description: 'Three months of freedom!',
    hours: 2160,
    healthBenefits: ['Circulation continues to improve', 'Risk of heart disease drops significantly'],
    icon: Award,
  },
  {
    id: '6_months',
    type: '6_months',
    title: '6 Months',
    description: 'Half a year smoke-free!',
    hours: 4320,
    healthBenefits: ['Cilia in lungs regrow', 'Stress levels normalize', 'Skin health improves visibly'],
    icon: Award,
  },
  {
    id: '1_year',
    type: '1_year',
    title: '1 Year',
    description: 'One full year! Amazing achievement!',
    hours: 8760,
    healthBenefits: ['Risk of heart disease is half that of a smoker', 'Lung capacity significantly improved'],
    icon: Award,
  },
];

export function MilestonesPage() {
  const { data: quitAttempt } = trpc.quitAttempts.getActive.useQuery();
  const { data: milestones } = trpc.milestones.getByAttempt.useQuery(
    { quitAttemptId: quitAttempt?.id ?? '' },
    { enabled: !!quitAttempt }
  );

  // Initialize state before conditional return to follow Rules of Hooks
  const quitDate = quitAttempt ? new Date(quitAttempt.quitDate) : new Date();
  const [currentMonth, setCurrentMonth] = useState(quitDate);

  if (!quitAttempt) {
    return (
      <AppShell title="Milestones">
        <div className="p-6">
          <p className="text-muted-foreground">Please start a quit attempt first</p>
        </div>
      </AppShell>
    );
  }

  const achievedMilestoneTypes = new Set(milestones?.map((m) => m.milestoneType) || []);
  
  // Calculate milestone dates
  const getMilestoneDate = (hours: number) => {
    return addHours(quitDate, hours);
  };

  // Create a map of dates to milestones
  const milestoneDatesMap = new Map<string, string[]>();
  milestoneDefinitions.forEach((milestone) => {
    const milestoneDate = getMilestoneDate(milestone.hours);
    const dateKey = format(milestoneDate, 'yyyy-MM-dd');
    if (!milestoneDatesMap.has(dateKey)) {
      milestoneDatesMap.set(dateKey, []);
    }
    milestoneDatesMap.get(dateKey)!.push(milestone.title);
  });

  // Get calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <TooltipProvider delayDuration={300} skipDelayDuration={0}>
      <AppShell title="Quit Calendar">
        <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
          <div className="flex items-start justify-between xl:flex-row flex-col 2xl:gap-10 gap-4 sm:gap-5 md:gap-6 mb-4 sm:mb-5 md:mb-6">
            <div className="xl:w-[70%] w-full">
              {/* Calendar */}
              <Card className="bg-white rounded-[10px] border-0 shadow-none p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-[#561F7A] text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold">
                  {format(currentMonth, 'MMMM yyyy')}
                </h2>
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 text-[#561F7A]" />
                  </button>
                  <button
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 text-[#561F7A]" />
                  </button>
                </div>
              </div>

              {/* Days of Week Headers */}
              <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="bg-[#E8D5F2] rounded-full py-1 sm:py-2 px-1 sm:px-2 md:px-3 text-center"
                  >
                    <span className="text-[#561F7A] text-[10px] sm:text-xs md:text-sm font-medium">{day}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const dateKey = format(day, 'yyyy-MM-dd');
                  const dayMilestones = milestoneDatesMap.get(dateKey) || [];
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "min-h-[60px] sm:min-h-[80px] md:min-h-[100px] border border-gray-200 p-1 sm:p-1.5 md:p-2 bg-white flex flex-col",
                        !isCurrentMonth && "opacity-40"
                      )}
                    >
                      <span
                        className={cn(
                          "text-[10px] sm:text-xs md:text-sm font-medium mb-0.5 sm:mb-1",
                          isCurrentMonth ? "text-[#131316]" : "text-gray-400"
                        )}
                      >
                        {format(day, 'd')}
                      </span>
                      <div className="flex-1 flex flex-col gap-0.5 sm:gap-1">
                        {dayMilestones.map((milestone, idx) => {
                          const milestoneDef = milestoneDefinitions.find(m => m.title === milestone);
                          const isAchieved = milestoneDef && achievedMilestoneTypes.has(milestoneDef.type);
                          
                          // Split milestone title to show time/date on first line and "Smoke-Free" on second line
                          let milestoneText = milestone.replace(' Smoke-Free', '').trim();
                          
                          // Calculate milestone date
                          const milestoneDate = milestoneDef ? getMilestoneDate(milestoneDef.hours) : day;
                          const formattedDate = format(milestoneDate, 'MMMM d, yyyy');
                          
                          // Get achieved milestone data if available
                          const achievedMilestone = milestones?.find(m => m.milestoneType === milestoneDef?.type);
                          const achievedDate = achievedMilestone ? format(new Date(achievedMilestone.achievedAt), 'MMMM d, yyyy') : null;
                          
                          return (
                            <Tooltip key={idx} delayDuration={300}>
                              <TooltipTrigger asChild>
                                <div
                                  className={cn(
                                    "rounded-lg px-1 sm:px-1.5 md:px-2 py-0.5 sm:py-1 md:py-1.5 text-[8px] sm:text-[9px] md:text-[10px] font-medium flex items-start gap-1 sm:gap-1.5 md:gap-2 cursor-pointer transition-opacity hover:opacity-90",
                                    isAchieved 
                                      ? "bg-[#561F7A] text-white" 
                                      : "bg-[#E8D5F2] text-[#131316]"
                                  )}
                                >
                                  <div className='min-w-[18px] min-h-[18px] sm:min-w-[22px] sm:min-h-[22px] md:min-w-[29px] md:min-h-[29px] rounded-full flex justify-center items-center bg-[#561F7A] flex-shrink-0'>
                                    {isAchieved ? (
                                      <Check className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 text-white" />
                                    ) : (
                                      <Lock className="h-2 w-2 sm:h-2.5 sm:w-2.5 md:h-3 md:w-3 flex-shrink-0 text-white" />
                                    )}
                                  </div>
                                  <div className="flex-1 flex flex-col leading-tight min-w-0">
                                    <span className="block truncate">{milestoneText}</span>
                                    <span className="block truncate">Smoke-Free</span>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent 
                                side="top" 
                                className="max-w-xs !bg-[#561F7A] !text-white border-0 shadow-lg p-4"
                                sideOffset={8}
                                avoidCollisions={true}
                              >
                                <div className="space-y-3">
                                  {/* Header */}
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                      {milestoneDef?.icon && (
                                        <milestoneDef.icon className="w-4 h-4 text-white" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-base mb-1">{milestoneDef?.title || milestone}</h4>
                                      <p className="text-sm text-white/90">{milestoneDef?.description}</p>
                                    </div>
                                  </div>
                                  
                                  {/* Date Information */}
                                  <div className="pt-2 border-t border-white/20">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Clock className="w-4 h-4 text-white/80" />
                                      <span className="text-xs font-semibold text-white/80">Milestone Date:</span>
                                    </div>
                                    <p className="text-sm font-medium ml-6">{formattedDate}</p>
                                    {isAchieved && achievedDate && (
                                      <>
                                        <div className="flex items-center gap-2 mt-2">
                                          <Check className="w-4 h-4 text-[#F9C015]" />
                                          <span className="text-xs font-semibold text-[#F9C015]">Achieved on:</span>
                                        </div>
                                        <p className="text-sm font-medium ml-6 text-[#F9C015]">{achievedDate}</p>
                                      </>
                                    )}
                                    {!isAchieved && (
                                      <div className="flex items-center gap-2 mt-2">
                                        <Lock className="w-4 h-4 text-white/60" />
                                        <span className="text-xs text-white/60">Not yet achieved</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Health Benefits */}
                                  {milestoneDef && milestoneDef.healthBenefits.length > 0 && (
                                    <div className="pt-2 border-t border-white/20">
                                      <p className="text-xs font-semibold text-white/80 mb-2">Health Benefits:</p>
                                      <ul className="space-y-1.5">
                                        {milestoneDef.healthBenefits.map((benefit, benefitIdx) => (
                                          <li key={benefitIdx} className="flex items-start gap-2 text-xs text-white/90">
                                            <span className="text-[#F9C015] mt-0.5">•</span>
                                            <span>{benefit}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="xl:w-[30%] w-full">
            {/* Milestones List */}
            <Card className="bg-white rounded-[10px] border-0 shadow-none p-4 sm:p-5 md:p-6">
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-[#561F7A] text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3 max-h-[400px] sm:max-h-[500px] md:max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {milestones && milestones.length > 0 ? (
                    milestones
                      .sort((a, b) => new Date(b.achievedAt).getTime() - new Date(a.achievedAt).getTime())
                      .map((milestone) => {
                        const milestoneDef = milestoneDefinitions.find(m => m.type === milestone.milestoneType);
                        if (!milestoneDef) return null;
                        
                        return (
                          <div
                            key={milestone.id}
                            className="bg-[#F2F2F2] hover:bg-[#E5E5E5] transition-all duration-300 rounded-lg p-3 sm:p-4"
                          >
                            <div className="flex items-start justify-between gap-2 sm:gap-3">
                              <div className="flex-1 min-w-0">
                                <p className="text-xs sm:text-sm font-semibold text-[#131316] mb-0.5 sm:mb-1">
                                  {format(new Date(milestone.achievedAt), 'MMMM d, yyyy')}
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-[#131316] mb-0.5 sm:mb-1">
                                  {milestoneDef.title}
                                </p>
                                <p className="text-xs sm:text-sm font-normal text-[#131316]">
                                  {milestoneDef.description}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                                <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                  <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                                </div>
                                <span className="text-xs sm:text-sm font-semibold text-green-600 hidden sm:inline">Resisted</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#131316] text-sm font-normal">
                        No milestones achieved yet
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
    </TooltipProvider>
  );
}
