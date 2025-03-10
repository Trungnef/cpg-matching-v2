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
import { Bell, Building, Lock, User, Settings as SettingsIcon, ArrowLeft, Save, UserCircle, Mail, Phone, MapPin, Shield, CreditCard, AlertCircle, LogOut, Globe } from "lucide-react";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";

const RetailerSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, role } = useUser();
  const [saving, setSaving] = useState(false);
  
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
  
  useEffect(() => {
    document.title = "Account Settings - CPG Matchmaker";
    
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
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      });
    }, 1000);
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
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h1 className="text-2xl font-bold mb-6">Settings</h1>
              
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/dashboard")}
                >
                  <Building className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
          
          {/* Settings content */}
          <div className="flex-1">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="retail">Retail</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
              </TabsList>
              
              {/* General Settings */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Manage your basic account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input 
                            id="company-name" 
                            defaultValue="Whole Foods Market" 
                            placeholder="Enter your company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input 
                            id="website" 
                            defaultValue="https://www.wholefoods.com" 
                            placeholder="Enter your website URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Contact Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            defaultValue="partnerships@wholefoods.com" 
                            placeholder="Enter your contact email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Contact Phone</Label>
                          <Input 
                            id="phone" 
                            defaultValue="+1 (512) 555-7890" 
                            placeholder="Enter your contact phone"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Company Bio</Label>
                        <Textarea 
                          id="bio" 
                          rows={4} 
                          defaultValue="Whole Foods Market is an American multinational supermarket chain known for selling products free from hydrogenated fats and artificial colors, flavors, and preservatives." 
                          placeholder="Enter a brief description of your company"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Retail Settings */}
              <TabsContent value="retail">
                <Card>
                  <CardHeader>
                    <CardTitle>Retail Settings</CardTitle>
                    <CardDescription>
                      Configure your retail preferences and requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Store Locations</h3>
                        <div className="space-y-2">
                          <Label htmlFor="locations">Number of Locations</Label>
                          <Input 
                            id="locations" 
                            type="number" 
                            defaultValue="500" 
                            placeholder="Enter number of locations"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="regions">Regions</Label>
                          <Textarea 
                            id="regions" 
                            rows={2} 
                            defaultValue="United States, Canada, United Kingdom" 
                            placeholder="Enter the regions where you operate"
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Product Requirements</h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="organic-only">Organic Products Only</Label>
                            <Switch id="organic-only" defaultChecked={false} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Only show organic certified products when browsing
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="local-sourcing">Local Sourcing Priority</Label>
                            <Switch id="local-sourcing" defaultChecked={true} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Prioritize locally sourced products in matches
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="min-order">Minimum Order Value ($)</Label>
                          <Input 
                            id="min-order" 
                            type="number" 
                            defaultValue="5000" 
                            placeholder="Enter minimum order value"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notification Settings */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Control when and how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="match-emails">New Match Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive an email when a new match is found
                            </p>
                          </div>
                          <Switch id="match-emails" defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="message-emails">Message Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive an email when you get a new message
                            </p>
                          </div>
                          <Switch id="message-emails" defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="marketing-emails">Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about new features and promotions
                            </p>
                          </div>
                          <Switch id="marketing-emails" defaultChecked={false} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="browser-notifications">Browser Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Show browser notifications for activities
                            </p>
                          </div>
                          <Switch id="browser-notifications" defaultChecked={true} />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Settings */}
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
              
              {/* Profile Settings */}
              <TabsContent value="profile">
                <Card>
                  <CardHeader>
                    <CardTitle>Retailer Profile</CardTitle>
                    <CardDescription>
                      Update your retailer information and company details
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="userName">Name</Label>
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
                          <Label htmlFor="companyName">Company Name</Label>
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
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
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
                        
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
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
                          <Label htmlFor="website">Website</Label>
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
                          <Label htmlFor="address">Street Address</Label>
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input 
                            id="city" 
                            value={city}
                            onChange={e => setCity(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="state">State</Label>
                          <Input 
                            id="state" 
                            value={state}
                            onChange={e => setState(e.target.value)}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="zipCode">Zip Code</Label>
                          <Input 
                            id="zipCode" 
                            value={zipCode}
                            onChange={e => setZipCode(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea 
                          id="description" 
                          value={description}
                          onChange={e => setDescription(e.target.value)}
                          className="min-h-[120px]"
                          placeholder="Tell us about your company..."
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RetailerSettings;
