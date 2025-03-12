import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  BarChart4,
  Building2,
  Factory,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  LogOut,
  Truck,
  Warehouse,
  Handshake,
  User,
  Shield,
  PlusCircle,
  Filter,
  ArrowLeft,
  Search,
  MoreVertical,
  Tag,
  Box,
  UserPlus,
  Clock,
  DollarSign,
  ThumbsUp,
  AlertTriangle,
  X,
  Check,
  MessageSquare,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  LineChart,
  BarChart3,
  MapPin,
  CheckCircle,
  Star,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import ManufacturerDashboard from "@/components/dashboard/ManufacturerDashboard";
import BrandDashboard from "@/components/dashboard/BrandDashboard";
import RetailerDashboard from "@/components/dashboard/RetailerDashboard";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock product data
const products = [
  {
    id: 1,
    name: "Organic Cereal",
    category: "Food",
    status: "Active",
    moq: 1000,
    capacity: "15,000 units/day",
    clients: 3,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Energy Bars",
    category: "Food",
    status: "Active",
    moq: 2000,
    capacity: "12,000 units/day",
    clients: 2,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Protein Shake",
    category: "Beverage",
    status: "Development",
    moq: 5000,
    capacity: "8,000 units/day",
    clients: 0,
    image: "/placeholder.svg"
  }
];

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

// Mock suppliers data
const suppliers = [
  {
    id: 1,
    name: "Organic Farms Co.",
    category: "Raw Materials",
    status: "Active",
    reliability: "98%",
    leadTime: "3-5 days",
    materials: 5,
    relationship: "4 years",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Premium Packaging Ltd.",
    category: "Packaging",
    status: "Active",
    reliability: "95%",
    leadTime: "7-10 days",
    materials: 8,
    relationship: "3 years",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Global Ingredients Inc.",
    category: "Raw Materials",
    status: "Under Review",
    reliability: "87%",
    leadTime: "10-14 days",
    materials: 3,
    relationship: "1 year",
    image: "/placeholder.svg"
  }
];

// Mock inventory data
const inventory = [
  {
    id: 1,
    name: "Organic Oats",
    category: "Raw Materials",
    status: "In Stock",
    quantity: 15000,
    unit: "kg",
    threshold: 5000,
    usedIn: 3,
    location: "Warehouse A",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Honey",
    category: "Raw Materials",
    status: "Low Stock",
    quantity: 1200,
    unit: "liters",
    threshold: 1500,
    usedIn: 4,
    location: "Warehouse B",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Protein Powder",
    category: "Raw Materials",
    status: "In Stock",
    quantity: 8000,
    unit: "kg",
    threshold: 3000,
    usedIn: 2,
    location: "Warehouse A",
    image: "/placeholder.svg"
  }
];

// Mock matches data
const potentialMatches = [
  {
    id: 1,
    companyName: "Green Foods Inc.",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Organic food brand looking for cereal manufacturer",
    requestedProduct: "Organic Cereal",
    matchScore: 92,
    location: "San Francisco, CA",
    size: "Medium",
    status: "New"
  },
  {
    id: 2,
    companyName: "Fitness Nutrition Co.",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Sports nutrition brand expanding product line",
    requestedProduct: "Protein Bars",
    matchScore: 88,
    location: "Denver, CO",
    size: "Large",
    status: "New"
  },
  {
    id: 3,
    companyName: "Healthy Snacks Ltd.",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Healthy snack company seeking manufacturing partner",
    requestedProduct: "Trail Mix",
    matchScore: 85,
    location: "Portland, OR",
    size: "Small",
    status: "Reviewed"
  },
  {
    id: 4,
    companyName: "Natural Beverages",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Beverage company looking to expand production",
    requestedProduct: "Organic Juice",
    matchScore: 79,
    location: "Austin, TX",
    size: "Medium",
    status: "Reviewed"
  }
];

