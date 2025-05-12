import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import ManufacturerLayout from "@/components/layouts/ManufacturerLayout";
import { useTranslation } from "react-i18next";
import {
  RefreshCw, Filter, Plus, Star, Users, Clock, PackageCheck, Mail, 
  Phone, MapPin, Truck, Calendar, X, ExternalLink, Check, Search,
  AlertCircle, ShoppingCart, Moon, Sun
} from "lucide-react";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/status-badge";
import { t } from "i18next";

// Enhanced custom hooks to replace the missing libraries
const useInView = (ref: React.RefObject<HTMLElement>, options = { once: false }) => {
  const [isInView, setIsInView] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!ref.current || prefersReducedMotion) {
      setIsInView(true); // Auto show if reduced motion is preferred
      return;
    }
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsInView(entry.isIntersecting);
      if (entry.isIntersecting && options.once) {
        observer.unobserve(ref.current!);
      }
    }, {
      threshold: 0.1, // Trigger when at least 10% is visible
      rootMargin: '20px' // Start animation slightly before element enters viewport - reduced from 50px
    });

    observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [ref, options.once, prefersReducedMotion]);

  return isInView;
};

// Enhanced implementation of useAutoAnimate with better performance
const useAutoAnimate = () => {
  const ref = useRef(null);
  return [ref];
};

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

// Define types
interface Supplier {
  id: string;
  name: string;
  category: string;
  location: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  materials: string[];
  status: "active" | "pending" | "inactive";
  reliability: number;
  leadTime: string;
  lastOrder: string;
  nextDelivery: string;
  logoUrl: string;
  yearEstablished: string | number;
  contractEndDate?: string;
  termsAndConditions?: string;
  notes?: string;
}

interface Material {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
}

