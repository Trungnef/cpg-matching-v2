import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Warehouse, 
  PlusCircle, 
  Filter, 
  Search, 
  Package, 
  AlertTriangle, 
  Pencil, 
  MoreHorizontal,
  CheckCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RetailerLayout from "@/components/layouts/RetailerLayout";
import { motion } from "framer-motion";

// Mock inventory data
const inventory = [
  {
    id: 1,
    name: "Organic Cereal",
    brand: "Green Earth Foods",
    category: "Food",
    status: "In Stock",
    quantity: 5200,
    threshold: 2000,
    location: "Warehouse A",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Protein Bars",
    brand: "Pure Wellness",
    category: "Food",
    status: "Low Stock",
    quantity: 850,
    threshold: 1000,
    location: "Warehouse B",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Cold Pressed Juice",
    brand: "Fresh Press",
    category: "Beverages",
    status: "In Stock",
    quantity: 3200,
    threshold: 1500,
    location: "Warehouse A",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Vitamin Supplements",
    brand: "Wellness Essentials",
    category: "Health",
    status: "Out of Stock",
    quantity: 0,
    threshold: 800,
    location: "Warehouse C",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Eco-Friendly Dish Soap",
    brand: "Clean Living",
    category: "Household",
    status: "In Stock",
    quantity: 2400,
    threshold: 1200,
    location: "Warehouse B",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Organic Trail Mix",
    brand: "Nature's Harvest",
    category: "Snacks",
    status: "Low Stock",
    quantity: 650,
    threshold: 800,
    location: "Warehouse A",
    image: "/placeholder.svg"
  }
];

const RetailerInventory = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
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

  // Filter inventory based on search query
  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "In Stock":
        return <Badge className="bg-green-500 hover:bg-green-600 text-white shadow-sm border border-green-600/20 font-medium dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-500/40">In Stock</Badge>;
      case "Low Stock":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white shadow-sm border border-yellow-600/20 font-medium dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:border-yellow-500/40">Low Stock</Badge>;
      case "Out of Stock":
        return <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50 hover:bg-red-100 shadow-sm font-medium dark:bg-red-900/30 dark:border-red-700/50 dark:text-red-400 dark:hover:bg-red-900/40">Out of Stock</Badge>;
      default:
        return <Badge variant="outline" className="shadow-sm font-medium">{status}</Badge>;
    }
  };

  // Calculate inventory level as percentage
  const getInventoryLevel = (quantity: number, threshold: number) => {
    if (quantity === 0) return 0;
    if (quantity < threshold) return Math.max(10, (quantity / threshold) * 100);
    return 100;
  };

  return (
    <RetailerLayout>
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Inventory Management</h1>
              <p className="text-muted-foreground">{user?.companyName} - Track and Manage Stock Levels</p>
            </div>
            
            <Button className="group">
              <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Add New Product
            </Button>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="sm:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search inventory..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <Button variant="outline" className="group">
            <Filter className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
            Filter Inventory
          </Button>
        </div>
        
        {/* Inventory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
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
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stock Level</span>
                    <span className={`font-medium ${
                      item.status === "Out of Stock" ? "text-red-600 dark:text-red-400" : 
                      item.status === "Low Stock" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
                    }`}>
                      {item.quantity} units
                    </span>
                  </div>
                  <Progress 
                    value={getInventoryLevel(item.quantity, item.threshold)} 
                    className={`h-2 ${
                      item.status === "Out of Stock" ? "bg-red-200 dark:bg-red-950/50" : 
                      item.status === "Low Stock" ? "bg-yellow-200 dark:bg-yellow-950/50" : "bg-green-200 dark:bg-green-950/50"
                    } [&>div]:${
                      item.status === "Out of Stock" ? "bg-red-500 dark:bg-red-600" : 
                      item.status === "Low Stock" ? "bg-yellow-500 dark:bg-yellow-600" : "bg-green-500 dark:bg-green-600"
                    }`} 
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Min threshold: {item.threshold}</span>
                    {item.status === "Low Stock" && (
                      <span className="flex items-center text-yellow-600 dark:text-yellow-400 font-medium">
                        <AlertTriangle className="h-3 w-3 mr-1 drop-shadow-sm" />
                        Reorder soon
                      </span>
                    )}
                    {item.status === "Out of Stock" && (
                      <span className="flex items-center text-red-600 dark:text-red-400 font-medium">
                        <AlertTriangle className="h-3 w-3 mr-1 drop-shadow-sm" />
                        Reorder now
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">Category:</span>
                    <Badge variant="outline" className="ml-1 text-xs bg-primary/5 border-primary/20 text-primary dark:bg-primary/10 dark:border-primary/30 shadow-sm">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground">Location:</span>
                    <Badge variant="outline" className="ml-1 text-xs bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-800/40 dark:text-blue-400 shadow-sm">
                      {item.location}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-0">
                <Button size="sm" variant="outline" className="group">
                  <Pencil className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Update Stock
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Update Stock</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Order More</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardFooter>
            </Card>
          ))}
          
          {/* Add new inventory item card */}
          <Card 
            className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors duration-300"
          >
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20 shadow-md dark:bg-primary/20 dark:border-primary/30">
                <PlusCircle className="h-6 w-6 text-primary drop-shadow-sm" />
              </div>
              <h3 className="font-medium mb-2">Add New Item</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Add a new product to your inventory
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </RetailerLayout>
  );
};

export default RetailerInventory;
