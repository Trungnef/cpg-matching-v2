import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Factory, Settings, ArrowLeft, Calendar, BarChart, Clock, AlertCircle, 
  Package, PlusCircle, Pencil, Trash2, Search, Filter, ChevronDown, Save,
  RefreshCw, X, CheckCircle, Loader2, MoreHorizontal, TrendingUp,
  Play, PauseCircle, LayoutGrid, CalendarDays, PowerOff, ShieldAlert,
  Bell, BellRing, Wrench, Activity, LineChart, Layers, Zap, AlertTriangle,
  Upload, Link as LinkIcon, Image, ImageIcon,
  MoreVertical, Plus, CircleDashed, Edit, Eye, Copy, Ban, InfoIcon,
  PackageCheck, Tag, User, FileText, CalendarCheck, LineChartIcon,
  DollarSign, Box, Info, Star
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import ManufacturerLayout from "@/components/layouts/ManufacturerLayout";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";

// Global style to hide scrollbars
const styles = `
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: hsl(var(--muted-foreground) / 0.2);
    border-radius: 6px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background-color: hsl(var(--muted-foreground) / 0.4);
  }
  
  * {
    scrollbar-width: thin;
    scrollbar-color: hsl(var(--muted-foreground) / 0.2) transparent;
  }
  
  .enhanced-input:focus-within {
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.2);
    border-color: hsl(var(--primary));
    transform: translateY(-1px);
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .enhanced-input.error {
    box-shadow: 0 0 0 3px hsl(var(--destructive) / 0.2);
    border-color: hsl(var(--destructive));
  }
  
  .inventory-level-low {
    color: hsl(var(--destructive));
  }
  
  .inventory-level-medium {
    color: hsl(var(--warning));
  }
  
  .inventory-level-high {
    color: hsl(var(--success));
  }
  
  .product-form-container {
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  
  .product-form-container:hover {
    background-color: hsl(var(--background) / 0.5);
  }
  
  /* Enhanced animation styles */
  @keyframes pulse {
    0% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.8; }
    100% { transform: scale(1); opacity: 1; }
  }
  
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    40% { transform: translateY(-12px); }
    60% { transform: translateY(-7px); }
    80% { transform: translateY(-3px); }
  }
  
  @keyframes float {
    0% { transform: translateY(0) rotate(0); }
    25% { transform: translateY(-5px) rotate(1deg); }
    50% { transform: translateY(0) rotate(0); }
    75% { transform: translateY(5px) rotate(-1deg); }
    100% { transform: translateY(0) rotate(0); }
  }

  @keyframes shimmer {
    0% { background-position: -100% 0; }
    100% { background-position: 200% 0; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .image-upload-area {
    position: relative;
    cursor: pointer;
    overflow: hidden;
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    border-radius: 12px;
  }
  
  .image-upload-area:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
  }
  
  .upload-icon-animation {
    animation: float 5s ease infinite;
  }
  
  .form-field-animation {
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
  }
  
  .form-field-animation:focus-within {
    transform: scale(1.01) translateY(-2px);
  }
  
  .submit-button-hover {
    position: relative;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  
  .submit-button-hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 200%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      hsl(var(--primary) / 0.2), 
      hsl(var(--primary) / 0.2), 
      transparent
    );
    transform: translateX(-100%);
  }
  
  .submit-button-hover:hover::after {
    animation: shimmer 1.5s infinite;
  }
  
  .shimmer-effect {
    background: linear-gradient(90deg,
      hsl(var(--background) / 0.1),
      hsl(var(--background) / 0.3),
      hsl(var(--background) / 0.1)
    );
    background-size: 200% 100%;
    animation: shimmer 2s infinite;
  }
  
  .card-hover-effect {
    transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  }
  
  .card-hover-effect:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px -10px rgba(0, 0, 0, 0.1);
    border-color: hsl(var(--primary) / 0.5);
  }
  
  .product-card-animation {
    animation: fadeIn 0.5s forwards;
  }
  
  .badge-pulse {
    animation: pulse 2s infinite;
  }
  
  .stat-number {
    position: relative;
    display: inline-block;
    transition: all 0.3s ease;
  }
  
  .stat-number:hover {
    transform: scale(1.1);
  }
  
  .hover-scale-subtle {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  
  .hover-scale-subtle:hover {
    transform: scale(1.03);
  }
  
  .hover-scale-medium {
    transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  }
  
  .hover-scale-medium:hover {
    transform: scale(1.05);
  }
  
  .tab-transition {
    transition: all 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  }
`;

// Mock production data
const productionLines = [
  { 
    id: 1, 
    name: "Line A", 
    status: "Active", 
    product: "Organic Cereal", 
    efficiency: 92,
    daily_capacity: "10,000 units",
    next_maintenance: "2023-10-15"
  },
  { 
    id: 2, 
    name: "Line B", 
    status: "Maintenance", 
    product: "N/A", 
    efficiency: 0,
    daily_capacity: "8,000 units",
    next_maintenance: "2023-10-02"
  },
  { 
    id: 3, 
    name: "Line C", 
    status: "Active", 
    product: "Protein Bars", 
    efficiency: 87,
    daily_capacity: "15,000 units",
    next_maintenance: "2023-11-05"
  },
  { 
    id: 4, 
    name: "Line D", 
    status: "Active", 
    product: "Granola Packaging", 
    efficiency: 95,
    daily_capacity: "12,000 units",
    next_maintenance: "2023-10-22"
  },
  { 
    id: 5, 
    name: "Line E", 
    status: "Idle", 
    product: "N/A", 
    efficiency: 0,
    daily_capacity: "9,000 units",
    next_maintenance: "2023-10-18"
  }
];

// Mock alerts
const alerts = [
  { id: 1, type: "warning", message: "Line B maintenance scheduled for tomorrow", time: "2 hours ago" },
  { id: 2, type: "critical", message: "Raw material shortage for Line C", time: "1 day ago" },
  { id: 3, type: "info", message: "Quality check passed for Line A", time: "3 days ago" },
];

// Product interface
interface Product {
  id: number;
  name: string;
  category: string;
  sku: string; // Generated automatically, not required for input
  minOrderQuantity: number; // Changed from moq to match Products.tsx
  dailyCapacity: number;
  unitType: string;
  currentAvailable: number;
  pricePerUnit: number;
  productType: string;
  image: string;
  createdAt: string;
  description: string;
  updatedAt: string;
  lastProduced: string;
  leadTime: string;
  leadTimeUnit: string;
  reorderPoint: number;
  rating?: number; // Optional field, filled by matching users, not by manufacturers
  sustainable: boolean; // This is a product characteristic determined by the manufacturer
}

// Mock products data
const initialProducts: Product[] = [
  {
    id: 1,
    name: "Organic Cereal",
    category: "Food",
    sku: "ORG-CER-001",
    minOrderQuantity: 1000,
    dailyCapacity: 10000,
    unitType: "boxes",
    currentAvailable: 5200,
    pricePerUnit: 4.99,
    productType: "Finished Good",
    image: "/placeholder.svg",
    createdAt: "2023-05-15",
    description: "Organic breakfast cereal made with whole grains and natural sweeteners",
    updatedAt: "2023-08-10",
    lastProduced: "2023-08-10",
    leadTime: "1-2",
    leadTimeUnit: "weeks",
    reorderPoint: 0,
    sustainable: true
    // rating será preenchido pelos usuários que procuram matching
  },
  {
    id: 2,
    name: "Protein Bars",
    category: "Food",
    sku: "PRO-BAR-002",
    minOrderQuantity: 2000,
    dailyCapacity: 8000,
    unitType: "units",
    currentAvailable: 3600,
    pricePerUnit: 2.49,
    productType: "Finished Good",
    image: "/placeholder.svg",
    createdAt: "2023-06-22",
    description: "High-protein snack bars for active lifestyles",
    updatedAt: "2023-07-30",
    lastProduced: "2023-07-30",
    leadTime: "1-2",
    leadTimeUnit: "weeks",
    reorderPoint: 0,
    sustainable: false
  },
  {
    id: 3,
    name: "Granola Packaging",
    category: "Packaging",
    sku: "GRA-PKG-003",
    minOrderQuantity: 5000,
    dailyCapacity: 15000,
    unitType: "units",
    currentAvailable: 8200,
    pricePerUnit: 1.25,
    productType: "Packaging Material",
    image: "/placeholder.svg",
    createdAt: "2023-04-10",
    description: "Eco-friendly packaging for granola products",
    updatedAt: "2023-09-05",
    lastProduced: "2023-09-05",
    leadTime: "1-2",
    leadTimeUnit: "weeks",
    reorderPoint: 0,
    sustainable: true
  },
  {
    id: 4,
    name: "Energy Drink Mix",
    category: "Beverage",
    sku: "ENE-DRK-004",
    minOrderQuantity: 1500,
    dailyCapacity: 5000,
    unitType: "sachets",
    currentAvailable: 1200,
    pricePerUnit: 3.75,
    productType: "Raw Material",
    image: "/placeholder.svg",
    createdAt: "2023-07-05",
    description: "Powdered energy drink mix with electrolytes and vitamins",
    updatedAt: "2023-09-12",
    lastProduced: "2023-09-12",
    leadTime: "1-2",
    leadTimeUnit: "weeks",
    reorderPoint: 0,
    sustainable: false
  },
  {
    id: 5,
    name: "Vitamin Supplements",
    category: "Health",
    sku: "VIT-SUP-005",
    minOrderQuantity: 3000,
    dailyCapacity: 12000,
    unitType: "bottles",
    currentAvailable: 0,
    pricePerUnit: 7.99,
    productType: "Component",
    image: "/placeholder.svg",
    createdAt: "2023-03-18",
    description: "Daily multivitamin supplements for general health",
    updatedAt: "2023-06-25",
    lastProduced: "2023-06-25",
    leadTime: "1-2",
    leadTimeUnit: "weeks",
    reorderPoint: 0,
    sustainable: true
  }
];

// ProductionLine interface
interface ProductionLine {
  id: number;
  name: string;
  status: "Active" | "Maintenance" | "Idle" | "Setup" | "Offline";
  product: string;
  efficiency: number;
  daily_capacity: string;
  next_maintenance: string;
  operational_since: string;
  operator_assigned: string;
  last_maintenance: string;
  maintenance_history: MaintenanceRecord[];
  downtime_incidents: DowntimeIncident[];
  quality_metrics: QualityMetric;
  line_type: string;
  current_batch?: BatchInfo; // Added field for current batch tracking
  total_runtime_hours?: number; // Total runtime in hours
  energy_consumption?: number; // Energy consumption in kWh
  alerts?: LineAlert[]; // Line-specific alerts
}

