import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Bell, 
  Lock, 
  Shield,
  Building,
  Globe,
  ShieldAlert,
  Loader2,
  LifeBuoy,
  AtSign,
  Phone,
  Store,
  MapPin,
  Users,
  ShoppingCart,
  Languages,
  Truck,
  Save,
  UserCog,
  BookOpen,
  Megaphone,
  Handshake,
  BarChart
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import RetailerLayout from "@/components/layouts/RetailerLayout";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Enhanced animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { 
      duration: 0.3,
      ease: "easeIn" 
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const Settings = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form states
  const [companyName, setCompanyName] = useState(user?.companyName || "GreenMart Retail");
  const [email, setEmail] = useState(user?.email || "contact@greenmart.com");
  const [phone, setPhone] = useState("+1 (555) 456-7890");
  const [website, setWebsite] = useState("https://www.greenmart.com");
  const [address, setAddress] = useState("789 Retail Blvd");
  const [city, setCity] = useState("Commerce City");
  const [state, setState] = useState("CA");
  const [zipCode, setZipCode] = useState("94105");
  const [description, setDescription] = useState("GreenMart is a retail chain focused on healthy and sustainable products for environmentally-conscious consumers.");
  
  // Tags functionality
  const [tags, setTags] = useState(["Grocery", "Eco-friendly", "Natural", "Organic"]);
  const [newTag, setNewTag] = useState("");
  
  // Activity log
  const [activityLog, setActivityLog] = useState([
    { action: "Profile updated", timestamp: "2023-09-28 11:45 AM" },
    { action: "New store location added", timestamp: "2023-09-12 04:30 PM" },
    { action: "Inventory settings updated", timestamp: "2023-08-22 09:15 AM" },
  ]);
  
  // Retailer specific fields
  const [storeCount, setStoreCount] = useState("12");
  const [averageStoreSize, setAverageStoreSize] = useState("15000");
  const [yearFounded, setYearFounded] = useState("2010");
  
  // Store locations
  const [storeLocations, setStoreLocations] = useState([
    "San Francisco, CA", "Los Angeles, CA", "San Diego, CA", "Sacramento, CA"
  ]);
  const [newLocation, setNewLocation] = useState("");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [inventoryNotifications, setInventoryNotifications] = useState(true);
  const [marketingNotifications, setMarketingNotifications] = useState(false);
  
  // Security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // Language settings
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  
  // Auto-save functionality
  const [autoSave, setAutoSave] = useState(true);
  
  useEffect(() => {
    document.title = "Settings - CPG Matchmaker";
    
    // If not authenticated or not a retailer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "retailer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);
  
  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      
      // Log activity
      addToActivityLog("Added new tag: " + newTag.trim());
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    
    // Log activity
    addToActivityLog("Removed tag: " + tagToRemove);
  };
  
  const handleAddLocation = (e) => {
    e.preventDefault();
    if (newLocation.trim() && !storeLocations.includes(newLocation.trim())) {
      setStoreLocations([...storeLocations, newLocation.trim()]);
      setNewLocation("");
      
      // Log activity
      addToActivityLog("Added new store location: " + newLocation.trim());
    }
  };
  
  const handleRemoveLocation = (locationToRemove) => {
    setStoreLocations(storeLocations.filter(location => location !== locationToRemove));
    
    // Log activity
    addToActivityLog("Removed store location: " + locationToRemove);
  };
  
  const addToActivityLog = (action) => {
    const now = new Date();
    const timestamp = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    const newActivity = { action, timestamp };
    setActivityLog([newActivity, ...activityLog]);
  };

  const handleSaveGeneral = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Settings updated",
        description: "Your company settings have been saved successfully.",
      });
      
      // Log activity
      addToActivityLog("Updated general settings");
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      });
      
      // Log activity
      addToActivityLog("Updated notification preferences");
    }, 1000);
  };

  const handleSaveSecurity = () => {
    setIsLoading(true);
    // Validate password inputs
    if (newPassword && newPassword !== confirmPassword) {
      setIsLoading(false);
      toast({
        title: "Passwords don't match",
        description: "Please ensure your passwords match and try again.",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Security settings saved",
        description: "Your security preferences have been updated successfully."
      });
      
      // Log activity
      addToActivityLog("Updated security settings");
    }, 1000);
  };

  const handleSaveRetail = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Retail details updated",
        description: "Your retail information has been saved successfully.",
      });
      
      // Log activity
      addToActivityLog("Updated retail details");
    }, 1000);
  };

  if (!isAuthenticated || role !== "retailer") {
    return null;
  }
  
  return (
    <RetailerLayout>
      <div className="max-w-none px-4 sm:px-6 lg:px-8 pb-6">
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account preferences and retail information
              </p>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge variant="outline" className="text-xs px-2 py-1">
                <span className="text-primary font-medium">Retailer</span>
              </Badge>
              {autoSave && (
                <Badge variant="secondary" className="text-xs px-2 py-1 flex items-center gap-1">
                  <Save className="h-3 w-3" />
                  <span>Auto-save on</span>
                </Badge>
              )}
            </motion.div>
          </div>

          <Tabs
            defaultValue="general"
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <motion.div 
              className="bg-background sticky top-0 z-10 pb-4 pt-1"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-1">
                <TabsTrigger value="general" className="flex items-center gap-1.5">
                  <Building className="h-4 w-4" />
                  <span>General</span>
                </TabsTrigger>
                <TabsTrigger value="retail" className="flex items-center gap-1.5">
                  <Store className="h-4 w-4" />
                  <span>Retail</span>
                </TabsTrigger>
                <TabsTrigger value="notification" className="flex items-center gap-1.5">
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span>Security</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-1.5">
                  <SettingsIcon className="h-4 w-4" />
                  <span>Preferences</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-1.5">
                  <UserCog className="h-4 w-4" />
                  <span>Activity</span>
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <AnimatePresence mode="wait">
              {/* General Settings Tab */}
              {activeTab === "general" && (
                <motion.div
                  key="general"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  <TabsContent value="general" className="space-y-6">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>Company Information</CardTitle>
                            <CardDescription>
                              Update your company details and contact information
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="companyName">Company Name</Label>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="companyName"
                                  value={companyName}
                                  onChange={(e) => setCompanyName(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <div className="relative">
                                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="email"
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="phone">Phone Number</Label>
                              <div className="relative">
                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="phone"
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="website">Website</Label>
                              <div className="relative">
                                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="website"
                                  value={website}
                                  onChange={(e) => setWebsite(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>

                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="address">Address</Label>
                              <Input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                  id="state"
                                  value={state}
                                  onChange={(e) => setState(e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="zipCode">Zip Code</Label>
                                <Input
                                  id="zipCode"
                                  value={zipCode}
                                  onChange={(e) => setZipCode(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="description">Company Description</Label>
                              <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="space-y-4">
                            <Label>Company Tags</Label>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {tags.map((tag, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Badge 
                                    variant="secondary" 
                                    className="px-3 py-1 gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                                    onClick={() => handleRemoveTag(tag)}
                                  >
                                    {tag}
                                    <span className="ml-1 text-xs">×</span>
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                            
                            <form onSubmit={handleAddTag} className="flex gap-2">
                              <Input 
                                placeholder="Add a tag..." 
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className="max-w-xs"
                              />
                              <Button type="submit" size="sm">Add</Button>
                            </form>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="flex justify-end">
                            <Button 
                              onClick={handleSaveGeneral} 
                              disabled={isLoading}
                              className="group"
                            >
                              {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                              )}
                              Save Changes
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </motion.div>
              )}

              {/* Retail Tab */}
              {activeTab === "retail" && (
                <motion.div
                  key="retail"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  <TabsContent value="retail" className="space-y-6">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>Retail Information</CardTitle>
                            <CardDescription>
                              Manage your retail details and store locations
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="storeCount">Number of Stores</Label>
                              <div className="relative">
                                <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="storeCount"
                                  type="number"
                                  value={storeCount}
                                  onChange={(e) => setStoreCount(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="averageStoreSize">Average Store Size (sq ft)</Label>
                              <div className="relative">
                                <BarChart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="averageStoreSize"
                                  type="number"
                                  value={averageStoreSize}
                                  onChange={(e) => setAverageStoreSize(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="yearFounded">Year Founded</Label>
                              <div className="relative">
                                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="yearFounded"
                                  type="number"
                                  value={yearFounded}
                                  onChange={(e) => setYearFounded(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="space-y-4">
                            <Label>Store Locations</Label>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {storeLocations.map((location, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Badge 
                                    variant="secondary" 
                                    className="px-3 py-1 gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                                    onClick={() => handleRemoveLocation(location)}
                                  >
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {location}
                                    <span className="ml-1 text-xs">×</span>
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                            
                            <form onSubmit={handleAddLocation} className="flex gap-2">
                              <Input 
                                placeholder="Add a store location..." 
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                className="max-w-xs"
                              />
                              <Button type="submit" size="sm">Add</Button>
                            </form>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="border rounded-md p-4 bg-muted/30">
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4" />
                              Store Features
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="feature-online" defaultChecked />
                                <Label htmlFor="feature-online">Online Shopping</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="feature-delivery" defaultChecked />
                                <Label htmlFor="feature-delivery">Home Delivery</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="feature-pickup" />
                                <Label htmlFor="feature-pickup">Curbside Pickup</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="feature-loyalty" defaultChecked />
                                <Label htmlFor="feature-loyalty">Loyalty Program</Label>
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="flex justify-end">
                            <Button 
                              onClick={handleSaveRetail} 
                              disabled={isLoading}
                              className="group"
                            >
                              {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                              )}
                              Save Retail Details
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </motion.div>
              )}

              {/* Notification Tab */}
              {activeTab === "notification" && (
                <motion.div
                  key="notification"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  <TabsContent value="notification" className="space-y-6">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>Notification Preferences</CardTitle>
                            <CardDescription>
                              Choose how you want to receive notifications and updates
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation} className="space-y-4">
                            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                              <div className="space-y-0.5">
                                <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                                  <AtSign className="h-4 w-4 text-primary" />
                                  Email Notifications
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Receive important updates via email
                                </p>
                              </div>
                              <Switch
                                id="emailNotifications"
                                checked={emailNotifications}
                                onCheckedChange={setEmailNotifications}
                              />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                              <div className="space-y-0.5">
                                <Label htmlFor="messageNotifications" className="flex items-center gap-2">
                                  <Bell className="h-4 w-4 text-primary" />
                                  Message Notifications
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Get notified when you receive new messages
                                </p>
                              </div>
                              <Switch
                                id="messageNotifications"
                                checked={messageNotifications}
                                onCheckedChange={setMessageNotifications}
                              />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                              <div className="space-y-0.5">
                                <Label htmlFor="inventoryNotifications" className="flex items-center gap-2">
                                  <Truck className="h-4 w-4 text-primary" />
                                  Inventory Notifications
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Get notified about inventory updates and deliveries
                                </p>
                              </div>
                              <Switch
                                id="inventoryNotifications"
                                checked={inventoryNotifications}
                                onCheckedChange={setInventoryNotifications}
                              />
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                              <div className="space-y-0.5">
                                <Label htmlFor="marketingNotifications" className="flex items-center gap-2">
                                  <Megaphone className="h-4 w-4 text-primary" />
                                  Marketing Emails
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Receive tips, product updates and offers
                                </p>
                              </div>
                              <Switch
                                id="marketingNotifications"
                                checked={marketingNotifications}
                                onCheckedChange={setMarketingNotifications}
                              />
                            </div>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="flex justify-end">
                            <Button 
                              onClick={handleSaveNotifications} 
                              disabled={isLoading}
                              className="group"
                            >
                              {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                              )}
                              Save Notification Settings
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </motion.div>
              )}

              {/* Security Tab with enhanced UI */}
              {activeTab === "security" && (
                <motion.div
                  key="security"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  <TabsContent value="security" className="space-y-6">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>Password & Security</CardTitle>
                            <CardDescription>
                              Manage your password and security preferences
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">Current Password</Label>
                              <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="currentPassword"
                                  type="password"
                                  value={currentPassword}
                                  onChange={(e) => setCurrentPassword(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                  <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="pl-10"
                                  />
                                </div>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                  <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="pl-10"
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <Separator className="my-6" />
                            </div>
                            
                            <div className="md:col-span-2">
                              <div className="p-4 rounded-md border bg-muted/30 flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="twoFactorEnabled" className="flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-primary" />
                                    Two-Factor Authentication
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    Add an extra layer of security to your account
                                  </p>
                                </div>
                                <Switch
                                  id="twoFactorEnabled"
                                  checked={twoFactorEnabled}
                                  onCheckedChange={setTwoFactorEnabled}
                                />
                              </div>
                            </div>
                            
                            <div className="md:col-span-2">
                              <div className="p-4 rounded-md border bg-muted/30">
                                <h3 className="font-medium mb-2 flex items-center gap-2">
                                  <ShieldAlert className="h-4 w-4 text-primary" />
                                  Security Notifications
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  Choose how you want to be notified about security-related events
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div className="flex items-center space-x-2">
                                    <Switch id="security-login" defaultChecked />
                                    <Label htmlFor="security-login">New Login Alerts</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch id="security-password" defaultChecked />
                                    <Label htmlFor="security-password">Password Changes</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch id="security-device" />
                                    <Label htmlFor="security-device">New Device Login</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch id="security-suspicious" defaultChecked />
                                    <Label htmlFor="security-suspicious">Suspicious Activity</Label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="flex justify-end">
                            <Button 
                              onClick={handleSaveSecurity} 
                              disabled={isLoading}
                              className="group"
                            >
                              {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                              )}
                              Update Security Settings
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </TabsContent>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === "preferences" && (
                <motion.div
                  key="preferences"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  <TabsContent value="preferences" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Application Preferences</CardTitle>
                        <CardDescription>
                          Customize your application experience
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <Select value={language} onValueChange={setLanguage}>
                                <SelectTrigger id="language" className="w-full">
                                  <div className="flex items-center gap-2">
                                    <Languages className="h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Select language" />
                                  </div>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="vi">Tiếng Việt</SelectItem>
                                  <SelectItem value="fr">Français</SelectItem>
                                  <SelectItem value="es">Español</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="theme">Theme</Label>
                              <Select value={theme} onValueChange={setTheme}>
                                <SelectTrigger id="theme" className="w-full">
                                  <SelectValue placeholder="Select theme" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="light">Light</SelectItem>
                                  <SelectItem value="dark">Dark</SelectItem>
                                  <SelectItem value="system">System</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          
                          <Separator />
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="compact-sidebar">Compact Sidebar</Label>
                              <p className="text-sm text-muted-foreground">
                                Use a more compact sidebar layout
                              </p>
                            </div>
                            <Switch
                              id="compact-sidebar"
                              defaultChecked={true}
                            />
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
                          <Button disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Preferences
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Help & Support</CardTitle>
                        <CardDescription>
                          Get help with using the platform
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex items-center gap-4">
                          <LifeBuoy className="h-8 w-8 text-primary" />
                          <div>
                            <h3 className="text-lg font-medium">Need assistance?</h3>
                            <p className="text-sm text-muted-foreground">
                              Our support team is here to help you with any questions you may have.
                            </p>
                            <Button variant="outline" className="mt-2">
                              Contact Support
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </div>
    </RetailerLayout>
  );
};

export default Settings;
