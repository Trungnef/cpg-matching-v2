import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  Filter, 
  Search, 
  Building, 
  ArrowRight, 
  Plus, 
  MapPin, 
  CheckCircle, 
  Star, 
  ChevronDown,
  X
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

// Manufacturer interface type
interface Manufacturer {
  id: number;
  name: string;
  category: string;
  status: string;
  location: string;
  certifications: string[];
  products: number;
  matchScore: number;
  description: string;
}

// Mock manufacturer data
const manufacturers: Manufacturer[] = [
  {
    id: 1,
    name: "Premium Foods Manufacturing",
    category: "Food & Beverage",
    status: "Active Partner",
    location: "Portland, OR",
    certifications: ["Organic", "Kosher", "Non-GMO"],
    products: 3,
    matchScore: 98,
    description: "Premium Foods specializes in organic food production with state-of-the-art facilities that meet the highest quality standards."
  },
  {
    id: 2,
    name: "Sustainable Nutrition Inc.",
    category: "Nutrition & Supplements",
    status: "Active Partner",
    location: "Boulder, CO",
    certifications: ["Organic", "Vegan", "B Corp"],
    products: 2,
    matchScore: 95,
    description: "Leaders in sustainable supplement manufacturing with a focus on plant-based ingredients and environmentally-friendly processes."
  },
  {
    id: 3,
    name: "Nature's Best Beverages",
    category: "Beverages",
    status: "Active Partner",
    location: "San Diego, CA",
    certifications: ["Fair Trade", "Non-GMO"],
    products: 1,
    matchScore: 92,
    description: "Specialized in crafting premium natural beverages using innovative brewing and bottling technologies."
  },
  {
    id: 4,
    name: "Eco-Packaging Solutions",
    category: "Packaging",
    status: "Potential Match",
    location: "Seattle, WA",
    certifications: ["Sustainable", "Recyclable"],
    products: 0,
    matchScore: 94,
    description: "Pioneers in eco-friendly packaging solutions using biodegradable materials and minimal waste production methods."
  },
  {
    id: 5,
    name: "GreenLeaf Co-Packing",
    category: "Contract Manufacturing",
    status: "Potential Match",
    location: "Minneapolis, MN",
    certifications: ["Organic", "B Corp"],
    products: 0,
    matchScore: 90,
    description: "Full-service co-packer with expertise in organic food production, offering flexible manufacturing solutions for growing brands."
  },
  {
    id: 6,
    name: "Harvest & Co. Manufacturing",
    category: "Food & Beverage",
    status: "Potential Match",
    location: "Austin, TX",
    certifications: ["Organic", "Kosher"],
    products: 0,
    matchScore: 87,
    description: "Family-owned manufacturing facility specializing in small to medium batch production with a focus on quality and tradition."
  }
];

// Categories for filters
const manufacturerCategories = [
  "Food & Beverage",
  "Nutrition & Supplements",
  "Beverages",
  "Packaging",
  "Contract Manufacturing"
];

