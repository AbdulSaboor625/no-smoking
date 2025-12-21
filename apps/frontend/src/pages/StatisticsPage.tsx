import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { differenceInHours, differenceInDays, differenceInMinutes, format } from 'date-fns';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { AnimatedCard } from '@/components/ui/animated-container';

export function StatisticsPage() {
  const { data: quitAttempt } = trpc.quitAttempts.getActive.useQuery();
  const { data: progressLogs } = trpc.progressLogs.getByAttempt.useQuery(
    { quitAttemptId: quitAttempt?.id ?? '' },
    { enabled: !!quitAttempt }
  );
  const { data: triggerLogs } = trpc.triggerLogs.getByAttempt.useQuery(
    { quitAttemptId: quitAttempt?.id ?? '' },
    { enabled: !!quitAttempt }
  );
  const { data: milestones } = trpc.milestones.getByAttempt.useQuery(
    { quitAttemptId: quitAttempt?.id ?? '' },
    { enabled: !!quitAttempt }
  );

  if (!quitAttempt) {
    return (
      <AppShell title="Statistics">
        <div className="p-6">
          <p className="text-muted-foreground">Please start a quit attempt first</p>
        </div>
      </AppShell>
    );
  }

  const quitDate = new Date(quitAttempt.quitDate);
  const now = new Date();

  // Calculate time statistics
  const minutesSinceQuit = Math.max(0, differenceInMinutes(now, quitDate));
  const hoursSinceQuit = Math.max(0, differenceInHours(now, quitDate));
  const daysSinceQuit = Math.max(0, differenceInDays(now, quitDate));

  // Calculate product statistics
  const dailyUsage = quitAttempt.dailyUsage || 0;
  const productsNotUsed = Math.floor((hoursSinceQuit / 24) * dailyUsage);

  // Calculate financial statistics
  const dailyCost = Number(quitAttempt.cost) || 0;
  const moneySaved = daysSinceQuit * dailyCost;
  const potentialYearlySavings = dailyCost * 365;

  // Calculate time freed (assuming ~5 minutes per cigarette/use)
  const minutesPerProduct = 5;
  const minutesFreed = productsNotUsed * minutesPerProduct;
  const hoursFreed = Math.floor(minutesFreed / 60);
  const daysFreed = Math.floor(hoursFreed / 24);
  const yearsFreed = Math.floor(daysFreed / 365);

  // Calculate average cravings from progress logs
  const avgCravings = progressLogs?.length
    ? Math.round(
        progressLogs.reduce((sum, log) => sum + log.cravingsCount, 0) / progressLogs.length
      )
    : 0;

  // Get recent data - format dates properly
  const recentTriggerLogs = triggerLogs?.slice(0, 5) || [];
  const recentProgressLogs = progressLogs?.slice(0, 5) || [];
  const recentMilestones = milestones?.slice(0, 5) || [];

  // Milestone count
  const milestoneCount = milestones?.length || 0;

  return (
    <AppShell title="Statistics">
      <div className="xl:pb-10 xl:px-10 pb-5 px-5 space-y-6">

        <div className="flex items-start justify-between lg:gap-8 gap-4 flex-col lg:flex-row">
          {/* Left Section - Statistics Cards in Purple Container */}
          <div className="lg:w-[70%] w-full">
            <div className="bg-[#561F7A] rounded-[20px] p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Money Saved Card */}
                <AnimatedCard delay={0.1}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <CardContent className="!p-0 flex flex-col">
                      <div className="flex items-center justify-between h-[136px]">
                        <div className="flex flex-col justify-between h-full flex-1">
                          <CardTitle className="text-[15px] font-normal text-white">Money Saved</CardTitle>
                          <div>
                            <motion.div
                              key={moneySaved}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="2xl:text-[30px] xl:text-[24px] md:text-[20px] text-[18px] font-semibold text-white"
                            >
                              ${moneySaved.toFixed(2)}
                            </motion.div>
                            <p className="text-xs font-medium text-white">Keep it up!</p>
                          </div>
                        </div>
                        <div className="w-[150px] h-[136px] flex-shrink-0">
                          <img src="/assets/images/card-img3.png" alt="Money Saved" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      {dailyCost > 0 && (
                        <div className="pt-3 mt-3 border-t border-white/20">
                          <p className="text-base font-semibold text-[#F9C015] mb-2">Projected Savings</p>
                          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                            <div className='flex items-center gap-1'>
                              <p className="text-white text-xs font-semibold">1 month:</p>
                              <p className="text-white/90 text-xs font-normal">${(dailyCost * 30).toFixed(2)}</p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <p className="text-white text-xs font-semibold">6 months:</p>
                              <p className="text-white/90 text-xs font-normal">${(dailyCost * 180).toFixed(2)}</p>
                            </div>  
                            <div className='flex items-center gap-1'>
                              <p className="text-white text-xs font-semibold">1 year:</p>
                              <p className="text-white/90 text-xs font-normal">${potentialYearlySavings.toFixed(2)}</p>
                            </div>
                            <div className='flex items-center gap-1'>
                              <p className="text-white text-xs font-semibold">5 years:</p>
                              <p className="text-white/90 text-xs font-normal">${(potentialYearlySavings * 5).toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedCard>

                {/* Time Freed Card */}
                <AnimatedCard delay={0.2}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <CardContent className="!p-0 flex flex-col">
                      <div className="flex items-center justify-between h-[136px]">
                        <div className="flex flex-col justify-between h-full flex-1">
                          <CardTitle className="text-[15px] font-normal text-white">Time Freed</CardTitle>
                          <div>
                            <motion.div
                              key={hoursFreed}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="2xl:text-[30px] xl:text-[24px] md:text-[20px] text-[18px] font-semibold text-white"
                            >
                              {daysFreed > 0 ? `${daysFreed}d` : `${hoursFreed}h`}
                            </motion.div>
                            <p className="text-xs font-medium text-white">Keep it up!</p>
                          </div>
                        </div>
                        <div className="w-[150px] h-[136px] flex-shrink-0">
                          <img src="/assets/images/card-img1.png" alt="Time Freed" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <div className="pt-3 mt-3 border-t border-white/20">
                        <p className="text-base font-semibold text-[#F9C015] mb-2">Time breakdown</p>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div className="flex items-center gap-1">
                            <p className="text-white text-xs font-semibold">Minutes:</p>
                            <p className="text-white/90 text-xs font-normal">{minutesFreed.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <p className="text-white text-xs font-semibold">Hours:</p>
                            <p className="text-white/90 text-xs font-normal">{hoursFreed.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <p className="text-white text-xs font-semibold">Days:</p>
                            <p className="text-white/90 text-xs font-normal">{daysFreed.toLocaleString()}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <p className="text-white text-xs font-semibold">Years:</p>
                            <p className="text-white/90 text-xs font-normal">{yearsFreed.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>

                {/* Products Not Used Card */}
                <AnimatedCard delay={0.3}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <CardContent className="!p-0 flex flex-col">
                      <div className="flex items-center justify-between h-[136px]">
                        <div className="flex flex-col justify-between h-full flex-1">
                          <CardTitle className="text-[15px] font-normal text-white">Products Not Used</CardTitle>
                          <div>
                            <motion.div
                              key={productsNotUsed}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="2xl:text-[30px] xl:text-[24px] md:text-[20px] text-[18px] font-semibold text-white"
                            >
                              {productsNotUsed}
                            </motion.div>
                            <p className="text-xs font-medium text-white capitalize">
                              {quitAttempt.productType.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                        <div className="w-[150px] h-[136px] flex-shrink-0">
                          <img src="/assets/images/card-img2.png" alt="Products Not Used" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <div className="pt-3 mt-3 border-t border-white/20">
                        <p className="text-base font-semibold text-[#F9C015] mb-2">Recent Data</p>
                        <div className="space-y-1 text-[10px]">
                          {recentTriggerLogs.length > 0 ? (
                            recentTriggerLogs.slice(0, 3).map((log) => (
                              <div key={log.id} className="flex items-center gap-1">
                                <p className="text-white text-xs font-semibold">{format(new Date(log.occurredAt), 'MMM d, yyyy')}:</p>
                                <p className="text-white/90 text-xs font-normal">{dailyUsage} {quitAttempt.productType.replace('_', ' ')}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-white/90 text-xs font-normal">No data yet</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>

                {/* Milestone Card */}
                <AnimatedCard delay={0.4}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <CardContent className="!p-0 flex flex-col">
                      <div className="flex items-center justify-between h-[136px]">
                        <div className="flex flex-col justify-between h-full flex-1">
                          <CardTitle className="text-[15px] font-normal text-white">Milestone</CardTitle>
                          <div>
                            <motion.div
                              key={milestoneCount}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="2xl:text-[30px] xl:text-[24px] md:text-[20px] text-[18px] font-semibold text-white"
                            >
                              {milestoneCount}
                            </motion.div>
                            <p className="text-xs font-medium text-white">Achievements unlocked</p>
                          </div>
                        </div>
                        <div className="w-[150px] h-[136px] flex-shrink-0">
                          <img src="/assets/images/card-img4.png" alt="Milestones" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <div className="pt-3 mt-3 border-t border-white/20">
                        <p className="text-base font-semibold text-[#F9C015] mb-2">Milestones Achieved</p>
                        <div className="space-y-1 text-[10px]">
                          {recentMilestones.length > 0 ? (
                            recentMilestones.slice(0, 3).map((milestone) => (
                              <div key={milestone.id} className="flex items-center gap-1">
                                <p className="text-white text-xs font-semibold">{format(new Date(milestone.achievedAt), 'MMM d, yyyy')}:</p>
                                <p className="text-white/90 text-xs font-normal">{milestone.milestoneType.replace('_', ' ')}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-white/90 text-xs font-normal">No milestones yet</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>

                {/* Average Cravings Card */}
                <AnimatedCard delay={0.5}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <CardContent className="!p-0 flex flex-col">
                      <div className="flex items-center justify-between h-[136px]">
                        <div className="flex flex-col justify-between h-full flex-1">
                          <CardTitle className="text-[15px] font-normal text-white">Average Cravings</CardTitle>
                          <div>
                            <motion.div
                              key={avgCravings}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="2xl:text-[30px] xl:text-[24px] md:text-[20px] text-[18px] font-semibold text-white"
                            >
                              {avgCravings}
                            </motion.div>
                            <p className="text-xs font-medium text-white">per day</p>
                          </div>
                        </div>
                        <div className="w-[150px] h-[136px] flex-shrink-0">
                          <img src="/assets/images/card-img2.png" alt="Average Cravings" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <div className="pt-3 mt-3 border-t border-white/20">
                        <p className="text-base font-semibold text-[#F9C015] mb-2">Recent Data</p>
                        <div className="space-y-1 text-[10px]">
                          {recentProgressLogs.length > 0 ? (
                            recentProgressLogs.slice(0, 3).map((log) => (
                              <div key={log.id} className="flex items-center gap-1">
                                <p className="text-white text-xs font-semibold">{format(new Date(log.logDate), 'MMM d, yyyy')}:</p>
                                <p className="text-white/90 text-xs font-normal">{log.cravingsCount} Craving{log.cravingsCount !== 1 ? 's' : ''}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-white/90 text-xs font-normal">No data yet</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>

                {/* Days Smoke Free Card */}
                <AnimatedCard delay={0.6}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <CardContent className="!p-0 flex flex-col">
                      <div className="flex items-center justify-between h-[136px]">
                        <div className="flex flex-col justify-between h-full flex-1">
                          <CardTitle className="text-[15px] font-normal text-white">Days Smoke Free</CardTitle>
                          <div>
                            <motion.div
                              key={daysSinceQuit}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="2xl:text-[30px] xl:text-[24px] md:text-[20px] text-[18px] font-semibold text-white"
                            >
                              {daysSinceQuit}
                            </motion.div>
                            <p className="text-xs font-medium text-white">Days</p>
                          </div>
                        </div>
                        <div className="w-[150px] h-[136px] flex-shrink-0">
                          <img src="/assets/images/card-img5.png" alt="Days Smoke Free" className="w-full h-full object-contain" />
                        </div>
                      </div>
                      <div className="pt-3 mt-3 border-t border-white/20">
                        <p className="text-base font-semibold text-[#F9C015] mb-2">Recent Data</p>
                        <div className="space-y-1 text-[10px]">
                          {recentProgressLogs.length > 0 ? (
                            recentProgressLogs.slice(0, 3).map((log) => (
                              <div key={log.id} className="flex items-center gap-1">
                                <p className="text-white text-xs font-semibold">{format(new Date(log.logDate), 'MMM d, yyyy')}:</p>
                                <p className="text-white/90 text-xs font-normal">{log.cravingsCount === 0 ? 'Smoke Free' : 'Smoked'}</p>
                              </div>
                            ))
                          ) : (
                            <p className="text-white/90 text-xs font-normal">No data yet</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </AnimatedCard>
              </div>
            </div>
          </div>

          {/* Right Section - Health Recovery Timeline */}
          <div className="lg:w-[30%] w-full">
            <Card className="bg-white max-h-[785px] rounded-[10px] border-0 shadow-none p-5 md:p-[30px] h-full flex flex-col">
              <CardHeader className="!pb-3 p-0 flex-shrink-0">
                <CardTitle className="text-[#561F7A] text-[18px] lg:text-[22px] 2xl:text-[30px] mb-4 text-center font-semibold">
                  Health Recovery Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto pl-0 !pr-0 custom-scrollbar-thin">
                <div className="space-y-3">
                  {[
                    { time: '20 minutes', benefit: 'Heart rate and blood pressure drop', achieved: minutesSinceQuit >= 20 },
                    { time: '12 hours', benefit: 'Carbon monoxide level drops to normal', achieved: hoursSinceQuit >= 12 },
                    { time: '2 weeks', benefit: 'Circulation improves, lung function increases', achieved: daysSinceQuit >= 14 },
                    { time: '1 month', benefit: 'Coughing and shortness of breath decrease', achieved: daysSinceQuit >= 30 },
                    { time: '1 year', benefit: 'Heart disease risk is half that of a smoker', achieved: daysSinceQuit >= 365 },
                    { time: '5 years', benefit: 'Stroke risk reduced to that of a non-smoker', achieved: daysSinceQuit >= 1825 },
                    { time: '10 years', benefit: 'Lung cancer death rate half that of a smoker', achieved: daysSinceQuit >= 3650 },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`flex items-start gap-3 2xl:p-[30px] xl:p-[24px] md:p-[20px] p-[16px] rounded-[20px] transition-colors ${
                        item.achieved 
                          ? 'bg-[#F3EBF8]' 
                          : 'bg-[#F2F2F2]'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className='flex items-center gap-2 mb-2'>
                        <div className={`flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center mt-0.5 ${
                        item.achieved ? 'border border-[#00B10F]' : 'bg-[#E2E2E2]'
                      }`}>
                        {item.achieved ? (
                          <Check className="w-2.5 h-2.5 text-[#00B10F]" />
                        ) : (
                          <></>
                        )}
                      </div>
                        <p className='font-medium text-sm text-[#561F7A]'>
                          {item.time}
                        </p>
                        </div>
                        <p className='text-base font-medium text-[#000000]'>
                          {item.benefit}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
