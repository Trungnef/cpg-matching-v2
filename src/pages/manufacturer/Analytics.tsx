
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  BarChart3, 
  ArrowLeft, 
  Download, 
  Calendar, 
  TrendingUp, 
  TrendingDown,
  PieChart as PieChartIcon,
  LineChart
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart as RechartsBarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line
} from 'recharts';

// Mock data for charts
const monthlyProductionData = [
  { name: "Jan", volume: 12000 },
  { name: "Feb", volume: 14000 },
  { name: "Mar", volume: 15000 },
  { name: "Apr", volume: 13500 },
  { name: "May", volume: 15500 },
  { name: "Jun", volume: 16800 },
  { name: "Jul", volume: 18000 },
  { name: "Aug", volume: 17500 },
  { name: "Sep", volume: 16000 },
  { name: "Oct", volume: 15000 },
  { name: "Nov", volume: 16500 },
  { name: "Dec", volume: 17800 },
];

const productBreakdownData = [
  { name: "Organic Cereal", value: 40 },
  { name: "Energy Bars", value: 25 },
  { name: "Protein Shake", value: 15 },
  { name: "Organic Juice", value: 20 },
];

const qualityMetricsData = [
  { name: "Jan", defectRate: 0.8, qualityScore: 92 },
  { name: "Feb", defectRate: 0.7, qualityScore: 93 },
  { name: "Mar", defectRate: 0.5, qualityScore: 95 },
  { name: "Apr", defectRate: 0.9, qualityScore: 90 },
  { name: "May", defectRate: 0.6, qualityScore: 94 },
  { name: "Jun", defectRate: 0.4, qualityScore: 96 },
];

const clientDistributionData = [
  { name: "Direct Brands", value: 65 },
  { name: "White Label", value: 25 },
  { name: "Retailers", value: 10 },
];

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];

const Analytics = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Analytics Dashboard - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);

  if (!isAuthenticated || role !== "manufacturer") {
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
                <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                <p className="text-muted-foreground">{user?.companyName} - Performance Metrics</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Last 12 Months
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>
              </div>
            </div>
          </div>
          
          {/* Overview stats */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Production</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">187,500</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+12.5%</span> vs last year
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Quality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">96.2%</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+2.1%</span> vs last year
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Production Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">88.7%</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  <span className="text-green-500">+5.3%</span> vs last year
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Client Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8/5</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <TrendingDown className="h-3 w-3 mr-1 text-yellow-500" />
                  <span className="text-yellow-500">-0.1</span> vs last quarter
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="production" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="production">Production</TabsTrigger>
              <TabsTrigger value="quality">Quality</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
              <TabsTrigger value="kpis">KPIs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="production">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Production volume chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Production Volume</CardTitle>
                        <CardDescription>Monthly production across all lines</CardDescription>
                      </div>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={monthlyProductionData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <defs>
                            <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <RechartsTooltip />
                          <Area
                            type="monotone"
                            dataKey="volume"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorVolume)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Product breakdown */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Product Breakdown</CardTitle>
                        <CardDescription>Production by product type</CardDescription>
                      </div>
                      <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={productBreakdownData}
                            cx="50%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {productBreakdownData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend layout="vertical" verticalAlign="bottom" align="center" />
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="quality">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quality metrics chart */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Quality Metrics</CardTitle>
                        <CardDescription>Tracking defect rates and quality scores</CardDescription>
                      </div>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={qualityMetricsData}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <RechartsTooltip />
                          <Legend />
                          <Line 
                            yAxisId="right"
                            type="monotone" 
                            dataKey="qualityScore" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }}
                            name="Quality Score"
                          />
                          <Line 
                            yAxisId="left"
                            type="monotone" 
                            dataKey="defectRate" 
                            stroke="#82ca9d" 
                            name="Defect Rate (%)"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Quality issues breakdown */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Quality Issues</CardTitle>
                        <CardDescription>Breakdown by category</CardDescription>
                      </div>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          layout="vertical"
                          data={[
                            { name: "Packaging", value: 45 },
                            { name: "Formulation", value: 30 },
                            { name: "Weight", value: 15 },
                            { name: "Color", value: 8 },
                            { name: "Other", value: 2 },
                          ]}
                          margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="name" type="category" />
                          <RechartsTooltip />
                          <Bar dataKey="value" fill="#8884d8" name="Issue Count" />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="clients">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Client distribution */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Client Distribution</CardTitle>
                        <CardDescription>By business type</CardDescription>
                      </div>
                      <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={clientDistributionData}
                            cx="50%"
                            cy="45%"
                            innerRadius={60}
                            outerRadius={80}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label
                          >
                            {clientDistributionData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Legend layout="vertical" verticalAlign="bottom" align="center" />
                          <RechartsTooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Client satisfaction */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Client Satisfaction</CardTitle>
                        <CardDescription>Rating by brand partners</CardDescription>
                      </div>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={[
                            { name: "Jan", rating: 4.2 },
                            { name: "Feb", rating: 4.5 },
                            { name: "Mar", rating: 4.7 },
                            { name: "Apr", rating: 4.6 },
                            { name: "May", rating: 4.8 },
                            { name: "Jun", rating: 4.9 },
                          ]}
                          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[3, 5]} />
                          <RechartsTooltip />
                          <Line 
                            type="monotone" 
                            dataKey="rating" 
                            stroke="#8884d8" 
                            activeDot={{ r: 8 }}
                            name="Satisfaction Rating"
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="kpis">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Key Performance Indicators</CardTitle>
                        <CardDescription>Tracking key manufacturing metrics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Production Efficiency</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current:</span>
                          <span className="font-medium">88.7%</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: "88.7%" }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">On-Time Delivery</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current:</span>
                          <span className="font-medium">96.3%</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">98%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: "96.3%" }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Quality Pass Rate</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current:</span>
                          <span className="font-medium">99.2%</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">99.5%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: "99.2%" }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Machine Uptime</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current:</span>
                          <span className="font-medium">92.8%</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">95%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: "92.8%" }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Resource Utilization</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current:</span>
                          <span className="font-medium">83.5%</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">90%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div 
                            className="bg-yellow-500 h-2 rounded-full" 
                            style={{ width: "83.5%" }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Sustainability Index</h3>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Current:</span>
                          <span className="font-medium">76.2%</span>
                        </div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Target:</span>
                          <span className="font-medium">85%</span>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full" 
                            style={{ width: "76.2%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Financial KPIs</CardTitle>
                        <CardDescription>Manufacturing cost metrics</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-4">Cost Per Unit</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <RechartsLineChart
                            data={[
                              { name: "Jan", cost: 1.25 },
                              { name: "Feb", cost: 1.22 },
                              { name: "Mar", cost: 1.18 },
                              { name: "Apr", cost: 1.15 },
                              { name: "May", cost: 1.12 },
                              { name: "Jun", cost: 1.10 },
                            ]}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Line 
                              type="monotone" 
                              dataKey="cost" 
                              stroke="#8884d8" 
                              name="Cost ($)"
                            />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-4">Cost Breakdown</h3>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: "Materials", value: 45 },
                                { name: "Labor", value: 25 },
                                { name: "Overhead", value: 20 },
                                { name: "Packaging", value: 10 },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label
                            >
                              {clientDistributionData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
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
