import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  
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
    document.title = t("settings") + " - CPG Matchmaker";
    
    // If not authenticated or not a retailer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "retailer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role, t]);
  
  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
      
      // Log activity
      addToActivityLog(t("added-new-tag") + ": " + newTag.trim());
    }
  };
  
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
    
    // Log activity
    addToActivityLog(t("removed-tag") + ": " + tagToRemove);
  };
  
  const handleAddLocation = (e) => {
    e.preventDefault();
    if (newLocation.trim() && !storeLocations.includes(newLocation.trim())) {
      setStoreLocations([...storeLocations, newLocation.trim()]);
      setNewLocation("");
      
      // Log activity
      addToActivityLog(t("added-store-location") + ": " + newLocation.trim());
    }
  };
  
  const handleRemoveLocation = (locationToRemove) => {
    setStoreLocations(storeLocations.filter(location => location !== locationToRemove));
    
    // Log activity
    addToActivityLog(t("removed-store-location") + ": " + locationToRemove);
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
        title: t("settings-updated"),
        description: t("company-settings-saved"),
      });
      
      // Log activity
      addToActivityLog(t("updated-general-settings"));
    }, 1000);
  };

  const handleSaveNotifications = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t("notification-preferences-updated"),
        description: t("notification-settings-saved"),
      });
      
      // Log activity
      addToActivityLog(t("updated-notification-preferences"));
    }, 1000);
  };

  const handleSaveSecurity = () => {
    setIsLoading(true);
    // Validate password inputs
    if (newPassword && newPassword !== confirmPassword) {
      setIsLoading(false);
      toast({
        title: t("passwords-dont-match"),
        description: t("ensure-passwords-match"),
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t("security-settings-saved"),
        description: t("security-preferences-updated")
      });
      
      // Log activity
      addToActivityLog(t("updated-security-settings"));
    }, 1000);
  };

  const handleSaveRetail = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t("retail-details-updated"),
        description: t("retail-information-saved"),
      });
      
      // Log activity
      addToActivityLog(t("updated-retail-details"));
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
              <h1 className="text-3xl font-bold tracking-tight">{t("settings")}</h1>
              <p className="text-muted-foreground">
                {t("manage-account-preferences")}
              </p>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge variant="outline" className="text-xs px-2 py-1">
                <span className="text-primary font-medium">{t("retailer")}</span>
              </Badge>
              {autoSave && (
                <Badge variant="secondary" className="text-xs px-2 py-1 flex items-center gap-1">
                  <Save className="h-3 w-3" />
                  <span>{t("auto-save-on")}</span>
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
                  <span>{t("general")}</span>
                </TabsTrigger>
                <TabsTrigger value="retail" className="flex items-center gap-1.5">
                  <Store className="h-4 w-4" />
                  <span>{t("retail")}</span>
                </TabsTrigger>
                <TabsTrigger value="notification" className="flex items-center gap-1.5">
                  <Bell className="h-4 w-4" />
                  <span>{t("notifications")}</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4" />
                  <span>{t("security")}</span>
                </TabsTrigger>
                <TabsTrigger value="preferences" className="flex items-center gap-1.5">
                  <SettingsIcon className="h-4 w-4" />
                  <span>{t("preferences")}</span>
                </TabsTrigger>
                <TabsTrigger value="activity" className="flex items-center gap-1.5">
                  <UserCog className="h-4 w-4" />
                  <span>{t("activity")}</span>
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
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <TabsContent value="general" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>{t("company-information")}</CardTitle>
                            <CardDescription>
                              {t("update-company-details")}
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="companyName">{t("company-name")}</Label>
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
                              <Label htmlFor="email">{t("email-address")}</Label>
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
                              <Label htmlFor="phone">{t("phone-number")}</Label>
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
                              <Label htmlFor="website">{t("website")}</Label>
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
                              <Label htmlFor="address">{t("address")}</Label>
                              <Input
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="city">{t("city")}</Label>
                              <Input
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="state">{t("state")}</Label>
                                <Input
                                  id="state"
                                  value={state}
                                  onChange={(e) => setState(e.target.value)}
                                />
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="zipCode">{t("zip-code")}</Label>
                                <Input
                                  id="zipCode"
                                  value={zipCode}
                                  onChange={(e) => setZipCode(e.target.value)}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="description">{t("company-description")}</Label>
                              <Textarea
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                              />
                            </div>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="space-y-4">
                            <Label>{t("company-tags")}</Label>
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
                                placeholder={t("add-a-tag")}
                                value={newTag}
                                onChange={(e) => setNewTag(e.target.value)}
                                className="max-w-xs"
                              />
                              <Button type="submit" size="sm">{t("add")}</Button>
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
                              {t("save-changes")}
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
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
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <TabsContent value="retail" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>{t("retail-information")}</CardTitle>
                            <CardDescription>
                              {t("manage-retail-details")}
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="storeCount">{t("number-of-stores")}</Label>
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
                              <Label htmlFor="averageStoreSize">{t("average-store-size")}</Label>
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
                              <Label htmlFor="yearFounded">{t("year-founded")}</Label>
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
                            <Label>{t("store-locations")}</Label>
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
                                placeholder={t("add-store-location")}
                                value={newLocation}
                                onChange={(e) => setNewLocation(e.target.value)}
                                className="max-w-xs"
                              />
                              <Button type="submit" size="sm">{t("add")}</Button>
                            </form>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="border rounded-md p-4 bg-muted/30">
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <ShoppingCart className="h-4 w-4" />
                              {t("store-features")}
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="feature-online" defaultChecked />
                                <Label htmlFor="feature-online">{t("online-shopping")}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="feature-delivery" defaultChecked />
                                <Label htmlFor="feature-delivery">{t("home-delivery")}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="feature-pickup" />
                                <Label htmlFor="feature-pickup">{t("curbside-pickup")}</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="feature-loyalty" defaultChecked />
                                <Label htmlFor="feature-loyalty">{t("loyalty-program")}</Label>
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
                              {t("save-retail-details")}
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
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
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <TabsContent value="notification" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>{t("notification-preferences")}</CardTitle>
                            <CardDescription>
                              {t("choose-notification-preferences")}
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation} className="space-y-4">
                            <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                              <div className="space-y-0.5">
                                <Label htmlFor="emailNotifications" className="flex items-center gap-2">
                                  <AtSign className="h-4 w-4 text-primary" />
                                  {t("email-notifications")}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {t("receive-important-updates")}
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
                                  {t("message-notifications")}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {t("notified-new-messages")}
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
                                  {t("inventory-notifications")}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {t("notified-inventory-updates")}
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
                                  {t("marketing-emails")}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  {t("receive-tips-updates")}
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
                              {t("save-notification-settings")}
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
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
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <TabsContent value="security" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>{t("password-security")}</CardTitle>
                            <CardDescription>
                              {t("manage-password-security")}
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="currentPassword">{t("current-password")}</Label>
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
                                <Label htmlFor="newPassword">{t("new-password")}</Label>
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
                                <Label htmlFor="confirmPassword">{t("confirm-new-password")}</Label>
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
                                    {t("two-factor-authentication")}
                                  </Label>
                                  <p className="text-sm text-muted-foreground">
                                    {t("add-extra-security")}
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
                                  {t("security-notifications")}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4">
                                  {t("choose-security-notifications")}
                                </p>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  <div className="flex items-center space-x-2">
                                    <Switch id="security-login" defaultChecked />
                                    <Label htmlFor="security-login">{t("new-login-alerts")}</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch id="security-password" defaultChecked />
                                    <Label htmlFor="security-password">{t("password-changes")}</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch id="security-device" />
                                    <Label htmlFor="security-device">{t("new-device-login")}</Label>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Switch id="security-suspicious" defaultChecked />
                                    <Label htmlFor="security-suspicious">{t("suspicious-activity")}</Label>
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
                              {t("update-security-settings")}
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
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
                  <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                    <TabsContent value="preferences" className="space-y-6">
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("application-preferences")}</CardTitle>
                          <CardDescription>
                            {t("customize-app-experience")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <Label htmlFor="language">{t("language")}</Label>
                                <Select value={language} onValueChange={setLanguage}>
                                  <SelectTrigger id="language" className="w-full">
                                    <div className="flex items-center gap-2">
                                      <Languages className="h-4 w-4 text-muted-foreground" />
                                      <SelectValue placeholder={t("select-language")} />
                                    </div>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="en">{t("english")}</SelectItem>
                                    <SelectItem value="vi">{t("vietnamese")}</SelectItem>
                                    <SelectItem value="fr">{t("french")}</SelectItem>
                                    <SelectItem value="es">{t("spanish")}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              
                              <div className="space-y-2">
                                <Label htmlFor="theme">{t("theme")}</Label>
                                <Select value={theme} onValueChange={setTheme}>
                                  <SelectTrigger id="theme" className="w-full">
                                    <SelectValue placeholder={t("select-theme")} />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="light">{t("light")}</SelectItem>
                                    <SelectItem value="dark">{t("dark")}</SelectItem>
                                    <SelectItem value="system">{t("system")}</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="compact-sidebar">{t("compact-sidebar")}</Label>
                                <p className="text-sm text-muted-foreground">
                                  {t("use-compact-sidebar")}
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
                              {t("save-preferences")}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle>{t("help-support")}</CardTitle>
                          <CardDescription>
                            {t("get-help-platform")}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center gap-4">
                            <LifeBuoy className="h-8 w-8 text-primary" />
                            <div>
                              <h3 className="text-lg font-medium">{t("need-assistance")}</h3>
                              <p className="text-sm text-muted-foreground">
                                {t("support-team-help")}
                              </p>
                              <Button variant="outline" className="mt-2">
                                {t("contact-support")}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
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
