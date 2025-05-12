import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Filter, 
  Search, 
  Globe, 
  Ship, 
  Clock, 
  Star, 
  ArrowRight, 
  Plus, 
  Building,
  ChevronDown,
  MapPin,
  CheckCircle,
  X,
  ShoppingBag
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import BrandLayout from "@/components/layouts/BrandLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";

// Mock brand partnership data
const brands = [
  {
    id: 1,
    name: "Green Earth Foods",
    category: "Organic Foods",
    status: "Active Partner",
    products: 12,
    relationship: "3 years",
    rating: 4.8,
    location: "Portland, OR",
    matchScore: 92,
    certifications: ["Organic", "Fair Trade", "B Corp"],
    description: "Leading producer of organic, sustainably-sourced food products with a focus on environmental responsibility and community support."
  },
  {
    id: 2,
    name: "Pure Wellness",
    category: "Health Supplements",
    status: "Active Partner",
    products: 8,
    relationship: "2 years",
    rating: 4.5,
    location: "Boulder, CO",
    matchScore: 90,
    certifications: ["Vegan", "Non-GMO"],
    description: "Premium health supplement brand offering scientifically-backed formulations made with natural ingredients and transparent sourcing."
  },
  {
    id: 3,
    name: "Natural Living",
    category: "Household Products",
    status: "Negotiating",
    products: 0,
    relationship: "Prospect",
    rating: 4.2,
    location: "Seattle, WA",
    matchScore: 85,
    certifications: ["Eco-Friendly", "Sustainable"],
    description: "Innovative household product line utilizing plant-based ingredients and sustainable packaging to create effective, eco-friendly solutions."
  },
  {
    id: 4,
    name: "Fresh Harvest",
    category: "Organic Foods",
    status: "Active Partner",
    products: 5,
    relationship: "1 year",
    rating: 4.6,
    location: "San Diego, CA",
    matchScore: 88,
    certifications: ["Organic", "Local Sourcing"],
    description: "Farm-to-table organic food company specializing in locally-sourced produce and artisanal preserved goods with minimal processing."
  },
  {
    id: 5,
    name: "Eco Essentials",
    category: "Sustainable Products",
    status: "Onboarding",
    products: 3,
    relationship: "New Partner",
    rating: 4.0,
    location: "Austin, TX",
    matchScore: 82,
    certifications: ["Recyclable", "Carbon Neutral"],
    description: "Sustainable lifestyle brand creating everyday essentials with innovative materials that reduce environmental impact without sacrificing quality."
  },
  {
    id: 6,
    name: "Vital Nutrition",
    category: "Health Supplements",
    status: "Inactive",
    products: 0,
    relationship: "Past Partner",
    rating: 3.7,
    location: "Chicago, IL",
    matchScore: 74,
    certifications: ["GMP", "Lab Tested"],
    description: "Nutritional supplement company focused on performance optimization and recovery support for active lifestyles and athletic performance."
  }
];

// Categories for brand filters
const brandCategories = [
  "Organic Foods",
  "Health Supplements",
  "Household Products",
  "Sustainable Products",
  "Beverages",
  "Personal Care"
];

