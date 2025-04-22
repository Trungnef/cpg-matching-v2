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
  CheckCircle,
  Trash2,
  X,
  Eye
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import RetailerLayout from "@/components/layouts/RetailerLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
    image: "/placeholder.svg",
    description: "Organic whole grain cereal made with natural ingredients. High in fiber and low in sugar, perfect for a healthy breakfast.",
    price: 24.99,
    sku: "ORG-CER-001"
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
    image: "/placeholder.svg",
    description: "High protein bars with 20g of protein per serving. Great for pre or post workout snack or meal replacement.",
    price: 18.50,
    sku: "PRO-BAR-002"
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
    image: "/placeholder.svg",
    description: "Cold pressed juice made from organic fruits and vegetables. No added sugars or preservatives.",
    price: 30.00,
    sku: "JUI-CPR-003"
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
    image: "/placeholder.svg",
    description: "Daily multivitamin supplement with essential vitamins and minerals for overall health and wellness.",
    price: 42.50,
    sku: "VIT-SUP-004"
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
    image: "/placeholder.svg",
    description: "Plant-based dish soap that's tough on grease but gentle on the environment. Biodegradable and comes in recyclable packaging.",
    price: 18.90,
    sku: "ECO-SOP-005"
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
    image: "/placeholder.svg",
    description: "Mix of organic nuts, seeds, and dried fruits. Perfect healthy snack for on-the-go energy.",
    price: 16.75,
    sku: "ORG-MIX-006"
  }
];

// Form schema for product validation
const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  brand: z.string().min(2, "Brand must be at least 2 characters"),
  category: z.string().min(1, "Please select a category"),
  quantity: z.coerce.number().int().min(0, "Quantity must be a positive number"),
  threshold: z.coerce.number().int().min(1, "Threshold must be at least 1"),
  location: z.string().min(1, "Please select a location"),
  description: z.string().optional(),
  price: z.coerce.number().positive("Price must be a positive number"),
  sku: z.string().min(3, "SKU must be at least 3 characters")
});

type ProductFormValues = z.infer<typeof productSchema>;

