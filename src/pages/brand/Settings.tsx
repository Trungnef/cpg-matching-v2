
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
  Sparkles,
  Target,
  Users,
  BarChart,
  TrendingUp
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
  const [phone, setPhone] = useState("+1 (555) 987-6543");
  const [address, setAddress] = useState("456 Brand Avenue");
  const [city, setCity] = useState("Los Angeles");
  const [state, setState] = useState("CA");
  const [zipCode, setZipCode] = useState("90210");
  const [description, setDescription] = useState("We are a premium sustainable consumer brand specializing in eco-friendly household products. Our mission is to create products that are good for people and the planet.");
  
  // Brand-specific settings
  const [targetMarkets, setTargetMarkets] = useState(["Millennials", "Gen Z", "Eco-conscious"]);
  const [brandValues, setBrandValues] = useState(["Sustainability", "Quality", "Transparency"]);
  const [productCategories, setProductCategories] = useState(["Home", "Personal Care", "Food"]);
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [matchNotifications, setMatchNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  
  useEffect(() => {
    document.title = "Account Settings - CPG Matchmaker";
    
    // If not authenticated or not a brand, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "brand") {
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

  const handleSaveBrandStrategy = () => {
    toast({
      title: "Brand strategy updated",
      description: "Your brand strategy settings have been saved.",
    });
  };

  const handleSaveMarketing = () => {
    toast({
      title: "Marketing settings updated",
      description: "Your marketing preferences have been saved.",
    });
  };

  if (!isAuthenticated || role !== "brand") {
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
                <p className="text-muted-foreground">Manage your brand account and marketing preferences</p>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 mb-6">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="brand">Brand Strategy</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
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
                        Brand Name
                      </label>
                      <div className="flex">
                        <div className="relative flex-1">
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
                      Brand Description
                    </label>
                    <Textarea 
                      id="description" 
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground">
                      This description will be visible to potential manufacturing and retail partners.
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
            
            {/* Brand Strategy Tab */}
            <TabsContent value="brand">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Brand Strategy</CardTitle>
                      <CardDescription>
                        Define your brand identity, target markets, and values
                      </CardDescription>
                    </div>
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Brand Values</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {brandValues.map((value, index) => (
                        <Badge key={index} variant="secondary">{value}</Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-6">
                        + Add
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      These values help match you with compatible manufacturers and retailers.
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Target Markets</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {targetMarkets.map((market, index) => (
                        <Badge key={index} variant="secondary">{market}</Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-6">
                        + Add
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Product Categories</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {productCategories.map((category, index) => (
                        <Badge key={index} variant="secondary">{category}</Badge>
                      ))}
                      <Button variant="outline" size="sm" className="h-6">
                        + Add
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Brand Voice</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm">
                          Communication Style
                        </label>
                        <Select defaultValue="friendly">
                          <SelectTrigger>
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="friendly">Friendly & Approachable</SelectItem>
                            <SelectItem value="professional">Professional & Authoritative</SelectItem>
                            <SelectItem value="educational">Educational & Informative</SelectItem>
                            <SelectItem value="fun">Fun & Energetic</SelectItem>
                            <SelectItem value="minimalist">Minimalist & Direct</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">
                          Key Messaging Pillar
                        </label>
                        <Select defaultValue="sustainability">
                          <SelectTrigger>
                            <SelectValue placeholder="Select messaging" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sustainability">Sustainability & Environment</SelectItem>
                            <SelectItem value="quality">Quality & Craftsmanship</SelectItem>
                            <SelectItem value="innovation">Innovation & Technology</SelectItem>
                            <SelectItem value="wellness">Health & Wellness</SelectItem>
                            <SelectItem value="value">Value & Affordability</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveBrandStrategy}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Brand Strategy
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Marketing Tab */}
            <TabsContent value="marketing">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Marketing Settings</CardTitle>
                      <CardDescription>
                        Configure your marketing preferences and strategies
                      </CardDescription>
                    </div>
                    <Target className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Marketing Channels</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Social Media</p>
                          <p className="text-sm text-muted-foreground">Instagram, TikTok, Facebook</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Email Marketing</p>
                          <p className="text-sm text-muted-foreground">Newsletters, Product Launches</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Influencer Marketing</p>
                          <p className="text-sm text-muted-foreground">Product Seeding, Partnerships</p>
                        </div>
                        <Switch defaultChecked={true} />
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <p className="font-medium">Paid Advertising</p>
                          <p className="text-sm text-muted-foreground">Google Ads, Meta Ads</p>
                        </div>
                        <Switch defaultChecked={false} />
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Campaign Preferences</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm">
                          Launch Frequency
                        </label>
                        <Select defaultValue="quarterly">
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="biannual">Biannual</SelectItem>
                            <SelectItem value="annual">Annual</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm">
                          Budget Allocation
                        </label>
                        <Select defaultValue="organic">
                          <SelectTrigger>
                            <SelectValue placeholder="Select budget focus" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="organic">Organic Growth Focus</SelectItem>
                            <SelectItem value="paid">Paid Acquisition Focus</SelectItem>
                            <SelectItem value="balanced">Balanced Approach</SelectItem>
                            <SelectItem value="events">Events & Activations</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Co-Marketing</h3>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Retailer Co-Marketing</p>
                        <p className="text-sm text-muted-foreground">
                          Allow retailers to feature your products in their marketing
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Manufacturer Partnerships</p>
                        <p className="text-sm text-muted-foreground">
                          Collaborate with manufacturers on sustainability stories
                        </p>
                      </div>
                      <Switch defaultChecked={true} />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Cross-Brand Promotions</p>
                        <p className="text-sm text-muted-foreground">
                          Participate in multi-brand campaigns and offers
                        </p>
                      </div>
                      <Switch defaultChecked={false} />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSaveMarketing}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Marketing Settings
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
                        <p className="font-medium">Manufacturer Match Alerts</p>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications when new manufacturer matches are found
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
                          Receive email when you get new messages from partners
                        </p>
                      </div>
                      <Switch 
                        checked={messageNotifications} 
                        onCheckedChange={setMessageNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="font-medium">Product Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified about changes to your product inventory and listings
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
                        <p className="font-medium">Brand Profile Visibility</p>
                        <p className="text-sm text-muted-foreground">
                          Control who can see your brand profile
                        </p>
                      </div>
                      <Select defaultValue="verified">
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select visibility" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="verified">Verified Partners Only</SelectItem>
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
