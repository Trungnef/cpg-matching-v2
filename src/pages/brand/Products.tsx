import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Package, 
  PlusCircle, 
  Filter, 
  Search, 
  Pencil, 
  MoreHorizontal, 
  Eye, 
  Trash2, 
  AlertCircle, 
  Check, 
  X, 
  Tag, 
  ShoppingBag, 
  DollarSign, 
  Store, 
  BarChart3,
  UploadCloud,
  Image as ImageIcon,
  XCircle,
  Package2,
  PencilLine,
  Upload
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
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
  DialogClose,
  DialogPortal,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import BrandLayout from "@/components/layouts/BrandLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { useTranslation } from "react-i18next";
import { Form, FormField } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Product type definition
interface Product {
  id: number;
  name: string;
  category: string;
  status: "Active" | "Development" | "Inactive";
  retailPartners: number;
  salesLastMonth: string;
  image: string;
  description?: string;
  price?: string;
  sku?: string;
  inventoryCount?: number;
  launchDate?: string;
  rating?: string;
  oldPrice?: string;
}

// Mock image gallery for demo purposes
const mockImageGallery = [
  "/placeholder.svg",
  "/placeholder-2.svg",
  "/placeholder-3.svg",
  "https://images.unsplash.com/photo-1567103472667-6898f3a79cf2?q=80&w=250",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=250",
  "https://images.unsplash.com/photo-1580913428706-c311e67898b3?q=80&w=250"
];

// Mock products data
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Organic Cereal",
    category: "Breakfast",
    status: "Active",
    retailPartners: 12,
    salesLastMonth: "$45,000",
    image: "/placeholder.svg",
    description: "A nutritious organic cereal made with whole grains and natural sweeteners.",
    price: "$4.99",
    sku: "ORG-CRL-001",
    inventoryCount: 1250,
    launchDate: "2021-06-15"
  },
  {
    id: 2,
    name: "Protein Bar",
    category: "Snacks",
    status: "Active",
    retailPartners: 8,
    salesLastMonth: "$32,500",
    image: "/placeholder.svg",
    description: "High protein bar with 20g of plant-based protein and low sugar content.",
    price: "$2.99",
    sku: "PRO-BAR-002",
    inventoryCount: 3450,
    launchDate: "2021-08-22"
  },
  {
    id: 3,
    name: "Kombucha",
    category: "Beverages",
    status: "Development",
    retailPartners: 0,
    salesLastMonth: "$0",
    image: "/placeholder.svg",
    description: "Probiotic-rich fermented tea with natural flavors.",
    price: "$3.49",
    sku: "KOM-BEV-003",
    inventoryCount: 0,
    launchDate: "2023-12-01"
  },
  {
    id: 4,
    name: "Gluten-Free Crackers",
    category: "Snacks",
    status: "Active",
    retailPartners: 5,
    salesLastMonth: "$18,750",
    image: "/placeholder.svg",
    description: "Crispy crackers made with rice flour and quinoa, perfect for those with gluten sensitivities.",
    price: "$3.29",
    sku: "GF-CRK-004",
    inventoryCount: 876,
    launchDate: "2022-01-10"
  },
  {
    id: 5,
    name: "Plant-Based Milk",
    category: "Beverages",
    status: "Active",
    retailPartners: 10,
    salesLastMonth: "$28,000",
    image: "/placeholder.svg",
    description: "Creamy oat-based milk alternative with added calcium and vitamins.",
    price: "$3.99",
    sku: "PB-MLK-005",
    inventoryCount: 2100,
    launchDate: "2021-04-05"
  },
  {
    id: 6,
    name: "Vitamin Supplement",
    category: "Health",
    status: "Inactive",
    retailPartners: 0,
    salesLastMonth: "$0",
    image: "/placeholder.svg",
    description: "Daily multivitamin formulated for overall wellness and immune support.",
    price: "$12.99",
    sku: "VIT-SUP-006",
    inventoryCount: 0,
    launchDate: "2020-11-20"
  }
];

