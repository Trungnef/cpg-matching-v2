import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  Save, 
  Globe, 
  Bell, 
  Lock, 
  Database, 
  Mail, 
  Shield, 
  RefreshCw,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {PageTitle} from '@/components/PageTitle';

const Settings = () => {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings saved",
        description: "Your settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6 w-full"
    >
      <PageTitle
        title="System Settings"
        description="Configure system-wide settings and preferences"
        icon={<SettingsIcon className="h-6 w-6 text-primary" />}
      />

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid grid-cols-5 w-full max-w-3xl">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">General</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden sm:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="database" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            <span className="hidden sm:inline">Database</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Site Information</CardTitle>
                  <CardDescription>
                    Update your site details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="CPG Matching Platform" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-description">Site Description</Label>
                    <Textarea 
                      id="site-description" 
                      defaultValue="Connect manufacturers, brands, and retailers in the Consumer Packaged Goods industry."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url">Site URL</Label>
                    <Input id="site-url" defaultValue="https://cpg-matching.com" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Localization</CardTitle>
                  <CardDescription>
                    Configure regional settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger id="language">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                        <SelectItem value="zh">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Default Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time (EST)</SelectItem>
                        <SelectItem value="cst">Central Time (CST)</SelectItem>
                        <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                        <SelectItem value="gmt">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="mdy">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mdy">MM/DD/YYYY</SelectItem>
                        <SelectItem value="dmy">DD/MM/YYYY</SelectItem>
                        <SelectItem value="ymd">YYYY/MM/DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure system-wide notification settings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send important system notifications via email
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="user-signup" className="text-base">User Signup Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when new users register
                    </p>
                  </div>
                  <Switch id="user-signup" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="system-errors" className="text-base">System Error Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about critical system errors
                    </p>
                  </div>
                  <Switch id="system-errors" defaultChecked />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance" className="text-base">Maintenance Reminders</Label>
                    <p className="text-sm text-muted-foreground">
                      Scheduled maintenance notification reminders
                    </p>
                  </div>
                  <Switch id="maintenance" defaultChecked />
                </div>
                <Separator />
                <div className="space-y-2">
                  <Label htmlFor="notification-email">Notification Email</Label>
                  <Input id="notification-email" defaultValue="admin@cpg-matching.com" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Authentication</CardTitle>
                  <CardDescription>
                    Manage authentication settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="two-factor" className="text-base">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require 2FA for administrative accounts
                      </p>
                    </div>
                    <Switch id="two-factor" defaultChecked />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-policy">Password Policy</Label>
                    <Select defaultValue="strong">
                      <SelectTrigger id="password-policy">
                        <SelectValue placeholder="Select password policy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Basic (min 8 characters)</SelectItem>
                        <SelectItem value="medium">Medium (min 10 characters with numbers)</SelectItem>
                        <SelectItem value="strong">Strong (min 12 characters with mixed case, numbers, symbols)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Access Control</CardTitle>
                  <CardDescription>
                    Configure system-wide security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="ip-restriction" className="text-base">IP Restrictions</Label>
                      <p className="text-sm text-muted-foreground">
                        Enable IP-based access restrictions
                      </p>
                    </div>
                    <Switch id="ip-restriction" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="account-lockout" className="text-base">Account Lockout</Label>
                      <p className="text-sm text-muted-foreground">
                        Lock accounts after failed login attempts
                      </p>
                    </div>
                    <Switch id="account-lockout" defaultChecked />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="failed-attempts">Max Failed Login Attempts</Label>
                    <Input id="failed-attempts" type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lockout-duration">Lockout Duration (minutes)</Label>
                    <Input id="lockout-duration" type="number" defaultValue="15" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        {/* Database Settings */}
        <TabsContent value="database" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Database Configuration</CardTitle>
                <CardDescription>
                  Manage database settings and backups
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="backup-frequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger id="backup-frequency">
                      <SelectValue placeholder="Select backup frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-retention">Backup Retention (days)</Label>
                  <Input id="backup-retention" type="number" defaultValue="30" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="backup-location">Backup Storage Location</Label>
                  <Input id="backup-location" defaultValue="s3://cpg-backups/" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-optimize" className="text-base">Automatic Optimization</Label>
                    <p className="text-sm text-muted-foreground">
                      Regularly optimize database performance
                    </p>
                  </div>
                  <Switch id="auto-optimize" defaultChecked />
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <Button variant="outline">Run Manual Backup</Button>
                  <Button variant="outline">Optimize Now</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        {/* Integrations Settings */}
        <TabsContent value="integrations" className="mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>External Integrations</CardTitle>
                <CardDescription>
                  Configure integrations with third-party services
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-md flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium">Email Service</h4>
                      <p className="text-sm text-muted-foreground">
                        SMTP Configuration for sending emails
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-md flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium">Payment Gateway</h4>
                      <p className="text-sm text-muted-foreground">
                        Payment processing integration
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-md flex items-center justify-center">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-base font-medium">Analytics Service</h4>
                      <p className="text-sm text-muted-foreground">
                        Traffic and usage analytics
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
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
                <span>Save Settings</span>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Settings; 