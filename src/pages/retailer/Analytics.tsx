import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Calendar, TrendingUp, DollarSign, Users, ShoppingBag, ShoppingCart } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for charts
const salesData = [
  { month: "Jan", revenue: 78500, transactions: 2850 },
  { month: "Feb", revenue: 82000, transactions: 3100 },
  { month: "Mar", revenue: 91000, transactions: 3400 },
  { month: "Apr", revenue: 84500, transactions: 3150 },
  { month: "May", revenue: 92000, transactions: 3500 },
  { month: "Jun", revenue: 105000, transactions: 3900 },
  { month: "Jul", revenue: 114000, transactions: 4200 },
];

const categoryData = [
  { name: "Food & Beverage", value: 45 },
  { name: "Health & Wellness", value: 25 },
  { name: "Household", value: 15 },
  { name: "Personal Care", value: 10 },
  { name: "Other", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const topSellingProducts = [
  { name: "Organic Breakfast Cereal", brand: "Green Earth Organics", sales: 485, growth: 8.5 },
  { name: "Plant Protein Powder", brand: "Pure Nutrition", sales: 372, growth: 12.3 },
  { name: "Eco-Friendly Dish Soap", brand: "Clean Living", sales: 319, growth: 5.7 },
  { name: "Cold Pressed Juice", brand: "Fresh Press", sales: 287, growth: 9.2 },
  { name: "Natural Energy Bars", brand: "Green Earth Organics", sales: 241, growth: 7.8 },
];

const Analytics = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Retail Analytics - CPG Matchmaker";

    // If not authenticated or not a retailer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "retailer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);

  if (!isAuthenticated || role !== "retailer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb and header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 pl-0 text-muted-foreground"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Retail Analytics</h1>
                <p className="text-muted-foreground">
                  {user?.companyName} - Sales & Performance Metrics
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 30 Days
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Monthly Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$114,000</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+8.6%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4,200</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+7.7%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Avg. Order Value
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$27.14</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+1.2%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Customers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3,642</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+5.8%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Product Analysis</TabsTrigger>
              <TabsTrigger value="categories">Category Performance</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sales Performance</CardTitle>
                    <CardDescription>
                      Monthly revenue and transaction trends
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip 
                            formatter={(value, name) => {
                              if (name === "revenue") return [`$${value}`, "Revenue"];
                              return [value, "Transactions"];
                            }}
                          />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="transactions"
                            name="Transactions"
                            stroke="#82ca9d"
                            fill="#82ca9d"
                            fillOpacity={0.3}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Selling Products</CardTitle>
                      <CardDescription>
                        Best performers by units sold this month
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topSellingProducts.map((product, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3`}>
                                <ShoppingBag className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">{product.brand}</p>
                              </div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className="font-medium">{product.sales} units</span>
                              <Badge className="bg-green-500 mt-1">+{product.growth}%</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue by Category</CardTitle>
                      <CardDescription>
                        Sales distribution across product categories
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
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              outerRadius={100}
                              fill="#8884d8"
                              dataKey="value"
                            >
                              {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, 'Sales Percentage']} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="products" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Product Sales Performance</CardTitle>
                    <CardDescription>
                      Top 5 selling products by units sold
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={topSellingProducts}
                          layout="vertical"
                          margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" scale="band" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="sales" name="Units Sold" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="categories" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Distribution</CardTitle>
                    <CardDescription>
                      Product categories by percentage of total sales
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={120}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            labelLine={true}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value}%`, 'Sales Percentage']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Category Performance Metrics</CardTitle>
                    <CardDescription>
                      Key metrics by product category
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Food & Beverage</div>
                          <div className="text-sm font-medium">45%</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>$51,300 revenue</span>
                          <span>1,890 units</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Health & Wellness</div>
                          <div className="text-sm font-medium">25%</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>$28,500 revenue</span>
                          <span>1,050 units</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Household</div>
                          <div className="text-sm font-medium">15%</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>$17,100 revenue</span>
                          <span>630 units</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Personal Care</div>
                          <div className="text-sm font-medium">10%</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>$11,400 revenue</span>
                          <span>420 units</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Other</div>
                          <div className="text-sm font-medium">5%</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-purple-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>$5,700 revenue</span>
                          <span>210 units</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
