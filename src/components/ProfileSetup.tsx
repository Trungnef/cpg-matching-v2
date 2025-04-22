import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Factory, 
  ShoppingBag, 
  Store, 
  Building2, 
  Phone, 
  MapPin, 
  Award, 
  Link2, 
  FileText,
  CheckCircle2,
  HelpCircle,
  AlertCircle,
  Users,
  Heart,
  Search,
  Star
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Checkbox } from "@/components/ui/checkbox";

// Define account types
const accountTypes = ['manufacturer', 'brand', 'retailer'] as const;
type AccountType = typeof accountTypes[number];

// Base form schema with better error messages
const baseFormSchema = z.object({
  accountType: z.enum(accountTypes, {
    errorMap: () => ({ message: "Please select an account type" }),
  }),
  companyName: z.string().min(2, { 
    message: "Company name must be at least 2 characters" 
  }).max(100, {
    message: "Company name cannot exceed 100 characters"
  }),
  industry: z.string().min(1, { 
    message: "Please select an industry" 
  }),
  phoneNumber: z.string().min(5, { 
    message: "Please enter a valid phone number" 
  }).max(20, {
    message: "Phone number is too long"
  }),
  address: z.string().min(5, { 
    message: "Please enter a complete address" 
  }),
  websiteUrl: z.string().url({ message: "Please enter a valid URL (e.g., https://example.com)" }).optional().or(z.string().length(0)),
  certificates: z.string().optional(),
  companyDescription: z.string().min(10, { 
    message: "Description must be at least 10 characters" 
  }).max(1000, {
    message: "Description cannot exceed 1000 characters"
  }),
});

// Connection preferences schema with better error messages
const connectionPreferencesSchema = z.object({
  connectWith: z.array(z.string()).min(1, { 
    message: "Please select at least one connection type" 
  }),
  industryInterests: z.array(z.string()).min(1, { 
    message: "Please select at least one industry of interest" 
  }),
  interests: z.array(z.string()).min(1, { 
    message: "Please select at least one interest" 
  }),
  lookingFor: z.array(z.string()).min(1, { 
    message: "Please select at least one role you're looking for" 
  }),
});

// Combined schema
const profileSetupSchema = baseFormSchema.merge(connectionPreferencesSchema);

type ProfileSetupFormValues = z.infer<typeof profileSetupSchema>;

