import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { differenceInHours, differenceInDays, format } from 'date-fns';
import { Award, Check, Lock, Heart, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  if (!quitAttempt) {
    return (
      <AppShell title="Milestones">
        <div className="p-6">
          <p className="text-muted-foreground">Please start a quit attempt first</p>
        </div>
      </AppShell>
    );
  }

  const quitDate = new Date(quitAttempt.quitDate);
  const now = new Date();
  const hoursSinceQuit = Math.max(0, differenceInHours(now, quitDate));
  const daysSinceQuit = Math.max(0, differenceInDays(now, quitDate));

  const achievedMilestoneTypes = new Set(milestones?.map((m) => m.milestoneType) || []);

  return (
    <AppShell title="Milestones">
      <div className="p-6 space-y-6">
        {/* Progress Overview */}
        <Card className="bg-gradient-to-r from-brand-purple-100 to-brand-yellow-100 border-none">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-6 w-6 text-brand-purple-600" />
              Your Journey
            </CardTitle>
            <CardDescription className="text-gray-700">
              {daysSinceQuit} days and {hoursSinceQuit % 24} hours smoke-free
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-3xl font-bold text-brand-purple-700">
                {milestones?.length || 0}
              </div>
              <div className="text-sm text-gray-700">
                milestone{milestones?.length !== 1 ? 's' : ''} achieved
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Milestone Timeline */}
        <div className="space-y-4">
          {milestoneDefinitions.map((milestone, index) => {
            const isAchieved = achievedMilestoneTypes.has(milestone.type);
            const isNext = !isAchieved && hoursSinceQuit < milestone.hours &&
                          (index === 0 || achievedMilestoneTypes.has(milestoneDefinitions[index - 1].type));
            const isLocked = hoursSinceQuit < milestone.hours;
            const Icon = milestone.icon;

            const achievedMilestone = milestones?.find((m) => m.milestoneType === milestone.type);

            return (
              <Card
                key={milestone.id}
                className={cn(
                  'transition-all',
                  isAchieved && 'border-green-500 bg-green-50',
                  isNext && 'border-brand-purple-500 shadow-lg'
                )}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          'p-3 rounded-full',
                          isAchieved
                            ? 'bg-green-500 text-white'
                            : isNext
                            ? 'bg-brand-purple-500 text-white'
                            : 'bg-gray-200 text-gray-400'
                        )}
                      >
                        {isAchieved ? (
                          <Check className="h-6 w-6" />
                        ) : isLocked ? (
                          <Lock className="h-6 w-6" />
                        ) : (
                          <Icon className="h-6 w-6" />
                        )}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-1">
                          {milestone.title}
                        </CardTitle>
                        <CardDescription>{milestone.description}</CardDescription>
                        {isAchieved && achievedMilestone && (
                          <p className="text-sm text-green-600 font-medium mt-2">
                            Achieved on {format(new Date(achievedMilestone.achievedAt), 'MMMM d, yyyy')}
                          </p>
                        )}
                        {isNext && (
                          <p className="text-sm text-brand-purple-600 font-medium mt-2">
                            Next milestone - Keep going!
                          </p>
                        )}
                      </div>
                    </div>
                    {isAchieved && (
                      <Badge className="bg-green-500">Unlocked</Badge>
                    )}
                  </div>
                </CardHeader>
                {isAchieved && (
                  <CardContent>
                    <div className="bg-white p-4 rounded-lg">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Health Benefits
                      </h4>
                      <ul className="space-y-1">
                        {milestone.healthBenefits.map((benefit, i) => (
                          <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                            <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
