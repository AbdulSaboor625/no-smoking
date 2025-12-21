import { AppShell } from "@/components/layout/AppShell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { trpc } from "@/lib/trpc";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Smile, Meh, Frown, SmilePlus, Angry, Calendar, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  FadeIn,
} from "@/components/ui/animated-container";
import { motion } from "framer-motion";

const moodEmojis = [
  { value: 1, icon: Angry, label: "Terrible", color: "text-red-500" },
  { value: 2, icon: Frown, label: "Bad", color: "text-orange-500" },
  { value: 3, icon: Meh, label: "Okay", color: "text-yellow-500" },
  { value: 4, icon: Smile, label: "Good", color: "text-green-500" },
  { value: 5, icon: SmilePlus, label: "Great", color: "text-blue-500" },
];

const progressSchema = z.object({
  logDate: z.string().date(),
  cravingsCount: z.coerce.number().min(0, "Must be 0 or greater"),
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
    { quitAttemptId: quitAttempt?.id ?? "" },
    { enabled: !!quitAttempt }
  );

  const form = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
    defaultValues: {
      logDate: new Date().toISOString().split("T")[0],
      cravingsCount: 0,
      moodRating: 3,
      notes: "",
    },
  });

  const createLog = trpc.progressLogs.create.useMutation({
    onSuccess: () => {
      toast({
        title: "Progress logged!",
        description: "Your daily progress has been saved.",
      });
      form.reset();
      utils.progressLogs.getByAttempt.invalidate();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProgressFormData) => {
    if (!quitAttempt) {
      toast({
        title: "No active quit attempt",
        description: "Please start a quit attempt first",
        variant: "destructive",
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
          <p className="text-muted-foreground">
            Please start a quit attempt first
          </p>
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
        <div className="flex items-start justify-between xl:flex-row flex-col 2xl:gap-10 gap-6 mb-6">
          <div className="xl:w-[70%] w-full flex flex-col gap-6">
            {/* Log Progress Form */}
            <FadeIn delay={0.1}>
              <Card className="bg-white rounded-[10px] p-[30px] border-0 shadow-none">
                <CardHeader className="bg-[#561F7A] rounded-t-[10px] p-[23px] text-center">
                  <CardTitle className="text-white text-xl lg:text-[24px] xl:text-[28px] 2xl:text-[32px] font-semibold mb-3">
                    Log Today's Progress
                  </CardTitle>
                  <CardDescription className="text-white text-xs font-normal">
                    Track your cravings and mood for today
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-6"
                    >
                      <div className="grid grid-cols-1 2xl:grid-cols-2 md:gap-12 gap-6">
                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="logDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#561F7A] text-base font-semibold block mb-2">Date</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="date"
                                      id={`logDate-${field.name}`}
                                      {...field}
                                      className="bg-[#F2F2F2] text-[#131316] border-none rounded-lg h-[63px] w-full placeholder:text-[#C9C9C9] pr-12"
                                    />
                                    <button
                                      type="button"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        const input = document.getElementById(`logDate-${field.name}`) as HTMLInputElement;
                                        if (input) {
                                          input.focus();
                                          input.click();
                                          if (input.showPicker) {
                                            input.showPicker();
                                          }
                                        }
                                      }}
                                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer bg-transparent border-none p-0"
                                    >
                                      <Calendar 
                                        className="h-5 w-5 text-[#561F7A]"
                                      />
                                    </button>
                                  </div>
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
                                <FormLabel className="text-[#561F7A] text-base font-semibold block mb-2">Number of Cravings</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    {...field}
                                    className="bg-[#F2F2F2] text-[#131316] border-none rounded-lg h-[63px] text-base placeholder:text-[#C9C9C9]"
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
                                <FormLabel className="text-[#561F7A] text-base font-semibold block mb-2">How are you feeling today?</FormLabel>
                                <div className="flex gap-2 sm:gap-4 justify-start items-center py-4">
                                  {moodEmojis.map((mood) => {
                                    const Icon = mood.icon;
                                    const isSelected = field.value === mood.value;
                                    return (
                                      <button
                                        key={mood.value}
                                        type="button"
                                        onClick={() => field.onChange(mood.value)}
                                        className={cn(
                                          "flex flex-col items-center gap-2 p-3 rounded-[10px] transition-all max-w-[70px] w-full",
                                          isSelected
                                            ? "bg-[#F9C015] shadow-lg"
                                            : "bg-[#F2F2F2] hover:bg-[#cdcccc]"
                                        )}
                                      >
                                        <Icon
                                          className={cn(

                                            "h-[20px] w-[20px]",
                                            isSelected ? "text-[#561F7A]" : mood.color
                                          )}
                                        />
                                        <span className={cn(
                                          "text-xs font-medium",
                                          isSelected ? "text-[#561F7A]" : "text-[#131316]"
                                        )}>
                                          {mood.label}
                                        </span>
                                      </button>
                                    );
                                  })}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-6">
                          <FormField
                            control={form.control}
                            name="notes"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-[#561F7A] text-base font-semibold block mb-2">What did you do to cope?</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Any thoughts or observations about today?"
                                    className="min-h-[200px] bg-[#F2F2F2] text-[#131316] border-none rounded-lg placeholder:text-[#C9C9C9]"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <Button
                            type="submit"
                            disabled={createLog.isPending}
                            className="w-full bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#561F7A] font-semibold rounded-lg h-[70px] text-lg"
                          >
                            {createLog.isPending ? <Loader className="animate-spin min-h-5 min-w-5" /> : 'Log Craving'}
                          </Button>
                        </div>
                      </div>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </FadeIn>

            {/* Progress History */}
            <FadeIn delay={0.3}>
              <Card className="bg-white rounded-[10px] border-0 shadow-none">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-[#561F7A] text-xl lg:text-[24px] xl:text-[28px] 2xl:text-[32px] font-semibold">
                    Progress History
                  </CardTitle>
                  <CardDescription className="text-[#131316] text-sm font-normal mt-2">
                    Your logged progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {progressLogs && progressLogs.length > 0 ? (
                    <div className="space-y-4">
                      {progressLogs.map((log) => {
                        const mood = moodEmojis.find(
                          (m) => m.value === log.moodRating
                        );
                        const MoodIcon = mood?.icon;

                        return (
                          <div
                            key={log.id}
                            className="bg-[#F2F2F2] hover:bg-[#E5E5E5] transition-all duration-300 rounded-lg p-5"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <p className="text-base font-semibold text-[#131316]">
                                    {format(
                                      new Date(log.logDate),
                                      "MMMM d, yyyy"
                                    )}
                                  </p>
                                  {MoodIcon && (
                                    <div className="flex items-center gap-2">
                                      <MoodIcon
                                        className={cn("h-5 w-5", mood.color)}
                                      />
                                      <span className="text-sm font-medium text-[#131316]">
                                        {mood.label}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm font-medium text-[#131316] mb-2">
                                  {log.cravingsCount} craving
                                  {log.cravingsCount !== 1 ? "s" : ""}
                                </p>
                                {log.notes && (
                                  <p className="text-sm text-[#131316] mt-2">
                                    {log.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-[#131316] text-base font-normal mb-2">
                        No progress logs yet.
                      </p>
                      <p className="text-sm text-[#131316] font-normal">
                        Start logging your daily progress above
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </FadeIn>
          </div>

          <div className="xl:w-[30%] w-full">
            <Card className="bg-white rounded-[10px] 2xl:p-[30px] p-5 border-0 shadow-none">
              <CardHeader className="text-center !P-0">
                <CardTitle className="text-[#561F7A] text-xl lg:text-[24px] xl:text-[28px] 2xl:text-[32px] font-semibold mb-3">
                  Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    No progress logs yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </AppShell>
  );
}
