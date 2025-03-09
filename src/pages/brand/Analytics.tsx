
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, Calendar, TrendingUp, ShoppingBag, DollarSign, BarChart3, PieChart } from "lucide-react";
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
  Legend,
  LineChart,
  Line,
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for charts
const salesData = [
  { month: "Jan", revenue: 48500, units: 4250 },
  { month: "Feb", revenue: 52000, units: 4600 },
  { month: "Mar", revenue: 61000, units: 5100 },
  { month: "Apr", revenue: 64500, units: 5350 },
  { month: "May", revenue: 72000, units: 6000 },
  { month: "Jun", revenue: 85000, units: 7100 },
  { month: "Jul", revenue: 94000, units: 7800 },
];

const productPerformance = [
  { name: "Organic Cereal", sales: 32500, growth: 8.5 },
  { name: "Energy Bars", sales: 28700, growth: 12.3 },
  { name: "Fresh Smoothies", sales: 21900, growth: 15.7 },
  { name: "Trail Mix", sales: 18600, growth: 6.2 },
  { name: "Protein Powder", sales: 15800, growth: 9.8 },
];

const channelData = [
  { name: "Retail Stores", value: 65 },
  { name: "Online Direct", value: 20 },
  { name: "Grocery Chains", value: 10 },
  { name: "Other", value: 5 },
];

const brandInProduction = [
  { name: "Organic Cereal", units: 2500 },
  { name: "Energy Bars", units: 3200 },
  { name: "Fresh Smoothies", units: 1800 },
  { name: "Trail Mix", units: 1500 },
  { name: "Protein Powder", units: 950 },
];

const Analytics = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Brand Analytics - CPG Matchmaker";

    // If not authenticated or not a brand, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "brand") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);

  if (!isAuthenticated || role !== "brand") {
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
                <h1 className="text-3xl font-bold">Brand Analytics</h1>
                <p className="text-muted-foreground">
                  {user?.companyName} - Performance Metrics
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
                <div className="text-2xl font-bold">$94,000</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+10.5%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Units Sold
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7,800</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+9.8%</span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Retail Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+2</span>
                  <span className="ml-1">new this quarter</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Manufacturing Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">9,950</div>
                <p className="text-xs text-muted-foreground mt-1">units/month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main content */}
          <Tabs defaultValue="overview" className="mb-8">
            <TabsList className="grid w-full md:w-auto grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Product Performance</TabsTrigger>
              <TabsTrigger value="channels">Sales Channels</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue & Units Trend</CardTitle>
                    <CardDescription>
                      Monthly sales performance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={salesData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <Tooltip />
                          <Legend />
                          <Line
                            yAxisId="left"
                            type="monotone"
                            dataKey="revenue"
                            name="Revenue ($)"
                            stroke="#8884d8"
                            strokeWidth={2}
                            activeDot={{ r: 8 }}
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="units"
                            name="Units Sold"
                            stroke="#82ca9d"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Top Performing Products</CardTitle>
                      <CardDescription>
                        By monthly sales
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {productPerformance.map((product, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className={`h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3`}>
                                <ShoppingBag className="h-4 w-4 text-primary" />
                              </div>
                              <div>
                                <p className="font-medium">{product.name}</p>
                                <p className="text-xs text-muted-foreground">${product.sales.toLocaleString()}</p>
                              </div>
                            </div>
                            <Badge className="bg-green-500">+{product.growth}%</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Production Overview</CardTitle>
                      <CardDescription>
                        Current manufacturing volumes
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={brandInProduction}
                            layout="vertical"
                            margin={{ top: 20, right: 30, left: 120, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis type="number" />
                            <YAxis dataKey="name" type="category" width={100} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="units" name="Units in Production" fill="#8884d8" />
                          </BarChart>
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
                    <CardTitle>Product Sales Comparison</CardTitle>
                    <CardDescription>
                      Monthly revenue by product
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={productPerformance}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="sales" name="Revenue ($)" fill="#8884d8" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="channels" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue by Channel</CardTitle>
                    <CardDescription>
                      Sales distribution across channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={channelData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="value" name="Percentage (%)" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Channel Performance Metrics</CardTitle>
                    <CardDescription>
                      Key metrics by sales channel
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Retail Stores</div>
                          <div className="text-sm font-medium">65%</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '65%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>$61,100 revenue</span>
                          <span>5,070 units</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Online Direct</div>
                          <div className="text-sm font-medium">20%</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>$18,800 revenue</span>
                          <span>1,560 units</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Grocery Chains</div>
                          <div className="text-sm font-medium">10%</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>$9,400 revenue</span>
                          <span>780 units</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-sm font-medium">Other</div>
                          <div className="text-sm font-medium">5%</div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div className="bg-primary h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                          <span>$4,700 revenue</span>
                          <span>390 units</span>
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