const Suppliers = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("suppliers");
  const [suppliersView, setSuppliersView] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false);
  const [isPlaceOrderOpen, setIsPlaceOrderOpen] = useState(false);
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [orderMaterials, setOrderMaterials] = useState<Material[]>([]);
  const { theme } = useTheme();
  const { toast } = useToast();
  const prefersReducedMotion = useReducedMotion();
  
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });
  const [parent] = useAutoAnimate();
  
  // Transition properties based on reduced motion preference
  const getTransition = (delay = 0) => ({
    type: prefersReducedMotion ? "tween" : "spring",
    duration: prefersReducedMotion ? 0.1 : 0.3, // Reduced from 0.5 to 0.3
    delay: prefersReducedMotion ? 0 : delay * 0.5, // Scale down delays by half
    stiffness: 250, // Increased from 120
    damping: 15, // Decreased from 20 for snappier animations
    mass: 0.8 // Added mass parameter to make animations more responsive
  });

  // Animation variants for consistent animations
  const fadeIn = {
    hidden: { opacity: 0, y: 10 }, // Reduced y distance from 20 to 10
    visible: { opacity: 1, y: 0 }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 }, // Reduced values for subtler initial state
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay: i * 0.03, // Reduced delay multiplier from 0.05 to 0.03
        duration: 0.3, // Reduced from 0.5
        ease: "easeOut"
      }
    }),
    hover: {
      y: -3, // Reduced from -5
      scale: 1.01, // Reduced from 1.02
      transition: {
        duration: 0.15, // Reduced from 0.2
        ease: "easeOut"
      }
    }
  };
  
  useEffect(() => {
    document.title = t("suppliers-title") + " - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
      navigate("/dashboard");
    }
    
    // Simulate loading data
    const loadData = async () => {
      setIsLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuppliers(mockSuppliers);
      setIsLoading(false);
    };
    
    loadData();
  }, [isAuthenticated, navigate, role, t]);

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

  // Data operations
  const refreshSuppliers = async () => {
    setIsLoading(true);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setSuppliers(mockSuppliers);
    setIsLoading(false);
    toast({
      title: t("suppliers-suppliers-refreshed"),
      description: t("suppliers-suppliers-list-updated"),
      variant: "default"
    });
  };
  
  const addSupplier = (supplier: Omit<Supplier, "id">) => {
    const newSupplier: Supplier = {
      ...supplier,
      id: `supplier-${Date.now()}`,
      status: "pending",
      reliability: Math.floor(Math.random() * 20) + 70, // 70-90%
      leadTime: `${Math.floor(Math.random() * 7) + 1}-${Math.floor(Math.random() * 14) + 7} days`,
      lastOrder: "N/A",
      nextDelivery: "N/A",
      logoUrl: "",
      yearEstablished: Math.floor(Math.random() * 30) + 1990,
      contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      termsAndConditions: t("suppliers-standard-terms"),
      notes: ""
    };
    
    setSuppliers([...suppliers, newSupplier]);
    setIsAddSupplierOpen(false);
    toast({
      title: t("suppliers-supplier-added"),
      description: t("suppliers-supplier-added-desc"),
      variant: "default"
    });
  };
  
  const updateSupplierStatus = (id: string, status: "active" | "pending" | "inactive") => {
    setSuppliers(suppliers.map(supplier => 
      supplier.id === id ? { ...supplier, status } : supplier
    ));
    
    const statusMessages = {
      active: t("suppliers-approved-success"),
      inactive: t("suppliers-deactivated"),
      pending: t("suppliers-pending-review")
    };
    
    toast({
      title: t("suppliers-status-updated"),
      description: statusMessages[status],
      variant: status === "active" ? "default" : "destructive"
    });
  };
  
  const placeOrder = (supplierId: string, materials: Material[]) => {
    // In a real app, this would call an API to place the order
    toast({
      title: t("suppliers-order-placed"),
      description: t("suppliers-order-submitted", { count: materials.length }),
      variant: "default"
    });
    setIsPlaceOrderOpen(false);
    
    // Update the supplier's last order date
    setSuppliers(suppliers.map(supplier => 
      supplier.id === supplierId ? 
        { ...supplier, lastOrder: t("suppliers-just-now"), nextDelivery: t("suppliers-weeks-from-now") } : 
        supplier
    ));
  };

  // Mock data for suppliers
  const mockSuppliers: Supplier[] = [
    {
      id: "1",
      name: "EcoGrain Supplies",
      category: "Grains & Cereals",
      location: "Portland, USA",
      status: "active",
      reliability: 92,
      lastOrder: "14 Apr 2023",
      nextDelivery: "2 May 2023",
      logoUrl: "",
      description: "Specializing in organic and sustainable grains and cereals for food manufacturing.",
      contactPerson: "Sarah Johnson",
      email: "sarah@ecograin.com",
      phone: "+1 (555) 123-4567",
      address: "123 Green Street, Portland, OR",
      materials: ["Wheat", "Oats", "Barley", "Rice", "Quinoa"],
      termsAndConditions: "Net 30 payment terms, minimum order $500",
      yearEstablished: 2010,
      leadTime: "3-7 days"
    },
    {
      id: "2",
      name: "Pure Sweeteners Inc.",
      category: "Sweeteners",
      location: "Chicago, USA",
      status: "active",
      reliability: 87,
      lastOrder: "23 Mar 2023",
      nextDelivery: "10 May 2023",
      logoUrl: "",
      description: "Provider of natural and artificial sweeteners for food and beverage production.",
      contactPerson: "Michael Chen",
      email: "michael@puresweeteners.com",
      phone: "+1 (555) 987-6543",
      address: "456 Sugar Lane, Chicago, IL",
      materials: ["Cane Sugar", "Honey", "Maple Syrup", "Stevia"],
      notes: "Often has seasonal discounts on bulk orders",
      yearEstablished: 2008,
      leadTime: "5-10 days"
    },
    {
      id: "3",
      name: "NaturalNuts Co.",
      category: "Nuts & Seeds",
      location: "Austin, USA",
      status: "pending",
      reliability: 78,
      lastOrder: "05 Feb 2023",
      nextDelivery: "Pending approval",
      logoUrl: "",
      description: "Supplier of premium nuts and seeds sourced from sustainable farms.",
      contactPerson: "Emma Garcia",
      email: "emma@naturalnuts.com",
      phone: "+1 (555) 456-7890",
      address: "789 Nut Avenue, Austin, TX",
      materials: ["Almonds", "Walnuts", "Cashews", "Sunflower Seeds"],
      yearEstablished: 2015,
      leadTime: "7-14 days"
    },
    {
      id: "4",
      name: "PureFlavor Extracts",
      category: "Flavors & Extracts",
      location: "San Francisco, USA",
      status: "inactive",
      reliability: 60,
      lastOrder: "12 Dec 2022",
      nextDelivery: "Not scheduled",
      logoUrl: "",
      description: "Specialized in natural flavor extracts for food and beverage applications.",
      contactPerson: "David Kim",
      email: "david@pureflavor.com",
      phone: "+1 (555) 345-6789",
      address: "101 Flavor Street, San Francisco, CA",
      materials: ["Vanilla Extract", "Almond Extract", "Citrus Oils"],
      notes: "Currently resolving quality issues",
      yearEstablished: 2012,
      leadTime: "10-15 days"
    },
    {
      id: "5",
      name: "Green Packaging Solutions",
      category: "Packaging",
      location: "Seattle, USA",
      status: "active",
      reliability: 95,
      lastOrder: "20 Apr 2023",
      nextDelivery: "15 May 2023",
      logoUrl: "",
      description: "Eco-friendly packaging solutions for food and beverage products.",
      contactPerson: "Jennifer Lee",
      email: "jennifer@greenpackaging.com",
      phone: "+1 (555) 234-5678",
      address: "202 Eco Way, Seattle, WA",
      materials: ["Biodegradable Containers", "Compostable Bags", "Recycled Cardboard"],
      contractEndDate: "31 Dec 2023",
      yearEstablished: 2014,
      leadTime: "7-10 days"
    },
    {
      id: "6",
      name: "Organic Dairy Farms",
      category: "Dairy",
      location: "Madison, USA",
      status: "active",
      reliability: 89,
      lastOrder: "03 Apr 2023",
      nextDelivery: "03 May 2023",
      logoUrl: "",
      description: "Provider of organic dairy products from family-owned farms.",
      contactPerson: "Robert Miller",
      email: "robert@organicdairy.com",
      phone: "+1 (555) 876-5432",
      address: "303 Farm Road, Madison, WI",
      materials: ["Milk", "Cream", "Butter", "Cheese"],
      termsAndConditions: "Weekly delivery schedule, temperature-controlled transport required",
      yearEstablished: 2005,
      leadTime: "2-4 days"
    },
    {
      id: "7",
      name: "FreshHerb Suppliers",
      category: "Herbs & Spices",
      location: "Denver, USA",
      status: "pending",
      reliability: 82,
      lastOrder: "15 Mar 2023",
      nextDelivery: "Pending approval",
      logoUrl: "",
      description: "Fresh and dried herbs and spices for food manufacturing.",
      contactPerson: "Amanda Wilson",
      email: "amanda@freshherb.com",
      phone: "+1 (555) 567-8901",
      address: "404 Spice Boulevard, Denver, CO",
      materials: ["Basil", "Oregano", "Thyme", "Pepper", "Cinnamon"],
      notes: "Seasonal availability for some items",
      yearEstablished: 2016,
      leadTime: "4-8 days"
    }
  ];

  // Filter and sort suppliers
  const filteredSuppliers = suppliers
    .filter(supplier => {
      // Filter by status
      if (suppliersView !== "all" && supplier.status !== suppliersView) {
        return false;
      }
      
      // Filter by category
      if (categoryFilter !== "all" && supplier.category !== categoryFilter) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          supplier.name.toLowerCase().includes(query) ||
          supplier.category.toLowerCase().includes(query) ||
          supplier.location.toLowerCase().includes(query) ||
          supplier.description.toLowerCase().includes(query) ||
          (supplier.contactPerson && supplier.contactPerson.toLowerCase().includes(query))
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by reliability (highest first) for active suppliers
      if (a.status === "active" && b.status === "active") {
        return b.reliability - a.reliability;
      }
      
      // Active suppliers always come first
      if (a.status === "active" && b.status !== "active") return -1;
      if (a.status !== "active" && b.status === "active") return 1;
      
      // Then pending suppliers
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (a.status !== "pending" && b.status === "pending") return 1;
      
      // Lastly, sort by name alphabetically
      return a.name.localeCompare(b.name);
    });

  // Get unique categories for the filter dropdown
  const categories = ["all", ...new Set(suppliers.map(s => s.category))];

  // Get counts for statistics
  const activeCount = suppliers.filter(s => s.status === "active").length;
  const pendingCount = suppliers.filter(s => s.status === "pending").length;
  const categoryCount = new Set(suppliers.map(s => s.category)).size;
  const avgReliability = suppliers.length > 0
    ? Math.round(suppliers.reduce((acc, curr) => acc + curr.reliability, 0) / suppliers.length)
    : 0;

  // Status badge generator with improved styling for light/dark theme visibility
  const getStatusBadge = (status: string) => {
    const isDark = theme === 'dark';
    
    switch (status.toLowerCase()) {
      case "active":
        return (
          <Badge 
            className={`transition-colors ${
              isDark 
                ? "bg-emerald-700/70 text-emerald-100 border border-emerald-600/50 shadow-sm hover:bg-emerald-700" 
                : "bg-emerald-200 text-emerald-700 border border-emerald-300 shadow-sm hover:bg-emerald-300"
            }`}
          >
            {status}
          </Badge>
        );
      case "pending":
        return (
          <Badge 
            className={`transition-colors ${
              isDark 
                ? "bg-amber-700/70 text-amber-100 border border-amber-600/50 shadow-sm hover:bg-amber-700" 
                : "bg-amber-200 text-amber-700 border border-amber-300 shadow-sm hover:bg-amber-300"
            }`}
          >
            {status}
          </Badge>
        );
      case "inactive":
        return (
          <Badge 
            className={`transition-colors ${
              isDark 
                ? "bg-rose-700/70 text-rose-100 border border-rose-600/50 shadow-sm hover:bg-rose-700" 
                : "bg-rose-200 text-rose-700 border border-rose-300 shadow-sm hover:bg-rose-300"
            }`}
          >
            {status}
          </Badge>
        );
      default:
        return (
          <Badge 
            className={`transition-colors ${
              isDark 
                ? "bg-slate-700/70 text-slate-100 border border-slate-600/50 shadow-sm hover:bg-slate-700" 
                : "bg-slate-200 text-slate-700 border border-slate-300 shadow-sm hover:bg-slate-300"
            }`}
          >
            {status}
          </Badge>
        );
    }
  };

  return (
    <ManufacturerLayout>
      <motion.div 
        className="max-w-none px-4 sm:px-6 lg:px-8 pb-8"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={getTransition()}
      >
        <div className="space-y-6">
          {/* Header with actions and theme toggle */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <motion.div 
              initial={{ opacity: 0, y: -5 }} // Reduced y from -10 to -5
              animate={{ opacity: 1, y: 0 }}
              transition={getTransition(0.05)} // Reduced from 0.1
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                {t("suppliers-title")}
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-1">{t("suppliers-subtitle")}</p>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-2 flex-wrap justify-end"
              initial={{ opacity: 0, scale: 0.95 }} // Changed from 0.9 to 0.95
              animate={{ opacity: 1, scale: 1 }}
              transition={getTransition(0.1)} // Reduced from 0.2
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={refreshSuppliers}
                disabled={isLoading}
                className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                <span>{t("suppliers-refresh")}</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200"
              >
                <Filter className="h-4 w-4" />
                <span>{t("suppliers-advanced-filter")}</span>
              </Button>
              <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex items-center gap-1 bg-sky-600 hover:bg-sky-700 text-white" 
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("suppliers-add-supplier")}</span>
                  </Button>
                </DialogTrigger>
                <AddSupplierDialog onAdd={addSupplier} />
              </Dialog>
            </motion.div>
          </div>
          
          {/* Statistics Cards */}
          <div 
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8"
            ref={statsRef}
          >
            <motion.div
              custom={0}
              initial="hidden"
              animate={isStatsInView ? "visible" : "hidden"}
              variants={cardVariants}
              className="h-full"
            >
              <StatCard 
                title={t("suppliers-active-suppliers")} 
                value={activeCount}
                icon={<Users className="h-4 w-4 text-teal-600" />}
                isLoading={isLoading}
                bgColor="bg-teal-50 dark:bg-teal-900/20"
              />
            </motion.div>
            
            <motion.div
              custom={1}
              initial="hidden"
              animate={isStatsInView ? "visible" : "hidden"}
              variants={cardVariants}
              className="h-full"
            >
              <StatCard 
                title={t("suppliers-pending-approvals")} 
                value={pendingCount}
                icon={<Clock className="h-4 w-4 text-amber-600" />}
                isLoading={isLoading}
                bgColor="bg-amber-50 dark:bg-amber-900/20"
              />
            </motion.div>
            
            <motion.div
              custom={2}
              initial="hidden"
              animate={isStatsInView ? "visible" : "hidden"}
              variants={cardVariants}
              className="h-full"
            >
              <StatCard 
                title={t("suppliers-categories")} 
                value={categoryCount}
                icon={<PackageCheck className="h-4 w-4 text-sky-600" />}
                isLoading={isLoading}
                bgColor="bg-sky-50 dark:bg-sky-900/20"
              />
            </motion.div>
            
            <motion.div
              custom={3}
              initial="hidden"
              animate={isStatsInView ? "visible" : "hidden"}
              variants={cardVariants}
              className="h-full"
            >
              <StatCard 
                title={t("suppliers-avg-reliability")} 
                value={`${avgReliability}%`}
                icon={<Star className="h-4 w-4 text-rose-600" />}
                isLoading={isLoading}
                bgColor="bg-rose-50 dark:bg-rose-900/20"
              />
            </motion.div>
          </div>
          
          {/* Search and Filter */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={getTransition(0.25)} // Reduced from 0.5
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-border p-4 rounded-lg shadow-sm transition-colors duration-300">
              <div className="relative w-full md:w-72">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder={t("suppliers-search-placeholder")} 
                  className="pl-8 border-input focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary shadow-sm transition-shadow duration-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 items-center w-full md:w-auto">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-52 border-input shadow-sm transition-colors duration-300">
                    <SelectValue placeholder={t("suppliers-filter-by-category")} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border transition-colors duration-300">
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? t("suppliers-all-categories") : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Tabs with enhanced styling */}
            <Tabs value={suppliersView} onValueChange={setSuppliersView} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-card border border-border shadow-md rounded-md transition-colors duration-300">
                <TabsTrigger 
                  value="all" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-primary-foreground/20 transition-all duration-300 py-2.5"
                >
                  {t("suppliers-all-suppliers")}
                  <Badge variant="outline" className="ml-2 bg-background/90 text-foreground shadow-sm border-border/80 font-medium transition-colors duration-300">
                    {suppliers.length}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="active" 
                  className="data-[state=active]:bg-emerald-500 dark:data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-white/20 transition-all duration-300 py-2.5"
                >
                  {t("suppliers-active")}
                  <Badge variant="outline" className="ml-2 bg-background/90 text-foreground shadow-sm border-border/80 font-medium transition-colors duration-300">
                    {activeCount}
                  </Badge>
                </TabsTrigger>
                <TabsTrigger 
                  value="pending" 
                  className="data-[state=active]:bg-amber-500 dark:data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold data-[state=active]:border-b-2 data-[state=active]:border-white/20 transition-all duration-300 py-2.5"
                >
                  {t("suppliers-pending")}
                  <Badge variant="outline" className="ml-2 bg-background/90 text-foreground shadow-sm border-border/80 font-medium transition-colors duration-300">
                    {pendingCount}
                  </Badge>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>
          
          {/* Empty state with improved contrast */}
          {filteredSuppliers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} // Changed from 0.95 to 0.98
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }} // Changed from 0.95 to 0.98
              transition={{ duration: 0.2 }} // Reduced from 0.3
              className="bg-card border border-border shadow-md rounded-lg p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="mx-auto mb-6 p-4 rounded-full bg-muted/50 w-20 h-20 flex items-center justify-center"
              >
                <AlertCircle className="h-10 w-10 text-primary/70" />
              </motion.div>
              <motion.h3 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="text-xl font-medium mb-3 text-foreground"
              >
                {t("suppliers-no-suppliers-found")}
              </motion.h3>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="text-muted-foreground mb-6 max-w-md mx-auto"
              >
                {searchQuery ? 
                  t("suppliers-try-adjusting") : 
                  t("suppliers-no-suppliers-category")}
              </motion.p>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setCategoryFilter("all");
                    setSuppliersView("all");
                  }}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:shadow-md px-6 py-2"
                >
                  {t("suppliers-show-all")}
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
              ref={parent}
            >
              <AnimatePresence>
                {isLoading ? (
                  // Show skeletons when loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0, y: 10 }} // Reduced from 20 to 10
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }} // Reduced from -20 to -10
                      transition={{ 
                        duration: 0.2, // Reduced from 0.3
                        delay: index * 0.03 // Reduced from 0.05
                      }}
                    >
                      <SupplierCardSkeleton />
                    </motion.div>
                  ))
                ) : (
                  filteredSuppliers.map((supplier, index) => (
                    <motion.div
                      key={supplier.id}
                      custom={index}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, y: -20 }}
                      variants={cardVariants}
                      whileHover="hover"
                    >
                      <SupplierCard 
                        supplier={supplier}
                        onStatusChange={updateSupplierStatus}
                        onSelectSupplier={setSelectedSupplier}
                        onViewDetails={() => {
                          setSelectedSupplier(supplier);
                          setIsViewDetailsOpen(true);
                        } }
                        onPlaceOrder={() => {
                          setSelectedSupplier(supplier);
                          setIsPlaceOrderOpen(true);
                          // Initialize with some default materials
                          setOrderMaterials(
                            supplier.materials?.slice(0, 2).map((mat, i) => ({
                              id: `mat-${i}`,
                              name: mat,
                              price: 25 + Math.random() * 75,
                              quantity: 1,
                              unit: ["kg", "litres", "pcs"][Math.floor(Math.random() * 3)]
                            })) || []
                          );
                        } }
                        prefersReducedMotion={prefersReducedMotion} 
                        getStatusBadge={getStatusBadge}                      
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Supplier Details Dialog */}
      {selectedSupplier && (
        <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto no-scrollbar bg-background border-border shadow-md transition-colors duration-300">
            <DialogHeader>
              <DialogTitle className="text-xl text-foreground transition-colors duration-300">{t("suppliers-supplier-details")}</DialogTitle>
              <DialogDescription className="text-muted-foreground transition-colors duration-300">
                {t("suppliers-view-detailed")}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 mt-4">
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }} // Reduced from 0.3
              >
                <Avatar className="h-16 w-16 rounded border-2 border-primary/20 shadow-sm transition-colors duration-300">
                  <AvatarImage src={selectedSupplier.logoUrl} alt={selectedSupplier.name} />
                  <AvatarFallback className="text-xl bg-primary/10 text-primary transition-colors duration-300">{selectedSupplier.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                
                <div>
                  <h3 className="text-xl font-bold text-foreground transition-colors duration-300">{selectedSupplier.name}</h3>
                  <div className="flex items-center gap-2 text-muted-foreground transition-colors duration-300">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selectedSupplier.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <StatusBadge status={selectedSupplier.status} />
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 flex items-center gap-1 border border-blue-200 dark:border-blue-700/50 shadow-sm transition-colors duration-300">
                      <Star className="h-3 w-3 text-blue-500 dark:text-blue-300 drop-shadow-sm" />
                      <span>{selectedSupplier.reliability}% {t("suppliers-reliability")}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="text-sm p-3 bg-card border border-border rounded-lg shadow-sm transition-colors duration-300"
                initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }} // Reduced from 0.3, 0.1
              >
                <p className="font-medium mb-1 text-foreground transition-colors duration-300">{t("suppliers-description")}</p>
                <p className="text-muted-foreground transition-colors duration-300">{selectedSupplier.description}</p>
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
                initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }} // Reduced from 0.3, 0.2
              >
                <div className="p-3 bg-card border border-border rounded-lg shadow-sm transition-colors duration-300">
                  <p className="font-medium mb-1 text-primary/90 transition-colors duration-300">{t("suppliers-contact-person")}</p>
                  <p className="text-muted-foreground transition-colors duration-300">{selectedSupplier.contactPerson || t("suppliers-not-specified")}</p>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg shadow-sm transition-colors duration-300">
                  <p className="font-medium mb-1 text-primary/90 transition-colors duration-300">{t("suppliers-email")}</p>
                  <div className="flex items-center gap-1.5 text-muted-foreground transition-colors duration-300">
                    <Mail className="h-3.5 w-3.5" />
                    <span>{selectedSupplier.email || t("suppliers-not-specified")}</span>
                  </div>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg shadow-sm transition-colors duration-300">
                  <p className="font-medium mb-1 text-primary/90 transition-colors duration-300">{t("suppliers-phone")}</p>
                  <div className="flex items-center gap-1.5 text-muted-foreground transition-colors duration-300">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{selectedSupplier.phone || t("suppliers-not-specified")}</span>
                  </div>
                </div>
                <div className="p-3 bg-card border border-border rounded-lg shadow-sm transition-colors duration-300">
                  <p className="font-medium mb-1 text-primary/90 transition-colors duration-300">{t("suppliers-address")}</p>
                  <div className="flex items-center gap-1.5 text-muted-foreground transition-colors duration-300">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{selectedSupplier.address || t("suppliers-not-specified")}</span>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                className="text-sm p-3 bg-card border border-border rounded-lg shadow-sm transition-colors duration-300"
                initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.3 }} // Reduced from 0.3, 0.3
              >
                <p className="font-medium mb-2 text-primary/90 transition-colors duration-300">{t("suppliers-available-materials-full")}</p>
                {selectedSupplier.materials && selectedSupplier.materials.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedSupplier.materials.slice(0, 3).map((material, i) => (
                      <motion.span 
                        key={i} 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-background text-foreground border border-border shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.9 }} // Changed from 0.8 to 0.9
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 + i * 0.03 }} // Reduced from 0.3, 0.3, 0.05
                      >
                        {material}
                      </motion.span>
                    ))}
                    {selectedSupplier.materials.length > 3 && (
                      <motion.span 
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.9 }} // Changed from 0.8 to 0.9
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.1 + 3 * 0.03 }} // Reduced from 0.3, 0.3, 0.05
                      >
                        +{selectedSupplier.materials.length - 3} {t("suppliers-more")}
                      </motion.span>
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground transition-colors duration-300">{t("suppliers-no-materials")}</p>
                )}
              </motion.div>
              
            </div>
            
            <DialogFooter className="flex justify-between items-center mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsViewDetailsOpen(false)}
                className="border-border hover:bg-muted transition-colors duration-300"
              >
                {t("suppliers-close")}
              </Button>
              
              {selectedSupplier.status === "active" && (
                <div className="space-x-2">
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsViewDetailsOpen(false);
                      setIsPlaceOrderOpen(true);
                    }}
                    className="flex items-center gap-1 text-green-600 border-green-200 hover:border-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors duration-300"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    <span>{t("suppliers-place-order")}</span>
                  </Button>
                  <Button className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300">
                    <Mail className="h-4 w-4" />
                    <span>{t("suppliers-contact")}</span>
                  </Button>
                </div>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Place Order Dialog */}
      {selectedSupplier && (
        <Dialog open={isPlaceOrderOpen} onOpenChange={setIsPlaceOrderOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto no-scrollbar bg-background border-border shadow-md transition-colors duration-300">
            <DialogHeader>
              <DialogTitle className="text-xl text-foreground transition-colors duration-300">{t("suppliers-place-order-dialog")}</DialogTitle>
              <DialogDescription className="text-muted-foreground transition-colors duration-300">
                {t("suppliers-order-from", { name: selectedSupplier.name })}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-5 mt-4">
              <motion.div 
                className="flex items-center justify-between p-3 bg-card border border-border rounded-lg shadow-sm transition-colors duration-300"
                initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }} // Reduced from 0.3
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10 rounded border-2 border-primary/20 transition-colors duration-300">
                    <AvatarImage src={selectedSupplier.logoUrl} alt={selectedSupplier.name} />
                    <AvatarFallback className="bg-primary/10 text-primary transition-colors duration-300">{selectedSupplier.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground transition-colors duration-300">{selectedSupplier.name}</p>
                    <p className="text-xs text-muted-foreground transition-colors duration-300">{selectedSupplier.location}</p>
                  </div>
                </div>
                <StatusBadge status={selectedSupplier.status} />
              </motion.div>
          
              <motion.div 
                className="space-y-3 p-4 border rounded-lg border-border shadow-sm transition-colors duration-300"
                initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }} // Reduced from 0.3, 0.1
              >
                <Label className="mb-2 block font-medium text-foreground transition-colors duration-300">{t("suppliers-order-materials")}</Label>
                <AnimatePresence>
                  {orderMaterials.map((material, index) => (
                    <motion.div 
                      key={material.id} 
                      className="flex items-center gap-3 mb-3"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10, height: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }} // Reduced from 0.3, 0.05
                    >
                      <Input 
                        value={material.name}
                        onChange={(e) => {
                          const updatedMaterials = [...orderMaterials];
                          updatedMaterials[index] = { ...material, name: e.target.value };
                          setOrderMaterials(updatedMaterials);
                        }}
                        className="flex-1 border-input shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-colors duration-300"
                        placeholder={t("suppliers-material-name")}
                      />
                      <Input 
                        type="number"
                        value={material.quantity}
                        onChange={(e) => {
                          const updatedMaterials = [...orderMaterials];
                          updatedMaterials[index] = { ...material, quantity: Number(e.target.value) };
                          setOrderMaterials(updatedMaterials);
                        }}
                        className="w-20 border-input shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-colors duration-300"
                        min="1"
                      />
                      <Select 
                        value={material.unit}
                        onValueChange={(value) => {
                          const updatedMaterials = [...orderMaterials];
                          updatedMaterials[index] = { ...material, unit: value };
                          setOrderMaterials(updatedMaterials);
                        }}
                      >
                        <SelectTrigger className="w-20 border-input shadow-sm transition-colors duration-300">
                          <SelectValue placeholder={t("suppliers-units")} />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border transition-colors duration-300">
                          <SelectItem value="kg">kg</SelectItem>
                          <SelectItem value="litres">L</SelectItem>
                          <SelectItem value="pcs">pcs</SelectItem>
                        </SelectContent>
                      </Select>
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setOrderMaterials(orderMaterials.filter((_, i) => i !== index));
                          }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    variant="outline"
                    className="mt-2 w-full flex items-center justify-center gap-1 border-dashed border-border hover:border-border/80 text-foreground transition-colors duration-300"
                    onClick={() => {
                      setOrderMaterials([
                        ...orderMaterials, 
                        {
                          id: `mat-${Date.now()}`,
                          name: "",
                          price: 0,
                          quantity: 1,
                          unit: "kg"
                        }
                      ]);
                    }}
                  >
                    <Plus className="h-4 w-4" />
                    <span>{t("suppliers-add-material")}</span>
                  </Button>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.2 }} // Reduced from 0.3, 0.2
              >
                <Label htmlFor="order-notes" className="mb-2 block font-medium text-foreground transition-colors duration-300">{t("suppliers-order-notes")}</Label>
                <Textarea 
                  id="order-notes" 
                  placeholder={t("suppliers-order-notes-placeholder")}
                  className="min-h-[100px] resize-none border-input shadow-sm focus-visible:ring-primary focus-visible:border-primary transition-colors duration-300"
                />
              </motion.div>
            
              <motion.div 
                className="rounded-md border border-border p-4 bg-card shadow-sm transition-colors duration-300"
                initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }} // Reduced from 0.5, 0.3
              >
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground transition-colors duration-300">{t("suppliers-materials")}:</span>
                  <span className="font-medium text-foreground transition-colors duration-300">{orderMaterials.length} {t("suppliers-items")}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-muted-foreground transition-colors duration-300">{t("suppliers-total-quantity")}:</span>
                  <span className="font-medium text-foreground transition-colors duration-300">{orderMaterials.reduce((sum, m) => sum + m.quantity, 0)} {t("suppliers-units")}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-border transition-colors duration-300">
                  <span className="text-foreground transition-colors duration-300">{t("suppliers-estimated-total")}:</span>
                  <span className="text-primary text-lg transition-colors duration-300">
                    ${orderMaterials.reduce((sum, m) => sum + (m.price * m.quantity), 0).toFixed(2)}
                  </span>
                </div>
              </motion.div>
            </div>
            
            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => setIsPlaceOrderOpen(false)}
                className="border-border hover:bg-muted transition-colors duration-300"
              >
                {t("suppliers-cancel")}
              </Button>
              <Button 
                onClick={() => placeOrder(selectedSupplier.id, orderMaterials)}
                disabled={orderMaterials.length === 0 || orderMaterials.some(m => !m.name)}
                className="bg-green-600 hover:bg-green-700 text-white transition-colors duration-300"
              >
                {t("suppliers-order")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </ManufacturerLayout>
  );
};

