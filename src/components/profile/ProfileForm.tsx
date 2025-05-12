import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "@/contexts/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
  User,
  Mail,
  Building,
  Phone,
  Globe,
  MapPin,
  Save,
  X
} from "lucide-react";
import { useTranslation } from "react-i18next";

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

// Custom augmented profile partial type that includes our additional fields
interface ProfileUpdateData {
  name: string;
  email: string;
  companyName: string;
  phone?: string;
  website?: string;
  address?: string;
  description?: string;
  profileComplete: boolean;
}

interface ProfileFormProps {
  onCancel: () => void;
}

const ProfileForm = ({ onCancel }: ProfileFormProps) => {
  const { role, user, updateUserProfile, updateRoleSettings } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useTranslation();
  
  // Create initial values based on role
  const getInitialValues = () => {
    if (!user) return {};

    const baseValues = {
      name: user.name || "",
      email: user.email || "",
      companyName: user.companyName || "",
      phone: user.phone || "",
      website: user.website || "",
      address: user.address || "",
      description: user.description || "",
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

  // Initialize form with the appropriate schema based on role
  const form = useForm<FormValues>({
    resolver: zodResolver(getFormSchema()),
    defaultValues: getInitialValues() as FormValues,
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Update base profile information
      const baseProfile: ProfileUpdateData = {
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        phone: data.phone,
        website: data.website,
        address: data.address,
        description: data.description,
        profileComplete: true,
      };
      
      // Call updateUserProfile to update base info
      updateUserProfile(baseProfile);
      
      // Process and update role-specific settings
      if (role === "manufacturer" && 'productionCapacity' in data) {
        const manufacturerData = data as ManufacturerFormValues;
        const manufacturerSettings = {
          productionCapacity: manufacturerData.productionCapacity || 0,
          certifications: manufacturerData.certifications ? manufacturerData.certifications.split(",").map(item => item.trim()) : [],
          minimumOrderValue: manufacturerData.minimumOrderValue || 0,
          // Preserve existing values for fields not in the form
          preferredCategories: user?.manufacturerSettings?.preferredCategories || [],
        };
        
        updateRoleSettings(manufacturerSettings);
      } else if (role === "brand" && 'marketSegments' in data) {
        const brandData = data as BrandFormValues;
        const brandSettings = {
          marketSegments: brandData.marketSegments ? brandData.marketSegments.split(",").map(item => item.trim()) : [],
          brandValues: brandData.brandValues ? brandData.brandValues.split(",").map(item => item.trim()) : [],
          targetDemographics: brandData.targetDemographics ? brandData.targetDemographics.split(",").map(item => item.trim()) : [],
          // Preserve existing values for fields not in the form
          productCategories: user?.brandSettings?.productCategories || [],
        };
        
        updateRoleSettings(brandSettings);
      } else if (role === "retailer" && 'storeLocations' in data) {
        const retailerData = data as RetailerFormValues;
        const retailerSettings = {
          storeLocations: retailerData.storeLocations || 0,
          averageOrderValue: retailerData.averageOrderValue || 0,
          customerBase: retailerData.customerBase ? retailerData.customerBase.split(",").map(item => item.trim()) : [],
          // Preserve existing values for fields not in the form
          preferredCategories: user?.retailerSettings?.preferredCategories || [],
        };
        
        updateRoleSettings(retailerSettings);
      }
      
      // Show success toast
      toast({
        title: t("profile-updated"),
        description: t("profile-updated-message"),
      });
      
      // Exit edit mode
      onCancel();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: t("update-failed"),
        description: t("update-failed-message"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create render functions for the fields with proper typing
  const renderBaseFields = () => {
    return (
      <>
        <h3 className="text-lg font-medium">{t("basic-information")}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
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
                <FormLabel>{t("email")}</FormLabel>
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
                <FormLabel>{t("company-name")}</FormLabel>
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
                <FormLabel>{t("phone")}</FormLabel>
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
                <FormLabel>{t("website")}</FormLabel>
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
                <FormLabel>{t("address")}</FormLabel>
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
              <FormLabel>{t("company-description")}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t("company-description-placeholder")}
                  className="min-h-[120px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </>
    );
  };

  // Render appropriate role-specific fields based on user role
  const renderRoleSpecificFields = () => {
    switch (role) {
      case "manufacturer":
        return (
          <>
            <h3 className="text-lg font-medium mt-8 mb-4">{t("manufacturer-details")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="productionCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("production-capacity")}</FormLabel>
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
                    <FormLabel>{t("minimum-order-value")}</FormLabel>
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
                    <FormLabel>{t("certifications")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("certifications-placeholder")}
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t("certifications-description")}
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
            <h3 className="text-lg font-medium mt-8 mb-4">{t("brand-details")}</h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="marketSegments"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("market-segments")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("market-segments-placeholder")}
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t("market-segments-description")}
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
                    <FormLabel>{t("brand-values")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("brand-values-placeholder")}
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t("brand-values-description")}
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
                    <FormLabel>{t("target-demographics")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("target-demographics-placeholder")}
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t("target-demographics-description")}
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
            <h3 className="text-lg font-medium mt-8 mb-4">{t("retailer-details")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="storeLocations"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("store-locations")}</FormLabel>
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
                    <FormLabel>{t("average-order-value")}</FormLabel>
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
                    <FormLabel>{t("customer-base")}</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder={t("customer-base-placeholder")}
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      {t("customer-base-description")}
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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("edit-profile")}</CardTitle>
          <CardDescription>
            {t("edit-profile-description")}
          </CardDescription>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onCancel}
        >
          <X className="w-5 h-5" />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {renderBaseFields()}
            <Separator className="my-6" />
            {renderRoleSpecificFields()}

            <div className="flex justify-end mt-8">
              <Button 
                type="button" 
                variant="outline" 
                className="mr-4"
                onClick={onCancel}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  t("saving")
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t("save-changes")}
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

export default ProfileForm; 