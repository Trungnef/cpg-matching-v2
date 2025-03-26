import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Download, 
  Package, 
  BoxIcon, 
  Boxes, 
  Info, 
  AlertCircle, 
  Loader2, 
  ArrowUpDown, 
  SortAsc, 
  SortDesc, 
  TrendingUp, 
  TrendingDown,
  ThermometerIcon,
  RefreshCw,
  X,
  LayoutGrid,
  MapPin,
  Plus,
  Edit,
  Minus,
  AlertTriangle,
  ListFilter,
  History,
  ShoppingCart,
  Trash2 as Trash
} from "lucide-react";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import ManufacturerLayout from "@/components/layouts/ManufacturerLayout";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Define role tabs
const roleTabs = [
  { id: "overview", label: "Overview", path: "/dashboard" },
  { id: "production", label: "Production Lines", path: "/dashboard" },
  { id: "orders", label: "Orders", path: "/dashboard" },
  { id: "performance", label: "Performance", path: "/dashboard" },
  { id: "opportunities", label: "Opportunities", path: "/dashboard" },
  { id: "inventory", label: "Inventory", path: "/manufacturer/inventory" },
  { id: "analytics", label: "Analytics", path: "/manufacturer/analytics" },
  { id: "suppliers", label: "Suppliers", path: "/manufacturer/suppliers" },
  { id: "matches", label: "Matches", path: "/manufacturer/matches" },
  { id: "settings", label: "Settings", path: "/manufacturer/settings" }
];

// TypeScript interfaces for inventory data
interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  location: string;
  reorderPoint: number;
  lastProduced: string;
  sku?: string;
  description?: string;
  price?: number;
  unitType?: string;
  minimumOrderQuantity?: number;
  image?: string;
  tags?: string[];
  stockHistory?: StockHistoryItem[];
  expiryDate?: string;
  maxStock?: number;
}

interface RawMaterial {
  id: string;
  name: string;
  category: string;
  stock: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  location: string;
  supplier: string;
  reorderPoint: number;
  unit?: string;
  maxStock?: number;
  unitType?: string;
  price?: number;
  leadTime?: number; // Days needed to get material after ordering
  lastOrdered?: string;
  batchNumber?: string;
  storageConditions?: string[];
  stockHistory?: StockHistoryItem[];
  expiryDate?: string;
}

interface StockHistoryItem {
  date: string;
  quantity: number;
  type: "in" | "out" | "addition" | "removal";
  reference?: string;
  note?: string;
  notes?: string;
}

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  materials: string[];
  reliabilityScore: number;
  leadTime: number;
}

interface ItemWarehouse {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentUtilization: number;
  storageConditions?: string[];
  items: { id: string; quantity: number }[];
}