const activeMatches = [
  {
    id: 101,
    companyName: "Eco-Friendly Foods",
    role: "brand",
    logo: "/placeholder.svg",
    product: "Organic Cereal",
    status: "Contract Negotiation",
    lastActivity: "2 days ago",
    nextMeeting: "2023-10-05"
  },
  {
    id: 102,
    companyName: "Wellness Nutrition",
    role: "brand",
    logo: "/placeholder.svg",
    product: "Energy Bars",
    status: "Sample Production",
    lastActivity: "5 days ago",
    nextMeeting: "2023-10-12"
  },
  {
    id: 103,
    companyName: "Organic Life Foods",
    role: "brand",
    logo: "/placeholder.svg",
    product: "Organic Juice",
    status: "Active Production",
    lastActivity: "1 day ago",
    nextMeeting: "2023-10-08"
  }
];

// Mock data for analytics charts
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

// Mock manufacturers data
const manufacturers = [
  {
    id: 1,
    name: "Premium Foods Manufacturing",
    category: "Food & Beverage",
    status: "Active Partner",
    location: "Portland, OR",
    certifications: ["Organic", "Kosher", "Non-GMO"],
    products: 3,
    image: "/placeholder.svg",
    matchScore: 98
  },
  {
    id: 2,
    name: "Sustainable Nutrition Inc.",
    category: "Nutrition & Supplements",
    status: "Active Partner",
    location: "Boulder, CO",
    certifications: ["Organic", "Vegan", "B Corp"],
    products: 2,
    image: "/placeholder.svg",
    matchScore: 95
  },
  {
    id: 3,
    name: "Nature's Best Beverages",
    category: "Beverages",
    status: "Active Partner",
    location: "San Diego, CA",
    certifications: ["Fair Trade", "Non-GMO"],
    products: 1,
    image: "/placeholder.svg",
    matchScore: 92
  },
  {
    id: 4,
    name: "Eco-Packaging Solutions",
    category: "Packaging",
    status: "Potential Match",
    location: "Seattle, WA",
    certifications: ["Sustainable", "Recyclable"],
    products: 0,
    image: "/placeholder.svg",
    matchScore: 94
  },
  {
    id: 5,
    name: "GreenLeaf Co-Packing",
    category: "Contract Manufacturing",
    status: "Potential Match",
    location: "Minneapolis, MN",
    certifications: ["Organic", "B Corp"],
    products: 0,
    image: "/placeholder.svg",
    matchScore: 90
  },
  {
    id: 6,
    name: "Harvest & Co. Manufacturing",
    category: "Food & Beverage",
    status: "Potential Match",
    location: "Austin, TX",
    certifications: ["Organic", "Kosher"],
    products: 0,
    image: "/placeholder.svg",
    matchScore: 87
  }
];

// Mock brands data
const brandsData = [
  {
    id: 1,
    name: "Green Earth Foods",
    category: "Organic Foods",
    status: "Active Partner",
    products: 12,
    relationship: "3 years",
    rating: 4.8,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Pure Wellness",
    category: "Health Supplements",
    status: "Active Partner",
    products: 8,
    relationship: "2 years",
    rating: 4.5,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Natural Living",
    category: "Household Products",
    status: "Negotiating",
    products: 0,
    relationship: "Prospect",
    rating: 4.2,
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Fresh Harvest",
    category: "Organic Foods",
    status: "Active Partner",
    products: 5,
    relationship: "1 year",
    rating: 4.6,
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Eco Essentials",
    category: "Sustainable Products",
    status: "Onboarding",
    products: 3,
    relationship: "New Partner",
    rating: 4.0,
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Vital Nutrition",
    category: "Health Supplements",
    status: "Inactive",
    products: 0,
    relationship: "Past Partner",
    rating: 3.7,
    image: "/placeholder.svg"
  }
];

