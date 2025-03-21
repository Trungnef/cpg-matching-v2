import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, PlusCircle, Filter, ArrowLeft, Search, MoreVertical, Tag, Box, Warehouse, AlertTriangle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";

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
    image: "/placeholder.svg",
    description: "Nutrient-rich organic cereal made with whole grains and natural sweeteners. Contains no artificial colors, flavors, or preservatives.",
    inventory: [
      {
        id: 101,
        name: "Organic Oats",
        category: "Raw Materials",
        status: "In Stock",
        quantity: 15000,
        unit: "kg",
        threshold: 5000,
        location: "Warehouse A"
      },
      {
        id: 102,
        name: "Honey",
        category: "Raw Materials",
        status: "Low Stock",
        quantity: 1200,
        unit: "liters",
        threshold: 1500,
        location: "Warehouse B"
      },
      {
        id: 103,
        name: "Cardboard Boxes",
        category: "Packaging",
        status: "In Stock",
        quantity: 12000,
        unit: "units",
        threshold: 5000,
        location: "Warehouse C"
      }
    ]
  },
  {
    id: 2,
    name: "Energy Bars",
    category: "Food",
    status: "Active",
    moq: 2000,
    capacity: "12,000 units/day",
    clients: 2,
    image: "/placeholder.svg",
    description: "High-energy protein bars perfect for athletes and active individuals. Each bar contains 15g of protein and essential vitamins.",
    inventory: [
      {
        id: 101,
        name: "Organic Oats",
        category: "Raw Materials",
        status: "In Stock",
        quantity: 15000,
        unit: "kg",
        threshold: 5000,
        location: "Warehouse A"
      },
      {
        id: 104,
        name: "Protein Powder",
        category: "Raw Materials",
        status: "In Stock",
        quantity: 8000,
        unit: "kg",
        threshold: 3000,
        location: "Warehouse A"
      }
    ]
  },
  {
    id: 3,
    name: "Protein Shake",
    category: "Beverage",
    status: "Development",
    moq: 5000,
    capacity: "8,000 units/day",
    clients: 0,
    image: "/placeholder.svg",
    description: "High-protein shake formulated for maximum nutritional value and muscle recovery. Available in various flavors.",
    inventory: [
      {
        id: 104,
        name: "Protein Powder",
        category: "Raw Materials",
        status: "In Stock",
        quantity: 8000,
        unit: "kg",
        threshold: 3000,
        location: "Warehouse A"
      },
      {
        id: 105,
        name: "Glass Bottles (500ml)",
        category: "Packaging",
        status: "Low Stock",
        quantity: 5000,
        unit: "units",
        threshold: 8000,
        location: "Warehouse C"
      }
    ]
  },
  {
    id: 4,
    name: "Organic Juice",
    category: "Beverage",
    status: "Active",
    moq: 3000,
    capacity: "10,000 units/day",
    clients: 4,
    image: "/placeholder.svg",
    description: "Fresh-pressed organic juice with no added sugars or preservatives. Made from locally sourced fruits and vegetables.",
    inventory: [
      {
        id: 105,
        name: "Glass Bottles (500ml)",
        category: "Packaging",
        status: "Low Stock",
        quantity: 5000,
        unit: "units",
        threshold: 8000,
        location: "Warehouse C"
      },
      {
        id: 106,
        name: "Vitamin C",
        category: "Additives",
        status: "Out of Stock",
        quantity: 0,
        unit: "kg",
        threshold: 200,
        location: "Warehouse B"
      }
    ]
  },
  {
    id: 5,
    name: "Trail Mix",
    category: "Food",
    status: "Active",
    moq: 1500,
    capacity: "8,000 units/day",
    clients: 1,
    image: "/placeholder.svg",
    description: "Premium trail mix with a blend of nuts, dried fruits, and dark chocolate. Perfect for on-the-go energy boost.",
    inventory: [
      {
        id: 107,
        name: "Mixed Nuts",
        category: "Raw Materials",
        status: "In Stock",
        quantity: 7000,
        unit: "kg",
        threshold: 2000,
        location: "Warehouse A"
      },
      {
        id: 103,
        name: "Cardboard Boxes",
        category: "Packaging",
        status: "In Stock",
        quantity: 12000,
        unit: "units",
        threshold: 5000,
        location: "Warehouse C"
      }
    ]
  },
  {
    id: 6,
    name: "Vegan Cookies",
    category: "Food",
    status: "Inactive",
    moq: 2000,
    capacity: "5,000 units/day",
    clients: 0,
    image: "/placeholder.svg",
    description: "Plant-based cookies with no animal products. Delicious taste with sustainable and ethical ingredients.",
    inventory: [
      {
        id: 108,
        name: "Organic Flour",
        category: "Raw Materials",
        status: "In Stock",
        quantity: 10000,
        unit: "kg",
        threshold: 3000,
        location: "Warehouse A"
      },
      {
        id: 103,
        name: "Cardboard Boxes",
        category: "Packaging",
        status: "In Stock",
        quantity: 12000,
        unit: "units",
        threshold: 5000,
        location: "Warehouse C"
      }
    ]
  }
];