const Inventory = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // States for inventory management
  const [activeTab, setActiveTab] = useState("inventory");
  const [inventoryView, setInventoryView] = useState("products");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  // Product states
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<RawMaterial | null>(null);
  const [productView, setProductView] = useState<"grid" | "table">("table");
  
  // Filter states
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  
  // Dialog states
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isProductDetailsOpen, setIsProductDetailsOpen] = useState(false);
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isOrderMaterialOpen, setIsOrderMaterialOpen] = useState(false);
  const [isUpdateStockOpen, setIsUpdateStockOpen] = useState(false);
  const [isMaterialDetailsOpen, setIsMaterialDetailsOpen] = useState(false);
  const [isDeleteMaterialOpen, setIsDeleteMaterialOpen] = useState(false);
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);
  
  // Animation control
  const [animationEnabled, setAnimationEnabled] = useState(true);
  
  // Stats references for animations
  const statsRefs = {
    totalProducts: useRef<HTMLDivElement>(null),
    lowStock: useRef<HTMLDivElement>(null),
    outOfStock: useRef<HTMLDivElement>(null),
    rawMaterials: useRef<HTMLDivElement>(null)
  };
  
  // Mock data for products and materials
  const productsData: Product[] = [
    {
      id: "P001",
      name: "Organic Whole Grain Cereal",
      category: "Cereals",
      stock: 1250,
      status: "In Stock",
      location: "Warehouse A",
      reorderPoint: 500,
      lastProduced: "2023-06-01",
      sku: "CERL-001",
      description: "Organic, non-GMO whole grain cereal with no added sugar",
      price: 4.99,
      unitType: "boxes",
      minimumOrderQuantity: 100,
      image: "/placeholder.svg",
      tags: ["organic", "breakfast", "health"],
      stockHistory: [
        { date: "2023-06-01", quantity: 1500, type: "in", reference: "PROD-123" },
        { date: "2023-06-15", quantity: 250, type: "out", reference: "ORD-456" }
      ],
      expiryDate: "2024-06-01"
    },
    {
      id: "P002",
      name: "Protein Granola Bars",
      category: "Snack Bars",
      stock: 850,
      status: "In Stock",
      location: "Warehouse A",
      reorderPoint: 300,
      lastProduced: "2023-06-05",
      sku: "BARS-002",
      description: "High protein granola bars with nuts and dried fruits",
      price: 6.99,
      unitType: "boxes",
      minimumOrderQuantity: 50,
      tags: ["protein", "snacks", "fitness"],
      stockHistory: [
        { date: "2023-06-05", quantity: 1000, type: "in", reference: "PROD-124" },
        { date: "2023-06-20", quantity: 150, type: "out", reference: "ORD-457" }
      ],
      expiryDate: "2024-03-05"
    },
    {
      id: "P003",
      name: "Natural Fruit Juice",
      category: "Beverages",
      stock: 450,
      status: "Low Stock",
      location: "Warehouse B",
      reorderPoint: 400,
      lastProduced: "2023-05-20",
      sku: "BEV-003",
      description: "100% natural fruit juice, no added sugar",
      price: 2.99,
      unitType: "bottles",
      minimumOrderQuantity: 200,
      tags: ["beverage", "natural", "hydration"],
      stockHistory: [
        { date: "2023-05-20", quantity: 500, type: "in", reference: "PROD-110" },
        { date: "2023-06-10", quantity: 175, type: "out", reference: "ORD-442" }
      ],
      expiryDate: "2024-05-20"
    },
    {
      id: "P004",
      name: "Gluten-Free Pasta",
      category: "Pasta & Noodles",
      stock: 1350,
      status: "In Stock",
      location: "Warehouse C",
      reorderPoint: 600,
      lastProduced: "2023-06-10",
      sku: "PASTA-004",
      description: "Gluten-free pasta made from organic wheat flour",
      price: 3.99,
      unitType: "boxes",
      minimumOrderQuantity: 200,
      tags: ["gluten-free", "pasta", "health"],
      stockHistory: [
        { date: "2023-06-10", quantity: 2000, type: "in", reference: "PROD-130" },
        { date: "2023-06-25", quantity: 500, type: "out", reference: "ORD-470" }
      ],
      expiryDate: "2023-12-10"
    },
    {
      id: "P005",
      name: "Vegan Protein Shake",
      category: "Beverages",
      stock: 950,
      status: "In Stock",
      location: "Warehouse A",
      reorderPoint: 200,
      lastProduced: "2023-05-15",
      sku: "BEV-005",
      description: "Plant-based protein shake with 25g protein per serving",
      price: 5.49,
      unitType: "bottles",
      minimumOrderQuantity: 100,
      tags: ["vegan", "protein", "fitness"],
      stockHistory: [
        { date: "2023-05-15", quantity: 300, type: "in", reference: "PROD-105" },
        { date: "2023-06-05", quantity: 300, type: "out", reference: "ORD-420" }
      ],
      expiryDate: "2024-05-15"
    },
    {
      id: "P006",
      name: "Organic Fruit Snacks",
      category: "Snack Bars",
      stock: 275,
      status: "Low Stock",
      location: "Warehouse B",
      reorderPoint: 300,
      lastProduced: "2023-05-25",
      sku: "BARS-006",
      description: "Organic fruit snacks with no added sugar",
      price: 4.99,
      unitType: "boxes",
      minimumOrderQuantity: 50,
      tags: ["organic", "snacks", "health"],
      stockHistory: [
        { date: "2023-05-25", quantity: 500, type: "in", reference: "PROD-112" },
        { date: "2023-06-15", quantity: 75, type: "out", reference: "ORD-455" }
      ],
      expiryDate: "2024-02-25"
    }
  ];

  const materialsData: RawMaterial[] = [
    {
      id: "M001",
      name: "Organic Wheat Flour",
      category: "Grains",
      stock: 2500,
      status: "In Stock",
      location: "Warehouse A",
      supplier: "EcoGrain Supplies",
      reorderPoint: 1000,
      unitType: "kg",
      price: 2.50,
      leadTime: 10,
      lastOrdered: "2023-05-20",
      batchNumber: "WHT-2023-05-20-1",
      storageConditions: ["Dry", "Cool"],
      stockHistory: [
        { date: "2023-05-20", quantity: 3000, type: "in", reference: "PO-567" },
        { date: "2023-06-01", quantity: 500, type: "out", reference: "PROD-123" }
      ],
      expiryDate: "2023-11-20"
    },
    {
      id: "M002",
      name: "Natural Cane Sugar",
      category: "Sweeteners",
      stock: 1800,
      status: "In Stock",
      location: "Warehouse A",
      supplier: "Pure Sweeteners Inc.",
      reorderPoint: 800,
      unitType: "kg",
      price: 3.00,
      leadTime: 10,
      lastOrdered: "2023-05-15",
      batchNumber: "AGV-2023-05-15-1",
      storageConditions: ["Cool", "Sealed"],
      stockHistory: [
        { date: "2023-05-05", quantity: 1000, type: "in", reference: "PO-550" },
        { date: "2023-06-01", quantity: 150, type: "out", reference: "PROD-123" }
      ],
      expiryDate: "2024-05-05"
    },
    {
      id: "M003",
      name: "Organic Fruits Blend",
      category: "Fruits",
      stock: 350,
      status: "Low Stock",
      location: "Warehouse B",
      supplier: "NaturalNuts Co.",
      reorderPoint: 600,
      unitType: "kg",
      price: 7.50,
      leadTime: 15,
      lastOrdered: "2023-05-10",
      batchNumber: "PEA-2023-05-10-1",
      storageConditions: ["Dry", "Cool", "Sealed"],
      stockHistory: [
        { date: "2023-05-10", quantity: 800, type: "in", reference: "PO-555" },
        { date: "2023-05-20", quantity: 250, type: "out", reference: "PROD-110" }
      ],
      expiryDate: "2023-11-10"
    },
    {
      id: "M004",
      name: "Whey Protein Isolate",
      category: "Proteins",
      stock: 450,
      status: "Low Stock",
      location: "Warehouse A",
      supplier: "PureFlavor Extracts",
      reorderPoint: 200,
      unitType: "liters",
      price: 12.00,
      leadTime: 20,
      lastOrdered: "2023-04-30",
      batchNumber: "COC-2023-04-30-1",
      storageConditions: ["Cool", "Dark"],
      stockHistory: [
        { date: "2023-04-30", quantity: 300, type: "in", reference: "PO-540" },
        { date: "2023-06-10", quantity: 125, type: "out", reference: "PROD-130" }
      ],
      expiryDate: "2023-10-30"
    },
    {
      id: "M005",
      name: "Rice Flour",
      category: "Grains",
      stock: 1200,
      status: "In Stock",
      location: "Warehouse C",
      supplier: "EcoGrain Supplies",
      reorderPoint: 500,
      unitType: "kg",
      price: 4.50,
      leadTime: 12,
      lastOrdered: "2023-05-10",
      batchNumber: "RCF-2023-05-10-1",
      storageConditions: ["Dry", "Cool"],
      stockHistory: [
        { date: "2023-05-10", quantity: 1500, type: "in", reference: "PO-555" },
        { date: "2023-06-05", quantity: 300, type: "out", reference: "PROD-125" }
      ],
      expiryDate: "2023-11-10"
    },
    {
      id: "M006",
      name: "Natural Flavor Extract",
      category: "Flavorings",
      stock: 350,
      status: "Low Stock",
      location: "Warehouse B",
      supplier: "Pure Sweeteners Inc.",
      reorderPoint: 400,
      unitType: "liters",
      price: 15.00,
      leadTime: 20,
      lastOrdered: "2023-05-05",
      batchNumber: "AGV-2023-05-05-1",
      storageConditions: ["Cool", "Sealed"],
      stockHistory: [
        { date: "2023-05-05", quantity: 500, type: "in", reference: "PO-550" },
        { date: "2023-06-01", quantity: 150, type: "out", reference: "PROD-123" }
      ],
      expiryDate: "2024-05-05"
    },
    {
      id: "M007",
      name: "Eco-Friendly Packaging",
      category: "Packaging",
      stock: 3200,
      status: "In Stock",
      location: "Warehouse C",
      supplier: "Green Packaging Solutions",
      reorderPoint: 1500,
      unitType: "units",
      price: 0.25,
      leadTime: 30,
      lastOrdered: "2023-04-15",
      batchNumber: "PKG-2023-04-15-1",
      storageConditions: ["Dry"],
      stockHistory: [
        { date: "2023-04-15", quantity: 5000, type: "in", reference: "PO-520" },
        { date: "2023-05-20", quantity: 1800, type: "out", reference: "PROD-110" }
      ],
      expiryDate: "2025-04-15"
    }
  ];

  // Load data on component mount
  useEffect(() => {
    document.title = "Inventory Management - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
      navigate("/dashboard");
    }

    // Load products and materials
    setProducts(productsData);
    setMaterials(materialsData);
  }, [isAuthenticated, navigate, role]);

  if (!isAuthenticated || role !== "manufacturer") {
    return null;
  }

  // Handle tab changes, including navigation to other pages
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Find the selected tab and navigate to its path
    const selectedTab = roleTabs.find(tab => tab.id === value);
    if (selectedTab?.path) {
      navigate(selectedTab.path);
    }
  };

  // Function to refresh inventory data
  const refreshInventory = () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would fetch fresh data from the backend
      setRefreshing(false);
      toast({
        title: "Inventory Refreshed",
        description: "Inventory data has been updated.",
      });
    }, 1500);
  };

  // Handle product stock update
  const handleStockUpdate = (productId: string, newQuantity: number, type: "in" | "out") => {
    setProducts(prevProducts => 
      prevProducts.map(product => {
        if (product.id === productId) {
          const updatedStock = type === "in" 
            ? product.stock + newQuantity 
            : Math.max(0, product.stock - newQuantity);
          
          // Determine status based on new stock level
          let newStatus: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock";
          if (updatedStock === 0) {
            newStatus = "Out of Stock";
          } else if (updatedStock <= product.reorderPoint) {
            newStatus = "Low Stock";
          }
          
          // Add to stock history
          const newHistoryItem: StockHistoryItem = {
            date: new Date().toISOString().split('T')[0],
            quantity: newQuantity,
            type,
            reference: `MANUAL-${Date.now().toString().substring(8)}`
          };
          
          return {
            ...product,
            stock: updatedStock,
            status: newStatus,
            stockHistory: [...(product.stockHistory || []), newHistoryItem]
          };
        }
        return product;
      })
    );
    
    toast({
      title: `Stock ${type === "in" ? "Added" : "Removed"}`,
      description: `${newQuantity} units have been ${type === "in" ? "added to" : "removed from"} inventory.`,
    });
  };

  // Handle material order
  const handleMaterialOrder = (materialId: string, quantity: number) => {
    setMaterials(prevMaterials => 
      prevMaterials.map(material => {
        if (material.id === materialId) {
          // Simulate order by adding to stock history, but not yet to actual stock
          const newHistoryItem: StockHistoryItem = {
            date: new Date().toISOString().split('T')[0],
            quantity,
            type: "in",
            reference: `PO-${Date.now().toString().substring(8)}`,
            notes: "Ordered, not yet received"
          };
          
          return {
            ...material,
            lastOrdered: new Date().toISOString().split('T')[0],
            stockHistory: [...(material.stockHistory || []), newHistoryItem]
          };
        }
        return material;
      })
    );
    
    toast({
      title: "Order Placed",
      description: `${quantity} units have been ordered. Expected arrival in ${
        materials.find(m => m.id === materialId)?.leadTime || 'N/A'
      } days.`,
    });
  };

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (product.sku?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
                         (product.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || product.status === statusFilter;
    const matchesLocation = locationFilter === "all" || product.location === locationFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  }).sort((a, b) => {
    if (!sortField) return 0;
    
    const fieldA = a[sortField as keyof Product];
    const fieldB = b[sortField as keyof Product];
    
    if (typeof fieldA === 'string' && typeof fieldB === 'string') {
      return sortDirection === 'asc' 
        ? fieldA.localeCompare(fieldB) 
        : fieldB.localeCompare(fieldA);
    }
    
    if (typeof fieldA === 'number' && typeof fieldB === 'number') {
      return sortDirection === 'asc' 
        ? fieldA - fieldB 
        : fieldB - fieldA;
    }
    
    return 0;
  });

  // Filter and sort materials
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || material.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || material.status === statusFilter;
    const matchesLocation = locationFilter === "all" || material.location === locationFilter;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesLocation;
  });

  // Get unique categories, locations, etc. for filter dropdowns
  const productCategories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  const materialCategories = ["all", ...Array.from(new Set(materials.map(m => m.category)))];
  const allCategories = ["all", ...Array.from(new Set([...productCategories, ...materialCategories].filter(c => c !== "all")))];
  const locations = ["all", ...Array.from(new Set([...products.map(p => p.location), ...materials.map(m => m.location)]))];
  const suppliers = Array.from(new Set(materials.map(m => m.supplier)));
  
  // Status badge generator with improved styling for light/dark modes
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "In Stock":
        return <Badge variant="outline" className="bg-green-500/10 text-green-500 dark:bg-green-500/20 dark:text-green-400 border-green-500/20">In Stock</Badge>;
      case "Low Stock":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20 dark:text-yellow-400 border-yellow-500/20">Low Stock</Badge>;
      case "Out of Stock":
        return <Badge variant="outline" className="bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400 border-red-500/20">Out of Stock</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Update the updateProductStock function
  const updateProductStock = (productId: string, action: string, quantity: number, note: string) => {
    setProducts(prev => 
      prev.map(product => {
        if (product.id === productId) {
          const newStock = action === "addition" 
            ? product.stock + quantity 
            : Math.max(0, product.stock - quantity);
          
          // Determine the new status based on stock level
          let newStatus = product.status;
          if (newStock === 0) {
            newStatus = "Out of Stock";
          } else if (newStock < (product.maxStock || 100) * 0.2) {
            newStatus = "Low Stock";
          } else {
            newStatus = "In Stock";
          }
          
          // Add to stock history
          const stockHistory = product.stockHistory || [];
          stockHistory.push({
            date: new Date().toISOString(),
            quantity: quantity,
            type: action === "addition" ? "addition" : "removal",
            reference: `Manual ${action === "addition" ? "addition" : "removal"}`,
            note: note || `${action === "addition" ? "Added" : "Removed"} ${quantity} units`,
          });
          
          return {
            ...product,
            stock: newStock,
            status: newStatus,
            stockHistory
          };
        }
        return product;
      })
    );
    
    toast({
      title: `Stock ${action === "addition" ? "Added" : "Removed"}`,
      description: `${quantity} units ${action === "addition" ? "added to" : "removed from"} inventory.`
    });
  };

  // Add an orderMaterial function
  const orderMaterial = (materialId: string, quantity: number, supplier: string) => {
    setMaterials(prev => 
      prev.map(material => {
        if (material.id === materialId) {
          const stockHistory = material.stockHistory || [];
          stockHistory.push({
            date: new Date().toISOString(),
            quantity: quantity,
            type: "addition",
            reference: `Order from ${supplier}`,
            note: `Ordered ${quantity} ${material.unit || 'units'} from ${supplier}`,
          });
          
          toast({
            title: "Material Ordered",
            description: `Order for ${quantity} ${material.unit || 'units'} of ${material.name} has been placed.`,
          });
          
          return {
            ...material,
            lastOrdered: new Date().toISOString()
          };
        }
        return material;
      })
    );
  };

  return (
    <ManufacturerLayout>
      <div className="max-w-none px-4 sm:px-6 lg:px-8 pb-8">
        <div className="space-y-6">
          {/* Header Section */}
          <motion.div 
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                Inventory Management
              </h1>
              <p className="text-muted-foreground">Track and manage your products and raw materials</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                className="group"
                onClick={refreshInventory}
                disabled={refreshing}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : "group-hover:animate-spin"}`} />
                {refreshing ? "Refreshing..." : "Refresh Data"}
              </Button>
              
              <Button 
                variant="outline" 
                className="group"
                onClick={() => {
                  toast({
                    title: "Report Generated",
                    description: "Inventory report has been sent to your email."
                  });
                }}
              >
                <Download className="mr-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                Generate Report
              </Button>
              
              <Button
                className="relative overflow-hidden group"
                onClick={() => {
                  if (inventoryView === "products") {
                    setIsAddProductOpen(true);
                  } else {
                    setIsAddMaterialOpen(true);
                  }
                }}
              >
                <span className="relative z-10 flex items-center">
                  <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Add {inventoryView === "products" ? "Product" : "Material"}
                </span>
                <span className="absolute inset-0 bg-primary/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></span>
              </Button>
            </div>
          </motion.div>
          
          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.div
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden border-primary/20 dark:border-primary/10 transition-all duration-200 hover:shadow-md hover:border-primary/50">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Package className="h-4 w-4 mr-2 text-primary" />
                    Total Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-3xl font-bold"
                    ref={statsRefs.totalProducts}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.3 }}
                  >
                    {products.length}
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">Items in inventory</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden border-yellow-500/20 dark:border-yellow-400/10 transition-all duration-200 hover:shadow-md hover:border-yellow-500/50">
                <CardHeader className="pb-2 bg-gradient-to-r from-yellow-500/5 to-transparent">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-yellow-500 dark:text-yellow-400" />
                    Low Stock Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-3xl font-bold text-yellow-600 dark:text-yellow-400"
                    ref={statsRefs.lowStock}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.4 }}
                  >
                    {products.filter(p => p.status === "Low Stock").length + 
                    materials.filter(m => m.status === "Low Stock").length}
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">Items need attention</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden border-red-500/20 dark:border-red-400/10 transition-all duration-200 hover:shadow-md hover:border-red-500/50">
                <CardHeader className="pb-2 bg-gradient-to-r from-red-500/5 to-transparent">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 text-red-500 dark:text-red-400" />
                    Out of Stock
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-3xl font-bold text-red-600 dark:text-red-400"
                    ref={statsRefs.outOfStock}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.5 }}
                  >
                    {products.filter(p => p.status === "Out of Stock").length + 
                    materials.filter(m => m.status === "Out of Stock").length}
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">Items to reorder</p>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className="overflow-hidden border-primary/20 dark:border-primary/10 transition-all duration-200 hover:shadow-md hover:border-primary/50">
                <CardHeader className="pb-2 bg-gradient-to-r from-primary/5 to-transparent">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Boxes className="h-4 w-4 mr-2 text-primary" />
                    Raw Materials
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="text-3xl font-bold"
                    ref={statsRefs.rawMaterials}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15, delay: 0.6 }}
                  >
                    {materials.length}
                  </motion.div>
                  <p className="text-xs text-muted-foreground mt-1">Materials in stock</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
          
          {/* Search and Filters Row */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search inventory..." 
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
            <Button 
              variant="ghost" 
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 text-muted-foreground hover:text-foreground"
                    onClick={() => setSearchQuery("")}
            >
                    <span className="sr-only">Clear search</span>
                    <X className="h-3 w-3" />
            </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      {(categoryFilter !== "all" || statusFilter !== "all" || locationFilter !== "all") && (
                        <Badge className="ml-2 bg-primary text-xs" variant="secondary">
                          {(categoryFilter !== "all" ? 1 : 0) + 
                           (statusFilter !== "all" ? 1 : 0) + 
                           (locationFilter !== "all" ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" className="w-[220px] p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="category-filter">Category</Label>
                        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                          <SelectTrigger id="category-filter">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {allCategories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category === "all" ? "All Categories" : category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="status-filter">Status</Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger id="status-filter">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="In Stock">In Stock</SelectItem>
                            <SelectItem value="Low Stock">Low Stock</SelectItem>
                            <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="location-filter">Location</Label>
                        <Select value={locationFilter} onValueChange={setLocationFilter}>
                          <SelectTrigger id="location-filter">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.map(location => (
                              <SelectItem key={location} value={location}>
                                {location === "all" ? "All Locations" : location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="flex justify-between pt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => {
                            setCategoryFilter("all");
                            setStatusFilter("all");
                            setLocationFilter("all");
                          }}
                        >
                          Reset
                        </Button>
                        <Button 
                          size="sm"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-9">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      Sort
                      {sortField && (
                        <Badge className="ml-2 bg-primary text-xs" variant="secondary">
                          1
                        </Badge>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[180px]">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className={cn(sortField === "name" && "bg-muted/50")}
                      onClick={() => {
                        setSortField("name");
                        setSortDirection(sortField === "name" && sortDirection === "asc" ? "desc" : "asc");
                      }}
                    >
                      Name
                      {sortField === "name" && (
                        sortDirection === "asc" ? 
                          <SortAsc className="h-4 w-4 ml-auto" /> : 
                          <SortDesc className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={cn(sortField === "category" && "bg-muted/50")}
                      onClick={() => {
                        setSortField("category");
                        setSortDirection(sortField === "category" && sortDirection === "asc" ? "desc" : "asc");
                      }}
                    >
                      Category
                      {sortField === "category" && (
                        sortDirection === "asc" ? 
                          <SortAsc className="h-4 w-4 ml-auto" /> : 
                          <SortDesc className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={cn(sortField === "stock" && "bg-muted/50")}
                      onClick={() => {
                        setSortField("stock");
                        setSortDirection(sortField === "stock" && sortDirection === "asc" ? "desc" : "asc");
                      }}
                    >
                      Stock Level
                      {sortField === "stock" && (
                        sortDirection === "asc" ? 
                          <SortAsc className="h-4 w-4 ml-auto" /> : 
                          <SortDesc className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className={cn(sortField === "status" && "bg-muted/50")}
                      onClick={() => {
                        setSortField("status");
                        setSortDirection(sortField === "status" && sortDirection === "asc" ? "desc" : "asc");
                      }}
                    >
                      Status
                      {sortField === "status" && (
                        sortDirection === "asc" ? 
                          <SortAsc className="h-4 w-4 ml-auto" /> : 
                          <SortDesc className="h-4 w-4 ml-auto" />
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        setSortField(null);
                        setSortDirection("asc");
                      }}
                    >
                      Reset Sort
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {inventoryView === "products" && (
                  <div className="flex rounded-md border border-input overflow-hidden">
                    <Button 
                      variant={productView === "table" ? "default" : "ghost"} 
                      size="sm" 
                      className={cn(
                        "h-9 rounded-none px-2.5",
                        productView === "table" ? "bg-muted-foreground/10" : "bg-transparent"
                      )}
                      onClick={() => setProductView("table")}
                    >
                      <Package className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={productView === "grid" ? "default" : "ghost"} 
                      size="sm" 
                      className={cn(
                        "h-9 rounded-none px-2.5",
                        productView === "grid" ? "bg-muted-foreground/10" : "bg-transparent"
                      )}
                      onClick={() => setProductView("grid")}
                    >
                      <LayoutGrid className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            {/* Tabs */}
            <motion.div 
              className="border-b"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
            >
              <div className="flex space-x-1 relative">
                <Button
                  variant="ghost"
                  onClick={() => setInventoryView("products")}
                  className={cn(
                    "flex items-center gap-2 py-2 px-4 h-auto rounded-none transition-all",
                    inventoryView === "products" ? 
                      "text-primary font-medium border-b-2 border-primary" : 
                      "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Package className="h-4 w-4" />
                  <span>Products</span>
                  <Badge className="ml-1">{products.length}</Badge>
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => setInventoryView("materials")}
                  className={cn(
                    "flex items-center gap-2 py-2 px-4 h-auto rounded-none transition-all",
                    inventoryView === "materials" ? 
                      "text-primary font-medium border-b-2 border-primary" : 
                      "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Boxes className="h-4 w-4" />
                  <span>Raw Materials</span>
                  <Badge className="ml-1">{materials.length}</Badge>
                </Button>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Content Section */}
          <AnimatePresence mode="wait">
            {inventoryView === "products" ? (
              <motion.div
                key="products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Alerts */}
                {products.filter(p => p.status === "Out of Stock").length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 dark:bg-red-500/5">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Critical Stock Alert</AlertTitle>
                      <AlertDescription>
                        {products.filter(p => p.status === "Out of Stock").length} products are out of stock. 
                        Consider ordering new inventory to prevent sales issues.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                {/* Products View */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="space-y-4 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground">Loading inventory data...</p>
                    </div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium">No products found</h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                      {searchQuery ? 
                        `No products match your search for "${searchQuery}".` :
                        "There are no products that match your current filters."}
                    </p>
                    {(categoryFilter !== "all" || statusFilter !== "all" || locationFilter !== "all") && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setCategoryFilter("all");
                          setStatusFilter("all");
                          setLocationFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    {productView === "table" ? (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader className="bg-muted/50">
                            <TableRow>
                              <TableHead className="w-[300px]">Product</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Stock</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Location</TableHead>
                              <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <AnimatePresence>
                              {filteredProducts.map((product, index) => (
                                <motion.tr
                                  key={product.id}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2, delay: index * 0.05 }}
                                  className="group border-b data-[state=selected]:bg-muted cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsProductDetailsOpen(true);
                                  }}
                                >
                                  <TableCell className="font-medium">
                                    <div className="flex items-center gap-3">
                                      <div className="flex-shrink-0 h-10 w-10 rounded bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center text-primary">
                                        <Package className="h-5 w-5" />
                                      </div>
              <div>
                                        <div className="font-medium">{product.name}</div>
                                        <div className="text-xs text-muted-foreground">SKU: {product.id.slice(0, 8)}</div>
              </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                                      {product.category}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span>{product.stock} units</span>
                                      <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                                        <div 
                                          className={cn(
                                            "h-full",
                                            product.status === "In Stock" ? "bg-green-500" :
                                            product.status === "Low Stock" ? "bg-yellow-500" : "bg-red-500"
                                          )}
                                          style={{ 
                                            width: `${Math.min(100, (product.stock / product.maxStock) * 100)}%` 
                                          }}
                                        />
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {getStatusBadge(product.status)}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-3 w-3 text-muted-foreground" />
                                      <span>{product.location}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedProduct(product);
                                              setIsUpdateStockOpen(true);
                                            }}
                                          >
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Update Stock</TooltipContent>
                                      </Tooltip>
                                      
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setSelectedProduct(product);
                                              setIsEditProductOpen(true);
                                            }}
                                          >
                                            <Edit className="h-4 w-4" />
                </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Edit Product</TooltipContent>
                                      </Tooltip>
                                    </div>
                                  </TableCell>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        <AnimatePresence>
                          {filteredProducts.map((product, index) => (
                            <motion.div 
                              key={product.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                            >
                              <motion.div
                                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                                whileTap={{ scale: 0.98 }}
                              >
                                <Card 
                                  className="cursor-pointer overflow-hidden border-primary/20 hover:border-primary/50 transition-all hover:shadow-md"
                                  onClick={() => {
                                    setSelectedProduct(product);
                                    setIsProductDetailsOpen(true);
                                  }}
                                >
                                  <CardHeader className="p-4 border-b bg-muted/30">
                                    <div className="flex justify-between items-start">
                                      <div className="space-y-1">
                                        <CardTitle className="text-base">{product.name}</CardTitle>
                                        <CardDescription>SKU: {product.id.slice(0, 8)}</CardDescription>
                                      </div>
                                      <Badge variant="outline" className="bg-primary/5 hover:bg-primary/10">
                                        {product.category}
                                      </Badge>
                                    </div>
                                  </CardHeader>
                                  <CardContent className="p-4 pt-4">
                                    <div className="flex justify-between items-center mb-4">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-3 w-3 text-muted-foreground" />
                                        <span className="text-sm">{product.location}</span>
                                      </div>
                                      {getStatusBadge(product.status)}
                                    </div>
                                    
                                    <div className="space-y-3">
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Stock Level:</span>
                                        <span className="font-medium">{product.stock} units</span>
                                      </div>
                                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                                        <div 
                                          className={cn(
                                            "h-full",
                                            product.status === "In Stock" ? "bg-green-500" :
                                            product.status === "Low Stock" ? "bg-yellow-500" : "bg-red-500"
                                          )}
                                          style={{ 
                                            width: `${Math.min(100, (product.stock / product.maxStock) * 100)}%` 
                                          }}
                                        />
                                      </div>
                                      
                                      <div className="flex justify-between items-center text-sm">
                                        <span className="text-muted-foreground">Price:</span>
                                        <span className="font-medium">${product.price.toFixed(2)}</span>
                                      </div>
                                    </div>
                                  </CardContent>
                                  <CardFooter className="p-4 pt-0 flex items-center justify-end space-x-2">
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="h-8 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProduct(product);
                                        setIsUpdateStockOpen(true);
                                      }}
                                    >
                                      <Plus className="h-3 w-3 mr-1" />
                                      Update Stock
                </Button>
                                    <Button 
                                      variant="secondary" 
                                      size="sm" 
                                      className="h-8 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProduct(product);
                                        setIsEditProductOpen(true);
                                      }}
                                    >
                                      <Edit className="h-3 w-3 mr-1" />
                                      Edit
                                    </Button>
                                  </CardFooter>
                                </Card>
                              </motion.div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
              </div>
                    )}
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="materials"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Alerts */}
                {materials.filter(m => m.status === "Out of Stock").length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                  >
                    <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 dark:bg-red-500/5">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Critical Raw Materials Alert</AlertTitle>
                      <AlertDescription>
                        {materials.filter(m => m.status === "Out of Stock").length} raw materials are out of stock. 
                        This may affect production schedules. Please contact suppliers immediately.
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
                
                {/* Materials View */}
                {isLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="space-y-4 text-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                      <p className="text-muted-foreground">Loading materials data...</p>
            </div>
          </div>
                ) : filteredMaterials.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <Boxes className="h-12 w-12 text-muted-foreground/50" />
                    <h3 className="text-lg font-medium">No materials found</h3>
                    <p className="text-muted-foreground text-center max-w-sm">
                      {searchQuery ? 
                        `No materials match your search for "${searchQuery}".` :
                        "There are no materials that match your current filters."}
                    </p>
                    {(categoryFilter !== "all" || statusFilter !== "all" || locationFilter !== "all") && (
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setCategoryFilter("all");
                          setStatusFilter("all");
                          setLocationFilter("all");
                        }}
                      >
                        Clear Filters
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted/50">
                        <TableRow>
                          <TableHead className="w-[300px]">Material</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <AnimatePresence>
                          {filteredMaterials.map((material, index) => (
                            <motion.tr
                              key={material.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2, delay: index * 0.05 }}
                              className="group border-b data-[state=selected]:bg-muted cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() => {
                                setSelectedMaterial(material);
                                setIsMaterialDetailsOpen(true);
                              }}
                            >
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-3">
                                  <div className="flex-shrink-0 h-10 w-10 rounded bg-gradient-to-br from-blue-500/10 to-blue-500/5 flex items-center justify-center text-blue-500">
                                    <Boxes className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <div className="font-medium">{material.name}</div>
                                    <div className="text-xs text-muted-foreground">ID: {material.id.slice(0, 8)}</div>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-blue-500/5 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10">
                                  {material.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span>{material.stock} {material.unit}</span>
                                  <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                                    <div 
                                      className={cn(
                                        "h-full",
                                        material.status === "In Stock" ? "bg-green-500" :
                                        material.status === "Low Stock" ? "bg-yellow-500" : "bg-red-500"
                                      )}
                                      style={{ 
                                        width: `${Math.min(100, (material.stock / material.maxStock) * 100)}%` 
                                      }}
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(material.status)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3 text-muted-foreground" />
                                  <span>{material.location}</span>
                                </div>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end space-x-2">
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedMaterial(material);
                                          setIsOrderMaterialOpen(true);
                                        }}
                                      >
                                        <ShoppingCart className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Order Material</TooltipContent>
                                  </Tooltip>
                                  
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedMaterial(material);
                                          setIsEditMaterialOpen(true);
                                        }}
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Edit Material</TooltipContent>
                                  </Tooltip>
              </div>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </AnimatePresence>
                      </TableBody>
                    </Table>
            </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Product Details Dialog */}
          <Dialog open={isProductDetailsOpen} onOpenChange={setIsProductDetailsOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Product Details</span>
                </DialogTitle>
                <DialogDescription>
                  View detailed information about this product.
                </DialogDescription>
              </DialogHeader>
              
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid gap-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                        <Package className="h-8 w-8 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-primary/5">
                            {selectedProduct.category}
                          </Badge>
                          {getStatusBadge(selectedProduct.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          SKU: {selectedProduct.id.slice(0, 8)} | 
                          <span className="ml-2">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {selectedProduct.location}
                          </span>
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm font-medium">Stock Information</CardTitle>
              </CardHeader>
                        <CardContent className="py-3">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Current Stock:</span>
                              <span className="font-medium">{selectedProduct.stock} units</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Maximum Stock:</span>
                              <span className="font-medium">{selectedProduct.maxStock} units</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Reorder Point:</span>
                              <span className="font-medium">{Math.floor(selectedProduct.maxStock * 0.2)} units</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Status:</span>
                              <span>{getStatusBadge(selectedProduct.status)}</span>
                            </div>
                            
                            <div className="pt-2">
                              <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-muted-foreground">Stock Level:</span>
                                <span className="font-medium">
                                  {Math.round((selectedProduct.stock / selectedProduct.maxStock) * 100)}%
                                </span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full",
                                    selectedProduct.status === "In Stock" ? "bg-green-500" :
                                    selectedProduct.status === "Low Stock" ? "bg-yellow-500" : "bg-red-500"
                                  )}
                                  style={{ 
                                    width: `${Math.min(100, (selectedProduct.stock / selectedProduct.maxStock) * 100)}%` 
                                  }}
                                />
                              </div>
                            </div>
                          </div>
              </CardContent>
            </Card>
            
            <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm font-medium">Product Information</CardTitle>
              </CardHeader>
                        <CardContent className="py-3">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Price:</span>
                              <span className="font-medium">${selectedProduct.price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Weight:</span>
                              <span className="font-medium">1.2 kg</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Dimensions:</span>
                              <span className="font-medium">30 × 20 × 10 cm</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Added On:</span>
                              <span className="font-medium">
                                {new Date().toLocaleDateString()}
                              </span>
                            </div>
                          </div>
              </CardContent>
            </Card>
          </div>
          
                    <Card>
                      <CardHeader className="py-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">Stock History</CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <History className="h-3.5 w-3.5" />
                          <span className="text-xs">View All</span>
                        </Button>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="relative">
                          <ScrollArea className="h-[150px]">
                            <div className="space-y-3">
                              {selectedProduct.stockHistory && selectedProduct.stockHistory.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                  <div className={cn(
                                    "flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
                                    item.type === "addition" ? "bg-green-500/10" : "bg-red-500/10"
                                  )}>
                                    {item.type === "addition" ? (
                                      <Plus className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <Minus className="h-4 w-4 text-red-500" />
                                    )}
                </div>
                                  <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                                        <p className="text-sm font-medium">
                                          {item.type === "addition" ? "Stock Added" : "Stock Removed"}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {item.note}
                                        </p>
                    </div>
                                      <div className="text-right">
                                        <p className={cn(
                                          "text-sm font-medium",
                                          item.type === "addition" ? "text-green-500" : "text-red-500"
                                        )}>
                                          {item.type === "addition" ? "+" : "-"}{item.quantity} units
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          {new Date(item.date).toLocaleDateString()}
                                        </p>
                  </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <DialogFooter className="gap-2 sm:space-x-0">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsProductDetailsOpen(false);
                        setIsUpdateStockOpen(true);
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Update Stock
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsProductDetailsOpen(false);
                        setIsEditProductOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Product
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsProductDetailsOpen(false);
                        setIsDeleteProductOpen(true);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </DialogFooter>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Update Stock Dialog */}
          <Dialog open={isUpdateStockOpen} onOpenChange={setIsUpdateStockOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5 text-primary" />
                  <span>Update Stock</span>
                </DialogTitle>
                <DialogDescription>
                  Add or remove stock for {selectedProduct?.name}.
                </DialogDescription>
              </DialogHeader>
              
              {selectedProduct && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const action = formData.get('action') as string;
                  const quantity = parseInt(formData.get('quantity') as string, 10);
                  const note = formData.get('note') as string;
                  
                  updateProductStock(selectedProduct.id, action, quantity, note);
                  setIsUpdateStockOpen(false);
                }}>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{selectedProduct.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current stock: {selectedProduct.stock} units
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="action">Action</Label>
                      <RadioGroup defaultValue="addition" name="action" className="flex">
                        <div className="flex items-center space-x-2 mr-4">
                          <RadioGroupItem value="addition" id="action-add" />
                          <Label htmlFor="action-add" className="flex items-center gap-1">
                            <Plus className="h-3 w-3 text-green-500" />
                            Add Stock
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="removal" id="action-remove" />
                          <Label htmlFor="action-remove" className="flex items-center gap-1">
                            <Minus className="h-3 w-3 text-red-500" />
                            Remove Stock
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input 
                        id="quantity" 
                        name="quantity" 
                        type="number" 
                        min="1" 
                        defaultValue="1" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="note">Note (optional)</Label>
                      <Textarea 
                        id="note" 
                        name="note" 
                        placeholder="Enter reason for stock update..." 
                        rows={3} 
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full sm:w-auto">
                      Update Stock
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Add Product Dialog */}
          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-primary" />
                  <span>Add New Product</span>
                </DialogTitle>
                <DialogDescription>
                  Add a new product to your inventory.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const newProduct: Product = {
                  id: `prod-${Date.now().toString(36)}`,
                  name: formData.get('name') as string,
                  category: formData.get('category') as string,
                  stock: parseInt(formData.get('stock') as string, 10),
                  maxStock: parseInt(formData.get('maxStock') as string, 10),
                  status: "In Stock",
                  location: formData.get('location') as string,
                  price: parseFloat(formData.get('price') as string),
                  reorderPoint: Math.floor(parseInt(formData.get('maxStock') as string, 10) * 0.2),
                  lastProduced: new Date().toISOString(),
                  stockHistory: [
                    {
                      date: new Date().toISOString(),
                      type: "addition",
                      quantity: parseInt(formData.get('stock') as string, 10),
                      note: "Initial stock"
                    }
                  ]
                };
                
                if (newProduct.stock < newProduct.maxStock * 0.2) {
                  newProduct.status = "Low Stock";
                }
                
                if (newProduct.stock === 0) {
                  newProduct.status = "Out of Stock";
                }
                
                setProducts(prev => [...prev, newProduct]);
                
                toast({
                  title: "Product Added",
                  description: `${newProduct.name} has been added to inventory.`
                });
                
                setIsAddProductOpen(false);
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Enter product name" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue={productCategories[0]}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {productCategories.filter(c => c !== "all").map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Initial Stock</Label>
                      <Input 
                        id="stock" 
                        name="stock" 
                        type="number" 
                        min="0" 
                        defaultValue="0" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxStock">Maximum Stock</Label>
                      <Input 
                        id="maxStock" 
                        name="maxStock" 
                        type="number" 
                        min="1" 
                        defaultValue="100" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Storage Location</Label>
                      <Select name="location" defaultValue={locations.filter(l => l !== "all")[0]}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.filter(l => l !== "all").map(location => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        defaultValue="0.00" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Enter product description..." 
                      rows={3} 
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Edit Product Dialog */}
          <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-primary" />
                  <span>Edit Product</span>
                </DialogTitle>
                <DialogDescription>
                  Update product information.
                </DialogDescription>
              </DialogHeader>
              
              {selectedProduct && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  
                  const updatedProduct: Product = {
                    ...selectedProduct,
                    name: formData.get('name') as string,
                    category: formData.get('category') as string,
                    maxStock: parseInt(formData.get('maxStock') as string, 10),
                    location: formData.get('location') as string,
                    price: parseFloat(formData.get('price') as string),
                  };
                  
                  // Update status based on current stock level and new maxStock
                  if (updatedProduct.stock === 0) {
                    updatedProduct.status = "Out of Stock";
                  } else if (updatedProduct.stock < updatedProduct.maxStock * 0.2) {
                    updatedProduct.status = "Low Stock";
                  } else {
                    updatedProduct.status = "In Stock";
                  }
                  
                  setProducts(prev => 
                    prev.map(product => 
                      product.id === selectedProduct.id ? updatedProduct : product
                    )
                  );
                  
                  toast({
                    title: "Product Updated",
                    description: `${updatedProduct.name} has been updated.`
                  });
                  
                  setIsEditProductOpen(false);
                }}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Product Name</Label>
                        <Input 
                          id="edit-name" 
                          name="name" 
                          defaultValue={selectedProduct.name}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select name="category" defaultValue={selectedProduct.category}>
                          <SelectTrigger id="edit-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {productCategories.filter(c => c !== "all").map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-stock">Current Stock</Label>
                        <Input 
                          id="edit-stock" 
                          name="stock" 
                          type="number" 
                          value={selectedProduct.stock}
                          disabled
                          className="bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use the "Update Stock" function to change stock levels.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-maxStock">Maximum Stock</Label>
                        <Input 
                          id="edit-maxStock" 
                          name="maxStock" 
                          type="number" 
                          min="1" 
                          defaultValue={selectedProduct.maxStock}
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-location">Storage Location</Label>
                        <Select name="location" defaultValue={selectedProduct.location}>
                          <SelectTrigger id="edit-location">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.filter(l => l !== "all").map(location => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">Price ($)</Label>
                        <Input 
                          id="edit-price" 
                          name="price" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          defaultValue={selectedProduct.price}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full sm:w-auto">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Material Details Dialog */}
          <Dialog open={isMaterialDetailsOpen} onOpenChange={setIsMaterialDetailsOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Boxes className="h-5 w-5 text-blue-500" />
                  <span>Material Details</span>
                </DialogTitle>
                <DialogDescription>
                  View detailed information about this raw material.
                </DialogDescription>
              </DialogHeader>
              
              {selectedMaterial && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid gap-6 py-4">
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 rounded-md bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center">
                        <Boxes className="h-8 w-8 text-blue-500" />
                      </div>
                  <div className="space-y-1">
                        <h3 className="text-xl font-semibold">{selectedMaterial.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-blue-500/5 text-blue-600 dark:text-blue-400">
                            {selectedMaterial.category}
                          </Badge>
                          {getStatusBadge(selectedMaterial.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          ID: {selectedMaterial.id.slice(0, 8)} | 
                          <span className="ml-2">
                            <MapPin className="h-3 w-3 inline mr-1" />
                            {selectedMaterial.location}
                      </span>
                        </p>
                    </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm font-medium">Stock Information</CardTitle>
                        </CardHeader>
                        <CardContent className="py-3">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Current Stock:</span>
                              <span className="font-medium">{selectedMaterial.stock} {selectedMaterial.unit}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Maximum Stock:</span>
                              <span className="font-medium">{selectedMaterial.maxStock} {selectedMaterial.unit}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Reorder Point:</span>
                              <span className="font-medium">{Math.floor(selectedMaterial.maxStock * 0.2)} {selectedMaterial.unit}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Status:</span>
                              <span>{getStatusBadge(selectedMaterial.status)}</span>
                            </div>
                            
                            <div className="pt-2">
                              <div className="flex justify-between items-center text-sm mb-1">
                                <span className="text-muted-foreground">Stock Level:</span>
                                <span className="font-medium">
                                  {Math.round((selectedMaterial.stock / selectedMaterial.maxStock) * 100)}%
                        </span>
                              </div>
                              <div className="h-2 rounded-full bg-muted overflow-hidden">
                                <div 
                                  className={cn(
                                    "h-full",
                                    selectedMaterial.status === "In Stock" ? "bg-green-500" :
                                    selectedMaterial.status === "Low Stock" ? "bg-yellow-500" : "bg-red-500"
                                  )}
                                  style={{ 
                                    width: `${Math.min(100, (selectedMaterial.stock / selectedMaterial.maxStock) * 100)}%` 
                                  }}
                                />
                    </div>
                  </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader className="py-3">
                          <CardTitle className="text-sm font-medium">Supplier Information</CardTitle>
                        </CardHeader>
                        <CardContent className="py-3">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Primary Supplier:</span>
                              <span className="font-medium">ABC Supplies Inc</span>
                    </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Lead Time:</span>
                              <span className="font-medium">3-5 days</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Min. Order:</span>
                              <span className="font-medium">20 {selectedMaterial.unit}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-muted-foreground">Price Per Unit:</span>
                              <span className="font-medium">${(selectedMaterial.price || 2.5).toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
                    </div>
                    
                    <Card>
                      <CardHeader className="py-3 flex flex-row items-center justify-between">
                        <CardTitle className="text-sm font-medium">Usage in Products</CardTitle>
                        <Button variant="ghost" size="sm" className="h-8 gap-1">
                          <ListFilter className="h-3.5 w-3.5" />
                          <span className="text-xs">View All</span>
                        </Button>
                      </CardHeader>
                      <CardContent className="py-0">
                        <div className="relative">
                          <ScrollArea className="h-[150px]">
                            <div className="space-y-3">
                              {Array.from({ length: 3 }).map((_, index) => (
                                <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
                                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Package className="h-4 w-4 text-primary" />
                </div>
                                  <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <p className="text-sm font-medium">
                                          Product {index + 1}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Uses {5 * (index + 1)} {selectedMaterial.unit} per unit
                                        </p>
                                      </div>
                                      <div className="text-right">
                                        <Badge variant="outline" className="bg-primary/5">
                                          {productCategories.filter(c => c !== "all")[index]}
                                        </Badge>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
              </CardContent>
            </Card>
          </div>
                  
                  <DialogFooter className="gap-2 sm:space-x-0">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsMaterialDetailsOpen(false);
                        setIsOrderMaterialOpen(true);
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Order Material
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsMaterialDetailsOpen(false);
                        setIsEditMaterialOpen(true);
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Material
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsMaterialDetailsOpen(false);
                        setIsDeleteMaterialOpen(true);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </DialogFooter>
                </motion.div>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Order Material Dialog */}
          <Dialog open={isOrderMaterialOpen} onOpenChange={setIsOrderMaterialOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <span>Order Material</span>
                </DialogTitle>
                <DialogDescription>
                  Place an order for {selectedMaterial?.name}.
                </DialogDescription>
              </DialogHeader>
              
              {selectedMaterial && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const quantity = parseInt(formData.get('quantity') as string, 10);
                  const supplier = formData.get('supplier') as string;
                  
                  orderMaterial(selectedMaterial.id, quantity, supplier);
                  setIsOrderMaterialOpen(false);
                }}>
                  <div className="grid gap-4 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-md bg-gradient-to-br from-blue-500/20 to-blue-500/5 flex items-center justify-center flex-shrink-0">
                        <Boxes className="h-6 w-6 text-blue-500" />
        </div>
                      <div>
                        <h4 className="font-medium">{selectedMaterial.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          Current stock: {selectedMaterial.stock} {selectedMaterial.unit}
                        </p>
      </div>
    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Order Quantity ({selectedMaterial.unit})</Label>
                      <Input 
                        id="quantity" 
                        name="quantity" 
                        type="number" 
                        min="1" 
                        defaultValue={Math.max(20, selectedMaterial.maxStock - selectedMaterial.stock)} 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="supplier">Supplier</Label>
                      <Select name="supplier" defaultValue="ABC Supplies Inc">
                        <SelectTrigger id="supplier">
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ABC Supplies Inc">ABC Supplies Inc</SelectItem>
                          <SelectItem value="Global Materials Co.">Global Materials Co.</SelectItem>
                          <SelectItem value="Raw Partners Ltd.">Raw Partners Ltd.</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="expected-delivery">Expected Delivery</Label>
                      <Select name="expected-delivery" defaultValue="standard">
                        <SelectTrigger id="expected-delivery">
                          <SelectValue placeholder="Select delivery option" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="express">Express (1-2 days)</SelectItem>
                          <SelectItem value="standard">Standard (3-5 days)</SelectItem>
                          <SelectItem value="economy">Economy (7-10 days)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="notes">Order Notes (optional)</Label>
                      <Textarea 
                        id="notes" 
                        name="notes" 
                        placeholder="Add any special instructions for this order..." 
                        rows={3} 
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full sm:w-auto">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Place Order
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Add & Edit Material Dialogs would be similar to Product dialogs */}
          <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-blue-500" />
                  <span>Add New Material</span>
                </DialogTitle>
                <DialogDescription>
                  Add a new raw material to your inventory.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                
                const newMaterial: RawMaterial = {
                  id: `mat-${Date.now().toString(36)}`,
                  name: formData.get('name') as string,
                  category: formData.get('category') as string,
                  stock: parseInt(formData.get('stock') as string, 10),
                  maxStock: parseInt(formData.get('maxStock') as string, 10),
                  status: "In Stock",
                  location: formData.get('location') as string,
                  unit: formData.get('unit') as string,
                  price: parseFloat(formData.get('price') as string),
                  supplier: "ABC Supplies Inc",
                  reorderPoint: Math.floor(parseInt(formData.get('maxStock') as string, 10) * 0.2)
                };
                
                if (newMaterial.stock < newMaterial.maxStock * 0.2) {
                  newMaterial.status = "Low Stock";
                }
                
                if (newMaterial.stock === 0) {
                  newMaterial.status = "Out of Stock";
                }
                
                setMaterials(prev => [...prev, newMaterial]);
                
                toast({
                  title: "Material Added",
                  description: `${newMaterial.name} has been added to inventory.`
                });
                
                setIsAddMaterialOpen(false);
              }}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Material Name</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Enter material name" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select name="category" defaultValue={materialCategories[0]}>
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {materialCategories.filter(c => c !== "all").map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="stock">Initial Stock</Label>
                      <Input 
                        id="stock" 
                        name="stock" 
                        type="number" 
                        min="0" 
                        defaultValue="0" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="maxStock">Maximum Stock</Label>
                      <Input 
                        id="maxStock" 
                        name="maxStock" 
                        type="number" 
                        min="1" 
                        defaultValue="100" 
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unit">Unit</Label>
                      <Select name="unit" defaultValue="kg">
                        <SelectTrigger id="unit">
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="liters">liters</SelectItem>
                          <SelectItem value="meters">meters</SelectItem>
                          <SelectItem value="pieces">pieces</SelectItem>
                          <SelectItem value="boxes">boxes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Storage Location</Label>
                      <Select name="location" defaultValue={locations.filter(l => l !== "all")[0]}>
                        <SelectTrigger id="location">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.filter(l => l !== "all").map(location => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="price">Price Per Unit ($)</Label>
                      <Input 
                        id="price" 
                        name="price" 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        defaultValue="0.00" 
                        required 
                      />
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="submit" className="w-full sm:w-auto">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Material
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Delete Material Dialog */}
          <Dialog open={isDeleteMaterialOpen} onOpenChange={setIsDeleteMaterialOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <span>Delete Material</span>
                </DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this material? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {selectedMaterial && (
                <>
                  <div className="flex items-center gap-4 py-4">
                    <div className="h-12 w-12 rounded-md bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <Boxes className="h-6 w-6 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-medium">{selectedMaterial.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        ID: {selectedMaterial.id.slice(0, 8)} | 
                        Stock: {selectedMaterial.stock} {selectedMaterial.unit}
                      </p>
                    </div>
                  </div>
                  
                  <Alert variant="destructive" className="border-red-500/30 bg-red-500/10 dark:bg-red-500/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Warning</AlertTitle>
                    <AlertDescription>
                      This material may be used in active products. Deleting it could impact production.
                    </AlertDescription>
                  </Alert>
                  
                  <DialogFooter className="gap-2 sm:space-x-0">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteMaterialOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setMaterials(prev => 
                          prev.filter(material => material.id !== selectedMaterial.id)
                        );
                        
                        toast({
                          title: "Material Deleted",
                          description: `${selectedMaterial.name} has been deleted from inventory.`,
                          variant: "destructive"
                        });
                        
                        setIsDeleteMaterialOpen(false);
                      }}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete Material
                    </Button>
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
          
          {/* Edit Material Dialog would be similar to Edit Product Dialog */}
          <Dialog open={isEditMaterialOpen} onOpenChange={setIsEditMaterialOpen}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit className="h-5 w-5 text-blue-500" />
                  <span>Edit Material</span>
                </DialogTitle>
                <DialogDescription>
                  Update material information.
                </DialogDescription>
              </DialogHeader>
              
              {selectedMaterial && (
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  
                  const updatedMaterial: RawMaterial = {
                    ...selectedMaterial,
                    name: formData.get('name') as string,
                    category: formData.get('category') as string,
                    maxStock: parseInt(formData.get('maxStock') as string, 10),
                    location: formData.get('location') as string,
                    unit: formData.get('unit') as string,
                    price: parseFloat(formData.get('price') as string),
                  };
                  
                  // Update status based on current stock level and new maxStock
                  if (updatedMaterial.stock === 0) {
                    updatedMaterial.status = "Out of Stock";
                  } else if (updatedMaterial.stock < updatedMaterial.maxStock * 0.2) {
                    updatedMaterial.status = "Low Stock";
                  } else {
                    updatedMaterial.status = "In Stock";
                  }
                  
                  setMaterials(prev => 
                    prev.map(material => 
                      material.id === selectedMaterial.id ? updatedMaterial : material
                    )
                  );
                  
                  toast({
                    title: "Material Updated",
                    description: `${updatedMaterial.name} has been updated.`
                  });
                  
                  setIsEditMaterialOpen(false);
                }}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-name">Material Name</Label>
                        <Input 
                          id="edit-name" 
                          name="name" 
                          defaultValue={selectedMaterial.name}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-category">Category</Label>
                        <Select name="category" defaultValue={selectedMaterial.category}>
                          <SelectTrigger id="edit-category">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {materialCategories.filter(c => c !== "all").map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-stock">Current Stock</Label>
                        <Input 
                          id="edit-stock" 
                          type="number" 
                          value={selectedMaterial.stock}
                          disabled
                          className="bg-muted/50"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use the "Order Material" function to change stock levels.
                        </p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-maxStock">Maximum Stock</Label>
                        <Input 
                          id="edit-maxStock" 
                          name="maxStock" 
                          type="number" 
                          min="1" 
                          defaultValue={selectedMaterial.maxStock}
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-unit">Unit</Label>
                        <Select name="unit" defaultValue={selectedMaterial.unit}>
                          <SelectTrigger id="edit-unit">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="kg">kg</SelectItem>
                            <SelectItem value="liters">liters</SelectItem>
                            <SelectItem value="meters">meters</SelectItem>
                            <SelectItem value="pieces">pieces</SelectItem>
                            <SelectItem value="boxes">boxes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-location">Storage Location</Label>
                        <Select name="location" defaultValue={selectedMaterial.location}>
                          <SelectTrigger id="edit-location">
                            <SelectValue placeholder="Select location" />
                          </SelectTrigger>
                          <SelectContent>
                            {locations.filter(l => l !== "all").map(location => (
                              <SelectItem key={location} value={location}>
                                {location}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="edit-price">Price Per Unit ($)</Label>
                        <Input 
                          id="edit-price" 
                          name="price" 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          defaultValue={selectedMaterial.price || 2.5}
                          required 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button type="submit" className="w-full sm:w-auto">
                      Save Changes
                    </Button>
                  </DialogFooter>
                </form>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </ManufacturerLayout>
  );
};

export default Inventory;