// Mock retailer brand partners data
const retailerBrands = [
  {
    id: 1,
    name: "Green Earth Organics",
    category: "Food & Beverage",
    status: "Active",
    products: 8,
    topSeller: "Organic Breakfast Cereal",
    customerRating: 4.8,
    image: "/placeholder.svg",
    certifications: ["Organic", "Non-GMO", "Sustainable"]
  },
  {
    id: 2,
    name: "Pure Nutrition",
    category: "Health & Wellness",
    status: "Active",
    products: 5,
    topSeller: "Plant Protein Powder",
    customerRating: 4.6,
    image: "/placeholder.svg",
    certifications: ["Vegan", "Gluten-Free"]
  },
  {
    id: 3,
    name: "Clean Living",
    category: "Household",
    status: "Active",
    products: 6,
    topSeller: "Eco-Friendly Dish Soap",
    customerRating: 4.7,
    image: "/placeholder.svg",
    certifications: ["Eco-Friendly", "Biodegradable"]
  },
  {
    id: 4,
    name: "Fresh Press",
    category: "Beverages",
    status: "Active",
    products: 4,
    topSeller: "Cold Pressed Orange Juice",
    customerRating: 4.5,
    image: "/placeholder.svg",
    certifications: ["Organic", "No Added Sugar"]
  },
  {
    id: 5,
    name: "Nature's Harvest",
    category: "Snacks",
    status: "Inactive",
    products: 3,
    topSeller: "Organic Trail Mix",
    customerRating: 4.3,
    image: "/placeholder.svg",
    certifications: ["Organic", "Non-GMO"]
  },
  {
    id: 6,
    name: "Wellness Essentials",
    category: "Personal Care",
    status: "Pending",
    products: 0,
    topSeller: "N/A",
    customerRating: 0,
    image: "/placeholder.svg",
    certifications: ["Cruelty-Free", "Natural Ingredients"]
  }
];

