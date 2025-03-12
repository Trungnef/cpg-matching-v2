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
  Building2,
  LogOut,
  Globe,
  User
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
  const [website, setWebsite] = useState("https://example.com");
  const [address, setAddress] = useState("123 Manufacturing Way");
  const [city, setCity] = useState("Industrial City");
  const [state, setState] = useState("CA");
  const [zipCode, setZipCode] = useState("90210");
  const [description, setDescription] = useState("Leading manufacturer of food processing equipment");
  const [userName, setUserName] = useState(user?.name || "");
  // Manufacturer specific fields
  const [productionCapacity, setProductionCapacity] = useState("10000");
  const [minimumOrderValue, setMinimumOrderValue] = useState("5000");
  const [certifications, setCertifications] = useState("ISO 9001, HACCP, FDA Approved");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  
  // Security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [activeSessions, setActiveSessions] = useState([
    {
      device: "Current Browser",
      platform: "Windows • Chrome",
      time: "Today at 10:30 AM",
      isActive: true
    },
    {
      device: "Mobile Device",
      platform: "iOS • Safari",
      time: "Yesterday at 3:15 PM",
      isActive: false
    }
  ]);
  
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
    // Validate password inputs
    if (newPassword && newPassword !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match and try again.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Security settings saved",
      description: "Your security preferences have been updated successfully."
    });
  };

  const handleSaveManufacturing = () => {
    toast({
      title: "Manufacturing settings updated",
      description: "Your manufacturing details have been saved.",
    });
  };

  const handleLogoutAllDevices = () => {
    // In a real app, this would call an API to invalidate all sessions
    setActiveSessions([
      {
        device: "Current Browser",
        platform: "Windows • Chrome",
        time: "Just now",
        isActive: true
      }
    ]);
    
    toast({
      title: "Signed out from all devices",
      description: "You have been signed out from all other devices."
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="userName" className="text-sm font-medium">
                        Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="userName" 
                          value={userName}
                          onChange={e => setUserName(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </label>
                      <div className="relative">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="companyName" className="text-sm font-medium">
                        Company Name
                      </label>
                      <div className="relative">
                        <Building2 className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="companyName" 
                          value={companyName}
                          onChange={e => setCompanyName(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </label>
                      <div className="relative">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="space-y-2">
                      <label htmlFor="website" className="text-sm font-medium">
                        Website
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input 
                          id="website" 
                          value={website}
                          onChange={e => setWebsite(e.target.value)}
                          className="pl-9"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="address" className="text-sm font-medium">
                        Address
                      </label>
                      <div className="relative">
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
                  
                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Company Description
                    </label>
                    <Textarea 
                      id="description" 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      className="min-h-[120px]"
                      placeholder="Tell us about your company..."
                    />
                  </div>

                  <Separator className="my-6" />
                  
                  <div>
                    <h3 className="text-lg font-medium mb-4">Manufacturer Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label htmlFor="productionCapacity" className="text-sm font-medium">
                          Production Capacity (units/month)
                        </label>
                        <Input 
                          id="productionCapacity" 
                          type="number"
                          value={productionCapacity || ""}
                          onChange={e => setProductionCapacity(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="minimumOrderValue" className="text-sm font-medium">
                          Minimum Order Value ($)
                        </label>
                        <Input 
                          id="minimumOrderValue" 
                          type="number"
                          value={minimumOrderValue || ""}
                          onChange={e => setMinimumOrderValue(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="certifications" className="text-sm font-medium">
                        Certifications
                      </label>
                      <Textarea 
                        id="certifications" 
                        value={certifications || ""}
                        onChange={e => setCertifications(e.target.value)}
                        className="min-h-[100px]"
                        placeholder="Enter certifications separated by commas (e.g. ISO 9001, Organic, HACCP)"
                      />
                      <p className="text-sm text-muted-foreground">
                        Enter all your certifications, separated by commas
                      </p>
                    </div>
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
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Manage your account security and password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Change Password</h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="current-password">Current Password</label>
                        <Input 
                          id="current-password" 
                          type="password" 
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="new-password">New Password</label>
                        <Input 
                          id="new-password" 
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium" htmlFor="confirm-password">Confirm New Password</label>
                        <Input 
                          id="confirm-password" 
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <label className="text-sm font-medium">Enable Two-Factor Authentication</label>
                        <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                      </div>
                      <Switch 
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Active Sessions Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Active Sessions</h3>
                    <div className="space-y-3">
                      {activeSessions.map((session, index) => (
                        <div key={index} className="p-3 border rounded-md">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{session.device}</p>
                              <p className="text-sm text-muted-foreground">{session.platform} • {session.time}</p>
                            </div>
                            {session.isActive && <Badge>Active Now</Badge>}
                          </div>
                        </div>
                      ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleLogoutAllDevices}
                        className="flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out All Other Devices
                      </Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveSecurity}>Save Changes</Button>
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
