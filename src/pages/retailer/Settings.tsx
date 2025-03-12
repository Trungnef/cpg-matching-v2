import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  Bell, 
  Building, 
  Lock, 
  User, 
  Settings as SettingsIcon, 
  ArrowLeft, 
  Save, 
  UserCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  CreditCard, 
  AlertCircle, 
  LogOut, 
  Globe,
  Store,
  ShoppingCart
} from "lucide-react";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const RetailerSettings = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form states
  const [companyName, setCompanyName] = useState(user?.companyName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [userName, setUserName] = useState(user?.name || "");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [address, setAddress] = useState("123 Retail Street");
  const [city, setCity] = useState("San Francisco");
  const [state, setState] = useState("CA");
  const [zipCode, setZipCode] = useState("94110");
  const [website, setWebsite] = useState("https://example.com");
  const [description, setDescription] = useState("We are a retail chain specializing in premium organic products. Our stores focus on providing quality, sustainable goods to eco-conscious consumers.");
  
  // Retailer specific fields
  const [storeLocations, setStoreLocations] = useState("8");
  const [averageOrderValue, setAverageOrderValue] = useState("7500");
  const [customerBase, setCustomerBase] = useState("Health-conscious consumers, Urban professionals, Families");
  
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
    document.title = "Settings - CPG Matchmaker";
    
    // If not authenticated or not a retailer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "retailer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);
  
  // Mock form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      });
    }, 1000);
  };
  
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
  
  const handleSaveRetail = () => {
    toast({
      title: "Retail settings updated",
      description: "Your retail details have been saved.",
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
  
  if (!isAuthenticated || role !== "retailer") {
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
                <p className="text-muted-foreground">Manage your account and retail preferences</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="retail">Retail</TabsTrigger>
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
                        <Building className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveProfile}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Retail Tab */}
            <TabsContent value="retail">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Retail Information</CardTitle>
                      <CardDescription>
                        Configure your retail preferences and requirements
                      </CardDescription>
                    </div>
                    <Store className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Store Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2">
                        <label htmlFor="storeLocations" className="text-sm font-medium">
                          Number of Store Locations
                        </label>
                        <Input 
                          id="storeLocations" 
                          type="number"
                          value={storeLocations}
                          onChange={(e) => setStoreLocations(e.target.value)}
                          placeholder="Enter number of physical store locations"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label htmlFor="averageOrderValue" className="text-sm font-medium">
                          Average Order Value ($)
                        </label>
                        <Input 
                          id="averageOrderValue" 
                          type="number"
                          value={averageOrderValue}
                          onChange={(e) => setAverageOrderValue(e.target.value)}
                          placeholder="Enter your average order value"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="customerBase" className="text-sm font-medium">
                        Customer Base
                      </label>
                      <Textarea 
                        id="customerBase" 
                        value={customerBase}
                        onChange={(e) => setCustomerBase(e.target.value)}
                        className="min-h-[100px]"
                        placeholder="Describe your target customer demographics"
                      />
                      <p className="text-sm text-muted-foreground">
                        Describe your primary customer segments
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-6" />
                  
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium mb-2">Product Requirements</h3>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="organic-only" className="text-sm font-medium">Organic Products Only</label>
                        <Switch id="organic-only" defaultChecked={false} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Only show organic certified products when browsing
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="local-sourcing" className="text-sm font-medium">Local Sourcing Priority</label>
                        <Switch id="local-sourcing" defaultChecked={true} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Prioritize locally sourced products in matches
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="min-order" className="text-sm font-medium">Minimum Order Value ($)</label>
                      <Input 
                        id="min-order" 
                        type="number" 
                        defaultValue="5000" 
                        placeholder="Enter minimum order value"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleSaveRetail}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Retail Details
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
                        Manage how and when you receive notifications
                      </CardDescription>
                    </div>
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label htmlFor="email-notifications" className="text-sm font-medium">
                            Email Notifications
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Receive general email notifications about your account
                          </p>
                        </div>
                        <Switch 
                          id="email-notifications" 
                          checked={emailNotifications}
                          onCheckedChange={setEmailNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label htmlFor="message-notifications" className="text-sm font-medium">
                            Message Notifications
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you receive new messages
                          </p>
                        </div>
                        <Switch 
                          id="message-notifications" 
                          checked={messageNotifications}
                          onCheckedChange={setMessageNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label htmlFor="match-notifications" className="text-sm font-medium">
                            Match Notifications
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you match with a brand
                          </p>
                        </div>
                        <Switch 
                          id="match-notifications" 
                          checked={matchNotifications}
                          onCheckedChange={setMatchNotifications}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <label htmlFor="marketing-notifications" className="text-sm font-medium">
                            Marketing & Newsletters
                          </label>
                          <p className="text-sm text-muted-foreground">
                            Receive updates about new features and promotions
                          </p>
                        </div>
                        <Switch 
                          id="marketing-notifications" 
                          checked={marketingNotifications}
                          onCheckedChange={setMarketingNotifications}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Notification Schedule</h3>
                      <div className="space-y-2">
                        <label htmlFor="digest-frequency" className="text-sm font-medium">
                          Email Digest Frequency
                        </label>
                        <Select defaultValue="daily">
                          <SelectTrigger id="digest-frequency">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="realtime">Real-time</SelectItem>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="never">Never</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-sm text-muted-foreground">
                          How often you want to receive email digests
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
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
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>
                        Manage your account security and password
                      </CardDescription>
                    </div>
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
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
      
      <Footer />
    </div>
  );
};

export default RetailerSettings;
