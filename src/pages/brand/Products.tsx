import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, PlusCircle, Filter, Search, Pencil, MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import BrandLayout from "@/components/layouts/BrandLayout";
import { motion } from "framer-motion";

// Mock products data
const products = [
  {
    id: 1,
    name: "Organic Cereal",
    category: "Breakfast",
    status: "Active",
    retailPartners: 12,
    salesLastMonth: "$45,000",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Protein Bar",
    category: "Snacks",
    status: "Active",
    retailPartners: 8,
    salesLastMonth: "$32,500",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Kombucha",
    category: "Beverages",
    status: "Development",
    retailPartners: 0,
    salesLastMonth: "$0",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Gluten-Free Crackers",
    category: "Snacks",
    status: "Active",
    retailPartners: 5,
    salesLastMonth: "$18,750",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Plant-Based Milk",
    category: "Beverages",
    status: "Active",
    retailPartners: 10,
    salesLastMonth: "$28,000",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Vitamin Supplement",
    category: "Health",
    status: "Inactive",
    retailPartners: 0,
    salesLastMonth: "$0",
    image: "/placeholder.svg"
  }
];

const BrandProducts = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    document.title = "Products Management - CPG Matchmaker";
    
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

  // Filter products based on search query
  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Development":
        return <Badge className="bg-blue-500">Development</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <BrandLayout>
      <motion.div 
        className="max-w-none px-4 sm:px-6 lg:px-8 pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Product Management</h1>
                <p className="text-muted-foreground">{user?.companyName} - Manage Your Product Catalog</p>
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
                  placeholder="Search products..." 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Button variant="outline" className="group">
              <Filter className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
              Filter Products
            </Button>
          </div>
          
          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300">
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
                      <span className="text-muted-foreground">Retail Partners:</span>
                      <span className="ml-1 font-medium">{product.retailPartners}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground">Sales:</span>
                      <span className="ml-1 font-medium">{product.salesLastMonth}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button size="sm" variant="outline" className="group">
                    <Pencil className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Edit
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit Product</DropdownMenuItem>
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
            <Card 
              className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors duration-300"
            >
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Add New Product</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Create a new product in your catalog
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </BrandLayout>
  );
};

export default BrandProducts;
