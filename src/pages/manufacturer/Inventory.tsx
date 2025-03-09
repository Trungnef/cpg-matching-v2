
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, PlusCircle, Search, MoreVertical, Package, Warehouse, AlertTriangle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";

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
  },
  {
    id: 4,
    name: "Glass Bottles (500ml)",
    category: "Packaging",
    status: "Low Stock",
    quantity: 5000,
    unit: "units",
    threshold: 8000,
    usedIn: 1,
    location: "Warehouse C",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Cardboard Boxes",
    category: "Packaging",
    status: "In Stock",
    quantity: 12000,
    unit: "units",
    threshold: 5000,
    usedIn: 5,
    location: "Warehouse C",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Vitamin C",
    category: "Additives",
    status: "Out of Stock",
    quantity: 0,
    unit: "kg",
    threshold: 200,
    usedIn: 2,
    location: "Warehouse B",
    image: "/placeholder.svg"
  }
];

const Inventory = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Inventory Management - CPG Matchmaker";
    
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
      case "In Stock":
        return <Badge className="bg-green-500">In Stock</Badge>;
      case "Low Stock":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Low Stock</Badge>;
      case "Out of Stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getInventoryLevel = (quantity: number, threshold: number) => {
    if (quantity === 0) return 0;
    if (quantity < threshold) return (quantity / threshold) * 100;
    return 100;
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
      </div>
    </div>
  );
};

export default Inventory;
