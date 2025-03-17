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
import { useTranslation } from "react-i18next";

// Define Product type to fix linter error
type Product = {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  image: string;
  price: string;
  certifications: string[];
  rating: number;
  packagingType: string;
  description: string;
  minOrderQuantity: number;
  leadTime: string;
  sustainable: boolean;
};

// Define Manufacturer type to match FavoriteContext
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

// Internationalized mock product data function
const getLocalizedProducts = (t: any): Product[] => [
  {
    id: 1,
    name: t('product-name-organic-granola', 'Organic Granola'),
    category: t('category-breakfast-foods', 'Breakfast Foods'),
    manufacturer: t('manufacturer-natures-best', 'Nature\'s Best'),
    image: "/placeholder.svg",
    price: "$4.99",
    certifications: [
      t('certification-organic', 'Organic'),
      t('certification-non-gmo', 'Non-GMO')
    ],
    rating: 4.5,
    packagingType: t('packaging-cardboard-box', 'Cardboard Box'),
    description: t('product-desc-organic-granola', 'Delicious organic granola made with whole grain oats, honey, and mixed nuts. Perfect for breakfast or as a healthy snack.'),
    minOrderQuantity: 100,
    leadTime: t('lead-time-2-3-weeks', '2-3 weeks'),
    sustainable: true
  },
  {
    id: 2,
    name: t('product-name-premium-coffee', 'Premium Coffee Beans'),
    category: t('category-beverages', 'Beverages'),
    manufacturer: t('manufacturer-mountain-roasters', 'Mountain Roasters'),
    image: "/placeholder.svg",
    price: "$12.99",
    certifications: [
      t('certification-fair-trade', 'Fair Trade'),
      t('certification-organic', 'Organic')
    ],
    rating: 4.8,
    packagingType: t('packaging-resealable-bag', 'Resealable Bag'),
    description: t('product-desc-premium-coffee', 'Premium arabica coffee beans sourced from high-altitude farms. Medium roast with notes of chocolate and caramel.'),
    minOrderQuantity: 50,
    leadTime: t('lead-time-1-2-weeks', '1-2 weeks'),
    sustainable: true
  },
  {
    id: 3,
    name: t('product-name-almond-butter', 'Almond Butter'),
    category: t('category-spreads', 'Spreads'),
    manufacturer: t('manufacturer-pure-foods', 'Pure Foods Co.'),
    image: "/placeholder.svg",
    price: "$7.99",
    certifications: [
      t('certification-non-gmo', 'Non-GMO'),
      t('certification-gluten-free', 'Gluten-Free')
    ],
    rating: 4.2,
    packagingType: t('packaging-glass-jar', 'Glass Jar'),
    description: t('product-desc-almond-butter', 'Creamy almond butter made from dry roasted almonds. No added sugar or preservatives.'),
    minOrderQuantity: 75,
    leadTime: t('lead-time-2-weeks', '2 weeks'),
    sustainable: false
  },
  {
    id: 4,
    name: t('product-name-protein-bars', 'Protein Bars'),
    category: t('category-snacks', 'Snacks'),
    manufacturer: t('manufacturer-fitness-nutrition', 'Fitness Nutrition'),
    image: "/placeholder.svg",
    price: "$2.49",
    certifications: [
      t('certification-high-protein', 'High-Protein'),
      t('certification-low-sugar', 'Low-Sugar')
    ],
    rating: 4.0,
    packagingType: t('packaging-wrapper', 'Wrapper'),
    description: t('product-desc-protein-bars', 'High-protein bars with 20g of protein per serving. Great for post-workout recovery or a quick snack on the go.'),
    minOrderQuantity: 200,
    leadTime: t('lead-time-1-week', '1 week'),
    sustainable: false
  },
  {
    id: 5,
    name: t('product-name-sparkling-water', 'Sparkling Water'),
    category: t('category-beverages', 'Beverages'),
    manufacturer: t('manufacturer-clear-springs', 'Clear Springs'),
    image: "/placeholder.svg",
    price: "$1.29",
    certifications: [
      t('certification-zero-calorie', 'Zero-Calorie')
    ],
    rating: 4.3,
    packagingType: t('packaging-aluminum-can', 'Aluminum Can'),
    description: t('product-desc-sparkling-water', 'Refreshing sparkling water with natural flavors. Zero calories, zero sweeteners, and zero sodium.'),
    minOrderQuantity: 300,
    leadTime: t('lead-time-1-2-weeks', '1-2 weeks'),
    sustainable: true
  },
  {
    id: 6,
    name: t('product-name-dried-fruit-mix', 'Dried Fruit Mix'),
    category: t('category-snacks', 'Snacks'),
    manufacturer: t('manufacturer-harvest-farms', 'Harvest Farms'),
    image: "/placeholder.svg",
    price: "$5.49",
    certifications: [
      t('certification-no-added-sugar', 'No Added Sugar'),
      t('certification-organic', 'Organic')
    ],
    rating: 4.6,
    packagingType: t('packaging-resealable-pouch', 'Resealable Pouch'),
    description: t('product-desc-dried-fruit-mix', 'A delicious mix of organic dried fruits, including apples, cranberries, and mangoes. Perfect for snacking or baking.'),
    minOrderQuantity: 100,
    leadTime: t('lead-time-1-3-weeks', '1-3 weeks'),
    sustainable: true
  }
];

