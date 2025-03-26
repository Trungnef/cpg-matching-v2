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
  Factory, 
  TrendingUp, 
  TrendingDown, 
  Settings, 
  Package, 
  BarChart3, 
  Activity, 
  AlertCircle, 
  CheckCircle, 
  LineChart, 
  ShoppingCart,
  Loader2,
  ArrowRight,
  Clock,
  Calendar,
  Warehouse,
  Users,
  Plus,
  LayoutDashboard
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

// Mock data
const productionStats = {
  totalLines: 8,
  operational: 6,
  maintenance: 1,
  inactive: 1,
  totalProducts: 15,
  avgEfficiency: 86,
  totalOutput: "24,560 units"
};

const productionLines = [
  { id: 1, name: "Line A", status: "Operational", efficiency: 92, product: "Energy Bars", output: "3,400 units", nextMaintenance: "In 14 days" },
  { id: 2, name: "Line B", status: "Operational", efficiency: 88, product: "Protein Powder", output: "2,800 units", nextMaintenance: "In 8 days" },
  { id: 3, name: "Line C", status: "Maintenance", efficiency: 0, product: "Organic Cereal", output: "0 units", nextMaintenance: "In progress" },
  { id: 4, name: "Line D", status: "Operational", efficiency: 95, product: "Vitamin Tablets", output: "4,500 units", nextMaintenance: "In 21 days" },
  { id: 5, name: "Line E", status: "Operational", efficiency: 82, product: "Organic Snacks", output: "2,460 units", nextMaintenance: "In 5 days" },
];

const orders = [
  { id: 1, client: "Health Foods Co.", product: "Energy Bars", quantity: 12000, status: "In Production", deadline: "Sep 28, 2023" },
  { id: 2, client: "Nutrition Plus", product: "Protein Powder", quantity: 8000, status: "Completed", deadline: "Sep 15, 2023" },
  { id: 3, client: "Organic Brands Inc.", product: "Organic Cereal", quantity: 15000, status: "Scheduled", deadline: "Oct 10, 2023" },
  { id: 4, client: "Wellness Products", product: "Vitamin Tablets", quantity: 20000, status: "In Production", deadline: "Oct 5, 2023" },
];

const alerts = [
  { id: 1, type: "warning", message: "Line C maintenance running behind schedule", time: "2 hours ago" },
  { id: 2, type: "info", message: "New order received from Health Foods Co.", time: "5 hours ago" },
  { id: 3, type: "success", message: "Order #1042 completed and ready for shipment", time: "Yesterday" },
  { id: 4, type: "error", message: "Supply shortage for raw material #R-789", time: "Yesterday" },
];

interface ManufacturerDashboardProps {
  activeTab?: string;
}

