
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Store, ShoppingCart, Users, Clock, Package, BarChart3, ShoppingBag, Bell, Truck, Calendar, AreaChart as AreaChartIcon, PieChart as PieChartIcon, TrendingUp, AlertTriangle, MapPin } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
} from 'recharts';

// Mock data for charts
const salesData = [
  { name: "Jan", sales: 65000 },
  { name: "Feb", sales: 59000 },
  { name: "Mar", sales: 80000 },
  { name: "Apr", sales: 81000 },
  { name: "May", sales: 76000 },
  { name: "Jun", sales: 85000 },
  { name: "Jul", sales: 98000 },
];

const categoryData = [
  { name: 'Food', value: 45 },
  { name: 'Personal Care', value: 25 },
  { name: 'Household', value: 20 },
  { name: 'Other', value: 10 },
];

// New data for customer demographics
const customerAgeData = [
  { name: '18-24', value: 15 },
  { name: '25-34', value: 32 },
  { name: '35-44', value: 28 },
  { name: '45-54', value: 18 },
  { name: '55+', value: 7 },
];

const customerLocationData = [
  { name: 'Urban', value: 58 },
  { name: 'Suburban', value: 35 },
  { name: 'Rural', value: 7 },
];

// Product performance by location
const locationPerformanceData = [
  { location: 'West Store', food: 45000, personal: 28000, household: 19000 },
  { location: 'East Store', food: 38000, personal: 31000, household: 21000 },
  { location: 'North Store', food: 42000, personal: 25000, household: 17000 },
  { location: 'South Store', food: 39000, personal: 29000, household: 23000 },
];

// Seasonal trends data
const seasonalTrendsData = [
  { month: 'Jan', thisYear: 65000, lastYear: 61000, forecast: 68000 },
  { month: 'Feb', thisYear: 59000, lastYear: 55000, forecast: 62000 },
  { month: 'Mar', thisYear: 80000, lastYear: 75000, forecast: 83000 },
  { month: 'Apr', thisYear: 81000, lastYear: 76000, forecast: 85000 },
  { month: 'May', thisYear: 76000, lastYear: 71000, forecast: 79000 },
  { month: 'Jun', thisYear: 85000, lastYear: 80000, forecast: 89000 },
  { month: 'Jul', thisYear: 98000, lastYear: 91000, forecast: 101000 },
  { month: 'Aug', thisYear: null, lastYear: 88000, forecast: 105000 },
  { month: 'Sep', thisYear: null, lastYear: 94000, forecast: 109000 },
  { month: 'Oct', thisYear: null, lastYear: 101000, forecast: 114000 },
  { month: 'Nov', thisYear: null, lastYear: 115000, forecast: 125000 },
  { month: 'Dec', thisYear: null, lastYear: 120000, forecast: 132000 },
];

// Stockout prediction data
const stockoutRiskData = [
  { product: 'Organic Cereal', currentStock: 35, dailyConsumption: 8, daysLeft: 4, risk: 'high' },
  { product: 'Natural Yogurt', currentStock: 42, dailyConsumption: 6, daysLeft: 7, risk: 'medium' },
  { product: 'Eco Detergent', currentStock: 58, dailyConsumption: 4, daysLeft: 14, risk: 'low' },
  { product: 'Gluten-Free Bread', currentStock: 12, dailyConsumption: 5, daysLeft: 2, risk: 'critical' },
];

