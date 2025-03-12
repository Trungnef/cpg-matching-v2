import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Building, Mail, Phone, MapPin, Edit, Settings, Heart, ClipboardList, LogOut, User, Globe, Save, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import ManufacturerProfile from "@/components/profile/ManufacturerProfile";
import BrandProfile from "@/components/profile/BrandProfile";
import RetailerProfile from "@/components/profile/RetailerProfile";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger 
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

// Define form schemas for each role
const baseProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  phone: z.string().optional(),
  website: z.string().optional(),
  address: z.string().optional(),
  description: z.string().optional(),
});

const manufacturerFormSchema = baseProfileSchema.extend({
  productionCapacity: z.coerce.number().min(0, "Capacity must be a positive number"),
  certifications: z.string().optional(),
  minimumOrderValue: z.coerce.number().min(0, "Order value must be a positive number"),
});

const brandFormSchema = baseProfileSchema.extend({
  marketSegments: z.string().optional(),
  brandValues: z.string().optional(),
  targetDemographics: z.string().optional(),
});

const retailerFormSchema = baseProfileSchema.extend({
  storeLocations: z.coerce.number().min(0, "Store locations must be a positive number"),
  averageOrderValue: z.coerce.number().min(0, "Average order value must be a positive number"),
  customerBase: z.string().optional(),
});

// Define form types
type BaseProfileValues = z.infer<typeof baseProfileSchema>;
type ManufacturerFormValues = z.infer<typeof manufacturerFormSchema>;
type BrandFormValues = z.infer<typeof brandFormSchema>;
type RetailerFormValues = z.infer<typeof retailerFormSchema>;
type FormValues = ManufacturerFormValues | BrandFormValues | RetailerFormValues;

