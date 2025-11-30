import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Smile, Meh, Frown, SmilePlus, Angry } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FadeIn, AnimatedList, AnimatedListItem } from '@/components/ui/animated-container';
import { motion, AnimatePresence } from 'framer-motion';

const moodEmojis = [
  { value: 1, icon: Angry, label: 'Terrible', color: 'text-red-500' },
  { value: 2, icon: Frown, label: 'Bad', color: 'text-orange-500' },
  { value: 3, icon: Meh, label: 'Okay', color: 'text-yellow-500' },
  { value: 4, icon: Smile, label: 'Good', color: 'text-green-500' },
  { value: 5, icon: SmilePlus, label: 'Great', color: 'text-blue-500' },
];

const progressSchema = z.object({
  logDate: z.string().date(),
  cravingsCount: z.coerce.number().min(0, 'Must be 0 or greater'),
  moodRating: z.number().min(1).max(5).optional(),
  notes: z.string().max(1000).optional(),
});

type ProgressFormData = z.infer<typeof progressSchema>;

export function ProgressPage() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  // Get active quit attempt
  const { data: quitAttempt } = trpc.quitAttempts.getActive.useQuery();
  const { data: progressLogs } = trpc.progressLogs.getByAttempt.useQuery(
    { quitAttemptId: quitAttempt?.id ?? '' },
    { enabled: !!quitAttempt }
  );

  const form = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      logDate: new Date().toISOString().split('T')[0],
      cravingsCount: 0,
      moodRating: 3,
      notes: '',
    },
  });

  const createLog = trpc.progressLogs.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Progress logged!',
        description: 'Your daily progress has been saved.',
      });
      form.reset();
      utils.progressLogs.getByAttempt.invalidate();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ProgressFormData) => {
    if (!quitAttempt) {
      toast({
        title: 'No active quit attempt',
        description: 'Please start a quit attempt first',
        variant: 'destructive',
      });
      return;
    }

    createLog.mutate({
      quitAttemptId: quitAttempt.id,
      ...data,
    });
  };

  if (!quitAttempt) {
    return (
      <AppShell title="Progress Tracking">
        <div className="p-6">
          <p className="text-muted-foreground">Please start a quit attempt first</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell title="Progress Tracking">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="p-6 space-y-6"
      >
        {/* Log Progress Form */}
        <FadeIn delay={0.1}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Log Today's Progress</CardTitle>
              <CardDescription>Track your cravings and mood for today</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="logDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            className="transition-all focus:ring-2 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cravingsCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Cravings</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="How many times did you experience cravings?"
                            {...field}
                            className="transition-all focus:ring-2 focus:ring-purple-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="moodRating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How are you feeling today?</FormLabel>
                        <div className="flex gap-2 sm:gap-4 justify-center py-4">
                          {moodEmojis.map((mood) => {
                            const Icon = mood.icon;
                            const isSelected = field.value === mood.value;
                            return (
                              <motion.button
                                key={mood.value}
                                type="button"
                                onClick={() => field.onChange(mood.value)}
                                whileHover={{ scale: 1.1, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                className={cn(
                                  'flex flex-col items-center gap-2 p-2 sm:p-3 rounded-lg transition-all',
                                  isSelected
                                    ? 'bg-primary text-primary-foreground shadow-lg'
                                    : 'bg-muted hover:bg-muted/80'
                                )}
                              >
                                <motion.div
                                  animate={isSelected ? {
                                    scale: [1, 1.2, 1],
                                    rotate: [0, -10, 10, 0],
                                  } : {}}
                                  transition={{ duration: 0.5 }}
                                >
                                  <Icon className={cn('h-6 w-6 sm:h-8 sm:w-8', isSelected ? '' : mood.color)} />
                                </motion.div>
                                <span className="text-xs font-medium">{mood.label}</span>
                              </motion.button>
                            );
                          })}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any thoughts or observations about today?"
                          className="min-h-[100px] transition-all focus:ring-2 focus:ring-purple-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={createLog.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 shadow-lg"
                  >
                    <AnimatePresence mode="wait">
                      {createLog.isPending ? (
                        <motion.span
                          key="saving"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Saving...
                        </motion.span>
                      ) : (
                        <motion.span
                          key="save"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Save Progress
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
              </form>
            </Form>
          </CardContent>
        </Card>
        </FadeIn>

        {/* Progress History */}
        <FadeIn delay={0.3}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Progress History</CardTitle>
              <CardDescription>Your logged progress over time</CardDescription>
            </CardHeader>
            <CardContent>
              {progressLogs && progressLogs.length > 0 ? (
                <AnimatedList staggerDelay={0.05}>
                  {progressLogs.map((log) => {
                    const mood = moodEmojis.find((m) => m.value === log.moodRating);
                    const MoodIcon = mood?.icon;

                    return (
                      <AnimatedListItem key={log.id}>
                        <motion.div
                          className="flex items-start justify-between p-4 bg-muted rounded-lg mb-3"
                          whileHover={{
                            scale: 1.01,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-medium">
                                {format(new Date(log.logDate), 'MMMM d, yyyy')}
                              </p>
                              {MoodIcon && (
                                <motion.div
                                  className="flex items-center gap-1"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <MoodIcon className={cn('h-5 w-5', mood.color)} />
                                  <span className="text-sm text-muted-foreground">
                                    {mood.label}
                                  </span>
                                </motion.div>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {log.cravingsCount} craving{log.cravingsCount !== 1 ? 's' : ''}
                            </p>
                            {log.notes && (
                              <p className="text-sm mt-2 text-gray-700">{log.notes}</p>
                            )}
                          </div>
                        </motion.div>
                      </AnimatedListItem>
                    );
                  })}
                </AnimatedList>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <p className="text-muted-foreground">No progress logs yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start logging your daily progress above
                  </p>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </FadeIn>
      </motion.div>
    </AppShell>
  );
}
