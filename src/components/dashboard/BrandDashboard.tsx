
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingBag, Target, TrendingUp, BarChart3, Users, Store, CheckCircle, Bell, Star, BarChart, CircleUser, TrendingDown, Smartphone } from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

// Mock data for charts
const salesData = [
  { name: "Jan", sales: 45000 },
  { name: "Feb", sales: 52000 },
  { name: "Mar", sales: 48000 },
  { name: "Apr", sales: 61000 },
  { name: "May", sales: 55000 },
  { name: "Jun", sales: 67000 },
  { name: "Jul", sales: 72000 },
];

const channelData = [
  { name: 'Retail', sales: 65 },
  { name: 'Online', sales: 45 },
  { name: 'Direct', sales: 20 },
];

// Product lifecycle data
const productLifecycleData = [
  { name: 'Development', count: 3 },
  { name: 'Introduction', count: 2 },
  { name: 'Growth', count: 4 },
  { name: 'Maturity', count: 8 },
  { name: 'Decline', count: 1 }
];

// Market trends data
const marketTrendsData = [
  { month: 'Jan', brand: 12.5, competitor1: 10.2, competitor2: 8.7 },
  { month: 'Feb', brand: 13.1, competitor1: 10.5, competitor2: 9.0 },
  { month: 'Mar', brand: 13.8, competitor1: 11.0, competitor2: 9.3 },
  { month: 'Apr', brand: 14.2, competitor1: 11.5, competitor2: 9.5 },
  { month: 'May', brand: 14.7, competitor1: 11.8, competitor2: 9.8 },
  { month: 'Jun', brand: 15.2, competitor1: 12.1, competitor2: 10.0 },
];

// Campaign performance data
const campaignData = [
  { name: 'Summer Launch', impressions: 125000, engagement: 12500, conversion: 2500 },
  { name: 'Social Media', impressions: 85000, engagement: 9500, conversion: 1800 },
  { name: 'Email Promo', impressions: 45000, engagement: 5200, conversion: 950 },
  { name: 'Influencer', impressions: 65000, engagement: 7800, conversion: 1400 },
];

