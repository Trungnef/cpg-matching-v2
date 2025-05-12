import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ManufacturerCard from "@/components/ManufacturerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";
import { 
  Search, 
  Filter, 
  MapPin, 
  X, 
  SlidersHorizontal, 
  Heart,
  Scale,
  ArrowUpDown,
  Star,
  Calendar,
  Building,
  Trash2,
  Mail,
  Building2,
  Award,
  Package,
  Clock,
  Users,
  Factory,
  Globe2,
  ShieldCheck,
  Microscope,
  Paintbrush,
  Tag,
  Store,
  Settings2,
  ChevronUp
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useManufacturerFavorites } from "@/contexts/ManufacturerFavoriteContext";
import { useManufacturerCompare } from "@/contexts/ManufacturerCompareContext";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ManufacturerDetails from "@/components/ManufacturerDetails";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

interface Manufacturer {
  id: number;
  name: string;
  location: string;
  logo: string;
  categories: string[];
  certifications: string[];
  minOrderSize: string;
  establishedYear: number;
  rating: number;
}

// Mock manufacturer data - in a real app, this would come from an API
const mockManufacturers: Manufacturer[] = [
  {
    id: 1,
    name: "Nature's Best Foods",
    location: "Portland, Oregon",
    logo: "/placeholder.svg",
    categories: ["Snacks", "Breakfast Foods"],
    certifications: ["Organic", "Non-GMO", "Gluten-Free"],
    minOrderSize: "1,000 units",
    establishedYear: 2008,
    rating: 4.8
  },
  {
    id: 2,
    name: "Pure Foods Co.",
    location: "Austin, Texas",
    logo: "/placeholder.svg",
    categories: ["Spreads", "Condiments"],
    certifications: ["Organic", "Non-GMO"],
    minOrderSize: "5,000 units",
    establishedYear: 2012,
    rating: 4.5
  },
  {
    id: 3,
    name: "Mountain Roasters",
    location: "Seattle, Washington",
    logo: "/placeholder.svg",
    categories: ["Beverages"],
    certifications: ["Fair Trade", "Organic"],
    minOrderSize: "2,500 units",
    establishedYear: 2005,
    rating: 4.9
  },
  {
    id: 4,
    name: "Fitness Nutrition",
    location: "Los Angeles, California",
    logo: "/placeholder.svg",
    categories: ["Protein Products", "Health Foods"],
    certifications: ["Gluten-Free", "High-Protein"],
    minOrderSize: "10,000 units",
    establishedYear: 2015,
    rating: 4.2
  },
  {
    id: 5,
    name: "Clear Springs Beverage Co.",
    location: "Denver, Colorado",
    logo: "/placeholder.svg",
    categories: ["Beverages", "Water"],
    certifications: ["BPA-Free"],
    minOrderSize: "25,000 units",
    establishedYear: 2010,
    rating: 4.6
  },
  {
    id: 6,
    name: "Harvest Farms Products",
    location: "Chicago, Illinois",
    logo: "/placeholder.svg",
    categories: ["Snacks", "Dried Goods"],
    certifications: ["Organic", "No Added Sugar"],
    minOrderSize: "3,000 units",
    establishedYear: 2007,
    rating: 4.7
  }
];

// Category options
const categories = [
  "All Categories",
  "Beverages",
  "Breakfast Foods",
  "Condiments",
  "Dried Goods",
  "Health Foods",
  "Protein Products",
  "Snacks",
  "Spreads",
  "Water"
];

// Certification options
const certifications = [
  "Organic",
  "Non-GMO",
  "Gluten-Free",
  "Fair Trade",
  "No Added Sugar",
  "High-Protein",
  "BPA-Free"
];

// Locations
const locations = [
  "All Locations",
  "Portland, Oregon",
  "Austin, Texas",
  "Seattle, Washington",
  "Los Angeles, California",
  "Denver, Colorado",
  "Chicago, Illinois"
];

// Sort options
const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "rating-desc", label: "Highest Rating" },
  { value: "rating-asc", label: "Lowest Rating" },
  { value: "established-desc", label: "Newest First" },
  { value: "established-asc", label: "Oldest First" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" }
];

