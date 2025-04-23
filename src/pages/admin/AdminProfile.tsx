import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  FileText, 
  Lock, 
  Shield, 
  Briefcase,
  Save,
  Camera,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {PageTitle} from '@/components/PageTitle';

const AdminProfile = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been saved successfully.",
      });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto space-y-6"
    >
      <PageTitle
        title="Admin Profile"
        description="Manage your personal information and account settings"
        icon={<User className="h-6 w-6 text-primary" />}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="md:col-span-1"
        >
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Your public profile image</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-32 w-32">
                  <AvatarImage src="/avatars/admin-avatar.jpg" alt="Admin" />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    AD
                  </AvatarFallback>
                </Avatar>
                <Button 
                  size="icon" 
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground shadow-md"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-medium text-lg">Admin User</h3>
                <p className="text-sm text-muted-foreground">System Administrator</p>
              </div>
              <div className="w-full flex justify-center mt-4">
                <Button className="w-full" variant="outline">Change Photo</Button>
              </div>
            </CardContent>
            <Separator />
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">System Administrator</span>
                </div>
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">admin@cpg-matching.com</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">Member since Jan 2023</span>
                </div>
                <div className="flex items-center">
                  <Shield className="mr-2 h-4 w-4 opacity-70" />
                  <span className="text-sm">Super Administrator</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                variant="destructive" 
                className="w-full flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="md:col-span-2"
        >
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="personal" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>Personal Info</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span>Preferences</span>
              </TabsTrigger>
            </TabsList>

            {/* Personal Information Tab */}
            <TabsContent value="personal" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" defaultValue="Admin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" defaultValue="User" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="display-name">Display Name</Label>
                    <Input id="display-name" defaultValue="Admin User" />
                    <p className="text-sm text-muted-foreground">
                      This is the name that will be displayed to other users
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" defaultValue="admin@cpg-matching.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" defaultValue="New York, USA" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea 
                      id="bio" 
                      rows={4}
                      defaultValue="System administrator for the CPG Matching Platform with experience in managing enterprise software systems."
                    />
                    <p className="text-sm text-muted-foreground">
                      Brief description about yourself
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Changes</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        <span>Update Password</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>Enhance your account security with 2FA</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">Authenticator App</h4>
                        <p className="text-sm text-muted-foreground">
                          Use an authenticator app to get two-factor authentication codes
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="text-sm font-medium">SMS Recovery</h4>
                        <p className="text-sm text-muted-foreground">
                          Get authentication codes via SMS as a backup method
                        </p>
                      </div>
                      <Button variant="outline">Setup</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences" className="space-y-4 pt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Control how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Email Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="email-system" defaultChecked />
                          <Label htmlFor="email-system">System Alerts</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="email-user" defaultChecked />
                          <Label htmlFor="email-user">User Management</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="email-security" defaultChecked />
                          <Label htmlFor="email-security">Security Alerts</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="email-announcement" />
                          <Label htmlFor="email-announcement">Announcements</Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-sm font-medium">Browser Notifications</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="browser-login" defaultChecked />
                          <Label htmlFor="browser-login">Login Activity</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="browser-user" />
                          <Label htmlFor="browser-user">User Activity</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="browser-system" defaultChecked />
                          <Label htmlFor="browser-system">System Updates</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" id="browser-maintenance" defaultChecked />
                          <Label htmlFor="browser-maintenance">Maintenance Alerts</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Preferences</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Display Preferences</CardTitle>
                  <CardDescription>Customize your admin panel experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="dashboard-view">Default Dashboard View</Label>
                    <select 
                      id="dashboard-view" 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      defaultValue="overview"
                    >
                      <option value="overview">Overview</option>
                      <option value="analytics">Analytics</option>
                      <option value="users">User Management</option>
                      <option value="announcements">Announcements</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="items-per-page">Items Per Page</Label>
                    <select 
                      id="items-per-page" 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      defaultValue="10"
                    >
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="20">20</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format-pref">Date Format Preference</Label>
                    <select 
                      id="date-format-pref" 
                      className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                      defaultValue="mdy-12h"
                    >
                      <option value="mdy-12h">MM/DD/YYYY, 12-hour time</option>
                      <option value="mdy-24h">MM/DD/YYYY, 24-hour time</option>
                      <option value="dmy-12h">DD/MM/YYYY, 12-hour time</option>
                      <option value="dmy-24h">DD/MM/YYYY, 24-hour time</option>
                      <option value="ymd-24h">YYYY/MM/DD, 24-hour time</option>
                    </select>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        <span>Save Preferences</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminProfile; 