import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { differenceInHours, differenceInDays, differenceInMinutes } from 'date-fns';
import { DollarSign, Clock, Heart, TrendingUp, Cigarette, Award } from 'lucide-react';

export function StatisticsPage() {
  const { data: quitAttempt } = trpc.quitAttempts.getActive.useQuery();
  const { data: progressLogs } = trpc.progressLogs.getByAttempt.useQuery(
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
  const weeksSinceQuit = Math.floor(daysSinceQuit / 7);

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

  // Calculate average cravings from progress logs
  const avgCravings = progressLogs?.length
    ? Math.round(
        progressLogs.reduce((sum, log) => sum + log.cravingsCount, 0) / progressLogs.length
      )
    : 0;

  return (
    <AppShell title="Statistics">
      <div className="p-6 space-y-6">
        {/* Financial Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Money Saved
              </CardTitle>
              <CardDescription>Total savings from not buying products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold text-green-600">
                    ${moneySaved.toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {daysSinceQuit} day{daysSinceQuit !== 1 ? 's' : ''} × ${dailyCost.toFixed(2)}/day
                  </p>
                </div>
                {dailyCost > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Projected Savings</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">1 Month</p>
                        <p className="font-semibold">${(dailyCost * 30).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">6 Months</p>
                        <p className="font-semibold">${(dailyCost * 180).toFixed(2)}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">1 Year</p>
                        <p className="font-semibold text-green-600">
                          ${potentialYearlySavings.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">5 Years</p>
                        <p className="font-semibold text-green-600">
                          ${(potentialYearlySavings * 5).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                Time Freed
              </CardTitle>
              <CardDescription>Time reclaimed from not using nicotine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="text-4xl font-bold text-blue-600">
                    {daysFreed > 0 ? `${daysFreed}d` : `${hoursFreed}h`}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {productsNotUsed} products × {minutesPerProduct} min each
                  </p>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Time Breakdown</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Minutes</span>
                      <span className="font-semibold">{minutesFreed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Hours</span>
                      <span className="font-semibold">{hoursFreed.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Days</span>
                      <span className="font-semibold">{daysFreed.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Usage Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Cigarette className="h-5 w-5" />
                Products Not Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{productsNotUsed}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {quitAttempt.productType.replace('_', ' ')}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5" />
                Average Cravings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgCravings}</div>
              <p className="text-sm text-muted-foreground mt-1">
                per day (from {progressLogs?.length || 0} logs)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5" />
                Days Smoke-Free
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{daysSinceQuit}</div>
              <p className="text-sm text-muted-foreground mt-1">
                {weeksSinceQuit} week{weeksSinceQuit !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Health Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Health Recovery Timeline
            </CardTitle>
            <CardDescription>What happens to your body when you quit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                  className={`flex items-start gap-4 p-3 rounded-lg ${
                    item.achieved ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                    item.achieved ? 'bg-green-600' : 'bg-gray-300'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{item.time}</p>
                    <p className="text-sm text-gray-700">{item.benefit}</p>
                  </div>
                  {item.achieved && (
                    <div className="text-xs font-medium text-green-600">✓ Achieved</div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