// Product categories for filtering and form selections
const productCategories = [
  "Breakfast", 
  "Snacks", 
  "Beverages", 
  "Health", 
  "Condiments", 
  "Baking", 
  "Dairy Alternatives", 
  "Protein", 
  "Sweets"
];

// Product form schema
const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  price: z.string().optional(),
  sku: z.string().optional(),
  inventoryCount: z.coerce.number().optional(),
  status: z.enum(["Active", "Development", "Inactive"]),
  launchDate: z.string().optional(),
  image: z.string().optional()
});

type ProductFormValues = z.infer<typeof productFormSchema>;

const BrandProducts = () => {
  const { isAuthenticated, user, role } = useUser();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // State for products
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // State for modal operations
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isViewProductOpen, setIsViewProductOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // State for form data
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: "",
    category: "",
    status: "Development",
    retailPartners: 0,
    salesLastMonth: "$0",
    image: "/placeholder.svg",
    description: "",
    price: "",
    sku: "",
    inventoryCount: 0,
    launchDate: new Date().toISOString().split('T')[0]
  });
  
  // State for image upload
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form initialization for adding a product
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: "",
      status: "Development",
      description: "",
      price: "",
      sku: "",
      inventoryCount: 0,
      launchDate: new Date().toISOString().split('T')[0],
      image: "/placeholder.svg"
    },
    mode: "onSubmit",
  });

  // Form for editing a product
  const editForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      category: "",
      status: "Development",
      description: "",
      price: "",
      sku: "",
      inventoryCount: 0,
      launchDate: new Date().toISOString().split('T')[0],
      image: "/placeholder.svg"
    },
    mode: "onSubmit",
  });
  
  useEffect(() => {
    document.title = t("products") + " - CPG Matchmaker";
    
    // If not authenticated or not a brand, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "brand") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role, t]);

  if (!isAuthenticated || role !== "brand") {
    return null;
  }

  // Filter products based on search query and filter settings
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || product.category === filterCategory;
    const matchesStatus = !filterStatus || product.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle input changes for the add/edit form
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Reset form data
  const resetFormData = () => {
    form.reset({
      name: "",
      category: "",
      status: "Development",
      description: "",
      price: "",
      sku: "",
      inventoryCount: 0,
      launchDate: new Date().toISOString().split('T')[0],
      image: "/placeholder.svg"
    });
    setUploadedImageUrl(null);
    setUploadedImage(null);
    setUploadProgress(0);
  };

  // Open edit product modal
  const openEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setUploadedImageUrl(null);
    setUploadedImage(null);
    editForm.reset({
      name: product.name,
      category: product.category,
      status: product.status,
      description: product.description || "",
      price: product.price?.replace("$", "") || "",
      sku: product.sku || "",
      inventoryCount: product.inventoryCount || 0,
      launchDate: product.launchDate || new Date().toISOString().split('T')[0],
      image: product.image
    });
    setIsEditProductOpen(true);
  };

  // Open view product details modal
  const openViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewProductOpen(true);
  };

  // Open delete confirmation modal
  const openDeleteConfirm = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteConfirmOpen(true);
  };

  // Handle add product submission
  const handleAddProduct = (values: ProductFormValues) => {
    const newProduct: Product = {
      id: Math.max(0, ...products.map(p => p.id)) + 1,
      name: values.name,
      category: values.category,
      status: values.status,
      retailPartners: 0,
      salesLastMonth: "$0",
      image: values.image || "/placeholder.svg",
      description: values.description,
      price: values.price ? `$${values.price}` : undefined,
      sku: values.sku,
      inventoryCount: values.inventoryCount,
      launchDate: values.launchDate
    };
    
    setProducts(prev => [...prev, newProduct]);
    toast({
      title: t("production-product-created"),
      description: t("production-product-added", {name: newProduct.name})
    });
    setIsAddProductOpen(false);
    resetFormData();
  };

  // Handle edit product submission
  const handleEditSubmit = (values: ProductFormValues) => {
    if (!selectedProduct) return;
    
    const updatedProduct: Product = {
      ...selectedProduct,
      name: values.name,
      category: values.category,
      status: values.status,
      description: values.description,
      price: values.price ? `$${values.price}` : undefined,
      sku: values.sku,
      inventoryCount: values.inventoryCount,
      launchDate: values.launchDate,
      image: uploadedImageUrl || values.image || selectedProduct.image
    };
    
    setProducts(
      products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    
    setIsEditProductOpen(false);
    toast({
      title: t("production-product-updated"),
      description: t("production-product-updated-successfully", {name: updatedProduct.name})
    });
  };

  // Handle product deletion
  const handleDeleteProduct = () => {
    if (!selectedProduct) return;
    
    const updatedProducts = products.filter(product => product.id !== selectedProduct.id);
    setProducts(updatedProducts);
    
    toast({
      title: t("production-product-deleted"),
      description: t("production-product-removed", {name: selectedProduct.name})
    });
    setIsDeleteConfirmOpen(false);
  };

  // Handle status change
  const handleStatusChange = (product: Product, newStatus: "Active" | "Development" | "Inactive") => {
    const updatedProducts = products.map(p => 
      p.id === product.id 
        ? { ...p, status: newStatus } 
        : p
    );
    
    setProducts(updatedProducts);
    toast({
      title: t("production-line-status-changed"),
      description: t("production-line-status-changed-description", { 
        line: product.name, 
        status: t(newStatus === "Active" ? "production-active" : newStatus === "Development" ? "production-status-in-progress" : "production-status-paused")
      })
    });
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterCategory(null);
    setFilterStatus(null);
  };

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    if (status === "Active") {
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          {status}
        </Badge>
      );
    } else if (status === "Draft") {
      return (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-50 dark:hover:bg-transparent">
          {status}
        </Badge>
      );
    } else if (status === "Discontinued") {
      return (
        <Badge variant="outline" className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-transparent">
          {status}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline">
          {status}
        </Badge>
      );
    }
  };

  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedImage(file);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedImageUrl(previewUrl);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Function to select image from gallery
  const selectImageFromGallery = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setIsImageGalleryOpen(false);
  };
  
  // Function to remove selected image
  const removeSelectedImage = () => {
    setUploadedImage(null);
    setUploadedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ImageUpload component for both forms
  const ImageUpload = ({ form, name }: { 
    form: any, // Using any for form type to avoid type conflicts
    name: keyof ProductFormValues
  }) => {
    // Using form.getValues instead of register's field value directly
    const imageValue = form.getValues(name);
    
    return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-base font-medium">
          {t("production-product-image")}
        </Label>
        <div className={cn(
          "border-2 border-dashed rounded-lg p-4",
          isDark 
            ? "hover:border-primary/50 border-slate-700" 
            : "hover:border-primary/50 border-slate-300",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        )}>
          <div className="flex flex-col items-center">
            <div 
              className={cn(
                "relative w-full max-w-[250px] h-[180px] mb-4 rounded-md overflow-hidden cursor-pointer group",
                isDark ? "bg-muted" : "bg-slate-100"
              )}
              onClick={() => {
                if (name === "image") {
                  fileInputRef.current?.click();
                }
              }}
            >
              {uploadedImageUrl || imageValue ? (
                <>
                  <img 
                    src={uploadedImageUrl || imageValue as string} 
                    alt={t("production-product-preview")} 
                    className="w-full h-full object-contain" 
                  />
                  <div className={cn(
                    "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                    isDark ? "bg-black/60" : "bg-black/40"
                  )}>
                    <UploadCloud className="h-8 w-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <ImageIcon className={cn(
                    "h-12 w-12 mb-2",
                    isDark ? "text-muted-foreground" : "text-slate-400"
                  )} />
                  <p className="text-sm text-muted-foreground">{t("gallery-no-image")}</p>
                </div>
              )}
              
              {isUploading ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80">
                  <Progress 
                    value={uploadProgress} 
                    className="w-3/4 h-2" 
                  />
                  <p className="text-xs mt-2 text-muted-foreground">
                    {uploadProgress === 100 ? t("gallery-processing") : t("gallery-uploading", {progress: uploadProgress})}
                  </p>
                </div>
              ) : null}
            </div>
            
            <input 
              {...form.register(name)}
              ref={(e) => {
                // This merges our fileInputRef with react-hook-form's ref
                if (e) {
                  const fieldRef = form.register(name).ref;
                  if (typeof fieldRef === 'function') {
                    fieldRef(e);
                  }
                  fileInputRef.current = e;
                }
              }}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => {
                handleFileUpload(e);
                // Also update the form value
                if (e.target.files?.[0]) {
                  form.setValue(name, URL.createObjectURL(e.target.files[0]));
                }
              }}
              id={name}
            />
            
            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (name === "image") {
                    fileInputRef.current?.click();
                  }
                }}
              >
                <UploadCloud className="h-4 w-4 mr-2" />
                {t("production-upload-photo")}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                size="sm"
                onClick={() => setIsImageGalleryOpen(true)}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                {t("gallery-choose-from")}
              </Button>
              
              {(uploadedImageUrl || (imageValue as string) !== "/placeholder.svg") && (
                <Button 
                  type="button" 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setUploadedImageUrl(null);
                    form.setValue(name, "/placeholder.svg");
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  {t("remove")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render product cards
  const renderProducts = () => {
    return filteredProducts.map((product) => (
      <motion.div
        key={product.id}
        className="relative bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
      >
        <div 
          className="cursor-pointer" 
          onClick={() => openViewProduct(product)}
        >
          <div className="h-48 overflow-hidden">
            <img
              src={product.image || "/images/placeholder-product.jpg"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{product.category}</p>
            <div className="mt-2 flex items-center">
              <span className="text-yellow-500 mr-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                </svg>
              </span>
              <span className="text-gray-700 dark:text-gray-200">{product.rating || "4.2"}</span>
            </div>
            <div className="mt-2">
              <span className="font-medium text-gray-900 dark:text-white">{product.price}</span>
              {product.oldPrice && (
                <span className="ml-2 text-sm text-gray-500 line-through">{product.oldPrice}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="px-4 pb-4 pt-0 flex justify-between">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openViewProduct(product);
            }}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            View
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openEditProduct(product);
            }}
            className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <PencilLine className="h-3.5 w-3.5 mr-1.5" />
            Edit
          </button>
        </div>
      </motion.div>
    ));
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
                <motion.h1 
                  className="text-3xl font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                  {t("production-title")}
                </h1>
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {user?.companyName} - {t("production-subtitle")}
                </motion.p>
              </div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <Button 
                  className="group"
                  onClick={() => {
                    resetFormData();
                    setIsAddProductOpen(true);
                  }}
                >
                <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                {t("production-add-line")}
              </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Search and Filter */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="sm:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder={t("search-products-placeholder")} 
                  className="pl-10" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="group w-full justify-between">
                  <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    <span>{t("filter-products")}</span>
                  </div>
                  <span className="text-xs">
                    {filterCategory || filterStatus ? (
                      <Badge variant="secondary" className="ml-2">{t("active-filters")}</Badge>
                    ) : null}
                  </span>
            </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">{t("category")}</p>
                  <Select
                    value={filterCategory || ""}
                    onValueChange={(value) => setFilterCategory(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("all-categories")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t("all-categories")}</SelectItem>
                      {productCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
          </div>
                <DropdownMenuSeparator />
                <div className="p-2">
                  <p className="text-sm font-medium mb-2">{t("status")}</p>
                  <Select
                    value={filterStatus || ""}
                    onValueChange={(value) => setFilterStatus(value === "" ? null : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("production-all-statuses")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">{t("production-all-statuses")}</SelectItem>
                      <SelectItem value="Active">{t("production-active")}</SelectItem>
                      <SelectItem value="Development">{t("production-status-in-progress")}</SelectItem>
                      <SelectItem value="Inactive">{t("production-status-paused")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="justify-center text-center cursor-pointer"
                  onClick={resetFilters}
                >
                  {t("reset-filters")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
          
          {/* Products Grid - Updated card design to move buttons below the image */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
            {filteredProducts.length > 0 ? (
              <>
            {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className={cn(
                      "overflow-hidden transition-all duration-200 h-full flex flex-col",
                      isDark 
                        ? "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 bg-card/60" 
                        : "hover:border-primary/40 hover:shadow-md bg-background"
                    )}>
                      {/* Product Image - Now clickable to open details */}
                      <div 
                        className="relative cursor-pointer overflow-hidden aspect-square"
                        onClick={() => openViewProduct(product)}
                      >
                        {product.image ? (
                  <img 
                    src={product.image}
                    alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        ) : (
                          <div className={cn(
                            "h-full w-full flex items-center justify-center",
                            isDark ? "bg-muted" : "bg-slate-100"
                          )}>
                            <Package2 className="h-12 w-12 text-muted-foreground/40" />
                </div>
                        )}
                        
                        {/* Status Badge - Float on top of image */}
                        <div className="absolute top-2 right-2 z-10">
                    {getStatusBadge(product.status)}
                  </div>
                    </div>
                      
                      <CardContent className="p-4 flex-grow">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium truncate text-base">{product.name}</h3>
                            <p className="text-sm font-semibold text-primary">{product.price}</p>
                    </div>
                          
                          <div className="flex items-center text-xs text-muted-foreground space-x-4">
                            <div className="flex items-center">
                              <Tag className="h-3 w-3 mr-1" />
                              <span>{product.category}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Package className="h-3 w-3 mr-1" />
                              <span>{t("inventory-product-stock")}: {product.inventoryCount || 0}</span>
                            </div>
                          </div>
                          
                          {product.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2">
                              {product.description}
                            </p>
                          )}
                  </div>
                </CardContent>
                      
                      {/* Action Buttons - Now below the image as requested */}
                      <CardFooter className="px-4 py-3 border-t border-border mt-auto">
                        <div className="flex space-x-2 w-full">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              openViewProduct(product);
                            }}
                          >
                            <Eye className="h-3.5 w-3.5 mr-1.5" />
                            {t("inventory-action-view")}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditProduct(product);
                            }}
                          >
                            <PencilLine className="h-3.5 w-3.5 mr-1.5" />
                    {t("inventory-action-edit")}
                  </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-9 p-0 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDeleteConfirm(product);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                        </div>
                </CardFooter>
              </Card>
                  </motion.div>
                ))}
              </>
            ) : (
              <div className="col-span-full">
                <div className={cn(
                  "rounded-lg border p-8 text-center",
                  isDark ? "bg-card" : "bg-slate-50"
                )}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">{t("production-no-products-found")}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery || filterCategory || filterStatus 
                      ? t("production-adjust-search") 
                      : t("production-start-create")}
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={() => {
                      resetFormData();
                      setIsAddProductOpen(true);
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t("production-add-product")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Image Gallery Modal */}
      <Dialog 
        open={isImageGalleryOpen} 
        onOpenChange={setIsImageGalleryOpen}
      >
        <DialogContent className="sm:max-w-[600px] z-[100]">
          <DialogHeader>
            <DialogTitle>{t("gallery-choose-image")}</DialogTitle>
            <DialogDescription>
              {t("gallery-select-description")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-3 gap-4 py-4">
            {mockImageGallery.map((imageUrl, index) => (
              <div 
                key={index}
                className={cn(
                  "h-24 border rounded-md overflow-hidden cursor-pointer hover:border-primary transition-all duration-200",
                  (form.getValues("image") === imageUrl || editForm.getValues("image") === imageUrl) 
                    ? "ring-2 ring-primary" 
                    : ""
                )}
                onClick={() => {
                  // Update the active form
                  if (isAddProductOpen) {
                    form.setValue("image", imageUrl);
                  } else if (isEditProductOpen) {
                    editForm.setValue("image", imageUrl);
                  }
                  setUploadedImageUrl(null);
                  setIsImageGalleryOpen(false);
                }}
              >
                <img 
                  src={imageUrl} 
                  alt={`${t("gallery-image")} ${index + 1}`} 
                  className="w-full h-full object-cover"
                />
                </div>
            ))}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageGalleryOpen(false)}>
              {t("cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Product Modal */}
      <Dialog 
        open={isAddProductOpen} 
        onOpenChange={(open) => {
          setIsAddProductOpen(open);
          if (!open) resetFormData();
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto z-[100]">
          <DialogHeader>
            <DialogTitle>{t("production-create-new-product")}</DialogTitle>
            <DialogDescription>
              {t("production-add-new-product")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddProduct)} className="space-y-6">
              <ImageUpload form={form} name="image" />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-right">
                        {t("production-product-name")} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        {...field}
                        placeholder={t("production-enter-product-name")}
                        className={!field.value ? "border-destructive" : ""}
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-right">
                        {t("production-category")} <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="category" className={!field.value ? "border-destructive" : ""}>
                          <SelectValue placeholder={t("production-select-category")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t("categories")}</SelectLabel>
                            {productCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="description">{t("production-description")}</Label>
                    <Textarea
                      {...field}
                      placeholder={t("production-enter-description")}
                      className="min-h-24"
                    />
                  </div>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="price">{t("price")}</Label>
                      <Input
                        {...field}
                        placeholder="0.00"
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="sku"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="sku">{t("sku")}</Label>
                      <Input
                        {...field}
                        placeholder="SKU-123"
                      />
                    </div>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="inventoryCount"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="inventoryCount">{t("inventory-product-stock")}</Label>
                      <Input
                        {...field}
                        type="number"
                        placeholder="0"
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="status">{t("status")}</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="status">
                          <SelectValue placeholder={t("production-select-status")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">{t("production-active")}</SelectItem>
                          <SelectItem value="Development">{t("production-status-in-progress")}</SelectItem>
                          <SelectItem value="Inactive">{t("production-status-paused")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="launchDate"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="launchDate">{t("production-operational-since")}</Label>
                    <Input
                      {...field}
                      type="date"
                    />
                  </div>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddProductOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit">
                  {t("production-create-product")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog 
        open={isEditProductOpen} 
        onOpenChange={(open) => {
          setIsEditProductOpen(open);
          if (!open) {
            setUploadedImageUrl(null);
            setUploadedImage(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[625px] max-h-[90vh] overflow-auto z-[100]">
          <DialogHeader>
            <DialogTitle>{t("production-edit-product")}</DialogTitle>
            <DialogDescription>
              {t("production-update-details")}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-6">
              <ImageUpload form={editForm} name="image" />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="edit-name" className="text-right">
                        {t("production-product-name")} <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        {...field}
                        id="edit-name"
                        placeholder={t("production-enter-product-name")}
                        className={!field.value ? "border-destructive" : ""}
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="category"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="edit-category" className="text-right">
                        {t("production-category")} <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="edit-category" className={!field.value ? "border-destructive" : ""}>
                          <SelectValue placeholder={t("production-select-category")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>{t("categories")}</SelectLabel>
                            {productCategories.map(category => (
                              <SelectItem key={category} value={category}>{category}</SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">{t("production-description")}</Label>
                    <Textarea
                      {...field}
                      id="edit-description"
                      placeholder={t("production-enter-description")}
                      className="min-h-24"
                    />
                  </div>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="price"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">{t("price")}</Label>
                      <Input
                        {...field}
                        id="edit-price"
                        placeholder="0.00"
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="sku"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="edit-sku">{t("sku")}</Label>
                      <Input
                        {...field}
                        id="edit-sku"
                        placeholder="SKU-123"
                      />
                    </div>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={editForm.control}
                  name="inventoryCount"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="edit-inventory">{t("inventory-product-stock")}</Label>
                      <Input
                        {...field}
                        id="edit-inventory"
                        type="number"
                        placeholder="0"
                      />
                    </div>
                  )}
                />
                
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">{t("status")}</Label>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger id="edit-status">
                          <SelectValue placeholder={t("production-select-status")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Active">{t("production-active")}</SelectItem>
                          <SelectItem value="Development">{t("production-status-in-progress")}</SelectItem>
                          <SelectItem value="Inactive">{t("production-status-paused")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>
              
              <FormField
                control={editForm.control}
                name="launchDate"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="edit-launch-date">{t("production-operational-since")}</Label>
                    <Input
                      {...field}
                      id="edit-launch-date"
                      type="date"
                    />
                  </div>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditProductOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit">
                  {t("production-update-product")}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* View Product Details Modal */}
      <Dialog open={isViewProductOpen} onOpenChange={setIsViewProductOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto z-[100]">
          {selectedProduct && (
            <>
              <DialogHeader>
                <div className="flex justify-between items-center">
                  <DialogTitle>{selectedProduct.name}</DialogTitle>
                  {getStatusBadge(selectedProduct.status)}
                </div>
                <DialogDescription>
                  {selectedProduct.category} • {t("sku")}: {selectedProduct.sku || t("suppliers-not-specified")}
                </DialogDescription>
              </DialogHeader>
              
              <div className={cn(
                "aspect-video w-full rounded-md overflow-hidden mb-4 border",
                isDark ? "border-slate-700" : "border-slate-200"
              )}>
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="details" className="flex-1">{t("details")}</TabsTrigger>
                  <TabsTrigger value="sales" className="flex-1">{t("analytics-sales-performance")}</TabsTrigger>
                  <TabsTrigger value="retailers" className="flex-1">{t("retailers-title")}</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="space-y-4 mt-4">
                  <div className={cn(
                    "rounded-lg p-4 space-y-4",
                    isDark ? "bg-card" : "bg-slate-50"
                  )}>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("price")}</h4>
                        <p className="text-base font-medium">{selectedProduct.price || t("suppliers-not-specified")}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("inventory-product-stock")}</h4>
                        <p className="text-base font-medium">{selectedProduct.inventoryCount || 0} {t("production-units")}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("production-description")}</h4>
                      <p className="text-sm">{selectedProduct.description || t("suppliers-not-specified")}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("production-operational-since")}</h4>
                        <p className="text-sm">
                          {selectedProduct.launchDate 
                            ? new Date(selectedProduct.launchDate).toLocaleDateString() 
                            : t("suppliers-not-specified")}
                        </p>
          </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">{t("status")}</h4>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(selectedProduct.status)}
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-7 px-2"
                            onClick={() => {
                              setIsViewProductOpen(false);
                              const newStatus = selectedProduct.status === "Active" ? "Inactive" : "Active";
                              handleStatusChange(selectedProduct, newStatus);
                            }}
                          >
                            {selectedProduct.status === "Active" ? t("production-status-paused") : t("production-active")}
                          </Button>
        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="sales" className="space-y-4 mt-4">
                  <div className={cn(
                    "rounded-lg p-6",
                    isDark ? "bg-card" : "bg-slate-50"
                  )}>
                    <h4 className="text-sm font-medium mb-4 flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                      {t("analytics-sales-performance")}
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t("analytics-last-month")}</span>
                        <span className="font-medium">{selectedProduct.salesLastMonth}</span>
                      </div>
                      <div className={cn(
                        "h-0.5 w-full my-2", 
                        isDark ? "bg-slate-700" : "bg-slate-200"
                      )} />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Q1 2023</span>
                        <span className="font-medium">$112,500</span>
                      </div>
                      <div className={cn(
                        "h-0.5 w-full my-2", 
                        isDark ? "bg-slate-700" : "bg-slate-200"
                      )} />
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{t("analytics-this-year")}</span>
                        <span className="font-medium">$345,000</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t("analytics-view-detailed-metrics")}
                  </Button>
                </TabsContent>
                
                <TabsContent value="retailers" className="space-y-4 mt-4">
                  {selectedProduct.retailPartners > 0 ? (
                    <div className="space-y-4">
                      <div className={cn(
                        "p-4 rounded-lg",
                        isDark ? "bg-card" : "bg-slate-50"
                      )}>
                        <p className="text-sm mb-3">
                          {t("retailers-product-carries", {retailPartners: selectedProduct.retailPartners})}
                        </p>
                        <ul className="space-y-3">
                          <li className={cn(
                            "flex justify-between items-center p-3 rounded-md",
                            isDark ? "bg-muted/50" : "bg-white border border-slate-200"
                          )}>
                            <div className="flex items-center">
                              <div className={cn(
                                "h-9 w-9 rounded-full mr-3 flex items-center justify-center",
                                isDark ? "bg-blue-900/30" : "bg-blue-100"
                              )}>
                                <Store className={cn(
                                  "h-4 w-4",
                                  isDark ? "text-blue-300" : "text-blue-600"
                                )} />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Wholesome Market</p>
                                <p className="text-xs text-muted-foreground">12 stores</p>
                              </div>
                            </div>
                            <Badge variant="outline">{t("retailers-top-seller")}</Badge>
                          </li>
                          <li className={cn(
                            "flex justify-between items-center p-3 rounded-md",
                            isDark ? "bg-muted/50" : "bg-white border border-slate-200"
                          )}>
                            <div className="flex items-center">
                              <div className={cn(
                                "h-9 w-9 rounded-full mr-3 flex items-center justify-center",
                                isDark ? "bg-green-900/30" : "bg-green-100"
                              )}>
                                <Store className={cn(
                                  "h-4 w-4",
                                  isDark ? "text-green-300" : "text-green-600"
                                )} />
                              </div>
                              <div>
                                <p className="text-sm font-medium">Nature's Pantry</p>
                                <p className="text-xs text-muted-foreground">8 stores</p>
                              </div>
                            </div>
                            <Badge variant="outline">{t("production-active")}</Badge>
                          </li>
                        </ul>
                      </div>
                      <Button variant="outline" size="sm" className="w-full">
                        <Store className="h-4 w-4 mr-2" />
                        {t("retailers-view-all")}
                      </Button>
                    </div>
                  ) : (
                    <div className={cn(
                      "text-center py-6 rounded-lg",
                      isDark ? "bg-card" : "bg-slate-50"
                    )}>
                      <div className={cn(
                        "rounded-full inline-flex p-3 mb-4",
                        isDark ? "bg-muted" : "bg-slate-200"
                      )}>
                        <Store className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h4 className="font-medium mb-2">{t("retailers-no-partners")}</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t("retailers-not-carried")}
                      </p>
                      <Button size="sm" variant="outline">{t("retailers-find")}</Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <DialogFooter className="flex justify-between sm:justify-between gap-2 pt-4">
                <Button 
                  variant="outline"
                  onClick={() => setIsViewProductOpen(false)}
                >
                  {t("close")}
                </Button>
                <div className="flex gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="destructive"
                          size="icon"
                          onClick={() => {
                            setIsViewProductOpen(false);
                            openDeleteConfirm(selectedProduct);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>{t("production-delete-product")}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Button 
                    variant="default"
                    onClick={() => {
                      setIsViewProductOpen(false);
                      openEditProduct(selectedProduct);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    {t("production-edit-product")}
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px] z-[100]">
          <DialogHeader>
            <DialogTitle className="flex items-center text-destructive">
              <AlertCircle className="h-5 w-5 mr-2" />
              {t("production-delete-product")}
            </DialogTitle>
            <DialogDescription>
              {t("production-delete-confirmation-part1")} <span className="font-medium">{selectedProduct?.name}</span>? {t("production-delete-confirmation-part2")}
            </DialogDescription>
          </DialogHeader>
          
          <div className={cn(
            "rounded-lg p-4 mb-4",
            isDark ? "bg-destructive/10" : "bg-red-50"
          )}>
            <div className="flex items-start">
              <div className={cn(
                "mr-3 flex-shrink-0 rounded-full p-1",
                isDark ? "bg-destructive/20" : "bg-red-100"
              )}>
                <AlertCircle className={cn(
                  "h-5 w-5",
                  isDark ? "text-red-400" : "text-destructive"
                )} />
              </div>
              <div className="text-sm">
                <p className={cn(
                  "font-medium mb-1",
                  isDark ? "text-red-400" : "text-destructive"
                )}>
                  {t("warning")}
                </p>
                <p className="text-muted-foreground">
                  {t("delete-product-warning")}
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-2">
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t("production-delete-product")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </BrandLayout>
  );
};

export default BrandProducts;