const ProfileSetup = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'account-type' | 'details' | 'connections' | 'complete'>('account-type');
  const [selectedAccountType, setSelectedAccountType] = useState<AccountType | null>(null);
  const { toast } = useToast();
  const { updateProfile, user } = useUser();
  const navigate = useNavigate();

  // Define form
  const form = useForm<ProfileSetupFormValues>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      accountType: 'manufacturer',
      companyName: '',
      industry: '',
      phoneNumber: '',
      address: '',
      websiteUrl: '',
      certificates: '',
      companyDescription: '',
      connectWith: [],
      industryInterests: [],
      interests: [],
      lookingFor: [],
    },
  });

  // Handle account type selection
  const handleAccountTypeSelect = (type: AccountType) => {
    setSelectedAccountType(type);
    form.setValue('accountType', type);
  };

  // Move to details step with improved validation feedback
  const goToDetailsStep = () => {
    if (!selectedAccountType) {
      toast({
        title: "Selection Required",
        description: "Please select an account type to continue.",
        variant: "destructive",
      });
      return;
    }
    setCurrentStep('details');
  };

  // Move to connections step with improved validation
  const goToConnectionsStep = () => {
    // Validate the current step's fields based on account type
    const commonFields = ['companyName', 'industry', 'phoneNumber', 'address', 'companyDescription'];
    
    // Extra fields to validate for specific account types
    const extraFields: Record<AccountType, string[]> = {
      manufacturer: ['certificates'],
      brand: [],
      retailer: []
    };
    
    const accountType = selectedAccountType || form.getValues('accountType');
    const fieldsToValidate = accountType ? [...commonFields, ...extraFields[accountType]] : commonFields;
    
    // Trigger validation for all required fields
    form.trigger(fieldsToValidate as any).then(isValid => {
      if (isValid) {
        setCurrentStep('connections');
      } else {
        // Show a toast with error message
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly before continuing.",
          variant: "destructive",
        });
        
        // Focus on the first field with an error
        const firstErrorField = fieldsToValidate.find(field => 
          form.getFieldState(field as any).error
        );
        if (firstErrorField) {
          // Try to focus the field (this may not work for all field types)
          const element = document.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
          if (element) {
            element.focus();
          }
        }
      }
    });
  };

  // Form submission handler with improved error handling
  const onSubmit = async (data: ProfileSetupFormValues) => {
    setIsLoading(true);
    
    try {
      // Ensure we have the account type from the form data if not in state
      if (!selectedAccountType && data.accountType) {
        setSelectedAccountType(data.accountType);
      }

      const accountType = selectedAccountType || data.accountType;
      
      // Update user profile
      await updateProfile({
        ...data,
        profileComplete: true,
      });
      
      toast({
        title: "Profile Setup Complete",
        description: "Your profile has been set up successfully.",
      });
      
      setCurrentStep('complete');
      
      // Redirect to dashboard after a delay
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    } catch (error) {
      console.error("Profile setup error:", error);
      toast({
        title: "Setup Failed",
        description: error instanceof Error 
          ? `Error: ${error.message}` 
          : "There was a problem setting up your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Render account type selection
  const renderAccountTypeStep = () => (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">{t("select-account-type", "Select Your Account Type")}</h2>
        <p className="text-muted-foreground mt-2">
          {t("account-type-description", "Choose the type that best describes your business")}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Manufacturer Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Card 
            className={`cursor-pointer border-2 transition-all h-full ${
              selectedAccountType === 'manufacturer' 
                ? cn('border-primary', isDark ? 'bg-primary/5' : 'bg-primary/3') 
                : cn('hover:border-primary/50', isDark ? '' : 'bg-white hover:bg-slate-50')
            }`}
            onClick={() => handleAccountTypeSelect('manufacturer')}
          >
            <CardHeader className="pb-2 pt-6 relative">
              {selectedAccountType === 'manufacturer' && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                >
                  {t("selected", "Selected")}
                </motion.div>
              )}
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Factory className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">{t("manufacturer", "Manufacturer")}</CardTitle>
              <CardDescription className="text-sm">
                {t("manufacturer-desc", "Companies that produce CPG products")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <div>
                <div className="text-foreground font-medium mb-2">{t("perfect-for", "Perfect for:")}</div>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>{t("manufacturer-perfect-1", "Production facilities with available capacity")}</li>
                  <li>{t("manufacturer-perfect-2", "Companies looking for brand partnerships")}</li>
                  <li>{t("manufacturer-perfect-3", "Private label manufacturers")}</li>
                </ul>
              </div>
              
              <div>
                <div className="text-foreground font-medium mb-2">{t("key-features", "Key features:")}</div>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>{t("manufacturer-feature-1", "Access to brand partnerships")}</li>
                  <li>{t("manufacturer-feature-2", "Product showcase capabilities")}</li>
                  <li>{t("manufacturer-feature-3", "Production capacity sharing")}</li>
                </ul>
              </div>
              
              {selectedAccountType === 'manufacturer' && (
                <div className="mt-3 flex justify-end">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Brand Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Card 
            className={`cursor-pointer border-2 transition-all h-full ${
              selectedAccountType === 'brand' 
                ? cn('border-primary', isDark ? 'bg-primary/5' : 'bg-primary/3') 
                : cn('hover:border-primary/50', isDark ? '' : 'bg-white hover:bg-slate-50')
            }`}
            onClick={() => handleAccountTypeSelect('brand')}
          >
            <CardHeader className="pb-2 pt-6 relative">
              {selectedAccountType === 'brand' && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                >
                  {t("selected", "Selected")}
                </motion.div>
              )}
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <ShoppingBag className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">{t("brand", "Brand")}</CardTitle>
              <CardDescription className="text-sm">
                {t("brand-desc", "Companies that market and sell CPG products")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <div>
                <div className="text-foreground font-medium mb-2">{t("perfect-for", "Perfect for:")}</div>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>{t("brand-perfect-1", "Established brands looking for manufacturers")}</li>
                  <li>{t("brand-perfect-2", "Startup brands seeking production partners")}</li>
                  <li>{t("brand-perfect-3", "Companies expanding product lines")}</li>
                </ul>
              </div>
              
              <div>
                <div className="text-foreground font-medium mb-2">{t("key-features", "Key features:")}</div>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>{t("brand-feature-1", "Find manufacturing partners")}</li>
                  <li>{t("brand-feature-2", "Connect with retailers")}</li>
                  <li>{t("brand-feature-3", "Market research tools")}</li>
                </ul>
              </div>
              
              {selectedAccountType === 'brand' && (
                <div className="mt-3 flex justify-end">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Retailer Card */}
        <motion.div
          whileHover={{ scale: 1.02, y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          <Card 
            className={`cursor-pointer border-2 transition-all h-full ${
              selectedAccountType === 'retailer' 
                ? cn('border-primary', isDark ? 'bg-primary/5' : 'bg-primary/3') 
                : cn('hover:border-primary/50', isDark ? '' : 'bg-white hover:bg-slate-50')
            }`}
            onClick={() => handleAccountTypeSelect('retailer')}
          >
            <CardHeader className="pb-2 pt-6 relative">
              {selectedAccountType === 'retailer' && (
                <motion.div 
                  className="absolute -top-2 -right-2 bg-primary text-white text-xs px-2 py-1 rounded-full"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 10 }}
                >
                  {t("selected", "Selected")}
                </motion.div>
              )}
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Store className="w-7 h-7 text-primary" />
              </div>
              <CardTitle className="text-xl">{t("retailer", "Retailer")}</CardTitle>
              <CardDescription className="text-sm">
                {t("retailer-desc", "Businesses that sell to end consumers")}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-4">
              <div>
                <div className="text-foreground font-medium mb-2">{t("perfect-for", "Perfect for:")}</div>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>{t("retailer-perfect-1", "Department stores and specialty shops")}</li>
                  <li>{t("retailer-perfect-2", "Online marketplaces seeking brands")}</li>
                  <li>{t("retailer-perfect-3", "Boutique retailers with curated selections")}</li>
                </ul>
              </div>
              
              <div>
                <div className="text-foreground font-medium mb-2">{t("key-features", "Key features:")}</div>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>{t("retailer-feature-1", "Source unique products")}</li>
                  <li>{t("retailer-feature-2", "Connect with brands directly")}</li>
                  <li>{t("retailer-feature-3", "Market trend insights")}</li>
                </ul>
              </div>
              
              {selectedAccountType === 'retailer' && (
                <div className="mt-3 flex justify-end">
                  <CheckCircle2 className="text-primary w-5 h-5" />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button 
          onClick={goToDetailsStep} 
          size="lg" 
          className={cn(
            "w-full max-w-xs py-6 text-base",
            isDark ? "" : "shadow-sm"
          )}
          disabled={!selectedAccountType}
        >
          {t("continue", "Continue")}
        </Button>
      </div>
    </motion.div>
  );

  // Render company details form
  const renderDetailsStep = () => {
    // Get field validation state for visual feedback with improved colors
    const getFieldState = (fieldName: string) => {
      const fieldState = form.getFieldState(fieldName as any);
      if (fieldState.invalid && fieldState.isDirty) return "error";
      if (!fieldState.invalid && fieldState.isDirty) return "success";
      return "default";
    };

    // Get validation status class with better theme support
    const getValidationClass = (status: string) => {
      if (status === 'error') {
        return cn(
          'border-destructive focus-visible:ring-destructive',
          isDark ? 'bg-destructive/5' : 'bg-red-50'
        );
      }
      if (status === 'success') {
        return cn(
          'border-green-500 focus-visible:ring-green-500',
          isDark ? 'bg-green-500/5' : 'bg-green-50'
        );
      }
      return '';
    };

    const accountType = selectedAccountType || form.getValues('accountType');

    // Get role-specific labels and placeholders
    const getRoleSpecificContent = () => {
      switch(accountType) {
        case 'manufacturer':
          return {
            titleSuffix: t("manufacturer-title-suffix", "Manufacturing Facility"),
            descriptionPlaceholder: t("manufacturer-description-placeholder", "Describe your manufacturing capabilities, products you produce, production capacity, etc..."),
            showCertificates: true,
            certificatesLabel: t("certificates-manufacturer", "Certifications & Standards"),
            certificatesDescription: t("certificates-manufacturer-desc", "GMP, ISO, Quality certifications that your facility holds"),
            certificatesPlaceholder: t("certificates-manufacturer-placeholder", "ISO 9001, GMP, Organic, HACCP, etc.")
          };
        case 'brand':
          return {
            titleSuffix: t("brand-title-suffix", "Brand"),
            descriptionPlaceholder: t("brand-description-placeholder", "Describe your brand, products, target audience, and what makes your brand unique..."),
            showCertificates: true,
            certificatesLabel: t("certificates-brand", "Product Certifications"),
            certificatesDescription: t("certificates-brand-desc", "Any certifications your products have received"),
            certificatesPlaceholder: t("certificates-brand-placeholder", "Organic, Vegan, Cruelty-free, etc.")
          };
        case 'retailer':
          return {
            titleSuffix: t("retailer-title-suffix", "Retail Business"),
            descriptionPlaceholder: t("retailer-description-placeholder", "Describe your retail business, locations, customers, and the types of products you sell..."),
            showCertificates: false,
            certificatesLabel: "",
            certificatesDescription: "",
            certificatesPlaceholder: ""
          };
        default:
          return {
            titleSuffix: "",
            descriptionPlaceholder: t("company-description-placeholder", "Describe your company, products, and services..."),
            showCertificates: true,
            certificatesLabel: t("certificates", "Certificates (Optional)"),
            certificatesDescription: t("certificates-description", "List any certifications or standards your company complies with"),
            certificatesPlaceholder: t("certificates-placeholder", "ISO 9001, GMP, etc.")
          };
      }
    };

    const roleContent = getRoleSpecificContent();

    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">
            {t("company-details", "Company Details")}
            {roleContent.titleSuffix && ` - ${roleContent.titleSuffix}`}
          </h2>
          <p className="text-muted-foreground mt-2">
            {t("provide-company-info", "Provide information about your company")}
          </p>
        </div>

        <Card className={cn(
          "border p-6",
          isDark ? "border-muted" : "border-slate-200 bg-white"
        )}>
          <CardContent className="p-0 space-y-8">
            {/* Company Name */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-base">{t("company-name", "Company Name")}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t("company-name-tooltip", "Enter the official registered name of your company")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("company-name-description", "This will appear on your profile and in search results")}
                </p>
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder={t("company-name-placeholder", "Enter your company name")} 
                            {...field} 
                            className={getValidationClass(getFieldState('companyName'))}
                          />
                          {getFieldState('companyName') === 'error' && (
                            <div className={cn(
                              "absolute right-3 top-1/2 -translate-y-1/2 flex items-center",
                              isDark ? "text-destructive" : "text-red-600"
                            )}>
                              <AlertCircle className="w-5 h-5" />
                            </div>
                          )}
                          {getFieldState('companyName') === 'success' && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className={cn(
                        isDark ? "text-destructive" : "text-red-600 font-medium"
                      )} />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Industry */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Factory className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-base">{t("industry", "Industry")}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t("industry-tooltip", "Select the industry that best describes your business")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("industry-description", "The primary sector your company operates in")}
                </p>
                <FormField
                  control={form.control}
                  name="industry"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <SelectTrigger 
                            className={`${
                              getFieldState('industry') === 'error' ? 'border-destructive focus-visible:ring-destructive' : 
                              getFieldState('industry') === 'success' ? 'border-green-500 focus-visible:ring-green-500' : ''
                            }`}
                          >
                            <SelectValue placeholder={t("select-industry", "Select an industry")} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="food-beverage">{t("food-beverage", "Food & Beverage")}</SelectItem>
                            <SelectItem value="personal-care">{t("personal-care", "Personal Care & Beauty")}</SelectItem>
                            <SelectItem value="household">{t("household", "Household Products")}</SelectItem>
                            <SelectItem value="health-wellness">{t("health-wellness", "Health & Wellness")}</SelectItem>
                            <SelectItem value="electronics">{t("electronics", "Electronics & Appliances")}</SelectItem>
                            <SelectItem value="fashion-apparel">{t("fashion-apparel", "Fashion & Apparel")}</SelectItem>
                            <SelectItem value="other">{t("other", "Other")}</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-base">{t("phone-number", "Phone Number")}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t("phone-tooltip", "Include country code for international communications")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("phone-description", "Business phone number where potential partners can reach you")}
                </p>
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder={t("phone-number-placeholder", "+1 (555) 123-4567")} 
                            {...field} 
                            className={getValidationClass(getFieldState('phoneNumber'))}
                          />
                          {getFieldState('phoneNumber') === 'error' && (
                            <div className={cn(
                              "absolute right-3 top-1/2 -translate-y-1/2 flex items-center",
                              isDark ? "text-destructive" : "text-red-600"
                            )}>
                              <AlertCircle className="w-5 h-5" />
                            </div>
                          )}
                          {getFieldState('phoneNumber') === 'success' && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className={cn(
                        isDark ? "text-destructive" : "text-red-600 font-medium"
                      )} />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-base">{t("address", "Address")}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t("address-tooltip", "Provide your business address or headquarters location")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("address-description", "Your company's primary business location")}
                </p>
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <div className="relative">
                          <Input 
                            placeholder={t("address-placeholder", "123 Business St, City, Country")} 
                            {...field} 
                            className={getValidationClass(getFieldState('address'))}
                          />
                          {getFieldState('address') === 'error' && (
                            <div className={cn(
                              "absolute right-3 top-1/2 -translate-y-1/2 flex items-center",
                              isDark ? "text-destructive" : "text-red-600"
                            )}>
                              <AlertCircle className="w-5 h-5" />
                            </div>
                          )}
                          {getFieldState('address') === 'success' && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className={cn(
                        isDark ? "text-destructive" : "text-red-600 font-medium"
                      )} />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Certificates - conditionally shown based on account type */}
            {roleContent.showCertificates && (
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-base">{roleContent.certificatesLabel}</h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">{t("certificates-tooltip", "Include any quality, safety or industry certifications your company holds")}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {roleContent.certificatesDescription}
                  </p>
                  <FormField
                    control={form.control}
                    name="certificates"
                    render={({ field }) => (
                      <FormItem className="mt-2">
                        <FormControl>
                          <Input 
                            placeholder={roleContent.certificatesPlaceholder} 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {/* Website URL */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Link2 className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-base">{t("website", "Website URL (Optional)")}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t("website-tooltip", "Include the full URL with http:// or https://")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("website-description", "Your company's official website address")}
                </p>
                <FormField
                  control={form.control}
                  name="websiteUrl"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <Input 
                          placeholder={t("website-placeholder", "https://yourcompany.com")} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Company Description */}
            <div className="flex flex-col md:flex-row gap-4 items-start">
              <div className="md:w-16 flex-shrink-0 flex justify-center md:justify-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-base">{t("company-description", "Company Description")}</h3>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="w-4 h-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">{t("description-tooltip", "Highlight your key products, services, and what makes your company unique")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-muted-foreground">
                  {t("description-description", "Give potential partners an overview of your business")}
                </p>
                <FormField
                  control={form.control}
                  name="companyDescription"
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl>
                        <div className="relative">
                          <Textarea 
                            placeholder={roleContent.descriptionPlaceholder} 
                            {...field}
                            className={`min-h-[120px] ${getValidationClass(getFieldState('companyDescription'))}`}
                          />
                          {getFieldState('companyDescription') === 'error' && (
                            <div className={cn(
                              "absolute right-3 top-3 flex items-center",
                              isDark ? "text-destructive" : "text-red-600"
                            )}>
                              <AlertCircle className="w-5 h-5" />
                            </div>
                          )}
                          {getFieldState('companyDescription') === 'success' && (
                            <div className="absolute right-3 top-3 text-green-500">
                              <CheckCircle2 className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage className={cn(
                        isDark ? "text-destructive" : "text-red-600 font-medium"
                      )} />
                      <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                        <span>{t("min-characters", "Minimum 10 characters")}</span>
                        <span>{field.value?.length || 0} {t("characters", "characters")}</span>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-10">
          <Button 
            onClick={() => setCurrentStep('account-type')} 
            variant="outline"
            size="lg" 
            className={cn("px-6", isDark ? "" : "bg-white hover:bg-slate-50")}
          >
            {t("back", "Back")}
          </Button>
          <Button 
            onClick={goToConnectionsStep} 
            size="lg" 
            className="px-8"
          >
            {t("continue", "Continue")}
          </Button>
        </div>
      </motion.div>
    );
  };

  // Render connection preferences
  const renderConnectionsStep = () => {
    const accountType = selectedAccountType || form.getValues('accountType');

    // Define role-specific options
    const getConnectOptions = () => {
      const commonOptions = [
        { value: 'partners', label: t('partners', 'Partners'), description: t('partners-desc', 'Build strategic relationships with other businesses') },
      ];

      switch(accountType) {
        case 'manufacturer':
          return [
            ...commonOptions,
            { value: 'brands', label: t('brands', 'Brands'), description: t('brands-desc-manufacturer', 'Connect with brands needing manufacturing services') },
            { value: 'suppliers', label: t('suppliers', 'Suppliers'), description: t('suppliers-desc-manufacturer', 'Source raw materials and components') },
            { value: 'distributors', label: t('distributors', 'Distributors'), description: t('distributors-desc-manufacturer', 'Find distribution partners for your products') },
          ];
        case 'brand':
          return [
            ...commonOptions,
            { value: 'manufacturers', label: t('manufacturers', 'Manufacturers'), description: t('manufacturers-desc-brand', 'Find production facilities for your products') },
            { value: 'retailers', label: t('retailers', 'Retailers'), description: t('retailers-desc-brand', 'Connect with stores to sell your products') },
            { value: 'suppliers', label: t('suppliers', 'Suppliers'), description: t('suppliers-desc-brand', 'Source ingredients and packaging materials') },
          ];
        case 'retailer':
          return [
            ...commonOptions,
            { value: 'brands', label: t('brands', 'Brands'), description: t('brands-desc-retailer', 'Discover new brands to stock in your store') },
            { value: 'distributors', label: t('distributors', 'Distributors'), description: t('distributors-desc-retailer', 'Connect with product distributors') },
            { value: 'customers', label: t('customers', 'Customers'), description: t('customers-desc-retailer', 'Reach out to potential customers') },
          ];
        default:
          return [
            ...commonOptions,
            { value: 'customers', label: t('customers', 'Customers'), description: t('customers-desc', 'Find businesses that will buy your products') },
            { value: 'suppliers', label: t('suppliers', 'Suppliers'), description: t('suppliers-desc', 'Connect with companies that can provide materials') },
            { value: 'distributors', label: t('distributors', 'Distributors'), description: t('distributors-desc', 'Find companies to distribute your products') },
          ];
      }
    };

    const getIndustryOptions = () => {
      // Common industry options for all account types
      return [
        { value: 'food', label: t('food', 'Food & Beverage'), description: t('food-desc', 'Food products, beverages, and ingredients') },
        { value: 'beauty', label: t('beauty', 'Beauty & Personal Care'), description: t('beauty-desc', 'Skincare, cosmetics, and personal hygiene') },
        { value: 'health', label: t('health', 'Health & Wellness'), description: t('health-desc', 'Supplements, vitamins, and wellness products') },
        { value: 'household', label: t('household', 'Household Products'), description: t('household-desc', 'Cleaning supplies, home goods, and essentials') }
      ];
    };

    const getInterestOptions = () => {
      const commonOptions = [
        { value: 'sustainability', label: t('sustainability', 'Sustainability'), description: t('sustainability-desc', 'Eco-friendly and sustainable practices') },
        { value: 'innovation', label: t('innovation', 'Innovation'), description: t('innovation-desc', 'New technologies and innovative solutions') },
      ];

      switch(accountType) {
        case 'manufacturer':
          return [
            ...commonOptions,
            { value: 'capacity', label: t('capacity', 'Production Capacity'), description: t('capacity-desc', 'Optimize and expand production capabilities') },
            { value: 'efficiency', label: t('efficiency', 'Efficiency'), description: t('efficiency-desc', 'Improve production processes and reduce costs') },
            { value: 'quality', label: t('quality', 'Quality Control'), description: t('quality-desc', 'Enhance product quality and consistency') },
          ];
        case 'brand':
          return [
            ...commonOptions,
            { value: 'organic', label: t('organic', 'Organic Products'), description: t('organic-desc', 'Certified organic products and materials') },
            { value: 'luxury', label: t('luxury', 'Luxury Products'), description: t('luxury-desc', 'High-end and premium market segment') },
            { value: 'marketing', label: t('marketing', 'Marketing'), description: t('marketing-desc', 'Brand awareness and promotion strategies') },
          ];
        case 'retailer':
          return [
            ...commonOptions,
            { value: 'local', label: t('local', 'Local Products'), description: t('local-desc', 'Locally sourced and produced items') },
            { value: 'exclusive', label: t('exclusive', 'Exclusive Products'), description: t('exclusive-desc', 'Unique items not widely available') },
            { value: 'customer-experience', label: t('customer-experience', 'Customer Experience'), description: t('customer-experience-desc', 'Enhance the shopping experience') },
          ];
        default:
          return [
            ...commonOptions,
            { value: 'organic', label: t('organic', 'Organic Products'), description: t('organic-desc', 'Certified organic products and materials') },
            { value: 'luxury', label: t('luxury', 'Luxury Products'), description: t('luxury-desc', 'High-end and premium market segment') },
          ];
      }
    };

    const getRoleOptions = () => {
      switch(accountType) {
        case 'manufacturer':
          return [
            { value: 'brand', label: t('brand', 'Brand'), description: t('brand-desc-for-manufacturer', 'Companies looking for manufacturing partners') },
            { value: 'co-packer', label: t('co-packer', 'Co-Packer'), description: t('co-packer-desc', 'Contract packaging services') },
            { value: 'white-label', label: t('white-label', 'White Label'), description: t('white-label-desc', 'Private label manufacturing opportunities') },
            { value: 'r-and-d', label: t('r-and-d', 'R&D Partner'), description: t('r-and-d-desc', 'Product development collaborations') },
          ];
        case 'brand':
          return [
            { value: 'manufacturer', label: t('manufacturer', 'Manufacturer'), description: t('manufacturer-desc-for-brand', 'Production facilities for your products') },
            { value: 'distributor', label: t('distributor', 'Distributor'), description: t('distributor-desc-for-brand', 'Companies to distribute your products') },
            { value: 'retailer', label: t('retailer', 'Retailer'), description: t('retailer-desc-for-brand', 'Stores to sell your products') },
            { value: 'marketing', label: t('marketing-partner', 'Marketing Partner'), description: t('marketing-partner-desc', 'Collaborations for brand awareness') },
          ];
        case 'retailer':
          return [
            { value: 'brand', label: t('brand', 'Brand'), description: t('brand-desc-for-retailer', 'Unique brands to add to your inventory') },
            { value: 'distributor', label: t('distributor', 'Distributor'), description: t('distributor-desc-for-retailer', 'Wholesale product suppliers') },
            { value: 'exclusive-supplier', label: t('exclusive-supplier', 'Exclusive Supplier'), description: t('exclusive-supplier-desc', 'Products unique to your store') },
            { value: 'trending-products', label: t('trending-products', 'Trending Products'), description: t('trending-products-desc', 'Up-and-coming product categories') },
          ];
        default:
          return [
            { value: 'manufacturer', label: t('manufacturer', 'Manufacturer'), description: t('manufacturer-role-desc', 'Companies that produce goods') },
            { value: 'supplier', label: t('supplier', 'Supplier'), description: t('supplier-desc', 'Raw material and component providers') },
            { value: 'buyer', label: t('buyer', 'Buyer'), description: t('buyer-desc', 'Procurement professionals and purchasing') },
            { value: 'distributor', label: t('distributor', 'Distributor'), description: t('distributor-desc', 'Companies that distribute to markets') }
          ];
      }
    };

    // Get role-specific title texts
    const getTitleTexts = () => {
      switch(accountType) {
        case 'manufacturer':
          return {
            connectTitle: t("connect-with-title-manufacturer", "Who do you want to connect with?"),
            industryTitle: t("industry-title-manufacturer", "Which industries do you serve?"),
            interestsTitle: t("interests-title-manufacturer", "What areas are you interested in?"),
            lookingForTitle: t("looking-for-title-manufacturer", "What type of partners are you looking for?")
          };
        case 'brand':
          return {
            connectTitle: t("connect-with-title-brand", "Who do you want to connect with?"),
            industryTitle: t("industry-title-brand", "Which industries are your products in?"),
            interestsTitle: t("interests-title-brand", "What are your brand's focus areas?"),
            lookingForTitle: t("looking-for-title-brand", "What type of partners are you looking for?")
          };
        case 'retailer':
          return {
            connectTitle: t("connect-with-title-retailer", "Who do you want to connect with?"),
            industryTitle: t("industry-title-retailer", "Which product categories do you sell?"),
            interestsTitle: t("interests-title-retailer", "What are your retail focus areas?"),
            lookingForTitle: t("looking-for-title-retailer", "What type of suppliers are you looking for?")
          };
        default:
          return {
            connectTitle: t("connect-with-title", "Who do you want to connect with?"),
            industryTitle: t("industry-title", "Which industries are you interested in?"),
            interestsTitle: t("interests-title", "What products/services are you interested in?"),
            lookingForTitle: t("looking-for-title", "What roles are you looking for?")
          };
      }
    };

    // These options are customized based on account type
    const connectOptions = getConnectOptions();
    const industryOptions = getIndustryOptions();
    const interestOptions = getInterestOptions();
    const roleOptions = getRoleOptions();
    const titles = getTitleTexts();
    
    return (
      <motion.div
        className="space-y-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold">{t("connection-preferences", "Connection Preferences")}</h2>
          <p className="text-muted-foreground mt-2">
            {t("connection-description", "Tell us about your preferences to help us connect you with the right partners")}
          </p>
        </div>

        <Card className={cn(
          "border",
          isDark ? "border-muted" : "border-slate-200 bg-white"
        )}>
          <CardContent className="p-6 space-y-8">
            {/* Who do you want to connect with */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Users className={cn("h-5 w-5 text-primary", isDark ? "" : "text-primary/90")} />
                <h3 className="text-lg font-medium">{titles.connectTitle}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {connectOptions.map(option => (
                  <Card 
                    key={option.value} 
                    className={cn(
                      "border",
                      isDark ? "border-muted" : "border-slate-200 bg-white hover:bg-slate-50/80",
                      // Add highlight for selected options
                      form.watch("connectWith")?.includes(option.value) ? 
                        (isDark ? "border-primary/50 bg-primary/5" : "border-primary/40 bg-primary/3") : ""
                    )}
                  >
                    <div className="p-4 flex gap-3 items-start">
                      <FormField
                        control={form.control}
                        name="connectWith"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex-row space-y-0 gap-3 space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, option.value]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== option.value));
                                    }
                                  }}
                                  className={cn(
                                    field.value?.includes(option.value) ? 
                                      (isDark ? "border-primary" : "border-primary bg-primary/10") : 
                                      (isDark ? "" : "border-slate-300")
                                  )}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium text-base">{option.label}</FormLabel>
                                <p className={cn(
                                  "text-sm",
                                  isDark ? "text-muted-foreground" : "text-slate-500"
                                )}>
                                  {option.description}
                                </p>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
              {form.formState.errors.connectWith && (
                <p className={cn(
                  "text-sm mt-2 font-medium",
                  isDark ? "text-destructive" : "text-red-600"
                )}>
                  {form.formState.errors.connectWith.message}
                </p>
              )}
            </div>

            {/* Industries */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Factory className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">{titles.industryTitle}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {industryOptions.map(option => (
                  <Card key={option.value} className="border border-muted">
                    <div className="p-4 flex gap-3 items-start">
                      <FormField
                        control={form.control}
                        name="industryInterests"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex-row space-y-0 gap-3 space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, option.value]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== option.value));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium text-base">{option.label}</FormLabel>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
              {form.formState.errors.industryInterests && (
                <p className="text-destructive text-sm mt-2">{form.formState.errors.industryInterests.message}</p>
              )}
            </div>

            {/* Interests */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Heart className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">{titles.interestsTitle}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {interestOptions.map(option => (
                  <Card key={option.value} className="border border-muted">
                    <div className="p-4 flex gap-3 items-start">
                      <FormField
                        control={form.control}
                        name="interests"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex-row space-y-0 gap-3 space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, option.value]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== option.value));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium text-base">{option.label}</FormLabel>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
              {form.formState.errors.interests && (
                <p className="text-destructive text-sm mt-2">{form.formState.errors.interests.message}</p>
              )}
            </div>

            {/* Looking for */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-medium">{titles.lookingForTitle}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleOptions.map(option => (
                  <Card key={option.value} className="border border-muted">
                    <div className="p-4 flex gap-3 items-start">
                      <FormField
                        control={form.control}
                        name="lookingFor"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex-row space-y-0 gap-3 space-x-2">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(option.value)}
                                  onCheckedChange={(checked) => {
                                    const currentValues = field.value || [];
                                    if (checked) {
                                      field.onChange([...currentValues, option.value]);
                                    } else {
                                      field.onChange(currentValues.filter(value => value !== option.value));
                                    }
                                  }}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-medium text-base">{option.label}</FormLabel>
                                <p className="text-sm text-muted-foreground">{option.description}</p>
                              </div>
                            </FormItem>
                          )
                        }}
                      />
                    </div>
                  </Card>
                ))}
              </div>
              {form.formState.errors.lookingFor && (
                <p className="text-destructive text-sm mt-2">{form.formState.errors.lookingFor.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between mt-10">
          <Button 
            onClick={() => setCurrentStep('details')} 
            variant="outline" 
            size="lg"
            className={cn("px-6", isDark ? "" : "bg-white hover:bg-slate-50")}
          >
            {t("back", "Back")}
          </Button>
          <Button 
            onClick={form.handleSubmit(onSubmit)} 
            size="lg" 
            className="px-8"
            disabled={isLoading}
          >
            {isLoading ? t("completing-setup", "Completing Setup...") : t("complete-setup", "Complete Setup")}
          </Button>
        </div>
      </motion.div>
    );
  };

  // Render completion step
  const renderCompleteStep = () => {
    const accountType = selectedAccountType || form.getValues('accountType');
    const accountTypeDisplay = accountType 
      ? accountType.charAt(0).toUpperCase() + accountType.slice(1)
      : '';
    
    // The main dashboard route will display the correct dashboard based on role
    const dashboardUrl = '/dashboard';
      
    return (
      <motion.div
        className="max-w-md mx-auto text-center space-y-8 py-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative mx-auto"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 20, 
            delay: 0.1 
          }}
        >
          <div className={cn(
            "w-32 h-32 rounded-full mx-auto flex items-center justify-center",
            isDark ? "bg-primary/10" : "bg-primary/5"
          )}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 20, 
                delay: 0.5 
              }}
            >
              <CheckCircle2 className="h-16 w-16 text-primary" />
            </motion.div>
          </div>
          
          <motion.div 
            className="absolute -right-4 -top-4 bg-primary text-white p-2 rounded-full"
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 15, 
              delay: 1.0 
            }}
          >
            <Star className="h-5 w-5" />
          </motion.div>
        </motion.div>
        
        <motion.h2
          className="text-3xl font-bold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {t("setup-complete", "Profile Setup Complete!")}
        </motion.h2>
        
        <motion.p
          className={cn(
            "text-lg",
            isDark ? "text-muted-foreground" : "text-slate-600"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          {t("setup-success-message", "Your profile has been successfully set up and is ready to go.")}
        </motion.p>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className={cn(
            "border p-4 mb-6",
            isDark 
              ? "border-green-200 bg-green-900/20" 
              : "border-green-100 bg-green-50"
          )}>
            <CardContent className="p-0 flex items-center gap-3">
              <div className={cn(
                "rounded-full p-2",
                isDark ? "bg-green-800/30" : "bg-green-100"
              )}>
                <CheckCircle2 className={cn(
                  "h-5 w-5",
                  isDark ? "text-green-400" : "text-green-600"
                )} />
              </div>
              <p className={cn(
                "text-sm",
                isDark ? "text-green-400" : "text-green-700"
              )}>
                {accountType 
                  ? t("redirecting-message-with-role", `You will be redirected to your ${accountType} dashboard in a few seconds...`)
                  : t("redirecting-message", "You will be redirected to the dashboard in a few seconds...")}
              </p>
            </CardContent>
          </Card>
          
          <Button 
            className="w-full py-6"
            size="lg"
            onClick={() => {
              navigate(dashboardUrl);
            }}
          >
            {accountTypeDisplay 
              ? t("goto-role-dashboard", `Go to ${accountTypeDisplay} Dashboard Now`) 
              : t("goto-dashboard", "Go to Dashboard Now")}
          </Button>
        </motion.div>
      </motion.div>
    );
  };

  // Render progress indicator with improved light theme support
  const renderProgressIndicator = () => {
    const steps = [
      { key: 'account-type', label: t('account', 'Account') },
      { key: 'details', label: t('details', 'Details') },
      { key: 'connections', label: t('connections', 'Connections') },
    ];
    
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div 
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full",
                currentStep === step.key 
                  ? "bg-primary text-primary-foreground" 
                  : (currentStep === 'complete' || 
                     (index === 1 && currentStep === 'connections') ||
                     (index === 0 && (currentStep === 'details' || currentStep === 'connections')))
                    ? cn("bg-primary/80 text-primary-foreground", isDark ? "" : "shadow-sm") 
                    : cn("text-muted-foreground", 
                         isDark ? "bg-muted" : "bg-slate-100 text-slate-500")
              )}
            >
              {index + 1}
            </div>
            
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "w-16 h-1",
                  (currentStep === 'complete' || 
                   (index === 0 && (currentStep === 'details' || currentStep === 'connections')) ||
                   (index === 1 && currentStep === 'connections'))
                    ? isDark ? "bg-primary/80" : "bg-primary/70"
                    : isDark ? "bg-muted" : "bg-slate-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={cn(
      "w-full max-w-4xl mx-auto p-6 rounded-xl",
      isDark 
        ? "bg-background shadow-sm" 
        : "bg-white border border-slate-200 shadow-md"
    )}>
      {currentStep !== 'complete' && renderProgressIndicator()}
      
      <Form {...form}>
        {currentStep === 'account-type' && renderAccountTypeStep()}
        {currentStep === 'details' && renderDetailsStep()}
        {currentStep === 'connections' && renderConnectionsStep()}
        {currentStep === 'complete' && renderCompleteStep()}
      </Form>
    </div>
  );
};

export default ProfileSetup; 