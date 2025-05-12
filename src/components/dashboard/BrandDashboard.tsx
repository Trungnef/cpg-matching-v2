import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowUpRight, 
  Package, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Store, 
  BarChart3,
  Building, 
  AlertCircle, 
  CheckCircle,
  LineChart,
  Loader2,
  ArrowRight,
  ShoppingBag,
  Users,
  Lightbulb,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { motion } from "framer-motion";

// Mock data
const productStats = {
  totalProducts: 12,
  active: 8,
  inDevelopment: 3,
  discontinued: 1,
  topProduct: "Organic Cereal",
  topProductSales: "$45,800"
};

const retailerStats = {
  totalPartners: 14,
  newThisMonth: 2,
  pendingRequests: 3,
  topRetailer: "Whole Health Market",
  distributionReach: "1.2M customers"
};

const recentOrders = [
  { id: 1, retailer: "Whole Health Market", product: "Protein Bars", quantity: 1500, status: "Processing", date: "1 day ago" },
  { id: 2, retailer: "Green Grocery", product: "Organic Cereal", quantity: 2200, status: "Shipped", date: "2 days ago" },
  { id: 3, retailer: "Fitness Nutrition", product: "Energy Drink", quantity: 3600, status: "Delivered", date: "5 days ago" },
  { id: 4, retailer: "Nature's Best", product: "Vitamin Supplements", quantity: 800, status: "Processing", date: "8 hours ago" },
];

const topProducts = [
  { name: "Organic Cereal", retailers: 12, growth: 15.2, sales: 4580 },
  { name: "Protein Bars", retailers: 8, growth: 21.5, sales: 3650 },
  { name: "Vitamin Supplements", retailers: 5, growth: -2.3, sales: 1850 },
  { name: "Energy Drink", retailers: 10, growth: 8.7, sales: 3120 },
  { name: "Gluten-Free Crackers", retailers: 7, growth: 5.3, sales: 2240 },
];

const alerts = [
  { id: 1, type: "warning", message: "Low stock alert for Protein Bars", time: "2 hours ago" },
  { id: 2, type: "info", message: "New order received from Whole Health Market", time: "5 hours ago" },
  { id: 3, type: "success", message: "Product listing approved by GreenMart", time: "Yesterday" },
  { id: 4, type: "error", message: "Distribution delay for Energy Drink line", time: "Yesterday" },
];

interface BrandDashboardProps {
  activeTab?: string;
}

