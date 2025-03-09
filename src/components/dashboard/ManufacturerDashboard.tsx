
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  Package, 
  Truck, 
  Bell, 
  BarChart3, 
  Users, 
  CheckCircle, 
  Calendar, 
  Gauge, 
  TestTube, 
  Clock, 
  AlertTriangle, 
  LineChart, 
  Boxes
} from "lucide-react";
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
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

// Mock data for charts
const productionData = [
  { name: "Jan", production: 800 },
  { name: "Feb", production: 1200 },
  { name: "Mar", production: 900 },
  { name: "Apr", production: 1500 },
  { name: "May", production: 1700 },
  { name: "Jun", production: 1400 },
  { name: "Jul", production: 1800 },
];

const capacityData = [
  { name: 'Utilized', value: 78 },
  { name: 'Available', value: 22 },
];

// New mock data for enhanced features
const qualityData = [
  { name: "Jan", defect: 1.2, rework: 2.1 },
  { name: "Feb", defect: 0.8, rework: 1.7 },
  { name: "Mar", defect: 1.4, rework: 2.3 },
  { name: "Apr", defect: 0.7, rework: 1.5 },
  { name: "May", defect: 0.6, rework: 1.2 },
  { name: "Jun", defect: 0.9, rework: 1.8 },
  { name: "Jul", defect: 0.5, rework: 1.1 },
];

const efficiencyData = [
  { name: "Line A", value: 93 },
  { name: "Line B", value: 85 },
  { name: "Line C", value: 90 },
  { name: "Line D", value: 88 },
  { name: "Line E", value: 78 },
];

const materialForecastData = [
  { name: "Organic Oats", current: 15000, forecast: 18000, unit: "kg" },
  { name: "Honey", current: 1200, forecast: 2500, unit: "liters" },
  { name: "Protein Powder", current: 8000, forecast: 7500, unit: "kg" },
  { name: "Glass Bottles", current: 5000, forecast: 12000, unit: "units" },
];

const scheduledProduction = [
  { 
    id: 1, 
    product: "Organic Cereal", 
    line: "Line A", 
    startDate: "2023-10-10", 
    endDate: "2023-10-15", 
    status: "Scheduled",
    completion: 0
  },
  { 
    id: 2, 
    product: "Protein Bars", 
    line: "Line C", 
    startDate: "2023-10-05", 
    endDate: "2023-10-12", 
    status: "In Progress",
    completion: 40 
  },
  { 
    id: 3, 
    product: "Energy Drinks", 
    line: "Line D", 
    startDate: "2023-10-18", 
    endDate: "2023-10-25", 
    status: "Scheduled",
    completion: 0
  },
];

const COLORS = ['#8884d8', '#e6e6e6', '#82ca9d', '#ffc658', '#ff8042'];

