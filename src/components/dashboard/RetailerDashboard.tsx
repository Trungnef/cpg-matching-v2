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
  ArrowRight,
  ArrowUpRight, 
  ShoppingBag, 
  TrendingUp, 
  TrendingDown, 
  ShoppingCart, 
  Store, 
  Package,
  Building, 
  AlertCircle, 
  CheckCircle,
  LineChart,
  Users,
  Loader2,
  Clock,
  Calendar,
  PlusCircle,
  BarChart3,
  Truck,
  ShoppingBasket,
  FileText,
  Handshake
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
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

// Mock data
const storeStats = {
  totalStores: 24,
  totalProducts: 1842,
  lowStock: 37,
  outOfStock: 12,
  salesThisMonth: "$482,695",
  salesGrowth: 8.3,
  activeBrands: 28,
  monthlySales: 482695
};

const topSellingProducts = [
  { id: 1, name: "Organic Cereal", brand: "Natural Foods", sales: 4580, growth: 12.5, stock: 87 },
  { id: 2, name: "Protein Bars", brand: "Fitness Nutrition", sales: 3950, growth: 18.2, stock: 62 },
  { id: 3, name: "Vitamin Supplements", brand: "Wellness Co", sales: 3240, growth: -2.3, stock: 43 },
  { id: 4, name: "Gluten-Free Crackers", brand: "GoodEats", sales: 2850, growth: 5.7, stock: 75 },
  { id: 5, name: "Energy Drink", brand: "PowerUp", sales: 2740, growth: 9.3, stock: 52 },
];

const recentOrders = [
  { id: 1, orderId: "ORD-7842", supplier: "Natural Foods Inc", items: 8, total: "$12,480", status: "Processing", date: "Today" },
  { id: 2, orderId: "ORD-7841", supplier: "Wellness Products", items: 12, total: "$8,350", status: "Shipped", date: "Yesterday" },
  { id: 3, orderId: "ORD-7840", supplier: "Fitness Nutrition", items: 5, total: "$4,720", status: "Delivered", date: "Sep 18, 2023" },
  { id: 4, orderId: "ORD-7839", supplier: "GoodEats Co", items: 10, total: "$7,890", status: "Completed", date: "Sep 15, 2023" },
];

const partnershipRequests = [
  { id: 1, company: "Eco Snacks", type: "Brand", products: 12, status: "Pending Review", date: "2 days ago" },
  { id: 2, company: "Organic Harvest", type: "Manufacturer", products: 8, status: "Reviewing", date: "5 days ago" },
  { id: 3, company: "Nutritional Basics", type: "Brand", products: 5, status: "Negotiating", date: "1 week ago" },
];

// Quick actions for retailers
const quickActions = [
  { 
    title: "Manage Inventory", 
    description: "Update stock levels and product details",
    icon: <Package className="h-8 w-8 text-blue-500" />,
    href: "/retailer/inventory"
  },
  { 
    title: "Browse Brands", 
    description: "Discover new products to stock in your store",
    icon: <ShoppingBag className="h-8 w-8 text-purple-500" />,
    href: "/retailer/brands"
  },
  { 
    title: "Place Orders", 
    description: "Order products from your suppliers",
    icon: <ShoppingCart className="h-8 w-8 text-green-500" />,
    href: "/retailer/orders"
  },
  { 
    title: "Review Analytics", 
    description: "Check performance across all stores",
    icon: <BarChart3 className="h-8 w-8 text-orange-500" />,
    href: "/retailer/analytics"
  },
];

// Up-next tasks for retailers
const upNextTasks = [
  {
    title: "Review partnership request from Eco Snacks",
    dueDate: "Today",
    priority: "High",
    tag: "Partnership"
  },
  {
    title: "Place reorder for Protein Bars (low stock)",
    dueDate: "Tomorrow",
    priority: "Medium",
    tag: "Inventory"
  },
  {
    title: "Approve new product listings from Natural Foods",
    dueDate: "Sep 25, 2023",
    priority: "Medium",
    tag: "Products"
  }
];

interface RetailerDashboardProps {
  activeTab?: string;
}

