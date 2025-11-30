import { AppShell } from '@/components/layout/AppShell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import { Bell, DollarSign, Palette, User } from 'lucide-react';

const settingsSchema = z.object({
  notificationsEnabled: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  currency: z.string().length(3),
  cigaretteCost: z.coerce.number().min(0),
  cigarettesPerDay: z.coerce.number().min(0),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const { data: settings } = trpc.settings.get.useQuery();

  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      notificationsEnabled: settings?.notificationsEnabled ?? true,
      theme: (settings?.theme as 'light' | 'dark' | 'system') ?? 'system',
      currency: settings?.currency ?? 'USD',
      cigaretteCost: settings?.cigaretteCost ?? 0,
      cigarettesPerDay: settings?.cigarettesPerDay ?? 0,
    },
    values: settings ? {
      notificationsEnabled: settings.notificationsEnabled ?? true,
      theme: (settings.theme as 'light' | 'dark' | 'system') ?? 'system',
      currency: settings.currency ?? 'USD',
      cigaretteCost: settings.cigaretteCost ?? 0,
      cigarettesPerDay: settings.cigarettesPerDay ?? 0,
    } : undefined,
  });

  const updateSettings = trpc.settings.update.useMutation({
    onSuccess: () => {
      toast({
        title: 'Settings saved!',
        description: 'Your preferences have been updated.',
      });
      utils.settings.get.invalidate();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    updateSettings.mutate(data);
  };

  return (
    <AppShell title="Settings">
      <div className="p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="notificationsEnabled"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Enable Notifications</FormLabel>
                        <FormDescription>
                          Receive reminders and encouragement throughout your quit journey
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Appearance
                </CardTitle>
                <CardDescription>Customize how the app looks</CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Choose your preferred color theme
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Cost Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Tracking
                </CardTitle>
                <CardDescription>
                  Track how much money you're saving by quitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="CAD">CAD ($)</SelectItem>
                          <SelectItem value="AUD">AUD ($)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cigaretteCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost per Pack/Product</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="e.g., 10.00"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How much did you typically spend per pack or product?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cigarettesPerDay"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Products Per Day</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 20"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        How many cigarettes/products did you use per day?
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Profile
                </CardTitle>
                <CardDescription>Your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">
                  Authentication will be added in a future update. For now, your data is stored locally.
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={updateSettings.isPending}>
                {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AppShell>
  );
}