const ManufacturerDashboard = ({ activeTab = "overview" }: ManufacturerDashboardProps) => {
  const { user } = useUser();

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Operational":
        return <Badge className="bg-green-500">Operational</Badge>;
      case "Maintenance":
        return <Badge className="bg-yellow-500">Maintenance</Badge>;
      case "Inactive":
        return <Badge className="bg-gray-500">Inactive</Badge>;
      case "In Production":
        return <Badge className="bg-blue-500">In Production</Badge>;
      case "Completed":
        return <Badge className="bg-green-500">Completed</Badge>;
      case "Scheduled":
        return <Badge className="bg-purple-500">Scheduled</Badge>;
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

  // Today's date formatted nicely
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Render components based on active tab
  const renderTabContent = () => {
    switch(activeTab) {
      case "overview":
  return (
          <>
            {/* Welcome section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-6 rounded-lg border">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0] || 'User'}!</h1>
                    <p className="text-muted-foreground">{today}</p>
                    <p className="mt-2 text-sm max-w-xl">
                      Your manufacturing operations are running smoothly. You have <span className="font-medium">2 urgent alerts</span> and <span className="font-medium">3 new partnership opportunities</span> to review.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button>
                      <Factory className="mr-2 h-4 w-4" />
                      Production Status
                    </Button>
                    <Button variant="outline">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analytics
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick actions */}
            <div className="mb-8">
              <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">Add New Product</div>
                    <div className="text-xs text-muted-foreground mt-1">Create product specification</div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Users className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">View Matches</div>
                    <div className="text-xs text-muted-foreground mt-1">Explore brand partnerships</div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">Production Report</div>
                    <div className="text-xs text-muted-foreground mt-1">View efficiency metrics</div>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Warehouse className="h-6 w-6 text-primary" />
                    </div>
                    <div className="font-medium">Manage Inventory</div>
                    <div className="text-xs text-muted-foreground mt-1">Check stock levels</div>
              </CardContent>
            </Card>
              </div>
            </div>
            
            {/* Quick stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Production Lines</CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{productionStats.totalLines}</div>
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-muted-foreground">
                        <span className="text-green-500 font-medium">{productionStats.operational}</span> operational, 
                        <span className="text-yellow-500 font-medium ml-1">{productionStats.maintenance}</span> in maintenance
                      </span>
                    </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Average Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{productionStats.avgEfficiency}%</div>
                    <div className="mt-1">
                      <Progress value={productionStats.avgEfficiency} className="h-1" />
                    </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{productionStats.totalProducts}</div>
                    <div className="flex items-center mt-1 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+3</span>
                      <span className="text-muted-foreground ml-1">since last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Daily Output</CardTitle>
              </CardHeader>
              <CardContent>
                    <div className="text-2xl font-bold">{productionStats.totalOutput}</div>
                    <div className="flex items-center mt-1 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-500 font-medium">+8.2%</span>
                      <span className="text-muted-foreground ml-1">from yesterday</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
            {/* Two column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left column - Upcoming tasks and calendar */}
              <div className="space-y-8">
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
            
                {/* Upcoming Schedule */}
            <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Upcoming Schedule</CardTitle>
                      <Button variant="ghost" size="sm" className="h-8 px-2">
                        <Calendar className="mr-1 h-4 w-4" />
                        Calendar
                      </Button>
                    </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="flex flex-col items-center">
                          <div className="text-xs font-medium">Today</div>
                          <div className="text-lg font-bold">15</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Production Line C Maintenance</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" /> 10:00 AM - 2:00 PM
                    </div>
                    </div>
                  </div>
                      <div className="flex items-start gap-3 pb-3 border-b">
                        <div className="flex flex-col items-center">
                          <div className="text-xs font-medium">Wed</div>
                          <div className="text-lg font-bold">16</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Meeting with Natural Foods Inc</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" /> 11:30 AM - 12:30 PM
                    </div>
                    </div>
                  </div>
                      <div className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className="text-xs font-medium">Fri</div>
                          <div className="text-lg font-bold">18</div>
                    </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">Inventory Audit</div>
                          <div className="text-xs text-muted-foreground flex items-center mt-1">
                            <Clock className="h-3 w-3 mr-1" /> 9:00 AM - 4:00 PM
                    </div>
                  </div>
                </div>
                </div>
              </CardContent>
            </Card>
          </div>

              {/* Right column - Brand opportunities and Production Status */}
              <div className="lg:col-span-2 space-y-8">
                {/* Active Orders */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Active Production Orders</CardTitle>
                        <CardDescription>Current manufacturing in progress</CardDescription>
                      </div>
                      <Button>+ New Order</Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Client</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Deadline</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="font-medium">{order.client}</TableCell>
                            <TableCell>{order.product}</TableCell>
                            <TableCell>{order.quantity.toLocaleString()}</TableCell>
                            <TableCell>{getStatusBadge(order.status)}</TableCell>
                            <TableCell>{order.deadline}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">View All Orders</Button>
                  </CardFooter>
                </Card>

                {/* Brand Opportunities */}
          <Card>
            <CardHeader>
                      <CardTitle>Brand Opportunities</CardTitle>
                      <CardDescription>Potential brand partnerships</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                        <div className="flex items-start space-x-4 border-b pb-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Natural Foods Inc</p>
                            <p className="text-muted-foreground text-xs">Looking for organic snack production</p>
                            <p className="text-muted-foreground text-xs mt-1">95% match with your capabilities</p>
                        </div>
                          <Button size="sm">Connect</Button>
                    </div>
                    
                        <div className="flex items-start space-x-4 border-b pb-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Wellness Products Co.</p>
                            <p className="text-muted-foreground text-xs">Seeking vitamin supplement production</p>
                            <p className="text-muted-foreground text-xs mt-1">88% match with your capabilities</p>
                          </div>
                          <Button size="sm">Connect</Button>
                      </div>
                      
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-2 rounded-full">
                            <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                            <p className="font-medium text-sm">Fitness Nutrition</p>
                            <p className="text-muted-foreground text-xs">Looking for protein bar manufacturer</p>
                            <p className="text-muted-foreground text-xs mt-1">92% match with your capabilities</p>
                          </div>
                          <Button size="sm">Connect</Button>
                        </div>
                    </div>
                  </CardContent>
                    <CardFooter>
                      <Button variant="outline" className="w-full">
                        View All Opportunities
                      </Button>
                    </CardFooter>
                </Card>
              </div>
            </div>
          </>
        );
        
      case "production":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Production Lines Status</CardTitle>
              <CardDescription>Current status and efficiency of all production lines</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Line</TableHead>
                    <TableHead>Current Product</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Efficiency</TableHead>
                    <TableHead>Daily Output</TableHead>
                    <TableHead>Next Maintenance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productionLines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell className="font-medium">{line.name}</TableCell>
                      <TableCell>{line.product}</TableCell>
                      <TableCell>{getStatusBadge(line.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={line.efficiency} className="h-2 w-20" />
                          <span className="text-sm">{line.efficiency}%</span>
              </div>
                      </TableCell>
                      <TableCell>{line.output}</TableCell>
                      <TableCell>{line.nextMaintenance}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                View Production Details
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
          
      case "orders":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Current Orders</CardTitle>
              <CardDescription>Active production orders and schedules</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Deadline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.client}</TableCell>
                      <TableCell>{order.product}</TableCell>
                      <TableCell>{order.quantity.toLocaleString()}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell>{order.deadline}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                View All Orders
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        );
        
      case "performance":
        return (
          <Card>
            <CardHeader>
              <Tabs defaultValue="efficiency">
                <div className="flex items-center justify-between">
                  <CardTitle>Performance Overview</CardTitle>
                  <TabsList>
                    <TabsTrigger value="efficiency">Efficiency</TabsTrigger>
                    <TabsTrigger value="output">Output</TabsTrigger>
                    <TabsTrigger value="quality">Quality</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>Production performance metrics over time</CardDescription>
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
                  <p className="text-xs text-muted-foreground">Overall Efficiency</p>
                  <p className="text-lg font-medium">86.5%</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Average Output</p>
                  <p className="text-lg font-medium">3,072 units/day</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Quality Rating</p>
                  <p className="text-lg font-medium text-green-500">A+</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        );
        
      case "opportunities":
        return (
          <Card>
            <CardHeader>
              <CardTitle>Supply Chain Insights</CardTitle>
              <CardDescription>Material status and supplier metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4 border-b pb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Settings className="h-5 w-5 text-primary" />
                      </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Raw Material Inventory</p>
                    <div className="flex items-center mt-1">
                      <Progress value={72} className="h-2 w-full mr-2" />
                      <span className="text-sm">72%</span>
                    </div>
                    <p className="text-muted-foreground text-xs mt-1">3 materials below reorder threshold</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                    </div>
                    
                <div className="flex items-start space-x-4 border-b pb-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Factory className="h-5 w-5 text-primary" />
                      </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Supplier Performance</p>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      <div>
                        <p className="text-xs text-muted-foreground">On-time</p>
                        <p className="text-sm font-medium">92%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Quality</p>
                        <p className="text-sm font-medium">96%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cost</p>
                        <p className="text-sm font-medium text-green-500">-3.5%</p>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
              </div>
              
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">Logistics Status</p>
                    <p className="text-muted-foreground text-xs">5 inbound shipments in transit</p>
                    <p className="text-muted-foreground text-xs mt-1">3 outbound shipments scheduled today</p>
                  </div>
                  <Button size="sm" variant="outline">View</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Supply Chain Dashboard
              </Button>
            </CardFooter>
          </Card>
        );
        
      default:
        return (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin mr-2" />
            <span>Loading...</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderTabContent()}
    </div>
  );
};

export default ManufacturerDashboard;