// Enhanced animation variants with smoother physics
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
      ease: "easeOut"
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 25,
      duration: 0.3
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.3,
      ease: "easeOut"
    } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
      ease: "easeOut"
    }
  }
};

// New animation variants for modern UI
const cardHoverAnimation = {
  rest: { 
    scale: 1,
    y: 0,
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.05)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  hover: { 
    scale: 1.02,
    y: -5,
    boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  tap: { 
    scale: 0.98,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const buttonAnimation = {
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

const badgeAnimation = {
  rest: { scale: 1, backgroundColor: "transparent" },
  hover: { 
    scale: 1.05,
    backgroundColor: "var(--primary-light)",
    transition: {
      duration: 0.2
    }
  },
  tap: { scale: 0.95 }
};

// Page transitions for smoother navigation
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

const Manufacturers = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [originalManufacturers] = useState<Manufacturer[]>(mockManufacturers);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>(mockManufacturers);
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeLocation, setActiveLocation] = useState("All Locations");
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("relevance");
  const [ratingRange, setRatingRange] = useState([0, 5]);
  const [yearRange, setYearRange] = useState([2000, new Date().getFullYear()]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { favorites, toggleFavorite } = useManufacturerFavorites();
  const { compareItems, toggleCompare, clearCompare } = useManufacturerCompare();
  const [showCompareSheet, setShowCompareSheet] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showFavoritesSheet, setShowFavoritesSheet] = useState(false);
  const [locationFilter, setLocationFilter] = useState<string[]>([]);
  const [establishedYearRange, setEstablishedYearRange] = useState([1950, 2024]);
  const [minOrderRange, setMinOrderRange] = useState([0, 10000]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [leadTimeFilter, setLeadTimeFilter] = useState<string[]>([]);
  const [specialCertifications, setSpecialCertifications] = useState<string[]>([]);
  const [revenueRange, setRevenueRange] = useState([1, 100]);
  const [employeeRange, setEmployeeRange] = useState([10, 1000]);
  const [capacityRange, setCapacityRange] = useState([1000, 100000]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>([]);
  const [selectedStandards, setSelectedStandards] = useState<string[]>([]);
  const [hasRandD, setHasRandD] = useState(false);
  const [hasPrivateLabel, setHasPrivateLabel] = useState(false);
  const [hasOEM, setHasOEM] = useState(false);
  const [hasDesign, setHasDesign] = useState(false);
  const [hasTradeShows, setHasTradeShows] = useState(false);
  const [hasSamples, setHasSamples] = useState(false);

  // Add new state for scroll-to-top button
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Page title effect
  useEffect(() => {
    document.title = "Manufacturers - CPG Matchmaker";
  }, []);

  // Update search params and check for manufacturer ID
  useEffect(() => {
    const manufacturerId = searchParams.get("id");
    if (manufacturerId) {
      const manufacturer = manufacturers.find(m => m.id === parseInt(manufacturerId));
      if (manufacturer) {
        setSelectedManufacturer(manufacturer);
        setShowDetails(true);
      }
    }

    if (searchTerm) {
      searchParams.set("q", searchTerm);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  }, [searchTerm, searchParams, setSearchParams, manufacturers]);

  // Update filter and sort manufacturers
  useEffect(() => {
    // Check for favorites query parameter
    const showFavorites = searchParams.get("favorites") === "true";
    if (showFavorites) {
      setShowFavoritesOnly(true);
    }
  }, [searchParams]);

  useEffect(() => {
    let filteredManufacturers = [...originalManufacturers];

    // Filter by favorites
    if (showFavoritesOnly) {
      filteredManufacturers = filteredManufacturers.filter(
        m => favorites.some(f => f.id === m.id)
      );
    }

    // Apply other filters only if not showing favorites only or if there are favorites to filter
    if (!showFavoritesOnly || (showFavoritesOnly && filteredManufacturers.length > 0)) {
    // Filter by search term
    if (searchTerm) {
      filteredManufacturers = filteredManufacturers.filter(
        manufacturer => 
          manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manufacturer.categories.some(category => 
            category.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          manufacturer.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory !== "All Categories") {
      filteredManufacturers = filteredManufacturers.filter(
        manufacturer => manufacturer.categories.includes(activeCategory)
      );
    }

    // Filter by location
    if (activeLocation !== "All Locations") {
      filteredManufacturers = filteredManufacturers.filter(
        manufacturer => manufacturer.location === activeLocation
      );
    }

    // Filter by certifications
    if (selectedCertifications.length > 0) {
      filteredManufacturers = filteredManufacturers.filter(manufacturer => 
        selectedCertifications.every(cert => 
          manufacturer.certifications.includes(cert)
        )
      );
      }

      // Filter by rating range
      filteredManufacturers = filteredManufacturers.filter(
        m => m.rating >= ratingRange[0] && m.rating <= ratingRange[1]
      );

      // Filter by year range
      filteredManufacturers = filteredManufacturers.filter(
        m => m.establishedYear >= yearRange[0] && m.establishedYear <= yearRange[1]
      );

      // Sort manufacturers
      switch (sortBy) {
        case "rating-desc":
          filteredManufacturers.sort((a, b) => b.rating - a.rating);
          break;
        case "rating-asc":
          filteredManufacturers.sort((a, b) => a.rating - b.rating);
          break;
        case "established-desc":
          filteredManufacturers.sort((a, b) => b.establishedYear - a.establishedYear);
          break;
        case "established-asc":
          filteredManufacturers.sort((a, b) => a.establishedYear - b.establishedYear);
          break;
        case "name-asc":
          filteredManufacturers.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filteredManufacturers.sort((a, b) => b.name.localeCompare(a.name));
          break;
      }
    }

    setManufacturers(filteredManufacturers);
  }, [
    searchTerm,
    activeCategory,
    activeLocation,
    selectedCertifications,
    sortBy,
    ratingRange,
    yearRange,
    showFavoritesOnly,
    favorites,
    originalManufacturers
  ]);

  const toggleCertification = (cert: string) => {
    setSelectedCertifications(prev => 
      prev.includes(cert) 
        ? prev.filter(c => c !== cert) 
        : [...prev, cert]
    );
  };

  const toggleFavoritesView = () => {
    if (showFavoritesOnly) {
      // Reset all filters when exiting favorites view
      clearFilters();
    }
    setShowFavoritesOnly(!showFavoritesOnly);
  };

  const clearFilters = () => {
    setActiveCategory("All Categories");
    setActiveLocation("All Locations");
    setSelectedCertifications([]);
    setSearchTerm("");
    setRatingRange([0, 5]);
    setYearRange([2000, new Date().getFullYear()]);
    setSortBy("relevance");
  };

  const handleViewDetails = (id: number) => {
    const manufacturer = manufacturers.find(m => m.id === id);
    if (manufacturer) {
      setSelectedManufacturer(manufacturer);
      setShowDetails(true);
    }
  };

  // Add these arrays for filter options
  const locationOptions = [
    "North America",
    "South America",
    "Europe",
    "Asia",
    "Africa",
    "Australia"
  ];

  const leadTimeOptions = [
    "1-2 weeks",
    "2-4 weeks",
    "1-2 months",
    "2+ months"
  ];

  const certificationOptions = [
    "ISO 9001",
    "ISO 14001",
    "HACCP",
    "GMP",
    "FSSC 22000",
    "Organic",
    "Fair Trade",
    "Kosher",
    "Halal"
  ];

  // Add effect for scroll detection
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
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50 overflow-x-hidden">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 pt-24 pb-12"
        variants={pageTransition}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-300%">
                {t('manufacturers-title')}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {t('manufacturers-description')}
              </p>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFavoritesSheet(true)}
                    className={cn(
                      "flex items-center gap-2 transition-all duration-300 hover:bg-primary hover:text-primary-foreground relative group",
                      showFavoritesSheet && "bg-primary text-primary-foreground"
                    )}
                  >
                    <motion.span 
                      animate={favorites.length > 0 ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart className={cn(
                        "h-4 w-4 transition-all",
                        favorites.length > 0 ? "fill-current" : "group-hover:fill-current"
                      )} />
                    </motion.span>
                    {t('favorites-button')}
                    {favorites.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 15
                        }}
                      >
                        <Badge variant="secondary" className="bg-background/20">
                          {favorites.length}
                        </Badge>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className={cn(
                      "flex items-center gap-2 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground",
                      showFilters && "bg-primary text-primary-foreground"
                    )}
                  >
                    <Filter className="h-4 w-4" />
                    {t('filters-heading')}
                    {(selectedCertifications.length > 0 || activeCategory !== "All Categories" || activeLocation !== "All Locations") && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 15
                        }}
                      >
                        <Badge variant="secondary" className="ml-1 bg-background/20">
                          {selectedCertifications.length + (activeCategory !== "All Categories" ? 1 : 0) + (activeLocation !== "All Locations" ? 1 : 0)}
                        </Badge>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 transition-colors duration-300 hover:bg-primary hover:text-primary-foreground",
                      compareItems.length > 0 && "bg-primary text-primary-foreground"
                    )}
                    disabled={compareItems.length === 0}
                    onClick={() => setShowCompareSheet(true)}
                  >
                    <Scale className="h-4 w-4" />
                    {t('compare-button')}
                    {compareItems.length > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 15
                        }}
                      >
                        <Badge variant="secondary" className="bg-background/20">{compareItems.length}</Badge>
                      </motion.div>
                    )}
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="mb-8 space-y-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder={t('search-manufacturers-placeholder')}
                className="pl-10 w-full transition-all duration-300 border-opacity-50 focus:border-opacity-100"
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
                    className="absolute right-12 top-1/2 transform -translate-y-1/2"
                    onClick={() => setSearchTerm("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors duration-300",
                  showAdvancedSearch && "bg-primary text-primary-foreground"
                )}
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                {t('advanced-search-button')}
              </Button>
            </div>

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
                  className="bg-card border rounded-lg p-6 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Rating Range */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {t('rating-range')}
                      </label>
                      <div className="pt-2">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-medium">{ratingRange[0].toFixed(1)}</span>
                          </div>
                          <Slider
                            defaultValue={[4, 5]}
                            min={0}
                            max={5}
                            step={0.1}
                            value={ratingRange}
                            onValueChange={setRatingRange}
                            className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-primary [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-colors [&_[role=slider]]:hover:border-primary/80 [&_[role=slider]]:focus:border-primary/80 [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-primary/20 [&_[role=slider]]:active:scale-95 [&_.range]:bg-primary"
                          />
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-medium">{ratingRange[1].toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Annual Revenue Range */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-emerald-500" />
                        {t('annual-revenue')}
                      </label>
                      <div className="pt-2">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-emerald-600">${revenueRange[0]}M</span>
                          <Slider
                            defaultValue={[1, 100]}
                            min={1}
                            max={100}
                            step={1}
                            value={revenueRange}
                            onValueChange={setRevenueRange}
                            className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-emerald-500 [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-colors [&_[role=slider]]:hover:border-emerald-400 [&_[role=slider]]:focus:border-emerald-400 [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-emerald-200 [&_[role=slider]]:active:scale-95"
                          />
                          <span className="text-sm font-medium text-emerald-600">${revenueRange[1]}M+</span>
                        </div>
                      </div>
                    </div>

                    {/* Employee Count Range */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Users className="h-4 w-4 text-blue-500" />
                        {t('employee-count')}
                      </label>
                      <div className="pt-2">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-blue-600">{employeeRange[0]}</span>
                          <Slider
                            defaultValue={[10, 1000]}
                            min={10}
                            max={1000}
                            step={10}
                            value={employeeRange}
                            onValueChange={setEmployeeRange}
                            className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-blue-500 [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-colors [&_[role=slider]]:hover:border-blue-400 [&_[role=slider]]:focus:border-blue-400 [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-blue-200 [&_[role=slider]]:active:scale-95"
                          />
                          <span className="text-sm font-medium text-blue-600">{employeeRange[1]}+</span>
                        </div>
                      </div>
                    </div>

                    {/* Production Capacity */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Factory className="h-4 w-4 text-purple-500" />
                        {t('production-capacity')}
                      </label>
                      <div className="pt-2">
                        <div className="flex items-center gap-4">
                          <span className="text-sm font-medium text-purple-600">{capacityRange[0].toLocaleString()}</span>
                          <Slider
                            defaultValue={[1000, 100000]}
                            min={1000}
                            max={100000}
                            step={1000}
                            value={capacityRange}
                            onValueChange={setCapacityRange}
                            className="flex-1 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:border-2 [&_[role=slider]]:border-purple-500 [&_[role=slider]]:shadow-md [&_[role=slider]]:transition-colors [&_[role=slider]]:hover:border-purple-400 [&_[role=slider]]:focus:border-purple-400 [&_[role=slider]]:focus:ring-2 [&_[role=slider]]:focus:ring-purple-200 [&_[role=slider]]:active:scale-95"
                          />
                          <span className="text-sm font-medium text-purple-600">{capacityRange[1].toLocaleString()}+</span>
                        </div>
                      </div>
                    </div>

                    {/* Export Markets */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Globe2 className="h-4 w-4 text-indigo-500" />
                        {t('export-markets')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {locationOptions.map((location) => (
                          <Badge
                            key={location}
                            variant={selectedMarkets.includes(location) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-colors",
                              selectedMarkets.includes(location)
                                ? "bg-indigo-500 hover:bg-indigo-600"
                                : "hover:bg-indigo-100"
                            )}
                            onClick={() => {
                              setSelectedMarkets(prev =>
                                prev.includes(location)
                                  ? prev.filter(m => m !== location)
                                  : [...prev, location]
                              );
                            }}
                          >
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Quality Standards */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-teal-500" />
                        {t('quality-standards')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {certificationOptions.map((cert) => (
                          <Badge
                            key={cert}
                            variant={selectedStandards.includes(cert) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-colors",
                              selectedStandards.includes(cert)
                                ? "bg-teal-500 hover:bg-teal-600"
                                : "hover:bg-teal-100"
                            )}
                            onClick={() => {
                              setSelectedStandards(prev =>
                                prev.includes(cert)
                                  ? prev.filter(s => s !== cert)
                                  : [...prev, cert]
                              );
                            }}
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Additional Capabilities */}
                    <div className="col-span-full space-y-4 border-t pt-4">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Settings2 className="h-4 w-4 text-gray-600" />
                        {t('additional-capabilities')}
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="r_and_d" checked={hasRandD} onCheckedChange={setHasRandD} />
                            <Label htmlFor="r_and_d" className="text-sm flex items-center gap-2">
                              <Microscope className="h-4 w-4 text-rose-500" />
                              {t('r-and-d-facilities')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="private_label" checked={hasPrivateLabel} onCheckedChange={setHasPrivateLabel} />
                            <Label htmlFor="private_label" className="text-sm flex items-center gap-2">
                              <Tag className="h-4 w-4 text-sky-500" />
                              {t('private-label-service')}
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="oem" checked={hasOEM} onCheckedChange={setHasOEM} />
                            <Label htmlFor="oem" className="text-sm flex items-center gap-2">
                              <Factory className="h-4 w-4 text-amber-500" />
                              {t('oem-service')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="design" checked={hasDesign} onCheckedChange={setHasDesign} />
                            <Label htmlFor="design" className="text-sm flex items-center gap-2">
                              <Paintbrush className="h-4 w-4 text-violet-500" />
                              {t('design-service')}
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="trade_shows" checked={hasTradeShows} onCheckedChange={setHasTradeShows} />
                            <Label htmlFor="trade_shows" className="text-sm flex items-center gap-2">
                              <Store className="h-4 w-4 text-orange-500" />
                              {t('trade-show-presence')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="samples" checked={hasSamples} onCheckedChange={setHasSamples} />
                            <Label htmlFor="samples" className="text-sm flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-500" />
                              {t('sample-development')}
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRatingRange([0, 5]);
                        setRevenueRange([1, 100]);
                        setEmployeeRange([10, 1000]);
                        setCapacityRange([1000, 100000]);
                        setSelectedMarkets([]);
                        setSelectedStandards([]);
                        setHasRandD(false);
                        setHasPrivateLabel(false);
                        setHasOEM(false);
                        setHasDesign(false);
                        setHasTradeShows(false);
                        setHasSamples(false);
                        setShowAdvancedSearch(false);
                      }}
                      className="hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {t('reset-filters')}
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowAdvancedSearch(false)}>
                        {t('cancel-button')}
                      </Button>
                      <Button onClick={() => setShowAdvancedSearch(false)}>
                        {t('apply-filters')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Active filters with enhanced animations */}
          <AnimatePresence>
            {(selectedCertifications.length > 0 || activeCategory !== "All Categories" || activeLocation !== "All Locations" || showFavoritesOnly || ratingRange[0] !== 0 || ratingRange[1] !== 5 || yearRange[0] !== 2000 || yearRange[1] !== new Date().getFullYear()) && (
              <motion.div 
                className="mb-6 flex flex-wrap items-center gap-2 bg-muted/30 p-4 rounded-lg"
                initial={{ opacity: 0, y: -5, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -5, height: 0 }}
                transition={{ 
                  duration: 0.2, 
                  height: { duration: 0.15 },
                  opacity: { duration: 0.2 }
                }}
              >
                <span className="text-sm font-medium text-foreground/70">{t('active-filters')}</span>
                
                {showFavoritesOnly && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-all duration-300">
                      <Heart className="h-3 w-3" />
                      {t('favorites-only')}
                      <motion.button 
                        onClick={() => setShowFavoritesOnly(false)}
                        className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5 transition-colors duration-300"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  </motion.div>
                )}
              
                {activeCategory !== "All Categories" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-all duration-300">
                      {activeCategory === "All Categories" ? t('all-categories') : activeCategory}
                      <motion.button 
                        onClick={() => setActiveCategory("All Categories")}
                        className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5 transition-colors duration-300"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  </motion.div>
                )}
              
                {activeLocation !== "All Locations" && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-all duration-300">
                      <MapPin className="h-3 w-3" />
                      {activeLocation === "All Locations" ? t('all-locations') : activeLocation}
                      <motion.button 
                        onClick={() => setActiveLocation("All Locations")}
                        className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5 transition-colors duration-300"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  </motion.div>
                )}
              
                {selectedCertifications.map(cert => (
                  <motion.div
                    key={cert}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-all duration-300"
                    >
                      {cert}
                      <motion.button 
                        onClick={() => toggleCertification(cert)}
                        className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5 transition-colors duration-300"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  </motion.div>
                ))}
              
                {(ratingRange[0] !== 0 || ratingRange[1] !== 5) && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-all duration-300">
                      <Star className="h-3 w-3" />
                      {ratingRange[0]} - {ratingRange[1]}
                      <motion.button 
                        onClick={() => setRatingRange([0, 5])}
                        className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5 transition-colors duration-300"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  </motion.div>
                )}
                
                {(yearRange[0] !== 2000 || yearRange[1] !== new Date().getFullYear()) && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-all duration-300">
                      <Calendar className="h-3 w-3" />
                      {yearRange[0]} - {yearRange[1]}
                      <motion.button 
                        onClick={() => setYearRange([2000, new Date().getFullYear()])}
                        className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5 transition-colors duration-300"
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-3 w-3" />
                      </motion.button>
                    </Badge>
                  </motion.div>
                )}
                
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters} 
                    className="text-xs hover:bg-destructive hover:text-destructive-foreground transition-colors duration-300"
                  >
                    {t('clear-all')}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Filter sidebar and manufacturers grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filter sidebar - improved animations */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, x: -20, boxShadow: "0px 0px 0px rgba(0,0,0,0)" }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
                    transition: {
                      type: "spring",
                      stiffness: 400,
                      damping: 30
                    }
                  }}
                  exit={{ 
                    opacity: 0, 
                    x: -20,
                    transition: {
                      duration: 0.2
                    }
                  }}
                  className="md:col-span-1 space-y-6 bg-card p-6 rounded-xl shadow-sm border"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      {t('filters-heading')}
                    </h3>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="md:hidden hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setShowFilters(false)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-6"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {t('categories-heading')}
                      </h4>
                      <div className="space-y-1">
                        {categories.map((category, index) => (
                          <motion.div
                            key={category}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0,
                              transition: {
                                delay: 0.05 * index
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
                              {category === "All Categories" ? t('all-categories') : category}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {t('location-heading')}
                      </h4>
                      <div className="space-y-1">
                        {locations.map((location, index) => (
                          <motion.div
                            key={location}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                              opacity: 1, 
                              x: 0,
                              transition: {
                                delay: 0.05 * index
                              }
                            }}
                          >
                            <Button
                              variant={activeLocation === location ? "secondary" : "ghost"}
                              size="sm"
                              className={cn(
                                "w-full justify-start text-sm h-8 transition-all duration-200",
                                activeLocation === location && "bg-primary/10 text-primary font-medium"
                              )}
                              onClick={() => setActiveLocation(location)}
                            >
                              {location !== "All Locations" && <MapPin className="h-3 w-3 mr-2" />}
                              {location === "All Locations" ? t('all-locations') : location}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                        <Award className="h-4 w-4" />
                        {t('certifications-heading')}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {certifications.map((cert, index) => (
                          <motion.div
                            key={cert}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                              opacity: 1, 
                              scale: 1,
                              transition: {
                                delay: 0.05 * index
                              }
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              variant={selectedCertifications.includes(cert) ? "default" : "outline"}
                              className={cn(
                                "cursor-pointer transition-colors duration-200",
                                selectedCertifications.includes(cert) 
                                  ? "bg-primary/10 text-primary hover:bg-primary/20" 
                                  : "hover:bg-muted"
                              )}
                              onClick={() => toggleCertification(cert)}
                            >
                              {cert}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
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
                      {t('clear-all-filters')}
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Manufacturers grid with enhanced animations */}
            <motion.div 
              className={`${showFilters ? 'md:col-span-3' : 'md:col-span-4'}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {manufacturers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  <AnimatePresence mode="popLayout">
                    {manufacturers.map(manufacturer => (
                      <motion.div
                        key={manufacturer.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 25,
                          duration: 0.3 
                        }}
                        whileHover={{ 
                          y: -5, 
                          boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.1)", 
                          transition: { 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 25 
                          } 
                        }}
                      >
                        <ManufacturerCard 
                          manufacturer={manufacturer}
                          onViewDetails={handleViewDetails}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div 
                  className="text-center py-16 bg-card rounded-xl border shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    delay: 0.2, 
                    type: "spring",
                    stiffness: 200,
                    damping: 20
                  }}
                >
                  {showFavoritesOnly ? (
                    <>
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
                        <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                      </motion.div>
                      <motion.p 
                        className="text-xl font-medium text-foreground/70 mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {t('no-favorite-manufacturers')}
                      </motion.p>
                      <motion.p 
                        className="text-muted-foreground mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {t('add-manufacturers-favorites')}
                      </motion.p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={() => setShowFavoritesOnly(false)}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                        >
                          {t('view-all-manufacturers')}
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
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
                        <Building className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                      </motion.div>
                      <motion.p 
                        className="text-xl font-medium text-foreground/70 mb-2"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        {t('no-manufacturers-found')}
                      </motion.p>
                      <motion.p 
                        className="text-muted-foreground mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        {t('adjust-filters-or-search')}
                      </motion.p>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          variant="outline" 
                          onClick={clearFilters}
                          className="hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
                        >
                          {t('clear-all-filters')}
                        </Button>
                      </motion.div>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Add floating back-to-top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.2 }}
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
      
      {selectedManufacturer && (
        <ManufacturerDetails
          manufacturer={selectedManufacturer}
          isOpen={showDetails}
          onClose={() => {
            setShowDetails(false);
            setSelectedManufacturer(null);
          }}
        />
      )}
    </div>
  );
};

export default Manufacturers;
