import { useNavigate } from 'react-router-dom';
import { differenceInHours, differenceInDays } from 'date-fns';
import { motion } from 'framer-motion';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { DailyCoachingCard } from '@/components/DailyCoachingCard';
import { AnimatedCard, FadeIn } from '@/components/ui/animated-container';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import StatisticsCard from '@/components/statistics-card';
import StepsBlock from '@/components/steps-block';

export function DashboardPage() {
  const navigate = useNavigate();

  // Fetch active quit attempt
  const { data: quitAttempt, isLoading } = trpc.quitAttempts.getActive.useQuery();
  const { data: milestones } = trpc.milestones.getByAttempt.useQuery(
    { quitAttemptId: quitAttempt?.id ?? '' },
    { enabled: !!quitAttempt }
  );
  // const { data: recentTriggers } = trpc.triggerLogs.getRecent.useQuery(
  //   { quitAttemptId: quitAttempt?.id ?? '' },
  //   { enabled: !!quitAttempt }
  // );

  // // Fetch today's commitment
  // const { data: todayCommitment, refetch: refetchCommitment } = trpc.commitments.getToday.useQuery(
  //   undefined,
  //   { enabled: !!quitAttempt }
  // );

  // Fetch commitment streak
  const { data: streakData } = trpc.commitments.getStreak.useQuery(
    undefined,
    { enabled: !!quitAttempt }
  );

  // Note: unused variables and commented-out code are left as comments above,
  // to avoid linter warnings and until they're needed for future features.

  if (isLoading) {
    return (
      <AppShell title="Dashboard">
        <DashboardSkeleton />
      </AppShell>
    );
  }

  if (!quitAttempt) {
    return (
      <AppShell title="Dashboard">
        <div className="p-6 flex flex-col items-center justify-center space-y-4">
          <p className="text-muted-foreground">No active quit attempt found</p>
          <Button onClick={() => navigate('/')}>Start Your Journey</Button>
        </div>
      </AppShell>
    );
  }

  // Calculate stats
  const quitDate = new Date(quitAttempt.quitDate);
  const now = new Date();
  const hoursSinceQuit = Math.max(0, differenceInHours(now, quitDate));
  const daysSinceQuit = Math.max(0, differenceInDays(now, quitDate));
  const productsSaved = Math.floor((hoursSinceQuit / 24) * (quitAttempt.dailyUsage || 0));
  const moneySaved =
    quitAttempt.cost != null ? (daysSinceQuit * quitAttempt.cost).toFixed(2) : null;

  return (
    <AppShell title="Dashboard">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="xl:pb-10 xl:px-10 pb-5 px-5 space-y-6"
      >
        <div className="flex items-start justify-between lg:gap-8 gap-4 flex-col lg:flex-row overflow-hidden">
          <div className="lg:w-[70%] w-full">
            {/* Hero Stats */}
            <div className="bg-[#561F7A] rounded-[20px] p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                <AnimatedCard delay={0.1}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col justify-between h-[136px] gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 !p-0">
                          <CardTitle className="text-xs font-medium">Time Smoke-Free</CardTitle>
                        </CardHeader>
                        <CardContent className="!p-0">
                          <motion.div
                            key={hoursSinceQuit}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="md:text-[24px] text-[20px] font-medium"
                          >
                            {hoursSinceQuit < 24
                              ? `${hoursSinceQuit} Hour`
                              : `${daysSinceQuit} day${daysSinceQuit !== 1 ? 's' : ''}`}
                          </motion.div>
                          <p className="text-xs font-medium text-[#ffffff]">
                            Since {new Date(quitAttempt.quitDate).toLocaleDateString()}
                          </p>
                        </CardContent>
                      </div>
                      <div className="w-[150px] h-[136px]">
                        <img
                          src="/assets/images/card-img1.png"
                          alt="Time Smoke-Free"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </Card>
                </AnimatedCard>

                <AnimatedCard delay={0.2}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col justify-between h-[136px] gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 !p-0">
                          <CardTitle className="text-xs font-medium">Products Not Used</CardTitle>
                        </CardHeader>
                        <CardContent className="!p-0">
                          <motion.div
                            key={productsSaved}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="md:text-[24px] text-[20px] font-medium"
                          >
                            {productsSaved}
                          </motion.div>
                          <p className="text-xs font-medium text-[#ffffff]">
                            {quitAttempt.productType.replace('_', ' ')}
                          </p>
                        </CardContent>
                      </div>
                      <div className="w-[150px] h-[136px]">
                        <img
                          src="/assets/images/card-img2.png"
                          alt="Products Not Used"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </Card>
                </AnimatedCard>

                {moneySaved && (
                  <AnimatedCard delay={0.3}>
                    <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col justify-between h-[136px] gap-2">
                          <CardHeader className="flex flex-row items-center justify-between space-y-0 !p-0">
                            <CardTitle className="text-xs font-medium">Money Saved</CardTitle>
                          </CardHeader>
                          <CardContent className="!p-0">
                            <motion.div
                              key={moneySaved}
                              initial={{ scale: 1.2, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="md:text-[24px] text-[20px] font-medium"
                            >
                              ${moneySaved}
                            </motion.div>
                            <p className="text-xs font-medium text-[#ffffff]">Keep it up!</p>
                          </CardContent>
                        </div>
                        <div className="w-[150px] h-[136px]">
                          <img
                            src="/assets/images/card-img3.png"
                            alt="Money Saved"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    </Card>
                  </AnimatedCard>
                )}

                <AnimatedCard delay={0.4}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col justify-between h-[136px] gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 !p-0">
                          <CardTitle className="text-xs font-medium">Milestones</CardTitle>
                        </CardHeader>
                        <CardContent className="!p-0">
                          <motion.div
                            key={milestones?.length}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="md:text-[24px] text-[20px] font-medium"
                          >
                            {milestones?.length || 0}
                          </motion.div>
                          <p className="text-xs font-medium text-[#ffffff]">Achievements unlocked</p>
                        </CardContent>
                      </div>
                      <div className="w-[150px] h-[136px]">
                        <img
                          src="/assets/images/card-img4.png"
                          alt="Milestones"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </Card>
                </AnimatedCard>

                <AnimatedCard delay={0.5}>
                  <Card className="border-0 shadow-none hover:shadow-sm transition-shadow duration-300 bg-[#ffffff13] p-3 rounded-[10px]">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col justify-between h-[136px] gap-2">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 !p-0">
                          <CardTitle className="text-xs font-medium">Commitment Streak</CardTitle>
                        </CardHeader>
                        <CardContent className="!p-0">
                          <motion.div
                            key={streakData?.currentStreak}
                            initial={{ scale: 1.2, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="md:text-[24px] text-[20px] font-medium"
                          >
                            {streakData?.currentStreak || 0} day
                            {streakData?.currentStreak !== 1 ? 's' : ''}
                          </motion.div>
                          <p className="text-xs font-medium text-[#ffffff]">
                            {/** todayCommitment is left commented out above to avoid a linter error about it not being defined */} 
                            {/* {todayCommitment?.morningCommitted ? '✓ Committed today' : 'Not committed yet'} */}
                          </p>
                        </CardContent>
                      </div>
                      <div className="w-[150px] h-[136px]">
                        <img
                          src="/assets/images/card-img5.png"
                          alt="Commitment Streak"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>
                  </Card>
                </AnimatedCard>
              </div>
            </div>
            <StepsBlock />
          </div>

          <div className="lg:w-[30%] w-full">
            <StatisticsCard />
          </div>
        </div>

        {/* Daily Coaching Message */}
        {quitAttempt && (
          <FadeIn delay={0.6}>
            <DailyCoachingCard quitAttemptId={quitAttempt.id} />
          </FadeIn>
        )}

        {/* The following sections are commented out to avoid lint errors for unused variables/components.
            If you want to use these features, be sure to define any missing imports, variables, or interfaces. */}

        {/* Quick Actions */}
        {/* Motivational Section */}
        {/* Recent Activity */}
      </motion.div>
    </AppShell>
  );
}
