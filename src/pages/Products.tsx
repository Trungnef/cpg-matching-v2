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
import { useFavorites } from "@/contexts/FavoriteContext";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    name: "Organic Granola",
    category: "Breakfast Foods",
    manufacturer: "Nature's Best",
    image: "/placeholder.svg",
    price: "$4.99",
    certifications: ["Organic", "Non-GMO"],
    rating: 4.5,
    packagingType: "Cardboard Box",
    description: "Delicious organic granola made with whole grain oats, honey, and mixed nuts. Perfect for breakfast or as a healthy snack.",
    minOrderQuantity: 100,
    leadTime: "2-3 weeks",
    sustainable: true
  },
  {
    id: 2,
    name: "Premium Coffee Beans",
    category: "Beverages",
    manufacturer: "Mountain Roasters",
    image: "/placeholder.svg",
    price: "$12.99",
    certifications: ["Fair Trade", "Organic"],
    rating: 4.8,
    packagingType: "Resealable Bag",
    description: "Premium arabica coffee beans sourced from high-altitude farms. Medium roast with notes of chocolate and caramel.",
    minOrderQuantity: 50,
    leadTime: "1-2 weeks",
    sustainable: true
  },
  {
    id: 3,
    name: "Almond Butter",
    category: "Spreads",
    manufacturer: "Pure Foods Co.",
    image: "/placeholder.svg",
    price: "$7.99",
    certifications: ["Non-GMO", "Gluten-Free"],
    rating: 4.2,
    packagingType: "Glass Jar",
    description: "Creamy almond butter made from dry roasted almonds. No added sugar or preservatives.",
    minOrderQuantity: 75,
    leadTime: "2 weeks",
    sustainable: false
  },
  {
    id: 4,
    name: "Protein Bars",
    category: "Snacks",
    manufacturer: "Fitness Nutrition",
    image: "/placeholder.svg",
    price: "$2.49",
    certifications: ["High-Protein", "Low-Sugar"],
    rating: 4.0,
    packagingType: "Wrapper",
    description: "High-protein bars with 20g of protein per serving. Great for post-workout recovery or a quick snack on the go.",
    minOrderQuantity: 200,
    leadTime: "1 week",
    sustainable: false
  },
  {
    id: 5,
    name: "Sparkling Water",
    category: "Beverages",
    manufacturer: "Clear Springs",
    image: "/placeholder.svg",
    price: "$1.29",
    certifications: ["Zero-Calorie"],
    rating: 4.3,
    packagingType: "Aluminum Can",
    description: "Refreshing sparkling water with natural flavors. Zero calories, zero sweeteners, and zero sodium.",
    minOrderQuantity: 300,
    leadTime: "1-2 weeks",
    sustainable: true
  },
  {
    id: 6,
    name: "Dried Fruit Mix",
    category: "Snacks",
    manufacturer: "Harvest Farms",
    image: "/placeholder.svg",
    price: "$5.49",
    certifications: ["No Added Sugar", "Organic"],
    rating: 4.6,
    packagingType: "Resealable Pouch",
    description: "A delicious mix of organic dried fruits, including apples, cranberries, and mangoes. Perfect for snacking or baking.",
    minOrderQuantity: 100,
    leadTime: "1-3 weeks",
    sustainable: true
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

// Certification options
const certifications = [
  "Organic",
  "Non-GMO",
  "Gluten-Free",
  "Fair Trade",
  "No Added Sugar",
  "High-Protein",
  "Low-Sugar",
  "Zero-Calorie"
];

// Packaging types
const packagingTypes = [
  "Cardboard Box",
  "Glass Jar",
  "Aluminum Can",
  "Plastic Bottle",
  "Resealable Bag",
  "Resealable Pouch",
  "Wrapper",
  "Tetra Pak"
];

// Sort options
const sortOptions = [
  { label: "Relevance", value: "relevance" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: High to Low", value: "rating-desc" },
  { label: "Name: A to Z", value: "name-asc" },
  { label: "Name: Z to A", value: "name-desc" }
];

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState(mockProducts);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<string[]>([]);
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

  const {
    favorites: favoritedProducts,
    isFavorite,
    toggleFavorite
  } = useFavorites();

  // Page title effect
  useEffect(() => {
    document.title = "Browse Products - CPG Matchmaker";
  }, []);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
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

    // Filter by certifications
    if (selectedCertifications.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedCertifications.every(cert => 
          product.certifications.includes(cert)
        )
      );
    }

    // Filter by packaging type
    if (selectedPackaging.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedPackaging.includes(product.packagingType)
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
      case "rating-desc":
        filteredProducts.sort((a, b) => b.rating - a.rating);
        break;
      case "name-asc":
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default is relevance
        break;
    }

    setProducts(filteredProducts);
  }, [searchTerm, activeCategory, selectedCertifications, selectedPackaging, sortBy, sustainableOnly, 
      searchParams, isFavorite, priceRange, minOrder, selectedLeadTime, inStockOnly, newArrivalsOnly, minRating]);

  // Toggle certification selection
  const toggleCertification = (cert: string) => {
    setSelectedCertifications(prev => 
      prev.includes(cert) 
        ? prev.filter(c => c !== cert) 
        : [...prev, cert]
    );
  };

  // Toggle packaging selection
  const togglePackaging = (packaging: string) => {
    setSelectedPackaging(prev => 
      prev.includes(packaging) 
        ? prev.filter(p => p !== packaging) 
        : [...prev, packaging]
    );
  };

  // Toggle lead time selection
  const toggleLeadTime = (time: string) => {
    setSelectedLeadTime(prev => 
      prev.includes(time)
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  // Clear all filters including advanced filters
  const clearFilters = () => {
    setActiveCategory("All Categories");
    setSelectedCertifications([]);
    setSelectedPackaging([]);
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
      return (
        <motion.div 
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6`}
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {[...Array(6)].map((_, idx) => (
            <motion.div key={idx} variants={cardVariants}>
              <div className="rounded-lg overflow-hidden border">
                <Skeleton className="h-48 w-full" />
                <div className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <div className="flex gap-2 mb-3">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-28 mb-2" />
                  <div className="flex justify-between mt-3">
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }
    
    if (products.length === 0) {
      return (
        <motion.div 
          className="text-center py-20 bg-muted/30 rounded-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-lg text-foreground/70 mb-2">No products found matching your criteria.</p>
          <p className="text-sm text-muted-foreground mb-6">Try adjusting your filters or search terms.</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
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
          {products.map(product => (
            <motion.div key={product.id} variants={cardVariants}>
              <ProductCard 
                product={product} 
                isFavorite={isFavorite(product.id)}
                onFavoriteToggle={() => toggleFavorite(product)}
                onDetailsClick={() => handleProductDetailsClick(product)}
                className="h-full"
              />
            </motion.div>
          ))}
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
          {products.map(product => (
            <motion.div 
              key={product.id} 
              variants={cardVariants}
              className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg hover:shadow-md transition-all bg-card"
            >
              <div className="w-full sm:w-32 h-32 bg-muted rounded-md flex items-center justify-center relative group">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-16 h-16 object-contain transition-transform group-hover:scale-110 duration-300"
                />
                {product.sustainable && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="absolute top-2 left-2 bg-green-100 text-green-800 rounded-full p-1">
                          <CheckCircle2 className="h-4 w-4" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sustainable Product</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-foreground/70">{product.manufacturer}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={isFavorite(product.id) ? "text-red-500" : "text-muted-foreground"}
                      onClick={() => toggleFavorite(product)}
                    >
                      <Heart className="h-4 w-4" fill={isFavorite(product.id) ? "currentColor" : "none"} />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mb-2 mt-1">
                  <Badge>{product.category}</Badge>
                  <Badge variant="outline">{product.packagingType}</Badge>
                  <span className="text-sm text-foreground/70">
                    Min. Order: {product.minOrderQuantity} units
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.certifications.map(cert => (
                    <Badge key={cert} variant="secondary" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <p className="font-medium text-lg">{product.price}</p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleProductDetailsClick(product)}
                    >
                      Details
                    </Button>
                    <Button size="sm">
                      Match
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <motion.div 
        className="container mx-auto px-4 pt-24 pb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <div>
              <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary animate-gradient bg-300%">
                Browse Products
              </h1>
              <p className="text-foreground/70">
                Discover the perfect products for your CPG business
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <ArrowUpDown className="h-4 w-4" />
                    Sort: {sortOptions.find(option => option.value === sortBy)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
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
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(selectedCertifications.length > 0 || selectedPackaging.length > 0 || activeCategory !== "All Categories" || sustainableOnly) && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCertifications.length + selectedPackaging.length + (activeCategory !== "All Categories" ? 1 : 0) + (sustainableOnly ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              
              <Tabs defaultValue={activeView} onValueChange={setActiveView} className="w-auto">
                <TabsList className="grid w-[120px] grid-cols-2">
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
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
                className="pl-10 pr-24 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                className={cn(
                  "absolute right-2 top-1/2 transform -translate-y-1/2",
                  showAdvancedSearch ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <SlidersHorizontal className="h-4 w-4 mr-1" />
                Advanced
              </Button>
            </div>

            <AnimatePresence>
              {showAdvancedSearch && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-6 bg-card rounded-lg border shadow-sm"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Rating Filter */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        Product Rating
                      </Label>
                      <div className="pt-2 px-2">
                        <Slider
                          value={[minRating]}
                          onValueChange={([value]) => setMinRating(value)}
                          min={0}
                          max={5}
                          step={0.5}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            {minRating}+
                          </span>
                          <span className="text-sm text-muted-foreground flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                            5.0
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Package className="h-4 w-4 text-emerald-500" />
                        Price Range
                      </Label>
                      <div className="pt-2 px-2">
                        <Slider
                          value={priceRange}
                          onValueChange={(value) => setPriceRange(value as [number, number])}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-sm font-medium text-emerald-600">${priceRange[0]}</span>
                          <span className="text-sm font-medium text-emerald-600">${priceRange[1] === 100 ? '100+' : priceRange[1]}</span>
                        </div>
                      </div>
                    </div>

                    {/* Lead Time */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        Lead Time
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {["1 week", "2 weeks", "3 weeks", "4+ weeks"].map((time) => (
                          <Badge
                            key={time}
                            variant={selectedLeadTime.includes(time) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-colors",
                              selectedLeadTime.includes(time) 
                                ? "bg-blue-500 hover:bg-blue-600" 
                                : "hover:bg-blue-100"
                            )}
                            onClick={() => toggleLeadTime(time)}
                          >
                            {time}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Minimum Order */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-purple-500" />
                        Minimum Order
                      </Label>
                      <div className="pt-2 px-2">
                        <Slider
                          value={[minOrder]}
                          onValueChange={([value]) => setMinOrder(value)}
                          min={50}
                          max={5000}
                          step={50}
                          className="w-full"
                        />
                        <div className="flex justify-between mt-2">
                          <span className="text-sm font-medium text-purple-600">{minOrder} units</span>
                          <span className="text-sm font-medium text-purple-600">5K+ units</span>
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="col-span-full space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-500" />
                        Certifications
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {certifications.map((cert) => (
                          <Badge
                            key={cert}
                            variant={selectedCertifications.includes(cert) ? "default" : "outline"}
                            className={cn(
                              "cursor-pointer transition-colors",
                              selectedCertifications.includes(cert)
                                ? "bg-amber-500 hover:bg-amber-600"
                                : "hover:bg-amber-100"
                            )}
                            onClick={() => toggleCertification(cert)}
                          >
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="col-span-full border-t pt-4 mt-2">
                      <Label className="text-sm font-medium flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-gray-600" />
                        Additional Filters
                      </Label>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="inStock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
                            <Label htmlFor="inStock" className="text-sm flex items-center gap-2">
                              <Package className="h-4 w-4 text-green-500" />
                              In Stock Only
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="newArrivals" checked={newArrivalsOnly} onCheckedChange={setNewArrivalsOnly} />
                            <Label htmlFor="newArrivals" className="text-sm flex items-center gap-2">
                              <Star className="h-4 w-4 text-orange-500" />
                              New Arrivals Only
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="customization" checked={hasCustomization} onCheckedChange={setHasCustomization} />
                            <Label htmlFor="customization" className="text-sm flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-indigo-500" />
                              Customization Available
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="sustainable" checked={sustainableOnly} onCheckedChange={setSustainableOnly} />
                            <Label htmlFor="sustainable" className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              Sustainable Only
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="samples" checked={hasSamples} onCheckedChange={setHasSamples} />
                            <Label htmlFor="samples" className="text-sm flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-500" />
                              Sample Available
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-8 pt-4 border-t">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        clearFilters();
                        setShowAdvancedSearch(false);
                      }}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Reset All
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAdvancedSearch(false)}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        onClick={applyAdvancedFilters}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                      >
                        <Filter className="h-4 w-4" />
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
            {(selectedCertifications.length > 0 || selectedPackaging.length > 0 || activeCategory !== "All Categories" || sustainableOnly) && (
              <motion.div 
                className="mb-6 flex flex-wrap items-center gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
              <span className="text-sm text-foreground/70">Active filters:</span>
              
              {activeCategory !== "All Categories" && (
                  <Badge variant="secondary" className="flex items-center gap-1 animate-fadeIn">
                  {activeCategory}
                    <motion.button 
                      onClick={() => setActiveCategory("All Categories")}
                      whileTap={{ scale: 0.9 }}
                    >
                    <X className="h-3 w-3" />
                    </motion.button>
                </Badge>
              )}
              
              {selectedCertifications.map(cert => (
                  <Badge key={cert} variant="secondary" className="flex items-center gap-1 animate-fadeIn">
                  {cert}
                    <motion.button 
                      onClick={() => toggleCertification(cert)}
                      whileTap={{ scale: 0.9 }}
                    >
                    <X className="h-3 w-3" />
                    </motion.button>
                </Badge>
              ))}
              
              {selectedPackaging.map(pkg => (
                  <Badge key={pkg} variant="secondary" className="flex items-center gap-1 animate-fadeIn">
                  {pkg}
                    <motion.button 
                      onClick={() => togglePackaging(pkg)}
                      whileTap={{ scale: 0.9 }}
                    >
                    <X className="h-3 w-3" />
                    </motion.button>
                </Badge>
              ))}
              
                {sustainableOnly && (
                  <Badge variant="secondary" className="flex items-center gap-1 animate-fadeIn bg-green-100 text-green-800 hover:bg-green-200">
                    Sustainable Only
                    <motion.button 
                      onClick={() => setSustainableOnly(false)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-3 w-3" />
                    </motion.button>
                  </Badge>
                )}
                
                <motion.div whileTap={{ scale: 0.95 }}>
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
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                  <div className="space-y-1 border-t pt-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <h4 className="text-sm font-medium">Sustainability</h4>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant={sustainableOnly ? "default" : "outline"}
                        size="sm"
                        className={`py-1 px-3 h-auto text-xs ${sustainableOnly ? "bg-green-600 text-white hover:bg-green-700" : ""}`}
                        onClick={() => setSustainableOnly(!sustainableOnly)}
                      >
                        Sustainable Only
                      </Button>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2 flex justify-between items-center">
                      <span>Categories</span>
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    </h4>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {categories.map(category => (
                        <motion.div key={category} whileTap={{ scale: 0.98 }}>
                          <Button
                            variant={activeCategory === category ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-sm h-8"
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </Button>
                        </motion.div>
                    ))}
                  </div>
                </div>
                
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2 flex justify-between items-center">
                      <span>Certifications</span>
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    </h4>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map(cert => (
                        <motion.div key={cert} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Badge
                        variant={selectedCertifications.includes(cert) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleCertification(cert)}
                      >
                        {cert}
                      </Badge>
                        </motion.div>
                    ))}
                  </div>
                </div>
                
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium mb-2 flex justify-between items-center">
                      <span>Packaging Type</span>
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </h4>
                  <div className="flex flex-wrap gap-2">
                    {packagingTypes.map(pkg => (
                        <motion.div key={pkg} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Badge
                        variant={selectedPackaging.includes(pkg) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => togglePackaging(pkg)}
                      >
                        {pkg}
                      </Badge>
                        </motion.div>
                    ))}
                  </div>
                </div>
                
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  variant="outline"
                  size="sm"
                      className="w-full mt-4"
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
        <DialogContent className="sm:max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  By {selectedProduct.manufacturer}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <div className="md:col-span-1 bg-muted rounded-lg p-4 flex items-center justify-center">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <img 
                      src={selectedProduct.image} 
                      alt={selectedProduct.name} 
                      className="w-32 h-32 object-contain"
                    />
                  </motion.div>
                </div>
                
                <div className="md:col-span-2 space-y-4">
                  <p className="text-foreground/80">{selectedProduct.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/70">Price</p>
                      <p className="font-semibold text-lg">{selectedProduct.price}</p>
                          </div>
                    <div>
                      <p className="text-sm text-foreground/70">Category</p>
                      <p className="font-medium">{selectedProduct.category}</p>
                            </div>
                    <div>
                      <p className="text-sm text-foreground/70">Minimum Order</p>
                      <p className="font-medium">{selectedProduct.minOrderQuantity} units</p>
                            </div>
                    <div>
                      <p className="text-sm text-foreground/70">Lead Time</p>
                      <p className="font-medium">{selectedProduct.leadTime}</p>
                          </div>
                        </div>
                  
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">Certifications</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.certifications.map((cert: string) => (
                        <Badge key={cert} variant="secondary">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">Packaging</p>
                    <Badge>{selectedProduct.packagingType}</Badge>
                  </div>
                  
                  {selectedProduct.sustainable && (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>Sustainable Product</span>
                    </div>
                  )}
            </div>
          </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => toggleFavorite(selectedProduct)}
                >
                  <Heart className="h-4 w-4 mr-2" fill={isFavorite(selectedProduct.id) ? "currentColor" : "none"} />
                  {isFavorite(selectedProduct.id) ? "Saved" : "Save"}
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowProductDetails(false)}>
                    Close
                  </Button>
                  <Button className="gap-1">
                    Find Match
                    <ArrowRight className="h-4 w-4" />
                  </Button>
        </div>
      </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;