const Brands = () => {
  const { isAuthenticated, user, role } = useUser();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // State for brand details modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<any | null>(null);
  
  // State for find brand modal
  const [isFindBrandOpen, setIsFindBrandOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    category: "",
    marketPresence: [] as string[],
    minRating: 0,
    productTypes: [] as string[],
    notes: ""
  });
  
  useEffect(() => {
    document.title = t("brands-title") + " - CPG Matchmaker";
    
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

  // Filter brands based on search query and filters
  const filteredBrands = brands.filter(brand => {
    const matchesSearch = 
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || brand.category === filterCategory;
    const matchesStatus = !filterStatus || brand.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterCategory(null);
    setFilterStatus(null);
  };

  // Open brand details
  const openBrandDetails = (brand: any) => {
    setSelectedBrand(brand);
    setIsDetailsOpen(true);
  };

  // Function to handle the find brand button click
  const openFindBrandModal = () => {
    setIsFindBrandOpen(true);
  };

  // Function to handle form reset
  const resetFindBrandForm = () => {
    setSearchCriteria({
      category: "",
      marketPresence: [],
      minRating: 0,
      productTypes: [],
      notes: ""
    });
  };

  // Function to handle form submission
  const handleFindBrand = () => {
    // In a real app, this would make an API call to search for brands
    console.log("Searching for brands with criteria:", searchCriteria);
    
    // For demo purposes, we'll just close the modal and show a success message
    setIsFindBrandOpen(false);
    
    toast({
      title: t("search-initiated"),
      description: t("search-description"),
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active Partner":
        return <Badge className="bg-green-500 hover:bg-green-600">{t("active-partner")}</Badge>;
      case "Negotiating":
        return <Badge variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-transparent">{t("negotiating")}</Badge>;
      case "Onboarding":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500 hover:bg-yellow-50 dark:hover:bg-transparent">{t("onboarding")}</Badge>;
      case "Inactive":
        return <Badge variant="secondary">{t("inactive")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getMatchScoreBadge = (score: number) => {
    let colorClass = "bg-green-500";
    if (score < 85) colorClass = "bg-yellow-500";
    if (score < 70) colorClass = "bg-red-500";
    
    return (
      <div className="flex items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${colorClass} mr-1.5`}></div>
        <span className="text-sm font-medium">{score}% {t("match")}</span>
      </div>
    );
  };

  // Function to generate star rating
  const getStarRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<span key={i} className="text-yellow-400">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300">★</span>);
      }
    }
    
    return (
      <div className="flex items-center">
        <div className="flex mr-1">{stars}</div>
        <span className="text-sm">{rating.toFixed(1)}</span>
      </div>
    );
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
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                  {t("brands-management")}
                </h1>
                <p className="text-muted-foreground">{user?.companyName} - {t("brands-find-manage")}</p>
              </div>
              
              <div className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="group">
                      <Filter className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      {t("filter")}
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">{t("category")}</p>
                      <div className="space-y-1">
                        {brandCategories.map(category => (
                          <div 
                            key={category}
                            className={cn(
                              "px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors",
                              filterCategory === category 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-muted"
                            )}
                            onClick={() => setFilterCategory(
                              filterCategory === category ? null : category
                            )}
                          >
                            {t(category.toLowerCase().replace(/\s+/g, '-'))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">{t("status")}</p>
                      <div className="space-y-1">
                        {["Active Partner", "Negotiating", "Onboarding", "Inactive"].map(status => (
                          <div 
                            key={status}
                            className={cn(
                              "px-2 py-1.5 text-sm rounded-md cursor-pointer transition-colors",
                              filterStatus === status 
                                ? "bg-primary text-primary-foreground" 
                                : "hover:bg-muted"
                            )}
                            onClick={() => setFilterStatus(
                              filterStatus === status ? null : status
                            )}
                          >
                            {t(status.toLowerCase().replace(/\s+/g, '-'))}
                          </div>
                        ))}
                      </div>
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
                <Button onClick={openFindBrandModal}>
                  <Plus className="mr-2 h-4 w-4" />
                  {t("find-brand-partners")}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder={t("brands-search-placeholder")} 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Brand partnerships grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence>
              {filteredBrands.map((brand, index) => (
                <motion.div
                  key={brand.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -5 }}
                >
                  <Card className={cn(
                    "overflow-hidden transition-all duration-200 h-full flex flex-col",
                    isDark 
                      ? "hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 bg-card/60" 
                      : "hover:border-primary/40 hover:shadow-md bg-background"
                  )}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            "h-10 w-10 rounded-full flex items-center justify-center overflow-hidden",
                            isDark ? "bg-primary/10" : "bg-primary/5"
                          )}>
                            <Building className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{brand.name}</CardTitle>
                            <CardDescription>{brand.category}</CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(brand.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 flex-grow">
                      <div className="space-y-3">
                        <div className="text-sm line-clamp-2 text-muted-foreground">
                          {brand.description}
                        </div>
                        
                        <div className="flex items-center text-sm space-x-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{brand.location}</span>
                        </div>
                        
                        {brand.status !== "Negotiating" && brand.status !== "Inactive" && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div className="flex flex-col">
                              <div className="text-xs text-muted-foreground mb-1">{t("products")}</div>
                              <Badge variant="outline">{brand.products}</Badge>
                            </div>
                            <div className="flex flex-col">
                              <div className="text-xs text-muted-foreground mb-1">{t("partner-for")}</div>
                              <div className="text-sm font-medium">{brand.relationship}</div>
                            </div>
                          </div>
                        )}
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {brand.certifications && brand.certifications.slice(0, 2).map((cert, idx) => (
                            <Badge variant="secondary" key={idx} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {cert}
                            </Badge>
                          ))}
                          {brand.certifications && brand.certifications.length > 2 && (
                            <Badge variant="outline">+{brand.certifications.length - 2} {t("more")}</Badge>
                          )}
                        </div>
                        
                        <div className="pt-1 flex justify-between items-center">
                          <div className="text-xs text-muted-foreground">{t("rating")}</div>
                          {getStarRating(brand.rating)}
                        </div>
                        
                        <div className="pt-1">
                          {getMatchScoreBadge(brand.matchScore)}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 py-4 bg-muted/30 border-t mt-auto">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 w-full justify-center hover:bg-background"
                        onClick={() => openBrandDetails(brand)}
                      >
                        {t("view-details")} <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Add new partner card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: filteredBrands.length * 0.05 }}
              whileHover={{ scale: 1.03 }}
            >
              <Card className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors duration-300"
                onClick={openFindBrandModal}
              >
                <CardContent className="pt-6 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-medium mb-2">{t("find-brand-partners-card")}</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {t("discover-complementary-brands")}
                  </p>
                  <Button variant="outline" size="sm" className="mt-2" onClick={(e) => {
                    e.stopPropagation(); // Prevent card click from triggering twice
                    openFindBrandModal();
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("start-search")}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
          
          {/* Empty state */}
          {filteredBrands.length === 0 && (
            <div className="col-span-full">
              <div className={cn(
                "rounded-lg border p-8 text-center",
                isDark ? "bg-card" : "bg-slate-50"
              )}>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <Building className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-medium">{t("no-brand-partners-found")}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {searchQuery || filterCategory || filterStatus 
                    ? t("try-adjusting-search") 
                    : t("get-started-brands")}
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  <Button 
                    variant="outline"
                    onClick={resetFilters}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    {t("reset-filters")}
                  </Button>
                  <Button onClick={openFindBrandModal}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t("find-partners")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Brand Details Modal */}
      {selectedBrand && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>{selectedBrand.name}</DialogTitle>
                {getStatusBadge(selectedBrand.status)}
              </div>
              <DialogDescription>
                {selectedBrand.category} • {selectedBrand.location}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-2">
              {/* Match Score */}
              <div className={cn(
                "p-4 rounded-lg border flex items-center justify-between",
                isDark ? "bg-card" : "bg-slate-50"
              )}>
                <div className="flex items-center">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center mr-4",
                    "bg-primary/10"
                  )}>
                    <Star className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-medium">{t("partnership-match-score")}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t("how-well-brand-complements")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-xl font-bold",
                    selectedBrand.matchScore >= 90 
                      ? "text-green-500" 
                      : selectedBrand.matchScore >= 75 
                        ? "text-yellow-500" 
                        : "text-red-500"
                  )}>
                    {selectedBrand.matchScore}%
                  </span>
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">{t("about")}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedBrand.description}
                </p>
              </div>
              
              {/* Certifications */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">{t("certifications")}</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBrand.certifications && selectedBrand.certifications.map((cert: string, idx: number) => (
                    <Badge key={idx} className="bg-primary/10 text-primary border-none">
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Partnership Stats */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">{t("partnership-stats")}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-card" : "bg-slate-50"
                  )}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("products")}</p>
                        <p className="text-xl font-bold">{selectedBrand.products}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedBrand.products > 0 
                        ? t("products-active-partner", { products: selectedBrand.products })
                        : t("no-active-products")}
                    </p>
                  </div>
                  
                  <div className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-card" : "bg-slate-50"
                  )}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Clock className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{t("relationship")}</p>
                        <p className="text-xl font-bold">{selectedBrand.relationship}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedBrand.status === "Active Partner" 
                        ? t("ongoing-active-partnership")
                        : selectedBrand.status === "Negotiating"
                        ? t("currently-negotiations")
                        : selectedBrand.status === "Onboarding"
                        ? t("partnership-establishing")
                        : t("partnership-inactive")}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Rating */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">{t("partner-rating")}</h3>
                <div className={cn(
                  "p-4 rounded-lg border",
                  isDark ? "bg-card" : "bg-slate-50"
                )}>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{t("overall-performance")}</p>
                    <div className="scale-110">
                      {getStarRating(selectedBrand.rating)}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("based-on-collaboration")}
                  </p>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setIsDetailsOpen(false)}
                className="mr-2"
              >
                {t("close")}
              </Button>
              <Button>
                {t("contact-brand")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Find Brand Modal */}
      <Dialog 
        open={isFindBrandOpen} 
        onOpenChange={(open) => {
          setIsFindBrandOpen(open);
          if (!open) resetFindBrandForm();
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>{t("find-brand-partners-modal")}</DialogTitle>
            <DialogDescription>
              {t("specify-partnership-requirements")}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                {t("product-category")} <span className="text-destructive">*</span>
              </Label>
              <Select
                value={searchCriteria.category}
                onValueChange={(value) => setSearchCriteria({...searchCriteria, category: value})}
              >
                <SelectTrigger id="category" className={!searchCriteria.category ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder={t("select-category")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("categories")}</SelectLabel>
                    {brandCategories.map(category => (
                      <SelectItem key={category} value={category}>{t(category.toLowerCase().replace(/\s+/g, '-'))}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Market Presence */}
            <div className="space-y-2">
              <Label className="text-base font-medium">{t("desired-market-presence")}</Label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  {key: "online", label: t("online")},
                  {key: "retail-stores", label: t("retail-stores")},
                  {key: "direct-to-consumer", label: t("direct-to-consumer")},
                  {key: "subscription", label: t("subscription")},
                  {key: "wholesale", label: t("wholesale")},
                  {key: "international", label: t("international")}
                ].map(market => (
                  <div 
                    key={market.key}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`market-${market.key}`}
                      checked={searchCriteria.marketPresence.includes(market.key)}
                      onCheckedChange={(checked) => {
                        const updatedMarkets = checked 
                          ? [...searchCriteria.marketPresence, market.key] 
                          : searchCriteria.marketPresence.filter(m => m !== market.key);
                        setSearchCriteria({...searchCriteria, marketPresence: updatedMarkets});
                      }}
                    />
                    <Label htmlFor={`market-${market.key}`} className="text-sm font-normal">
                      {market.label}
                    </Label>
                  </div>
                ))}
              </div>
              
              {searchCriteria.marketPresence.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-1 pt-2"
                >
                  {searchCriteria.marketPresence.map(market => (
                    <Badge key={market} variant="secondary" className="flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {t(market.replace(/\s+/g, '-'))}
                      <button 
                        className="ml-1 rounded-full hover:bg-secondary/80"
                        onClick={() => {
                          setSearchCriteria({
                            ...searchCriteria, 
                            marketPresence: searchCriteria.marketPresence.filter(m => m !== market)
                          });
                        }}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </motion.div>
              )}
            </div>
            
            {/* Minimum Rating */}
            <div className="space-y-2">
              <Label htmlFor="minRating" className="text-base font-medium">
                {t("minimum-brand-rating")}
              </Label>
              <Select
                value={searchCriteria.minRating.toString()}
                onValueChange={(value) => setSearchCriteria({...searchCriteria, minRating: Number(value)})}
              >
                <SelectTrigger id="minRating">
                  <SelectValue placeholder={t("select-minimum-rating")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">{t("any-rating")}</SelectItem>
                  <SelectItem value="3">3+ {t("stars")}</SelectItem>
                  <SelectItem value="3.5">3.5+ {t("stars")}</SelectItem>
                  <SelectItem value="4">4+ {t("stars")}</SelectItem>
                  <SelectItem value="4.5">4.5+ {t("stars")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Product Types */}
            <div className="space-y-2">
              <Label className="text-base font-medium">{t("product-types")}</Label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {[
                  {key: "complementary", label: t("complementary")},
                  {key: "bundleable", label: t("bundleable")},
                  {key: "cross-promotional", label: t("cross-promotional")},
                  {key: "co-branded", label: t("co-branded")},
                  {key: "white-label", label: t("white-label")},
                  {key: "distribution", label: t("distribution")}
                ].map(type => (
                  <div 
                    key={type.key}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`type-${type.key}`}
                      checked={searchCriteria.productTypes.includes(type.key)}
                      onCheckedChange={(checked) => {
                        const updatedTypes = checked 
                          ? [...searchCriteria.productTypes, type.key] 
                          : searchCriteria.productTypes.filter(t => t !== type.key);
                        setSearchCriteria({...searchCriteria, productTypes: updatedTypes});
                      }}
                    />
                    <Label htmlFor={`type-${type.key}`} className="text-sm font-normal">
                      {type.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-medium">
                {t("partnership-goals")}
              </Label>
              <Textarea 
                id="notes" 
                placeholder={t("partnership-goals-placeholder")}
                rows={4}
                value={searchCriteria.notes}
                onChange={(e) => setSearchCriteria({...searchCriteria, notes: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline"
              onClick={() => setIsFindBrandOpen(false)}
              className="mr-2"
            >
              {t("cancel")}
            </Button>
            <Button 
              onClick={handleFindBrand}
              disabled={!searchCriteria.category}
            >
              <Search className="h-4 w-4 mr-2" />
              {t("find-partners")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BrandLayout>
  );
};

export default Brands;
