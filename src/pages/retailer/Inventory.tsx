
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Filter, 
  ArrowLeft, 
  Search, 
  MoreVertical, 
  ShoppingCart, 
  PlusCircle, 
  Truck, 
  RefreshCcw,
  AlertTriangle
} from "lucide-react";
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
    name: "Organic Breakfast Cereal",
    brand: "Green Earth Organics",
    category: "Food",
    status: "In Stock",
    stockLevel: 78,
    reorderPoint: 30,
    price: 8.99,
    lastOrdered: "Jul 12, 2023",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Plant Protein Powder",
    brand: "Pure Nutrition",
    category: "Supplement",
    status: "In Stock",
    stockLevel: 45,
    reorderPoint: 25,
    price: 29.99,
    lastOrdered: "Jul 5, 2023",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Natural Energy Bars",
    brand: "Green Earth Organics",
    category: "Food",
    status: "Low Stock",
    stockLevel: 18,
    reorderPoint: 20,
    price: 2.99,
    lastOrdered: "Jun 28, 2023",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Eco-Friendly Dish Soap",
    brand: "Clean Living",
    category: "Household",
    status: "In Stock",
    stockLevel: 56,
    reorderPoint: 25,
    price: 4.99,
    lastOrdered: "Jul 8, 2023",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Organic Trail Mix",
    brand: "Nature's Harvest",
    category: "Food",
    status: "Out of Stock",
    stockLevel: 0,
    reorderPoint: 15,
    price: 6.99,
    lastOrdered: "Jun 15, 2023",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Cold Pressed Juice - Orange",
    brand: "Fresh Press",
    category: "Beverage",
    status: "Low Stock",
    stockLevel: 12,
    reorderPoint: 15,
    price: 5.99,
    lastOrdered: "Jul 2, 2023",
    image: "/placeholder.svg"
  }
];

const Inventory = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Inventory Management - CPG Matchmaker";
    
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "In Stock":
        return <Badge className="bg-green-500">In Stock</Badge>;
      case "Low Stock":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Low Stock</Badge>;
      case "Out of Stock":
        return <Badge variant="destructive">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getStockIndicator = (level: number, reorderPoint: number) => {
    let color = "bg-green-500";
    if (level === 0) color = "bg-red-500";
    else if (level <= reorderPoint) color = "bg-amber-500";
    
    return (
      <Progress value={(level / (reorderPoint * 2)) * 100} className={color} />
    );
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
                <p className="text-muted-foreground">{user?.companyName} - Track and manage your product inventory</p>
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
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">154</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-red-500">8</span> items out of stock
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">3</span> arriving today
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Inventory alerts */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                Inventory Alerts
              </CardTitle>
              <CardDescription>Items that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-md">
                  <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mr-3">
                    <Package className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="font-medium">Out of Stock</p>
                    <p className="text-sm text-muted-foreground">8 items need reordering</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md">
                  <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                    <RefreshCcw className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium">Low Stock</p>
                    <p className="text-sm text-muted-foreground">15 items below reorder point</p>
                  </div>
                </div>
                <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md">
                  <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <Truck className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">Incoming Deliveries</p>
                    <p className="text-sm text-muted-foreground">3 deliveries expected today</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
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
                      <CardDescription>{item.brand}</CardDescription>
                    </div>
                    {getStatusBadge(item.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 pb-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stock Level:</span>
                    <span className="font-medium">{item.stockLevel} units</span>
                  </div>
                  <div>
                    {getStockIndicator(item.stockLevel, item.reorderPoint)}
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-muted-foreground">Reorder Point: {item.reorderPoint}</span>
                      <span className="text-xs font-medium">${item.price}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Last Ordered:</span>
                    <span className="ml-1 font-medium">{item.lastOrdered}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button size="sm" variant={item.status === "Out of Stock" ? "default" : "outline"}>
                    {item.status === "Out of Stock" ? "Reorder Now" : "Update Stock"}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Product</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Adjust Stock</DropdownMenuItem>
                      <DropdownMenuItem>Order History</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
