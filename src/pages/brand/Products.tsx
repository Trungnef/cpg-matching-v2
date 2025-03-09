
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, PlusCircle, Filter, ArrowLeft, Search, MoreVertical, Tag, Calendar, Clock, Truck } from "lucide-react";
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
    name: "Organic Breakfast Cereal",
    category: "Food",
    status: "Active",
    launched: "Jan 2023",
    manufacturer: "Premium Foods Co.",
    retailers: 4,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Natural Energy Bars",
    category: "Food",
    status: "Active",
    launched: "Mar 2023",
    manufacturer: "Sustainable Nutrition Inc.",
    retailers: 3,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Plant Protein Powder",
    category: "Supplement",
    status: "Development",
    launched: "Coming Soon",
    manufacturer: "Pending Selection",
    retailers: 0,
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Fresh Fruit Smoothies",
    category: "Beverage",
    status: "Active",
    launched: "Feb 2023",
    manufacturer: "Nature's Best Beverages",
    retailers: 6,
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Gourmet Trail Mix",
    category: "Snack",
    status: "Active",
    launched: "Apr 2023",
    manufacturer: "Premium Foods Co.",
    retailers: 5,
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Gluten-Free Cookies",
    category: "Food",
    status: "Inactive",
    launched: "Dec 2022",
    manufacturer: "Sustainable Nutrition Inc.",
    retailers: 2,
    image: "/placeholder.svg"
  }
];

const Products = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Brand Products - CPG Matchmaker";
    
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
                <h1 className="text-3xl font-bold">Brand Products</h1>
                <p className="text-muted-foreground">{user?.companyName} - Your Product Portfolio</p>
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
                  <span className="text-green-500">5 Active</span>, 1 In Development
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Retail Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-blue-500">2 Potential</span> new partners in pipeline
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
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Launched:</span>
                      <span className="ml-1 font-medium">{product.launched}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Retailers:</span>
                      <span className="ml-1 font-medium">{product.retailers}</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Manufacturer:</span>
                    <span className="ml-1 font-medium">{product.manufacturer}</span>
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
                  Create a new brand product
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