const ManufacturerDashboard = () => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="production">Production Planning</TabsTrigger>
          <TabsTrigger value="quality">Quality Control</TabsTrigger>
          <TabsTrigger value="efficiency">Efficiency Analytics</TabsTrigger>
          <TabsTrigger value="materials">Materials Forecast</TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Stats cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Production Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12,850</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+8.2%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Production Lines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5/7</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-yellow-500">2 in maintenance</span>
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+3</span> new this week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Quality Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98.5%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+0.5%</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Production Overview */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Production Overview</CardTitle>
                <CardDescription>
                  Monthly production volume across all lines
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={productionData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorProduction" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="production"
                        stroke="#8884d8"
                        fillOpacity={1}
                        fill="url(#colorProduction)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Production Capacity</CardTitle>
                <CardDescription>
                  Current utilization of production capacity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={capacityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        fill="#8884d8"
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {capacityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-4">
                  <Button size="sm">Optimize Capacity</Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Active Projects and Notifications */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Active Projects</CardTitle>
                <CardDescription>
                  Your ongoing production assignments
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Organic Cereal Production</p>
                      <p className="text-sm text-muted-foreground">For: Healthy Foods Co.</p>
                    </div>
                    <Badge>In Progress</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Truck className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Beverage Bottling Line</p>
                      <p className="text-sm text-muted-foreground">For: Fresh Drinks Inc.</p>
                    </div>
                    <Badge variant="outline">Scheduled</Badge>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Factory className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Custom Packaging Run</p>
                      <p className="text-sm text-muted-foreground">For: EcoPackage Solutions</p>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                </div>
                <div className="mt-4">
                  <Button size="sm" className="w-full">View All Projects</Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Recent updates and alerts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-500/10 flex items-center justify-center shrink-0">
                      <Bell className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Maintenance Alert</p>
                      <p className="text-xs text-muted-foreground">Line B scheduled for maintenance in 2 days</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Order Completed</p>
                      <p className="text-xs text-muted-foreground">Order #38214 has been completed and shipped</p>
                      <p className="text-xs text-muted-foreground mt-1">5 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                      <Users className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New Match Request</p>
                      <p className="text-xs text-muted-foreground">Healthy Snacks Co. wants to discuss a production partnership</p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button variant="outline" size="sm" className="w-full">View All Notifications</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Production Planning Tab */}
        <TabsContent value="production" className="space-y-6">
          {/* Production Planning Header */}
          <Card>
            <CardHeader>
              <CardTitle>Production Schedule</CardTitle>
              <CardDescription>
                Upcoming and ongoing production runs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledProduction.map((item) => (
                  <div key={item.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Factory className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.product}</h3>
                          <p className="text-sm text-muted-foreground">{item.line}</p>
                        </div>
                      </div>
                      <Badge variant={item.status === "In Progress" ? "default" : "outline"}>
                        {item.status}
                      </Badge>
                    </div>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Period:</span>
                        </div>
                        <span>{item.startDate} - {item.endDate}</span>
                      </div>
                      
                      {item.status === "In Progress" && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>Completion</span>
                            <span>{item.completion}%</span>
                          </div>
                          <Progress value={item.completion} className="h-2" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 mt-4">
                      <Button variant="outline" size="sm">Details</Button>
                      <Button size="sm">
                        {item.status === "Scheduled" ? "Start Production" : "View Progress"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Calendar
                </Button>
                <Button>
                  <Factory className="mr-2 h-4 w-4" />
                  Schedule New Run
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Capacity Planning */}
          <Card>
            <CardHeader>
              <CardTitle>Capacity Planning</CardTitle>
              <CardDescription>
                Production capacity forecasting and optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 p-4 border rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium">Current Capacity Utilization</h3>
                  <Badge variant="outline" className="text-yellow-500">78% Utilized</Badge>
                </div>
                
                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Maximum Daily Output:</span>
                    </div>
                    <span className="font-medium">45,000 units</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Factory className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Current Daily Output:</span>
                    </div>
                    <span className="font-medium">35,100 units</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Available Production Hours:</span>
                    </div>
                    <span className="font-medium">48 hours/day</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Button size="sm" variant="outline" className="w-full">
                    Run Capacity Optimization
                  </Button>
                </div>
              </div>
              
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={efficiencyData}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Efficiency']} />
                    <Bar dataKey="value" fill="#8884d8" barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Quality Control Tab */}
        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Quality Metrics</CardTitle>
                <CardDescription>
                  Monthly quality performance indicators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={qualityData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorDefect" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff8042" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ff8042" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorRework" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#ffc658" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="defect"
                        name="Defect Rate (%)"
                        stroke="#ff8042"
                        fillOpacity={1}
                        fill="url(#colorDefect)"
                      />
                      <Area
                        type="monotone"
                        dataKey="rework"
                        name="Rework Rate (%)"
                        stroke="#ffc658"
                        fillOpacity={1}
                        fill="url(#colorRework)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Quality Alerts</CardTitle>
                <CardDescription>
                  Recent quality issues requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-3 p-3 border rounded-lg bg-red-500/10">
                    <div className="shrink-0">
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Packaging Defects Detected</p>
                      <p className="text-xs text-muted-foreground">Line C - Rate above threshold (2.3%)</p>
                      <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">View</Button>
                  </div>
                  
                  <div className="flex gap-3 p-3 border rounded-lg bg-yellow-500/10">
                    <div className="shrink-0">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">Weight Variation Increasing</p>
                      <p className="text-xs text-muted-foreground">Line A - Approaching threshold</p>
                      <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                    </div>
                    <Button variant="ghost" size="sm" className="shrink-0">View</Button>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col items-center justify-center border rounded-lg p-4">
                      <TestTube className="h-8 w-8 text-green-500 mb-2" />
                      <p className="font-medium text-2xl">98.5%</p>
                      <p className="text-xs text-muted-foreground">Pass Rate</p>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center border rounded-lg p-4">
                      <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                      <p className="font-medium text-2xl">27</p>
                      <p className="text-xs text-muted-foreground">Days Without Major Issues</p>
                    </div>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  <TestTube className="mr-2 h-4 w-4" />
                  Quality Control Dashboard
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Efficiency Analytics Tab */}
        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Equipment Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87.3%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+2.1%</span> from last month
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Average Cycle Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 min</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">-0.3 min</span> from baseline
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Downtime Percentage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500">+0.8%</span> from last week
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Production Line Efficiency</CardTitle>
              <CardDescription>
                Comparative analysis of all production lines
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {efficiencyData.map((line) => (
                  <div key={line.name} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <LineChart className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{line.name}</span>
                      </div>
                      <span className={line.value >= 90 ? "text-green-500" : line.value >= 80 ? "text-yellow-500" : "text-red-500"}>
                        {line.value}%
                      </span>
                    </div>
                    <Progress value={line.value} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Target: 95%</span>
                      <span>Gap: {95 - line.value}%</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <Button variant="outline" className="w-full">
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Detailed Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Materials Forecast Tab */}
        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Raw Material Inventory Forecast</CardTitle>
              <CardDescription>
                Projected inventory levels based on production schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {materialForecastData.map((material, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Boxes className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{material.name}</span>
                      </div>
                      <Badge variant={material.current < material.forecast ? "outline" : "secondary"}>
                        {material.current < material.forecast ? "Reorder Needed" : "Sufficient"}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Current Inventory</p>
                        <p className="font-medium">{material.current.toLocaleString()} {material.unit}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Forecast Need (30 days)</p>
                        <p className="font-medium">{material.forecast.toLocaleString()} {material.unit}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2">
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${material.current < material.forecast ? 'bg-yellow-500' : 'bg-green-500'}`}
                          style={{ width: `${Math.min(100, (material.current / material.forecast) * 100)}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Current: {((material.current / material.forecast) * 100).toFixed(0)}%</span>
                        <span>of Forecast Need</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-between">
                <Button variant="outline">
                  Generate Purchase Orders
                </Button>
                <Button>
                  Update Forecast
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ManufacturerDashboard;
