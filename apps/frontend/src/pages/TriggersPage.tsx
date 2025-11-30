import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { type TriggerType } from '@smoking-quit/shared-types';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

const triggerOptions: { value: TriggerType; label: string }[] = [
  { value: 'coffee', label: 'Coffee/Caffeine' },
  { value: 'after_meals', label: 'After Meals' },
  { value: 'driving', label: 'Driving' },
  { value: 'work', label: 'Work/Breaks' },
  { value: 'stress', label: 'Stress' },
  { value: 'boredom', label: 'Boredom' },
  { value: 'social', label: 'Social Situations' },
  { value: 'before_bed', label: 'Before Bed' },
  { value: 'waking_up', label: 'Waking Up' },
  { value: 'alcohol', label: 'Drinking Alcohol' },
  { value: 'outside', label: 'Being Outside' },
  { value: 'phone', label: 'Phone/Screen Time' },
  { value: 'emotional', label: 'Emotional Distress' },
  { value: 'other', label: 'Other' },
];

const triggerSchema = z.object({
  triggerType: z.enum(['coffee', 'after_meals', 'driving', 'work', 'stress', 'boredom', 'social', 'before_bed', 'waking_up', 'alcohol', 'outside', 'phone', 'emotional', 'other']),
  intensity: z.number().min(1).max(5),
  location: z.string().max(200).optional(),
  copingStrategy: z.string().min(10, 'Please describe your coping strategy (at least 10 characters)').max(500),
  wasSuccessful: z.boolean(),
  notes: z.string().max(1000).optional(),
});

type TriggerFormData = z.infer<typeof triggerSchema>;

export function TriggersPage() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  // Get active quit attempt
  const { data: quitAttempt } = trpc.quitAttempts.getActive.useQuery();
  const { data: triggerLogs } = trpc.triggerLogs.getByAttempt.useQuery(
    { quitAttemptId: quitAttempt?.id ?? '' },
    { enabled: !!quitAttempt }
  );

  const form = useForm<TriggerFormData>({
    resolver: zodResolver(triggerSchema),
    defaultValues: {
      triggerType: 'stress',
      intensity: 3,
      location: '',
      copingStrategy: '',
      wasSuccessful: true,
      notes: '',
    },
  });

  const createTrigger = trpc.triggerLogs.create.useMutation({
    onSuccess: () => {
      toast({
        title: 'Trigger logged!',
        description: 'Your craving has been recorded.',
      });
      form.reset();
      utils.triggerLogs.getByAttempt.invalidate();
      utils.triggerLogs.getRecent.invalidate();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: TriggerFormData) => {
    if (!quitAttempt) {
      toast({
        title: 'No active quit attempt',
        description: 'Please start a quit attempt first',
        variant: 'destructive',
      });
      return;
    }

    createTrigger.mutate({
      quitAttemptId: quitAttempt.id,
      ...data,
    });
  };

  if (!quitAttempt) {
    return (
      <AppShell title="Trigger Management">
        <div className="p-6">
          <p className="text-muted-foreground">Please start a quit attempt first</p>
        </div>
      </AppShell>
    );
  }

  // Calculate trigger insights
  const triggerCounts = triggerLogs?.reduce((acc, log) => {
    acc[log.triggerType] = (acc[log.triggerType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostCommonTriggers = Object.entries(triggerCounts || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const successRate = triggerLogs?.length
    ? Math.round(
        (triggerLogs.filter((log) => log.wasSuccessful).length / triggerLogs.length) * 100
      )
    : 0;

  return (
    <AppShell title="Trigger Management">
      <div className="p-6 space-y-6">
        {/* Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{successRate}%</div>
              <p className="text-sm text-muted-foreground">
                You've successfully resisted {triggerLogs?.filter((l) => l.wasSuccessful).length || 0}{' '}
                out of {triggerLogs?.length || 0} cravings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Triggers</CardTitle>
            </CardHeader>
            <CardContent>
              {mostCommonTriggers.length > 0 ? (
                <div className="space-y-2">
                  {mostCommonTriggers.map(([trigger, count]) => (
                    <div key={trigger} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{trigger.replace('_', ' ')}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No triggers logged yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Log Trigger Form */}
        <Card>
          <CardHeader>
            <CardTitle>Log a Craving</CardTitle>
            <CardDescription>Track when and how you experience cravings</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="triggerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What triggered the craving?</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a trigger" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {triggerOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="intensity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intensity: {field.value}/5</FormLabel>
                      <FormControl>
                        <Slider
                          min={1}
                          max={5}
                          step={1}
                          value={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                          className="py-4"
                        />
                      </FormControl>
                      <FormDescription>
                        1 = Mild discomfort, 5 = Overwhelming urge
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Home, Office, Car" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="copingStrategy"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What did you do to cope?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the strategy you used to manage the craving..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wasSuccessful"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Did you resist the craving?</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === 'true')}
                          value={field.value ? 'true' : 'false'}
                          className="flex gap-4"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="success-yes" />
                            <label
                              htmlFor="success-yes"
                              className="text-sm font-medium cursor-pointer flex items-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              Yes, I resisted
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="success-no" />
                            <label
                              htmlFor="success-no"
                              className="text-sm font-medium cursor-pointer flex items-center gap-2"
                            >
                              <XCircle className="h-4 w-4 text-orange-600" />
                              No, it was challenging
                            </label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any other observations..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={createTrigger.isPending} className="w-full">
                  {createTrigger.isPending ? 'Saving...' : 'Log Craving'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Trigger History */}
        <Card>
          <CardHeader>
            <CardTitle>Craving History</CardTitle>
            <CardDescription>Your logged cravings and how you handled them</CardDescription>
          </CardHeader>
          <CardContent>
            {triggerLogs && triggerLogs.length > 0 ? (
              <div className="space-y-4">
                {triggerLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 p-4 bg-muted rounded-lg"
                  >
                    <div className="flex-shrink-0 mt-1">
                      {log.wasSuccessful ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium capitalize">
                          {log.triggerType.replace('_', ' ')}
                        </p>
                        <Badge variant="outline">Intensity {log.intensity}/5</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {format(new Date(log.occurredAt), 'MMMM d, yyyy h:mm a')}
                        {log.location && ` • ${log.location}`}
                      </p>
                      <div className="bg-background p-3 rounded border text-sm">
                        <p className="font-medium mb-1">Coping Strategy:</p>
                        <p className="text-gray-700">{log.copingStrategy}</p>
                      </div>
                      {log.notes && (
                        <p className="text-sm text-gray-700 mt-2">{log.notes}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No cravings logged yet</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Log your first craving above to start tracking patterns
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
