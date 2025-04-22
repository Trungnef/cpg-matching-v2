import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Calendar, TrendingUp, DollarSign, Users, ShoppingBag, ShoppingCart } from "lucide-react";
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
import RetailerLayout from "@/components/layouts/RetailerLayout";
import { motion } from "framer-motion";

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
    <RetailerLayout>
      <div className="w-full">
        <motion.div 
          className="w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Analytics Management</h1>
                <p className="text-muted-foreground">
                  {user?.companyName} - Sales & Performance Metrics
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="hover:shadow-md transition-shadow">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 30 Days
                </Button>
                <Button variant="outline" className="hover:shadow-md transition-shadow">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* KPI Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 hover:border-primary/50">
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
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 hover:border-primary/50">
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
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 hover:border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Avg. Order Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$27.14</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500">+0.8%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <Card className="hover:shadow-md transition-all duration-300 hover:border-primary/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,580</div>
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                    <span className="text-green-500">+5.3%</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Content Tabs */}
          <div className="px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="sales" className="space-y-8">
              <TabsList className="grid grid-cols-3 w-full max-w-[400px] mb-4">
                <TabsTrigger value="sales">Sales</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
              </TabsList>

              <TabsContent value="sales" className="space-y-6">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>Sales Performance</CardTitle>
                    <CardDescription>Monthly revenue and transaction trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={salesData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#0088FE" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#0088FE" stopOpacity={0.1} />
                            </linearGradient>
                            <linearGradient id="colorTransactions" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00C49F" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#00C49F" stopOpacity={0.1} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
                          <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
                          <Tooltip />
                          <Legend />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue ($)"
                            stroke="#0088FE"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                          />
                          <Area
                            yAxisId="right"
                            type="monotone"
                            dataKey="transactions"
                            name="Transactions"
                            stroke="#00C49F"
                            fillOpacity={1}
                            fill="url(#colorTransactions)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="products" className="space-y-6">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>Best performing products by sales volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {topSellingProducts.map((product, index) => (
                        <motion.div 
                          key={index} 
                          className="flex items-start justify-between hover:bg-muted/50 p-3 rounded-lg transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          whileHover={{ x: 5 }}
                        >
                          <div className="flex items-start">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 mr-4">
                              <ShoppingBag className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h4 className="font-medium">{product.name}</h4>
                              <p className="text-sm text-muted-foreground">{product.brand}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{product.sales} units</p>
                            <div className="flex items-center justify-end">
                              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                              <span className="text-xs text-green-500">+{product.growth}%</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories" className="space-y-6">
                <Card className="border-none shadow-lg">
                  <CardHeader>
                    <CardTitle>Sales by Category</CardTitle>
                    <CardDescription>Distribution of sales across product categories</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            outerRadius={150}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </RetailerLayout>
  );
};

export default Analytics;
