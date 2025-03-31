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
  Factory,
  Building2,
  Globe,
  ShieldAlert,
  Loader2,
  LifeBuoy,
  Gauge,
  AtSign,
  Phone,
  CircleDollarSign,
  CheckCircle,
  Languages,
  PanelLeftClose,
  Save,
  UserCog,
  BookOpen,
  Handshake,
  Megaphone,
  Upload,
  ImageIcon,
  Camera,
  BadgeCheck,
  Share2,
  FileCheck,
  TrendingUp
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import ManufacturerLayout from "@/components/layouts/ManufacturerLayout";
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

// Add the following animations
const pulseAnimation = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.02, 1],
    transition: { 
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" 
    }
  }
};

const shimmerAnimation = {
  initial: { backgroundPosition: "-500px 0" },
  animate: { 
    backgroundPosition: ["500px 0"],
    transition: { 
      repeat: Infinity,
      duration: 1.5,
      ease: "linear"
    }
  }
};

const Settings = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Form states
  const [companyName, setCompanyName] = useState(user?.companyName || "Alpha Manufacturing Inc.");
  const [email, setEmail] = useState(user?.email || "contact@alphamanufacturing.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [website, setWebsite] = useState("https://www.alphamanufacturing.com");
  const [address, setAddress] = useState("123 Manufacturing Way");
  const [city, setCity] = useState("Industrial City");
  const [state, setState] = useState("CA");
  const [zipCode, setZipCode] = useState("90210");
  const [description, setDescription] = useState("Leading manufacturer of food and beverage products with over 20 years of experience in the industry.");
  
  // Tags functionality
  const [tags, setTags] = useState(["Food", "Beverage", "Organic", "Sustainable"]);
  const [newTag, setNewTag] = useState("");
  
  // Activity log
  const [activityLog, setActivityLog] = useState([
    { action: "Profile updated", timestamp: "2023-09-15 10:23 AM" },
    { action: "Password changed", timestamp: "2023-08-30 03:45 PM" },
    { action: "New certification added", timestamp: "2023-08-12 11:18 AM" },
  ]);
  
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
  
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // Language settings
  const [language, setLanguage] = useState("en");
  const [theme, setTheme] = useState("light");
  
  // Auto-save functionality
  const [autoSave, setAutoSave] = useState(true);
  
  // Advanced manufacturing settings
  const [materialsHandled, setMaterialsHandled] = useState([
    "Organic ingredients", "Recyclable packaging", "Dairy alternatives"
  ]);
  const [newMaterial, setNewMaterial] = useState("");
  
  // New profile states
  const [profileImage, setProfileImage] = useState(null);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState("/placeholders/avatar.png");
  const [companyLogoUrl, setCompanyLogoUrl] = useState("/placeholders/manufacturer-logo.svg");
  const [isProfileUploading, setIsProfileUploading] = useState(false);
  const [isLogoUploading, setIsLogoUploading] = useState(false);
  const [coverColor, setCoverColor] = useState("#0284c7");
  const [primaryColor, setPrimaryColor] = useState("#0284c7");
  const [bannerPreset, setBannerPreset] = useState("gradient");
  const [socialLinks, setSocialLinks] = useState({
    website: "https://www.alphamanufacturing.com",
    linkedin: "https://linkedin.com/company/alphamanufacturing",
    twitter: "https://twitter.com/alphamanufacturing"
  });
  
  useEffect(() => {
    document.title = "Settings - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
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
  
  const handleAddMaterial = (e) => {
    e.preventDefault();
    if (newMaterial.trim() && !materialsHandled.includes(newMaterial.trim())) {
      setMaterialsHandled([...materialsHandled, newMaterial.trim()]);
      setNewMaterial("");
      
      // Log activity
      addToActivityLog("Added new material: " + newMaterial.trim());
    }
  };
  
  const handleRemoveMaterial = (materialToRemove) => {
    setMaterialsHandled(materialsHandled.filter(material => material !== materialToRemove));
    
    // Log activity
    addToActivityLog("Removed material: " + materialToRemove);
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
    }, 1000);
  };

  const handleSaveManufacturing = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Manufacturing settings updated",
        description: "Your manufacturing details have been saved.",
      });
    }, 1000);
  };

  // Handle profile image upload
  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsProfileUploading(true);
      
      // Create a URL for the file
      const url = URL.createObjectURL(file);
      setProfileImageUrl(url);
      setProfileImage(file);
      
      // Simulate upload
      setTimeout(() => {
        setIsProfileUploading(false);
        addToActivityLog("Updated profile image");
        toast({
          title: "Profile image updated",
          description: "Your profile image has been updated successfully."
        });
      }, 1500);
    }
  };
  
  // Handle company logo upload
  const handleCompanyLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsLogoUploading(true);
      
      // Create a URL for the file
      const url = URL.createObjectURL(file);
      setCompanyLogoUrl(url);
      setCompanyLogo(file);
      
      // Simulate upload
      setTimeout(() => {
        setIsLogoUploading(false);
        addToActivityLog("Updated company logo");
        toast({
          title: "Company logo updated",
          description: "Your company logo has been updated successfully."
        });
      }, 1500);
    }
  };
  
  const handleSaveProfile = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile settings have been saved successfully."
      });
      
      // Log activity
      addToActivityLog("Updated profile settings");
    }, 1000);
  };

  if (!isAuthenticated || role !== "manufacturer") {
    return null;
  }
  
  return (
    <ManufacturerLayout>
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
                Manage your account preferences and company information
              </p>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge variant="outline" className="text-xs px-2 py-1">
                <span className="text-primary font-medium">Manufacturer</span>
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
              <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-1">
                <TabsTrigger value="profile" className="flex items-center gap-1.5">
                  <UserCog className="h-4 w-4" />
                  <span>Profile</span>
                </TabsTrigger>
                <TabsTrigger value="general" className="flex items-center gap-1.5">
                  <Building2 className="h-4 w-4" />
                  <span>General</span>
                </TabsTrigger>
                <TabsTrigger value="manufacturing" className="flex items-center gap-1.5">
                  <Factory className="h-4 w-4" />
                  <span>Manufacturing</span>
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
                  <TrendingUp className="h-4 w-4" />
                  <span>Activity</span>
                </TabsTrigger>
              </TabsList>
            </motion.div>

            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  <TabsContent value="profile" className="space-y-6">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                              Update your profile information and company branding
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation}>
                            <div 
                              className="relative h-40 w-full rounded-lg overflow-hidden mb-6"
                              style={{ backgroundColor: coverColor }}
                            >
                              {bannerPreset === "gradient" && (
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-primary/30"></div>
                              )}
                              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
                              
                              <div className="absolute bottom-4 right-4 flex gap-2">
                                <Button size="sm" variant="outline" className="bg-white/20 backdrop-blur-sm">
                                  <Camera className="h-4 w-4 mr-1" />
                                  Change Banner
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="flex flex-col items-center space-y-4">
                                <div className="relative">
                                  <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-background">
                                    {isProfileUploading ? (
                                      <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                      </div>
                                    ) : (
                                      <img 
                                        src={profileImageUrl} 
                                        alt="Profile" 
                                        className="h-full w-full object-cover"
                                      />
                                    )}
                                  </div>
                                  <label htmlFor="profile-upload" className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center cursor-pointer hover:bg-primary/90 transition-colors">
                                    <Camera className="h-4 w-4" />
                                    <input 
                                      type="file" 
                                      id="profile-upload" 
                                      className="sr-only" 
                                      accept="image/*"
                                      onChange={handleProfileImageChange}
                                    />
                                  </label>
                                </div>
                                <div className="text-center">
                                  <h3 className="font-medium">{user?.name || "John Smith"}</h3>
                                  <p className="text-sm text-muted-foreground">Manufacturing Director</p>
                                </div>
                              </div>
                              
                              <div className="flex-1 space-y-6">
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label htmlFor="displayName">Display Name</Label>
                                      <Input id="displayName" defaultValue={user?.name || "John Smith"} />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="jobTitle">Job Title</Label>
                                      <Input id="jobTitle" defaultValue="Manufacturing Director" />
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <Label htmlFor="bio">Professional Bio</Label>
                                    <Textarea 
                                      id="bio" 
                                      rows={3}
                                      defaultValue="Manufacturing professional with over 15 years of experience in the food and beverage industry. Specializing in sustainable production methods and quality assurance."
                                    />
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <Label>Company Logo</Label>
                                  <div className="flex items-center gap-6">
                                    <div className="relative h-24 w-24 rounded-md overflow-hidden border border-input">
                                      {isLogoUploading ? (
                                        <div className="absolute inset-0 flex items-center justify-center bg-muted">
                                          <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                        </div>
                                      ) : (
                                        <img 
                                          src={companyLogoUrl} 
                                          alt="Company Logo" 
                                          className="h-full w-full object-contain p-1"
                                        />
                                      )}
                                    </div>
                                    <div className="space-y-2 flex-1">
                                      <p className="text-sm text-muted-foreground">
                                        Upload your company logo. Recommended size 512x512px.
                                      </p>
                                      <div className="flex gap-2">
                                        <label htmlFor="logo-upload" className="cursor-pointer">
                                          <Button variant="outline" size="sm" className="gap-1" asChild>
                                            <div>
                                              <Upload className="h-4 w-4" />
                                              Upload Logo
                                            </div>
                                          </Button>
                                          <input 
                                            type="file" 
                                            id="logo-upload" 
                                            className="sr-only" 
                                            accept="image/*"
                                            onChange={handleCompanyLogoChange}
                                          />
                                        </label>
                                        <Button variant="ghost" size="sm">Remove</Button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <Label>Brand Colors</Label>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="h-5 w-5 rounded-full border"
                                          style={{ backgroundColor: primaryColor }}
                                        ></div>
                                        <Label htmlFor="primaryColor">Primary Color</Label>
                                      </div>
                                      <Input 
                                        id="primaryColor" 
                                        type="color" 
                                        value={primaryColor}
                                        onChange={(e) => setPrimaryColor(e.target.value)}
                                        className="h-10" 
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <div 
                                          className="h-5 w-5 rounded-full border"
                                          style={{ backgroundColor: coverColor }}
                                        ></div>
                                        <Label htmlFor="coverColor">Banner Color</Label>
                                      </div>
                                      <Input 
                                        id="coverColor" 
                                        type="color" 
                                        value={coverColor}
                                        onChange={(e) => setCoverColor(e.target.value)}
                                        className="h-10" 
                                      />
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="space-y-4">
                                  <Label>Social Links</Label>
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 gap-2">
                                      <div className="flex items-center gap-2">
                                        <Globe className="h-4 w-4 text-muted-foreground" />
                                        <Input 
                                          placeholder="Website URL" 
                                          value={socialLinks.website}
                                          onChange={(e) => setSocialLinks({...socialLinks, website: e.target.value})}
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"></path>
                                        </svg>
                                        <Input 
                                          placeholder="LinkedIn URL" 
                                          value={socialLinks.linkedin}
                                          onChange={(e) => setSocialLinks({...socialLinks, linkedin: e.target.value})}
                                        />
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <svg className="h-4 w-4 text-muted-foreground" viewBox="0 0 24 24" fill="currentColor">
                                          <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"></path>
                                        </svg>
                                        <Input 
                                          placeholder="Twitter URL" 
                                          value={socialLinks.twitter}
                                          onChange={(e) => setSocialLinks({...socialLinks, twitter: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center p-3 rounded-lg bg-primary/5 border">
                                  <BadgeCheck className="h-5 w-5 text-primary mr-2" />
                                  <div className="flex-1">
                                    <h4 className="text-sm font-medium">Verified Manufacturer Status</h4>
                                    <p className="text-xs text-muted-foreground">Your account is verified as a legitimate manufacturer</p>
                                  </div>
                                  <Badge className="bg-primary text-primary-foreground">Verified</Badge>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="flex justify-end gap-2">
                            <Button variant="outline">Cancel</Button>
                            <Button 
                              onClick={handleSaveProfile} 
                              disabled={isLoading}
                              className="group"
                            >
                              {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                              )}
                              Save Profile
                            </Button>
                          </motion.div>
                        </CardContent>
                      </Card>
                      
                      <motion.div 
                        variants={itemAnimation} 
                        className="mt-6"
                      >
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                              <Share2 className="h-5 w-5 text-primary" />
                              Public Profile
                            </CardTitle>
                            <CardDescription>
                              Manage how your profile appears to potential partners
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="public-profile">Public Profile</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Allow your profile to be discoverable by potential partners
                                  </p>
                                </div>
                                <Switch
                                  id="public-profile"
                                  defaultChecked={true}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="show-capacity">Show Production Capacity</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Display your current capacity to potential partners
                                  </p>
                                </div>
                                <Switch
                                  id="show-capacity"
                                  defaultChecked={true}
                                />
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                  <Label htmlFor="show-certifications">Show Certifications</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Display your certifications on your public profile
                                  </p>
                                </div>
                                <Switch
                                  id="show-certifications"
                                  defaultChecked={true}
                                />
                              </div>
                            </div>
                            
                            <div className="flex items-center p-3 rounded-lg bg-muted/50 gap-3">
                              <FileCheck className="h-10 w-10 text-primary" />
                              <div>
                                <h4 className="font-medium">Complete Profile</h4>
                                <p className="text-sm text-muted-foreground">Your profile is 100% complete and ready to attract partners</p>
                              </div>
                              <Button variant="outline" className="ml-auto">
                                Preview Profile
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </motion.div>
                  </TabsContent>
                </motion.div>
              )}

              {/* General Settings */}
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
                                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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

              {/* Manufacturing Tab */}
              {activeTab === "manufacturing" && (
                <motion.div
                  key="manufacturing"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  <TabsContent value="manufacturing" className="space-y-6">
                    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
                      <Card>
                        <CardHeader>
                          <motion.div variants={itemAnimation}>
                            <CardTitle>Manufacturing Capabilities</CardTitle>
                            <CardDescription>
                              Update information about your production capacity and capabilities
                            </CardDescription>
                          </motion.div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <motion.div variants={itemAnimation} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="productionCapacity">Production Capacity (units/month)</Label>
                              <div className="relative">
                                <Gauge className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="productionCapacity"
                                  type="number"
                                  value={productionCapacity}
                                  onChange={(e) => setProductionCapacity(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="minimumOrderValue">Minimum Order Value ($)</Label>
                              <div className="relative">
                                <CircleDollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                                <Input
                                  id="minimumOrderValue"
                                  type="number"
                                  value={minimumOrderValue}
                                  onChange={(e) => setMinimumOrderValue(e.target.value)}
                                  className="pl-10"
                                />
                              </div>
                            </div>
                            
                            <motion.div variants={itemAnimation} className="space-y-2 md:col-span-2">
                              <Label htmlFor="certifications">Certifications & Compliance</Label>
                              <div className="relative">
                                <CheckCircle className="absolute left-3 top-3 text-muted-foreground h-4 w-4" />
                                <Textarea
                                  id="certifications"
                                  value={certifications}
                                  onChange={(e) => setCertifications(e.target.value)}
                                  className="pl-10"
                                  placeholder="List all certifications (e.g., ISO 9001, HACCP)"
                                  rows={3}
                                />
                              </div>
                            </motion.div>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="space-y-4">
                            <Label>Materials Handled</Label>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {materialsHandled.map((material, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  <Badge 
                                    variant="secondary" 
                                    className="px-3 py-1 gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                                    onClick={() => handleRemoveMaterial(material)}
                                  >
                                    {material}
                                    <span className="ml-1 text-xs">×</span>
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                            
                            <form onSubmit={handleAddMaterial} className="flex gap-2">
                              <Input 
                                placeholder="Add a material..." 
                                value={newMaterial}
                                onChange={(e) => setNewMaterial(e.target.value)}
                                className="max-w-xs"
                              />
                              <Button type="submit" size="sm">Add</Button>
                            </form>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="border rounded-md p-4 bg-muted/30">
                            <h3 className="font-medium mb-2 flex items-center gap-2">
                              <Factory className="h-4 w-4" />
                              Production Specialties
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <div className="flex items-center space-x-2">
                                <Switch id="specialty-food" />
                                <Label htmlFor="specialty-food">Food Production</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="specialty-beverage" defaultChecked />
                                <Label htmlFor="specialty-beverage">Beverage Production</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="specialty-supplements" />
                                <Label htmlFor="specialty-supplements">Supplements</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Switch id="specialty-packaging" />
                                <Label htmlFor="specialty-packaging">Packaging</Label>
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div variants={itemAnimation} className="flex justify-end">
                            <Button 
                              onClick={handleSaveManufacturing} 
                              disabled={isLoading}
                              className="group"
                            >
                              {isLoading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Save className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                              )}
                              Save Manufacturing Details
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
                                <Label htmlFor="matchNotifications" className="flex items-center gap-2">
                                  <Handshake className="h-4 w-4 text-primary" />
                                  Match Notifications
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                  Get notified when you have new potential business matches
                                </p>
                              </div>
                              <Switch
                                id="matchNotifications"
                                checked={matchNotifications}
                                onCheckedChange={setMatchNotifications}
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

              {/* Security Tab */}
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

              {/* Add Activity Tab Content */}
              {activeTab === "activity" && (
                <motion.div
                  key="activity"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={fadeIn}
                >
                  <TabsContent value="activity" className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Account Activity</CardTitle>
                        <CardDescription>
                          Recent changes and activity on your account
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {activityLog.map((activity, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: index * 0.1 }}
                              className="flex justify-between items-center border-b pb-2 last:border-0"
                            >
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <UserCog className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                  <p className="font-medium">{activity.action}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {activity.timestamp}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Documentation & Guides</CardTitle>
                        <CardDescription>
                          Resources to help you use the platform effectively
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div 
                            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">Settings Guide</h3>
                                <p className="text-sm text-muted-foreground">
                                  Learn how to configure your settings effectively
                                </p>
                              </div>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            className="border rounded-lg p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <ShieldAlert className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <h3 className="font-medium">Security Best Practices</h3>
                                <p className="text-sm text-muted-foreground">
                                  Tips to keep your account secure
                                </p>
                              </div>
                            </div>
                          </motion.div>
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
    </ManufacturerLayout>
  );
};

export default Settings;