// Customer feedback data
const feedbackData = [
  { name: 'Very Satisfied', value: 45 },
  { name: 'Satisfied', value: 30 },
  { name: 'Neutral', value: 15 },
  { name: 'Dissatisfied', value: 7 },
  { name: 'Very Dissatisfied', value: 3 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000'];

// Distributor data
const distributorData = [
  { name: 'National Chain A', performance: 92, growth: '+8%', status: 'Strong' },
  { name: 'Regional Stores B', performance: 85, growth: '+12%', status: 'Growing' },
  { name: 'Online Platform C', performance: 78, growth: '+15%', status: 'Growing' },
  { name: 'International Dist D', performance: 65, growth: '+5%', status: 'Steady' },
  { name: 'Specialty Shops E', performance: 72, growth: '-3%', status: 'Declining' },
];

const BrandDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$72,450</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+8.1%</span> from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+3</span> new this quarter
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Retail Partners</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+2</span> new this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Market Share</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+1.2%</span> from last quarter
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="product-lifecycle">Product Lifecycle</TabsTrigger>
          <TabsTrigger value="market-trends">Market Trends</TabsTrigger>
          <TabsTrigger value="campaigns">Campaign Tracking</TabsTrigger>
          <TabsTrigger value="distributors">Distributors</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          {/* Sales Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
                <CardDescription>
                  Monthly sales trends across all channels
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
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                      <Area
                        type="monotone"
                        dataKey="sales"
                        stroke="#2563eb"
                        fillOpacity={1}
                        fill="url(#colorSales)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Sales Channels</CardTitle>
                <CardDescription>
                  Performance by distribution channel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={channelData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}k`, 'Sales']} />
                      <Legend />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <Button size="sm">Channel Analysis</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Marketing Campaigns and Manufacturer Matches */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Marketing Campaigns</CardTitle>
                <CardDescription>
                  Your active and upcoming campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Summer Product Launch</p>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">75%</span>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Social Media Campaign</p>
                      <div className="flex items-center mt-1">
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground ml-2">30%</span>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <ShoppingBag className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Holiday Promotion</p>
                      <p className="text-sm text-muted-foreground">Starts in 45 days</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <Button size="sm" className="w-full">Create New Campaign</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Manufacturer Matches</CardTitle>
                <CardDescription>
                  Potential manufacturing partners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Premium Foods Manufacturing</p>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">96% match compatibility</p>
                        <Badge variant="outline" className="ml-2 text-xs">Organic</Badge>
                      </div>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">EcoPackaging Solutions</p>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">92% match compatibility</p>
                        <Badge variant="outline" className="ml-2 text-xs">Sustainable</Badge>
                      </div>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Store className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Quality Beverage Co.</p>
                      <div className="flex items-center">
                        <p className="text-sm text-muted-foreground">88% match compatibility</p>
                        <Badge variant="outline" className="ml-2 text-xs">Beverage</Badge>
                      </div>
                    </div>
                    <Button size="sm">Connect</Button>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">View All Matches</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>
                Updates and alerts for your brand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Production Update</p>
                    <p className="text-xs text-muted-foreground">New product batch has been completed</p>
                    <p className="text-xs text-muted-foreground mt-1">3 hours ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">New Retailer</p>
                    <p className="text-xs text-muted-foreground">GreenMart wants to stock your products</p>
                    <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Inventory Alert</p>
                    <p className="text-xs text-muted-foreground">Product SKU #12345 is running low</p>
                    <p className="text-xs text-muted-foreground mt-1">2 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Product Lifecycle Tab */}
        <TabsContent value="product-lifecycle" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Lifecycle Stages</CardTitle>
                <CardDescription>Current products by lifecycle stage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={productLifecycleData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Products" fill="#8884d8" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Development</CardTitle>
                <CardDescription>Pipeline of new products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="mr-3 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Premium Energy Bar</p>
                        <p className="text-xs text-muted-foreground">Plant-based protein</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge>Prototype</Badge>
                      <p className="ml-2 text-sm text-muted-foreground">80%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center">
                      <div className="mr-3 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Organic Beverage</p>
                        <p className="text-xs text-muted-foreground">Zero sugar formula</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline">Planning</Badge>
                      <p className="ml-2 text-sm text-muted-foreground">35%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center">
                      <div className="mr-3 h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                        <Star className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">Healthy Snack Mix</p>
                        <p className="text-xs text-muted-foreground">Low-carb option</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline">Research</Badge>
                      <p className="ml-2 text-sm text-muted-foreground">20%</p>
                    </div>
                  </div>
                </div>
                <Button size="sm" className="w-full mt-4">Manage Development</Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Product Performance Metrics</CardTitle>
              <CardDescription>Sales and margin analysis for mature products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:grid md:grid-cols-3 gap-4">
                  <div className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Natural Granola</h4>
                      <Badge className="bg-green-500">Maturity</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Monthly Sales</p>
                        <p className="font-medium">$24,500</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit Margin</p>
                        <p className="font-medium">42%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Growth</p>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500">+5.2%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Satisfaction</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>4.8/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Protein Bars</h4>
                      <Badge className="bg-blue-500">Growth</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Monthly Sales</p>
                        <p className="font-medium">$18,300</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit Margin</p>
                        <p className="font-medium">38%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Growth</p>
                        <div className="flex items-center">
                          <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                          <span className="text-green-500">+15.7%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Satisfaction</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>4.6/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">Fruit Snacks</h4>
                      <Badge className="bg-red-500">Decline</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-muted-foreground">Monthly Sales</p>
                        <p className="font-medium">$12,100</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Profit Margin</p>
                        <p className="font-medium">25%</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Growth</p>
                        <div className="flex items-center">
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          <span className="text-red-500">-8.3%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Satisfaction</p>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-1" />
                          <span>3.9/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Trends Tab */}
        <TabsContent value="market-trends" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Competitive Analysis</CardTitle>
                <CardDescription>Market share comparison with top competitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={marketTrendsData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                      <Legend />
                      <Line type="monotone" dataKey="brand" name="Your Brand" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                      <Line type="monotone" dataKey="competitor1" name="Competitor A" stroke="#82ca9d" />
                      <Line type="monotone" dataKey="competitor2" name="Competitor B" stroke="#ffc658" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Insights</CardTitle>
                <CardDescription>Latest consumer trends and patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border p-3 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      <h4 className="font-medium">Rising Consumer Trend</h4>
                    </div>
                    <p className="text-sm mt-2">Plant-based alternatives are seeing 18% YoY growth in your category</p>
                  </div>
                  
                  <div className="border p-3 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      <h4 className="font-medium">Consumer Preference</h4>
                    </div>
                    <p className="text-sm mt-2">Sustainable packaging is a key decision factor for 65% of your target audience</p>
                  </div>
                  
                  <div className="border p-3 rounded-lg">
                    <div className="flex items-center">
                      <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
                      <h4 className="font-medium">Declining Segment</h4>
                    </div>
                    <p className="text-sm mt-2">High-sugar products showing 12% decline in purchase frequency</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">Get Full Report</Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Consumer Demographics</CardTitle>
              <CardDescription>Insights about your customer base</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Primary Customer Segments</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <CircleUser className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Health-Conscious Millennials</p>
                          <span className="text-sm">42%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full mt-1">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '42%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-pink-500/10 flex items-center justify-center mr-3">
                        <CircleUser className="h-5 w-5 text-pink-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Active Gen Z</p>
                          <span className="text-sm">28%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full mt-1">
                          <div className="bg-pink-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center mr-3">
                        <CircleUser className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Health-Focused Gen X</p>
                          <span className="text-sm">22%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full mt-1">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '22%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="h-9 w-9 rounded-full bg-yellow-500/10 flex items-center justify-center mr-3">
                        <CircleUser className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Other Segments</p>
                          <span className="text-sm">8%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full mt-1">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '8%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Purchasing Channels</h4>
                  <div className="h-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Physical Retail', value: 45 },
                            { name: 'Direct Online', value: 30 },
                            { name: 'Marketplaces', value: 15 },
                            { name: 'Other', value: 10 }
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {COLORS.map((color, index) => (
                            <Cell key={`cell-${index}`} fill={color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="border p-2 rounded-lg">
                      <p className="text-sm text-muted-foreground">Primary Age Range</p>
                      <p className="font-medium">25-34 years</p>
                    </div>
                    <div className="border p-2 rounded-lg">
                      <p className="text-sm text-muted-foreground">Geographic Concentration</p>
                      <p className="font-medium">Urban Areas (68%)</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Campaign Tracking Tab */}
        <TabsContent value="campaigns" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Campaign Performance</CardTitle>
                <CardDescription>Results for active marketing campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={campaignData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="impressions" name="Impressions" fill="#8884d8" />
                      <Bar dataKey="engagement" name="Engagement" fill="#82ca9d" />
                      <Bar dataKey="conversion" name="Conversion" fill="#ffc658" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Feedback</CardTitle>
                <CardDescription>Sentiment analysis from product reviews</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={feedbackData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Campaign Details</CardTitle>
              <CardDescription>Detailed performance metrics by campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Summer Product Launch</h4>
                        <p className="text-sm text-muted-foreground">Social media & influencer campaign</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                    <div className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-medium">$24,500</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground">Spent</p>
                      <p className="font-medium">$18,375</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className="font-medium text-green-500">215%</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground">Conversion Rate</p>
                      <p className="font-medium">2.8%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <p className="text-sm text-muted-foreground mr-2">Campaign Progress</p>
                    <p className="text-sm font-medium">75%</p>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button size="sm" variant="outline">Campaign Details</Button>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">Email Marketing Series</h4>
                        <p className="text-sm text-muted-foreground">Product education & promotions</p>
                      </div>
                    </div>
                    <Badge>Active</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-4">
                    <div className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground">Budget</p>
                      <p className="font-medium">$8,200</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground">Spent</p>
                      <p className="font-medium">$3,280</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground">ROI</p>
                      <p className="font-medium text-green-500">182%</p>
                    </div>
                    <div className="border rounded-md p-2">
                      <p className="text-xs text-muted-foreground">Conversion Rate</p>
                      <p className="font-medium">3.2%</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-2">
                    <p className="text-sm text-muted-foreground mr-2">Campaign Progress</p>
                    <p className="text-sm font-medium">40%</p>
                  </div>
                  <div className="w-full bg-secondary h-2 rounded-full">
                    <div className="bg-primary h-2 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                  
                  <div className="flex justify-end mt-4">
                    <Button size="sm" variant="outline">Campaign Details</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Distributors Tab */}
        <TabsContent value="distributors" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Distributor Network</CardTitle>
                <CardDescription>Performance analysis of your distribution channels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {distributorData.map((distributor, index) => (
                    <div key={index} className="border p-4 rounded-lg">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Store className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{distributor.name}</p>
                            <div className="flex items-center text-sm">
                              <span className="text-muted-foreground">Performance Score:</span>
                              <span className="ml-1 font-medium">{distributor.performance}%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Growth</p>
                            <p className={`font-medium ${distributor.growth.includes('-') ? 'text-red-500' : 'text-green-500'}`}>
                              {distributor.growth}
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-muted-foreground">Status</p>
                            <Badge variant={distributor.status === 'Declining' ? 'outline' : 'default'} className={distributor.status === 'Declining' ? 'text-red-500' : ''}>
                              {distributor.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <div className="flex items-center mb-1">
                          <p className="text-xs text-muted-foreground mr-2">Relationship Strength</p>
                          <p className="text-xs">{distributor.performance}%</p>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${distributor.performance > 85 ? 'bg-green-500' : distributor.performance > 70 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                            style={{ width: `${distributor.performance}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribution Coverage</CardTitle>
                <CardDescription>Product availability by region</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border p-3 rounded-lg">
                    <p className="font-medium">Northeast Region</p>
                    <div className="flex items-center mt-1 mb-1">
                      <p className="text-xs text-muted-foreground mr-2">Coverage</p>
                      <p className="text-xs">92%</p>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  
                  <div className="border p-3 rounded-lg">
                    <p className="font-medium">Midwest Region</p>
                    <div className="flex items-center mt-1 mb-1">
                      <p className="text-xs text-muted-foreground mr-2">Coverage</p>
                      <p className="text-xs">78%</p>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                    </div>
                  </div>
                  
                  <div className="border p-3 rounded-lg">
                    <p className="font-medium">South Region</p>
                    <div className="flex items-center mt-1 mb-1">
                      <p className="text-xs text-muted-foreground mr-2">Coverage</p>
                      <p className="text-xs">65%</p>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div className="border p-3 rounded-lg">
                    <p className="font-medium">West Region</p>
                    <div className="flex items-center mt-1 mb-1">
                      <p className="text-xs text-muted-foreground mr-2">Coverage</p>
                      <p className="text-xs">88%</p>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
                
                <Button size="sm" className="w-full mt-4">Expansion Opportunities</Button>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Distribution Performance Metrics</CardTitle>
              <CardDescription>Key indicators for your distribution network</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Fulfillment Metrics</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Order Fill Rate</span>
                        <span>96.4%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '96.4%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">On-Time Delivery</span>
                        <span>93.2%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '93.2%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Inventory Accuracy</span>
                        <span>98.7%</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '98.7%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Logistic Costs</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Storage Cost</span>
                        <span>$4.25/unit</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Transportation</span>
                        <span>$2.80/unit</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Handling Cost</span>
                        <span>$1.95/unit</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Distribution Efficiency</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Inventory Turnover</span>
                        <span>8.2x</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Lead Time</span>
                        <span>3.5 days</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Stock Coverage</span>
                        <span>4.2 weeks</span>
                      </div>
                      <div className="w-full bg-secondary h-2 rounded-full">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '84%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BrandDashboard;
