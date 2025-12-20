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
import { Bell, DollarSign, Palette, User, Pencil } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

const settingsSchema = z.object({
  notificationsEnabled: z.boolean(),
  theme: z.enum(['light', 'dark', 'system']),
  currency: z.string().length(3),
  cigaretteCost: z.coerce.number().min(0),
  cigarettesPerDay: z.coerce.number().min(0),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  address: z.string().optional(),
  age: z.coerce.number().optional(),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

export function SettingsPage() {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const { user } = useAuthStore();

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
    <AppShell>
      <div className="bg-[#F2F2F2] min-h-full xl:pb-10 xl:px-10 pb-5 px-5">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Two Column Layout */}
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Notifications */}
              <Card className="bg-white rounded-[10px] border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#561F7A] text-xl font-bold">
                    <Bell className="h-5 w-5 text-[#561F7A]" />
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-gray-600">Manage your notification preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notificationsEnabled"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <div className="flex items-center justify-between">
                          <FormLabel className="text-[#131316] font-medium">Enable Notifications</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="data-[state=checked]:bg-[#561F7A]"
                            />
                          </FormControl>
                        </div>
                        <FormDescription className="text-gray-500 text-sm">
                          Receive reminders and encouragements throughout your quit journey.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Appearance */}
              <Card className="bg-white rounded-[10px] border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#561F7A] text-xl font-bold">
                    <Palette className="h-5 w-5 text-[#561F7A]" />
                    Appearance
                  </CardTitle>
                  <CardDescription className="text-gray-600">Customize how the app looks</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[#131316] font-medium">Theme</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#F2F2F2] border-0 rounded-md">
                              <SelectValue placeholder="Select a theme" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="light">Light</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="system">System</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-gray-500 text-sm">
                          Choose your preferred color theme.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Cost Tracking */}
              <Card className="bg-white rounded-[10px] border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#561F7A] text-xl font-bold">
                    <DollarSign className="h-5 w-5 text-[#561F7A]" />
                    Cost Tracking
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Track how much money you're saving by quitting.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[#131316] font-medium">Currency:</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-[#F2F2F2] border-0 rounded-md">
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
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[#131316] font-medium">Cost Per Pack/Product</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="bg-[#F2F2F2] border-0 rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cigarettesPerDay"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[#131316] font-medium">Products Per Day</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            className="bg-[#F2F2F2] border-0 rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Profile */}
              <Card className="bg-white rounded-[10px] border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-[#561F7A] text-xl font-bold">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-24 h-24 rounded-full bg-[#561F7A] flex items-center justify-center mb-2">
                      {user?.avatarUrl ? (
                        <img src={user.avatarUrl} alt="Profile" className="w-24 h-24 rounded-full object-cover" />
                      ) : (
                        <User className="h-12 w-12 text-white" />
                      )}
                    </div>
                    <span className="text-[#131316] text-sm font-medium">Upload Photo</span>
                  </div>

                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[#131316] font-medium">First Name:</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="John"
                              className="bg-[#F2F2F2] border-0 rounded-md pr-10"
                              {...field}
                            />
                            <Pencil className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#561F7A]" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[#131316] font-medium">Last Name:</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Doe"
                              className="bg-[#F2F2F2] border-0 rounded-md pr-10"
                              {...field}
                            />
                            <Pencil className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#561F7A]" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[#131316] font-medium">Address:</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter Address"
                            className="bg-[#F2F2F2] border-0 rounded-md"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-[#131316] font-medium">Age:</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="number"
                              placeholder="25"
                              className="bg-[#F2F2F2] border-0 rounded-md pr-10"
                              {...field}
                            />
                            <Pencil className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#561F7A]" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Profile Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <Button
                      type="button"
                      className="bg-[#561F7A] hover:bg-[#561F7A]/90 text-white rounded-md"
                    >
                      Save Changes
                    </Button>
                    <Button
                      type="button"
                      className="bg-[#F9C015] hover:bg-[#F9C015]/90 text-[#131316] rounded-md"
                    >
                      Change Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Global Save Button */}
            <div className="flex justify-start">
              <Button
                type="submit"
                disabled={updateSettings.isPending}
                className="bg-[#561F7A] hover:bg-[#561F7A]/90 text-white rounded-md px-6"
              >
                {updateSettings.isPending ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </AppShell>
  );
}