const RetailerInventory = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [inventoryData, setInventoryData] = useState(inventory);
  
  // Dialogs state
  const [addProductOpen, setAddProductOpen] = useState(false);
  const [viewProductOpen, setViewProductOpen] = useState(false);
  const [editProductOpen, setEditProductOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Product state
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Animation state
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  
  // Default form values
  const defaultValues: Partial<ProductFormValues> = {
    name: "",
    brand: "",
    category: "",
    quantity: 0,
    threshold: 100,
    location: "",
    description: "",
    price: 0,
    sku: ""
  };

  // Form hook for add product
  const addProductForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues
  });

  // Form hook for edit product
  const editProductForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues
  });

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

  // Filter inventory based on search query and filters
  const filteredInventory = inventoryData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

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

  // View product details
  const handleViewProduct = (product: any) => {
    setSelectedProduct(product);
    setViewProductOpen(true);
  };

  // Edit product
  const handleEditProduct = (product: any) => {
    setSelectedProduct(product);
    // Reset form with current product values
    editProductForm.reset({
      name: product.name,
      brand: product.brand,
      category: product.category,
      quantity: product.quantity,
      threshold: product.threshold,
      location: product.location,
      description: product.description || "",
      price: product.price,
      sku: product.sku
    });
    setEditProductOpen(true);
  };

  // Delete product
  const handleDeleteProduct = (id: number) => {
    setIsDeleting(id);
    
    // Simulate deletion with animation
    setTimeout(() => {
      setInventoryData(prev => prev.filter(item => item.id !== id));
      setIsDeleting(null);
      
      toast({
        title: "Product deleted",
        description: "The product has been successfully removed from inventory",
        variant: "default"
      });
    }, 500);
  };

  // Handle add product form submission
  const onAddProductSubmit = (data: ProductFormValues) => {
    // Determine status based on quantity and threshold
    let status = "In Stock";
    if (data.quantity === 0) {
      status = "Out of Stock";
    } else if (data.quantity < data.threshold) {
      status = "Low Stock";
    }
    
    const newProduct = {
      id: inventoryData.length + 1,
      name: data.name,
      brand: data.brand,
      category: data.category,
      status,
      quantity: data.quantity,
      threshold: data.threshold,
      location: data.location,
      image: "/placeholder.svg",
      description: data.description || "",
      price: data.price,
      sku: data.sku
    };
    
    setInventoryData(prev => [...prev, newProduct]);
    addProductForm.reset(defaultValues);
    setAddProductOpen(false);
    
    toast({
      title: "Product added",
      description: "New product has been added to inventory",
      variant: "default"
    });
  };

  // Handle edit product form submission
  const onEditProductSubmit = (data: ProductFormValues) => {
    if (!selectedProduct) return;
    
    // Determine status based on quantity and threshold
    let status = "In Stock";
    if (data.quantity === 0) {
      status = "Out of Stock";
    } else if (data.quantity < data.threshold) {
      status = "Low Stock";
    }
    
    const updatedProduct = {
      ...selectedProduct,
      name: data.name,
      brand: data.brand,
      category: data.category,
      status,
      quantity: data.quantity,
      threshold: data.threshold,
      location: data.location,
      description: data.description || "",
      price: data.price,
      sku: data.sku
    };
    
    setInventoryData(prev => 
      prev.map(item => item.id === selectedProduct.id ? updatedProduct : item)
    );
    editProductForm.reset(defaultValues);
    setEditProductOpen(false);
    
    toast({
      title: "Product updated",
      description: "Product information has been successfully updated",
      variant: "default"
    });
  };

  // Reset forms when dialogs close
  useEffect(() => {
    if (!addProductOpen) {
      addProductForm.reset(defaultValues);
    }
    if (!editProductOpen) {
      editProductForm.reset(defaultValues);
    }
  }, [addProductOpen, editProductOpen]);

  return (
    <RetailerLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Inventory Management</h1>
              <p className="text-muted-foreground">{user?.companyName} - Track and Manage Stock Levels</p>
            </div>
            
            {/* Add Product Dialog Trigger */}
            <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
              <DialogTrigger asChild>
                <Button className="group hover:shadow-md transition-shadow">
                  <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Add New Product
                </Button>
              </DialogTrigger>
              
              {/* Add Product Dialog Content */}
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-primary" />
                    Add New Product
                  </DialogTitle>
                  <DialogDescription>
                    Fill in the product details below to add a new item to your inventory.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...addProductForm}>
                  <form onSubmit={addProductForm.handleSubmit(onAddProductSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={addProductForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Organic Cereal" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addProductForm.control}
                        name="brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. Green Earth Foods" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addProductForm.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Food">Food</SelectItem>
                                <SelectItem value="Beverages">Beverages</SelectItem>
                                <SelectItem value="Health">Health</SelectItem>
                                <SelectItem value="Household">Household</SelectItem>
                                <SelectItem value="Snacks">Snacks</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addProductForm.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Storage Location</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a location" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                                <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                                <SelectItem value="Warehouse C">Warehouse C</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addProductForm.control}
                        name="quantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addProductForm.control}
                        name="threshold"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Reorder Threshold</FormLabel>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription>
                              Minimum stock level before reordering
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addProductForm.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price ($)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={addProductForm.control}
                        name="sku"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SKU</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g. ORG-CER-001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={addProductForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter product description..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button type="submit">Add Product</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Filters & Search */}
        <div className="px-4 sm:px-6 lg:px-8 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search inventory..." 
                  className="pl-10 shadow-sm hover:shadow transition-shadow" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-2/3">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Beverages">Beverages</SelectItem>
                  <SelectItem value="Health">Health</SelectItem>
                  <SelectItem value="Household">Household</SelectItem>
                  <SelectItem value="Snacks">Snacks</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Low Stock">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Inventory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 sm:px-6 lg:px-8">
          <AnimatePresence>
            {filteredInventory.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: isDeleting === item.id ? 0 : 1, 
                  y: isDeleting === item.id ? -20 : 0,
                  scale: isDeleting === item.id ? 0.9 : 1
                }}
                exit={{ opacity: 0, y: -20, scale: 0.9 }}
                transition={{ 
                  duration: 0.3, 
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }}
                layout
                className="will-change-transform"
              >
                <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 hover:border-primary/30">
                  <div className="aspect-video bg-muted flex items-center justify-center relative overflow-hidden group">
                    <img 
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 flex items-center justify-center gap-2 transition-opacity duration-300 group-hover:opacity-100">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white/90 hover:bg-white"
                        onClick={() => handleViewProduct(item)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {item.name}
                        </CardTitle>
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
                      <div className="flex items-center text-sm col-span-2">
                        <span className="text-muted-foreground">SKU:</span>
                        <span className="ml-1 text-xs font-mono">{item.sku}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-0">
                    <Button size="sm" variant="outline" className="group" onClick={() => handleEditProduct(item)}>
                      <Pencil className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Edit Product
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProduct(item)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEditProduct(item)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Product
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-500">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Product
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete {item.name} from your inventory. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => handleDeleteProduct(item.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Add new inventory item card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            layout
          >
            <Dialog open={addProductOpen} onOpenChange={setAddProductOpen}>
              <DialogTrigger asChild>
                <Card 
                  className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors duration-300"
                >
                  <CardContent className="pt-6 flex flex-col items-center">
                    <motion.div 
                      className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 border-2 border-primary/20 shadow-md dark:bg-primary/20 dark:border-primary/30"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <PlusCircle className="h-6 w-6 text-primary drop-shadow-sm" />
                    </motion.div>
                    <h3 className="font-medium mb-2">Add New Item</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Add a new product to your inventory
                    </p>
                  </CardContent>
                </Card>
              </DialogTrigger>
            </Dialog>
          </motion.div>
        </div>
        
        {/* Empty state */}
        {filteredInventory.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="px-4 sm:px-6 lg:px-8 mt-10"
          >
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-10">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground text-center max-w-md mb-6">
                  {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                    ? "Try adjusting your filters or search query"
                    : "Start by adding some products to your inventory"
                  }
                </p>
                {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchQuery("");
                      setCategoryFilter("all");
                      setStatusFilter("all");
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* View Product Details Dialog */}
        {selectedProduct && (
          <Dialog open={viewProductOpen} onOpenChange={setViewProductOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  Product Details
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="aspect-video bg-muted rounded-md overflow-hidden">
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold">{selectedProduct.name}</h3>
                    <p className="text-muted-foreground">{selectedProduct.brand}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedProduct.status)}
                    <span className="text-sm font-medium">${selectedProduct.price.toFixed(2)}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock Level</span>
                      <span className={`font-medium ${
                        selectedProduct.status === "Out of Stock" ? "text-red-600 dark:text-red-400" : 
                        selectedProduct.status === "Low Stock" ? "text-yellow-600 dark:text-yellow-400" : "text-green-600 dark:text-green-400"
                      }`}>
                        {selectedProduct.quantity} units
                      </span>
                    </div>
                    <Progress 
                      value={getInventoryLevel(selectedProduct.quantity, selectedProduct.threshold)} 
                      className={`h-2 ${
                        selectedProduct.status === "Out of Stock" ? "bg-red-200 dark:bg-red-950/50" : 
                        selectedProduct.status === "Low Stock" ? "bg-yellow-200 dark:bg-yellow-950/50" : "bg-green-200 dark:bg-green-950/50"
                      } [&>div]:${
                        selectedProduct.status === "Out of Stock" ? "bg-red-500 dark:bg-red-600" : 
                        selectedProduct.status === "Low Stock" ? "bg-yellow-500 dark:bg-yellow-600" : "bg-green-500 dark:bg-green-600"
                      }`} 
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 mt-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-1">Description</h4>
                  <p className="text-sm">{selectedProduct.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Category</h4>
                    <Badge variant="outline" className="bg-primary/5 border-primary/20 text-primary">
                      {selectedProduct.category}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Location</h4>
                    <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700">
                      {selectedProduct.location}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">SKU</h4>
                    <p className="text-sm font-mono">{selectedProduct.sku}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">Reorder Threshold</h4>
                    <p className="text-sm">{selectedProduct.threshold} units</p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => handleEditProduct(selectedProduct)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete {selectedProduct.name} from your inventory. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        className="bg-red-500 hover:bg-red-600"
                        onClick={() => {
                          handleDeleteProduct(selectedProduct.id);
                          setViewProductOpen(false);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit Product Dialog */}
        {selectedProduct && (
          <Dialog open={editProductOpen} onOpenChange={setEditProductOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Pencil className="h-5 w-5 text-primary" />
                  Edit Product
                </DialogTitle>
                <DialogDescription>
                  Update the product details below.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...editProductForm}>
                <form onSubmit={editProductForm.handleSubmit(onEditProductSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={editProductForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editProductForm.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editProductForm.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Food">Food</SelectItem>
                              <SelectItem value="Beverages">Beverages</SelectItem>
                              <SelectItem value="Health">Health</SelectItem>
                              <SelectItem value="Household">Household</SelectItem>
                              <SelectItem value="Snacks">Snacks</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editProductForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Storage Location</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a location" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Warehouse A">Warehouse A</SelectItem>
                              <SelectItem value="Warehouse B">Warehouse B</SelectItem>
                              <SelectItem value="Warehouse C">Warehouse C</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editProductForm.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editProductForm.control}
                      name="threshold"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reorder Threshold</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editProductForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={editProductForm.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={editProductForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="submit">Update Product</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </motion.div>
    </RetailerLayout>
  );
};

export default RetailerInventory;