// Purchase behavior data
const purchaseBehaviorData = [
  { hour: '6-9', inStore: 15, online: 5 },
  { hour: '9-12', inStore: 35, online: 12 },
  { hour: '12-15', inStore: 40, online: 18 },
  { hour: '15-18', inStore: 45, online: 22 },
  { hour: '18-21', inStore: 30, online: 25 },
  { hour: '21-24', inStore: 10, online: 15 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RetailerDashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Performance</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Management</TabsTrigger>
          <TabsTrigger value="forecasting">Seasonal Forecasting</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$98,425</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+15.8%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,842</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$42.50</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+4.3%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Product Count</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">524</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+15</span> new this month
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Sales Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>
                  Monthly revenue across all stores
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={salesData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorRevenue)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Revenue distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Inventory and Brand Matches */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
                <CardDescription>
                  Track stock levels and order status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingCart className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Healthy Breakfast Cereals</p>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <span className="text-xs text-red-500 ml-2">Low Stock (15%)</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Order</Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Organic Cleaning Products</p>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                        </div>
                        <span className="text-xs text-yellow-500 ml-2">Medium (35%)</span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Order</Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Incoming Delivery</p>
                      <p className="text-sm text-muted-foreground">Natural Beverages (48 units)</p>
                    </div>
                    <Badge>Arriving Today</Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <Button size="sm" className="w-full">Inventory Management</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Brand Matches</CardTitle>
                <CardDescription>
                  Potential brand partners for your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Green Earth Organics</p>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">98% match with your customer base</p>
                        <Badge variant="outline" className="ml-2 text-xs">Trending</Badge>
                      </div>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Natural Home Products</p>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">94% match with your customer base</p>
                        <Badge variant="outline" className="ml-2 text-xs">Eco-Friendly</Badge>
                      </div>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Wellness Supplements</p>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">92% match with your customer base</p>
                        <Badge variant="outline" className="ml-2 text-xs">High Margin</Badge>
                      </div>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">Explore All Brands</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Latest updates and transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Customer Signups</p>
                    <p className="text-xs text-muted-foreground">48 new customers in the last 24 hours</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <BarChart3 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Sales Milestone</p>
                    <p className="text-xs text-muted-foreground">Monthly target of $95,000 achieved</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Price Update</p>
                    <p className="text-xs text-muted-foreground">12 products updated with new pricing</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Customer Analytics Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Demographics</CardTitle>
                <CardDescription>Age distribution of your customer base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerAgeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {customerAgeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Location</CardTitle>
                <CardDescription>Geographic distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={customerLocationData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {customerLocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Purchase Behavior by Time of Day</CardTitle>
              <CardDescription>In-store vs online shopping patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={purchaseBehaviorData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip formatter={(value) => [value, 'Purchases']} />
                    <Legend />
                    <Bar dataKey="inStore" name="In-Store" fill="#8884d8" />
                    <Bar dataKey="online" name="Online" fill="#82ca9d" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Repeat Purchase Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">68%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+5.2%</span> from last quarter
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Items Per Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+0.3</span> from last quarter
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Customer Lifetime Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,250</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+$85</span> from last year
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Product Performance Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Performance by Location</CardTitle>
              <CardDescription>
                Sales breakdown by store location and category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={locationPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                    <Legend />
                    <Bar dataKey="food" name="Food & Beverage" fill="#8884d8" />
                    <Bar dataKey="personal" name="Personal Care" fill="#82ca9d" />
                    <Bar dataKey="household" name="Household" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Products</CardTitle>
                <CardDescription>Based on units sold and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Organic Breakfast Cereal", sales: 485, revenue: "$12,125", growth: "+8.5%" },
                    { name: "Plant Protein Powder", sales: 372, revenue: "$18,600", growth: "+12.3%" },
                    { name: "Eco-Friendly Dish Soap", sales: 319, revenue: "$3,190", growth: "+5.7%" },
                    { name: "Cold Pressed Juice", sales: 287, revenue: "$5,740", growth: "+9.2%" },
                    { name: "Natural Energy Bars", sales: 241, revenue: "$4,820", growth: "+7.8%" }
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <Package className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sales} units</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-medium">{product.revenue}</span>
                        <span className="text-xs text-green-500">{product.growth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Underperforming Products</CardTitle>
                <CardDescription>Products that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Vegan Protein Chips", sales: 42, revenue: "$420", growth: "-5.2%" },
                    { name: "Organic Baby Food", sales: 65, revenue: "$975", growth: "-2.8%" },
                    { name: "Glass Food Containers", sales: 78, revenue: "$1,950", growth: "-3.5%" },
                    { name: "Herbal Tea Selection", sales: 92, revenue: "$920", growth: "-1.3%" },
                    { name: "Natural Lip Balm", sales: 103, revenue: "$515", growth: "-0.9%" }
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-red-500/10 flex items-center justify-center mr-3">
                          <Package className="h-4 w-4 text-red-500" />
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-xs text-muted-foreground">{product.sales} units</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-medium">{product.revenue}</span>
                        <span className="text-xs text-red-500">{product.growth}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Store Performance Heatmap</CardTitle>
              <CardDescription>
                Regional sales performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-green-100 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span className="font-medium">West Region</span>
                    </div>
                    <Badge className="bg-green-600">High</Badge>
                  </div>
                  <p className="text-xl font-bold">$143,250</p>
                  <p className="text-xs text-green-600">+12.5% YoY</p>
                </div>
                
                <div className="bg-blue-100 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                      <span className="font-medium">North Region</span>
                    </div>
                    <Badge className="bg-blue-600">Medium</Badge>
                  </div>
                  <p className="text-xl font-bold">$98,750</p>
                  <p className="text-xs text-blue-600">+8.2% YoY</p>
                </div>
                
                <div className="bg-yellow-100 p-4 rounded-md">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-yellow-600" />
                      <span className="font-medium">South Region</span>
                    </div>
                    <Badge className="bg-yellow-600">Growing</Badge>
                  </div>
                  <p className="text-xl font-bold">$87,500</p>
                  <p className="text-xs text-yellow-600">+15.8% YoY</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Inventory Management Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Stock-Out Prediction</CardTitle>
              <CardDescription>
                Products at risk of running out
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockoutRiskData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg" style={{
                    backgroundColor: 
                      item.risk === 'critical' ? 'rgba(239, 68, 68, 0.1)' : 
                      item.risk === 'high' ? 'rgba(251, 146, 60, 0.1)' : 
                      item.risk === 'medium' ? 'rgba(250, 204, 21, 0.1)' : 
                      'rgba(34, 197, 94, 0.1)'
                  }}>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full flex items-center justify-center mr-3" style={{
                        backgroundColor: 
                          item.risk === 'critical' ? 'rgba(239, 68, 68, 0.2)' : 
                          item.risk === 'high' ? 'rgba(251, 146, 60, 0.2)' : 
                          item.risk === 'medium' ? 'rgba(250, 204, 21, 0.2)' : 
                          'rgba(34, 197, 94, 0.2)'
                      }}>
                        <AlertTriangle className="h-5 w-5" style={{
                          color: 
                            item.risk === 'critical' ? 'rgb(239, 68, 68)' : 
                            item.risk === 'high' ? 'rgb(251, 146, 60)' : 
                            item.risk === 'medium' ? 'rgb(250, 204, 21)' : 
                            'rgb(34, 197, 94)'
                        }} />
                      </div>
                      <div>
                        <p className="font-medium">{item.product}</p>
                        <p className="text-xs text-muted-foreground">Current stock: {item.currentStock} units</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <Badge className={
                        item.risk === 'critical' ? 'bg-red-500' : 
                        item.risk === 'high' ? 'bg-orange-500' : 
                        item.risk === 'medium' ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }>
                        {item.daysLeft} days left
                      </Badge>
                      <Button size="sm" className="mt-2">Reorder</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Turnover</CardTitle>
                <CardDescription>
                  How quickly products are selling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { category: "Fresh Produce", turnover: 12.5, benchmark: 10.0 },
                    { category: "Dairy Products", turnover: 8.2, benchmark: 7.5 },
                    { category: "Personal Care", turnover: 4.7, benchmark: 5.0 },
                    { category: "Household", turnover: 3.8, benchmark: 4.0 },
                    { category: "Supplements", turnover: 5.2, benchmark: 4.5 }
                  ].map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{item.category}</span>
                        <span className="text-sm">{item.turnover.toFixed(1)}x</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div 
                          className={`h-2 rounded-full ${item.turnover > item.benchmark ? 'bg-green-500' : 'bg-yellow-500'}`} 
                          style={{ width: `${(item.turnover / 15) * 100}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>0x</span>
                        <span>Benchmark: {item.benchmark.toFixed(1)}x</span>
                        <span>15x</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Automated Reordering</CardTitle>
                <CardDescription>
                  Upcoming automated orders
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Organic Milk", units: 120, date: "Tomorrow", supplier: "Local Dairy Farms" },
                    { name: "Fresh Produce", units: 85, date: "In 2 days", supplier: "Farm Fresh Co-op" },
                    { name: "Natural Bread", units: 45, date: "In 3 days", supplier: "Artisan Bakery" },
                    { name: "Eco Cleaning", units: 30, date: "In 5 days", supplier: "Green Clean Inc." }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">{item.supplier}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-medium">{item.units} units</span>
                        <span className="text-xs text-muted-foreground">{item.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">
                    Manage Reordering Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Seasonal Forecasting Tab */}
        <TabsContent value="forecasting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Sales Forecast</CardTitle>
              <CardDescription>
                Historical and projected monthly sales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={seasonalTrendsData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => value ? [`$${value}`, 'Sales'] : ['-', 'Sales']} />
                    <Legend />
                    <Area type="monotone" dataKey="lastYear" name="Last Year" fill="#8884d8" stroke="#8884d8" fillOpacity={0.3} />
                    <Bar dataKey="thisYear" name="This Year" barSize={20} fill="#413ea0" />
                    <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#ff7300" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Holiday Season Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$375,000</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+12.5%</span> vs last year
                </p>
                <div className="mt-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Starts in 92 days</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-xs text-muted-foreground">Strong projected growth</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Summer Season Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$295,000</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+8.2%</span> vs last year
                </p>
                <div className="mt-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Currently active</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-xs text-muted-foreground">Steady growth pattern</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Back-to-School Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$215,000</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+15.8%</span> vs last year
                </p>
                <div className="mt-4">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Starts in 35 days</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-xs text-muted-foreground">High growth potential</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Seasonal Product Recommendations</CardTitle>
              <CardDescription>
                Products to feature based on upcoming seasons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { 
                    season: "Back-to-School", 
                    products: [
                      { name: "Eco-Friendly Lunch Boxes", potential: "High" },
                      { name: "Organic Snack Packs", potential: "High" },
                      { name: "Sustainable Water Bottles", potential: "Medium" }
                    ]
                  },
                  { 
                    season: "Fall Season", 
                    products: [
                      { name: "Immune Support Supplements", potential: "High" },
                      { name: "Organic Pumpkin Products", potential: "Medium" },
                      { name: "Natural Candles", potential: "Medium" }
                    ]
                  },
                  { 
                    season: "Holiday Season", 
                    products: [
                      { name: "Artisanal Gift Baskets", potential: "High" },
                      { name: "Eco-Friendly Decorations", potential: "High" },
                      { name: "Premium Chocolates", potential: "High" }
                    ]
                  }
                ].map((season, idx) => (
                  <div key={idx} className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">{season.season}</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {season.products.map((product, index) => (
                        <div key={index} className="border rounded p-3">
                          <p className="font-medium">{product.name}</p>
                          <Badge className={
                            product.potential === 'High' ? 'bg-green-500 mt-2' : 
                            product.potential === 'Medium' ? 'bg-yellow-500 mt-2' : 
                            'bg-blue-500 mt-2'
                          }>
                            {product.potential} Potential
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RetailerDashboard;
