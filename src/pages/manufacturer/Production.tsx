
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Factory, Settings, ArrowLeft, Calendar, BarChart, Clock, AlertCircle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// Mock production data
const productionLines = [
  { 
    id: 1, 
    name: "Line A", 
    status: "Active", 
    product: "Organic Cereal", 
    efficiency: 92,
    daily_capacity: "10,000 units",
    next_maintenance: "2023-10-15"
  },
  { 
    id: 2, 
    name: "Line B", 
    status: "Maintenance", 
    product: "N/A", 
    efficiency: 0,
    daily_capacity: "8,000 units",
    next_maintenance: "2023-10-02"
  },
  { 
    id: 3, 
    name: "Line C", 
    status: "Active", 
    product: "Protein Bars", 
    efficiency: 87,
    daily_capacity: "15,000 units",
    next_maintenance: "2023-11-05"
  },
  { 
    id: 4, 
    name: "Line D", 
    status: "Active", 
    product: "Granola Packaging", 
    efficiency: 95,
    daily_capacity: "12,000 units",
    next_maintenance: "2023-10-22"
  },
  { 
    id: 5, 
    name: "Line E", 
    status: "Idle", 
    product: "N/A", 
    efficiency: 0,
    daily_capacity: "9,000 units",
    next_maintenance: "2023-10-18"
  }
];

// Mock alerts
const alerts = [
  { id: 1, type: "warning", message: "Line B maintenance scheduled for tomorrow", time: "2 hours ago" },
  { id: 2, type: "critical", message: "Raw material shortage for Line C", time: "1 day ago" },
  { id: 3, type: "info", message: "Quality check passed for Line A", time: "3 days ago" },
];

const Production = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Production Management - CPG Matchmaker";
    
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Maintenance":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Maintenance</Badge>;
      case "Idle":
        return <Badge variant="secondary">Idle</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

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
                <h1 className="text-3xl font-bold">Production Management</h1>
                <p className="text-muted-foreground">{user?.companyName} - Manufacturing Control Center</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </Button>
                <Button>
                  <Settings className="mr-2 h-4 w-4" />
                  Configure
                </Button>
              </div>
            </div>
          </div>
          
          {/* Production overview cards */}
          <div className="grid gap-4 md:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Production Lines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">3 Active</span>, 1 Maintenance, 1 Idle
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today's Production</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">37,000</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+5%</span> than yesterday
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Efficiency Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">91.3%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+2.1%</span> than last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-yellow-500">1 Needs attention</span>
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Production Lines</CardTitle>
                  <CardDescription>
                    Current status and efficiency of all production lines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Line</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Current Product</TableHead>
                        <TableHead>Efficiency</TableHead>
                        <TableHead>Daily Capacity</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productionLines.map((line) => (
                        <TableRow key={line.id}>
                          <TableCell className="font-medium">{line.name}</TableCell>
                          <TableCell>{getStatusBadge(line.status)}</TableCell>
                          <TableCell>{line.product}</TableCell>
                          <TableCell>
                            {line.status === "Active" ? (
                              <div className="w-full max-w-[100px]">
                                <div className="flex justify-between text-xs mb-1">
                                  <span>{line.efficiency}%</span>
                                </div>
                                <Progress value={line.efficiency} className="h-2" />
                              </div>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>{line.daily_capacity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  
                  <div className="mt-4">
                    <Button size="sm">View Detailed Analytics</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Maintenance Schedule</CardTitle>
                  <CardDescription>
                    Upcoming maintenance for production lines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Line</TableHead>
                        <TableHead>Next Maintenance</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {productionLines.map((line) => {
                        const now = new Date();
                        const maintenance = new Date(line.next_maintenance);
                        const daysUntil = Math.ceil((maintenance.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                        
                        let status;
                        if (line.status === "Maintenance") {
                          status = <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">In Progress</Badge>;
                        } else if (daysUntil <= 3) {
                          status = <Badge variant="outline" className="bg-red-500/10 text-red-500">Urgent</Badge>;
                        } else if (daysUntil <= 7) {
                          status = <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">Upcoming</Badge>;
                        } else {
                          status = <Badge variant="outline" className="bg-green-500/10 text-green-500">Scheduled</Badge>;
                        }
                        
                        return (
                          <TableRow key={line.id}>
                            <TableCell className="font-medium">{line.name}</TableCell>
                            <TableCell>{line.next_maintenance}</TableCell>
                            <TableCell>{status}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">Reschedule</Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Production Alerts</CardTitle>
                  <CardDescription>
                    Recent issues and notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex gap-3 p-3 border rounded-lg">
                        <div className="shrink-0">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                        </div>
                        <Button variant="ghost" size="sm" className="shrink-0">View</Button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="w-full">View All Alerts</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Quick Stats</CardTitle>
                  <CardDescription>
                    Today's production metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Average Cycle Time</span>
                      </div>
                      <span className="font-medium">4.2 min</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Quality Pass Rate</span>
                      </div>
                      <span className="font-medium">98.7%</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Factory className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Active Time</span>
                      </div>
                      <span className="font-medium">14.5 hrs</span>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-6">
                    <Factory className="mr-2 h-4 w-4" />
                    Production Dashboard
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Production;
