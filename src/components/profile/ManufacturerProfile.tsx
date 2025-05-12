import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  Package, 
  Users, 
  CheckCircle2, 
  Edit, 
  RefreshCw,
  Calendar,
  Settings,
  FileText,
  Download,
  Mail,
  Phone,
  Globe,
  Share2,
  FileDown,
  MapPin,
  ShieldCheck,
  BarChart
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";

// Simplified animation variants for better performance
const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 } 
  }
};

const ManufacturerProfile = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [capacityUtilization, setCapacityUtilization] = useState(78);
  const [profileCompletion, setProfileCompletion] = useState(85);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: t("manufacturer-profile-data-refreshed", "Data refreshed") });
    }, 800);
  };

  const handleShareProfile = () => {
    toast({ 
      title: t("manufacturer-profile-shared", "Profile shared"), 
      description: t("manufacturer-profile-link-copied", "Link copied to clipboard") 
    });
  };

  const handleExportProfile = () => {
    toast({ title: t("manufacturer-profile-export-initiated", "Export initiated") });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Profile Header - Streamlined */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInVariant}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 p-6 shadow-sm border"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
          <div className="flex gap-4 items-center">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src="/placeholders/manufacturer-logo.svg" alt={t("manufacturer-profile-alt-logo", "Alpha Manufacturing")} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">AM</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold">{t("manufacturer-profile-company-name", "Alpha Manufacturing Inc.")}</h1>
              <p className="text-muted-foreground flex items-center mt-1">
                <Factory className="w-4 h-4 mr-1" />
                {t("manufacturer-profile-partner-status", "Premium Manufacturing Partner")}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleShareProfile}>
                    <Share2 className="w-4 h-4 mr-2" />
                    {t("manufacturer-profile-share", "Share")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("manufacturer-profile-share-tooltip", "Share your profile with partners")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExportProfile}>
                    <FileDown className="w-4 h-4 mr-2" />
                    {t("manufacturer-profile-export", "Export")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("manufacturer-profile-export-tooltip", "Export profile as PDF")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isRefreshing}>
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {t("manufacturer-profile-refresh", "Refresh")}
            </Button>
            
            {/* <Button size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button> */}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="col-span-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{t("manufacturer-profile-completion", "Profile Completion")}</h3>
                <span className="text-sm font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {t("manufacturer-profile-completion-help", "Complete your profile to increase visibility to potential partners")}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{t("manufacturer-profile-products", "Products")}</div>
                  <div className="text-xl font-bold">28</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{t("manufacturer-profile-team-size", "Team Size")}</div>
                  <div className="text-xl font-bold">120</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{t("manufacturer-profile-years-active", "Years Active")}</div>
                  <div className="text-xl font-bold">15</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <Mail className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm">contact@alphamanufacturing.com</span>
            </div>
            
            <div className="flex items-start">
              <Phone className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            
            <div className="flex items-start">
              <Globe className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm text-primary hover:underline cursor-pointer">www.alphamanufacturing.com</span>
            </div>
            
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm">Boston, MA, United States</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Company Description */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInVariant}
        className="bg-background rounded-xl border p-6"
      >
        <h2 className="text-lg font-semibold mb-2">{t("manufacturer-profile-about", "About Alpha Manufacturing")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("manufacturer-profile-description", "Alpha Manufacturing Inc. is a premium manufacturing partner specializing in consumer packaged goods production with over 15 years of industry experience. Our state-of-the-art facilities and quality-focused processes ensure consistent delivery of high-quality products.")}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">{t("manufacturer-profile-industry", "Industry")}</h4>
            <p className="text-sm font-medium">{t("manufacturer-profile-industry-value", "Food & Beverage")}</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">{t("manufacturer-profile-founded", "Founded")}</h4>
            <p className="text-sm font-medium">2008</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">{t("manufacturer-profile-company-size", "Company Size")}</h4>
            <p className="text-sm font-medium">{t("manufacturer-profile-employees", "101-250 employees")}</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">{t("manufacturer-profile-specialization", "Specialization")}</h4>
            <p className="text-sm font-medium">{t("manufacturer-profile-specialization-value", "Organic Food Processing")}</p>
          </div>
        </div>
      </motion.div>
      
      {/* Core Content Tabs */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInVariant}
      >
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b pb-px mb-6 rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              {t("manufacturer-profile-tab-overview", "Overview")}
            </TabsTrigger>
            <TabsTrigger 
              value="capabilities"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              {t("manufacturer-profile-tab-capabilities", "Capabilities")}
            </TabsTrigger>
            <TabsTrigger 
              value="certifications"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              {t("manufacturer-profile-tab-certifications", "Certifications")}
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Production Capacity Card */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium flex items-center">
                          <BarChart className="w-4 h-4 mr-2 text-primary" />
                          {t("manufacturer-profile-production-capacity", "Production Capacity")}
                        </CardTitle>
                        <Badge variant="outline" className="bg-primary/5 text-primary">
                          {100 - capacityUtilization}% {t("manufacturer-profile-available", "Available")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>{t("manufacturer-profile-current-utilization", "Current Utilization")}</span>
                          <span className="font-medium">{capacityUtilization}%</span>
                        </div>
                        <Progress value={capacityUtilization} className="h-2" />
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">25K</div>
                            <div className="text-xs text-muted-foreground">{t("manufacturer-profile-units-day", "Units/Day")}</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">5</div>
                            <div className="text-xs text-muted-foreground">{t("manufacturer-profile-production-lines", "Production Lines")}</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-green-500">98%</div>
                            <div className="text-xs text-muted-foreground">{t("manufacturer-profile-efficiency", "Efficiency")}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Key Certifications Card */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <CheckCircle2 className="w-4 h-4 mr-2 text-primary" />
                        {t("manufacturer-profile-key-certifications", "Key Certifications")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        {[
                          { name: "ISO 9001:2015", expires: "Dec 15, 2024", status: t("manufacturer-profile-status-valid", "Valid") },
                          { name: t("manufacturer-profile-food-safety", "Food Safety Certification"), expires: "Nov 30, 2023", status: t("manufacturer-profile-status-valid", "Valid") },
                          { name: t("manufacturer-profile-organic-cert", "Organic Certification"), expires: "Oct 15, 2023", status: t("manufacturer-profile-status-expiring", "Expiring Soon") }
                        ].map((cert, index) => (
                          <div 
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              cert.status === t("manufacturer-profile-status-valid", "Valid") ? "bg-green-500/5" : "bg-yellow-500/5"
                            }`}
                          >
                            <div className="flex items-center">
                              <Badge 
                                variant="outline" 
                                className={`mr-3 ${
                                  cert.status === t("manufacturer-profile-status-valid", "Valid")
                                    ? "bg-green-500/10 text-green-500" 
                                    : "bg-yellow-500/10 text-yellow-500"
                                }`}
                              >
                                {cert.status}
                              </Badge>
                              <div>
                                <span className="text-sm font-medium">{cert.name}</span>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {t("manufacturer-profile-expires", "Expires")}: {cert.expires}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Production Lines Card */}
                  <Card className="border shadow-sm md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Factory className="w-4 h-4 mr-2 text-primary" />
                        {t("manufacturer-profile-production-equipment", "Production Equipment")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { name: t("manufacturer-profile-processing-line-a", "Processing Line A"), capacity: "10,000 units/day", status: t("manufacturer-profile-status-active", "Active") },
                          { name: t("manufacturer-profile-packaging-line-b", "Packaging Line B"), capacity: "5,000 units/day", status: t("manufacturer-profile-status-active", "Active") },
                          { name: t("manufacturer-profile-quality-control-lab", "Quality Control Lab"), capacity: "15,000 tests/day", status: t("manufacturer-profile-status-active", "Active") },
                        ].map((item, index) => (
                          <div 
                            key={index}
                            className="flex items-center p-3 border rounded-lg"
                          >
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <Package className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{item.name}</div>
                              <div className="text-xs text-muted-foreground">{item.capacity}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          
          {/* Capabilities Tab Content */}
          <TabsContent value="capabilities" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key="capabilities"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="bg-background rounded-lg border p-6">
                    <h3 className="text-base font-medium mb-4 flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-primary" />
                      {t("manufacturer-profile-manufacturing-capabilities", "Manufacturing Capabilities")}
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("manufacturer-profile-production-types", "Production Types")}</h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {[
                            t("manufacturer-profile-food-processing", "Food Processing"), 
                            t("manufacturer-profile-bottling", "Bottling"), 
                            t("manufacturer-profile-packaging", "Packaging"), 
                            t("manufacturer-profile-quality-control", "Quality Control"), 
                            t("manufacturer-profile-cold-storage", "Cold Storage")
                          ].map(type => (
                            <Badge 
                              key={type}
                              variant="secondary" 
                              className="bg-primary/10"
                            >
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("manufacturer-profile-production-metrics", "Production Metrics")}</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { value: "25K", label: t("manufacturer-profile-units-day", "Units/Day") },
                            { value: "5", label: t("manufacturer-profile-production-lines", "Production Lines") },
                            { value: "15K", label: t("manufacturer-profile-sq-ft-facility", "Sq. Ft. Facility") },
                            { value: "98%", label: t("manufacturer-profile-quality-rate", "Quality Rate") }
                          ].map((metric, index) => (
                            <div 
                              key={index}
                              className="p-3 border rounded-md text-center"
                            >
                              <div className="text-xl font-bold text-primary">{metric.value}</div>
                              <div className="text-xs text-muted-foreground">{metric.label}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("manufacturer-profile-production-facilities", "Production Facilities")}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">{t("manufacturer-profile-boston-manufacturing", "Boston Manufacturing Center")}</h5>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>{t("manufacturer-profile-main-facility", "• 15,000 sq. ft. main facility")}</p>
                              <p>{t("manufacturer-profile-dedicated-lines", "• 5 dedicated production lines")}</p>
                              <p>{t("manufacturer-profile-quality-lab", "• Quality control laboratory")}</p>
                              <p>{t("manufacturer-profile-cold-storage-capacity", "• Cold storage capacity: 5,000 units")}</p>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">{t("manufacturer-profile-quality-processing", "Quality & Processing")}</h5>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>{t("manufacturer-profile-fda-compliant", "• FDA-compliant processing systems")}</p>
                              <p>{t("manufacturer-profile-automated-inspection", "• Automated quality inspection")}</p>
                              <p>{t("manufacturer-profile-organic-lines", "• Organic certified production lines")}</p>
                              <p>{t("manufacturer-profile-packaging-solutions", "• Advanced packaging solutions")}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          
          {/* Certifications Tab Content */}
          <TabsContent value="certifications" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key="certifications"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="bg-background rounded-lg border p-6">
                    <h3 className="text-base font-medium mb-4 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-2 text-primary" />
                      {t("manufacturer-profile-certifications-compliance", "Certifications & Compliance")}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {[
                        { 
                          title: "ISO 9001:2015", 
                          description: t("manufacturer-profile-iso-description", "International quality management system standard"), 
                          expires: "Dec 15, 2024",
                          status: t("manufacturer-profile-status-valid", "Valid")
                        },
                        { 
                          title: t("manufacturer-profile-food-safety", "Food Safety Certification"), 
                          description: t("manufacturer-profile-food-safety-description", "Compliance with food safety management standards"), 
                          expires: "Nov 30, 2023",
                          status: t("manufacturer-profile-status-valid", "Valid")
                        },
                        { 
                          title: t("manufacturer-profile-organic-cert", "Organic Certification"), 
                          description: t("manufacturer-profile-organic-description", "Certified for organic food processing and handling"), 
                          expires: "Oct 15, 2023",
                          status: t("manufacturer-profile-status-expiring", "Expiring Soon")
                        },
                        { 
                          title: t("manufacturer-profile-fda-compliance", "FDA Compliance"), 
                          description: t("manufacturer-profile-fda-description", "Compliant with FDA regulations for food manufacturing"), 
                          expires: "Aug 15, 2024",
                          status: t("manufacturer-profile-status-valid", "Valid")
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            item.status === t("manufacturer-profile-status-valid", "Valid") ? "bg-green-500/5" : "bg-yellow-500/5"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge variant="outline" className={
                              item.status === t("manufacturer-profile-status-valid", "Valid")
                                ? "bg-green-500/10 text-green-500" 
                                : "bg-yellow-500/10 text-yellow-500"
                            }>
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              {t("manufacturer-profile-expires", "Expires")}: {item.expires}
                            </div>
                            <Button size="sm" variant="ghost" className="h-8">
                              <Download className="w-3.5 h-3.5 mr-1" />
                              {t("manufacturer-profile-certificate", "Certificate")}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">{t("manufacturer-profile-compliance-standards", "Compliance Standards")}</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          t("manufacturer-profile-haccp", "HACCP System"), 
                          t("manufacturer-profile-eu-standards", "EU Food Standards"), 
                          t("manufacturer-profile-environmental", "Environmental Compliance"), 
                          t("manufacturer-profile-gmp", "GMP Practices")
                        ].map((standard, index) => (
                          <div 
                            key={index}
                            className="flex items-center justify-center p-3 border rounded-lg bg-muted/10"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mr-1.5" />
                            <span className="text-sm">{standard}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default ManufacturerProfile;
