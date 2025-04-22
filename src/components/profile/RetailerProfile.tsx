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
  Share2,
  FileDown,
  RefreshCw,
  Mail,
  Phone,
  Globe,
  MapPin,
  Building,
  ShoppingBag
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

const RetailerProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(92);
  const [inventoryLevel, setInventoryLevel] = useState(92);

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
              <AvatarImage src="/placeholders/retailer-logo.svg" alt="Urban Market" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">UM</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold">Urban Market</h1>
              <p className="text-muted-foreground flex items-center mt-1">
                <Store className="w-4 h-4 mr-1" />
                Premium Organic Grocery Chain
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
                Complete your profile to increase visibility to brands and suppliers
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Locations</div>
                  <div className="text-xl font-bold">8</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Products</div>
                  <div className="text-xl font-bold">541</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">Customers</div>
                  <div className="text-xl font-bold">3.5K</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <Mail className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm">contact@urbanmarket.com</span>
            </div>
            
            <div className="flex items-start">
              <Phone className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm">+1 (555) 345-6789</span>
            </div>
            
            <div className="flex items-start">
              <Globe className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm text-primary hover:underline cursor-pointer">www.urbanmarket.com</span>
            </div>
            
            <div className="flex items-start">
              <MapPin className="w-4 h-4 text-muted-foreground mr-2 mt-0.5" />
              <span className="text-sm">8 locations in Northeast US</span>
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
        <h2 className="text-lg font-semibold mb-2">About Urban Market</h2>
        <p className="text-sm text-muted-foreground">
          Urban Market is a premium organic grocery chain focusing on high-quality, sustainable 
          products. With 8 locations across the Northeast, we provide our health-conscious customers 
          with carefully curated selections from trusted brands and local producers.
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Business Type</h4>
            <p className="text-sm font-medium">Grocery Retail</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Founded</h4>
            <p className="text-sm font-medium">2010</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Store Format</h4>
            <p className="text-sm font-medium">Urban Grocery</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">Avg. Store Size</h4>
            <p className="text-sm font-medium">12,000 sq ft</p>
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
              value="catalog"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Product Catalog
            </TabsTrigger>
            <TabsTrigger 
              value="sales"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Sales & Performance
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
                  {/* Inventory Status Card */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-medium flex items-center">
                          <ShoppingCart className="w-4 h-4 mr-2 text-primary" />
                          Inventory Status
                        </CardTitle>
                        <Badge variant="outline" className="bg-primary/5 text-primary">
                          {inventoryLevel}% In Stock
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>Stock Levels</span>
                          <span className="font-medium">15 items need restocking</span>
                        </div>
                        <Progress value={inventoryLevel} className="h-2" />
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">541</div>
                            <div className="text-xs text-muted-foreground">Total SKUs</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">15</div>
                            <div className="text-xs text-muted-foreground">To Restock</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-green-500">98%</div>
                            <div className="text-xs text-muted-foreground">Fulfillment</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Store Locations Card */}
                  <Card className="border shadow-sm">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <Building className="w-4 h-4 mr-2 text-primary" />
                        Store Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <Store className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">Boston Flagship</div>
                              <div className="text-xs text-muted-foreground">15,000 sq. ft.</div>
                            </div>
                          </div>
                          <Badge className="bg-green-500/10 text-green-500">Flagship</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <Store className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">Cambridge</div>
                              <div className="text-xs text-muted-foreground">12,000 sq. ft.</div>
                            </div>
                          </div>
                          <Badge variant="outline">Standard</Badge>
                        </div>
                        
                        <div className="text-xs text-center text-muted-foreground mt-2">
                          + 6 more locations
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Sales Overview Card */}
                  <Card className="border shadow-sm md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <CircleDollarSign className="w-4 h-4 mr-2 text-primary" />
                        Sales Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <CircleDollarSign className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-lg font-bold">$42.5K</div>
                          <div className="text-xs text-muted-foreground">Monthly Sales</div>
                          <div className="text-xs text-green-500 mt-1">↑ 12.3% vs last month</div>
                        </div>
                        
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-lg font-bold">3,542</div>
                          <div className="text-xs text-muted-foreground">Active Customers</div>
                          <div className="text-xs text-green-500 mt-1">↑ 8.7% vs last month</div>
                        </div>
                        
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-lg font-bold">+18%</div>
                          <div className="text-xs text-muted-foreground">Growth Rate (YoY)</div>
                          <div className="text-xs text-green-500 mt-1">↑ 2.1% vs last year</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          
          {/* Product Catalog Tab Content */}
          <TabsContent value="catalog" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key="catalog"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="bg-background rounded-lg border p-6">
                    <h3 className="text-base font-medium mb-4 flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2 text-primary" />
                      Product Catalog
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Top Product Categories</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">Food & Beverage</div>
                            <div className="text-xs text-muted-foreground">245 products</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">Personal Care</div>
                            <div className="text-xs text-muted-foreground">128 products</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">Household</div>
                            <div className="text-xs text-muted-foreground">92 products</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">Health & Wellness</div>
                            <div className="text-xs text-muted-foreground">76 products</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Brand Partnerships</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary" className="bg-primary/10">Top Brands</Badge>
                          <Badge variant="secondary" className="bg-primary/10">Local Producers</Badge>
                          <Badge variant="secondary" className="bg-primary/10">Exclusive Lines</Badge>
                          <Badge variant="secondary" className="bg-primary/10">Sustainable Products</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg flex items-center">
                            <div className="w-12 h-12 bg-muted/30 rounded-md flex items-center justify-center mr-4">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium mb-1">Eco Foods</h5>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">32 products</span>
                                <Badge className="bg-green-500/10 text-green-500">Premium Partner</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg flex items-center">
                            <div className="w-12 h-12 bg-muted/30 rounded-md flex items-center justify-center mr-4">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium mb-1">Green Harvest</h5>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">18 products</span>
                                <Badge variant="outline">Local Producer</Badge>
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
          
          {/* Sales & Performance Tab Content */}
          <TabsContent value="sales" className="mt-0">
            <AnimatePresence mode="wait">
              <motion.div 
                key="sales"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="space-y-6">
                  <div className="bg-background rounded-lg border p-6">
                    <h3 className="text-base font-medium mb-4 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-2 text-primary" />
                      Sales & Performance
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Monthly Performance</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <CircleDollarSign className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-lg font-bold">$42.5K</div>
                            <div className="text-xs text-muted-foreground">Monthly Sales</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-lg font-bold">3,542</div>
                            <div className="text-xs text-muted-foreground">Active Customers</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <BarChart3 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-lg font-bold">+18%</div>
                            <div className="text-xs text-muted-foreground">Growth Rate</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Top Selling Categories</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <Package className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">Organic Produce</div>
                                <div className="text-xs text-muted-foreground">32% of total sales</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-primary">$13.6K</div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <Package className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">Health Supplements</div>
                                <div className="text-xs text-muted-foreground">18% of total sales</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-primary">$7.6K</div>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <Package className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">Natural Snacks</div>
                                <div className="text-xs text-muted-foreground">15% of total sales</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-primary">$6.4K</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Customer Insights</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Customer Demographics</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span>25-34 age group</span>
                                <span className="font-medium">42%</span>
                              </div>
                              <Progress value={42} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>35-44 age group</span>
                                <span className="font-medium">28%</span>
                              </div>
                              <Progress value={28} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>Other age groups</span>
                                <span className="font-medium">30%</span>
                              </div>
                              <Progress value={30} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">Purchase Frequency</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span>Weekly shoppers</span>
                                <span className="font-medium">65%</span>
                              </div>
                              <Progress value={65} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>Bi-weekly shoppers</span>
                                <span className="font-medium">22%</span>
                              </div>
                              <Progress value={22} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>Monthly shoppers</span>
                                <span className="font-medium">13%</span>
                              </div>
                              <Progress value={13} className="h-2" />
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

export default RetailerProfile;
