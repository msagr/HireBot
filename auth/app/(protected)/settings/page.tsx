"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LogOut, Bell, User, Shield, Mail, Lock, Info, Check } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface UserData {
  name: string;
  email: string;
  image?: string;
}

const SettingItem = ({ 
  title, 
  description, 
  children,
  className 
}: { 
  title: string; 
  description: string; 
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex flex-col space-y-1.5", className)}>
    <Label className="text-sm font-medium">{title}</Label>
    <p className="text-sm text-muted-foreground">{description}</p>
    <div className="mt-2">
      {children}
    </div>
  </div>
);


export default function SettingsPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");
  const [notifications, setNotifications] = useState({
    email: true,
    marketing: false,
    security: true,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user');
        if (!response.ok) throw new Error('Failed to fetch user data');
        const data = await response.json();
        setUserData(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/auth/login");
  };

  const getInitials = (name: string) => 
    name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-0 sm:px-4 py-6 max-w-[1800px]">
        <div className="px-4 sm:px-6 mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground transition-colors px-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-2xl font-bold mt-2">Account Settings</h1>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 px-4 sm:px-6">
          {/* Sidebar */}
          <div className="xl:col-span-3 space-y-6">
            <Card className="overflow-hidden border-0 shadow-sm">
              <div className="bg-gradient-to-r from-primary/5 to-primary/10 p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 border-4 border-background shadow-sm">
                    {userData?.image ? (
                      <AvatarImage src={userData.image} alt={userData.name} />
                    ) : (
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {userData?.name ? getInitials(userData.name) : <User className="h-6 w-6" />}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">
                      {isLoading ? <Skeleton className="h-6 w-32" /> : userData?.name || 'User'}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {isLoading ? <Skeleton className="h-4 w-40 mt-1" /> : userData?.email}
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 border-t">
                <div className="space-y-1">
                  <Button 
                    variant={activeTab === 'account' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('account')}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </Button>
                  <Button 
                    variant={activeTab === 'notifications' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Button>
                  <Button 
                    variant={activeTab === 'security' ? 'secondary' : 'ghost'} 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('security')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </Button>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium text-muted-foreground">ACCOUNT</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-1">
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Email Verified</p>
                        <p className="text-xs text-muted-foreground">Your email is verified</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                      <Check className="h-3 w-3 mr-1" /> Verified
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 rounded-lg bg-amber-100">
                        <Lock className="h-4 w-4 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">2FA Authentication</p>
                        <p className="text-xs text-muted-foreground">Add extra security</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="xl:col-span-9 space-y-6">
            {activeTab === 'account' && (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Profile Information</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Manage your account details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6 pt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SettingItem
                      title="Full Name"
                      description="Your full name as it appears on your profile"
                    >
                      <Input 
                        value={userData?.name || ''} 
                        disabled
                        className="bg-muted/50"
                      />
                    </SettingItem>
                    <SettingItem
                      title="Email Address"
                      description="Your primary email address"
                    >
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          value={userData?.email || ''}
                          disabled
                          className="pl-10 bg-muted/50"
                        />
                      </div>
                    </SettingItem>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 bg-muted/20">
                  <Button disabled>Save Changes</Button>
                </CardFooter>
              </Card>
            )}

            {activeTab === 'notifications' ? (
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">Notification Preferences</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6 pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/30 transition-colors">
                      <div>
                        <Label className="font-medium">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive important account notifications</p>
                      </div>
                      <Switch 
                        checked={notifications.email}
                        onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/30 transition-colors">
                      <div>
                        <Label className="font-medium">Marketing Emails</Label>
                        <p className="text-sm text-muted-foreground">Receive product updates and offers</p>
                      </div>
                      <Switch 
                        checked={notifications.marketing}
                        onCheckedChange={(checked) => setNotifications({...notifications, marketing: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/30 transition-colors">
                      <div>
                        <Label className="font-medium">Security Alerts</Label>
                        <p className="text-sm text-muted-foreground">Get notified about security changes</p>
                      </div>
                      <Switch 
                        checked={notifications.security}
                        onCheckedChange={(checked) => setNotifications({...notifications, security: checked})}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4 bg-muted/20">
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>
            ) : null}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl">Change Password</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Update your password to keep your account secure
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5 p-6 pt-0">
                    <div className="space-y-2">
                      <Label>Current Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="password" 
                          placeholder="Enter current password" 
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>New Password</Label>
                        <Input type="password" placeholder="Enter new password" />
                      </div>
                      <div className="space-y-2">
                        <Label>Confirm New Password</Label>
                        <Input type="password" placeholder="Confirm new password" />
                      </div>
                    </div>
                    <div className="rounded-md bg-muted/50 p-4">
                      <h4 className="flex items-center text-sm font-medium mb-2">
                        <Info className="h-4 w-4 mr-2 text-primary" />
                        Password Requirements
                      </h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li className="flex items-center">
                          <Check className="h-3 w-3 mr-2 text-green-500" />
                          At least 8 characters
                        </li>
                        <li className="flex items-center">
                          <Check className="h-3 w-3 mr-2 text-green-500" />
                          At least one number
                        </li>
                        <li className="flex items-center">
                          <Check className="h-3 w-3 mr-2 text-green-500" />
                          At least one special character
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t px-6 py-4 bg-muted/20">
                    <Button>Update Password</Button>
                  </CardFooter>
                </Card>

                <Card className="border-destructive/20 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-2xl text-destructive">Danger Zone</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Irreversible and destructive actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 pt-0">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-col space-y-2">
                        <h4 className="font-medium">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete your account and all associated data. This action cannot be undone.
                        </p>
                        <Button variant="destructive" className="mt-2 w-fit">
                          Delete Account
                        </Button>
                      </div>
                      <Separator />
                      <div className="flex flex-col space-y-2">
                        <h4 className="font-medium">Sign Out</h4>
                        <p className="text-sm text-muted-foreground">
                          Sign out of your account on this device.
                        </p>
                        <Button 
                          variant="outline" 
                          className="mt-2 w-fit border-destructive/20 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={handleSignOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