const RetailerDashboard = ({ activeTab = "overview" }: RetailerDashboardProps) => {
  const { user } = useUser();
  const { t } = useTranslation();
  
  // Format today's date
  const today = format(new Date(), "EEEE, MMMM do, yyyy");

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Processing":
        return <Badge className="bg-blue-500">{t('retailer-dashboard.status.processing', 'Processing')}</Badge>;
      case "Shipped":
        return <Badge className="bg-yellow-500">{t('retailer-dashboard.status.shipped', 'Shipped')}</Badge>;
      case "Delivered":
        return <Badge className="bg-purple-500">{t('retailer-dashboard.status.delivered', 'Delivered')}</Badge>;
      case "Completed":
        return <Badge className="bg-green-500">{t('retailer-dashboard.status.completed', 'Completed')}</Badge>;
      case "Pending Review":
        return <Badge variant="outline">{t('retailer-dashboard.status.pending-review', 'Pending Review')}</Badge>;
      case "Reviewing":
        return <Badge className="bg-blue-500">{t('retailer-dashboard.status.reviewing', 'Reviewing')}</Badge>;
      case "Negotiating":
        return <Badge className="bg-purple-500">{t('retailer-dashboard.status.negotiating', 'Negotiating')}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Helper function for stock status
  const getStockStatus = (stockPercent: number) => {
    if (stockPercent < 25) {
      return <Badge variant="outline" className="text-red-500 border-red-500">{t('retailer-dashboard.stock.low', 'Low Stock')}</Badge>;
    } else if (stockPercent < 50) {
      return <Badge variant="outline" className="text-yellow-500 border-yellow-500">{t('retailer-dashboard.stock.medium', 'Medium Stock')}</Badge>;
    } else {
      return <Badge variant="outline" className="text-green-500 border-green-500">{t('retailer-dashboard.stock.good', 'Good Stock')}</Badge>;
    }
  };
  
  // Helper function for priority badges
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case "High":
        return <Badge className="bg-red-500">{t('retailer-dashboard.priority.high', 'High')}</Badge>;
      case "Medium":
        return <Badge className="bg-yellow-500">{t('retailer-dashboard.priority.medium', 'Medium')}</Badge>;
      case "Low":
        return <Badge className="bg-green-500">{t('retailer-dashboard.priority.low', 'Low')}</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  // Helper function for task tag badges
  const getTagBadge = (tag: string) => {
    switch(tag) {
      case "Partnership":
        return <Badge variant="outline" className="border-purple-500 text-purple-500">{t('retailer-dashboard.tag.partnership', 'Partnership')}</Badge>;
      case "Inventory":
        return <Badge variant="outline" className="border-blue-500 text-blue-500">{t('retailer-dashboard.tag.inventory', 'Inventory')}</Badge>;
      case "Products":
        return <Badge variant="outline" className="border-green-500 text-green-500">{t('retailer-dashboard.tag.products', 'Products')}</Badge>;
      default:
        return <Badge variant="outline">{tag}</Badge>;
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
            <>
              {/* Welcome section with gradient background */}
              <div className="mb-8">
                <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg border">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h1 className="text-2xl font-bold">{t('retailer-dashboard.welcome.greeting', {name: user?.name?.split(' ')[0] || t('retailer-dashboard.welcome.user', 'User')})}</h1>
                      <p className="text-muted-foreground">{today}</p>
                      <p className="mt-2 text-sm max-w-xl">
                        {t('retailer-dashboard.welcome.summary', {
                          lowStock: storeStats.lowStock,
                          requests: partnershipRequests.length
                        })}
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <Button>
                        <Store className="mr-2 h-4 w-4" />
                        {t('retailer-dashboard.buttons.store-management', 'Store Management')}
                      </Button>
                      <Button variant="outline">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        {t('retailer-dashboard.buttons.view-analytics', 'View Analytics')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
                  
              {/* Quick actions */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('retailer-dashboard.quick-actions.title', 'Quick Actions')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Card key={index} className="hover:border-primary transition-colors duration-200">
                      <CardContent className="p-6 flex flex-col items-start">
                        <div className="rounded-lg p-2 bg-muted mb-4">
                          {action.icon}
                    </div>
                        <CardTitle className="text-lg mb-2">{t(`retailer-dashboard.quick-actions.items.${index}.title`, action.title)}</CardTitle>
                        <p className="text-muted-foreground text-sm mb-4">{t(`retailer-dashboard.quick-actions.items.${index}.description`, action.description)}</p>
                        <Button variant="ghost" size="sm" className="mt-auto" asChild>
                          <a href={action.href}>
                            {t('retailer-dashboard.buttons.go-to', {section: action.title.split(' ')[1]})}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </a>
                        </Button>
                  </CardContent>
                </Card>
              ))}
                </div>
              </div>
              
              {/* Stats with improved styling */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">{t('retailer-dashboard.store-performance.title', 'Store Performance')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
                <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-sm font-medium text-muted-foreground">{t('retailer-dashboard.store-performance.total-stores.title', 'Total Stores')}</CardTitle>
                        <Store className="h-4 w-4 text-muted-foreground" />
                      </div>
                </CardHeader>
                <CardContent>
                        <div className="text-2xl font-bold">{storeStats.totalStores}</div>
                        <div className="flex items-center mt-1 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                          <span className="text-green-500 font-medium">+2</span>
                          <span className="text-muted-foreground ml-1">{t('retailer-dashboard.store-performance.total-stores.description', 'new locations this quarter')}</span>
                  </div>
                </CardContent>
              </Card>
              
                <Card>
                  <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium text-muted-foreground">{t('retailer-dashboard.store-performance.inventory-status.title', 'Inventory Status')}</CardTitle>
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                  </CardHeader>
                  <CardContent>
                        <div className="text-2xl font-bold">{storeStats.totalProducts} {t('retailer-dashboard.store-performance.inventory-status.skus', 'SKUs')}</div>
                        <div className="flex items-center mt-1 text-xs">
                          <span className="text-muted-foreground">
                            <span className="text-red-500 font-medium">{storeStats.lowStock}</span> {t('retailer-dashboard.store-performance.inventory-status.low-stock', 'low stock')}, 
                            <span className="text-red-500 font-medium ml-1">{storeStats.outOfStock}</span> {t('retailer-dashboard.store-performance.inventory-status.out-of-stock', 'out of stock')}
                          </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium text-muted-foreground">{t('retailer-dashboard.store-performance.monthly-sales.title', 'Monthly Sales')}</CardTitle>
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </div>
                  </CardHeader>
                  <CardContent>
                        <div className="text-2xl font-bold">{storeStats.salesThisMonth}</div>
                        <div className="flex items-center mt-1 text-xs">
                          <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                          <span className="text-green-500 font-medium">+{storeStats.salesGrowth}%</span>
                          <span className="text-muted-foreground ml-1">{t('retailer-dashboard.store-performance.monthly-sales.description', 'from last month')}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-sm font-medium text-muted-foreground">{t('retailer-dashboard.store-performance.active-partnerships.title', 'Active Partnerships')}</CardTitle>
                          <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                </div>
                  </CardHeader>
                  <CardContent>
                          <div className="text-2xl font-bold">42</div>
                          <div className="flex items-center mt-1 text-xs">
                            <span className="text-muted-foreground">
                              <span className="text-blue-500 font-medium">28</span> {t('retailer-dashboard.store-performance.active-partnerships.brands', 'brands')}, 
                              <span className="text-purple-500 font-medium ml-1">14</span> {t('retailer-dashboard.store-performance.active-partnerships.manufacturers', 'manufacturers')}
                            </span>
                  </div>
                </CardContent>
              </Card>
              </div>
              </div>
              
              {/* Two column layout for up next and partnerships */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Up next section */}
              <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{t('retailer-dashboard.up-next.title', 'Up Next')}</CardTitle>
                      <Button variant="outline" size="sm">{t('retailer-dashboard.buttons.view-all-tasks', 'View all tasks')}</Button>
                    </div>
                    <CardDescription>{t('retailer-dashboard.up-next.description', 'Your pending tasks and priorities')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      {upNextTasks.map((task, index) => (
                        <div key={index} className="flex items-start p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                          <div className="mr-4 mt-1">
                            <Clock className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium mb-1">{t(`retailer-dashboard.up-next.tasks.${index}.title`, task.title)}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-muted-foreground">{t('retailer-dashboard.up-next.due', 'Due')}: {task.dueDate}</span>
                              {getPriorityBadge(task.priority)}
                              {getTagBadge(task.tag)}
                          </div>
                        </div>
                          <Button variant="ghost" size="icon" className="ml-2">
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
                {/* Partnership requests */}
              <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>{t('retailer-dashboard.partnership-requests.title', 'Partnership Requests')}</CardTitle>
                      <Button variant="outline" size="sm">{t('retailer-dashboard.buttons.view-all-requests', 'View all requests')}</Button>
                    </div>
                    <CardDescription>{t('retailer-dashboard.partnership-requests.description', 'Brands and manufacturers wanting to partner')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                      {partnershipRequests.map((request) => (
                        <div key={request.id} className="flex items-start p-3 rounded-lg border bg-card hover:bg-accent transition-colors">
                          <div className="mr-4 mt-1">
                            {request.type === 'Brand' ? 
                              <ShoppingBag className="h-5 w-5 text-muted-foreground" /> :
                              <Building className="h-5 w-5 text-muted-foreground" />
                            }
                          </div>
                      <div className="flex-1">
                            <p className="font-medium mb-1">{request.company}</p>
                            <div className="flex flex-wrap items-center gap-2 text-xs">
                              <Badge variant="secondary">{t(`retailer-dashboard.partnership-requests.type.${request.type.toLowerCase()}`, request.type)}</Badge>
                              <span className="text-muted-foreground">{request.products} {t('retailer-dashboard.partnership-requests.products', 'products')}</span>
                              <span className="text-muted-foreground">{request.date}</span>
                              {getStatusBadge(request.status)}
                          </div>
                        </div>
                          <Button variant="outline" size="sm" className="ml-2">
                            {t('retailer-dashboard.buttons.review', 'Review')}
                          </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            </>
          </motion.div>
        );
          
      case "inventory":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>{t('retailer-dashboard.inventory.top-selling-products.title', 'Top Selling Products')}</CardTitle>
                <CardDescription>{t('retailer-dashboard.inventory.top-selling-products.description', 'Best performing products across all stores')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('retailer-dashboard.inventory.top-selling-products.product', 'Product')}</TableHead>
                      <TableHead>{t('retailer-dashboard.inventory.top-selling-products.brand', 'Brand')}</TableHead>
                      <TableHead>{t('retailer-dashboard.inventory.top-selling-products.monthly-sales', 'Monthly Sales')}</TableHead>
                      <TableHead>{t('retailer-dashboard.inventory.top-selling-products.growth', 'Growth')}</TableHead>
                      <TableHead>{t('retailer-dashboard.inventory.top-selling-products.stock-level', 'Stock Level')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellingProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.brand}</TableCell>
                        <TableCell>${product.sales.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className={`flex items-center ${product.growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {product.growth >= 0 ? (
                              <TrendingUp className="h-4 w-4 mr-1" />
                            ) : (
                              <TrendingDown className="h-4 w-4 mr-1" />
                            )}
                            {product.growth >= 0 ? '+' : ''}{product.growth}%
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={product.stock} className="h-2 w-16" />
                            <span>{getStockStatus(product.stock)}</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  {t('retailer-dashboard.buttons.view-all-products', 'View All Products')}
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
                <CardTitle>{t('retailer-dashboard.orders.recent-orders.title', 'Recent Orders')}</CardTitle>
                <CardDescription>{t('retailer-dashboard.orders.recent-orders.description', 'Latest purchase orders with suppliers')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('retailer-dashboard.orders.recent-orders.order-id', 'Order ID')}</TableHead>
                      <TableHead>{t('retailer-dashboard.orders.recent-orders.supplier', 'Supplier')}</TableHead>
                      <TableHead>{t('retailer-dashboard.orders.recent-orders.items', 'Items')}</TableHead>
                      <TableHead>{t('retailer-dashboard.orders.recent-orders.total', 'Total')}</TableHead>
                      <TableHead>{t('retailer-dashboard.orders.recent-orders.status', 'Status')}</TableHead>
                      <TableHead>{t('retailer-dashboard.orders.recent-orders.date', 'Date')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.orderId}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>{order.items}</TableCell>
                        <TableCell>{order.total}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="ml-auto">
                  {t('retailer-dashboard.buttons.view-all-orders', 'View All Orders')}
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        );
          
      case "sales":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <Tabs defaultValue="sales">
                  <div className="flex items-center justify-between">
                    <CardTitle>{t('retailer-dashboard.sales.overview.title', 'Sales Overview')}</CardTitle>
                    <TabsList>
                      <TabsTrigger value="sales">{t('retailer-dashboard.sales.overview.tabs.sales', 'Sales')}</TabsTrigger>
                      <TabsTrigger value="traffic">{t('retailer-dashboard.sales.overview.tabs.store-traffic', 'Store Traffic')}</TabsTrigger>
                      <TabsTrigger value="conversion">{t('retailer-dashboard.sales.overview.tabs.conversion', 'Conversion')}</TabsTrigger>
                    </TabsList>
                  </div>
                  <CardDescription>{t('retailer-dashboard.sales.overview.description', 'Performance metrics across all retail locations')}</CardDescription>
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
                    <p className="text-xs text-muted-foreground">{t('retailer-dashboard.sales.metrics.in-store', 'In-store Sales')}</p>
                    <p className="text-lg font-medium">$347,582</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('retailer-dashboard.sales.metrics.online', 'Online Sales')}</p>
                    <p className="text-lg font-medium">$135,113</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t('retailer-dashboard.sales.metrics.basket-size', 'Avg. Basket Size')}</p>
                    <p className="text-lg font-medium">$86.42</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>{t('retailer-dashboard.partnerships.opportunities.title', 'Product Opportunities')}</CardTitle>
                  <CardDescription>{t('retailer-dashboard.partnerships.opportunities.description', 'Suggested new products based on sales data')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{t('retailer-dashboard.partnerships.opportunities.products.0.name', 'Organic Plant Protein')}</p>
                        <p className="text-muted-foreground text-xs">{t('retailer-dashboard.partnerships.opportunities.products.0.company', 'From Wellness Nutrition Co.')}</p>
                        <p className="text-muted-foreground text-xs mt-1">{t('retailer-dashboard.partnerships.opportunities.products.0.match', '97% match with your customer base')}</p>
                      </div>
                      <Button size="sm">{t('retailer-dashboard.buttons.view', 'View')}</Button>
                    </div>
                  
                    <div className="flex items-start space-x-4 border-b pb-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{t('retailer-dashboard.partnerships.opportunities.products.1.name', 'Gluten-Free Snack Pack')}</p>
                        <p className="text-muted-foreground text-xs">{t('retailer-dashboard.partnerships.opportunities.products.1.company', 'From Natural Treats Inc.')}</p>
                        <p className="text-muted-foreground text-xs mt-1">{t('retailer-dashboard.partnerships.opportunities.products.1.match', '93% match with your customer base')}</p>
                      </div>
                      <Button size="sm">{t('retailer-dashboard.buttons.view', 'View')}</Button>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{t('retailer-dashboard.partnerships.opportunities.products.2.name', 'Sugar-Free Energy Drinks')}</p>
                        <p className="text-muted-foreground text-xs">{t('retailer-dashboard.partnerships.opportunities.products.2.company', 'From Vitality Beverage Co.')}</p>
                        <p className="text-muted-foreground text-xs mt-1">{t('retailer-dashboard.partnerships.opportunities.products.2.match', '89% match with your customer base')}</p>
                      </div>
                      <Button size="sm">{t('retailer-dashboard.buttons.view', 'View')}</Button>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('retailer-dashboard.buttons.view-all-opportunities', 'View All Opportunities')}
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>{t('retailer-dashboard.partnerships.requests.title', 'Partnership Requests')}</CardTitle>
                  <CardDescription>{t('retailer-dashboard.partnerships.requests.description', 'Recent partnership applications')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-5">
                    {partnershipRequests.map((request) => (
                      <div key={request.id} className="flex items-start space-x-4 border-b pb-4 last:border-0 last:pb-0">
                        <div className="mt-0.5 bg-primary/10 p-2 rounded-full">
                          {request.type === "Brand" ? (
                            <Package className="h-5 w-5 text-primary" />
                          ) : (
                            <Building className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm">{request.company}</p>
                            <Badge variant="outline">{t(`retailer-dashboard.partnerships.requests.type.${request.type.toLowerCase()}`, request.type)}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{request.products} {t('retailer-dashboard.partnerships.requests.products', 'products')}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-muted-foreground">{t('retailer-dashboard.partnerships.requests.received', 'Received')} {request.date}</p>
                            {getStatusBadge(request.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full">
                    {t('retailer-dashboard.buttons.view-all-requests', 'View All Requests')}
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
            <p>{t('retailer-dashboard.loading', 'Loading dashboard content...')}</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Tab Content */}
      {renderTabContent()}
    </div>
  );
};

export default RetailerDashboard;