// Component for statistics card with loading state
interface StatCardProps {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  bgColor: string;
}

const StatCard = ({ title, value, icon, isLoading = false, bgColor }: StatCardProps) => {
  return (
    <Card className="h-full bg-card border-border shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden">
      <CardHeader className="pb-0">
        <CardTitle className="text-sm font-medium flex items-center gap-2 text-foreground">
          <motion.div 
            className={`rounded-md ${bgColor} p-2 shadow-sm transition-colors duration-300`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.2 }}
          >
            {icon}
          </motion.div>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-8 w-24 mt-1 bg-muted" />
        ) : (
          <div className="text-2xl font-bold mt-2 flex items-baseline text-foreground">
            {value}
            {typeof value === 'number' && (
              <span className="text-xs font-medium ml-1.5 text-muted-foreground">
                {title.toLowerCase().includes('count') ? 'suppliers' : ''}
              </span>
            )}
          </div>
        )}
      </CardContent>
      <div className={`absolute bottom-0 left-0 w-full h-1.5 ${bgColor} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}></div>
    </Card>
  );
};

// SupplierCard component with animations and actions
interface SupplierCardProps {
  supplier: Supplier;
  onStatusChange: (id: string, status: "active" | "pending" | "inactive") => void;
  onSelectSupplier: (supplier: Supplier) => void;
  onViewDetails: () => void;
  onPlaceOrder: () => void;
  getStatusBadge: (status: string) => JSX.Element;
  prefersReducedMotion?: boolean;
}

const SupplierCard = ({ 
  supplier, 
  onStatusChange,
  onSelectSupplier,
  onViewDetails,
  onPlaceOrder,
  getStatusBadge,
  prefersReducedMotion = false
}: SupplierCardProps) => {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });
  const { toast } = useToast();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Status badge colors
  const statusColor = {
    active: isDark 
      ? "bg-emerald-900/30 text-emerald-300 border-emerald-800/60" 
      : "bg-emerald-50 text-emerald-700 border-emerald-200",
    pending: isDark 
      ? "bg-amber-900/30 text-amber-300 border-amber-800/60" 
      : "bg-amber-50 text-amber-700 border-amber-200",
    inactive: isDark 
      ? "bg-rose-900/30 text-rose-300 border-rose-800/60" 
      : "bg-rose-50 text-rose-700 border-rose-200",
  };

  // Background gradient based on status
  const cardBackground = {
    active: "bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/10 dark:to-transparent",
    pending: "bg-gradient-to-b from-amber-50/50 to-transparent dark:from-amber-950/10 dark:to-transparent",
    inactive: "bg-gradient-to-b from-rose-50/50 to-transparent dark:from-rose-950/10 dark:to-transparent",
  };

  return (
    <Card 
      ref={cardRef} 
      className={`h-full bg-card border-border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group ${cardBackground[supplier.status]}`}
    >
      <CardHeader className="pb-2 relative">
        <div className="flex justify-between items-start">
          <div className="flex gap-3 items-center">
            <Avatar className="h-12 w-12 rounded-md border-2 border-border/30 transition-colors duration-300 group-hover:border-primary/30 shadow-sm">
              <AvatarImage src={supplier.logoUrl} alt={supplier.name} />
              <AvatarFallback className="text-lg font-semibold text-primary/70 bg-primary/10 rounded-md">
                {supplier.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground mb-0.5 line-clamp-1 group-hover:text-primary transition-colors duration-300">
                {supplier.name}
              </CardTitle>
              <CardDescription className="mt-0 text-sm text-muted-foreground line-clamp-1 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                {supplier.location}
              </CardDescription>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span 
              className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${
                statusColor[supplier.status as keyof typeof statusColor]
              }`}
            >
              {supplier.status}
            </span>
            <span className="text-xs text-muted-foreground">
              Since {typeof supplier.yearEstablished === 'number' ? supplier.yearEstablished : ''}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mt-3 space-y-3 text-sm">
          <div className="flex justify-between items-center mb-1.5 text-sm">
            <span className="text-foreground font-medium">Reliability</span>
            <span className="font-semibold text-primary">{supplier.reliability}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div 
              className={`h-full rounded-full ${
                supplier.reliability > 85 ? "bg-emerald-500 dark:bg-emerald-400" :
                supplier.reliability > 70 ? "bg-amber-500 dark:bg-amber-400" : "bg-rose-500 dark:bg-rose-400"
              }`}
              initial={{ width: 0 }}
              animate={{ width: isInView ? `${supplier.reliability}%` : 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="line-clamp-1 text-xs">{supplier.email}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs">{supplier.phone}</span>
            </div>
          </div>
          
          {supplier.materials?.length > 0 && (
            <div className="pt-2 border-t border-border/40">
              <div className="text-xs font-medium text-foreground mb-2">Available Materials:</div>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {supplier.materials.slice(0, 3).map((material, i) => (
                  <motion.span 
                    key={i} 
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-background text-foreground border border-border shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }} // Changed from 0.8 to 0.9
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 + i * 0.03 }} // Reduced from 0.3, 0.3, 0.05
                  >
                    {material}
                  </motion.span>
                ))}
                {supplier.materials.length > 3 && (
                  <motion.span 
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border shadow-sm hover:bg-primary/5 hover:border-primary/30 transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }} // Changed from 0.8 to 0.9
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: 0.1 + 3 * 0.03 }} // Reduced from 0.3, 0.3, 0.05
                  >
                    +{supplier.materials.length - 3} more
                  </motion.span>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-3 border-t border-border/30 flex justify-between items-center w-full">
        <div className="text-xs text-muted-foreground">
          <span>{t("suppliers-lead-time")}: <span className="font-medium text-foreground">{supplier.leadTime}</span></span>
        </div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button 
            variant="outline" 
            size="sm" 
            className="border-border hover:bg-primary/10 hover:text-primary hover:border-primary text-foreground font-medium"
            onClick={onViewDetails}
          >
            {t("suppliers-view-details")}
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
};