interface MaintenanceRecord {
  id: number;
  date: string;
  type: "Routine" | "Emergency" | "Upgrade";
  technician: string;
  duration: string;
  notes: string;
}

interface DowntimeIncident {
  id: number;
  date: string;
  duration: string;
  reason: string;
  resolved: boolean;
}

interface QualityMetric {
  defect_rate: number;
  quality_score: number;
  last_inspection: string;
}

// New interfaces for enhanced functionality
interface BatchInfo {
  id: string;
  product_id: number;
  start_time: string;
  expected_end_time: string;
  target_quantity: number;
  produced_quantity: number;
  status: "in_progress" | "completed" | "paused" | "cancelled";
  quality_check_status?: "pending" | "passed" | "failed";
}

interface LineAlert {
  id: string;
  type: "warning" | "critical" | "info";
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// Enhanced mock production data
const initialProductionLines: ProductionLine[] = [
  { 
    id: 1, 
    name: "Line A", 
    status: "Active", 
    product: "Organic Cereal", 
    efficiency: 92,
    daily_capacity: "10,000 units",
    next_maintenance: "2023-10-15",
    operational_since: "2020-03-15",
    operator_assigned: "John Smith",
    last_maintenance: "2023-09-01",
    maintenance_history: [
      { id: 1, date: "2023-09-01", type: "Routine", technician: "Mike Johnson", duration: "4 hours", notes: "All systems checked, bearings replaced." },
      { id: 2, date: "2023-07-15", type: "Upgrade", technician: "Sarah Williams", duration: "8 hours", notes: "Software upgrade and calibration." }
    ],
    downtime_incidents: [
      { id: 1, date: "2023-08-20", duration: "2 hours", reason: "Power outage", resolved: true }
    ],
    quality_metrics: {
      defect_rate: 0.5,
      quality_score: 98,
      last_inspection: "2023-09-05"
    },
    line_type: "Processing & Packaging",
    current_batch: {
      id: "BATCH-A1001",
      product_id: 1,
      start_time: "2023-09-20T08:00:00",
      expected_end_time: "2023-09-20T16:00:00",
      target_quantity: 8000,
      produced_quantity: 5400,
      status: "in_progress"
    },
    total_runtime_hours: 15420,
    energy_consumption: 450,
    alerts: [
      {
        id: "ALT-A001",
        type: "info",
        message: "Batch is 67% complete, running slightly ahead of schedule",
        timestamp: "2023-09-20T12:30:00",
        acknowledged: true
      }
    ]
  },
  { 
    id: 2, 
    name: "Line B", 
    status: "Maintenance", 
    product: "N/A", 
    efficiency: 0,
    daily_capacity: "8,000 units",
    next_maintenance: "2023-10-02",
    operational_since: "2021-01-10",
    operator_assigned: "N/A",
    last_maintenance: "2023-09-02",
    maintenance_history: [
      { id: 1, date: "2023-09-02", type: "Emergency", technician: "Robert Chen", duration: "6 hours", notes: "Motor replacement" },
      { id: 2, date: "2023-06-20", type: "Routine", technician: "Mike Johnson", duration: "4 hours", notes: "Regular maintenance" }
    ],
    downtime_incidents: [
      { id: 1, date: "2023-09-01", duration: "ongoing", reason: "Motor failure", resolved: false }
    ],
    quality_metrics: {
      defect_rate: 1.2,
      quality_score: 94,
      last_inspection: "2023-08-25"
    },
    line_type: "Processing"
  },
  { 
    id: 3, 
    name: "Line C", 
    status: "Active", 
    product: "Protein Bars", 
    efficiency: 87,
    daily_capacity: "15,000 units",
    next_maintenance: "2023-11-05",
    operational_since: "2019-11-22",
    operator_assigned: "Lisa Cooper",
    last_maintenance: "2023-08-15",
    maintenance_history: [
      { id: 1, date: "2023-08-15", type: "Routine", technician: "Sarah Williams", duration: "4 hours", notes: "All systems operational" },
      { id: 2, date: "2023-05-10", type: "Emergency", technician: "Robert Chen", duration: "3 hours", notes: "Conveyor belt repair" }
    ],
    downtime_incidents: [
      { id: 1, date: "2023-07-25", duration: "3 hours", reason: "Calibration issue", resolved: true }
    ],
    quality_metrics: {
      defect_rate: 0.8,
      quality_score: 96,
      last_inspection: "2023-09-01"
    },
    line_type: "Molding & Packaging"
  },
  { 
    id: 4, 
    name: "Line D", 
    status: "Active", 
    product: "Granola Packaging", 
    efficiency: 95,
    daily_capacity: "12,000 units",
    next_maintenance: "2023-10-22",
    operational_since: "2022-04-05",
    operator_assigned: "Michael Torres",
    last_maintenance: "2023-08-30",
    maintenance_history: [
      { id: 1, date: "2023-08-30", type: "Routine", technician: "Mike Johnson", duration: "3 hours", notes: "Full inspection complete" },
      { id: 2, date: "2023-05-15", type: "Upgrade", technician: "Sarah Williams", duration: "6 hours", notes: "Control system upgrade" }
    ],
    downtime_incidents: [],
    quality_metrics: {
      defect_rate: 0.3,
      quality_score: 99,
      last_inspection: "2023-09-04"
    },
    line_type: "Packaging"
  },
  { 
    id: 5, 
    name: "Line E", 
    status: "Idle", 
    product: "N/A", 
    efficiency: 0,
    daily_capacity: "9,000 units",
    next_maintenance: "2023-10-18",
    operational_since: "2021-08-12",
    operator_assigned: "N/A",
    last_maintenance: "2023-09-01",
    maintenance_history: [
      { id: 1, date: "2023-09-01", type: "Routine", technician: "Robert Chen", duration: "4 hours", notes: "Preventive maintenance" }
    ],
    downtime_incidents: [
      { id: 1, date: "2023-09-02", duration: "ongoing", reason: "Production schedule gap", resolved: false }
    ],
    quality_metrics: {
      defect_rate: 0.6,
      quality_score: 97,
      last_inspection: "2023-08-28"
    },
    line_type: "Processing & Packaging"
  }
];

export const Production = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // States for product management
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("production");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProductDetails, setSelectedProductDetails] = useState<Product | null>(null);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  // Production Line States
  const [productionLines, setProductionLines] = useState<ProductionLine[]>(initialProductionLines);
  const [selectedProductionLine, setSelectedProductionLine] = useState<ProductionLine | null>(null);
  const [isLineDetailsOpen, setIsLineDetailsOpen] = useState(false);
  const [isAddLineOpen, setIsAddLineOpen] = useState(false);
  const [isScheduleMaintenanceOpen, setIsScheduleMaintenanceOpen] = useState(false);
  const [isAssignProductOpen, setIsAssignProductOpen] = useState(false);
  const [lineStatusFilter, setLineStatusFilter] = useState("all");
  const [lineTypeFilter, setLineTypeFilter] = useState("all");
  const [isRefreshingLines, setIsRefreshingLines] = useState(false);
  
  // New state variables for enhanced functionality
  const [activeBatches, setActiveBatches] = useState<Record<number, BatchInfo>>({});
  const [efficiencyHistory, setEfficiencyHistory] = useState<Record<number, {timestamp: string, value: number}[]>>({});
  const [lineUtilization, setLineUtilization] = useState<Record<number, number>>({});
  const [isRealTimeMonitoring, setIsRealTimeMonitoring] = useState(false);
  const [monitoringInterval, setMonitoringInterval] = useState<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    document.title = "Production Management - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
      navigate("/dashboard");
    }
    
    // Check URL parameters for tab selection
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam === 'products') {
      setActiveTab('products');
    }
  }, [isAuthenticated, navigate, role]);

  useEffect(() => {
    // Create style element for hiding scrollbars
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
    
    // Cleanup on component unmount
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  if (!isAuthenticated || role !== "manufacturer") {
    return null;
  }

  // Filter products based on search query and filters
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });
  
  // Get unique categories for filter dropdown
  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))];
  
  // Create a new product
  const handleCreateProduct = (newProduct: Omit<Product, "id" | "createdAt" | "updatedAt" | "lastProduced" | "reorderPoint" | "sku">) => {
    // Tự động tạo SKU
    const randomSKU = `SKU-${Math.floor(Math.random() * 90000) + 10000}`;
    
    const productToAdd = {
      ...newProduct,
      id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
      sku: randomSKU,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastProduced: new Date().toISOString(),
      reorderPoint: Math.floor(newProduct.minOrderQuantity * 0.5), // Mặc định là 50% của MOQ
    };
    
    setProducts([...products, productToAdd]);
    toast({
      title: "Product created",
      description: `${productToAdd.name} has been added to your product list.`,
    });
    setIsEditDialogOpen(false);
  }
  
  // Update an existing product
  const handleUpdateProduct = (updatedProduct: Product) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
      setIsLoading(false);
      setIsEditDialogOpen(false);
      
      toast({
        title: "Product updated",
        description: `${updatedProduct.name} has been updated successfully.`,
        variant: "default",
      });
    }, 600);
  };
  
  // Delete a product
  const handleDeleteProduct = (id: number) => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const productName = products.find(p => p.id === id)?.name;
      setProducts(products.filter(p => p.id !== id));
      setIsLoading(false);
      setIsDeleteDialogOpen(false);
      
      toast({
        title: "Product deleted",
        description: `${productName} has been removed.`,
        variant: "default",
      });
    }, 600);
  };
  
  // Open edit dialog for creating or updating a product
  const openEditDialog = (product?: Product) => {
    setSelectedProduct(product || null);
    setIsEditDialogOpen(true);
  };
  
  // Open delete confirmation dialog
  const openDeleteDialog = (product: Product) => {
    setSelectedProduct(product);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Maintenance":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Maintenance</Badge>;
      case "Idle":
        return <Badge variant="secondary">Idle</Badge>;
      case "Development":
        return <Badge className="bg-blue-500">Development</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Function to generate badge based on product type
  const getProductTypeBadge = (productType: string) => {
    switch(productType) {
      case "Finished Good":
        return <Badge className="bg-green-500">Finished Good</Badge>;
      case "Raw Material":
        return <Badge variant="outline" className="text-amber-500 border-amber-500">Raw Material</Badge>;
      case "Component":
        return <Badge variant="secondary">Component</Badge>;
      case "Packaging Material":
        return <Badge className="bg-blue-500">Packaging Material</Badge>;
      case "Semi-finished Good":
        return <Badge variant="outline" className="text-indigo-500 border-indigo-500">Semi-finished</Badge>;
      case "Bulk Product":
        return <Badge variant="outline" className="text-purple-500 border-purple-500">Bulk Product</Badge>;
      default:
        return <Badge variant="outline">{productType}</Badge>;
    }
  };

  const getAlertIcon = (type: string) => {
    switch(type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "critical":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "info":
        return <AlertCircle className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  // Function to open product details dialog
  const viewProductDetails = (product: Product) => {
    setSelectedProductDetails(product);
    setIsViewDetailsOpen(true);
  };

  // Production Line Functions
  const handleViewLineDetails = (line: ProductionLine) => {
    setSelectedProductionLine(line);
    setIsLineDetailsOpen(true);
  };
  
  const handleAddProductionLine = () => {
    setIsAddLineOpen(true);
  };
  
  const handleScheduleMaintenance = (line: ProductionLine) => {
    setSelectedProductionLine(line);
    setIsScheduleMaintenanceOpen(true);
  };
  
  const handleAssignProduct = (line: ProductionLine) => {
    setSelectedProductionLine(line);
    setIsAssignProductOpen(true);
  };
  
  const handleToggleLineStatus = (line: ProductionLine) => {
    // Toggle between active and idle
    const newStatus = line.status === "Active" ? "Idle" : "Active";
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedLines = productionLines.map(l => {
        if (l.id === line.id) {
          return { 
            ...l, 
            status: newStatus as "Active" | "Idle",
            efficiency: newStatus === "Active" ? (l.efficiency || 80) : 0,
            operator_assigned: newStatus === "Active" ? (l.operator_assigned || "Assigned Operator") : "N/A"
          };
        }
        return l;
      });
      
      setProductionLines(updatedLines);
      setIsLoading(false);
      
      toast({
        title: `Line ${line.name} ${newStatus === "Active" ? "Started" : "Stopped"}`,
        description: `Production line has been ${newStatus === "Active" ? "activated" : "deactivated"} successfully.`,
        variant: "default",
      });
    }, 600);
  };
  
  const refreshProductionLines = () => {
    setIsRefreshingLines(true);
    
    // Simulate API call to refresh data
    setTimeout(() => {
      // Here you would typically fetch fresh data from an API
      // For now, we'll just update the efficiency values randomly to simulate changes
      const updatedLines = productionLines.map(line => {
        if (line.status === "Active") {
          const randomChange = Math.random() * 6 - 3; // Random value between -3 and +3
          let newEfficiency = line.efficiency + randomChange;
          // Keep efficiency between 70 and 99
          newEfficiency = Math.min(99, Math.max(70, newEfficiency));
          return { ...line, efficiency: Math.round(newEfficiency * 10) / 10 };
        }
        return line;
      });
      
      setProductionLines(updatedLines);
      setIsRefreshingLines(false);
      
      toast({
        title: "Data refreshed",
        description: "Production line information has been updated.",
        variant: "default",
      });
    }, 800);
  };

  // Filter production lines based on status and type
  const filteredProductionLines = productionLines.filter(line => {
    const matchesStatus = lineStatusFilter === "all" || line.status === lineStatusFilter;
    const matchesType = lineTypeFilter === "all" || line.line_type.includes(lineTypeFilter);
    return matchesStatus && matchesType;
  });
  
  // Get unique line types for filter dropdown
  const lineTypes = ["all", ...Array.from(new Set(productionLines.map(line => 
    line.line_type.includes(" & ") ? [line.line_type, ...line.line_type.split(" & ")] : line.line_type
  ).flat()))];
  
  // New functions for batch management
  const handleStartNewBatch = (line: ProductionLine, productId: number, targetQuantity: number) => {
    if (line.status !== "Active") {
      toast({
        title: "Cannot start batch",
        description: "Production line must be active to start a new batch",
        variant: "destructive",
      });
      return;
    }
    
    const now = new Date();
    const endTime = new Date(now);
    // Estimate end time based on target quantity and daily capacity
    const dailyCapacityNum = parseInt(line.daily_capacity.replace(/[^0-9]/g, ''));
    const hoursNeeded = (targetQuantity / dailyCapacityNum) * 24;
    endTime.setHours(endTime.getHours() + hoursNeeded);
    
    const newBatch: BatchInfo = {
      id: `BATCH-${line.id}${Math.floor(Math.random() * 10000)}`,
      product_id: productId,
      start_time: now.toISOString(),
      expected_end_time: endTime.toISOString(),
      target_quantity: targetQuantity,
      produced_quantity: 0,
      status: "in_progress"
    };
    
    setProductionLines(lines => 
      lines.map(l => {
        if (l.id === line.id) {
          return { ...l, current_batch: newBatch };
        }
        return l;
      })
    );
    
    setActiveBatches(prev => ({
      ...prev,
      [line.id]: newBatch
    }));
    
    toast({
      title: "Batch started",
      description: `New batch ${newBatch.id} started on ${line.name}`,
      variant: "default",
    });
  };

  const handleCompleteBatch = (lineId: number) => {
    const line = productionLines.find(l => l.id === lineId);
    if (!line || !line.current_batch) {
      return;
    }
    
    const batch = line.current_batch;
    batch.status = "completed";
    
    setProductionLines(lines => 
      lines.map(l => {
        if (l.id === lineId) {
          return { 
            ...l, 
            current_batch: undefined,
            // Update quality metrics based on this batch
            quality_metrics: {
              ...l.quality_metrics,
              defect_rate: l.quality_metrics.defect_rate * 0.9, // Simulate improvement
              quality_score: Math.min(100, l.quality_metrics.quality_score + 0.5),
              last_inspection: new Date().toISOString().split('T')[0]
            }
          };
        }
        return l;
      })
    );
    
    setActiveBatches(prev => {
      const updated = { ...prev };
      delete updated[lineId];
      return updated;
    });
    
    toast({
      title: "Batch completed",
      description: `Batch ${batch.id} completed successfully on Line ${line.name}`,
      variant: "default",
    });
  };

  // Real-time monitoring functionality
  const startRealTimeMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
    }
    
    const interval = setInterval(() => {
      // Update active lines with simulated real-time data
      setProductionLines(lines => 
        lines.map(line => {
          if (line.status === "Active") {
            // Update efficiency with small variations
            const variation = Math.random() * 4 - 2; // Random between -2 and 2
            const newEfficiency = Math.min(99.9, Math.max(75, line.efficiency + variation));
            
            // Update batch progress if there's an active batch
            let updatedBatch = line.current_batch;
            if (updatedBatch && updatedBatch.status === "in_progress") {
              const targetPerHour = parseInt(line.daily_capacity.replace(/[^0-9]/g, '')) / 24;
              const incrementAmount = Math.round(targetPerHour * (newEfficiency / 100) * (5 / 60)); // 5 minutes worth of production
              updatedBatch = {
                ...updatedBatch,
                produced_quantity: Math.min(updatedBatch.target_quantity, updatedBatch.produced_quantity + incrementAmount)
              };
              
              // If batch is complete, mark it for completion
              if (updatedBatch.produced_quantity >= updatedBatch.target_quantity) {
                setTimeout(() => handleCompleteBatch(line.id), 2000);
              }
            }
            
            // Track efficiency history
            const timestamp = new Date().toISOString();
            setEfficiencyHistory(prev => ({
              ...prev,
              [line.id]: [...(prev[line.id] || []), { timestamp, value: newEfficiency }].slice(-60) // Keep last 60 records
            }));
            
            return { 
              ...line, 
              efficiency: parseFloat(newEfficiency.toFixed(1)),
              current_batch: updatedBatch,
              energy_consumption: (line.energy_consumption || 0) + (Math.random() * 0.5),
            };
          }
          return line;
        })
      );
      
      // Update line utilization metrics
      setLineUtilization(prev => {
        const updated = { ...prev };
        productionLines.forEach(line => {
          if (line.status === "Active") {
            updated[line.id] = Math.min(100, (updated[line.id] || 0) + (Math.random() * 0.1));
          } else if (line.status === "Idle") {
            updated[line.id] = Math.max(0, (updated[line.id] || 0) - (Math.random() * 0.2));
          }
        });
        return updated;
      });
      
    }, 5000); // Update every 5 seconds
    
    setMonitoringInterval(interval);
    setIsRealTimeMonitoring(true);
    
    toast({
      title: "Real-time monitoring started",
      description: "Production lines will be monitored with live updates every 5 seconds",
      variant: "default",
    });
  };
  
  const stopRealTimeMonitoring = () => {
    if (monitoringInterval) {
      clearInterval(monitoringInterval);
      setMonitoringInterval(null);
      setIsRealTimeMonitoring(false);
      
      toast({
        title: "Real-time monitoring stopped",
        description: "Production line monitoring has been paused",
        variant: "default",
      });
    }
  };
  
  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (monitoringInterval) {
        clearInterval(monitoringInterval);
      }
    };
  }, [monitoringInterval]);

  return (
    <ManufacturerLayout>
      <MotionConfig reducedMotion="user">
        <motion.div 
          className="max-w-none px-4 sm:px-6 lg:px-8 pb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            ease: [0.22, 1, 0.36, 1] 
          }}
        >
          <div className="space-y-6">
            {/* Header with title and actions */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                  Production Management
                </h1>
                <p className="text-muted-foreground mt-1">
                  Manage your products, production lines and manufacturing operations
                </p>
              </motion.div>
              
              <motion.div 
                className="flex gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {isRealTimeMonitoring ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={stopRealTimeMonitoring}
                          className="hover-scale-subtle"
                        >
                          <PauseCircle className="h-4 w-4 mr-2" />
                          Stop Monitoring
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Stop real-time monitoring of production lines</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={startRealTimeMonitoring}
                          className="text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 hover-scale-subtle"
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Monitoring
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Begin real-time monitoring of production lines</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setActiveTab(activeTab === "production" ? "products" : "production")}
                        className="hover-scale-subtle"
                      >
                        {activeTab === "production" ? (
                          <>
                            <Package className="h-4 w-4 mr-2" />
                            View Products
                          </>
                        ) : (
                          <>
                            <Factory className="h-4 w-4 mr-2" />
                            View Production Lines
                          </>
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Switch between production lines and products</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </div>
                    
            {/* Main content with tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-2 mb-6 tab-transition">
                <TabsTrigger 
                  value="production" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover-scale-subtle"
                >
                  <Factory className="h-4 w-4 mr-2" />
                  Production Lines
                </TabsTrigger>
                <TabsTrigger 
                  value="products" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover-scale-subtle"
                >
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </TabsTrigger>
              </TabsList>
              
              <AnimatePresence mode="wait">
                {activeTab === "production" ? (
                  <motion.div
                    key="production"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TabsContent value="production" className="mt-0">
                      <ProductionTab 
                        productionLines={productionLines}
                        products={products}
                        lineStatusFilter={lineStatusFilter}
                        setLineStatusFilter={setLineStatusFilter}
                        lineTypeFilter={lineTypeFilter}
                        setLineTypeFilter={setLineTypeFilter}
                        isRefreshingLines={isRefreshingLines}
                        refreshProductionLines={refreshProductionLines}
                        handleViewLineDetails={handleViewLineDetails}
                        handleAddProductionLine={handleAddProductionLine}
                        handleScheduleMaintenance={handleScheduleMaintenance}
                        handleAssignProduct={handleAssignProduct}
                        handleToggleLineStatus={handleToggleLineStatus}
                        activeBatches={activeBatches}
                        efficiencyHistory={efficiencyHistory}
                        lineUtilization={lineUtilization}
                        isRealTimeMonitoring={isRealTimeMonitoring}
                        handleCompleteBatch={handleCompleteBatch}
                        handleStartNewBatch={handleStartNewBatch}
                      />
                    </TabsContent>
                  </motion.div>
                ) : (
                  <motion.div
                    key="products"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <TabsContent value="products" className="mt-0">
                      <ProductsTab 
                        products={filteredProducts}
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        categoryFilter={categoryFilter}
                        setCategoryFilter={setCategoryFilter}
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        categories={categories}
                        openEditDialog={openEditDialog}
                        openDeleteDialog={openDeleteDialog}
                        viewProductDetails={viewProductDetails}
                        getProductTypeBadge={getProductTypeBadge}
                      />
                    </TabsContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>
          </div>
        </motion.div>
      </MotionConfig>

      {/* Product Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[850px] p-0 max-h-[90vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DialogHeader className="px-6 pt-6 pb-2 border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    {selectedProduct ? 
                      <Edit className="h-4 w-4 text-primary" /> : 
                      <Plus className="h-4 w-4 text-primary" />
                    }
                  </div>
                  <div>
                    <DialogTitle className="text-xl">
                      {selectedProduct ? "Edit Product" : "Create New Product"}
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                      {selectedProduct 
                        ? "Update the details of your existing product." 
                        : "Add a new product to your manufacturing catalog."}
                    </DialogDescription>
                  </div>
                </motion.div>
              </DialogHeader>
              
              <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-130px)]">
                <ProductForm 
                  product={selectedProduct} 
                  onSubmit={selectedProduct ? handleUpdateProduct : handleCreateProduct} 
                  isLoading={isLoading} 
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Product Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DialogHeader>
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-2 text-destructive"
                >
                  <div className="h-8 w-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <DialogTitle className="text-xl">Delete Product</DialogTitle>
                </motion.div>
                <DialogDescription className="text-base mt-2">
                  Are you sure you want to delete this product? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center gap-4 py-6 bg-destructive/5 px-4 rounded-lg border border-destructive/20 my-4">
                    <div className="h-16 w-16 rounded-md bg-destructive/10 flex items-center justify-center flex-shrink-0">
                      <Package className="h-8 w-8 text-destructive" />
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">{selectedProduct.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        SKU: {selectedProduct.sku} | Category: {selectedProduct.category}
                      </p>
                    </div>
                  </div>
                  
                  <DialogFooter className="gap-2 mt-6 flex">
                    <Button
                      variant="outline"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      className="flex-1 hover:bg-background hover-scale-subtle"
                    >
                      Cancel
                    </Button>
                    <Button 
                      variant="destructive" 
                      onClick={() => handleDeleteProduct(selectedProduct.id)}
                      disabled={isLoading}
                      className="flex-1 hover-scale-subtle"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Product
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* View Product Details Dialog */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 max-h-[90vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-6 pt-6 pb-2 border-b">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Product Details</DialogTitle>
                    <DialogDescription className="text-sm">
                      Detailed information about this product.
                    </DialogDescription>
                  </div>
                </motion.div>
              </DialogHeader>
              
              <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-130px)]">
                {selectedProductDetails && (
                  <ProductDetailsContent 
                    product={selectedProductDetails} 
                    getProductTypeBadge={getProductTypeBadge}
                    onEdit={() => {
                      setIsViewDetailsOpen(false);
                      setTimeout(() => openEditDialog(selectedProductDetails), 100);
                    }}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Production Line Details Dialog */}
      <Dialog open={isLineDetailsOpen} onOpenChange={setIsLineDetailsOpen}>
        <DialogContent className="sm:max-w-[900px] p-0 max-h-[90vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DialogHeader className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm px-6 pt-6 pb-2 border-b">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Factory className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Production Line Details</DialogTitle>
                    <DialogDescription className="text-sm">
                      View and manage details for this production line.
                    </DialogDescription>
                  </div>
                </motion.div>
              </DialogHeader>
              
              <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-130px)]">
                {selectedProductionLine && (
                  <LineDetailsContent 
                    line={selectedProductionLine}
                    products={products}
                    handleToggleLineStatus={handleToggleLineStatus}
                    handleScheduleMaintenance={() => {
                      setIsLineDetailsOpen(false);
                      setTimeout(() => handleScheduleMaintenance(selectedProductionLine), 100);
                    }}
                    handleAssignProduct={() => {
                      setIsLineDetailsOpen(false);
                      setTimeout(() => handleAssignProduct(selectedProductionLine), 100);
                    }}
                    activeBatches={activeBatches}
                    efficiencyHistory={efficiencyHistory}
                    lineUtilization={lineUtilization}
                    isRealTimeMonitoring={isRealTimeMonitoring}
                    handleStartNewBatch={handleStartNewBatch}
                    handleCompleteBatch={handleCompleteBatch}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Add Production Line Dialog */}
      <Dialog open={isAddLineOpen} onOpenChange={setIsAddLineOpen}>
        <DialogContent className="sm:max-w-[800px] p-0 max-h-[90vh] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DialogHeader className="px-6 pt-6 pb-2 border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <PlusCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Add Production Line</DialogTitle>
                    <DialogDescription className="text-sm">
                      Create a new production line in your manufacturing facility.
                    </DialogDescription>
                  </div>
                </motion.div>
              </DialogHeader>
              
              <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-130px)]">
                <AddProductionLineForm
                  onSubmit={(newLine) => {
                    setIsLoading(true);
                    
                    // Simulate API call
                    setTimeout(() => {
                      const line: ProductionLine = {
                        ...newLine,
                        id: Math.max(...productionLines.map(l => l.id), 0) + 1,
                        maintenance_history: [],
                        downtime_incidents: [],
                        quality_metrics: {
                          defect_rate: 0.5,
                          quality_score: 95,
                          last_inspection: new Date().toISOString().split('T')[0]
                        },
                        alerts: []
                      };
                      
                      setProductionLines([...productionLines, line]);
                      setIsLoading(false);
                      setIsAddLineOpen(false);
                      
                      toast({
                        title: "Production line added",
                        description: `${line.name} has been added successfully.`,
                        variant: "default",
                      });
                    }, 600);
                  }}
                  isLoading={isLoading}
                />
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Schedule Maintenance Dialog */}
      <Dialog open={isScheduleMaintenanceOpen} onOpenChange={setIsScheduleMaintenanceOpen}>
        <DialogContent className="sm:max-w-[650px] p-0">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DialogHeader className="px-6 pt-6 pb-2 border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wrench className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Schedule Maintenance</DialogTitle>
                    <DialogDescription className="text-sm">
                      {selectedProductionLine ? `Schedule maintenance for ${selectedProductionLine.name}` : "Schedule maintenance for production line"}
                    </DialogDescription>
                  </div>
                </motion.div>
              </DialogHeader>
              
              <div className="px-6 py-6">
                {selectedProductionLine && (
                  <ScheduleMaintenanceForm
                    productionLine={selectedProductionLine}
                    onSubmit={(maintenanceData) => {
                      setIsLoading(true);
                      
                      // Simulate API call
                      setTimeout(() => {
                        const updatedLines = productionLines.map(line => {
                          if (line.id === selectedProductionLine.id) {
                            // Create new maintenance record
                            const newRecord: MaintenanceRecord = {
                              id: Math.max(...(line.maintenance_history.map(m => m.id) || [0]), 0) + 1,
                              date: maintenanceData.date,
                              type: maintenanceData.type,
                              technician: maintenanceData.technician,
                              duration: maintenanceData.duration,
                              notes: maintenanceData.notes
                            };
                            
                            // Update line status if maintenance starts now
                            const status = maintenanceData.startNow ? "Maintenance" : line.status;
                            
                            return {
                              ...line,
                              status: status as "Active" | "Maintenance" | "Idle" | "Setup" | "Offline",
                              maintenance_history: [newRecord, ...line.maintenance_history],
                              next_maintenance: maintenanceData.date,
                              // If maintenance starts now, set efficiency to 0
                              efficiency: status === "Maintenance" ? 0 : line.efficiency
                            };
                          }
                          return line;
                        });
                        
                        setProductionLines(updatedLines);
                        setIsLoading(false);
                        setIsScheduleMaintenanceOpen(false);
                        
                        toast({
                          title: "Maintenance scheduled",
                          description: `Maintenance for ${selectedProductionLine.name} has been scheduled for ${maintenanceData.date}.`,
                          variant: "default",
                        });
                      }, 600);
                    }}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

      {/* Assign Product Dialog */}
      <Dialog open={isAssignProductOpen} onOpenChange={setIsAssignProductOpen}>
        <DialogContent className="sm:max-w-[650px] p-0">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <DialogHeader className="px-6 pt-6 pb-2 border-b sticky top-0 z-10 bg-background/95 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Package className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl">Assign Product</DialogTitle>
                    <DialogDescription className="text-sm">
                      {selectedProductionLine ? `Assign a product to ${selectedProductionLine.name}` : "Assign a product to production line"}
                    </DialogDescription>
                  </div>
                </motion.div>
              </DialogHeader>
              
              <div className="px-6 py-6">
                {selectedProductionLine && (
                  <AssignProductForm
                    productionLine={selectedProductionLine}
                    products={products}
                    onSubmit={(productId) => {
                      setIsLoading(true);
                      
                      // Find the selected product
                      const selectedProduct = products.find(p => p.id === productId);
                      
                      // Simulate API call
                      setTimeout(() => {
                        const updatedLines = productionLines.map(line => {
                          if (line.id === selectedProductionLine.id) {
                            return {
                              ...line,
                              product: selectedProduct ? selectedProduct.name : "N/A"
                            };
                          }
                          return line;
                        });
                        
                        setProductionLines(updatedLines);
                        setIsLoading(false);
                        setIsAssignProductOpen(false);
                        
                        toast({
                          title: "Product assigned",
                          description: `${selectedProduct?.name || "Product"} has been assigned to ${selectedProductionLine.name}.`,
                          variant: "default",
                        });
                      }, 600);
                    }}
                    isLoading={isLoading}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </ManufacturerLayout>
  );
};

// Add default export
export default Production;

// ProductsTab Component
interface ProductsTabProps {
  products: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  categoryFilter: string;
  setCategoryFilter: (category: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  categories: string[];
  openEditDialog: (product?: Product) => void;
  openDeleteDialog: (product: Product) => void;
  viewProductDetails: (product: Product) => void;
  getProductTypeBadge: (productType: string) => JSX.Element;
}

const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
  statusFilter,
  setStatusFilter,
  categories,
  openEditDialog,
  openDeleteDialog,
  viewProductDetails,
  getProductTypeBadge
}) => {
  const [animateCards, setAnimateCards] = useState(false);
  
  // Trigger animation when component mounts or products change
  useEffect(() => {
    setAnimateCards(false);
    const timer = setTimeout(() => setAnimateCards(true), 100);
    return () => clearTimeout(timer);
  }, [products.length]);
  
  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <motion.div 
        className="flex flex-col sm:flex-row justify-between space-y-4 sm:space-y-0 sm:space-x-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full form-field-animation hover:border-muted-foreground/50"
          />
              </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px] form-field-animation hover:border-muted-foreground/50">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === "all" ? "All Categories" : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] form-field-animation hover:border-muted-foreground/50">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Low Stock">Low Stock</SelectItem>
              <SelectItem value="Out of Stock">Out of Stock</SelectItem>
              <SelectItem value="Discontinued">Discontinued</SelectItem>
            </SelectContent>
          </Select>
          
          {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setCategoryFilter("all");
                setStatusFilter("all");
              }}
              className="text-xs flex items-center gap-1 hover-scale-subtle"
            >
              <X className="h-3.5 w-3.5" />
              Clear
            </Button>
          )}
        </div>
      </motion.div>

      {/* Create New Product Button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Button 
          onClick={() => openEditDialog()} 
          className="w-full sm:w-auto submit-button-hover hover-scale-medium group"
        >
          <motion.div
            initial={{ rotate: 0 }}
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            className="mr-2"
          >
            <PlusCircle className="h-4 w-4" />
          </motion.div>
          <span>Create New Product</span>
        </Button>
      </motion.div>

      {/* Products Grid */}
      <AnimatePresence mode="wait">
        {products.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-lg text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Package className="h-16 w-16 text-muted-foreground/60 mx-auto" />
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="text-xl font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery || categoryFilter !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search criteria or filters to find what you're looking for."
                  : "Start by creating your first product using the button above."}
              </p>
            </motion.div>
            
            {(searchQuery || categoryFilter !== "all" || statusFilter !== "all") && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setStatusFilter("all");
                  }}
                  className="mt-2 hover-scale-subtle"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={animateCards ? { 
                  opacity: 1, 
                  y: 0,
                  transition: {
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1]
                  }
                } : {}}
                className="group"
              >
                <Card className="overflow-hidden card-hover-effect border border-muted-foreground/20 bg-background/60 backdrop-blur-sm">
                  <CardHeader className="p-0">
                    <div className="aspect-video w-full bg-muted relative group cursor-pointer overflow-hidden"
                         onClick={() => viewProductDetails(product)}>
                      {product.image ? (
                        <motion.img
                          src={product.image}
                          alt={product.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          initial={{ scale: 1.1 }}
                          animate={{ scale: 1 }}
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-muted/90 to-muted/60">
                          <motion.div
                            initial={{ opacity: 0.8, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ 
                              repeat: Infinity, 
                              repeatType: "mirror", 
                              duration: 2 
                            }}
                          >
                            <Package className="h-12 w-12 text-muted-foreground/40" />
                          </motion.div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                        <div className="flex justify-between items-center">
                          <h3 className="text-white font-medium truncate">
                            {product.name}
                          </h3>
                          {getProductTypeBadge(product.productType)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">SKU: {product.sku}</p>
                        <p className="text-sm text-muted-foreground">
                          Category: {product.category}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="text-sm font-medium">MOQ</div>
                        <div className="text-xl font-semibold">{product.minOrderQuantity}</div>
            </div>
          </div>
          
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Inventory</span>
                        <span className={
                          product.currentAvailable < product.minOrderQuantity * 0.5
                            ? "text-red-500 font-medium"
                            : product.currentAvailable < product.minOrderQuantity
                              ? "text-amber-500 font-medium"
                              : "text-green-600 font-medium"
                        }>
                          {product.currentAvailable} {product.unitType}
                        </span>
                      </div>
                      <Progress 
                        value={(product.currentAvailable / (product.minOrderQuantity * 3)) * 100} 
                        className={`h-1.5 rounded-full ${
                          product.currentAvailable < product.minOrderQuantity * 0.5
                            ? "bg-red-500"
                            : product.currentAvailable < product.minOrderQuantity
                              ? "bg-amber-500"
                              : "bg-green-600"
                        }`}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-muted-foreground">Daily Capacity</div>
                      <div className="font-medium">{product.dailyCapacity} {product.unitType}/day</div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-3 pt-0 flex justify-between border-t border-muted/40 mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-primary hover:text-primary-foreground hover:bg-primary hover-scale-subtle transition-all duration-300"
                      onClick={() => viewProductDetails(product)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 hover-scale-subtle"
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditDialog(product);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="h-8 w-8 hover-scale-subtle"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeleteDialog(product);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ProductionTab Component
interface ProductionTabProps {
  productionLines: ProductionLine[];
  products: Product[];
  lineStatusFilter: string;
  setLineStatusFilter: (status: string) => void;
  lineTypeFilter: string;
  setLineTypeFilter: (type: string) => void;
  isRefreshingLines: boolean;
  refreshProductionLines: () => void;
  handleViewLineDetails: (line: ProductionLine) => void;
  handleAddProductionLine: () => void;
  handleScheduleMaintenance: (line: ProductionLine) => void;
  handleAssignProduct: (line: ProductionLine) => void;
  handleToggleLineStatus: (line: ProductionLine) => void;
  activeBatches: Record<number, BatchInfo>;
  efficiencyHistory: Record<number, {timestamp: string, value: number}[]>;
  lineUtilization: Record<number, number>;
  isRealTimeMonitoring: boolean;
  handleCompleteBatch: (lineId: number) => void;
  handleStartNewBatch: (line: ProductionLine, productId: number, targetQuantity: number) => void;
}

const ProductionTab: React.FC<ProductionTabProps> = ({
  productionLines,
  products,
  lineStatusFilter,
  setLineStatusFilter,
  lineTypeFilter,
  setLineTypeFilter,
  isRefreshingLines,
  refreshProductionLines,
  handleViewLineDetails,
  handleAddProductionLine,
  handleScheduleMaintenance,
  handleAssignProduct,
  handleToggleLineStatus,
  activeBatches,
  efficiencyHistory,
  lineUtilization,
  isRealTimeMonitoring,
  handleCompleteBatch,
  handleStartNewBatch
}) => {
  // Filter production lines based on filters
  const filteredLines = productionLines.filter(line => {
    const matchesStatus = lineStatusFilter === "all" || line.status === lineStatusFilter;
    const matchesType = lineTypeFilter === "all" || line.line_type === lineTypeFilter;
    return matchesStatus && matchesType;
  });

  // Get unique line types for filter dropdown
  const lineTypes = ["all", ...Array.from(new Set(productionLines.map(l => l.line_type)))];

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <motion.div 
        className="flex flex-col lg:flex-row justify-between gap-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={lineStatusFilter} onValueChange={setLineStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px] form-field-animation">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Idle">Idle</SelectItem>
              <SelectItem value="Setup">Setup</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={lineTypeFilter} onValueChange={setLineTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px] form-field-animation">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              {lineTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "all" ? "All Types" : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="default"
            onClick={refreshProductionLines}
            disabled={isRefreshingLines}
            className="flex items-center hover-scale-subtle"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshingLines ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={handleAddProductionLine} 
            className="flex items-center hover-scale-medium submit-button-hover"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Production Line
          </Button>
        </div>
      </motion.div>
      
      {/* Statistics Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="card-hover-effect border-primary/10 bg-gradient-to-br from-primary/5 to-background">
              <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Factory className="h-4 w-4 mr-2 text-primary/70" />
              Active Lines
            </CardTitle>
              </CardHeader>
              <CardContent>
            <div className="text-3xl font-bold stat-number">
              {productionLines.filter(l => l.status === "Active").length}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / {productionLines.length}
              </span>
            </div>
                <p className="text-xs text-muted-foreground mt-1">
              {Math.round((productionLines.filter(l => l.status === "Active").length / productionLines.length) * 100)}% lines operational
                </p>
              </CardContent>
            </Card>
            
        <Card className="card-hover-effect border-amber-500/10 bg-gradient-to-br from-amber-500/5 to-background">
              <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Settings className="h-4 w-4 mr-2 text-amber-500/70" />
              Maintenance
            </CardTitle>
              </CardHeader>
              <CardContent>
            <div className="text-3xl font-bold stat-number">
              {productionLines.filter(l => l.status === "Maintenance").length}
            </div>
                <p className="text-xs text-muted-foreground mt-1">
              {productionLines.filter(l => l.status === "Maintenance").length > 0 
                ? "Lines currently under maintenance"
                : "No lines in maintenance"}
                </p>
              </CardContent>
            </Card>
            
        <Card className="card-hover-effect border-blue-500/10 bg-gradient-to-br from-blue-500/5 to-background">
              <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-500/70" />
              Avg. Efficiency
            </CardTitle>
              </CardHeader>
              <CardContent>
            <div className="text-3xl font-bold stat-number">
              {productionLines.filter(l => l.status === "Active").length > 0
                ? Math.round(productionLines
                    .filter(l => l.status === "Active")
                    .reduce((sum, line) => sum + line.efficiency, 0) / 
                    productionLines.filter(l => l.status === "Active").length)
                : 0}%
            </div>
                <p className="text-xs text-muted-foreground mt-1">
              Average efficiency across active lines
                </p>
              </CardContent>
            </Card>
            
        <Card className="card-hover-effect border-green-500/10 bg-gradient-to-br from-green-500/5 to-background">
              <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-green-500/70" />
              Active Batches
            </CardTitle>
              </CardHeader>
              <CardContent>
            <div className="text-3xl font-bold stat-number">
              {Object.values(activeBatches).filter(b => b.status === "in_progress").length}
            </div>
                <p className="text-xs text-muted-foreground mt-1">
              Batches currently in production
                </p>
              </CardContent>
            </Card>
      </motion.div>
      
      {/* Production Lines */}
      <AnimatePresence mode="wait">
        {filteredLines.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center justify-center p-8 bg-muted/40 rounded-lg text-center space-y-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Factory className="h-16 w-16 text-muted-foreground/60 mx-auto" />
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <h3 className="text-xl font-medium mb-2">No production lines found</h3>
              <p className="text-muted-foreground max-w-md">
                {lineStatusFilter !== "all" || lineTypeFilter !== "all"
                  ? "Try adjusting your filters to see more production lines."
                  : "Start by adding your first production line."}
              </p>
            </motion.div>
            
            {(lineStatusFilter !== "all" || lineTypeFilter !== "all") && (
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    setLineStatusFilter("all");
                    setLineTypeFilter("all");
                  }}
                  className="mt-2 hover-scale-subtle"
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                    <TableHead className="w-[200px]">Line Name</TableHead>
                        <TableHead>Status</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead className="text-right">Efficiency</TableHead>
                    <TableHead className="text-right">Daily Capacity</TableHead>
                    <TableHead className="text-right">Next Maintenance</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                  <AnimatePresence>
                    {filteredLines.map((line, index) => (
                      <motion.tr
                        key={line.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ 
                          opacity: 1, 
                          y: 0,
                          transition: {
                            duration: 0.3,
                            delay: index * 0.03
                          }
                        }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="hover:bg-muted/50 cursor-pointer"
                        onClick={() => handleViewLineDetails(line)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full mr-2 ${
                              line.status === "Active" ? "bg-green-500" :
                              line.status === "Maintenance" ? "bg-amber-500" :
                              line.status === "Idle" ? "bg-blue-500" :
                              line.status === "Setup" ? "bg-purple-500" :
                              "bg-gray-500"
                            }`} />
                            {line.name}
                          </div>
                        </TableCell>
                          <TableCell>
                          <Badge variant="outline" className={
                            line.status === "Active" ? "bg-green-500/10 text-green-600" :
                            line.status === "Maintenance" ? "bg-amber-500/10 text-amber-600" :
                            line.status === "Idle" ? "bg-blue-500/10 text-blue-600" :
                            line.status === "Setup" ? "bg-purple-500/10 text-purple-600" :
                            "bg-gray-500/10 text-gray-600"
                          }>
                            {line.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{line.product === "N/A" ? "Not assigned" : line.product}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end">
                            <span className={`mr-2 ${
                              line.efficiency > 90 ? "text-green-600" :
                              line.efficiency > 75 ? "text-amber-600" :
                              "text-red-600"
                            }`}>
                              {line.efficiency}%
                            </span>
                            {isRealTimeMonitoring && line.status === "Active" && (
                              <motion.div
                                animate={{ 
                                  opacity: [0.4, 1, 0.4], 
                                  scale: [0.8, 1, 0.8] 
                                }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: Infinity,
                                  repeatType: "loop" 
                                }}
                                className="w-2 h-2 rounded-full bg-green-500 ml-1"
                              />
                            )}
                                </div>
                        </TableCell>
                        <TableCell className="text-right">{line.daily_capacity}</TableCell>
                        <TableCell className="text-right">{line.next_maintenance}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 hover-scale-subtle"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewLineDetails(line);
                              }}
                            >
                              <Eye className="h-4 w-4 text-blue-600" />
                            </Button>
                            
                            <Button 
                              variant="ghost" 
                              size="icon"
                              className="h-8 w-8 hover-scale-subtle"
                              onClick={(e) => {
                                e.stopPropagation();
                                line.status === "Active" 
                                  ? handleToggleLineStatus(line) 
                                  : handleToggleLineStatus(line);
                              }}
                            >
                              {line.status === "Active" ? (
                                <PauseCircle className="h-4 w-4 text-amber-600" />
                              ) : (
                                <Play className="h-4 w-4 text-green-600" />
                              )}
                            </Button>
                            
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8 hover-scale-subtle">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleScheduleMaintenance(line);
                                  }}
                                  className="flex items-center cursor-pointer"
                                >
                                  <Wrench className="h-4 w-4 mr-2" />
                                  Schedule Maintenance
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAssignProduct(line);
                                  }}
                                  className="flex items-center cursor-pointer"
                                >
                                  <Package className="h-4 w-4 mr-2" />
                                  Assign Product
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          </TableCell>
                      </motion.tr>
                      ))}
                  </AnimatePresence>
                    </TableBody>
                  </Table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// LineDetailsContent Component
interface LineDetailsContentProps {
  line: ProductionLine;
  products: Product[];
  handleToggleLineStatus: (line: ProductionLine) => void;
  handleScheduleMaintenance: () => void;
  handleAssignProduct: () => void;
  activeBatches: Record<number, BatchInfo>;
  efficiencyHistory: Record<number, {timestamp: string, value: number}[]>;
  lineUtilization: Record<number, number>;
  isRealTimeMonitoring: boolean;
  handleStartNewBatch: (line: ProductionLine, productId: number, targetQuantity: number) => void;
  handleCompleteBatch: (lineId: number) => void;
}

const LineDetailsContent: React.FC<LineDetailsContentProps> = ({
  line,
  products,
  handleToggleLineStatus,
  handleScheduleMaintenance,
  handleAssignProduct,
  activeBatches,
  efficiencyHistory,
  lineUtilization,
  isRealTimeMonitoring,
  handleStartNewBatch,
  handleCompleteBatch
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            line.status === "Active" ? "bg-green-500" :
            line.status === "Maintenance" ? "bg-amber-500" :
            line.status === "Idle" ? "bg-blue-500" :
            line.status === "Setup" ? "bg-purple-500" :
            "bg-gray-500"
          }`} />
          <h2 className="text-2xl font-bold">{line.name}</h2>
          <Badge variant="outline" className={`ml-3 ${
            line.status === "Active" ? "bg-green-500/10 text-green-600" :
            line.status === "Maintenance" ? "bg-amber-500/10 text-amber-600" :
            line.status === "Idle" ? "bg-blue-500/10 text-blue-600" :
            line.status === "Setup" ? "bg-purple-500/10 text-purple-600" :
            "bg-gray-500/10 text-gray-600"
          }`}>
            {line.status}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant={line.status === "Active" ? "destructive" : "default"}
            size="sm"
            onClick={() => handleToggleLineStatus(line)}
            className="hover-scale-subtle"
          >
            {line.status === "Active" ? (
              <>
                <PauseCircle className="h-4 w-4 mr-2" />
                Stop Line
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Start Line
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleScheduleMaintenance}
            className="hover-scale-subtle"
          >
            <Wrench className="h-4 w-4 mr-2" />
            Maintenance
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleAssignProduct}
            className="hover-scale-subtle"
          >
            <Package className="h-4 w-4 mr-2" />
            Assign Product
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-hover-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Package className="h-4 w-4 mr-2 text-primary/70" />
              Current Product
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold">
              {line.product === "N/A" ? (
                <span className="text-muted-foreground">None assigned</span>
              ) : (
                line.product
              )}
                  </div>
                </CardContent>
              </Card>
              
        <Card className="card-hover-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <BarChart className="h-4 w-4 mr-2 text-primary/70" />
              Efficiency
            </CardTitle>
                </CardHeader>
                <CardContent>
            <div className="flex items-center">
              <div className="text-3xl font-bold">{line.efficiency}%</div>
              {isRealTimeMonitoring && line.status === "Active" && (
                <motion.div
                  animate={{ 
                    opacity: [0.4, 1, 0.4], 
                    scale: [0.8, 1, 0.8] 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "loop" 
                  }}
                  className="w-2 h-2 rounded-full bg-green-500 ml-3"
                />
              )}
            </div>
            <Progress 
              value={line.efficiency} 
              className={`h-1.5 mt-2 rounded-full ${
                line.efficiency > 90 ? "bg-green-500" :
                line.efficiency > 75 ? "bg-amber-500" :
                "bg-red-500"
              }`}
            />
          </CardContent>
        </Card>
        
        <Card className="card-hover-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-primary/70" />
              Next Maintenance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold">{line.next_maintenance}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Last: {line.last_maintenance}
            </p>
          </CardContent>
        </Card>
        
        <Card className="card-hover-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Factory className="h-4 w-4 mr-2 text-primary/70" />
              Daily Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="font-bold">{line.daily_capacity}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {line.line_type}
            </p>
                </CardContent>
              </Card>
            </div>
            
      <div className="text-sm text-muted-foreground">
        This line has been operational since {line.operational_since}
      </div>
      
      {/* Create a placeholder for the line's current batch details, maintenance history, etc. */}
            <div>
        {line.current_batch && (
          <Card className="card-hover-effect border-primary/10 bg-gradient-to-br from-primary/5 to-background">
                <CardHeader>
              <CardTitle className="text-sm font-medium flex items-center">
                <Activity className="h-4 w-4 mr-2 text-primary/70" />
                Current Batch
              </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Batch ID:</span>
                  <span className="font-medium">{line.current_batch.id}</span>
                        </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="outline" className="bg-green-500/10 text-green-600">
                    {line.current_batch.status === "in_progress" ? "In Progress" : 
                     line.current_batch.status === "completed" ? "Completed" :
                     line.current_batch.status === "paused" ? "Paused" : "Cancelled"}
                  </Badge>
                        </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Target:</span>
                  <span className="font-medium">{line.current_batch.target_quantity} units</span>
                      </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Produced:</span>
                  <span className="font-medium">{line.current_batch.produced_quantity} units</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">
                      {Math.round((line.current_batch.produced_quantity / line.current_batch.target_quantity) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(line.current_batch.produced_quantity / line.current_batch.target_quantity) * 100}
                    className="h-2 rounded-full"
                  />
                  </div>
                  
                {line.current_batch.status === "in_progress" && (
                  <Button 
                    variant="outline"
                    size="sm"
                    className="w-full hover-scale-subtle"
                    onClick={() => handleCompleteBatch(line.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Batch
                  </Button>
                )}
                  </div>
                </CardContent>
              </Card>
        )}
      </div>
    </div>
  );
};

// Product Form Component
interface ProductFormProps {
  product: Product | null;
  onSubmit: (product: Product | Omit<Product, "id" | "createdAt" | "updatedAt" | "lastProduced" | "reorderPoint" | "sku">) => void;
  isLoading: boolean;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    product ? { ...product } : {
      name: "",
      category: "",
      minOrderQuantity: 1000,
      dailyCapacity: 5000,
      unitType: "units",
      currentAvailable: 0,
      pricePerUnit: 0,
      productType: "Finished Good",
      image: "",
      description: "",
      leadTime: "1-2",
      leadTimeUnit: "weeks",
      sustainable: false
    }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFile(file);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    handleFile(file);
  };

  const handleFile = (file: File | undefined) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData({
          ...formData,
          image: e.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked
      });
      return;
    }
    
    // Handle numeric inputs
    if (type === 'number') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
      return;
    }
    
    // Handle text and other inputs
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = "Product name is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.minOrderQuantity || formData.minOrderQuantity <= 0) {
      newErrors.minOrderQuantity = "Minimum order quantity must be greater than zero";
    }
    
    if (!formData.dailyCapacity || formData.dailyCapacity <= 0) {
      newErrors.dailyCapacity = "Daily capacity must be greater than zero";
    }
    
    if (!formData.pricePerUnit || formData.pricePerUnit <= 0) {
      newErrors.pricePerUnit = "Price per unit must be greater than zero";
    }
    
    if (!formData.description) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.unitType) {
      newErrors.unitType = "Unit type is required";
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      if (product) {
        // Update existing product
        onSubmit({
          ...product,
          ...formData
        } as Product);
      } else {
        // Create new product
        onSubmit(formData as Omit<Product, "id" | "createdAt" | "updatedAt" | "lastProduced" | "reorderPoint" | "sku">);
      }
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="space-y-2">
          <Label htmlFor="name" className="text-base">Product Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter product name"
            className={cn("enhanced-input form-field-animation", errors.name && "error")}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="category" className="text-base">Category</Label>
          <Select
            name="category"
            value={formData.category}
            onValueChange={(value) => setFormData({...formData, category: value})}
          >
            <SelectTrigger className={cn("enhanced-input form-field-animation", errors.category && "error")}>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Food">Food</SelectItem>
              <SelectItem value="Beverage">Beverage</SelectItem>
              <SelectItem value="Health">Health</SelectItem>
              <SelectItem value="Packaging">Packaging</SelectItem>
              <SelectItem value="Ingredients">Ingredients</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="space-y-2">
          <Label htmlFor="minOrderQuantity" className="text-base">Minimum Order Quantity</Label>
          <Input
            id="minOrderQuantity"
            name="minOrderQuantity"
            type="number"
            value={formData.minOrderQuantity}
            onChange={handleChange}
            className={cn("enhanced-input form-field-animation", errors.minOrderQuantity && "error")}
          />
          {errors.minOrderQuantity && <p className="text-sm text-destructive">{errors.minOrderQuantity}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dailyCapacity" className="text-base">Daily Capacity</Label>
          <Input
            id="dailyCapacity"
            name="dailyCapacity"
            type="number"
            value={formData.dailyCapacity}
            onChange={handleChange}
            className={cn("enhanced-input form-field-animation", errors.dailyCapacity && "error")}
          />
          {errors.dailyCapacity && <p className="text-sm text-destructive">{errors.dailyCapacity}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="unitType" className="text-base">Unit Type</Label>
          <Select
            name="unitType"
            value={formData.unitType}
            onValueChange={(value) => setFormData({...formData, unitType: value})}
          >
            <SelectTrigger className={cn("enhanced-input form-field-animation", errors.unitType && "error")}>
              <SelectValue placeholder="Select unit type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="units">Units</SelectItem>
              <SelectItem value="boxes">Boxes</SelectItem>
              <SelectItem value="bottles">Bottles</SelectItem>
              <SelectItem value="kg">Kilograms</SelectItem>
              <SelectItem value="liters">Liters</SelectItem>
              <SelectItem value="sachets">Sachets</SelectItem>
              <SelectItem value="pairs">Pairs</SelectItem>
              <SelectItem value="cases">Cases</SelectItem>
            </SelectContent>
          </Select>
          {errors.unitType && <p className="text-sm text-destructive">{errors.unitType}</p>}
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="space-y-2">
          <Label htmlFor="currentAvailable" className="text-base">Current Available</Label>
          <Input
            id="currentAvailable"
            name="currentAvailable"
            type="number"
            value={formData.currentAvailable}
            onChange={handleChange}
            className="enhanced-input form-field-animation"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pricePerUnit" className="text-base">Price Per Unit ($)</Label>
          <Input
            id="pricePerUnit"
            name="pricePerUnit"
            type="number"
            step="0.01"
            value={formData.pricePerUnit}
            onChange={handleChange}
            className={cn("enhanced-input form-field-animation", errors.pricePerUnit && "error")}
          />
          {errors.pricePerUnit && <p className="text-sm text-destructive">{errors.pricePerUnit}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="productType" className="text-base">Product Type</Label>
          <Select
            name="productType"
            value={formData.productType}
            onValueChange={(value) => setFormData({...formData, productType: value})}
          >
            <SelectTrigger className="enhanced-input form-field-animation">
              <SelectValue placeholder="Select product type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Finished Good">Finished Good</SelectItem>
              <SelectItem value="Raw Material">Raw Material</SelectItem>
              <SelectItem value="Component">Component</SelectItem>
              <SelectItem value="Packaging Material">Packaging Material</SelectItem>
              <SelectItem value="Semi-finished Good">Semi-finished Good</SelectItem>
              <SelectItem value="Bulk Product">Bulk Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <div className="space-y-2">
          <Label htmlFor="leadTime" className="text-base">Lead Time</Label>
          <Input
            id="leadTime"
            name="leadTime"
            value={formData.leadTime}
            onChange={handleChange}
            className="enhanced-input form-field-animation"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="leadTimeUnit" className="text-base">Lead Time Unit</Label>
          <Select
            name="leadTimeUnit"
            value={formData.leadTimeUnit}
            onValueChange={(value) => setFormData({...formData, leadTimeUnit: value})}
          >
            <SelectTrigger className="enhanced-input form-field-animation">
              <SelectValue placeholder="Select unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">Days</SelectItem>
              <SelectItem value="weeks">Weeks</SelectItem>
              <SelectItem value="months">Months</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 flex items-center">
          <div className="flex-1 pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sustainable" 
                name="sustainable"
                checked={formData.sustainable}
                onCheckedChange={(checked) => 
                  setFormData({...formData, sustainable: checked as boolean})
                }
              />
              <label
                htmlFor="sustainable"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center"
              >
                <Zap className="h-4 w-4 mr-2 text-green-600" />
                Sustainable Product
              </label>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <div className="space-y-2">
          <Label htmlFor="description" className="text-base">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter product description"
            className={cn("h-[120px] enhanced-input form-field-animation", errors.description && "error")}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        </div>
        
        <div className="space-y-2">
          <Label className="text-base">Product Image</Label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          
          <motion.div
            className={cn(
              "image-upload-area w-full h-[120px] border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer",
              isDragging 
                ? "border-primary bg-primary/5" 
                : formData.image 
                  ? "border-primary/30 bg-primary/5"
                  : "border-muted-foreground/25 hover:border-primary/30 hover:bg-primary/5"
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            {formData.image ? (
              <div className="relative w-full h-full">
                <img 
                  src={formData.image} 
                  alt="Product preview" 
                  className="w-full h-full object-contain p-2" 
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/60 transition-all flex items-center justify-center opacity-0 hover:opacity-100">
                  <p className="text-white text-sm font-medium">Click or drop to change</p>
                </div>
              </div>
            ) : (
              <>
                <motion.div 
                  className="upload-icon-animation text-primary/60"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                >
                  <UploadCloud className="h-8 w-8 mb-2" />
                </motion.div>
                <p className="text-sm text-muted-foreground">Click or drag & drop an image</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or GIF up to 5MB</p>
              </>
            )}
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="flex justify-end mt-6 space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
      >
        <Button
          type="submit"
          disabled={isLoading}
          className="submit-button-hover hover-scale-subtle"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {product ? "Updating..." : "Creating..."}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {product ? "Update Product" : "Create Product"}
            </>
          )}
        </Button>
      </motion.div>
    </motion.form>
  );
};

// AddProductionLineForm Component
interface AddProductionLineFormProps {
  onSubmit: (newLine: Omit<ProductionLine, "id" | "maintenance_history" | "downtime_incidents" | "quality_metrics" | "alerts">) => void;
  isLoading: boolean;
}

const AddProductionLineForm: React.FC<AddProductionLineFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<Omit<ProductionLine, "id" | "maintenance_history" | "downtime_incidents" | "quality_metrics" | "alerts">>({
    name: "",
    status: "Idle",
    product: "N/A",
    efficiency: 85,
    daily_capacity: "0 units/day",
    next_maintenance: "",
    operational_since: new Date().toISOString().split("T")[0],
    operator_assigned: "",
    last_maintenance: "",
    line_type: "Assembly",
    total_runtime_hours: 0,
    energy_consumption: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Production line name is required";
    }
    
    if (!formData.operator_assigned.trim()) {
      newErrors.operator_assigned = "Operator assignment is required";
    }
    
    if (!formData.next_maintenance) {
      newErrors.next_maintenance = "Next maintenance date is required";
    }
    
    if (!formData.line_type.trim()) {
      newErrors.line_type = "Line type is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
    
    // Handle numeric values
    if (name === "efficiency" || name === "total_runtime_hours" || name === "energy_consumption") {
      setFormData({
        ...formData,
        [name]: Number(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-sm font-medium flex items-center">
            <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
            Production Line Name*
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Assembly Line 1"
            className={`w-full ${errors.name ? "border-red-500" : ""}`}
          />
          {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="line_type" className="text-sm font-medium flex items-center">
            <Factory className="h-4 w-4 mr-2 text-muted-foreground" />
            Line Type*
          </Label>
          <Select
            name="line_type"
            value={formData.line_type}
            onValueChange={(value) => {
              if (errors.line_type) {
                setErrors({
                  ...errors,
                  line_type: ""
                });
              }
              setFormData({
                ...formData,
                line_type: value
              });
            }}
          >
            <SelectTrigger className={errors.line_type ? "border-red-500" : ""}>
              <SelectValue placeholder="Select line type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Assembly">Assembly</SelectItem>
              <SelectItem value="Packaging">Packaging</SelectItem>
              <SelectItem value="Filling">Filling</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Assembly & Packaging">Assembly & Packaging</SelectItem>
              <SelectItem value="Processing & Filling">Processing & Filling</SelectItem>
            </SelectContent>
          </Select>
          {errors.line_type && <p className="text-xs text-red-500">{errors.line_type}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="status" className="text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2 text-muted-foreground" />
            Initial Status
          </Label>
          <Select
            name="status"
            value={formData.status}
            onValueChange={(value) => {
              setFormData({
                ...formData,
                status: value as "Active" | "Maintenance" | "Idle" | "Setup" | "Offline"
              });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Idle">Idle</SelectItem>
              <SelectItem value="Setup">Setup</SelectItem>
              <SelectItem value="Maintenance">Maintenance</SelectItem>
              <SelectItem value="Offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="operator_assigned" className="text-sm font-medium flex items-center">
            <User className="h-4 w-4 mr-2 text-muted-foreground" />
            Operator Assigned*
          </Label>
          <Input
            id="operator_assigned"
            name="operator_assigned"
            value={formData.operator_assigned}
            onChange={handleChange}
            placeholder="e.g., John Smith"
            className={`w-full ${errors.operator_assigned ? "border-red-500" : ""}`}
          />
          {errors.operator_assigned && <p className="text-xs text-red-500">{errors.operator_assigned}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="efficiency" className="text-sm font-medium flex items-center">
            <BarChart className="h-4 w-4 mr-2 text-muted-foreground" />
            Target Efficiency (%)
          </Label>
          <Input
            id="efficiency"
            name="efficiency"
            type="number"
            min="0"
            max="100"
            value={formData.efficiency}
            onChange={handleChange}
            placeholder="85"
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="next_maintenance" className="text-sm font-medium flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            Next Maintenance Date*
          </Label>
          <Input
            id="next_maintenance"
            name="next_maintenance"
            type="date"
            value={formData.next_maintenance}
            onChange={handleChange}
            className={`w-full ${errors.next_maintenance ? "border-red-500" : ""}`}
          />
          {errors.next_maintenance && <p className="text-xs text-red-500">{errors.next_maintenance}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="operational_since" className="text-sm font-medium flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            Operational Since
          </Label>
          <Input
            id="operational_since"
            name="operational_since"
            type="date"
            value={formData.operational_since}
            onChange={handleChange}
            className="w-full"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="energy_consumption" className="text-sm font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2 text-muted-foreground" />
            Energy Consumption (kWh)
          </Label>
          <Input
            id="energy_consumption"
            name="energy_consumption"
            type="number"
            min="0"
            value={formData.energy_consumption}
            onChange={handleChange}
            placeholder="0"
            className="w-full"
          />
        </div>
      </div>
      
      <DialogFooter className="mt-6">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full sm:w-auto hover-scale-subtle"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding Line...
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Production Line
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

// ScheduleMaintenanceForm Component
interface ScheduleMaintenanceFormProps {
  productionLine: ProductionLine;
  onSubmit: (maintenanceData: {
    date: string;
    type: "Routine" | "Emergency" | "Upgrade";
    technician: string;
    duration: string;
    notes: string;
    startNow: boolean;
  }) => void;
  isLoading: boolean;
}

const ScheduleMaintenanceForm: React.FC<ScheduleMaintenanceFormProps> = ({ 
  productionLine, 
  onSubmit, 
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    date: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split("T")[0],
    type: "Routine" as "Routine" | "Emergency" | "Upgrade",
    technician: "",
    duration: "2 hours",
    notes: "",
    startNow: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.date) {
      newErrors.date = "Maintenance date is required";
    }
    
    if (!formData.technician.trim()) {
      newErrors.technician = "Technician name is required";
    }
    
    if (!formData.duration.trim()) {
      newErrors.duration = "Expected duration is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
    
    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="date" className="text-sm font-medium flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
          Maintenance Date*
        </Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date}
          onChange={handleChange}
          className={`w-full ${errors.date ? "border-red-500" : ""}`}
        />
        {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type" className="text-sm font-medium flex items-center">
          <Wrench className="h-4 w-4 mr-2 text-muted-foreground" />
          Maintenance Type
        </Label>
        <Select
          name="type"
          value={formData.type}
          onValueChange={(value) => {
            setFormData({
              ...formData,
              type: value as "Routine" | "Emergency" | "Upgrade"
            });
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Routine">Routine</SelectItem>
            <SelectItem value="Emergency">Emergency</SelectItem>
            <SelectItem value="Upgrade">Upgrade</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="technician" className="text-sm font-medium flex items-center">
          <User className="h-4 w-4 mr-2 text-muted-foreground" />
          Assigned Technician*
        </Label>
        <Input
          id="technician"
          name="technician"
          value={formData.technician}
          onChange={handleChange}
          placeholder="Enter technician name"
          className={`w-full ${errors.technician ? "border-red-500" : ""}`}
        />
        {errors.technician && <p className="text-xs text-red-500">{errors.technician}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="duration" className="text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
          Expected Duration*
        </Label>
        <Input
          id="duration"
          name="duration"
          value={formData.duration}
          onChange={handleChange}
          placeholder="e.g., 2 hours"
          className={`w-full ${errors.duration ? "border-red-500" : ""}`}
        />
        {errors.duration && <p className="text-xs text-red-500">{errors.duration}</p>}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium flex items-center">
          <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
          Notes
        </Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Enter any additional notes"
          className="w-full min-h-[100px]"
        />
      </div>
      
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="startNow" 
          name="startNow"
          checked={formData.startNow}
          onCheckedChange={(checked) => {
            setFormData({
              ...formData,
              startNow: checked === true
            });
          }}
        />
        <Label 
          htmlFor="startNow" 
          className="text-sm cursor-pointer"
        >
          Put line in maintenance mode immediately
        </Label>
      </div>
      
      <DialogFooter className="mt-6">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="w-full sm:w-auto hover-scale-subtle"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <CalendarCheck className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

// AssignProductForm Component
interface AssignProductFormProps {
  productionLine: ProductionLine;
  products: Product[];
  onSubmit: (productId: number) => void;
  isLoading: boolean;
}

const AssignProductForm: React.FC<AssignProductFormProps> = ({ 
  productionLine, 
  products, 
  onSubmit, 
  isLoading 
}) => {
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Filter products with current available inventory
  const availableProducts = products.filter(p => p.currentAvailable > 0);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedProductId) {
      setError("Please select a product to assign");
      return;
    }
    
    onSubmit(selectedProductId);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="product" className="text-sm font-medium flex items-center">
          <Package className="h-4 w-4 mr-2 text-muted-foreground" />
          Select Product*
        </Label>
        
        {availableProducts.length === 0 ? (
          <div className="p-4 border rounded-md bg-muted/50 text-center">
            <span className="text-sm text-muted-foreground">No products available in stock</span>
          </div>
        ) : (
          <div className="grid gap-3 pt-2">
            <RadioGroup 
              value={selectedProductId?.toString() || ""} 
              onValueChange={(value) => {
                setSelectedProductId(Number(value));
                setError(null);
              }}
            >
              {availableProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={product.id.toString()} id={`product-${product.id}`} />
                  <Label 
                    htmlFor={`product-${product.id}`} 
                    className="flex flex-1 items-center p-2 cursor-pointer hover:bg-muted/50 rounded-md"
                  >
                    <div className="w-10 h-10 rounded overflow-hidden mr-3 bg-muted flex items-center justify-center">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-muted-foreground/60" />
                      )}
                        </div>
                        <div className="flex-1">
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <BarChart className="h-3 w-3 mr-1" />
                        {product.dailyCapacity} {product.unitType}/day
                        </div>
                    </div>
                  </Label>
                      </div>
                    ))}
            </RadioGroup>
            
            {error && (
              <p className="text-xs text-red-500 mt-2 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {error}
              </p>
            )}
          </div>
        )}
                  </div>
      
      <DialogFooter className="mt-6">
        <Button 
          type="submit" 
          disabled={isLoading || availableProducts.length === 0}
          className="w-full sm:w-auto hover-scale-subtle"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Assigning...
            </>
          ) : (
            <>
              <LinkIcon className="h-4 w-4 mr-2" />
              Assign Product
            </>
          )}
        </Button>
      </DialogFooter>
    </form>
  );
};

// ProductDetailsContent Component
interface ProductDetailsContentProps {
  product: Product;
  getProductTypeBadge: (productType: string) => JSX.Element;
  onEdit: () => void;
}

const ProductDetailsContent: React.FC<ProductDetailsContentProps> = ({ 
  product, 
  getProductTypeBadge,
  onEdit
}) => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex gap-4 items-start"
        >
          <div className="h-20 w-20 rounded-lg bg-muted overflow-hidden flex-shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-muted">
                <Package className="h-8 w-8 text-muted-foreground/40" />
              </div>
            )}
          </div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {product.name}
              {product.sustainable && 
                <Badge variant="outline" className="ml-2 bg-green-500/10 text-green-600 text-xs">
                  <Zap className="h-3 w-3 mr-1" />
                  Sustainable
                </Badge>
              }
            </h2>
            <p className="text-muted-foreground">{getProductTypeBadge(product.productType)}</p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
            className="hover-scale-subtle"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </Button>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="card-hover-effect">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <InfoIcon className="h-5 w-5 mr-2 text-primary" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">SKU</h4>
                <p className="font-medium">{product.sku}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Category</h4>
                <p className="font-medium">{product.category}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Minimum Order Quantity</h4>
                <p className="font-medium">{product.minOrderQuantity} {product.unitType}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Daily Capacity</h4>
                <p className="font-medium">{product.dailyCapacity} {product.unitType}/day</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Price Per Unit</h4>
                <p className="font-medium">${product.pricePerUnit.toFixed(2)} per {product.unitType}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Lead Time</h4>
                <p className="font-medium">{product.leadTime} {product.leadTimeUnit}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                <p className="text-sm mt-1">{product.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="card-hover-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="h-5 w-5 mr-2 text-primary" />
              Inventory Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <h4 className="text-sm font-medium">Current Available</h4>
                  <span className={
                    product.currentAvailable < product.minOrderQuantity * 0.5
                      ? "text-red-500 font-medium"
                      : product.currentAvailable < product.minOrderQuantity
                        ? "text-amber-500 font-medium"
                        : "text-green-600 font-medium"
                  }>
                    {product.currentAvailable} {product.unitType}
                  </span>
                </div>
                <Progress 
                  value={(product.currentAvailable / (product.minOrderQuantity * 3)) * 100} 
                  className={`h-2 rounded-full ${
                    product.currentAvailable < product.minOrderQuantity * 0.5
                      ? "bg-red-500"
                      : product.currentAvailable < product.minOrderQuantity
                        ? "bg-amber-500"
                        : "bg-green-600"
                  }`}
                />
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Reorder Point</h4>
                <p className="font-medium">{product.reorderPoint} {product.unitType}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Last Produced</h4>
                <p className="font-medium">{new Date(product.lastProduced).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-hover-effect">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CalendarCheck className="h-5 w-5 mr-2 text-primary" />
              Production History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Created</h4>
                <p className="font-medium">{new Date(product.createdAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Last Updated</h4>
                <p className="font-medium">{new Date(product.updatedAt).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Production Status</h4>
                <Badge variant="outline" className={
                  product.currentAvailable === 0
                    ? "bg-red-500/10 text-red-600"
                    : product.currentAvailable < product.minOrderQuantity
                      ? "bg-amber-500/10 text-amber-600"
                      : "bg-green-500/10 text-green-600"
                }>
                  {product.currentAvailable === 0
                    ? "Out of Stock"
                    : product.currentAvailable < product.minOrderQuantity
                      ? "Low Stock"
                      : "In Stock"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