const Products = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isNavigating, setIsNavigating] = useState(false);
  
  useEffect(() => {
    document.title = "Product Management - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);

  const handleAddProduct = async () => {
    try {
      setIsNavigating(true);
      await navigate('/manufacturer/add-product');
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "Unable to navigate to Add Product page. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsNavigating(false);
    }
  };

  if (!isAuthenticated || role !== "manufacturer") {
    return null;
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Development":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Development</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
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

  const getInventoryLevel = (quantity, threshold) => {
    if (quantity === 0) return 0;
    if (quantity < threshold) return (quantity / threshold) * 100;
    return 100;
  };

  const handleProductDetailsClick = (product) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
    setActiveTab("overview");
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
                <Button 
                  onClick={handleAddProduct}
                  disabled={isNavigating}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {isNavigating ? "Loading..." : "Add Product"}
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
                  <Button size="sm" variant="outline" onClick={() => handleProductDetailsClick(product)}>View Details</Button>
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
                <p className="text-center text-sm text-muted-foreground mb-4">
                  Create a new product to add to your manufacturing catalog
                </p>
                <Button size="sm">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Product Details Dialog */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="sm:max-w-4xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl flex items-center gap-2">
                  {selectedProduct.name}
                  {getStatusBadge(selectedProduct.status)}
                </DialogTitle>
                <DialogDescription>
                  {selectedProduct.category} - {user?.companyName}
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="overview">Product Overview</TabsTrigger>
                  <TabsTrigger value="inventory">Inventory & Materials</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1 bg-muted rounded-lg p-4 flex items-center justify-center">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <img 
                          src={selectedProduct.image} 
                          alt={selectedProduct.name} 
                          className="w-full h-auto object-contain"
                        />
                      </motion.div>
                    </div>
                    
                    <div className="md:col-span-2 space-y-4">
                      <p className="text-foreground/80">{selectedProduct.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-foreground/70">Status</p>
                          <p className="font-semibold">{selectedProduct.status}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70">Category</p>
                          <p className="font-medium">{selectedProduct.category}</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70">Minimum Order</p>
                          <p className="font-medium">{selectedProduct.moq} units</p>
                        </div>
                        <div>
                          <p className="text-sm text-foreground/70">Daily Capacity</p>
                          <p className="font-medium">{selectedProduct.capacity}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-foreground/70 mb-1">Client Brands</p>
                        <div className="flex items-center">
                          <Badge variant="secondary">{selectedProduct.clients} Active Clients</Badge>
                        </div>
                      </div>
                      
                      <div className="pt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                          Edit Product
                        </Button>
                        <Button size="sm">
                          View Analytics
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="inventory" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-medium">Materials & Components</h3>
                    <Button variant="outline" size="sm">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Material
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {selectedProduct.inventory.map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card>
                          <CardContent className="p-4">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <div>
                                    <h4 className="font-medium text-base">{item.name}</h4>
                                    <p className="text-sm text-muted-foreground">{item.category}</p>
                                  </div>
                                  {getStatusBadge(item.status)}
                                </div>
                                
                                <div className="space-y-1">
                                  <div className="flex items-center justify-between text-sm">
                                    <span>Inventory Level</span>
                                    <span className={`font-medium ${item.quantity < item.threshold ? 'text-yellow-500' : 'text-green-500'}`}>
                                      {item.quantity} {item.unit}
                                    </span>
                                  </div>
                                  <Progress value={getInventoryLevel(item.quantity, item.threshold)} className="h-2" />
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
                              </div>
                              
                              <div className="flex flex-row md:flex-col items-center gap-2 min-w-[120px]">
                                <div className="flex items-center text-sm">
                                  <Warehouse className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span>{item.location}</span>
                                </div>
                                <Button variant="outline" size="sm" className="w-full">Manage</Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  
                  {selectedProduct.inventory.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-8 border rounded-lg border-dashed">
                      <Package className="h-10 w-10 text-muted-foreground mb-4" />
                      <h3 className="font-medium text-lg mb-1">No Materials Added</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        This product doesn't have any inventory components linked yet.
                      </p>
                      <Button size="sm">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Materials
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