// Category options
const categoryOptions = [
  "all-categories",
  "breakfast-foods",
  "beverages",
  "snacks",
  "spreads",
  "condiments",
  "dairy-alternatives",
  "baking"
];

const Products = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

// Certification options
const certifications = [
    t('certification-organic', 'Organic'),
    t('certification-non-gmo', 'Non-GMO'),
    t('certification-gluten-free', 'Gluten-Free'),
    t('certification-fair-trade', 'Fair Trade'),
    t('certification-no-added-sugar', 'No Added Sugar'),
    t('certification-high-protein', 'High-Protein'),
    t('certification-low-sugar', 'Low-Sugar'),
    t('certification-zero-calorie', 'Zero-Calorie')
];

// Packaging types
const packagingTypes = [
    t('packaging-cardboard-box', 'Cardboard Box'),
    t('packaging-glass-jar', 'Glass Jar'),
    t('packaging-aluminum-can', 'Aluminum Can'),
    t('packaging-plastic-bottle', 'Plastic Bottle'),
    t('packaging-resealable-bag', 'Resealable Bag'),
    t('packaging-resealable-pouch', 'Resealable Pouch'),
    t('packaging-wrapper', 'Wrapper'),
    t('packaging-tetra-pak', 'Tetra Pak')
];

// Sort options
const sortOptions = [
    { label: t('sort-relevance', 'Relevance'), value: "relevance" },
    { label: t('sort-price-low-high', 'Price: Low to High'), value: "price-asc" },
    { label: t('sort-price-high-low', 'Price: High to Low'), value: "price-desc" },
    { label: t('sort-rating', 'Rating: High to Low'), value: "rating-desc" },
    { label: t('sort-name-asc', 'Name: A to Z'), value: "name-asc" },
    { label: t('sort-name-desc', 'Name: Z to A'), value: "name-desc" }
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

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  // Use localized products
  const [products, setProducts] = useState<Product[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  // Store category key instead of translated text
  const [activeCategory, setActiveCategory] = useState("all-categories");
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

  // Wrapper function to convert Product to Manufacturer for toggleFavorite
  const handleToggleFavorite = (product: Product) => {
    // Convert product to match Manufacturer interface
    const manufacturer: Manufacturer = {
      id: product.id,
      name: product.name,
      location: '',  // Default value
      logo: product.image,
      categories: [product.category],
      certifications: product.certifications,
      minOrderSize: product.minOrderQuantity.toString(),
      establishedYear: new Date().getFullYear(), // Default value
      rating: product.rating
    };
    
    toggleFavorite(manufacturer);
  };

  // Initialize localized products on component mount
  useEffect(() => {
    const localizedProducts = getLocalizedProducts(t);
    setProducts(localizedProducts);
  }, [t]);

  // Page title effect
  useEffect(() => {
    document.title = searchParams.get("view") === "favorites" 
      ? t('my-favorites-title', "My Favorites - CPG Matchmaker") 
      : t('browse-products-title', "Browse Products - CPG Matchmaker");
  }, [searchParams, t]);

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
      const localizedProducts = getLocalizedProducts(t);
      const product = localizedProducts.find(p => p.id === productId);
      if (product) {
        handleProductDetailsClick(product);
      }
    }

    // View favorites if that view is requested  
    if (searchParams.get("view") === "favorites") {
      // Set page title for favorites view
      document.title = t('my-favorites-title', "My Favorites - CPG Matchmaker");
    }
  }, [searchParams, isLoading, t]);

  // Filter and sort products
  useEffect(() => {
    let localizedProducts = getLocalizedProducts(t);
    let filteredProducts = [...localizedProducts];

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
      if (activeCategory !== "all-categories") {
      filteredProducts = filteredProducts.filter(
          product => product.category === t(`category-${activeCategory}`, activeCategory)
      );
    }

    // Filter by certifications
    if (selectedCertifications.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedCertifications.every(cert => 
            product.certifications.includes(t(`certification-${cert.toLowerCase().replace(/[\s-]+/g, '-')}`, cert))
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
      searchParams, isFavorite, priceRange, minOrder, selectedLeadTime, inStockOnly, newArrivalsOnly, minRating, t]);

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
    setActiveCategory("all-categories");
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
          <p className="text-lg text-foreground/70 mb-2">{t('no-products-found', 'No products found matching your criteria.')}</p>
          <p className="text-sm text-muted-foreground mb-6">{t('adjust-filters', 'Try adjusting your filters or search terms.')}</p>
          <Button variant="outline" onClick={clearFilters}>
            {t('clear-all-filters', 'Clear All Filters')}
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
                onFavoriteToggle={() => handleToggleFavorite(product)}
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
                        <p>{t('sustainable-product', 'Sustainable Product')}</p>
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
                      onClick={() => handleToggleFavorite(product)}
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
                      {t('details', 'Details')}
                    </Button>
                    <Button size="sm">
                      {t('match', 'Match')}
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
                {searchParams.get("view") === "favorites" 
                  ? t('my-favorites', "My Favorites") 
                  : t('browse-products', "Browse Products")}
              </h1>
              <p className="text-foreground/70">
                {searchParams.get("view") === "favorites" 
                  ? t('saved-products-description', "Products you've saved for later") 
                  : t('discover-products-description', "Discover the perfect products for your CPG business")}
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
                    {t('sort', 'Sort')}: {t(`sort-option-${sortOptions.find(option => option.value === sortBy)?.value}`, sortOptions.find(option => option.value === sortBy)?.label)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>{t('sort-by', 'Sort by')}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {sortOptions.map(option => (
                    <DropdownMenuItem 
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={sortBy === option.value ? "bg-muted" : ""}
                    >
                      {t(`sort-option-${option.value}`, option.label)}
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
                {t('filters', 'Filters')}
                {(selectedCertifications.length > 0 || selectedPackaging.length > 0 || activeCategory !== "all-categories" || sustainableOnly) && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCertifications.length + selectedPackaging.length + (activeCategory !== "all-categories" ? 1 : 0) + (sustainableOnly ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              
              <Tabs defaultValue={activeView} onValueChange={setActiveView} className="w-auto">
                <TabsList className="grid w-[120px] grid-cols-2">
                  <TabsTrigger value="grid">{t('grid-view', 'Grid')}</TabsTrigger>
                  <TabsTrigger value="list">{t('list-view', 'List')}</TabsTrigger>
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
                placeholder={t('search-placeholder', 'Search products, manufacturers, or categories...')}
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
                {t('advanced-search', 'Advanced')}
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
                        {t('product-rating', 'Product Rating')}
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
                        {t('price-range', 'Price Range')}
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
                        {t('lead-time', 'Lead Time')}
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          t('lead-time-1-week', '1 week'),
                          t('lead-time-2-weeks', '2 weeks'),
                          t('lead-time-3-weeks', '3 weeks'),
                          t('lead-time-4plus-weeks', '4+ weeks')
                        ].map((time) => (
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
                            {t(`lead-time-${time.replace(/\s+/g, '-').replace('+', 'plus')}`, time)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Minimum Order */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-purple-500" />
                        {t('minimum-order', 'Minimum Order')}
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
                          <span className="text-sm font-medium text-purple-600">{minOrder} {t('units', 'units')}</span>
                          <span className="text-sm font-medium text-purple-600">5K+ {t('units', 'units')}</span>
                        </div>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="col-span-full space-y-3">
                      <Label className="text-sm font-medium flex items-center gap-2">
                        <Award className="h-4 w-4 text-amber-500" />
                        {t('certifications', 'Certifications')}
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
                            {t(`certification-${cert.toLowerCase().replace(/[\s-]+/g, '-')}`, cert)}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="col-span-full border-t pt-4 mt-2">
                      <Label className="text-sm font-medium flex items-center gap-2 mb-4">
                        <Filter className="h-4 w-4 text-gray-600" />
                        {t('additional-filters', 'Additional Filters')}
                      </Label>
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="inStock" checked={inStockOnly} onCheckedChange={setInStockOnly} />
                            <Label htmlFor="inStock" className="text-sm flex items-center gap-2">
                              <Package className="h-4 w-4 text-green-500" />
                              {t('in-stock-only', 'In Stock Only')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="newArrivals" checked={newArrivalsOnly} onCheckedChange={setNewArrivalsOnly} />
                            <Label htmlFor="newArrivals" className="text-sm flex items-center gap-2">
                              <Star className="h-4 w-4 text-orange-500" />
                              {t('new-arrivals-only', 'New Arrivals Only')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="customization" checked={hasCustomization} onCheckedChange={setHasCustomization} />
                            <Label htmlFor="customization" className="text-sm flex items-center gap-2">
                              <Building2 className="h-4 w-4 text-indigo-500" />
                              {t('customization-available', 'Customization Available')}
                            </Label>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Switch id="sustainable" checked={sustainableOnly} onCheckedChange={setSustainableOnly} />
                            <Label htmlFor="sustainable" className="text-sm flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                              {t('sustainable-only', 'Sustainable Only')}
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3">
                            <Switch id="samples" checked={hasSamples} onCheckedChange={setHasSamples} />
                            <Label htmlFor="samples" className="text-sm flex items-center gap-2">
                              <Package className="h-4 w-4 text-blue-500" />
                              {t('sample-available', 'Sample Available')}
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
                      {t('reset-all', 'Reset All')}
                    </Button>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAdvancedSearch(false)}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        {t('cancel', 'Cancel')}
                      </Button>
                      <Button
                        onClick={applyAdvancedFilters}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                      >
                        <Filter className="h-4 w-4" />
                        {t('apply-filters', 'Apply Filters')}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* Active filters */}
          <AnimatePresence>
            {(selectedCertifications.length > 0 || selectedPackaging.length > 0 || activeCategory !== "all-categories" || sustainableOnly) && (
              <motion.div 
                className="mb-6 flex flex-wrap items-center gap-2"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-sm text-foreground/70">{t('active-filters', 'Active filters:')}</span>
                
                {activeCategory !== "all-categories" && (
                  <Badge variant="secondary" className="flex items-center gap-1 animate-fadeIn">
                    {t(`category-${activeCategory}`, activeCategory)}
                    <motion.button 
                      onClick={() => setActiveCategory("all-categories")}
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
                    {t('sustainable-only', 'Sustainable Only')}
                    <motion.button 
                      onClick={() => setSustainableOnly(false)}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X className="h-3 w-3" />
                    </motion.button>
                  </Badge>
                )}
                
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {t('clear-all', 'Clear all')}
              </Button>
                </motion.div>
              </motion.div>
          )}
          </AnimatePresence>
          
          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Filter sidebar */}
            {showFilters && (
              <div className="md:col-span-1">
                <div className="bg-card rounded-lg border shadow-sm p-4">
                  <h3 className="font-medium mb-3">{t('categories', 'Categories')}</h3>
                  <div className="space-y-2">
                    {categoryOptions.map((category) => (
                      <div 
                        key={category}
                        className={`px-3 py-2 rounded-md cursor-pointer transition-colors ${
                          activeCategory === category 
                            ? 'bg-primary/10 text-primary font-medium' 
                            : 'hover:bg-muted'
                        }`}
                        onClick={() => setActiveCategory(category)}
                      >
                        {t(`category-${category}`, category)}
                  </div>
                    ))}
                  </div>
                </div>
                  </div>
            )}
            
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
                  {t('by-manufacturer', 'By {{manufacturer}}', { manufacturer: selectedProduct.manufacturer })}
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
                      <p className="text-sm text-foreground/70">{t('price', 'Price')}</p>
                      <p className="font-semibold text-lg">{selectedProduct.price}</p>
                          </div>
                    <div>
                      <p className="text-sm text-foreground/70">{t('category', 'Category')}</p>
                      <p className="font-medium">{selectedProduct.category}</p>
                            </div>
                    <div>
                      <p className="text-sm text-foreground/70">{t('minimum-order', 'Minimum Order')}</p>
                      <p className="font-medium">{selectedProduct.minOrderQuantity} {t('units', 'units')}</p>
                            </div>
                    <div>
                      <p className="text-sm text-foreground/70">{t('lead-time', 'Lead Time')}</p>
                      <p className="font-medium">{selectedProduct.leadTime}</p>
                          </div>
                        </div>
                  
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">{t('certifications', 'Certifications')}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.certifications.map((cert: string) => (
                        <Badge key={cert} variant="secondary">
                          {t(`certification-${cert.toLowerCase().replace(/[\s-]+/g, '-')}`, cert)}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-foreground/70 mb-1">{t('packaging', 'Packaging')}</p>
                    <Badge>{selectedProduct.packagingType}</Badge>
                  </div>
                  
                  {selectedProduct.sustainable && (
                    <div className="flex items-center gap-2 text-green-600 font-medium">
                      <CheckCircle2 className="h-5 w-5" />
                      <span>{t('sustainable-product', 'Sustainable Product')}</span>
                    </div>
                  )}
            </div>
          </div>
              
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => handleToggleFavorite(selectedProduct)}
                >
                  <Heart className="h-4 w-4 mr-2" fill={isFavorite(selectedProduct.id) ? "currentColor" : "none"} />
                  {isFavorite(selectedProduct.id) ? t('saved', 'Saved') : t('save', 'Save')}
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowProductDetails(false)}>
                    {t('close', 'Close')}
                  </Button>
                  <Button className="gap-1">
                    {t('find-match', 'Find Match')}
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