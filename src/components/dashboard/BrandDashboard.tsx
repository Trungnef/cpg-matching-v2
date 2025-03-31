import { useUser } from "@/contexts/UserContext";
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
        return <Badge className="bg-blue-500">Processing</Badge>;
      case "Shipped":
        return <Badge className="bg-yellow-500">Shipped</Badge>;
      case "Delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
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
                    <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
                    <p className="text-muted-foreground">{formattedDate}</p>
                    <p className="mt-2 text-sm max-w-xl">
                      Your brand is performing well. You have <span className="font-medium">{retailerStats.pendingRequests} retailer requests</span> and <span className="font-medium">{productStats.inDevelopment} products in development</span> to review.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Product Catalog
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick actions with header */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">New Product</div>
                    <div className="text-xs text-muted-foreground mt-1">Create a new product listing</div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Store className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">Find Retailers</div>
                    <div className="text-xs text-muted-foreground mt-1">Connect with new retail partners</div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">Analytics</div>
                    <div className="text-xs text-muted-foreground mt-1">Check sales performance</div>
                  </CardContent>
                </Card>
                
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Building className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">Manufacturers</div>
                    <div className="text-xs text-muted-foreground mt-1">Manage production partners</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
                    <Package className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productStats.totalProducts}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <span className="text-muted-foreground">
                      <span className="text-green-500 font-medium">{productStats.active}</span> active, 
                      <span className="text-blue-500 font-medium ml-1">{productStats.inDevelopment}</span> in development
                    </span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Retail Partners</CardTitle>
                    <Store className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{retailerStats.totalPartners}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500 font-medium">+{retailerStats.newThisMonth}</span>
                    <span className="text-muted-foreground ml-1">new this month</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Top Product</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{productStats.topProduct}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <span className="text-muted-foreground">Monthly sales: </span>
                    <span className="text-green-500 font-medium ml-1">{productStats.topProductSales}</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Distribution Reach</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{retailerStats.distributionReach}</div>
                  <div className="flex items-center mt-1 text-xs">
                    <span className="text-muted-foreground">Through </span>
                    <span className="text-blue-500 font-medium ml-1">{retailerStats.totalPartners} retailers</span>
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
                    <CardTitle className="text-lg">Alerts & Notifications</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 px-2">
                      View All <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pb-1">
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                        {getAlertIcon(alert.type)}
                        <div className="space-y-1">
                          <p className="text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground">{alert.time}</p>
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
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Track your recent product orders from retailers</CardDescription>
                    </div>
                    <Button size="sm">
                      View All Orders
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
                              {order.quantity} units of {order.product}
                            </p>
                            <p className="text-muted-foreground text-xs mt-1">{order.date}</p>
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
                <CardTitle>Product Performance</CardTitle>
                <CardDescription>Monthly sales growth by product</CardDescription>
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
                        <span>{product.retailers} retailers</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All Products
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
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Track your recent product orders from retailers</CardDescription>
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
                            {order.quantity} units of {order.product}
                          </p>
                          <p className="text-muted-foreground text-xs mt-1">{order.date}</p>
                        </div>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  View All Orders
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
                    <CardTitle>Market Insights</CardTitle>
                    <TabsList>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                      <TabsTrigger value="retailers">Retailers</TabsTrigger>
                      <TabsTrigger value="trends">Trends</TabsTrigger>
                    </TabsList>
                  </div>
                  <CardDescription>Insights into your brand's market performance</CardDescription>
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
                    <p className="text-xs text-muted-foreground">Market Share</p>
                    <p className="text-lg font-medium">8.2%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Growth</p>
                    <p className="text-lg font-medium text-green-500">+12.5%</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Forecast</p>
                    <p className="text-lg font-medium text-blue-500">Growing</p>
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
                  <CardTitle>Retail Opportunities</CardTitle>
                  <CardDescription>Potential retailer partnerships</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Natural Grocers</p>
                        <p className="text-muted-foreground text-xs">250+ locations nationwide</p>
                        <p className="text-muted-foreground text-xs mt-1">High match score based on your product category</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                    
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Health Mart Co-op</p>
                        <p className="text-muted-foreground text-xs">85 locations in Midwest</p>
                        <p className="text-muted-foreground text-xs mt-1">Looking for products in your category</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Store className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Wellness Stores</p>
                        <p className="text-muted-foreground text-xs">120+ locations on West Coast</p>
                        <p className="text-muted-foreground text-xs mt-1">Expanding organic product selection</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Opportunities
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Manufacturing Opportunities</CardTitle>
                  <CardDescription>Potential production partnerships</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Organic Foods Manufacturing</p>
                        <p className="text-muted-foreground text-xs">Specialized in organic cereal production</p>
                        <p className="text-muted-foreground text-xs mt-1">SQF Level 3 Certified, Organic & Non-GMO</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                    
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Sustainable Packaging Co.</p>
                        <p className="text-muted-foreground text-xs">Eco-friendly packaging solutions</p>
                        <p className="text-muted-foreground text-xs mt-1">Compostable & recycled materials available</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Building className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">Nutritional Supplement Facility</p>
                        <p className="text-muted-foreground text-xs">FDA registered, GMP certified</p>
                        <p className="text-muted-foreground text-xs mt-1">Small batch capabilities for new products</p>
                      </div>
                      <Button size="sm">Connect</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    View All Manufacturers
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
            <p>Loading dashboard content...</p>
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
