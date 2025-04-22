import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  ArrowUpDown, 
  Heart, 
  Info,
  ShoppingBag,
  CheckCircle2,
  ArrowRight,
  ChevronUp,
  ChevronDown,
  Package,
  Clock,
  Award,
  Trash2,
  Building2,
  Star
} from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
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
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductFavorites } from "@/contexts/ProductFavoriteContext";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

// Define the Product interface to match the data structure
interface Product {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  image: string;
  price: string;
  pricePerUnit?: number;
  rating: number;
  productType: string;
  description: string;
  minOrderQuantity: number;
  leadTime: string;
  leadTimeUnit?: string;
  sustainable: boolean;
  sku?: string;
  unitType?: string;
  currentAvailable?: number;
}

// Mock product data - in a real app, this would come from an API
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Organic Granola",
    category: "Breakfast Foods",
    manufacturer: "Nature's Best",
    image: "/placeholder.svg",
    price: "$4.99",
    pricePerUnit: 4.99,
    rating: 4.5,
    productType: "Finished Good",
    description: "Delicious organic granola made with whole grain oats, honey, and mixed nuts. Perfect for breakfast or as a healthy snack.",
    minOrderQuantity: 100,
    leadTime: "2-3",
    leadTimeUnit: "weeks",
    sustainable: true,
    sku: "ORG-GRA-001",
    unitType: "boxes",
    currentAvailable: 1200
  },
  {
    id: 2,
    name: "Premium Coffee Beans",
    category: "Beverages",
    manufacturer: "Mountain Roasters",
    image: "/placeholder.svg",
    price: "$12.99",
    pricePerUnit: 12.99,
    rating: 4.8,
    productType: "Finished Good",
    description: "Premium arabica coffee beans sourced from high-altitude farms. Medium roast with notes of chocolate and caramel.",
    minOrderQuantity: 50,
    leadTime: "1-2",
    leadTimeUnit: "weeks",
    sustainable: true,
    sku: "COF-BNS-002",
    unitType: "bags",
    currentAvailable: 500
  },
  {
    id: 3,
    name: "Almond Butter",
    category: "Spreads",
    manufacturer: "Pure Foods Co.",
    image: "/placeholder.svg",
    price: "$7.99",
    pricePerUnit: 7.99,
    rating: 4.2,
    productType: "Finished Good",
    description: "Creamy almond butter made from dry roasted almonds. No added sugar or preservatives.",
    minOrderQuantity: 75,
    leadTime: "2",
    leadTimeUnit: "weeks",
    sustainable: false,
    sku: "ALM-BTR-003",
    unitType: "jars",
    currentAvailable: 320
  },
  {
    id: 4,
    name: "Protein Bars",
    category: "Snacks",
    manufacturer: "Fitness Nutrition",
    image: "/placeholder.svg",
    price: "$2.49",
    pricePerUnit: 2.49,
    rating: 4.0,
    productType: "Finished Good",
    description: "High-protein bars with 20g of protein per serving. Great for post-workout recovery or a quick snack on the go.",
    minOrderQuantity: 200,
    leadTime: "1",
    leadTimeUnit: "week",
    sustainable: false,
    sku: "PRO-BAR-004",
    unitType: "units",
    currentAvailable: 1450
  },
  {
    id: 5,
    name: "Sparkling Water",
    category: "Beverages",
    manufacturer: "Clear Springs",
    image: "/placeholder.svg",
    price: "$1.29",
    pricePerUnit: 1.29,
    rating: 4.3,
    productType: "Finished Good",
    description: "Refreshing sparkling water with natural flavors. Zero calories, zero sweeteners, and zero sodium.",
    minOrderQuantity: 300,
    leadTime: "1-2",
    leadTimeUnit: "weeks",
    sustainable: true,
    sku: "SPK-WTR-005",
    unitType: "bottles",
    currentAvailable: 2400
  },
  {
    id: 6,
    name: "Dried Fruit Mix",
    category: "Snacks",
    manufacturer: "Harvest Farms",
    image: "/placeholder.svg",
    price: "$5.49",
    pricePerUnit: 5.49,
    rating: 4.6,
    productType: "Finished Good",
    description: "A delicious mix of organic dried fruits, including apples, cranberries, and mangoes. Perfect for snacking or baking.",
    minOrderQuantity: 100,
    leadTime: "1-3",
    leadTimeUnit: "weeks",
    sustainable: true,
    sku: "DRY-FRT-006",
    unitType: "packages",
    currentAvailable: 800
  }
];

