import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  ShoppingCart, 
  CircleDollarSign, 
  Package, 
  Users, 
  BarChart3,
  Megaphone,
  Share2,
  FileDown,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building,
  ShoppingBag,
  Layers,
  TrendingUp,
  Target
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";

// Animation variant for smooth transitions
const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 } 
  }
};

const BrandProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(85);
  const [marketShareGrowth, setMarketShareGrowth] = useState(24);

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
      {/* Profile Header */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeInVariant}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 p-6 shadow-sm border"
      >
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between relative z-10">
          <div className="flex gap-4 items-center">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src="/placeholders/brand-logo.svg" alt="EcoHarvest" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">EH</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold">EcoHarvest</h1>
              <p className="text-muted-foreground flex items-center mt-1">
                <Layers className="w-4 h-4 mr-1" />
                Sustainable Food Products
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
                Complete your profile to increase visibility to retailers
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Products</div>
                  <div className="text-xl font-bold">28</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Retailers</div>
                  <div className="text-xl font-bold">18</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Growth</div>
                  <div className="text-xl font-bold">+24%</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <Mail className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm">contact@ecoharvest.com</span>
            </div>
            
            <div className="flex items-start">
              <Phone className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            
            <div className="flex items-start">
              <Globe className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm text-primary hover:underline cursor-pointer">www.ecoharvest.com</span>
            </div>
            
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm">Portland, Oregon, USA</span>
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
        <h2 className="text-lg font-semibold mb-2">About EcoHarvest</h2>
        <p className="text-sm text-muted-foreground">
          EcoHarvest specializes in sustainable food products, focusing on organic ingredients 
          and eco-friendly packaging. Founded in 2015, we've grown to become a recognized 
          brand in the health food sector, with our products available in premium grocery 
          stores across the United States.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Industry</h4>
            <p className="text-sm font-medium">Organic Food</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Founded</h4>
            <p className="text-sm font-medium">2015</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Headquarters</h4>
            <p className="text-sm font-medium">Portland, OR</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Employees</h4>
            <p className="text-sm font-medium">75+</p>
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
              value="products"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Product Portfolio
            </TabsTrigger>
            <TabsTrigger 
              value="marketing"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Marketing & Campaigns
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
                  {/* Market Share Card */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium flex items-center">
                          <TrendingUp className="w-4 h-4 mr-2 text-primary" />
                          Market Share
                        </CardTitle>
                        <Badge variant="outline" className="bg-primary/5 text-primary">
                          {marketShareGrowth}% Growth YoY
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Market Penetration</span>
                          <span className="font-medium">32% of target retailers</span>
                        </div>
                        <Progress value={32} className="h-2" />
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">12%</div>
                            <div className="text-xs text-muted-foreground">Market Share</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">18</div>
                            <div className="text-xs text-muted-foreground">Retailers</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-green-500">5</div>
                            <div className="text-xs text-muted-foreground">New Markets</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Top Products Card */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <ShoppingBag className="w-4 h-4 mr-2 text-primary" />
                        Top Products
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <Package className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">Organic Quinoa Mix</div>
                              <div className="text-xs text-muted-foreground">42% of total sales</div>
                            </div>
                          </div>
                          <Badge className="bg-green-500/10 text-green-500">Bestseller</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <Package className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">Hemp Protein Bars</div>
                              <div className="text-xs text-muted-foreground">28% of total sales</div>
                            </div>
                          </div>
                          <Badge variant="outline">Popular</Badge>
                        </div>
                        
                        <div className="text-xs text-center text-muted-foreground mt-2">
                          + 26 more products
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Retailer Partnerships Card */}
                  <Card className="border shadow-sm md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Store className="w-4 h-4 mr-2 text-primary" />
                        Retailer Partnerships
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Building className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-lg font-bold">18</div>
                          <div className="text-xs text-muted-foreground">Active Retailers</div>
                          <div className="text-xs text-green-500 mt-1">↑ 5 new this year</div>
                        </div>
                        
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-lg font-bold">32</div>
                          <div className="text-xs text-muted-foreground">Shopper Reach (K)</div>
                          <div className="text-xs text-green-500 mt-1">↑ 12% vs last year</div>
                        </div>
                        
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <CircleDollarSign className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-lg font-bold">$1.8M</div>
                          <div className="text-xs text-muted-foreground">Retail Sales</div>
                          <div className="text-xs text-green-500 mt-1">↑ 28% growth</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          
          {/* Product Portfolio Tab Content */}
          <TabsContent value="products" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key="products"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="bg-background rounded-lg border p-6">
                    <h3 className="text-base font-medium mb-4 flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2 text-primary" />
                      Product Portfolio
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Product Categories</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">Grains & Seeds</div>
                            <div className="text-xs text-muted-foreground">12 products</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">Protein Bars</div>
                            <div className="text-xs text-muted-foreground">8 products</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">Dried Fruits</div>
                            <div className="text-xs text-muted-foreground">6 products</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">Trail Mixes</div>
                            <div className="text-xs text-muted-foreground">4 products</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Product Features</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary" className="bg-primary/10">Organic Certified</Badge>
                          <Badge variant="secondary" className="bg-primary/10">Non-GMO</Badge>
                          <Badge variant="secondary" className="bg-primary/10">Sustainable Packaging</Badge>
                          <Badge variant="secondary" className="bg-primary/10">Vegan</Badge>
                          <Badge variant="secondary" className="bg-primary/10">Gluten-Free Options</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg flex items-center">
                            <div className="w-12 h-12 bg-muted/30 rounded-md flex items-center justify-center mr-4">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium mb-1">Organic Certification</h5>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">USDA Certified</span>
                                <Badge className="bg-green-500/10 text-green-500">100% of products</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg flex items-center">
                            <div className="w-12 h-12 bg-muted/30 rounded-md flex items-center justify-center mr-4">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium mb-1">Packaging</h5>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Biodegradable materials</span>
                                <Badge variant="outline">85% of products</Badge>
                              </div>
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
          
          {/* Marketing & Campaigns Tab Content */}
          <TabsContent value="marketing" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key="marketing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="bg-background rounded-lg border p-6">
                    <h3 className="text-base font-medium mb-4 flex items-center">
                      <Megaphone className="w-4 h-4 mr-2 text-primary" />
                      Marketing & Campaigns
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Active Campaigns</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <Megaphone className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">Summer Wellness</div>
                                <div className="text-xs text-muted-foreground">Ends Aug 31, 2023</div>
                              </div>
                            </div>
                            <Badge className="bg-green-500/10 text-green-500">In Progress</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <Megaphone className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">Back to School</div>
                                <div className="text-xs text-muted-foreground">Starts Sep 1, 2023</div>
                              </div>
                            </div>
                            <Badge variant="outline">Upcoming</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Marketing Performance</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-lg font-bold">28.5K</div>
                            <div className="text-xs text-muted-foreground">Social Media Followers</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <BarChart3 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-lg font-bold">12.3%</div>
                            <div className="text-xs text-muted-foreground">Engagement Rate</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <CircleDollarSign className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-lg font-bold">$45K</div>
                            <div className="text-xs text-muted-foreground">Marketing Budget</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Retailer Co-Marketing</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">In-Store Promotions</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span>Premium Retailers</span>
                                <span className="font-medium">8 locations</span>
                              </div>
                              <Progress value={45} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>Mid-tier Retailers</span>
                                <span className="font-medium">6 locations</span>
                              </div>
                              <Progress value={34} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>Local Markets</span>
                                <span className="font-medium">4 locations</span>
                              </div>
                              <Progress value={21} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Campaign Budget Allocation</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span>Digital Marketing</span>
                                <span className="font-medium">45%</span>
                              </div>
                              <Progress value={45} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>In-Store Promotions</span>
                                <span className="font-medium">30%</span>
                              </div>
                              <Progress value={30} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>Events & Sampling</span>
                                <span className="font-medium">25%</span>
                              </div>
                              <Progress value={25} className="h-2" />
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
        </Tabs>
      </motion.div>
    </div>
  );
};

export default BrandProfile;
