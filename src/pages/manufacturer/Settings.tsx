
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  ArrowLeft, 
  Save, 
  UserCircle, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Lock, 
  Shield, 
  CreditCard, 
  AlertCircle, 
  Factory,
  Building2
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Settings = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form states
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [address, setAddress] = useState("123 Manufacturing Way");
  const [city, setCity] = useState("San Francisco");
  const [state, setState] = useState("CA");
  const [zipCode, setZipCode] = useState("94105");
  const [description, setDescription] = useState("We are a leading organic food manufacturer specializing in cereal, energy bars, and healthy snacks. Our facility is certified organic, non-GMO, and follows sustainable manufacturing practices.");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  
  useEffect(() => {
    document.title = "Account Settings - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);

  const handleSaveProfile = () => {
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notification preferences updated",
      description: "Your notification settings have been saved.",
    });
  };

  const handleSaveSecurity = () => {
    toast({
      title: "Security settings updated",
      description: "Your security preferences have been saved.",
    });
  };

  const handleSaveManufacturing = () => {
    toast({
      title: "Manufacturing settings updated",
      description: "Your manufacturing details have been saved.",
    });
  };

  if (!isAuthenticated || role !== "manufacturer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb and header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4 pl-0 text-muted-foreground" 
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">Manage your account and manufacturing preferences</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="manufacturing">Manufacturing</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>
            
            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>
                        Update your company profile and contact information
                      </CardDescription>
                    </div>
                    <UserCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="companyName" className="text-sm font-medium">
                        Company Name
                      </label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <Building2 className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="companyName" 
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <Mail className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="email" 
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <Phone className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="phone" 
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Street Address
                      </label>
                      <div className="flex">
                        <div className="relative flex-1">
                          <MapPin className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="address" 
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium">
                        City
                      </label>
                      <Input 
                        id="city" 
                        value={city}
                        onChange={e => setCity(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="state" className="text-sm font-medium">
                        State
                      </label>
                      <Input 
                        id="state" 
                        value={state}
                        onChange={e => setState(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="zipCode" className="text-sm font-medium">
                        Zip Code
                      </label>
                      <Input 
                        id="zipCode" 
                        value={zipCode}
                        onChange={e => setZipCode(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Company Description
                    </label>
                    <Textarea 
                      id="description" 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      This description will be visible to potential brand partners.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Manufacturing Tab */}
            <TabsContent value="manufacturing">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Manufacturing Capabilities</CardTitle>
                      <CardDescription>
                        Manage your production capabilities and certifications
                      </CardDescription>
                    </div>
                    <Factory className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Production Categories</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <Badge variant="secondary">Food Processing</Badge>
                      <Badge variant="secondary">Bottling</Badge>
                      <Badge variant="secondary">Packaging</Badge>
                      <Badge variant="secondary">Quality Control</Badge>
                      <Badge variant="secondary">Cold Storage</Badge>
                      <Button variant="outline" size="sm" className="h-6">
                        + Add
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Production Capacity</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="minOrderSize" className="text-sm">
                          Minimum Order Size
                        </label>
                        <Input 
                          id="minOrderSize" 
                          defaultValue="1,000"
                        />
                        <p className="text-xs text-muted-foreground">
                          The smallest batch size you're willing to produce
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="maxCapacity" className="text-sm">
                          Maximum Daily Capacity
                        </label>
                        <Input 
                          id="maxCapacity" 
                          defaultValue="50,000"
                        />
                        <p className="text-xs text-muted-foreground">
                          Your maximum production capability per day
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Certifications</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-3 bg-green-500/10">Valid</Badge>
                          <span>ISO 9001:2015</span>
                        </div>
                        <Button size="sm" variant="outline">Update</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-3 bg-green-500/10">Valid</Badge>
                          <span>Food Safety Certification</span>
                        </div>
                        <Button size="sm" variant="outline">Update</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-3 bg-yellow-500/10 text-yellow-500">Expiring Soon</Badge>
                          <span>Organic Certification</span>
                        </div>
                        <Button size="sm" variant="outline">Renew</Button>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-3">Not Added</Badge>
                          <span>Add New Certification</span>
                        </div>
                        <Button size="sm">Add</Button>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Production Preferences</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm">
                          Preferred Batch Size
                        </label>
                        <Select defaultValue="medium">
                          <SelectTrigger>
                            <SelectValue placeholder="Select batch size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small (1,000 - 5,000 units)</SelectItem>
                            <SelectItem value="medium">Medium (5,000 - 15,000 units)</SelectItem>
                            <SelectItem value="large">Large (15,000+ units)</SelectItem>
                            <SelectItem value="any">Any Size</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">
                          Production Turnaround Time
                        </label>
                        <Select defaultValue="standard">
                          <SelectTrigger>
                            <SelectValue placeholder="Select turnaround time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rush">Rush (1-3 days)</SelectItem>
                            <SelectItem value="standard">Standard (4-7 days)</SelectItem>
                            <SelectItem value="extended">Extended (8-14 days)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveManufacturing}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Manufacturing Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>
                        Manage how you receive notifications and updates
                      </CardDescription>
                    </div>
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Email Notifications</h3>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">New Match Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when new brand matches are found
                        </p>
                      </div>
                      <Switch 
                        checked={matchNotifications} 
                        onCheckedChange={setMatchNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Message Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive email when you get new messages from brands
                        </p>
                      </div>
                      <Switch 
                        checked={messageNotifications} 
                        onCheckedChange={setMessageNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Production Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about important production events and changes
                        </p>
                      </div>
                      <Switch 
                        checked={emailNotifications} 
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Marketing & Newsletters</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates about platform features and industry news
                        </p>
                      </div>
                      <Switch 
                        checked={marketingNotifications} 
                        onCheckedChange={setMarketingNotifications}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Notification Schedule</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm">
                        Email Digest Frequency
                      </label>
                      <Select defaultValue="daily">
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="realtime">Real-time</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        How often you want to receive email digests summarizing your notifications
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveNotifications}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Notification Preferences
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Security & Privacy</CardTitle>
                      <CardDescription>
                        Manage your password and security settings
                      </CardDescription>
                    </div>
                    <Shield className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Change Password</h3>
                    
                    <div className="space-y-2">
                      <label htmlFor="currentPassword" className="text-sm">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="currentPassword" 
                          type="password"
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="newPassword" className="text-sm">
                          New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="newPassword" 
                            type="password"
                            className="pl-9"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="confirmPassword" className="text-sm">
                          Confirm New Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                          <Input 
                            id="confirmPassword" 
                            type="password"
                            className="pl-9"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">Update Password</Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Two-Factor Authentication</h3>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Enable 2FA</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Account Privacy</h3>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">
                          Control who can see your manufacturing profile
                        </p>
                      </div>
                      <Select defaultValue="verified">
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="verified">Verified Brands Only</SelectItem>
                          <SelectItem value="private">Private (Invite Only)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Data Usage Consent</p>
                        <p className="text-sm text-muted-foreground">
                          Allow platform to use your data for match recommendations
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Danger Zone</h3>
                    
                    <div className="p-4 border border-red-200 bg-red-50 dark:bg-red-950/10 dark:border-red-950/20 rounded-md">
                      <div className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-red-500">Deactivate Account</h4>
                          <p className="text-sm text-muted-foreground mb-4">
                            Temporarily disable your account. You can reactivate it anytime.
                          </p>
                          <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                            Deactivate Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveSecurity}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Security Settings
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