// Category options
const categories = [
  "All Categories",
  "Breakfast Foods",
  "Beverages",
  "Snacks",
  "Spreads",
  "Condiments",
  "Dairy & Alternatives",
  "Baking"
];

// Product Type options
const productTypes = [
  "Finished Good",
  "Raw Material",
  "Component",
  "Packaging Material",
  "Semi-finished Good",
  "Bulk Product"
];

// Sort options
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Rating" }
];

// Enhanced animation variants with better physics and timing
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.2, 
      ease: "easeOut" 
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
      duration: 0.2 
    } 
  }
};

// Filter animations - optimized for faster transitions
const filterVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: "auto", 
    transition: { 
      height: { type: "spring", stiffness: 400, damping: 25 },
      opacity: { duration: 0.15 }
    } 
  },
  exit: { 
    opacity: 0, 
    height: 0, 
    transition: { 
      height: { duration: 0.15 },
      opacity: { duration: 0.1 }
    } 
  }
};

// Button hover animations
const buttonHoverVariants = {
  rest: { scale: 1 },
  hover: { 
    scale: 1.05, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    } 
  },
  tap: { scale: 0.95 }
};

// Badge animations
const badgeVariants = {
  rest: { scale: 1, opacity: 0.9 },
  hover: { 
    scale: 1.05, 
    opacity: 1, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    } 
  },
  tap: { scale: 0.95 }
};

// Page transitions
const pageTransition = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      duration: 0.4 
    } 
  },
  exit: { 
    opacity: 0, 
    y: 20, 
    transition: { 
      duration: 0.2 
    } 
  }
};