const Manufacturers = () => {
  const { isAuthenticated, user, role } = useUser();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  
  // State for manufacturer details modal
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  
  // State for find manufacturer modal
  const [isFindManufacturerOpen, setIsFindManufacturerOpen] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({
    category: "",
    certifications: [] as string[],
    location: "",
    minCapacity: 0,
    maxCapacity: 0,
    notes: ""
  });
  
  useEffect(() => {
    document.title = "Manufacturer Partners - CPG Matchmaker";
    
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

  // Filter manufacturers based on search query and filters
  const filteredManufacturers = manufacturers.filter(manufacturer => {
    const matchesSearch = 
      manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manufacturer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manufacturer.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !filterCategory || manufacturer.category === filterCategory;
    const matchesStatus = !filterStatus || manufacturer.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Reset filters
  const resetFilters = () => {
    setSearchQuery("");
    setFilterCategory(null);
    setFilterStatus(null);
  };

  // Open manufacturer details
  const openManufacturerDetails = (manufacturer: Manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setIsDetailsOpen(true);
  };

  // Function to handle the find manufacturer button click
  const openFindManufacturerModal = () => {
    setIsFindManufacturerOpen(true);
  };

  // Function to handle form reset
  const resetFindManufacturerForm = () => {
    setSearchCriteria({
      category: "",
      certifications: [],
      location: "",
      minCapacity: 0,
      maxCapacity: 0,
      notes: ""
    });
  };

  // Function to handle form submission
  const handleFindManufacturer = () => {
    // In a real app, this would make an API call to search for manufacturers
    console.log("Searching for manufacturers with criteria:", searchCriteria);
    
    // For demo purposes, we'll just close the modal and show a success message
    setIsFindManufacturerOpen(false);
    
    toast({
      title: "Search initiated",
      description: `We're looking for manufacturers that match your requirements. You'll be notified when we find potential partners.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active Partner":
        return <Badge className="bg-green-500 hover:bg-green-600">Active Partner</Badge>;
      case "Potential Match":
        return <Badge variant="outline" className="text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-transparent">Potential Match</Badge>;
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
                  Manufacturing Management
                </h1>
                </motion.h1>
                <motion.p 
                  className="text-muted-foreground"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  {user?.companyName} - Find and manage manufacturing partnerships
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
                        {manufacturerCategories.map(category => (
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
                        {["Active Partner", "Potential Match"].map(status => (
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
                <Button className="group" onClick={openFindManufacturerModal}>
                  <Plus className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Find Manufacturers
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
                placeholder="Search manufacturers, categories, or locations..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>
          
          {/* Manufacturers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <AnimatePresence>
              {filteredManufacturers.map((manufacturer, index) => (
                <motion.div
                  key={manufacturer.id}
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
                            <Factory className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-lg line-clamp-1">{manufacturer.name}</CardTitle>
                            <CardDescription>{manufacturer.category}</CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(manufacturer.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3 flex-grow">
                      <div className="space-y-3">
                        <div className="text-sm line-clamp-2 text-muted-foreground">
                          {manufacturer.description}
                        </div>
                        
                        <div className="flex items-center text-sm space-x-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{manufacturer.location}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {manufacturer.certifications.map((cert, idx) => (
                            <Badge variant="secondary" key={idx} className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="pt-2">
                          {getMatchScoreBadge(manufacturer.matchScore)}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="px-6 py-4 bg-muted/30 border-t mt-auto">
                      <div className="flex w-full justify-between items-center">
                        <div className="flex items-center">
                          <Badge variant="outline" className="bg-background">
                            {manufacturer.products} {manufacturer.products === 1 ? 'Product' : 'Products'}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1 transition-colors hover:bg-background"
                          onClick={() => openManufacturerDetails(manufacturer)}
                        >
                          View Details <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
              
              {/* Add new manufacturer card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: filteredManufacturers.length * 0.05 }}
                whileHover={{ scale: 1.03 }}
              >
                <Card className={cn(
                  "flex flex-col items-center justify-center h-full border-dashed cursor-pointer transition-colors duration-300",
                  isDark 
                    ? "hover:border-primary hover:bg-primary/5" 
                    : "hover:border-primary hover:bg-primary/5"
                )}
                onClick={openFindManufacturerModal}
                >
                  <CardContent className="pt-6 flex flex-col items-center">
                    <div className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center mb-4",
                      "bg-primary/10"
                    )}>
                      <Plus className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-medium mb-2">Find New Manufacturers</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      Discover production partners that match your brand's needs
                    </p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={(e) => {
                      e.stopPropagation(); // Prevent card click from triggering twice
                      openFindManufacturerModal();
                    }}>
                      <Plus className="h-4 w-4 mr-2" />
                      Start Search
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
            
            {/* Empty state */}
            {filteredManufacturers.length === 0 && (
              <div className="col-span-full">
                <div className={cn(
                  "rounded-lg border p-8 text-center",
                  isDark ? "bg-card" : "bg-slate-50"
                )}>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Factory className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No manufacturers found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {searchQuery || filterCategory || filterStatus 
                      ? "Try adjusting your search or filter criteria." 
                      : "Get started by finding new manufacturing partners."}
                  </p>
                  <Button 
                    className="mt-4"
                    onClick={resetFilters}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Reset Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
      
      {/* Manufacturer Details Modal */}
      {selectedManufacturer && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto z-[100]">
            <DialogHeader>
              <div className="flex justify-between items-center">
                <DialogTitle>{selectedManufacturer.name}</DialogTitle>
                {getStatusBadge(selectedManufacturer.status)}
              </div>
              <DialogDescription>
                {selectedManufacturer.category} • {selectedManufacturer.location}
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
                    <h3 className="font-medium">Match Score</h3>
                    <p className="text-sm text-muted-foreground">
                      How well this manufacturer matches your brand
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={cn(
                    "text-xl font-bold",
                    selectedManufacturer.matchScore >= 90 
                      ? "text-green-500" 
                      : selectedManufacturer.matchScore >= 75 
                        ? "text-yellow-500" 
                        : "text-red-500"
                  )}>
                    {selectedManufacturer.matchScore}%
                  </span>
                </div>
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">About</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedManufacturer.description}
                </p>
              </div>
              
              {/* Certifications */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedManufacturer.certifications.map((cert, idx) => (
                    <Badge key={idx} className="bg-primary/10 text-primary border-none">
                      <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Products */}
              <div className="space-y-2">
                <h3 className="text-base font-medium">Products</h3>
                {selectedManufacturer.products > 0 ? (
                  <div className={cn(
                    "p-4 rounded-lg border",
                    isDark ? "bg-card" : "bg-slate-50"
                  )}>
                    <p className="text-sm">
                      You have {selectedManufacturer.products} product{selectedManufacturer.products !== 1 ? 's' : ''} 
                      manufactured by {selectedManufacturer.name}.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      View Products
                    </Button>
                  </div>
                ) : (
                  <div className={cn(
                    "p-4 rounded-lg border text-center",
                    isDark ? "bg-card" : "bg-slate-50"
                  )}>
                    <p className="text-sm text-muted-foreground">
                      You don't have any products manufactured by this partner yet.
                    </p>
                    <Button variant="outline" size="sm" className="mt-3">
                      Explore Collaboration
                    </Button>
                  </div>
                )}
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
                Contact Manufacturer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Find Manufacturer Modal */}
      <Dialog 
        open={isFindManufacturerOpen} 
        onOpenChange={(open) => {
          setIsFindManufacturerOpen(open);
          if (!open) resetFindManufacturerForm();
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-auto z-[100]">
          <DialogHeader>
            <DialogTitle>Find Manufacturing Partners</DialogTitle>
            <DialogDescription>
              Specify your manufacturing requirements to find perfect matches for your brand
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 py-2">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                Product Category <span className="text-destructive">*</span>
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
                    {manufacturerCategories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            
            {/* Certifications */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Required Certifications</Label>
              <div className="grid grid-cols-2 gap-3 pt-1">
                {["Organic", "Kosher", "Vegan", "Non-GMO", "Fair Trade", "B Corp", "Sustainable"].map(cert => (
                  <div 
                    key={cert}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox 
                      id={`cert-${cert}`}
                      checked={searchCriteria.certifications.includes(cert)}
                      onCheckedChange={(checked) => {
                        const updatedCerts = checked 
                          ? [...searchCriteria.certifications, cert] 
                          : searchCriteria.certifications.filter(c => c !== cert);
                        setSearchCriteria({...searchCriteria, certifications: updatedCerts});
                      }}
                    />
                    <Label htmlFor={`cert-${cert}`} className="text-sm font-normal">
                      {cert}
                    </Label>
                  </div>
                ))}
              </div>
              
              {searchCriteria.certifications.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-wrap gap-1 pt-2"
                >
                  {searchCriteria.certifications.map(cert => (
                    <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {cert}
                      <button 
                        className="ml-1 rounded-full hover:bg-secondary/80"
                        onClick={() => {
                          setSearchCriteria({
                            ...searchCriteria, 
                            certifications: searchCriteria.certifications.filter(c => c !== cert)
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
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location" className="text-base font-medium">
                Preferred Location
              </Label>
              <Input 
                id="location" 
                placeholder="City, State or region"
                value={searchCriteria.location}
                onChange={(e) => setSearchCriteria({...searchCriteria, location: e.target.value})}
              />
            </div>
            
            {/* Capacity Range */}
            <div className="space-y-2">
              <Label className="text-base font-medium">Production Capacity (units/month)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="minCapacity" className="text-xs text-muted-foreground">Minimum</Label>
                  <Input 
                    type="number"
                    id="minCapacity" 
                    placeholder="Min units"
                    value={searchCriteria.minCapacity || ''}
                    onChange={(e) => setSearchCriteria({...searchCriteria, minCapacity: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="maxCapacity" className="text-xs text-muted-foreground">Maximum</Label>
                  <Input 
                    type="number"
                    id="maxCapacity" 
                    placeholder="Max units"
                    value={searchCriteria.maxCapacity || ''}
                    onChange={(e) => setSearchCriteria({...searchCriteria, maxCapacity: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>
            
            {/* Additional Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-medium">
                Additional Requirements
              </Label>
              <Textarea 
                id="notes" 
                placeholder="Describe any specific manufacturing requirements or preferences"
                rows={4}
                value={searchCriteria.notes}
                onChange={(e) => setSearchCriteria({...searchCriteria, notes: e.target.value})}
              />
            </div>
            
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              variant="outline"
              onClick={() => setIsFindManufacturerOpen(false)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleFindManufacturer}
              disabled={!searchCriteria.category}
            >
              <Search className="h-4 w-4 mr-2" />
              Find Matches
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BrandLayout>
  );
};

export default Manufacturers;
