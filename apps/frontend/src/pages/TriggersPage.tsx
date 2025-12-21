import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { type TriggerType } from '@smoking-quit/shared-types';
import { CheckCircle, Loader, X } from 'lucide-react';

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
        <div className="flex items-start justify-between xl:flex-row flex-col 2xl:gap-10 gap-6 mb-6">
          <div className='xl:w-[70%] w-full'>
            <div className="flex items-stretch justify-between xl:flex-row flex-col gap-4 w-full md:mb-6 mb-4">
              <Card className="xl:w-[70%] w-full bg-[#561F7A] border-none rounded-xl flex flex-col">
                <CardContent className="p-4 2xl:p-6 py-4 px-5 flex flex-col flex-1">
                  <div className="flex items-center justify-between xl:flex-row flex-col 2xl:gap-16 md:gap-6 gap-5 flex-1">
                    <div className='lg:max-w-[125px] w-full mr-auto'>
                      <h3 className="text-base font-normal text-white md:mb-1">Success Rate</h3>
                      <div className="2xl:text-[30px] md:text-[25px] text-[20px] font-semibold text-white md:mb-1">{successRate}%</div>
                      <p className="text-xs font-normal text-white/90">
                        You've successfully resisted {triggerLogs?.filter((l) => l.wasSuccessful).length || 0}{' '}
                        out of {triggerLogs?.length || 0} cravings
                      </p>
                    </div>

                    <div className="w-full">
                      <div className="relative w-full 2xl:h-[67px] h-[50px] border sm:border-2 md:border-white rounded-full">
                        <div 
                          className={`absolute left-0 top-0 h-full bg-[#F9C015] transition-all duration-300 ${
                            successRate === 100 ? 'rounded-full' : 'rounded-l-full'
                          }`}
                          style={{ width: `${Math.min(successRate, 100)}%` }}
                        ></div>
                      </div>

                      {/* Percentage Markers */}
                      <div className="relative w-full flex justify-between items-start px-0.5 mt-4 border-t sm:border-t-2 border-white">
                        {[0, 20, 40, 60, 80, 100].map((value) => (
                          <div key={value} className="flex flex-col items-center">
                            <div className="w-0.5 h-2 bg-white mb-1"></div>
                            <span className="text-xs 2xl:text-base text-white whitespace-nowrap">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className='xl:w-[30%] w-full bg-[#561F7A] border-none rounded-xl px-4 md:px-[30px] 2xl:px-[42px] md:py-[30px] py-4 flex flex-col'>
                <CardHeader className='!p-0 mb-3 flex-shrink-0'>
                  <CardTitle className="sm:text-base text-sm text-white font-semibold">Top Triggers</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col !p-0">
                  {mostCommonTriggers.length > 0 ? (
                    <div className="space-y-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-2">
                      {mostCommonTriggers.map(([trigger]) => (
                        <div key={trigger} className="flex items-center justify-between">
                          <div className='flex items-center gap-2'>
                          <svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 7L0 0V14L10 7Z" fill="#F9C015"/>
                          </svg>
                          <span className="text-lg md:text-[20px] 2xl:text-[24px] text-white font-semibold capitalize">{trigger.replace('_', ' ')}</span>
                          </div>
                          {/* <Badge>{count}</Badge> */}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="pt-4 text-[14px] md:text-base text-[#fff]/80 text-center font-normal">No triggers logged yet</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Log Trigger Form */}
            <Card className="rounded-[10px] !border-none shadow-none overflow-hidden bg-[#fff] md:p-5 p-4 lg:p-[30px]">
              {/* Purple Header */}
              <div className="rounded-t-xl md:px-6 px-4 md:py-8 py-4 text-center bg-[#561F7A]">
                <h2 className="md:text-2xl text-xl lg:text-[32px] font-semibold text-white mb-2">Log a Craving</h2>
                <p className="text-xs font-normal text-white/90">Track when and how you experience cravings</p>
              </div>

              {/* Form Content */}
              <CardContent className="md:p-8 p-4 pb-0">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 md:gap-12 gap-6">
                      {/* Left Column */}
                      <div className="md:space-y-10 space-y-6">
                        <FormField
                          control={form.control}
                          name="triggerType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#561F7A] md:text-base text-sm font-semibold block md:mb-2 mb-0">What triggered the craving?</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-[#F2F2F2] border-none rounded-[10px] md:h-16 h-11 text-[#131316] pr-12 relative [&>svg]:hidden">
                                    <SelectValue placeholder="Select a trigger" className="text-[#131316]" />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none md:w-[21px] md:h-[11px] w-[16px] h-[8px]">
                                      <svg width="100%" height="100%" viewBox="0 0 21 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M0.462242 0.420639C0.758305 0.151304 1.1598 0 1.57843 0C1.99707 0 2.39856 0.151304 2.69462 0.420639L10.5095 7.53218L18.3244 0.420639C18.6222 0.158937 19.021 0.0141287 19.4349 0.0174017C19.8489 0.0206757 20.2449 0.171768 20.5376 0.43814C20.8303 0.704511 20.9963 1.06485 20.9999 1.44154C21.0035 1.81823 20.8444 2.18114 20.5568 2.4521L11.6257 10.5794C11.3297 10.8487 10.9282 11 10.5095 11C10.0909 11 9.6894 10.8487 9.39334 10.5794L0.462242 2.4521C0.166269 2.18268 0 1.81732 0 1.43637C0 1.05541 0.166269 0.690055 0.462242 0.420639Z" fill="#561F7A"/>
                                      </svg>
                                    </div>
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
                              <FormLabel className="text-[#561F7A] md:text-base text-sm font-semibold block md:mb-2 mb-0">Intensity</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Slider
                                    min={1}
                                    max={5}
                                    step={1}
                                    value={[field.value]}
                                    onValueChange={(vals) => field.onChange(vals[0])}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#561F7A] md:text-base text-sm font-semibold block md:mb-2 mb-0">Location (Optional)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Location" 
                                  {...field}
                                  className="bg-[#F2F2F2] text-[#131316] border-none rounded-lg md:h-11 h-10 text-sm md:text-base placeholder:text-[#C9C9C9]"
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
                              <FormLabel className="text-[#561F7A] md:text-base text-sm font-semibold block md:mb-2 mb-0">Did you resist the cravings</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => field.onChange(value === 'true')}
                                  value={field.value ? 'true' : 'false'}
                                  className="flex gap-6"
                                >
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                      value="true" 
                                      id="success-yes"
                                      className="border-2 border-gray-300 data-[state=checked]:border-[#F9C015] data-[state=checked]:bg-[#F9C015] [&_[data-state=checked]_svg]:fill-[#F9C015]"
                                    />
                                    <label
                                      htmlFor="success-yes"
                                      className="text-sm font-medium text-[#131316] cursor-pointer"
                                    >
                                      Yes
                                    </label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <RadioGroupItem 
                                      value="false" 
                                      id="success-no"
                                      className="border-2 border-gray-300 data-[state=checked]:border-[#F9C015] data-[state=checked]:bg-[#F9C015] [&_[data-state=checked]_svg]:fill-[#F9C015]"
                                    />
                                    <label
                                      htmlFor="success-no"
                                      className="text-sm font-medium text-[#131316] cursor-pointer"
                                    >
                                      No
                                    </label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Right Column */}
                      <div className="md:space-y-10 space-y-6">
                        <FormField
                          control={form.control}
                          name="copingStrategy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[#561F7A] md:text-base text-sm font-semibold block md:mb-2 mb-0">What did you do to cope?</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe the strategy you used to manage the craving"
                                  className="min-h-[120px] bg-[#F2F2F2] text-[#131316] border-none rounded-lg placeholder:text-[#C9C9C9] placeholder:!text-sm md:placeholder:text-base"
                                  {...field}
                                />
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
                              <FormLabel className="text-[#561F7A] md:text-base text-sm font-semibold block md:mb-2 mb-0">Additional Notes (Optional)</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Any other observations"
                                  className="min-h-[120px] bg-[#F2F2F2] text-[#131316] border-none rounded-lg placeholder:text-[#C9C9C9] placeholder:!text-sm md:placeholder:text-base"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        {/* Submit Button */}
                    <Button 
                      type="submit" 
                      disabled={createTrigger.isPending} 
                      className="w-full bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#561F7A] font-semibold rounded-lg md:h-[70px] h-11 text-sm md:text-lg"
                    >
                      {createTrigger.isPending ? <Loader className="animate-spin min-h-5 min-w-5" /> : 'Log Craving'}
                    </Button>
                      </div>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          
          <div className='xl:w-[30%] w-full'>
            {/* Trigger History */}
            <Card className='rounded-[10px] !border-none shadow-none overflow-hidden bg-[#fff]'>
              <CardHeader className='px-5 md:px-[30px] pt-4 md:pt-[30px] pb-2 md:pb-4'>
                <CardTitle className='text-[#561F7A] text-center text-xl md:text-[22px] 2xl:text-[30px] font-semibold px-4 2xl:mb-8 lg:mb-6 mb-4'>Previously Logged Triggers</CardTitle>
              </CardHeader>
              <CardContent className='px-5 md:px-[30px] pb-5 md:pb-[30px]'>
                {triggerLogs && triggerLogs.length > 0 ? (
                  <div className="max-h-[730px] overflow-y-auto space-y-6 pr-2 custom-scrollbar">
                    {triggerLogs.map((log) => {
                      const triggerLabel = triggerOptions.find(opt => opt.value === log.triggerType)?.label || log.triggerType.replace('_', ' ');
                      return (
                        <div
                          key={log.id}
                          className="bg-[#F2F2F2] hover:bg-[#E5E5E5] transition-all duration-300 px-5 md:px-[28px] 2xl:px-[51px] py-4 md:py-[25px] 2xl:py-[30px] lg:rounded-[40px] md:rounded-[28px] rounded-[22px]"
                        >
                          <div className="flex items-start justify-between flex-col md:gap-3 gap-2">
                            <div className="">
                              <p className="2xl:text-base text-sm font-semibold text-[#000000] md:mb-2 mb-0">
                                {format(new Date(log.occurredAt), 'MMMM d, yyyy')}
                              </p>
                              <p className="2xl:text-[25px] md:text-[20px] text-[18px] font-semibold text-[#000000] capitalize md:py-1 py-0 pt-1 md:pt-0">
                                {triggerLabel}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {log.wasSuccessful ? (
                                <>
                                  <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="h-3 w-3 text-white" />
                                  </div>
                                  <span className="text-base font-normal text-[#561F7A]">Resisted</span>
                                </>
                              ) : (
                                <>
                                  <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center flex-shrink-0">
                                    <X className="h-3 w-3 text-white" />
                                  </div>
                                  <span className="text-base font-normal text-[#561F7A]">Unresisted</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-gray-500">No cravings logged yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