// Dialog animations - optimized for faster transitions
const dialogContentVariants = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0, 
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 25,
      duration: 0.2 
    } 
  },
  exit: { 
    opacity: 0, 
    scale: 0.98, 
    y: 8, 
    transition: { 
      duration: 0.15 
    } 
  }
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState(mockProducts);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [selectedProductTypes, setSelectedProductTypes] = useState<string[]>([]);
  const [activeView, setActiveView] = useState("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("relevance");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [sustainableOnly, setSustainableOnly] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
  const [minOrder, setMinOrder] = useState<number>(50);
  const [selectedLeadTime, setSelectedLeadTime] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [selectedManufacturers, setSelectedManufacturers] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [hasCustomization, setHasCustomization] = useState(false);
  const [hasSamples, setHasSamples] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  const {
    favorites: favoritedProducts,
    isFavorite,
    toggleFavorite
  } = useProductFavorites();

  // Page title effect
  useEffect(() => {
    document.title = "Browse Products - CPG Matchmaker";
  }, []);

  // Further optimize loading state to possibly skip showing skeletons
  useEffect(() => {
    // If we have cached products already, skip the loading state entirely
    if (mockProducts.length > 0 && products.length > 0) {
      setIsLoading(false);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 200); // Further reduce to 200ms for faster display
    
    return () => clearTimeout(timer);
  }, []);

  // Update search params when search term changes
  useEffect(() => {
    if (searchTerm) {
      searchParams.set("q", searchTerm);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  }, [searchTerm, searchParams, setSearchParams]);

  // Check for product ID in URL params
  useEffect(() => {
    if (searchParams.get("productId") && !isLoading) {
      const productId = parseInt(searchParams.get("productId") || "0");
      const product = mockProducts.find(p => p.id === productId);
      if (product) {
        handleProductDetailsClick(product);
      }
    }

    // View favorites if that view is requested  
    if (searchParams.get("view") === "favorites") {
      // Set page title for favorites view
      document.title = "My Favorites - CPG Matchmaker";
    }
  }, [searchParams, isLoading]);

  // Filter and sort products
  useEffect(() => {
    let filteredProducts = [...mockProducts];

    if (searchParams.get("view") === "favorites") {
      filteredProducts = filteredProducts.filter(product => 
        isFavorite(product.id)
      );
    } else {
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

      // Filter by rating
      if (minRating > 0) {
        filteredProducts = filteredProducts.filter(product => 
          product.rating >= minRating
        );
      }

      // Filter by price range
      filteredProducts = filteredProducts.filter(product => {
        const price = parseFloat(product.price.replace('$', ''));
        return price >= priceRange[0] && (priceRange[1] === 100 ? true : price <= priceRange[1]);
      });

      // Filter by lead time
      if (selectedLeadTime.length > 0) {
        filteredProducts = filteredProducts.filter(product =>
          selectedLeadTime.some(time => product.leadTime.includes(time.split(' ')[0]))
        );
      }

    // Filter by category
    if (activeCategory !== "All Categories") {
      filteredProducts = filteredProducts.filter(
        product => product.category === activeCategory
      );
    }

    // Filter by productType
    if (selectedProductTypes.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedProductTypes.includes(product.productType)
      );
    }

    // Filter by sustainability
    if (sustainableOnly) {
      filteredProducts = filteredProducts.filter(product => product.sustainable);
    }

    // Filter by stock status (mock data - you would need to add this to your product data)
    if (inStockOnly) {
      filteredProducts = filteredProducts.filter(product => product.minOrderQuantity <= 100);
    }

    // Filter by new arrivals (mock data - you would need to add this to your product data)
    if (newArrivalsOnly) {
      filteredProducts = filteredProducts.filter(product => product.id > 4);
    }
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filteredProducts.sort((a, b) => 
          parseFloat(a.price.replace('$', '')) - parseFloat(b.price.replace('$', ''))
        );
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => 
          parseFloat(b.price.replace('$', '')) - parseFloat(a.price.replace('$', ''))
        );
        break;
      case "rating":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // Default is relevance
        break;
    }

    setProducts(filteredProducts);
  }, [searchTerm, activeCategory, selectedProductTypes, sortBy, sustainableOnly, 
      searchParams, isFavorite, priceRange, minOrder, selectedLeadTime, inStockOnly, newArrivalsOnly, minRating]);

  // Toggle productType selection
  const toggleProductType = (type: string) => {
    setSelectedProductTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type) 
        : [...prev, type]
    );
  };

  // Clear all filters including advanced filters
  const clearFilters = () => {
    setActiveCategory("All Categories");
    setSelectedProductTypes([]);
    setSearchTerm("");
    setSustainableOnly(false);
    setPriceRange([0, 100]);
    setMinOrder(50);
    setSelectedLeadTime([]);
    setInStockOnly(false);
    setNewArrivalsOnly(false);
    setMinRating(0);
    setSelectedManufacturers([]);
    setSelectedOrigins([]);
    setHasCustomization(false);
    setHasSamples(false);
  };

  // Handle product details click
  const handleProductDetailsClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductDetails(true);
  };

  // Apply advanced filters
  const applyAdvancedFilters = () => {
    setShowAdvancedSearch(false);
  };

  // Render product list based on view type
  const renderProducts = () => {
    if (isLoading) {
      // If we already have products, show them immediately instead of skeletons
      if (products.length > 0) {
        setIsLoading(false);
        return renderLoadedProducts();
      }
      
      return (
        <motion.div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[...Array(6)].map((_, idx) => (
            <motion.div 
              key={idx} 
              variants={cardVariants}
              className="relative overflow-hidden"
            >
              <div className="rounded-lg overflow-hidden border group hover:border-primary/20 transition-all duration-300">
                <Skeleton className="h-48 w-full animate-pulse" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2 animate-pulse" />
                  <Skeleton className="h-4 w-1/2 mb-4 animate-pulse" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-16 animate-pulse" />
                    <Skeleton className="h-5 w-16 animate-pulse" />
                  </div>
                  <Skeleton className="h-4 w-28 mb-2 animate-pulse" />
                  <div className="flex justify-between mt-3">
                    <Skeleton className="h-6 w-12 animate-pulse" />
                    <Skeleton className="h-6 w-24 animate-pulse" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }
    
    return renderLoadedProducts();
  };

  // Extract the loaded products rendering to a separate function for clarity
  const renderLoadedProducts = () => {
    if (products.length === 0) {
      return (
        <motion.div 
          className="text-center py-20 bg-muted/30 rounded-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            type: "spring",
            stiffness: 400,
            damping: 25,
            duration: 0.3 
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ 
              scale: 1,
              transition: { 
                type: "spring", 
                stiffness: 400, 
                damping: 10 
              }
            }}
          >
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
          </motion.div>
          <motion.p 
            className="text-xl font-medium text-foreground/70 mb-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            No products found matching your criteria.
          </motion.p>
          <motion.p 
            className="text-sm text-muted-foreground mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Try adjusting your filters or search terms.
          </motion.p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button 
              variant="outline" 
              onClick={clearFilters}
              className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              Clear All Filters
            </Button>
          </motion.div>
        </motion.div>
      );
    }

    if (activeView === "grid") {
      return (
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {products.map(product => (
              <motion.div 
                key={product.id} 
                variants={cardVariants}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25,
                  duration: 0.2 
                }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)", 
                  transition: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  } 
                }}
              >
                <ProductCard 
                  product={product} 
                  isFavorite={isFavorite(product.id)}
                  onFavoriteToggle={() => toggleFavorite(product)}
                  onDetailsClick={() => handleProductDetailsClick(product)}
                  className="h-full transition-all duration-300"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      );
    } else {
      return (
        <motion.div 
          className="space-y-4"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence mode="popLayout">
            {products.map(product => (
              <motion.div 
                key={product.id} 
                variants={cardVariants}
                layout
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: 10 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 25,
                  duration: 0.2 
                }}
                whileHover={{ 
                  y: -2, 
                  boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.08)",
                  transition: { 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25 
                  } 
                }}
                className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:border-primary/20 transition-all bg-card"
              >
                <motion.div 
                  className="w-full sm:w-32 h-32 bg-muted rounded-md flex items-center justify-center relative group overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <motion.img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-16 h-16 object-contain"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                  {product.sustainable && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.div 
                            className="absolute top-2 left-2 bg-green-100 text-green-800 rounded-full p-1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </motion.div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Sustainable Product</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </motion.div>
                
                <div className="flex-1">
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-foreground/70">{product.manufacturer}</p>
                    </div>
                    <div className="flex gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        onClick={() => toggleFavorite(product)}
                        className={`p-2 rounded-full ${isFavorite(product.id) ? "text-red-500" : "text-muted-foreground"}`}
                      >
                        <Heart className="h-4 w-4" fill={isFavorite(product.id) ? "currentColor" : "none"} />
                      </motion.button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 mb-2 mt-1">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Badge>{product.category}</Badge>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <Badge variant="outline">{product.productType}</Badge>
                    </motion.div>
                    <span className="text-sm text-foreground/70">
                      Min. Order: {product.minOrderQuantity} units
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-foreground/70">
                      Lead Time: {product.leadTime} {product.leadTimeUnit}
                    </span>
                    <span className="text-sm text-foreground/70">
                      Rating: {product.rating}/5
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-medium text-lg">{product.price}</p>
                    <div className="flex gap-2">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleProductDetailsClick(product)}
                          className="transition-all duration-200 hover:bg-muted/80"
                        >
                          Details
                        </Button>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                      >
                        <Button 
                          size="sm"
                          className="transition-all duration-200"
                        >
                          Match
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      );
    }
  };

  // Add effect for scroll position detection
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 pt-24 pb-12"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 30,
          duration: 0.3 
        }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants}>
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-300%">
                Browse Products
              </h1>
              <p className="text-foreground/70">
                Discover the perfect products for your CPG business
              </p>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap items-center gap-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={cardVariants}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2 transition-all duration-200"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                      Sort: {sortOptions.find(option => option.value === sortBy)?.label}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="animate-in slide-in-from-top-5 duration-200">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {sortOptions.map(option => (
                      <DropdownMenuItem 
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={sortBy === option.value ? "bg-muted" : ""}
                      >
                        {option.label}
                        {sortBy === option.value && (
                          <CheckCircle2 className="h-4 w-4 ml-2" />
                        )}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 transition-all duration-200"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {(selectedProductTypes.length > 0 || activeCategory !== "All Categories" || sustainableOnly) && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ 
                        scale: 1,
                        transition: {
                          type: "spring",
                          stiffness: 500,
                          damping: 15
                        }  
                      }}
                    >
                      <Badge variant="secondary" className="ml-1">
                        {selectedProductTypes.length + (activeCategory !== "All Categories" ? 1 : 0) + (sustainableOnly ? 1 : 0)}
                      </Badge>
                    </motion.div>
                  )}
                </Button>
              </motion.div>
              
              <motion.div variants={cardVariants}>
                <Tabs defaultValue={activeView} onValueChange={setActiveView} className="w-auto">
                  <TabsList className="grid w-[120px] grid-cols-2">
                    <TabsTrigger 
                      value="grid"
                      className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      Grid
                    </TabsTrigger>
                    <TabsTrigger 
                      value="list"
                      className="transition-all duration-200 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      List
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mb-8 relative"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products, manufacturers, or categories..."
                className="pl-10 pr-24 w-full transition-all duration-300 focus:border-primary"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-20 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className={cn(
                  "absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors duration-200",
                  showAdvancedSearch ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Advanced
              </Button>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {showAdvancedSearch && (
              <motion.div
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ 
                  opacity: 1, 
                  height: "auto", 
                  transition: { 
                    duration: 0.3,
                    height: { duration: 0.3 }
                  } 
                }}
                exit={{ 
                  opacity: 0, 
                  height: 0,
                  transition: { 
                    duration: 0.2,
                    height: { duration: 0.2 }
                  }
                }}
                className="mb-6 bg-card border rounded-lg p-6 space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Price Range */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-green-500" />
                      Price Range ($)
                    </label>
                    <div className="pt-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-green-600">${priceRange[0]}</span>
                        <Slider
                          defaultValue={[0, 100]}
                          min={0}
                          max={100}
                          step={1}
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-green-500 [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-colors [&_[role=slider]]:hover:border-green-400"
                        />
                        <span className="text-sm font-medium text-green-600">${priceRange[1]}+</span>
                      </div>
                    </div>
                  </div>

                  {/* Min Order */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      Min Order
                    </label>
                    <div className="pt-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-blue-600">{minOrder}</span>
                        <Slider
                          defaultValue={[50]}
                          min={0}
                          max={500}
                          step={10}
                          value={[minOrder]}
                          onValueChange={(value) => setMinOrder(value[0])}
                          className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-md"
                        />
                        <span className="text-sm font-medium text-blue-600">500+</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      Min Rating
                    </label>
                    <div className="pt-2">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-yellow-600">{minRating}</span>
                        <Slider
                          defaultValue={[0]}
                          min={0}
                          max={5}
                          step={0.5}
                          value={[minRating]}
                          onValueChange={(value) => setMinRating(value[0])}
                          className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-yellow-500"
                        />
                        <span className="text-sm font-medium text-yellow-600">5</span>
                      </div>
                    </div>
                  </div>

                  {/* Lead Time */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-500" />
                      Lead Time
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["1-2 weeks", "2-4 weeks", "4-8 weeks", "8+ weeks"].map((time) => (
                        <Badge
                          key={time}
                          variant={selectedLeadTime.includes(time) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-colors",
                            selectedLeadTime.includes(time)
                              ? "bg-purple-500 hover:bg-purple-600"
                              : "hover:bg-purple-100"
                          )}
                          onClick={() => {
                            setSelectedLeadTime(prev =>
                              prev.includes(time)
                                ? prev.filter(t => t !== time)
                                : [...prev, time]
                            );
                          }}
                        >
                          {time}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Additional options */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Product Options</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="inStock" 
                          checked={inStockOnly}
                          onCheckedChange={setInStockOnly}
                        />
                        <label htmlFor="inStock" className="text-sm cursor-pointer">In Stock Only</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="newArrivals" 
                          checked={newArrivalsOnly}
                          onCheckedChange={setNewArrivalsOnly}
                        />
                        <label htmlFor="newArrivals" className="text-sm cursor-pointer">New Arrivals</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="samples" 
                          checked={hasSamples}
                          onCheckedChange={setHasSamples}
                        />
                        <label htmlFor="samples" className="text-sm cursor-pointer">Has Samples</label>
                      </div>
                    </div>
                  </div>

                  {/* Customization */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Additional Features</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="customization" 
                          checked={hasCustomization}
                          onCheckedChange={setHasCustomization}
                        />
                        <label htmlFor="customization" className="text-sm cursor-pointer">Offers Customization</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch 
                          id="sustainable" 
                          checked={sustainableOnly}
                          onCheckedChange={setSustainableOnly}
                        />
                        <label htmlFor="sustainable" className="text-sm cursor-pointer">Sustainable Only</label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Reset Filters
                  </Button>
                  <Button
                    onClick={applyAdvancedFilters}
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Active filters with enhanced animations */}
          <AnimatePresence>
            {(selectedProductTypes.length > 0 || activeCategory !== "All Categories" || sustainableOnly) && (
              <motion.div 
                className="mb-6 flex flex-wrap items-center gap-2"
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ 
                  duration: 0.2, 
                  height: { duration: 0.15 },
                  opacity: { duration: 0.2 }
                }}
              >
                <span className="text-sm text-foreground/70">Active filters:</span>
                
                {activeCategory !== "All Categories" && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 animate-fadeIn">
                      {activeCategory}
                      <motion.button 
                        onClick={() => setActiveCategory("All Categories")}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  </motion.div>
                )}
                
                {selectedProductTypes.map(type => (
                  <motion.div
                    key={type}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 animate-fadeIn">
                      {type}
                      <motion.button 
                        onClick={() => toggleProductType(type)}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  </motion.div>
                ))}
                
                {sustainableOnly && (
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 animate-fadeIn bg-green-100 text-green-800 hover:bg-green-200">
                      Sustainable Only
                      <motion.button 
                        onClick={() => setSustainableOnly(false)}
                        whileTap={{ scale: 0.9 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  </motion.div>
                )}
                
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                    Clear all
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Filter sidebar and product grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filter sidebar - always shown on desktop, conditionally on mobile */}
            <AnimatePresence>
            {showFilters && (
                <motion.div
                  className="md:col-span-1 space-y-6 bg-card p-4 rounded-lg shadow-sm border"
                  initial={{ opacity: 0, x: -15, boxShadow: "0 0 0 rgba(0,0,0,0)" }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                    transition: { 
                      type: "spring", 
                      stiffness: 400, 
                      damping: 25,
                      duration: 0.15
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -15, 
                    transition: { 
                      duration: 0.1 
                    }
                  }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold flex items-center gap-2">
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                    </h3>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="md:hidden"
                        onClick={() => setShowFilters(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        delay: 0.1,
                        duration: 0.2
                      }
                    }}
                    className="space-y-1 border-t pt-4"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <h4 className="text-sm font-medium">Sustainability</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={sustainableOnly ? "default" : "outline"}
                          size="sm"
                          className={`py-1 px-3 h-auto text-xs transition-all duration-200 ${sustainableOnly ? "bg-green-600 text-white hover:bg-green-700" : ""}`}
                          onClick={() => setSustainableOnly(!sustainableOnly)}
                        >
                          Sustainable Only
                        </Button>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        delay: 0.2,
                        duration: 0.2
                      }
                    }}
                    className="border-t pt-4"
                  >
                    <h4 className="text-sm font-medium mb-2 flex justify-between items-center">
                      <span>Categories</span>
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    </h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {categories.map((category, index) => (
                        <motion.div 
                          key={category} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ 
                            opacity: 1, 
                            x: 0,
                            transition: {
                              delay: 0.05 * index,
                              duration: 0.2
                            }
                          }}
                        >
                          <Button
                            variant={activeCategory === category ? "secondary" : "ghost"}
                            size="sm"
                            className={cn(
                              "w-full justify-start text-sm h-8 transition-all duration-200",
                              activeCategory === category && "bg-primary/10 text-primary font-medium"
                            )}
                            onClick={() => setActiveCategory(category)}
                          >
                            {category}
                          </Button>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      transition: {
                        delay: 0.3,
                        duration: 0.2
                      }
                    }}
                    className="border-t pt-4"
                  >
                    <h4 className="text-sm font-medium mb-2 flex justify-between items-center">
                      <span>Product Types</span>
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {productTypes.map((type, index) => (
                        <motion.div 
                          key={type}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ 
                            opacity: 1, 
                            scale: 1,
                            transition: {
                              delay: 0.05 * index,
                              duration: 0.2
                            }
                          }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Badge
                            variant={selectedProductTypes.includes(type) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-colors duration-200",
                              selectedProductTypes.includes(type) 
                                ? "bg-primary/10 text-primary hover:bg-primary/20" 
                                : "hover:bg-muted"
                            )}
                            onClick={() => toggleProductType(type)}
                          >
                            {type}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-4 hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                      onClick={clearFilters}
                    >
                      Clear All Filters
                    </Button>
                  </motion.div>
                </motion.div>
            )}
            </AnimatePresence>
            
            {/* Products grid */}
            <div className={`${showFilters ? 'md:col-span-3' : 'md:col-span-4'}`}>
              <Tabs value={activeView} className="w-full">
                <TabsContent value="grid" className="m-0">
                  {renderProducts()}
                </TabsContent>
                
                <TabsContent value="list" className="m-0">
                  {renderProducts()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Product Details Dialog */}
      <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
        <DialogContent className="sm:max-w-2xl overflow-hidden">
          <motion.div
            variants={dialogContentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {selectedProduct && (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <DialogHeader>
                    <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>
                    <DialogDescription>
                      By {selectedProduct.manufacturer}
                    </DialogDescription>
                  </DialogHeader>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <motion.div 
                    className="md:col-span-1 bg-muted rounded-lg p-4 flex items-center justify-center overflow-hidden"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                      duration: 0.4 
                    }}
                  >
                    <motion.img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      className="w-32 h-32 object-contain"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                        damping: 20
                      }}
                      whileHover={{ 
                        scale: 1.1,
                        transition: { 
                          type: "spring", 
                          stiffness: 300, 
                          damping: 25 
                        }
                      }}
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="md:col-span-2 space-y-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <motion.p 
                      className="text-foreground/80"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      {selectedProduct.description}
                    </motion.p>
                    
                    <motion.div 
                      className="grid grid-cols-2 gap-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <p className="text-sm text-foreground/70">Price</p>
                        <p className="font-semibold text-lg">{selectedProduct.price}</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <p className="text-sm text-foreground/70">Category</p>
                        <p className="font-medium">{selectedProduct.category}</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <p className="text-sm text-foreground/70">Minimum Order</p>
                        <p className="font-medium">{selectedProduct.minOrderQuantity} {selectedProduct.unitType || 'units'}</p>
                      </motion.div>
                      <motion.div 
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      >
                        <p className="text-sm text-foreground/70">Lead Time</p>
                        <p className="font-medium">{selectedProduct.leadTime} {selectedProduct.leadTimeUnit}</p>
                      </motion.div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div>
                        <p className="text-sm text-foreground/70 mb-1">Product Type</p>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        >
                          <Badge variant="secondary">
                            {selectedProduct.productType}
                          </Badge>
                        </motion.div>
                      </div>
                      
                      {selectedProduct.sku && (
                        <div>
                          <p className="text-sm text-foreground/70 mb-1">SKU</p>
                          <p className="font-medium text-sm">{selectedProduct.sku}</p>
                        </div>
                      )}
                    </motion.div>
                    
                    {selectedProduct.currentAvailable !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 }}
                      >
                        <p className="text-sm text-foreground/70 mb-1">Availability</p>
                        <Progress 
                          value={(selectedProduct.currentAvailable / (selectedProduct.minOrderQuantity * 3)) * 100}
                          className="h-2 mb-1"
                        />
                        <p className="text-sm">
                          {selectedProduct.currentAvailable} {selectedProduct.unitType || 'units'} available
                        </p>
                      </motion.div>
                    )}
                    
                    {selectedProduct.sustainable && (
                      <motion.div 
                        className="flex items-center gap-2 text-green-600 font-medium"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 }}
                        whileHover={{ scale: 1.02, x: 2 }}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                        <span>Sustainable Product</span>
                      </motion.div>
                    )}
                  </motion.div>
                </div>
                
                <motion.div 
                  className="flex justify-between items-center mt-4 pt-4 border-t"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => toggleFavorite(selectedProduct)}
                      className="transition-all duration-200"
                    >
                      <Heart 
                        className="h-4 w-4 mr-2" 
                        fill={isFavorite(selectedProduct.id) ? "currentColor" : "none"} 
                      />
                      {isFavorite(selectedProduct.id) ? "Saved" : "Save"}
                    </Button>
                  </motion.div>
                  
                  <div className="flex gap-2">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Button 
                        variant="outline" 
                        onClick={() => setShowProductDetails(false)}
                        className="transition-all duration-200"
                      >
                        Close
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Button className="gap-1 transition-all duration-200">
                        Find Match
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                </motion.div>
              </>
            )}
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Add custom keyframes for animations */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out forwards;
        }
        
        .animate-pulse {
          animation: pulse 1.5s infinite;
        }
        `}
      </style>

      {/* Add back-to-top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <motion.button
              className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ChevronUp className="h-5 w-5" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Products;