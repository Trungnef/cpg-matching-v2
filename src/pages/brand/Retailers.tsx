import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Filter, 
  Search, 
  Building, 
  ArrowRight, 
  Plus, 
  MapPin, 
  CheckCircle, 
  Star, 
  ChevronDown,
  X,
  ShoppingBag,
  Users,
  Globe
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

// Retailer interface type
interface Retailer {
  id: number;
  name: string;
  category: string;
  status: string;
  location: string;
  storeCount: number;
  consumerBase: string;
  matchScore: number;
  distribution: string[];
  description: string;
}

// Mock retailer data
const retailers: Retailer[] = [
  {
    id: 1,
    name: "Organic Marketplace",
    category: "Specialty Retail",
    status: "Active Partner",
    location: "Multiple Locations, Western US",
    storeCount: 25,
    consumerBase: "Health-conscious, affluent consumers",
    matchScore: 95,
    distribution: ["In-store", "Online"],
    description: "Premium natural and organic retailer with strong focus on sustainability and local sourcing. Caters to environmentally conscious consumers seeking high-quality products."
  },
  {
    id: 2,
    name: "Wellness World",
    category: "Health & Nutrition",
    status: "Active Partner",
    location: "Nationwide, US",
    storeCount: 85,
    consumerBase: "Fitness enthusiasts, health-oriented",
    matchScore: 92,
    distribution: ["In-store", "Online", "Subscription"],
    description: "Major health products retailer specializing in supplements, natural foods, and wellness products. Strong brand reputation with dedicated customer loyalty program."
  },
  {
    id: 3,
    name: "Fresh & Local Markets",
    category: "Grocery",
    status: "Negotiating",
    location: "Northeast Region, US",
    storeCount: 42,
    consumerBase: "Community-focused shoppers",
    matchScore: 87,
    distribution: ["In-store"],
    description: "Regional grocery chain focused on locally-sourced products and community engagement. Known for featuring small brands and supporting local businesses."
  },
  {
    id: 4,
    name: "GreenEssentials",
    category: "Specialty Retail",
    status: "Potential Match",
    location: "West Coast, US",
    storeCount: 18,
    consumerBase: "Eco-conscious millennials",
    matchScore: 89,
    distribution: ["In-store", "Online", "Marketplace"],
    description: "Eco-friendly retailer specializing in sustainable products. Rapidly expanding presence in urban centers with strong digital engagement and social media following."
  },
  {
    id: 5,
    name: "NaturalChoices",
    category: "Health & Nutrition",
    status: "Potential Match",
    location: "Midwest, US",
    storeCount: 32,
    consumerBase: "Health-oriented families",
    matchScore: 84,
    distribution: ["In-store", "Online"],
    description: "Family-oriented natural products retailer with a focus on educational content and community building. Strong presence in suburban areas."
  },
  {
    id: 6,
    name: "Vitality Stores",
    category: "Health & Nutrition",
    status: "Onboarding",
    location: "Southeast Region, US",
    storeCount: 15,
    consumerBase: "Wellness-focused professionals",
    matchScore: 90,
    distribution: ["In-store", "Online", "Mobile App"],
    description: "Up-and-coming health retailer with innovative technology integration and personalized shopping experiences. Rapidly expanding their product catalog."
  }
];

// Categories for filters
const retailerCategories = [
  "Specialty Retail",
  "Health & Nutrition",
  "Grocery",
  "Department Store",
  "Convenience",
  "E-commerce"
];