// Supplier Card Skeleton for loading state
const SupplierCardSkeleton = () => {
  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Skeleton className="h-12 w-12 rounded-md bg-muted transition-colors duration-300" />
            <div>
              <Skeleton className="h-6 w-32 bg-muted transition-colors duration-300" />
              <Skeleton className="h-4 w-40 mt-1.5 bg-muted transition-colors duration-300" />
            </div>
          </div>
          <div className="flex items-end flex-col gap-2">
            <Skeleton className="h-5 w-16 rounded-full bg-muted transition-colors duration-300" />
            <Skeleton className="h-3 w-12 bg-muted transition-colors duration-300" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mt-3 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20 bg-muted transition-colors duration-300" />
            <Skeleton className="h-4 w-8 bg-muted transition-colors duration-300" />
          </div>
          
          <Skeleton className="h-2 w-full rounded-full bg-muted transition-colors duration-300" />
          
          <div className="grid grid-cols-2 gap-2 my-4">
            <Skeleton className="h-4 w-full bg-muted transition-colors duration-300" />
            <Skeleton className="h-4 w-full bg-muted transition-colors duration-300" />
          </div>
          
          <div className="pt-2 border-t border-border/40">
            <Skeleton className="h-4 w-32 mb-2 bg-muted transition-colors duration-300" />
            <div className="flex flex-wrap gap-1.5">
              <Skeleton className="h-5 w-16 rounded-md bg-muted transition-colors duration-300" />
              <Skeleton className="h-5 w-20 rounded-md bg-muted transition-colors duration-300" />
              <Skeleton className="h-5 w-14 rounded-md bg-muted transition-colors duration-300" />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-3 border-t border-border/30 flex justify-between">
        <Skeleton className="h-4 w-32 bg-muted transition-colors duration-300" />
        <Skeleton className="h-9 w-24 rounded bg-muted transition-colors duration-300" />
      </CardFooter>
    </Card>
  );
};