const Dashboard = () => {
  const { role, isAuthenticated, user, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("overview");
  
  useEffect(() => {
    document.title = `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard - CPG Matchmaker`;
    
    // If not authenticated, redirect to auth page
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    }
  }, [role, navigate, isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/auth?type=signin");
    toast({
      title: "Logged out",
      description: "You have been successfully logged out."
    });
  };

  // Status badge helper for Products
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Development":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Development</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "New":
        return <Badge className="bg-blue-500">New</Badge>;
      case "Reviewed":
        return <Badge variant="outline">Reviewed</Badge>;
      case "Contract Negotiation":
        return <Badge className="bg-yellow-500">Contract</Badge>;
      case "Sample Production":
        return <Badge className="bg-purple-500">Sampling</Badge>;
      case "Active Production":
        return <Badge className="bg-green-500">Active</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Helper function for inventory level
  const getInventoryLevel = (quantity: number, threshold: number) => {
    if (quantity === 0) return 0;
    if (quantity < threshold) return (quantity / threshold) * 100;
    return 100;
  };
  
  // Render the dashboard content based on role
  const renderRoleSpecificDashboard = () => {
    // If Production view is active, render Production content
    if (activeView === "production") {
      return (
        <div>
          {/* Production management content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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
          
          {/* Production overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Lines</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">75%</span> of total capacity
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overall Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">91.3%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+2.1%</span> from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Today's Output</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28,500</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">On target</span> for daily goal
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
                  <span className="text-red-500">1 critical</span> alert requiring attention
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Production Lines Status</CardTitle>
                  <CardDescription>
                    Current status of all production lines
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
              
              <Card>
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
                        <BarChart4 className="h-4 w-4 text-muted-foreground" />
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
      );
    }
    
    // If Products view is active, render Products content
    if (activeView === "products") {
      return (
        <div>
          {/* Product management content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Product Management</h1>
              <p className="text-muted-foreground">{user?.companyName} - Manufacturing Capabilities</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
          
          {/* Search and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search products..." className="pl-10" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">4 Active</span>, 1 In Development
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Client Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-blue-500">2 Potential</span> matches in pipeline
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Product grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription>{product.category}</CardDescription>
                    </div>
                    {getStatusBadge(product.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">MOQ:</span>
                      <span className="ml-1 font-medium">{product.moq}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Box className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Clients:</span>
                      <span className="ml-1 font-medium">{product.clients}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Daily Capacity:</span>
                    <span className="ml-1 font-medium">{product.capacity}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button size="sm" variant="outline">View Details</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Product</DropdownMenuItem>
                      <DropdownMenuItem>View Analytics</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={product.status === "Active" ? "text-red-500" : "text-green-500"}>
                        {product.status === "Active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add new product card */}
            <Card className="flex flex-col items-center justify-center h-full border-dashed">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Add New Product</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Showcase your manufacturing capabilities
                </p>
                <Button>Create Product</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    // If Suppliers view is active, render Suppliers content
    if (activeView === "suppliers") {
      return (
        <div>
          {/* Supplier management content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Supplier Management</h1>
              <p className="text-muted-foreground">{user?.companyName} - Supply Chain Partners</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add Supplier
              </Button>
            </div>
          </div>
          
          {/* Search and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search suppliers..." className="pl-10" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-blue-500">1 supplier</span> under review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Reliability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+1.5%</span> from last quarter
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Suppliers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src={supplier.image}
                    alt={supplier.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <CardDescription>{supplier.category}</CardDescription>
                    </div>
                    {getStatusBadge(supplier.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Reliability:</span>
                      <span className="ml-1 font-medium">{supplier.reliability}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Lead Time:</span>
                      <span className="ml-1 font-medium">{supplier.leadTime}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Materials:</span>
                      <span className="ml-1 font-medium">{supplier.materials}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Relationship:</span>
                      <span className="ml-1 font-medium">{supplier.relationship}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button size="sm" variant="outline">View Details</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                      <DropdownMenuItem>View Materials</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={supplier.status === "Active" ? "text-red-500" : "text-green-500"}>
                        {supplier.status === "Active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add new supplier card */}
            <Card className="flex flex-col items-center justify-center h-full border-dashed">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Add New Supplier</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Expand your supply chain network
                </p>
                <Button>Add Supplier</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    // If Inventory view is active, render Inventory content
    if (activeView === "inventory") {
      return (
        <div>
          {/* Inventory management content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Inventory Management</h1>
              <p className="text-muted-foreground">{user?.companyName} - Raw Materials & Packaging</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Inventory
              </Button>
            </div>
          </div>
          
          {/* Search and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search inventory..." className="pl-10" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">6</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500">2 items</span> below threshold
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$124,800</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+$12,500</span> from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Inventory grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{item.name}</CardTitle>
                      <CardDescription>{item.category}</CardDescription>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-2">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>Inventory Level</span>
                      <span className={`font-medium ${item.quantity < item.threshold ? 'text-yellow-500' : 'text-green-500'}`}>
                        {item.quantity} {item.unit}
                      </span>
                    </div>
                    <Progress value={getInventoryLevel(item.quantity, item.threshold)} />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Threshold: {item.threshold} {item.unit}</span>
                      {item.quantity < item.threshold && (
                        <span className="flex items-center text-yellow-500">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          Reorder
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Used in:</span>
                      <span className="ml-1 font-medium">{item.usedIn} products</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Warehouse className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-1 font-medium">{item.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button size="sm" variant="outline">View Details</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Update Stock</DropdownMenuItem>
                      <DropdownMenuItem>Order More</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>View History</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add new inventory item card */}
            <Card className="flex flex-col items-center justify-center h-full border-dashed">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Add New Item</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Track raw materials or packaging
                </p>
                <Button>Add Item</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      );
    }
    
    // If Matches view is active, render Matches content
    if (activeView === "matches") {
      return (
        <div>
          {/* Partnership matches content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Partnership Matches</h1>
              <p className="text-muted-foreground">{user?.companyName} - Find and manage brand partnerships</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button>
                <Building2 className="mr-2 h-4 w-4" />
                Update Preferences
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="potential" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="potential">Potential Matches</TabsTrigger>
              <TabsTrigger value="active">Active Partnerships</TabsTrigger>
            </TabsList>
            
            <TabsContent value="potential">
              {/* Search and stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search potential matches..." className="pl-10" />
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Match Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-blue-500">2 New</span>, 2 Reviewed
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Potential matches list */}
              <div className="space-y-4">
                {potentialMatches.map((match) => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Company logo and basic info */}
                        <div className="md:w-3/12 flex flex-row md:flex-col gap-4 items-center md:items-start">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={match.logo} alt={match.companyName} />
                            <AvatarFallback>{match.companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{match.companyName}</h3>
                            <Badge variant="outline" className="mt-1 capitalize">{match.role}</Badge>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <Building2 className="h-3 w-3 mr-1" /> {match.location}
                            </div>
                          </div>
                        </div>
                        
                        {/* Match details */}
                        <div className="md:w-6/12 space-y-3">
                          <div className="flex items-center gap-1">
                            {getStatusBadge(match.status)}
                            <span className="text-sm ml-2">Looking for: <span className="font-medium">{match.requestedProduct}</span></span>
                          </div>
                          <p className="text-sm">{match.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">Organic</Badge>
                            <Badge variant="secondary">Non-GMO</Badge>
                            <Badge variant="secondary">Sustainable</Badge>
                          </div>
                        </div>
                        
                        {/* Match score and actions */}
                        <div className="md:w-3/12 flex flex-row md:flex-col justify-between items-center md:items-end">
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-2">
                              <span className="font-bold text-lg">{match.matchScore}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Match Score</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Button size="sm" className="w-full">View Details</Button>
                            <div className="flex gap-2">
                              <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button size="icon" className="h-9 w-9 rounded-full">
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              {/* Active partnerships */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search active partnerships..." className="pl-10" />
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Partners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">1 Active</span>, 2 In Process
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Active partnerships list */}
              <div className="space-y-4">
                {activeMatches.map((match) => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Company logo and basic info */}
                        <div className="md:w-3/12 flex flex-row md:flex-col gap-4 items-center md:items-start">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={match.logo} alt={match.companyName} />
                            <AvatarFallback>{match.companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{match.companyName}</h3>
                            <Badge variant="outline" className="mt-1 capitalize">{match.role}</Badge>
                            <p className="text-sm mt-2">
                              Product: <span className="font-medium">{match.product}</span>
                            </p>
                          </div>
                        </div>
                        
                        {/* Partnership details */}
                        <div className="md:w-6/12 space-y-3">
                          <div>
                            {getStatusBadge(match.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Last activity:</span>
                              <span>{match.lastActivity}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Next meeting:</span>
                              <span>{match.nextMeeting}</span>
                            </div>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm">
                              {match.status === "Contract Negotiation" && "Finalizing production agreement and pricing."}
                              {match.status === "Sample Production" && "Producing samples for brand approval and testing."}
                              {match.status === "Active Production" && "Currently in full production with regular shipments."}
                            </p>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="md:w-3/12 flex flex-row md:flex-col justify-between items-center md:items-end gap-2">
                          <Button size="sm" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    }
    
    // If Analytics view is active, render Analytics content
    if (activeView === "analytics") {
      return (
        <div>
          {/* Analytics dashboard content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
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
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quality metrics over time */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Quality Metrics</CardTitle>
                        <CardDescription>Defect rate and overall quality score</CardDescription>
                      </div>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={qualityMetricsData}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis yAxisId="left" orientation="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <RechartsTooltip />
                          <Legend />
                          <Line yAxisId="right" type="monotone" dataKey="qualityScore" stroke="#8884d8" activeDot={{ r: 8 }} name="Quality Score" />
                          <Line yAxisId="left" type="monotone" dataKey="defectRate" stroke="#ff7300" name="Defect Rate %" />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Top quality issues */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Top Quality Issues</CardTitle>
                        <CardDescription>Most common quality problems</CardDescription>
                      </div>
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart
                          layout="vertical"
                          data={[
                            { name: "Packaging Defects", value: 42 },
                            { name: "Color Variation", value: 28 },
                            { name: "Weight Issues", value: 23 },
                            { name: "Label Errors", value: 15 },
                            { name: "Contamination", value: 11 },
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
                        <CardDescription>Quarterly satisfaction ratings</CardDescription>
                      </div>
                      <LineChart className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={[
                            { quarter: "Q1 2022", rating: 4.6 },
                            { quarter: "Q2 2022", rating: 4.7 },
                            { quarter: "Q3 2022", rating: 4.8 },
                            { quarter: "Q4 2022", rating: 4.9 },
                            { quarter: "Q1 2023", rating: 4.9 },
                            { quarter: "Q2 2023", rating: 4.8 },
                          ]}
                          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="quarter" />
                          <YAxis domain={[4.0, 5.0]} />
                          <RechartsTooltip />
                          <Legend />
                          <Line type="monotone" dataKey="rating" stroke="#8884d8" activeDot={{ r: 8 }} />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="kpis">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Efficiency KPIs */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Efficiency KPIs</CardTitle>
                        <CardDescription>Key production efficiency metrics</CardDescription>
                      </div>
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">OEE (Overall Equipment Effectiveness)</span>
                          <span className="text-sm font-medium">87.4%</span>
                        </div>
                        <Progress value={87.4} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Capacity Utilization</span>
                          <span className="text-sm font-medium">92.1%</span>
                        </div>
                        <Progress value={92.1} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Changeover Time Efficiency</span>
                          <span className="text-sm font-medium">78.5%</span>
                        </div>
                        <Progress value={78.5} />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Energy Efficiency</span>
                          <span className="text-sm font-medium">85.0%</span>
                        </div>
                        <Progress value={85} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Cost KPIs */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Cost KPIs</CardTitle>
                        <CardDescription>Cost-related performance indicators</CardDescription>
                      </div>
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Cost per Unit</p>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">$1.24</span>
                            <Badge className="ml-2 bg-green-500">-3.1%</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Labor Cost</p>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">$387K</span>
                            <Badge className="ml-2 bg-green-500">-1.8%</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Materials Cost</p>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">$1.2M</span>
                            <Badge variant="destructive" className="ml-2">+2.4%</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Energy Cost</p>
                          <div className="flex items-center">
                            <span className="text-2xl font-bold">$215K</span>
                            <Badge variant="destructive" className="ml-2">+4.7%</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="text-sm font-medium mb-2">Cost Breakdown</h4>
                        <div className="grid grid-cols-4 gap-2">
                          <div className="flex flex-col items-center text-center">
                            <div className="h-2 w-full bg-blue-500 rounded-full mb-1"></div>
                            <span className="text-xs text-muted-foreground">Materials</span>
                            <span className="text-xs font-medium">58%</span>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <div className="h-2 w-full bg-green-500 rounded-full mb-1"></div>
                            <span className="text-xs text-muted-foreground">Labor</span>
                            <span className="text-xs font-medium">22%</span>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <div className="h-2 w-full bg-purple-500 rounded-full mb-1"></div>
                            <span className="text-xs text-muted-foreground">Energy</span>
                            <span className="text-xs font-medium">12%</span>
                          </div>
                          <div className="flex flex-col items-center text-center">
                            <div className="h-2 w-full bg-yellow-500 rounded-full mb-1"></div>
                            <span className="text-xs text-muted-foreground">Other</span>
                            <span className="text-xs font-medium">8%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      );
    }
    
    // If Manufacturers view is active, render Manufacturers content
    if (activeView === "manufacturers") {
      return (
        <div>
          {/* Manufacturing partners content */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold">Manufacturing Partners</h1>
              <p className="text-muted-foreground">{user?.companyName} - Find & Manage Manufacturers</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button>
                <Search className="mr-2 h-4 w-4" />
                Find New Partners
              </Button>
            </div>
          </div>
          
          {/* Search and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search manufacturers..." className="pl-10" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">6 Products</span> in production
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Potential Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-blue-500">3</span> new this month
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Manufacturers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manufacturers.map((manufacturer) => (
              <Card key={manufacturer.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src={manufacturer.image}
                    alt={manufacturer.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{manufacturer.name}</CardTitle>
                      <CardDescription>{manufacturer.category}</CardDescription>
                    </div>
                    {getManufacturerStatusBadge(manufacturer.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{manufacturer.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {manufacturer.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    {getMatchScoreBadge(manufacturer.matchScore)}
                    <span className="text-sm text-muted-foreground">
                      {manufacturer.products} {manufacturer.products === 1 ? 'product' : 'products'}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button size="sm" variant="outline">View Profile</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Contact</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {manufacturer.status === "Potential Match" ? (
                        <DropdownMenuItem className="text-green-500">Add as Partner</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-amber-500">Manage Relationship</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      );
    }
    
    // If Brands view is active, render Brands content
    if (activeView === "brands") {
      if (role === "brand") {
        // Brand-specific Brands view (partnership management)
        return (
          <div>
            {/* Brand partnerships content */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Brand Partnerships</h1>
                <p className="text-muted-foreground">{user?.companyName} - Partner Brands Management</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  Add New Partner
                </Button>
              </div>
            </div>
            
            {/* Search and stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search partners..." className="pl-10" />
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Partners</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">4</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-blue-500">2 potential</span> partners in pipeline
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Products Listed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">28</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">+3</span> added this month
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Brands grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brandsData.map((brand) => (
                <Card key={brand.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img 
                      src={brand.image}
                      alt={brand.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{brand.name}</CardTitle>
                        <CardDescription>{brand.category}</CardDescription>
                      </div>
                      {getStatusBadge(brand.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2 pb-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center text-sm">
                        <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Products:</span>
                        <span className="ml-1 font-medium">{brand.products}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Rating:</span>
                        <span className="ml-1 font-medium">{brand.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Relationship:</span>
                      <span className="ml-1 font-medium">{brand.relationship}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button size="sm" variant="outline">View Details</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Partnership</DropdownMenuItem>
                        <DropdownMenuItem>View Products</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className={brand.status === "Active Partner" ? "text-red-500" : "text-green-500"}>
                          {brand.status === "Active Partner" ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
              
              {/* Add new partner card */}
              <Card className="flex flex-col items-center justify-center h-full border-dashed">
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">Add New Partner</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Expand your brand network
                  </p>
                  <Button>Add Partner</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      } else if (role === "retailer") {
        // Retailer-specific Brands view
        return (
          <div>
            {/* Brand partners content */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold">Brand Partners</h1>
                <p className="text-muted-foreground">{user?.companyName} - Brand relationships management</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Discover Brands
                </Button>
              </div>
            </div>
            
            {/* Search and stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input placeholder="Search brands..." className="pl-10" />
                </div>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Active Brands</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">26</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-green-500">+3</span> new this quarter
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Products Carried</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">154</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    <span className="text-blue-500">12</span> new this month
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Brands grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {retailerBrands.map((brand) => (
                <Card key={brand.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <img 
                      src={brand.image}
                      alt={brand.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{brand.name}</CardTitle>
                        <CardDescription>{brand.category}</CardDescription>
                      </div>
                      {getStatusBadge(brand.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm">
                        <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="text-muted-foreground">Products:</span>
                        <span className="ml-1 font-medium">{brand.products}</span>
                      </div>
                      <div className="text-sm">
                        {brand.customerRating > 0 ? `${brand.customerRating} ★` : 'N/A'}
                      </div>
                    </div>
                    
                    {brand.products > 0 && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Top Seller:</span>
                        <span className="ml-1 font-medium">{brand.topSeller}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {brand.certifications.map((cert, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button size="sm" variant="outline">View Profile</Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Products</DropdownMenuItem>
                        <DropdownMenuItem>View Analytics</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {brand.status === "Active" ? (
                          <>
                            <DropdownMenuItem>Contact Rep</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Mark as Inactive</DropdownMenuItem>
                          </>
                        ) : brand.status === "Pending" ? (
                          <DropdownMenuItem className="text-green-500">Approve Partnership</DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-500">Reactivate</DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        );
      }
    }
    
    // Otherwise render the default role-specific dashboard
    switch(role) {
      case "manufacturer":
        return <ManufacturerDashboard />;
      case "brand":
        return <BrandDashboard />;
      case "retailer":
        return <RetailerDashboard />;
      default:
        return <div></div>;
    }
  }

  // Helper function for alert icons in production view
  const getAlertIcon = (type: string) => {
    switch(type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case "info":
        return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  // Role-specific navigation items
  const getNavigationItems = () => {
    switch(role) {
      case "manufacturer":
        return (
          <>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "production" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("production")}
            >
              <Factory className="h-4 w-4" />
              Production
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "products" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("products")}
            >
              <Package className="h-4 w-4" />
              Products
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "inventory" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("inventory")}
            >
              <Warehouse className="h-4 w-4" />
              Inventory
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "suppliers" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("suppliers")}
            >
              <Truck className="h-4 w-4" />
              Suppliers
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "matches" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("matches")}
            >
              <Users className="h-4 w-4" />
              Matches
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "analytics" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("analytics")}
            >
              <BarChart4 className="h-4 w-4" />
              Analytics
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "manufacturers" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("manufacturers")}
            >
              <Factory className="h-4 w-4" />
              Manufacturers
            </Button>
          </>
        );
      case "brand":
        return (
          <>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "products" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("products")}
            >
              <Package className="h-4 w-4" />
              Products
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "manufacturers" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("manufacturers")}
            >
              <Factory className="h-4 w-4" />
              Manufacturers
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "brands" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("brands")}
            >
              <Building2 className="h-4 w-4" />
              Brands
            </Button>
            <Button 
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "analytics" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("analytics")}
            >
              <BarChart4 className="h-4 w-4" />
              Analytics
            </Button>
          </>
        );
      case "retailer":
        return (
          <>
            <Button
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "inventory" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("inventory")}
            >
              <Warehouse className="h-4 w-4" />
              Inventory
            </Button>
            <Button
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "brands" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("brands")}
            >
              <Store className="h-4 w-4" />
              Brands
            </Button>
            <Button
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "matches" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("matches")}
            >
              <Handshake className="h-4 w-4" />
              Partnerships
            </Button>
            <Button
              variant="ghost" 
              className={`w-full justify-start gap-2 ${activeView === "analytics" ? "bg-secondary" : ""}`} 
              onClick={() => setActiveView("analytics")}
            >
              <BarChart4 className="h-4 w-4" />
              Analytics
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  // Helper function for status badges in the manufacturers view
  const getManufacturerStatusBadge = (status: string) => {
    switch(status) {
      case "Active Partner":
        return <Badge className="bg-green-500">Active Partner</Badge>;
      case "Potential Match":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Potential Match</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Helper function for match score badges in the manufacturers view
  const getMatchScoreBadge = (score: number) => {
    let color = "bg-green-500";
    if (score < 85) color = "bg-yellow-500";
    if (score < 70) color = "bg-red-500";
    
    return (
      <div className="flex items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${color} mr-1.5`}></div>
        <span className="text-sm font-medium">{score}% Match</span>
      </div>
    );
  };

  if (!isAuthenticated) {
    // Return empty div while redirecting
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex min-h-screen pt-16">
        {/* Sidebar */}
        <aside className="w-64 border-r hidden lg:block p-6 fixed top-16 left-0 h-[calc(100vh-4rem)] overflow-y-auto">
          <div className="space-y-4">
            <div className="mb-8">
              <h2 className="text-xl font-bold capitalize">{role} Dashboard</h2>
              <p className="text-sm text-foreground/60">
                {user?.companyName || "Company Name"}
              </p>
            </div>
            
            {/* User info */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.name || "User Name"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            
            <nav className="space-y-1">
              <Button 
                variant="ghost" 
                className={`w-full justify-start gap-2 ${activeView === "overview" ? "bg-secondary" : ""}`} 
                onClick={() => setActiveView("overview")}
              >
                <Home className="h-4 w-4" />
                Overview
              </Button>
              
              {/* Role-specific navigation */}
              {getNavigationItems()}
            </nav>
            
            <div className="pt-4 mt-4 border-t space-y-1">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2" 
                onClick={() => navigate("/profile")}
              >
                <User className="h-4 w-4" />
                Profile
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-2" 
                onClick={() => navigate(`/${role}/settings`)}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto lg:ml-64">
          <div className="max-w-7xl mx-auto">
            {activeView === "overview" ? (
              <>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <div>
                    <h1 className="text-3xl font-bold capitalize">{role} Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.name || "User"}</p>
                  </div>
                  
                  {/* Dashboard tabs for mobile */}
                  <div className="block md:hidden mb-8">
                    <Tabs defaultValue="overview" className="mb-8">
                      <TabsList className="grid grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="matches">Matches</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              </>
            ) : null}
            
            {/* Role-specific dashboard content */}
            {renderRoleSpecificDashboard()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
