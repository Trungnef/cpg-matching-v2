import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import ManufacturerCard from "@/components/ManufacturerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  Settings2
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

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Add this new constant for advanced sort options
const advancedSortOptions = [
  { value: "relevance", label: "Most Relevant" },
  { value: "rating-desc", label: "Highest Rating" },
  { value: "rating-asc", label: "Lowest Rating" },
  { value: "orders-desc", label: "Highest Orders" },
  { value: "orders-asc", label: "Lowest Orders" },
  { value: "name-asc", label: "Name A-Z" },
  { value: "name-desc", label: "Name Z-A" }
];

const Manufacturers = () => {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-4">
              <motion.h1 
                className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Manufacturers
              </motion.h1>
              <motion.p 
                className="text-lg text-muted-foreground max-w-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                Find the perfect manufacturer for your CPG products. Compare capabilities, certifications, and connect directly with trusted partners.
              </motion.p>
            </div>
            
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFavoritesSheet(true)}
                className={cn(
                  "flex items-center gap-2 transition-colors hover:bg-primary hover:text-primary-foreground relative group",
                  showFavoritesSheet && "bg-primary text-primary-foreground"
                )}
              >
                <Heart className={cn(
                  "h-4 w-4 transition-all",
                  favorites.length > 0 ? "fill-current" : "group-hover:fill-current"
                )} />
                Favorites
                {favorites.length > 0 && (
                  <Badge variant="secondary" className="bg-background/20">
                    {favorites.length}
                  </Badge>
                )}
              </Button>

              <Sheet open={showFavoritesSheet} onOpenChange={setShowFavoritesSheet}>
                <SheetContent side="right" className="w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-bold flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      Favorite Manufacturers
                    </SheetTitle>
                    <SheetDescription>
                      Your list of favorite manufacturers
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-4">
                    {favorites.length === 0 ? (
                      <div className="text-center py-8 space-y-4">
                        <Heart className="h-12 w-12 mx-auto text-muted-foreground" />
                        <div className="space-y-2">
                          <p className="text-lg font-medium">No favorites yet</p>
                          <p className="text-sm text-muted-foreground">
                            Add manufacturers to your favorites to see them here
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {favorites.map((manufacturer) => (
                          <motion.div
                            key={manufacturer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="group relative bg-card rounded-lg p-4 border shadow-sm hover:shadow-md transition-all"
                          >
                            <div className="absolute -top-2 -right-2 z-10">
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => toggleFavorite(manufacturer)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
            </div>
            
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                                <img src={manufacturer.logo} alt={manufacturer.name} className="w-8 h-8" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base font-medium truncate">{manufacturer.name}</h4>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {manufacturer.location}
                                </p>
                              </div>
                            </div>
                            
                            <div className="mt-3 flex flex-wrap gap-1">
                              {manufacturer.categories.map(category => (
                                <Badge key={category} variant="secondary" className="text-xs">
                                  {category}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={cn(
                                      "h-3 w-3",
                                      i < Math.floor(manufacturer.rating) 
                                        ? "fill-primary text-primary"
                                        : "text-muted-foreground/40"
                                    )}
                                  />
                                ))}
                                <span className="ml-1 text-sm font-medium">{manufacturer.rating}</span>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs hover:bg-primary hover:text-primary-foreground"
                                onClick={() => {
                                  handleViewDetails(manufacturer.id);
                                  setShowFavoritesSheet(false);
                                }}
                              >
                                View Details
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {favorites.length > 0 && (
                    <SheetFooter className="mt-6">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2 hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => {
                          favorites.forEach(manufacturer => toggleFavorite(manufacturer));
                          setShowFavoritesSheet(false);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        Clear All Favorites
                      </Button>
                    </SheetFooter>
                  )}
                </SheetContent>
              </Sheet>

              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn(
                  "flex items-center gap-2 transition-colors hover:bg-primary hover:text-primary-foreground",
                  showFilters && "bg-primary text-primary-foreground"
                )}
              >
                <Filter className="h-4 w-4" />
                Filters
                {(selectedCertifications.length > 0 || activeCategory !== "All Categories" || activeLocation !== "All Locations") && (
                  <Badge variant="secondary" className="ml-1 bg-background/20">
                    {selectedCertifications.length + (activeCategory !== "All Categories" ? 1 : 0) + (activeLocation !== "All Locations" ? 1 : 0)}
                  </Badge>
                )}
              </Button>

              <Sheet open={showCompareSheet} onOpenChange={setShowCompareSheet}>
                <SheetTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 transition-colors hover:bg-primary hover:text-primary-foreground",
                      compareItems.length > 0 && "bg-primary text-primary-foreground"
                    )}
                    disabled={compareItems.length === 0}
                  >
                    <Scale className="h-4 w-4" />
                    Compare
                    {compareItems.length > 0 && (
                      <Badge variant="secondary" className="bg-background/20">{compareItems.length}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full h-full p-0 border-none bg-transparent">
                  <motion.div 
                    className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="container mx-auto px-4 py-6 max-w-7xl">
                      <div className="flex items-center justify-between mb-8">
                        <div>
                          <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                            Compare Manufacturers
                          </h2>
                          <p className="text-muted-foreground mt-2">
                            Compare up to 3 manufacturers side by side to make informed decisions
                          </p>
            </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-destructive hover:text-destructive-foreground"
                          onClick={() => setShowCompareSheet(false)}
                        >
                          <X className="h-5 w-5" />
                        </Button>
          </div>
          
                      {compareItems.length === 0 ? (
                        <motion.div 
                          className="text-center py-24 space-y-4 bg-card rounded-xl border"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Scale className="h-16 w-16 mx-auto text-muted-foreground" />
                          <div className="space-y-2">
                            <p className="text-2xl font-medium">No manufacturers selected</p>
                            <p className="text-muted-foreground">
                              Add up to 3 manufacturers to compare their capabilities
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            onClick={() => setShowCompareSheet(false)}
                            className="mt-4"
                          >
                            Browse Manufacturers
                          </Button>
                        </motion.div>
                      ) : (
                        <motion.div 
                          className="space-y-8"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {compareItems.map((item, index) => (
                              <motion.div 
                                key={item.id}
                                className="relative group"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="absolute -top-2 -right-2 z-10">
                                  <Button
                                    variant="destructive"
                                    size="icon"
                                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    onClick={() => toggleCompare(item)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="bg-card rounded-xl p-6 border shadow-sm">
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                      <img src={item.logo} alt={item.name} className="w-10 h-10" />
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-medium">{item.name}</h4>
                                      <p className="text-muted-foreground">{item.location}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                              <table className="w-full">
                                <thead className="bg-muted/50">
                                  <tr>
                                    <th className="text-left p-4 text-sm font-medium text-muted-foreground w-[200px] sticky left-0 bg-muted/50">
                                      Comparison Criteria
                                    </th>
                                    {compareItems.map((item) => (
                                      <th key={item.id} className="text-left p-4 text-sm font-medium min-w-[250px]">
                                        {item.name}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                  <tr>
                                    <td className="p-4 text-sm font-medium text-muted-foreground sticky left-0 bg-card">
                                      <div className="flex items-center gap-2">
                                        <Star className="h-4 w-4" />
                                        Rating
                                      </div>
                                    </td>
                                    {compareItems.map((item) => (
                                      <td key={item.id} className="p-4">
                                        <div className="flex items-center gap-1">
                                          {Array.from({ length: 5 }).map((_, i) => (
                                            <Star 
                                              key={i}
                                              className={cn(
                                                "h-4 w-4",
                                                i < Math.floor(item.rating) 
                                                  ? "fill-primary text-primary"
                                                  : "text-muted-foreground/40"
                                              )}
                                            />
                                          ))}
                                          <span className="ml-2 font-medium">{item.rating}</span>
                                        </div>
                                      </td>
                                    ))}
                                  </tr>
                                  <tr>
                                    <td className="p-4 text-sm font-medium text-muted-foreground sticky left-0 bg-card">
                                      <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4" />
                                        Categories
                                      </div>
                                    </td>
                                    {compareItems.map((item) => (
                                      <td key={item.id} className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                          {item.categories.map(cat => (
                                            <Badge key={cat} variant="secondary" className="text-xs">
                                              {cat}
                                            </Badge>
                                          ))}
                                        </div>
                                      </td>
                                    ))}
                                  </tr>
                                  <tr>
                                    <td className="p-4 text-sm font-medium text-muted-foreground sticky left-0 bg-card">
                                      <div className="flex items-center gap-2">
                                        <Award className="h-4 w-4" />
                                        Certifications
                                      </div>
                                    </td>
                                    {compareItems.map((item) => (
                                      <td key={item.id} className="p-4">
                                        <div className="flex flex-wrap gap-1">
                                          {item.certifications.map(cert => (
                                            <Badge key={cert} variant="outline" className="text-xs bg-background/50">
                                              {cert}
                                            </Badge>
                                          ))}
                                        </div>
                                      </td>
                                    ))}
                                  </tr>
                                  <tr>
                                    <td className="p-4 text-sm font-medium text-muted-foreground sticky left-0 bg-card">
                                      <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4" />
                                        Minimum Order
                                      </div>
                                    </td>
                                    {compareItems.map((item) => (
                                      <td key={item.id} className="p-4">
                                        <span className="text-sm font-medium">{item.minOrderSize}</span>
                                      </td>
                                    ))}
                                  </tr>
                                  <tr>
                                    <td className="p-4 text-sm font-medium text-muted-foreground sticky left-0 bg-card">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Established Year
                                      </div>
                                    </td>
                                    {compareItems.map((item) => (
                                      <td key={item.id} className="p-4">
                                        <span className="text-sm font-medium">{item.establishedYear}</span>
                                      </td>
                                    ))}
                                  </tr>
                                  <tr>
                                    <td className="p-4 text-sm font-medium text-muted-foreground sticky left-0 bg-card">
                                      <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Location
                                      </div>
                                    </td>
                                    {compareItems.map((item) => (
                                      <td key={item.id} className="p-4">
                                        <span className="text-sm">{item.location}</span>
                                      </td>
                                    ))}
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="flex justify-between items-center pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                clearCompare();
                                setShowCompareSheet(false);
                              }}
                              className="flex items-center gap-2 hover:bg-destructive hover:text-destructive-foreground transition-colors"
                            >
                              <Trash2 className="h-4 w-4" />
                              Clear All
                            </Button>
                            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 transition-colors">
                              <Mail className="h-4 w-4" />
                              Contact Selected
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </SheetContent>
              </Sheet>
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
                placeholder="Search manufacturers, products, or certifications..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-12 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "absolute right-2 top-1/2 transform -translate-y-1/2",
                  showAdvancedSearch && "bg-primary text-primary-foreground"
                )}
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Advanced
              </Button>
            </div>

            <AnimatePresence>
              {showAdvancedSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-card border rounded-lg p-6 space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Rating Range */}
                    <div className="space-y-3">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Rating Range
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
                        Annual Revenue
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
                        Employee Count
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
                        Production Capacity
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
                        Export Markets
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
                        Quality Standards
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
                        Additional Capabilities
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="r_and_d" checked={hasRandD} onCheckedChange={setHasRandD} />
                            <Label htmlFor="r_and_d" className="text-sm flex items-center gap-2">
                              <Microscope className="h-4 w-4 text-rose-500" />
                              R&D Facilities
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="private_label" checked={hasPrivateLabel} onCheckedChange={setHasPrivateLabel} />
                            <Label htmlFor="private_label" className="text-sm flex items-center gap-2">
                              <Tag className="h-4 w-4 text-sky-500" />
                              Private Label Service
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="oem" checked={hasOEM} onCheckedChange={setHasOEM} />
                            <Label htmlFor="oem" className="text-sm flex items-center gap-2">
                              <Factory className="h-4 w-4 text-amber-500" />
                              OEM Service
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="design" checked={hasDesign} onCheckedChange={setHasDesign} />
                            <Label htmlFor="design" className="text-sm flex items-center gap-2">
                              <Paintbrush className="h-4 w-4 text-violet-500" />
                              Design Service
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="trade_shows" checked={hasTradeShows} onCheckedChange={setHasTradeShows} />
                            <Label htmlFor="trade_shows" className="text-sm flex items-center gap-2">
                              <Store className="h-4 w-4 text-orange-500" />
                              Trade Show Presence
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="samples" checked={hasSamples} onCheckedChange={setHasSamples} />
                            <Label htmlFor="samples" className="text-sm flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-500" />
                              Sample Development
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
                      Reset Filters
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowAdvancedSearch(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setShowAdvancedSearch(false)}>
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Active filters */}
          <AnimatePresence>
            {(selectedCertifications.length > 0 || activeCategory !== "All Categories" || activeLocation !== "All Locations" || showFavoritesOnly || ratingRange[0] !== 0 || ratingRange[1] !== 5 || yearRange[0] !== 2000 || yearRange[1] !== new Date().getFullYear()) && (
              <motion.div 
                className="mb-6 flex flex-wrap items-center gap-2 bg-muted/30 p-4 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <span className="text-sm font-medium text-foreground/70">Active filters:</span>
                
                {showFavoritesOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-colors">
                    <Heart className="h-3 w-3" />
                    Favorites Only
                    <button 
                      onClick={() => setShowFavoritesOnly(false)}
                      className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              
              {activeCategory !== "All Categories" && (
                  <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-colors">
                  {activeCategory}
                    <button 
                      onClick={() => setActiveCategory("All Categories")}
                      className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5"
                    >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {activeLocation !== "All Locations" && (
                  <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-colors">
                  <MapPin className="h-3 w-3" />
                  {activeLocation}
                    <button 
                      onClick={() => setActiveLocation("All Locations")}
                      className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5"
                    >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {selectedCertifications.map(cert => (
                  <Badge
                    key={cert}
                    variant="secondary"
                    className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-colors"
                  >
                  {cert}
                    <button 
                      onClick={() => toggleCertification(cert)}
                      className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5"
                    >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
                {(ratingRange[0] !== 0 || ratingRange[1] !== 5) && (
                  <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-colors">
                    <Star className="h-3 w-3" />
                    {ratingRange[0]} - {ratingRange[1]}
                    <button 
                      onClick={() => setRatingRange([0, 5])}
                      className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                {(yearRange[0] !== 2000 || yearRange[1] !== new Date().getFullYear()) && (
                  <Badge variant="secondary" className="flex items-center gap-1 group hover:bg-destructive hover:text-destructive-foreground transition-colors">
                    <Calendar className="h-3 w-3" />
                    {yearRange[0]} - {yearRange[1]}
                    <button 
                      onClick={() => setYearRange([2000, new Date().getFullYear()])}
                      className="group-hover:bg-destructive-foreground/20 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters} 
                  className="text-xs hover:bg-destructive hover:text-destructive-foreground transition-colors"
                >
                Clear all
              </Button>
              </motion.div>
          )}
          </AnimatePresence>
          
          {/* Filter sidebar and manufacturers grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filter sidebar - shown/hidden on mobile */}
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="md:col-span-1 space-y-6 bg-card p-6 rounded-xl shadow-sm border"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:hidden hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-6">
                <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Categories
                    </h4>
                  <div className="space-y-1">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={activeCategory === category ? "secondary" : "ghost"}
                        size="sm"
                          className={cn(
                            "w-full justify-start text-sm h-8",
                            activeCategory === category && "bg-primary/10 text-primary font-medium"
                          )}
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location
                    </h4>
                  <div className="space-y-1">
                    {locations.map(location => (
                      <Button
                        key={location}
                        variant={activeLocation === location ? "secondary" : "ghost"}
                        size="sm"
                          className={cn(
                            "w-full justify-start text-sm h-8",
                            activeLocation === location && "bg-primary/10 text-primary font-medium"
                          )}
                        onClick={() => setActiveLocation(location)}
                      >
                        {location !== "All Locations" && <MapPin className="h-3 w-3 mr-2" />}
                        {location}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                    <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                      <Award className="h-4 w-4" />
                      Certifications
                    </h4>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map(cert => (
                      <Badge
                        key={cert}
                        variant={selectedCertifications.includes(cert) ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer transition-colors",
                            selectedCertifications.includes(cert) 
                              ? "bg-primary/10 text-primary hover:bg-primary/20" 
                              : "hover:bg-muted"
                          )}
                        onClick={() => toggleCertification(cert)}
                      >
                        {cert}
                      </Badge>
                    ))}
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 hover:bg-destructive hover:text-destructive-foreground"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </motion.div>
            )}
            
            {/* Manufacturers grid */}
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
                        variants={itemVariants}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {showFavoritesOnly ? (
                    <>
                      <Heart className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                      <p className="text-xl font-medium text-foreground/70 mb-2">No favorite manufacturers</p>
                      <p className="text-muted-foreground mb-6">Add manufacturers to your favorites to see them here</p>
                      <Button 
                        variant="outline" 
                        onClick={() => setShowFavoritesOnly(false)}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        View All Manufacturers
                  </Button>
                    </>
                  ) : (
                    <>
                      <Building className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                      <p className="text-xl font-medium text-foreground/70 mb-2">No manufacturers found</p>
                      <p className="text-muted-foreground mb-6">Try adjusting your filters or search terms</p>
                      <Button 
                        variant="outline" 
                        onClick={clearFilters}
                        className="hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        Clear All Filters
                  </Button>
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>
            </div>
          </div>
        </div>
      
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
