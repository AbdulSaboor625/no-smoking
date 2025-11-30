import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { differenceInHours, differenceInDays } from 'date-fns';
import { TrendingUp, AlertTriangle, Heart, DollarSign, Clock, Award, Plus, Flame, LifeBuoy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MorningCommitmentModal } from '@/components/MorningCommitmentModal';
import { EveningReflectionModal } from '@/components/EveningReflectionModal';
import { DailyCoachingCard } from '@/components/DailyCoachingCard';
import { AnimatedCard, AnimatedList, AnimatedListItem, FadeIn } from '@/components/ui/animated-container';
import { DashboardSkeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

export function DashboardPage() {
  const navigate = useNavigate();
  const [showMorningCommitment, setShowMorningCommitment] = useState(false);
  const [showEveningReflection, setShowEveningReflection] = useState(false);

  // Fetch active quit attempt
  const { data: quitAttempt, isLoading } = trpc.quitAttempts.getActive.useQuery();
  const { data: milestones } = trpc.milestones.getByAttempt.useQuery(
    { quitAttemptId: quitAttempt?.id ?? '' },
    { enabled: !!quitAttempt }
  );
  const { data: recentTriggers } = trpc.triggerLogs.getRecent.useQuery(
    { quitAttemptId: quitAttempt?.id ?? '' },
    { enabled: !!quitAttempt }
  );

  // Fetch today's commitment
  const { data: todayCommitment, refetch: refetchCommitment } = trpc.commitments.getToday.useQuery(
    undefined,
    { enabled: !!quitAttempt }
  );

  // Fetch commitment streak
  const { data: streakData } = trpc.commitments.getStreak.useQuery(
    undefined,
    { enabled: !!quitAttempt }
  );

  // Check time of day and commitment status
  useEffect(() => {
    if (!quitAttempt || !todayCommitment) return;

    const hour = new Date().getHours();
    const isMorning = hour >= 6 && hour < 12;
    const isEvening = hour >= 18 && hour < 23;

    // Show morning commitment if it's morning and they haven't committed
    if (isMorning && !todayCommitment.morningCommitted) {
      setShowMorningCommitment(true);
    }

    // Show evening reflection if it's evening, they committed but haven't reflected
    if (isEvening && todayCommitment.morningCommitted && !todayCommitment.eveningReflected) {
      setShowEveningReflection(true);
    }
  }, [quitAttempt, todayCommitment]);

  const handleMorningCommit = () => {
    setShowMorningCommitment(false);
    refetchCommitment();
  };

  const handleEveningReflect = () => {
    setShowEveningReflection(false);
    refetchCommitment();
  };

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
          <Button onClick={() => navigate('/onboarding')}>Start Your Journey</Button>
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
  const moneySaved = quitAttempt.cost ? (daysSinceQuit * quitAttempt.cost).toFixed(2) : null;

  return (
    <AppShell title="Dashboard">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        {/* Hero Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatedCard delay={0.1}>
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Time Smoke-Free</CardTitle>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={hoursSinceQuit}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold"
                >
                  {hoursSinceQuit < 24
                    ? `${hoursSinceQuit}h`
                    : `${daysSinceQuit} day${daysSinceQuit !== 1 ? 's' : ''}`}
                </motion.div>
                <p className="text-xs text-muted-foreground">
                  Since {new Date(quitAttempt.quitDate).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={0.2}>
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Products Not Used</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <motion.div
                  key={productsSaved}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-green-600"
                >
                  {productsSaved}
                </motion.div>
                <p className="text-xs text-muted-foreground">
                  {quitAttempt.productType.replace('_', ' ')}
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>

          {moneySaved && (
            <AnimatedCard delay={0.3}>
              <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Money Saved</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <motion.div
                    key={moneySaved}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-2xl font-bold text-emerald-600"
                  >
                    ${moneySaved}
                  </motion.div>
                  <p className="text-xs text-muted-foreground">Keep it up!</p>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}

          <AnimatedCard delay={0.4}>
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Milestones</CardTitle>
                <Award className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <motion.div
                  key={milestones?.length}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-purple-600"
                >
                  {milestones?.length || 0}
                </motion.div>
                <p className="text-xs text-muted-foreground">Achievements unlocked</p>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard delay={0.5}>
            <Card className="border-0 shadow-md hover:shadow-xl transition-shadow duration-300 bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commitment Streak</CardTitle>
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                >
                  <Flame className="h-4 w-4 text-orange-600" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div
                  key={streakData?.currentStreak}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-bold text-orange-600"
                >
                  {streakData?.currentStreak || 0} day{streakData?.currentStreak !== 1 ? 's' : ''}
                </motion.div>
                <p className="text-xs text-orange-700">
                  {todayCommitment?.morningCommitted ? '✓ Committed today' : 'Not committed yet'}
                </p>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        {/* Daily Coaching Message */}
        {quitAttempt && (
          <FadeIn delay={0.6}>
            <DailyCoachingCard quitAttemptId={quitAttempt.id} />
          </FadeIn>
        )}

        {/* Quick Actions */}
        <FadeIn delay={0.7}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Track your progress and manage cravings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate('/progress')}
                    className="h-20 w-full flex flex-col items-center justify-center space-y-2 bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 font-semibold shadow-lg"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Log Progress</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate('/triggers')}
                    variant="outline"
                    className="h-20 w-full flex flex-col items-center justify-center space-y-2 border-2 hover:border-orange-400 hover:bg-orange-50 transition-all"
                  >
                    <AlertTriangle className="h-5 w-5" />
                    <span>Log Craving</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate('/emergency')}
                    variant="destructive"
                    className="h-20 w-full flex flex-col items-center justify-center space-y-2 bg-red-600 hover:bg-red-700 shadow-lg"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <LifeBuoy className="h-5 w-5" />
                    </motion.div>
                    <span>Emergency Help</span>
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={() => navigate('/milestones')}
                    variant="outline"
                    className="h-20 w-full flex flex-col items-center justify-center space-y-2 border-2 hover:border-purple-400 hover:bg-purple-50 transition-all"
                  >
                    <Award className="h-5 w-5" />
                    <span>View Milestones</span>
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Motivational Section */}
        <FadeIn delay={0.8}>
          <Card className="bg-gradient-to-r from-brand-purple-100 to-brand-yellow-100 border-none shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatDelay: 2,
                  }}
                >
                  <Heart className="h-5 w-5 text-brand-purple-600" />
                </motion.div>
                Why You're Quitting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatedList staggerDelay={0.1}>
                {quitAttempt.reasons && quitAttempt.reasons.length > 0 ? (
                  quitAttempt.reasons.map((reason, index) => (
                    <AnimatedListItem key={index}>
                      <div className="flex items-center space-x-2 py-1">
                        <motion.div
                          className="w-2 h-2 rounded-full bg-brand-purple-600"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        />
                        <span className="text-sm">{reason}</span>
                      </div>
                    </AnimatedListItem>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No reasons added yet</p>
                )}
              </AnimatedList>
            </CardContent>
          </Card>
        </FadeIn>

        {/* Recent Activity */}
        {recentTriggers && recentTriggers.length > 0 && (
          <FadeIn delay={0.9}>
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle>Recent Triggers</CardTitle>
                <CardDescription>Your last 5 logged cravings</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatedList staggerDelay={0.1}>
                  {recentTriggers.map((trigger, index) => (
                    <AnimatedListItem key={trigger.id}>
                      <motion.div
                        className="flex items-center justify-between p-3 bg-muted rounded-lg mb-3"
                        whileHover={{ x: 4, backgroundColor: 'rgba(0,0,0,0.03)' }}
                        transition={{ duration: 0.2 }}
                      >
                        <div>
                          <p className="font-medium capitalize">
                            {trigger.triggerType.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(trigger.occurredAt).toLocaleString()}
                          </p>
                        </div>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          <Badge variant={trigger.wasSuccessful ? 'default' : 'secondary'}>
                            {trigger.wasSuccessful ? 'Resisted' : 'Challenged'}
                          </Badge>
                        </motion.div>
                      </motion.div>
                    </AnimatedListItem>
                  ))}
                </AnimatedList>
              </CardContent>
            </Card>
          </FadeIn>
        )}
      </motion.div>

      {/* Modals */}
      {showMorningCommitment && (
        <MorningCommitmentModal
          quitAttemptId={quitAttempt.id}
          onClose={() => setShowMorningCommitment(false)}
          onCommit={handleMorningCommit}
        />
      )}

      {showEveningReflection && (
        <EveningReflectionModal
          onClose={() => setShowEveningReflection(false)}
          onReflect={handleEveningReflect}
        />
      )}
    </AppShell>
  );
}