const BrandDashboard = ({ activeTab = "overview" }: BrandDashboardProps) => {
  const { user } = useUser();
  const { t } = useTranslation();
  
  // Format today's date
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Processing":
        return <Badge className="bg-blue-500">{t('brand-dashboard-processing')}</Badge>;
      case "Shipped":
        return <Badge className="bg-yellow-500">{t('brand-dashboard-shipped')}</Badge>;
      case "Delivered":
        return <Badge className="bg-green-500">{t('brand-dashboard-delivered')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function for alert icons
  const getAlertIcon = (type: string) => {
    switch(type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "info":
        return <ShoppingCart className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  // Render components based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Welcome section with gradient background */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">{t('brand-dashboard-welcome-back', { name: user?.name?.split(' ')[0] || t('brand-dashboard-user') })}</h1>
                    <p className="text-muted-foreground">{formattedDate}</p>
                    <p className="mt-2 text-sm max-w-xl">
                      {t('brand-dashboard-performance-overview')} <span className="font-medium">{t('brand-dashboard-retailer-requests', { count: retailerStats.pendingRequests })}</span> {t('brand-dashboard-and')} <span className="font-medium">{t('brand-dashboard-products-in-development', { count: productStats.inDevelopment })}</span> {t('brand-dashboard-to-review')}.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      {t('brand-dashboard-product-catalog')}
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      {t('brand-dashboard-view-analytics')}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick actions with header */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">{t('brand-dashboard-quick-actions')}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">{t('brand-dashboard-new-product')}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t('brand-dashboard-create-product-listing')}</div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">{t('brand-dashboard-find-retailers')}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t('brand-dashboard-connect-retail-partners')}</div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">{t('brand-dashboard-analytics')}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t('brand-dashboard-check-sales-performance')}</div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">{t('brand-dashboard-manufacturers')}</div>
                    <div className="text-xs text-muted-foreground mt-1">{t('brand-dashboard-manage-production-partners')}</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('brand-dashboard-total-products')}</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productStats.totalProducts}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <span className="text-muted-foreground">
                      <span className="text-green-500 font-medium">{productStats.active}</span> {t('brand-dashboard-active')}, 
                      <span className="text-blue-500 font-medium ml-1">{productStats.inDevelopment}</span> {t('brand-dashboard-in-development')}
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('brand-dashboard-retail-partners')}</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{retailerStats.totalPartners}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+{retailerStats.newThisMonth}</span>
                    <span className="text-muted-foreground ml-1">{t('brand-dashboard-new-this-month')}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('brand-dashboard-top-product')}</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productStats.topProduct}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <span className="text-muted-foreground">{t('brand-dashboard-monthly-sales')}: </span>
                    <span className="text-green-500 font-medium ml-1">{productStats.topProductSales}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('brand-dashboard-distribution-reach')}</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{retailerStats.distributionReach}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <span className="text-muted-foreground">{t('brand-dashboard-through')} </span>
                    <span className="text-blue-500 font-medium ml-1">{retailerStats.totalPartners} {t('brand-dashboard-retailers')}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Two column layout for alerts and opportunities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Alerts/Notifications */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{t('brand-dashboard-alerts-notifications')}</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      {t('brand-dashboard-view-all')} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-1">
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                        {getAlertIcon(alert.type)}
                        <div className="space-y-1">
                          <p className="text-sm">{t(`brand-dashboard-alert-${alert.id}`, {defaultValue: alert.message})}</p>
                          <p className="text-xs text-muted-foreground">{t(`brand-dashboard-time-${alert.id}`, {defaultValue: alert.time})}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Orders */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{t('brand-dashboard-recent-orders')}</CardTitle>
                      <CardDescription>{t('brand-dashboard-track-orders')}</CardDescription>
                    </div>
                    <Button size="sm">
                      {t('brand-dashboard-view-all-orders')}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-start justify-between space-x-4">
                        <div className="flex items-start space-x-4">
                          <div className="mt-1 bg-primary/10 p-2 rounded-full">
                            <ShoppingCart className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{order.retailer}</p>
                            <p className="text-muted-foreground text-xs">
                              {t('brand-dashboard-quantity-of-product', {
                                quantity: order.quantity,
                                product: order.product
                              })}
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">{t(`brand-dashboard-order-date-${order.id}`, {defaultValue: order.date})}</p>
                          </div>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        );
          
      case "products":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('brand-dashboard-product-performance')}</CardTitle>
                <CardDescription>{t('brand-dashboard-monthly-growth')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-5">
                  {topProducts.map((product) => (
                    <div key={product.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{product.name}</span>
                        <div className={`flex items-center text-sm ${product.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {product.growth >= 0 ? (
                            <TrendingUp className="h-3 w-3 mr-1" />
                          ) : (
                            <TrendingDown className="h-3 w-3 mr-1" />
                          )}
                          {product.growth >= 0 ? '+' : ''}{product.growth}%
                        </div>
                      </div>
                      <Progress value={Math.min(100, (product.sales / 5000) * 100)} className="h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>${product.sales.toLocaleString()}</span>
                        <span>{t('brand-dashboard-retailers-count', { count: product.retailers })}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  {t('brand-dashboard-view-all-products')}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
          
      case "orders":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('brand-dashboard-recent-orders')}</CardTitle>
                <CardDescription>{t('brand-dashboard-track-orders')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-start justify-between space-x-4">
                      <div className="flex items-start space-x-4">
                        <div className="mt-1 bg-primary/10 p-2 rounded-full">
                          <ShoppingCart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{order.retailer}</p>
                          <p className="text-muted-foreground text-xs">
                            {t('brand-dashboard-quantity-of-product', {
                              quantity: order.quantity,
                              product: order.product
                            })}
                          </p>
                          <p className="text-muted-foreground text-xs mt-1">{t(`brand-dashboard-order-date-${order.id}`, {defaultValue: order.date})}</p>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  {t('brand-dashboard-view-all-orders')}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );

      case "insights":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <Tabs defaultValue="performance">
                  <div className="flex items-center justify-between">
                    <CardTitle>{t('brand-dashboard-market-insights')}</CardTitle>
                    <TabsList>
                      <TabsTrigger value="performance">{t('brand-dashboard-performance')}</TabsTrigger>
                      <TabsTrigger value="retailers">{t('brand-dashboard-retailers')}</TabsTrigger>
                      <TabsTrigger value="trends">{t('brand-dashboard-trends')}</TabsTrigger>
                    </TabsList>
                  </div>
                  <CardDescription>{t('brand-dashboard-insights-description')}</CardDescription>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  <LineChart className="h-16 w-16 opacity-50" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="grid grid-cols-3 w-full gap-4 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">{t('brand-dashboard-market-share')}</p>
                    <p className="text-lg font-medium">8.2%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('brand-dashboard-growth')}</p>
                    <p className="text-lg font-medium text-green-500">+12.5%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('brand-dashboard-forecast')}</p>
                    <p className="text-lg font-medium text-blue-500">{t('brand-dashboard-growing')}</p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          </motion.div>
        );

      case "partnerships":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>{t('brand-dashboard-retail-opportunities')}</CardTitle>
                  <CardDescription>{t('brand-dashboard-potential-retailers')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Natural Grocers</p>
                        <p className="text-muted-foreground text-xs">{t('brand-dashboard-locations-nationwide', { count: 250 })}</p>
                        <p className="text-muted-foreground text-xs mt-1">{t('brand-dashboard-high-match-score')}</p>
                      </div>
                      <Button size="sm">{t('brand-dashboard-connect')}</Button>
                    </div>
                    
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Health Mart Co-op</p>
                        <p className="text-muted-foreground text-xs">{t('brand-dashboard-locations-midwest', { count: 85 })}</p>
                        <p className="text-muted-foreground text-xs mt-1">{t('brand-dashboard-looking-for-products')}</p>
                      </div>
                      <Button size="sm">{t('brand-dashboard-connect')}</Button>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Wellness Stores</p>
                        <p className="text-muted-foreground text-xs">{t('brand-dashboard-locations-west-coast', { count: 120 })}</p>
                        <p className="text-muted-foreground text-xs mt-1">{t('brand-dashboard-expanding-organic')}</p>
                      </div>
                      <Button size="sm">{t('brand-dashboard-connect')}</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('brand-dashboard-view-all-opportunities')}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('brand-dashboard-manufacturing-opportunities')}</CardTitle>
                  <CardDescription>{t('brand-dashboard-potential-production')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Organic Foods Manufacturing</p>
                        <p className="text-muted-foreground text-xs">{t('brand-dashboard-specialized-organic')}</p>
                        <p className="text-muted-foreground text-xs mt-1">{t('brand-dashboard-sqf-certified')}</p>
                      </div>
                      <Button size="sm">{t('brand-dashboard-connect')}</Button>
                    </div>
                    
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Sustainable Packaging Co.</p>
                        <p className="text-muted-foreground text-xs">{t('brand-dashboard-eco-friendly')}</p>
                        <p className="text-muted-foreground text-xs mt-1">{t('brand-dashboard-compostable')}</p>
                      </div>
                      <Button size="sm">{t('brand-dashboard-connect')}</Button>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Nutritional Supplement Facility</p>
                        <p className="text-muted-foreground text-xs">{t('brand-dashboard-fda-registered')}</p>
                        <p className="text-muted-foreground text-xs mt-1">{t('brand-dashboard-small-batch')}</p>
                      </div>
                      <Button size="sm">{t('brand-dashboard-connect')}</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('brand-dashboard-view-all-manufacturers')}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </motion.div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <p>{t('brand-dashboard-loading')}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default BrandDashboard;
