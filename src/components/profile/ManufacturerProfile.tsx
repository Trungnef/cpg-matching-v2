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

// Simplified animation variants for better performance
const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 } 
  }
};

const ManufacturerProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [capacityUtilization, setCapacityUtilization] = useState(78);
  const [profileCompletion, setProfileCompletion] = useState(85);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: "Data refreshed" });
    }, 800);
  };

  const handleShareProfile = () => {
    toast({ title: "Profile shared", description: "Link copied to clipboard" });
  };

  const handleExportProfile = () => {
    toast({ title: "Export initiated" });
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
              <AvatarImage src="/placeholders/manufacturer-logo.svg" alt="Alpha Manufacturing" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">AM</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold">Alpha Manufacturing Inc.</h1>
              <p className="text-muted-foreground flex items-center mt-1">
                <Factory className="w-4 h-4 mr-1" />
                Premium Manufacturing Partner
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleShareProfile}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Share your profile with partners</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExportProfile}>
                    <FileDown className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Export profile as PDF</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isRefreshing}>
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Refresh
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
                <h3 className="text-sm font-medium">Profile Completion</h3>
                <span className="text-sm font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <p className="text-xs text-muted-foreground">
                Complete your profile to increase visibility to potential partners
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Products</div>
                  <div className="text-xl font-bold">28</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Team Size</div>
                  <div className="text-xl font-bold">120</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Years Active</div>
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
        <h2 className="text-lg font-semibold mb-2">About Alpha Manufacturing</h2>
        <p className="text-sm text-muted-foreground">
          Alpha Manufacturing Inc. is a premium manufacturing partner specializing in consumer packaged goods 
          production with over 15 years of industry experience. Our state-of-the-art facilities and 
          quality-focused processes ensure consistent delivery of high-quality products.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Industry</h4>
            <p className="text-sm font-medium">Food & Beverage</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Founded</h4>
            <p className="text-sm font-medium">2008</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Company Size</h4>
            <p className="text-sm font-medium">101-250 employees</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Specialization</h4>
            <p className="text-sm font-medium">Organic Food Processing</p>
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
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="capabilities"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Capabilities
            </TabsTrigger>
            <TabsTrigger 
              value="certifications"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Certifications
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
                          Production Capacity
                        </CardTitle>
                        <Badge variant="outline" className="bg-primary/5 text-primary">
                          {100 - capacityUtilization}% Available
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Current Utilization</span>
                          <span className="font-medium">{capacityUtilization}%</span>
                        </div>
                        <Progress value={capacityUtilization} className="h-2" />
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">25K</div>
                            <div className="text-xs text-muted-foreground">Units/Day</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">5</div>
                            <div className="text-xs text-muted-foreground">Production Lines</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-green-500">98%</div>
                            <div className="text-xs text-muted-foreground">Efficiency</div>
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
                        Key Certifications
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        {[
                          { name: "ISO 9001:2015", expires: "Dec 15, 2024", status: "Valid" },
                          { name: "Food Safety Certification", expires: "Nov 30, 2023", status: "Valid" },
                          { name: "Organic Certification", expires: "Oct 15, 2023", status: "Expiring Soon" }
                        ].map((cert, index) => (
                          <div 
                            key={index}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              cert.status === "Valid" ? "bg-green-500/5" : "bg-yellow-500/5"
                            }`}
                          >
                            <div className="flex items-center">
                              <Badge 
                                variant="outline" 
                                className={`mr-3 ${
                                  cert.status === "Valid" 
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
                              Expires: {cert.expires}
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
                        Production Equipment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { name: "Processing Line A", capacity: "10,000 units/day", status: "Active" },
                          { name: "Packaging Line B", capacity: "5,000 units/day", status: "Active" },
                          { name: "Quality Control Lab", capacity: "15,000 tests/day", status: "Active" },
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
                      Manufacturing Capabilities
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Production Types</h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {["Food Processing", "Bottling", "Packaging", "Quality Control", "Cold Storage"].map(type => (
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
                        <h4 className="text-sm font-medium mb-3">Production Metrics</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { value: "25K", label: "Units/Day" },
                            { value: "5", label: "Production Lines" },
                            { value: "15K", label: "Sq. Ft. Facility" },
                            { value: "98%", label: "Quality Rate" }
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
                        <h4 className="text-sm font-medium mb-3">Production Facilities</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Boston Manufacturing Center</h5>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>• 15,000 sq. ft. main facility</p>
                              <p>• 5 dedicated production lines</p>
                              <p>• Quality control laboratory</p>
                              <p>• Cold storage capacity: 5,000 units</p>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Quality & Processing</h5>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <p>• FDA-compliant processing systems</p>
                              <p>• Automated quality inspection</p>
                              <p>• Organic certified production lines</p>
                              <p>• Advanced packaging solutions</p>
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
                      Certifications & Compliance
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {[
                        { 
                          title: "ISO 9001:2015", 
                          description: "International quality management system standard", 
                          expires: "Dec 15, 2024",
                          status: "Valid"
                        },
                        { 
                          title: "Food Safety Certification", 
                          description: "Compliance with food safety management standards", 
                          expires: "Nov 30, 2023",
                          status: "Valid"
                        },
                        { 
                          title: "Organic Certification", 
                          description: "Certified for organic food processing and handling", 
                          expires: "Oct 15, 2023",
                          status: "Expiring Soon"
                        },
                        { 
                          title: "FDA Compliance", 
                          description: "Compliant with FDA regulations for food manufacturing", 
                          expires: "Aug 15, 2024",
                          status: "Valid"
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border ${
                            item.status === "Valid" ? "bg-green-500/5" : "bg-yellow-500/5"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{item.title}</h4>
                            <Badge variant="outline" className={
                              item.status === "Valid" 
                                ? "bg-green-500/10 text-green-500" 
                                : "bg-yellow-500/10 text-yellow-500"
                            }>
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-muted-foreground">
                              Expires: {item.expires}
                            </div>
                            <Button size="sm" variant="ghost" className="h-8">
                              <Download className="w-3.5 h-3.5 mr-1" />
                              Certificate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-3">Compliance Standards</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                          "HACCP System", "EU Food Standards", "Environmental Compliance", "GMP Practices"
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
