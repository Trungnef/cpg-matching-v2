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
import { useTranslation } from "react-i18next";

// Animation variant for smooth transitions
const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 } 
  }
};

const RetailerProfile = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [profileCompletion, setProfileCompletion] = useState(92);
  const [inventoryLevel, setInventoryLevel] = useState(92);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast({ title: t("retailer-data-refreshed") });
    }, 800);
  };

  const handleShareProfile = () => {
    toast({ title: t("retailer-profile-shared"), description: t("retailer-link-copied") });
  };

  const handleExportProfile = () => {
    toast({ title: t("retailer-export-initiated") });
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
              <AvatarImage src="/placeholders/retailer-logo.svg" alt={t("retailer-urban-market")} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">UM</AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="text-2xl font-bold">{t("retailer-urban-market")}</h1>
              <p className="text-muted-foreground flex items-center mt-1">
                <Store className="w-4 h-4 mr-1" />
                {t("retailer-premium-organic")}
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleShareProfile}>
                    <Share2 className="w-4 h-4 mr-2" />
                    {t("share")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("retailer-share-profile")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="sm" onClick={handleExportProfile}>
                    <FileDown className="w-4 h-4 mr-2" />
                    {t("export")}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{t("retailer-export-pdf")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isRefreshing}>
              {isRefreshing ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {t("refresh")}
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="col-span-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">{t("retailer-profile-completion")}</h3>
                <span className="text-sm font-medium">{profileCompletion}%</span>
              </div>
              <Progress value={profileCompletion} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {t("retailer-profile-completion-hint")}
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{t("retailer-locations")}</div>
                  <div className="text-xl font-bold">8</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{t("products")}</div>
                  <div className="text-xl font-bold">541</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <div className="text-sm font-medium">{t("retailer-customers")}</div>
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
              <span className="text-sm">{t("retailer-locations-northeast")}</span>
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
        <h2 className="text-lg font-semibold mb-2">{t("retailer-about-urban-market")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("retailer-about-description")}
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">{t("retailer-business-type")}</h4>
            <p className="text-sm font-medium">{t("retailer-grocery-retail")}</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">{t("retailer-founded")}</h4>
            <p className="text-sm font-medium">2010</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">{t("retailer-store-format")}</h4>
            <p className="text-sm font-medium">{t("retailer-urban-grocery")}</p>
          </div>
          
          <div className="p-3 bg-muted/20 rounded-lg">
            <h4 className="text-xs font-medium uppercase text-muted-foreground mb-1">{t("retailer-avg-store-size")}</h4>
            <p className="text-sm font-medium">{t("retailer-sq-ft-value")}</p>
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
              {t("overview")}
            </TabsTrigger>
            <TabsTrigger 
              value="catalog"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              {t("retailer-product-catalog")}
            </TabsTrigger>
            <TabsTrigger 
              value="sales"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              {t("retailer-sales-performance")}
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
                          {t("retailer-inventory-status")}
                        </CardTitle>
                        <Badge variant="outline" className="bg-primary/5 text-primary">
                          {inventoryLevel}% {t("retailer-in-stock")}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span>{t("retailer-stock-levels")}</span>
                          <span className="font-medium">{t("retailer-items-restocking", { count: 15 })}</span>
                        </div>
                        <Progress value={inventoryLevel} className="h-2" />
                        <div className="grid grid-cols-3 gap-3 pt-2">
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">541</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-total-skus")}</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-primary">15</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-to-restock")}</div>
                          </div>
                          <div className="p-2 bg-muted/20 rounded-lg text-center">
                            <div className="text-lg font-semibold text-green-500">98%</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-fulfillment")}</div>
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
                        {t("retailer-store-locations")}
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
                              <div className="font-medium text-sm">{t("retailer-boston-flagship")}</div>
                              <div className="text-xs text-muted-foreground">15,000 sq. ft.</div>
                            </div>
                          </div>
                          <Badge className="bg-green-500/10 text-green-500">{t("retailer-flagship")}</Badge>
                        </div>
                        
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <Store className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-sm">{t("retailer-cambridge")}</div>
                              <div className="text-xs text-muted-foreground">12,000 sq. ft.</div>
                            </div>
                          </div>
                          <Badge variant="outline">{t("retailer-standard")}</Badge>
                        </div>
                        
                        <div className="text-xs text-center text-muted-foreground mt-2">
                          {t("retailer-more-locations", { count: 6 })}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Sales Overview Card */}
                  <Card className="border shadow-sm md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-medium flex items-center">
                        <CircleDollarSign className="w-4 h-4 mr-2 text-primary" />
                        {t("retailer-sales-overview")}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <CircleDollarSign className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-lg font-bold">$42.5K</div>
                          <div className="text-xs text-muted-foreground">{t("retailer-monthly-sales")}</div>
                          <div className="text-xs text-green-500 mt-1">{t("retailer-vs-last-month", { percent: "12.3%" })}</div>
                        </div>
                        
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-lg font-bold">3,542</div>
                          <div className="text-xs text-muted-foreground">{t("retailer-active-customers")}</div>
                          <div className="text-xs text-green-500 mt-1">{t("retailer-vs-last-month", { percent: "8.7%" })}</div>
                        </div>
                        
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                            <BarChart3 className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-lg font-bold">+18%</div>
                          <div className="text-xs text-muted-foreground">{t("retailer-growth-rate-yoy")}</div>
                          <div className="text-xs text-green-500 mt-1">{t("retailer-vs-last-year", { percent: "2.1%" })}</div>
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
                      {t("retailer-product-catalog")}
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("retailer-top-product-categories")}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">{t("retailer-food-beverage")}</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-product-count", { count: 245 })}</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">{t("retailer-personal-care")}</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-product-count", { count: 128 })}</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">{t("retailer-household")}</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-product-count", { count: 92 })}</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div className="font-medium">{t("retailer-health-wellness")}</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-product-count", { count: 76 })}</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("retailer-brand-partnerships")}</h4>
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge variant="secondary" className="bg-primary/10">{t("retailer-top-brands")}</Badge>
                          <Badge variant="secondary" className="bg-primary/10">{t("retailer-local-producers")}</Badge>
                          <Badge variant="secondary" className="bg-primary/10">{t("retailer-exclusive-lines")}</Badge>
                          <Badge variant="secondary" className="bg-primary/10">{t("retailer-sustainable-products")}</Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg flex items-center">
                            <div className="w-12 h-12 bg-muted/30 rounded-md flex items-center justify-center mr-4">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium mb-1">{t("retailer-eco-foods")}</h5>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{t("retailer-product-count", { count: 32 })}</span>
                                <Badge className="bg-green-500/10 text-green-500">{t("retailer-premium-partner")}</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg flex items-center">
                            <div className="w-12 h-12 bg-muted/30 rounded-md flex items-center justify-center mr-4">
                              <Package className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium mb-1">{t("retailer-green-harvest")}</h5>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">{t("retailer-product-count", { count: 18 })}</span>
                                <Badge variant="outline">{t("retailer-local-producer")}</Badge>
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
                      {t("retailer-sales-performance")}
                    </h3>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("retailer-monthly-performance")}</h4>
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <CircleDollarSign className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-lg font-bold">$42.5K</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-monthly-sales")}</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-lg font-bold">3,542</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-active-customers")}</div>
                          </div>
                          
                          <div className="p-4 border rounded-md text-center">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                              <BarChart3 className="w-5 h-5 text-primary" />
                            </div>
                            <div className="text-lg font-bold">+18%</div>
                            <div className="text-xs text-muted-foreground">{t("retailer-growth-rate")}</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("retailer-top-selling-categories")}</h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                <Package className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{t("retailer-organic-produce")}</div>
                                <div className="text-xs text-muted-foreground">{t("retailer-percent-total-sales", { percent: "32%" })}</div>
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
                                <div className="font-medium text-sm">{t("retailer-health-supplements")}</div>
                                <div className="text-xs text-muted-foreground">{t("retailer-percent-total-sales", { percent: "18%" })}</div>
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
                                <div className="font-medium text-sm">{t("retailer-natural-snacks")}</div>
                                <div className="text-xs text-muted-foreground">{t("retailer-percent-total-sales", { percent: "15%" })}</div>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-primary">$6.4K</div>
                          </div>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">{t("retailer-customer-insights")}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">{t("retailer-customer-demographics")}</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span>{t("retailer-age-group-25-34")}</span>
                                <span className="font-medium">42%</span>
                              </div>
                              <Progress value={42} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>{t("retailer-age-group-35-44")}</span>
                                <span className="font-medium">28%</span>
                              </div>
                              <Progress value={28} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>{t("retailer-age-group-other")}</span>
                                <span className="font-medium">30%</span>
                              </div>
                              <Progress value={30} className="h-2" />
                            </div>
                          </div>
                          
                          <div className="p-4 border rounded-lg">
                            <h5 className="font-medium mb-2">{t("retailer-purchase-frequency")}</h5>
                            <div className="space-y-2">
                              <div className="flex justify-between items-center text-sm">
                                <span>{t("retailer-weekly-shoppers")}</span>
                                <span className="font-medium">65%</span>
                              </div>
                              <Progress value={65} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>{t("retailer-biweekly-shoppers")}</span>
                                <span className="font-medium">22%</span>
                              </div>
                              <Progress value={22} className="h-2" />
                              
                              <div className="flex justify-between items-center text-sm">
                                <span>{t("retailer-monthly-shoppers")}</span>
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
