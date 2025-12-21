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
import { Bell, DollarSign, Palette, Loader, SquarePen, Upload } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useState, useRef } from 'react';

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
  const { user, setUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

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

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingAvatar(true);

    try {
      // Convert to base64 for preview and storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        
        // Update user in auth store
        if (user) {
          setUser({
            ...user,
            avatarUrl: base64String,
          });
        }

        toast({
          title: 'Avatar updated!',
          description: 'Your profile picture has been updated.',
        });
        setIsUploadingAvatar(false);
      };
      reader.onerror = () => {
        toast({
          title: 'Error',
          description: 'Failed to read the image file.',
          variant: 'destructive',
        });
        setIsUploadingAvatar(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upload avatar.',
        variant: 'destructive',
      });
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <AppShell>
      <div className="bg-[#F2F2F2] min-h-full xl:pb-10 xl:px-10 pb-5 px-4 sm:px-5">

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="">
            {/* Two Column Layout */}
            <div className="flex flex-col lg:flex-row items-start justify-between gap-4 sm:gap-6">
              <div className='lg:w-[70%] w-full'>
                <div className='flex flex-col md:flex-row gap-4 sm:gap-6'>
                  {/* Notifications */}
                  <Card className="lg:w-[50%] w-full bg-white rounded-[10px] border-0 shadow-none mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#561F7A] 2xl:text-[25px] lg:text-[20px] md:text-[18px] text-[16px] font-semibold">
                        <Bell className="h-5 w-5 text-[#561F7A]" />
                        Notifications
                      </CardTitle>
                      <CardDescription className="text-[#000000] text-[14px] md:text-base font-normal">Manage your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="notificationsEnabled"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <div className="bg-[#F2F2F2] p-[15px] rounded-[10px] h-[67px] mb-4 flex items-center justify-between">
                              <FormLabel className="text-[#131316] font-medium">Enable Notifications</FormLabel>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  className="data-[state=checked]:bg-[#561F7A]"
                                />
                              </FormControl>
                            </div>
                            <FormDescription className="text-[#000000] text-[14px] md:text-base font-normal">
                              Receive reminders and encouragements throughout your quit journey.
                            </FormDescription>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Appearance */}
                  <Card className="lg:w-[50%] w-full bg-white rounded-[10px] border-0 shadow-none mb-6">
                    <CardHeader className="pb-3 sm:pb-4">
                      <CardTitle className="flex items-center gap-2 text-[#561F7A] 2xl:text-[25px] lg:text-[20px] md:text-[18px] text-[16px] sm:text-[17px] font-semibold">
                        <Palette className="h-4 w-4 sm:h-5 sm:w-5 text-[#561F7A]" />
                        Appearance
                      </CardTitle>
                      <CardDescription className="text-[#000000] text-xs sm:text-[14px] md:text-base font-normal">Customize how the app looks</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            {/* <FormLabel className="text-[#131316] font-medium">Theme</FormLabel> */}
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-[#F2F2F2] text-[#000000] h-[60px] sm:h-[67px] mb-4 sm:mb-5 border-0 rounded-md text-sm sm:text-base">
                                  <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription className="text-[#000000] text-xs sm:text-[14px] md:text-base font-normal">
                              Choose your preferred color theme.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Cost Tracking */}
                <Card className="bg-white rounded-[10px] border-0 shadow-none mb-4 sm:mb-6">
                  <CardHeader className="pb-3 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-[#561F7A] 2xl:text-[25px] lg:text-[20px] md:text-[18px] text-[16px] sm:text-[17px] font-semibold">
                      <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-[#561F7A]" />
                      Cost Tracking
                    </CardTitle>
                    <CardDescription className="text-[#000000] text-xs sm:text-[14px] md:text-base font-normal">
                      Track how much money you're saving by quitting.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 pt-0">
                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-[#000000] text-xs sm:text-[14px] md:text-base font-medium">Currency:</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-[#F2F2F2] text-[#000000] h-[60px] sm:h-[67px] mb-4 sm:mb-5 border-0 rounded-md text-sm sm:text-base">
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
                          <FormLabel className="text-[#000000] text-xs sm:text-[14px] md:text-base font-medium">Cost Per Pack/Product</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              className="bg-[#F2F2F2] text-[#000000] h-[60px] sm:h-[67px] mb-4 sm:mb-5 border-0 rounded-md text-sm sm:text-base"
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
                          <FormLabel className="text-[#000000] text-xs sm:text-[14px] md:text-base font-medium">Products Per Day</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="0"
                              className="bg-[#F2F2F2] text-[#000000] h-[60px] sm:h-[67px] mb-4 sm:mb-5 border-0 rounded-md text-sm sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                 {/* Global Save Button */}
                 <div className="flex justify-start mb-4 sm:mb-0">
                      <Button
                        type="submit"
                        disabled={updateSettings.isPending}
                        className="bg-[#561F7A] hover:bg-[#561F7A]/90 font-semibold text-base sm:text-lg lg:text-[20px] rounded-[10px] text-white px-4 sm:p-5 w-full sm:w-auto min-w-[140px] sm:min-w-[179px] h-[50px] sm:h-[60px] 2xl:h-[70px]"
                      >
                        {updateSettings.isPending ? <Loader className="animate-spin h-5 w-5" /> : 'Save Settings'}
                      </Button>
                    </div>
              </div>

              <div className='lg:w-[30%] w-full'>
                {/* Profile */}
                <Card className="bg-white rounded-[10px] border-0 shadow-none">
                  <CardHeader>
                    <CardTitle className="text-[#561F7A] 2xl:text-[25px] lg:text-[20px] md:text-[18px] text-[16px] font-semibold">Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                      <div 
                        className="w-[159px] h-[159px] rounded-full bg-[#AE89C7] flex items-center justify-center mb-2 relative cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                        onClick={handleAvatarClick}
                      >
                        {isUploadingAvatar ? (
                          <Loader className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-spin" />
                        ) : (() => {
                          const avatarSrc = avatarPreview || user?.avatarUrl;
                          return avatarSrc ? (
                            <img 
                              src={avatarSrc} 
                              alt="Profile" 
                              className="w-full h-full rounded-full object-cover" 
                            />
                          ) : (
                            <div className='w-[80px] h-[98px] sm:w-[90px] sm:h-[110px] lg:w-[106px] lg:h-[129px]'>
                              <img 
                                src="/assets/images/avatar.svg"
                                alt="Profile"
                                className="w-full h-full rounded-full object-cover"
                              />
                            </div>
                          );
                        })()}
                        {/* Upload overlay */}
                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Upload className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAvatarClick}
                        className="text-[#000] text-xs sm:text-[14px] md:text-base font-medium hover:text-[#561F7A] transition-colors cursor-pointer"
                      >
                        Upload Photo
                      </button>
                    </div>

                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem className="space-y-2">
                          <FormLabel className="text-[#000000] text-xs sm:text-[14px] md:text-base font-normal">First Name:</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="John"
                                className="bg-[#F2F2F2] text-[#000000] h-[60px] sm:h-[67px] mb-4 sm:mb-5 border-0 rounded-md pr-8 sm:pr-10 text-sm sm:text-base"
                                {...field}
                              />
                              <SquarePen className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#561F7A]" />
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
                          <FormLabel className="text-[#000000] text-xs sm:text-[14px] md:text-base font-normal">Last Name:</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                placeholder="Doe"
                                className="bg-[#F2F2F2] text-[#000000] h-[60px] sm:h-[67px] mb-4 sm:mb-5 border-0 rounded-md pr-8 sm:pr-10 text-sm sm:text-base"
                                {...field}
                              />
                              <SquarePen className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#561F7A]" />
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
                          <FormLabel className="text-[#000000] text-xs sm:text-[14px] md:text-base font-normal">Address:</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter Address"
                              className="bg-[#F2F2F2] text-[#000000] h-[60px] sm:h-[67px] mb-4 sm:mb-5 border-0 rounded-md text-sm sm:text-base"
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
                            <FormLabel className="text-[#000000] text-xs sm:text-[14px] md:text-base font-normal">Age:</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                placeholder="25"
                                className="bg-[#F2F2F2] text-[#000000] h-[60px] sm:h-[67px] mb-4 sm:mb-5 border-0 rounded-md pr-8 sm:pr-10 text-sm sm:text-base"
                                {...field}
                              />
                              <SquarePen className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#561F7A]" />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Profile Action Buttons */}
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 mt-4 sm:mt-6 w-full">
                      <Button
                        type="button"
                        className="bg-[#561F7A] hover:bg-[#561F7A]/90 font-semibold text-sm sm:text-base rounded-[10px] text-white px-4 sm:p-5 w-full sm:w-auto h-[45px] sm:h-[50px] 2xl:h-[60px]"
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        className="bg-[#F9C015] hover:bg-[#F9C015]/90 font-semibold text-sm sm:text-base rounded-[10px] text-[#131316] px-4 sm:p-5 w-full sm:w-auto h-[45px] sm:h-[50px] 2xl:h-[60px]"
                      >
                        Change Password
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </AppShell>
  );
}
