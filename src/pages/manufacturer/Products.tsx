
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, PlusCircle, Filter, ArrowLeft, Search, MoreVertical, Tag, Box } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  },
  {
    id: 4,
    name: "Organic Juice",
    category: "Beverage",
    status: "Active",
    moq: 3000,
    capacity: "10,000 units/day",
    clients: 4,
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Trail Mix",
    category: "Food",
    status: "Active",
    moq: 1500,
    capacity: "8,000 units/day",
    clients: 1,
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Vegan Cookies",
    category: "Food",
    status: "Inactive",
    moq: 2000,
    capacity: "5,000 units/day",
    clients: 0,
    image: "/placeholder.svg"
  }
];

const Products = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Product Management - CPG Matchmaker";
    
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
      case "Development":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Development</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
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
      </div>
    </div>
  );
};

export default Products;