const Profile = () => {
  const { role, user, isAuthenticated, logout, updateUserProfile, updateRoleSettings, updateUserAvatar } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set page title and check authentication
  useEffect(() => {
    document.title = "My Profile - CPG Matchmaker";
    
    // If not authenticated, redirect to auth page
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    }
  }, [navigate, isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  // Create initial values based on role
  const getInitialValues = () => {
    if (!user) return {};

    const baseValues = {
      name: user.name || "",
      email: user.email || "",
      companyName: user.companyName || "",
      phone: "",
      website: "",
      address: "",
      description: "",
    };

    if (role === "manufacturer" && user.manufacturerSettings) {
      return {
        ...baseValues,
        productionCapacity: user.manufacturerSettings.productionCapacity || 0,
        certifications: user.manufacturerSettings.certifications?.join(", ") || "",
        minimumOrderValue: user.manufacturerSettings.minimumOrderValue || 0,
      };
    } else if (role === "brand" && user.brandSettings) {
      return {
        ...baseValues,
        marketSegments: user.brandSettings.marketSegments?.join(", ") || "",
        brandValues: user.brandSettings.brandValues?.join(", ") || "",
        targetDemographics: user.brandSettings.targetDemographics?.join(", ") || "",
      };
    } else if (role === "retailer" && user.retailerSettings) {
      return {
        ...baseValues,
        storeLocations: user.retailerSettings.storeLocations || 0,
        averageOrderValue: user.retailerSettings.averageOrderValue || 0,
        customerBase: user.retailerSettings.customerBase?.join(", ") || "",
      };
    }

    return baseValues;
  };

  // Select the appropriate form schema based on role
  const getFormSchema = () => {
    switch (role) {
      case "manufacturer":
        return manufacturerFormSchema;
      case "brand":
        return brandFormSchema;
      case "retailer":
        return retailerFormSchema;
      default:
        return baseProfileSchema;
    }
  };

  // Initialize form
  const form = useForm({
    resolver: zodResolver(getFormSchema()),
    defaultValues: getInitialValues(),
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Update base profile information
      const baseProfile = {
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        profileComplete: true,
      };
      
      // Call updateUserProfile to update base info
      updateUserProfile(baseProfile);
      
      // Process and update role-specific settings
      if (role === "manufacturer" && 'productionCapacity' in data) {
        const manufacturerSettings = {
          productionCapacity: data.productionCapacity || 0,
          certifications: data.certifications ? data.certifications.split(",").map((item: string) => item.trim()) : [],
          minimumOrderValue: data.minimumOrderValue || 0,
          // Preserve existing values for fields not in the form
          preferredCategories: user?.manufacturerSettings?.preferredCategories || [],
        };
        
        updateRoleSettings(manufacturerSettings);
      } else if (role === "brand" && 'marketSegments' in data) {
        const brandSettings = {
          marketSegments: data.marketSegments ? data.marketSegments.split(",").map((item: string) => item.trim()) : [],
          brandValues: data.brandValues ? data.brandValues.split(",").map((item: string) => item.trim()) : [],
          targetDemographics: data.targetDemographics ? data.targetDemographics.split(",").map((item: string) => item.trim()) : [],
          // Preserve existing values for fields not in the form
          productCategories: user?.brandSettings?.productCategories || [],
        };
        
        updateRoleSettings(brandSettings);
      } else if (role === "retailer" && 'storeLocations' in data) {
        const retailerSettings = {
          storeLocations: data.storeLocations || 0,
          averageOrderValue: data.averageOrderValue || 0,
          customerBase: data.customerBase ? data.customerBase.split(",").map((item: string) => item.trim()) : [],
          // Preserve existing values for fields not in the form
          preferredCategories: user?.retailerSettings?.preferredCategories || [],
        };
        
        updateRoleSettings(retailerSettings);
      }
      
      // Show success toast
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      
      // Exit edit mode
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "There was an error updating your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render appropriate role-specific fields based on user role
  const renderRoleSpecificFields = () => {
    switch (role) {
      case "manufacturer":
        return (
          <>
            <h3 className="text-lg font-medium mt-8 mb-4">Manufacturer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="productionCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Production Capacity (units/month)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="minimumOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Order Value ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="certifications"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Certifications</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter certifications separated by commas (e.g. ISO 9001, Organic, HACCP)" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter all your certifications, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "brand":
        return (
          <>
            <h3 className="text-lg font-medium mt-8 mb-4">Brand Details</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="marketSegments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Market Segments</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter market segments separated by commas (e.g. Health-conscious, Eco-friendly, Premium)" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your target market segments, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brandValues"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Values</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter brand values separated by commas (e.g. Sustainability, Quality, Innovation)" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your core brand values, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetDemographics"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Demographics</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter target demographics separated by commas (e.g. Millennials, Gen Z, Health enthusiasts)" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Enter your target demographic groups, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      case "retailer":
        return (
          <>
            <h3 className="text-lg font-medium mt-8 mb-4">Retailer Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="storeLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Store Locations</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="averageOrderValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Average Order Value ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-4">
              <FormField
                control={form.control}
                name="customerBase"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer Base</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter customer segments separated by commas (e.g. Urban professionals, Families, Health enthusiasts)" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Describe your main customer segments, separated by commas
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Function to render the edit profile form
  const renderEditProfileForm = () => {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal and business information
            </CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsEditing(false)}
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} placeholder="https://example.com" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input className="pl-10" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your company..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Separator className="my-6" />

              {/* Role-specific fields rendered based on user role */}
              {renderRoleSpecificFields()}

              <div className="flex justify-end mt-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="mr-4"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  };

  // Function to render the correct profile content based on user role
  const renderRoleSpecificContent = () => {
    switch(role) {
      case "manufacturer":
        return <ManufacturerProfile />;
      case "brand":
        return <BrandProfile />;
      case "retailer":
        return <RetailerProfile />;
      default:
        return <div>Please select a role</div>;
    }
  };

  if (!isAuthenticated) {
    // Return empty div while redirecting
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-20 pb-6 px-4 md:px-6 lg:pt-24 lg:pb-10">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 group cursor-pointer">
                    <label htmlFor="avatar-upload" className="cursor-pointer block">
                      <Avatar className="h-24 w-24 border-4 border-background">
                        <AvatarImage 
                          src={user?.avatar || ""} 
                          alt={user?.name || "User"} 
                        />
                        <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                    </label>
                    <Input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            if (e.target?.result) {
                              updateUserAvatar(e.target.result as string);
                              toast({
                                title: "Avatar Updated",
                                description: "Your profile picture has been updated successfully.",
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <CardTitle>{user?.name || "Demo User"}</CardTitle>
                  <Badge className="mt-2 capitalize font-medium px-3 py-1 text-sm" variant="secondary">
                    {user?.role === "manufacturer" ? "Manufacturer" : 
                     user?.role === "brand" ? "Brand" : 
                     user?.role === "retailer" ? "Retailer" : "Role"}
                  </Badge>
                  <div className="flex items-center mt-3">
                    <span className={`h-2.5 w-2.5 rounded-full mr-2 
                      ${user?.status === "online" ? "bg-green-500" : 
                        user?.status === "away" ? "bg-yellow-500" : 
                        "bg-red-500"}`} 
                    />
                    <span className="text-sm text-muted-foreground">
                      {user?.status === "online" ? "Online" : 
                        user?.status === "away" ? "Away" : 
                        "Busy"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building className="w-4 h-4 mr-2" />
                    {user?.companyName || "Company Name"}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="w-4 h-4 mr-2" />
                    {user?.email || "user@example.com"}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Phone className="w-4 h-4 mr-2" />
                    +1 (555) 123-4567
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    San Francisco, CA
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button 
                    variant="destructive" 
                    className="justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Log Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="lg:col-span-3">
            {isEditing ? (
              // Show edit form when editing is true
              renderEditProfileForm()
            ) : (
              // Otherwise show normal profile content
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab - Role-specific content */}
                <TabsContent value="overview" className="space-y-6">
                  {renderRoleSpecificContent()}
                </TabsContent>
                
                {/* Favorites Tab */}
                <TabsContent value="favorites">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Favorites</CardTitle>
                      <CardDescription>
                        View and manage your saved products, manufacturers, and retailers.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Heart className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          When you find products or manufacturers you're interested in, save them here for quick access.
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button variant="outline">Explore Products</Button>
                          <Button>Find Manufacturers</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Projects Tab */}
                <TabsContent value="projects">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Projects</CardTitle>
                      <CardDescription>
                        Track and manage your registered projects and product requests.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          Start by creating a new project to find matching manufacturers or suppliers for your product needs.
                        </p>
                        <Button>Create New Project</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