// Add Supplier Dialog Component
interface AddSupplierProps {
  onAdd: (supplier: Supplier) => void;
}

const AddSupplierDialog = ({ onAdd }: AddSupplierProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("raw materials");
  const [description, setDescription] = useState("");
  const [materialsInput, setMaterialsInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const prefersReducedMotion = useReducedMotion();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    const newErrors: Record<string, string> = {};
    if (!name) newErrors.name = t("suppliers-name-required");
    if (!contactPerson) newErrors.contactPerson = t("suppliers-contact-required");
    if (!email) newErrors.email = t("suppliers-email-required");
    if (!phone) newErrors.phone = t("suppliers-phone-required");
    if (!location) newErrors.location = t("suppliers-location-required");
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const materials = materialsInput
      .split(",")
      .map(m => m.trim())
      .filter(m => m.length > 0);
    
    const newSupplier: Supplier = {
      id: `supplier-${Date.now()}`,
      name,
      contactPerson,
      email,
      phone,
      address,
      location,
      category,
      description,
      materials,
      status: "pending",
      reliability: Math.floor(Math.random() * 20) + 70, // 70-90%
      leadTime: `${Math.floor(Math.random() * 7) + 1}-${Math.floor(Math.random() * 14) + 7} days`,
      lastOrder: "N/A",
      nextDelivery: "N/A",
      logoUrl: "",
      yearEstablished: Math.floor(Math.random() * 30) + 1990,
      contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      termsAndConditions: t("suppliers-standard-terms"),
      notes: ""
    };
    
    onAdd(newSupplier);
  };
  
  const getTransition = (delay = 0) => ({
    type: prefersReducedMotion ? "tween" : "spring",
    duration: prefersReducedMotion ? 0.1 : 0.3,
    delay,
    ease: "easeOut"
  });
  
  return (
    <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto no-scrollbar bg-background border-border shadow-lg">
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold text-foreground">{t("suppliers-add-new-supplier")}</DialogTitle>
        <DialogDescription className="text-muted-foreground">
          {t("suppliers-add-details")}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
          animate={{ opacity: 1, y: 0 }}
          transition={getTransition()}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-medium text-foreground transition-colors duration-300">
                {t("suppliers-supplier-name")} <span className="text-red-500 dark:text-red-400 transition-colors duration-300">*</span>
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("suppliers-supplier-name")}
                className={cn(
                  "bg-background border-input shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-colors duration-300",
                  errors.name ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                )}
              />
              {errors.name && <p className="text-red-600 dark:text-red-400 text-xs transition-colors duration-300">{errors.name}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category" className="font-medium text-foreground transition-colors duration-300">{t("suppliers-category")}</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="bg-background border-input shadow-sm transition-colors duration-300">
                  <SelectValue placeholder={t("suppliers-select-category")} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border transition-colors duration-300">
                  <SelectItem value="Grains & Cereals">Grains & Cereals</SelectItem>
                  <SelectItem value="Sweeteners">Sweeteners</SelectItem>
                  <SelectItem value="Nuts & Seeds">Nuts & Seeds</SelectItem>
                  <SelectItem value="Flavors & Extracts">Flavors & Extracts</SelectItem>
                  <SelectItem value="Packaging">Packaging</SelectItem>
                  <SelectItem value="Dairy">Dairy</SelectItem>
                  <SelectItem value="Herbs & Spices">Herbs & Spices</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
          animate={{ opacity: 1, y: 0 }}
          transition={getTransition(0.1)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactPerson" className="font-medium text-foreground transition-colors duration-300">
                {t("suppliers-contact-person")} <span className="text-red-500 dark:text-red-400 transition-colors duration-300">*</span>
              </Label>
              <Input
                id="contactPerson"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                placeholder={t("suppliers-contact-person")}
                className={cn(
                  "bg-background border-input shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-colors duration-300",
                  errors.contactPerson ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                )}
              />
              {errors.contactPerson && <p className="text-red-600 dark:text-red-400 text-xs transition-colors duration-300">{errors.contactPerson}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="font-medium text-foreground transition-colors duration-300">
                {t("suppliers-location")} <span className="text-red-500 dark:text-red-400 transition-colors duration-300">*</span>
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("suppliers-city-country")}
                className={cn(
                  "bg-background border-input shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-colors duration-300",
                  errors.location ? "border-red-500 focus-visible:ring-red-500" : "border-input"
                )}
              />
              {errors.location && <p className="text-red-600 dark:text-red-400 text-xs transition-colors duration-300">{errors.location}</p>}
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
          animate={{ opacity: 1, y: 0 }}
          transition={getTransition(0.2)}
        >
          <div className="space-y-2">
            <Label htmlFor="email" className="font-medium text-foreground transition-colors duration-300">
              {t("suppliers-email")} <span className="text-red-500 dark:text-red-400 transition-colors duration-300">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("suppliers-email")}
              className={cn(
                "bg-background border-input shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-colors duration-300",
                errors.email ? "border-red-500 focus-visible:ring-red-500" : "border-input"
              )}
            />
            {errors.email && <p className="text-red-600 dark:text-red-400 text-xs transition-colors duration-300">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="font-medium text-foreground transition-colors duration-300">
              {t("suppliers-phone")} <span className="text-red-500 dark:text-red-400 transition-colors duration-300">*</span>
            </Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("suppliers-phone")}
              className={cn(
                "bg-background border-input shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-colors duration-300",
                errors.phone ? "border-red-500 focus-visible:ring-red-500" : "border-input"
              )}
            />
            {errors.phone && <p className="text-red-600 dark:text-red-400 text-xs transition-colors duration-300">{errors.phone}</p>}
          </div>
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
          animate={{ opacity: 1, y: 0 }}
          transition={getTransition(0.3)}
        >
          <Label htmlFor="address" className="font-medium text-foreground transition-colors duration-300">{t("suppliers-address")}</Label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder={t("suppliers-address")}
            className="bg-background border-input shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-colors duration-300"
          />
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
          animate={{ opacity: 1, y: 0 }}
          transition={getTransition(0.4)}
        >
          <Label htmlFor="materialsInput" className="font-medium text-foreground transition-colors duration-300">{t("suppliers-materials-provided")}</Label>
          <Input
            id="materialsInput"
            value={materialsInput}
            onChange={(e) => setMaterialsInput(e.target.value)}
            placeholder={t("suppliers-materials-comma")}
            className="bg-background border-input shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-colors duration-300"
          />
          <p className="text-xs text-muted-foreground mt-1 transition-colors duration-300">{t("suppliers-materials-comma")}</p>
        </motion.div>
        
        <motion.div 
          className="space-y-2"
          initial={{ opacity: 0, y: 5 }} // Reduced from 10 to 5
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }} // Reduced from 0.5, 0.3
        >
          <Label htmlFor="description" className="font-medium text-foreground transition-colors duration-300">{t("suppliers-description")}</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t("suppliers-description")}
            className="min-h-[100px] resize-none bg-background border-input shadow-sm focus-visible:ring-primary/30 focus-visible:border-primary/30 transition-colors duration-300"
          />
        </motion.div>
        
        <DialogFooter className="mt-6 gap-2">
          <DialogClose asChild>
            <Button 
              type="button" 
              variant="outline"
              className="bg-background border-border hover:bg-muted transition-all duration-300 hover:shadow-sm"
            >
              {t("suppliers-cancel")}
            </Button>
          </DialogClose>
          <Button 
            type="submit"
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 hover:shadow-md"
          >
            {t("suppliers-add-supplier")}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default Suppliers;
