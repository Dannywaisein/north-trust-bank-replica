
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Lock, Shield, Bell } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string | null;
  date_of_birth: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
}

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user) return;

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfile(data);
      } catch (error: any) {
        toast({
          title: "Error fetching profile",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const profileSchema = z.object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone_number: z.string().nullable(),
    date_of_birth: z.string().nullable(),
    address: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    zip_code: z.string().nullable(),
  });

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone_number: profile?.phone_number || "",
      date_of_birth: profile?.date_of_birth || "",
      address: profile?.address || "",
      city: profile?.city || "",
      state: profile?.state || "",
      zip_code: profile?.zip_code || "",
    },
    values: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone_number: profile?.phone_number || "",
      date_of_birth: profile?.date_of_birth || "",
      address: profile?.address || "",
      city: profile?.city || "",
      state: profile?.state || "",
      zip_code: profile?.zip_code || "",
    }
  });

  const onSubmit = async (data: z.infer<typeof profileSchema>) => {
    try {
      setIsUpdating(true);

      if (!user) return;

      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          phone_number: data.phone_number,
          date_of_birth: data.date_of_birth,
          address: data.address,
          city: data.city,
          state: data.state,
          zip_code: data.zip_code,
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      setProfile((prev) => prev ? { ...prev, ...data } : null);

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const passwordSchema = z.object({
    current_password: z.string().min(8, "Password must be at least 8 characters"),
    new_password: z.string().min(8, "Password must be at least 8 characters"),
    confirm_new_password: z.string().min(8, "Password must be at least 8 characters"),
  }).refine(data => data.new_password === data.confirm_new_password, {
    message: "Passwords do not match",
    path: ["confirm_new_password"],
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  const onChangePassword = async (data: z.infer<typeof passwordSchema>) => {
    try {
      setIsUpdating(true);

      // Implement password change logic with Supabase
      const { error } = await supabase.auth.updateUser({ 
        password: data.new_password 
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Password changed",
        description: "Your password has been successfully updated.",
      });

      passwordForm.reset();
    } catch (error: any) {
      toast({
        title: "Error changing password",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">
          Update your personal information and account settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="w-full mb-6">
          <TabsTrigger value="profile" className="flex-1">
            <User className="h-4 w-4 mr-2" />
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1">
            <Lock className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="first_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="last_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} disabled />
                        </FormControl>
                        <FormDescription>
                          Contact support to change your email address
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone_number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              value={field.value || ""}
                              placeholder="+1 (555) 000-0000"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date_of_birth"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Birth</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              {...field}
                              value={field.value || ""}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium mb-4">Address</h3>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Street Address</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ""}
                                placeholder="123 Main St"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="New York"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State / Province</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="NY"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zip_code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP / Postal Code</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value || ""}
                                  placeholder="10001"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isUpdating || !form.formState.isDirty}
                    >
                      {isUpdating && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your password and security preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Change Password</h3>
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onChangePassword)}
                    className="space-y-4"
                  >
                    <FormField
                      control={passwordForm.control}
                      name="current_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Current Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirm_new_password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" disabled={isUpdating}>
                        {isUpdating && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Change Password
                      </Button>
                    </div>
                  </form>
                </Form>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                <p className="text-muted-foreground mb-4">
                  Add an extra layer of security to your account by enabling two-factor
                  authentication
                </p>
                <Button variant="outline">
                  <Shield className="h-4 w-4 mr-2" />
                  Enable 2FA
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Transaction Alerts</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="large-deposits" className="text-base">
                          Large Deposits
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when a deposit over $1,000 is made
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="large-deposits-email">Email</Label>
                        <Input
                          type="checkbox"
                          id="large-deposits-email"
                          className="h-4 w-4"
                          defaultChecked
                        />
                        <Label htmlFor="large-deposits-push">Push</Label>
                        <Input
                          type="checkbox"
                          id="large-deposits-push"
                          className="h-4 w-4"
                          defaultChecked
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="large-withdrawals" className="text-base">
                          Large Withdrawals
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified when a withdrawal over $500 is made
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="large-withdrawals-email">Email</Label>
                        <Input
                          type="checkbox"
                          id="large-withdrawals-email"
                          className="h-4 w-4"
                          defaultChecked
                        />
                        <Label htmlFor="large-withdrawals-push">Push</Label>
                        <Input
                          type="checkbox"
                          id="large-withdrawals-push"
                          className="h-4 w-4"
                          defaultChecked
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="all-transactions" className="text-base">
                          All Transactions
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified for every transaction
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="all-transactions-email">Email</Label>
                        <Input
                          type="checkbox"
                          id="all-transactions-email"
                          className="h-4 w-4"
                        />
                        <Label htmlFor="all-transactions-push">Push</Label>
                        <Input
                          type="checkbox"
                          id="all-transactions-push"
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">Account Notifications</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="security-alerts" className="text-base">
                          Security Alerts
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about security-related events
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="security-alerts-email">Email</Label>
                        <Input
                          type="checkbox"
                          id="security-alerts-email"
                          className="h-4 w-4"
                          defaultChecked
                        />
                        <Label htmlFor="security-alerts-push">Push</Label>
                        <Input
                          type="checkbox"
                          id="security-alerts-push"
                          className="h-4 w-4"
                          defaultChecked
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="promotions" className="text-base">
                          Promotions and Offers
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          Receive updates on special rates and financial products
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="promotions-email">Email</Label>
                        <Input
                          type="checkbox"
                          id="promotions-email"
                          className="h-4 w-4"
                          defaultChecked
                        />
                        <Label htmlFor="promotions-push">Push</Label>
                        <Input
                          type="checkbox"
                          id="promotions-push"
                          className="h-4 w-4"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default Profile;