const Retailers = () => {
  const { isAuthenticated, user, role } = useUser();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // State for retailer details modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedRetailer, setSelectedRetailer] = useState<Retailer | null>(null);
  
  // State for find retailer modal
  const [isFindRetailerOpen, setIsFindRetailerOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    category: "",
    regions: [] as string[],
    minStores: 0,
    distribution: [] as string[],
    notes: ""
  });
  
  useEffect(() => {
    document.title = "Retail Partners - CPG Matchmaker";
    
    // If not authenticated or not a brand, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "brand") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);

  if (!isAuthenticated || role !== "brand") {
    return null;
  }

  // Filter retailers based on search query and filters
  const filteredRetailers = retailers.filter(retailer => {
    const matchesSearch = 
      retailer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      retailer.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || retailer.category === filterCategory;
    const matchesStatus = !filterStatus || retailer.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterCategory(null);
    setFilterStatus(null);
  };

  // Open retailer details
  const openRetailerDetails = (retailer: Retailer) => {
    setSelectedRetailer(retailer);
    setIsDetailsOpen(true);
  };

  // Function to handle the find retailer button click
  const openFindRetailerModal = () => {
    setIsFindRetailerOpen(true);
  };

  // Function to handle form reset
  const resetFindRetailerForm = () => {
    setSearchCriteria({
      category: "",
      regions: [],
      minStores: 0,
      distribution: [],
      notes: ""
    });
  };

  // Function to handle form submission
  const handleFindRetailer = () => {
    // In a real app, this would make an API call to search for retailers
    console.log("Searching for retailers with criteria:", searchCriteria);
    
    // For demo purposes, we'll just close the modal and show a success message
    setIsFindRetailerOpen(false);
    
    toast({
      title: "Search initiated",
      description: `We're looking for retailers that match your distribution requirements. You'll be notified when we find potential partners.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active Partner":
        return <Badge className="bg-green-500 hover:bg-green-600">Active Partner</Badge>;
      case "Negotiating":
        return <Badge variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-transparent">Negotiating</Badge>;
      case "Onboarding":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500 hover:bg-yellow-50 dark:hover:bg-transparent">Onboarding</Badge>;
      case "Potential Match":
        return <Badge variant="outline" className="text-purple-500 border-purple-500 hover:bg-purple-50 dark:hover:bg-transparent">Potential Match</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getMatchScoreBadge = (score: number) => {
    let colorClass = "bg-green-500";
    if (score < 85) colorClass = "bg-yellow-500";
    if (score < 75) colorClass = "bg-red-500";
    
    return (
      <div className="flex items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${colorClass} mr-1.5`}></div>
        <span className="text-sm font-medium">{score}% Match</span>
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
                <motion.h1 
                  className="text-3xl font-bold"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text">
                  Retailers Management
                </h1>
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {user?.companyName} - Find and manage retailer partnerships to expand your distribution
                </motion.p>
              </div>
              
              <motion.div
                className="flex gap-2"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="group">
                      <Filter className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Filter
                      <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Category</p>
                      <div className="space-y-1">
                        {retailerCategories.map(category => (
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
                            {category}
                          </div>
                        ))}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="p-2">
                      <p className="text-sm font-medium mb-2">Status</p>
                      <div className="space-y-1">
                        {["Active Partner", "Negotiating", "Onboarding", "Potential Match"].map(status => (
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
                            {status}
                          </div>
                        ))}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="justify-center text-center cursor-pointer"
                      onClick={resetFilters}
                    >
                      Reset Filters
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button className="group" onClick={openFindRetailerModal}>
                  <Plus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Find Retailers
                </Button>
              </motion.div>
            </div>
          </div>
          
          {/* Search */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search retailers, categories, or locations..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
          
          {/* Retailers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence>
              {filteredRetailers.map((retailer, index) => (
                <motion.div
                  key={retailer.id}
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
                            <Store className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg line-clamp-1">{retailer.name}</CardTitle>
                            <CardDescription>{retailer.category}</CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(retailer.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 flex-grow">
                      <div className="space-y-3">
                        <div className="text-sm line-clamp-2 text-muted-foreground">
                          {retailer.description}
                        </div>
                        
                        <div className="flex items-center text-sm space-x-1 text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{retailer.location}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <div className="flex flex-col">
                            <div className="text-xs text-muted-foreground mb-1">Store Count</div>
                            <Badge variant="outline" className="w-fit">{retailer.storeCount}</Badge>
                          </div>
                          <div className="flex flex-col">
                            <div className="text-xs text-muted-foreground mb-1">Distribution</div>
                            <div className="flex flex-wrap gap-1">
                              {retailer.distribution.slice(0, 2).map((type, idx) => (
                                <Badge key={idx} variant="secondary" className="text-xs">{type}</Badge>
                              ))}
                              {retailer.distribution.length > 2 && (
                                <Badge variant="outline" className="text-xs">+{retailer.distribution.length - 2}</Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-2">
                          {getMatchScoreBadge(retailer.matchScore)}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 py-4 bg-muted/30 border-t mt-auto">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 w-full justify-center hover:bg-background"
                        onClick={() => openRetailerDetails(retailer)}
                      >
                        View Details <ArrowRight className="h-4 w-4 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
              
              {/* Add new retailer card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: filteredRetailers.length * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className={cn(
                  "flex flex-col items-center justify-center h-full border-dashed cursor-pointer transition-colors duration-300",
                  isDark 
                    ? "hover:border-primary hover:bg-primary/5" 
                    : "hover:border-primary hover:bg-primary/5"
                )}
                onClick={openFindRetailerModal}
                >
                  <CardContent className="pt-6 flex flex-col items-center">
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center mb-4",
                      "bg-primary/10"
                    )}>
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Find Retail Partners</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Discover retail outlets to expand your product distribution
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering twice
                      openFindRetailerModal();
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Start Search
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
            
            {/* Empty state */}
            {filteredRetailers.length === 0 && (
              <div className="col-span-full">
                <div className={cn(
                  "rounded-lg border p-8 text-center",
                  isDark ? "bg-card" : "bg-slate-50"
                )}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Store className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No retail partners found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery || filterCategory || filterStatus 
                      ? "Try adjusting your search or filter criteria." 
                      : "Get started by finding new retail partners for your products."}
                  </p>
                  <div className="flex justify-center gap-3 mt-4">
                    <Button 
                      variant="outline"
                      onClick={resetFilters}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Reset Filters
                    </Button>
                    <Button onClick={openFindRetailerModal}>
                      <Plus className="mr-2 h-4 w-4" />
                      Find Retailers
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Retailer Details Modal */}
      {selectedRetailer && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>{selectedRetailer.name}</DialogTitle>
                {getStatusBadge(selectedRetailer.status)}
              </div>
              <DialogDescription>
                {selectedRetailer.category} • {selectedRetailer.location}
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
                    <h3 className="font-medium">Partnership Match Score</h3>
                    <p className="text-sm text-muted-foreground">
                      How well this retailer matches your distribution goals
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-xl font-bold",
                    selectedRetailer.matchScore >= 90 
                      ? "text-green-500" 
                      : selectedRetailer.matchScore >= 80 
                        ? "text-yellow-500" 
                        : "text-red-500"
                  )}>
                    {selectedRetailer.matchScore}%
                  </span>
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">About</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedRetailer.description}
                </p>
              </div>
              
              {/* Retailer Stats */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">Retailer Profile</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-card" : "bg-slate-50"
                  )}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Store className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Store Locations</p>
                        <p className="text-xl font-bold">{selectedRetailer.storeCount}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedRetailer.storeCount > 50 
                        ? "Large retail network with national presence" 
                        : selectedRetailer.storeCount > 20
                        ? "Mid-sized regional retailer"
                        : "Specialty retailer with curated locations"}
                    </p>
                  </div>
                  
                  <div className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-card" : "bg-slate-50"
                  )}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Consumer Base</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {selectedRetailer.consumerBase}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Distribution Channels */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">Distribution Channels</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRetailer.distribution.map((channel, idx) => (
                    <Badge key={idx} className="bg-primary/10 text-primary border-none">
                      <Globe className="h-3.5 w-3.5 mr-1.5" />
                      {channel}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {selectedRetailer.status === "Active Partner" 
                    ? "Your products are currently distributed through these channels" 
                    : "Potential distribution channels for your products"}
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline"
                onClick={() => setIsDetailsOpen(false)}
                className="mr-2"
              >
                Close
              </Button>
              <Button>
                {selectedRetailer.status === "Active Partner" ? "Manage Partnership" : "Initiate Contact"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Find Retailer Modal */}
      <Dialog 
        open={isFindRetailerOpen} 
        onOpenChange={(open) => {
          setIsFindRetailerOpen(open);
          if (!open) resetFindRetailerForm();
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Find Retail Partners</DialogTitle>
            <DialogDescription>
              Specify your distribution requirements to find retailers that match your brand's needs
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                Retailer Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={searchCriteria.category}
                onValueChange={(value) => setSearchCriteria({...searchCriteria, category: value})}
              >
                <SelectTrigger id="category" className={!searchCriteria.category ? "text-muted-foreground" : ""}>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Categories</SelectLabel>
                    {retailerCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Regions */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Target Regions</Label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {["Northeast US", "Southeast US", "Midwest US", "Southwest US", "West Coast US", "Canada", "International"].map(region => (
                  <div 
                    key={region}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`region-${region}`}
                      checked={searchCriteria.regions.includes(region)}
                      onCheckedChange={(checked) => {
                        const updatedRegions = checked 
                          ? [...searchCriteria.regions, region] 
                          : searchCriteria.regions.filter(r => r !== region);
                        setSearchCriteria({...searchCriteria, regions: updatedRegions});
                      }}
                    />
                    <Label htmlFor={`region-${region}`} className="text-sm font-normal">
                      {region}
                    </Label>
                  </div>
                ))}
              </div>
              
              {searchCriteria.regions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-1 pt-2"
                >
                  {searchCriteria.regions.map(region => (
                    <Badge key={region} variant="secondary" className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {region}
                      <button 
                        className="ml-1 rounded-full hover:bg-secondary/80"
                        onClick={() => {
                          setSearchCriteria({
                            ...searchCriteria, 
                            regions: searchCriteria.regions.filter(r => r !== region)
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
            
            {/* Minimum Store Count */}
            <div className="space-y-2">
              <Label htmlFor="minStores" className="text-base font-medium">
                Minimum Store Count
              </Label>
              <Input 
                id="minStores" 
                type="number"
                placeholder="Enter minimum number of stores"
                value={searchCriteria.minStores || ''}
                onChange={(e) => setSearchCriteria({...searchCriteria, minStores: parseInt(e.target.value) || 0})}
              />
            </div>
            
            {/* Distribution Channels */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Desired Distribution Channels</Label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {["In-store", "Online", "Marketplace", "Subscription", "Mobile App", "International"].map(channel => (
                  <div 
                    key={channel}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`channel-${channel}`}
                      checked={searchCriteria.distribution.includes(channel)}
                      onCheckedChange={(checked) => {
                        const updatedChannels = checked 
                          ? [...searchCriteria.distribution, channel] 
                          : searchCriteria.distribution.filter(c => c !== channel);
                        setSearchCriteria({...searchCriteria, distribution: updatedChannels});
                      }}
                    />
                    <Label htmlFor={`channel-${channel}`} className="text-sm font-normal">
                      {channel}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-medium">
                Partnership Goals
              </Label>
              <Textarea 
                id="notes" 
                placeholder="Describe your retail partnership goals and any specific requirements"
                rows={4}
                value={searchCriteria.notes}
                onChange={(e) => setSearchCriteria({...searchCriteria, notes: e.target.value})}
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline"
              onClick={() => setIsFindRetailerOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleFindRetailer}
              disabled={!searchCriteria.category}
            >
              <Search className="h-4 w-4 mr-2" />
              Find Retail Partners
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BrandLayout>
  );
};

export default Retailers; 