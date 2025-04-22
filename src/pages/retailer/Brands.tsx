import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Plus, Search, Building, ArrowRight, UploadCloud, XCircle, Image as ImageIcon } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import RetailerLayout from "@/components/layouts/RetailerLayout";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Mock data for brand partners
const brandPartners = [
  {
    id: 1,
    name: "Green Earth Organics",
    logo: "/placeholder.svg",
    products: ["Organic Cereals", "Energy Bars", "Granola"],
    status: "Active",
    relationship: 4.5,
    categoryFit: 4.8,
    revenueImpact: 4.2,
    categories: ["Breakfast", "Snacks"],
    description: "Green Earth Organics specializes in organic breakfast options and healthy snacks, using sustainable ingredients and eco-friendly packaging."
  },
  {
    id: 2,
    name: "Pure Wellness",
    logo: "/placeholder.svg",
    products: ["Protein Powder", "Vitamin Supplements", "Superfood Blends"],
    status: "Pending",
    relationship: 0,
    categoryFit: 4.5,
    revenueImpact: 4.0,
    categories: ["Health", "Wellness"],
    description: "Pure Wellness offers premium health supplements and nutrition products focused on natural ingredients and scientifically-backed formulations."
  },
  {
    id: 3,
    name: "Fresh Press",
    logo: "/placeholder.svg",
    products: ["Cold-Pressed Juices", "Juice Cleanses", "Fruit Smoothies"],
    status: "Active",
    relationship: 3.9,
    categoryFit: 4.1,
    revenueImpact: 3.7,
    categories: ["Beverages"],
    description: "Fresh Press creates delicious, nutritious cold-pressed juices and smoothies using locally-sourced produce and innovative flavor combinations."
  },
  {
    id: 4,
    name: "Clean Living",
    logo: "/placeholder.svg",
    products: ["Eco Dish Soap", "Natural Surface Cleaner", "Sustainable Laundry Detergent"],
    status: "Active",
    relationship: 4.2,
    categoryFit: 3.9,
    revenueImpact: 3.5,
    categories: ["Household"],
    description: "Clean Living develops household cleaning products that are effective, environmentally friendly, and safe for families and pets."
  },
  {
    id: 5,
    name: "Nature's Harvest",
    logo: "/placeholder.svg",
    products: ["Organic Trail Mix", "Dried Fruits", "Nut Butters"],
    status: "Inactive",
    relationship: 3.0,
    categoryFit: 4.2,
    revenueImpact: 2.8,
    categories: ["Snacks"],
    description: "Nature's Harvest specializes in nutrient-dense snacks made from organically grown nuts, seeds, and fruits with minimal processing."
  },
  {
    id: 6,
    name: "Wellness Essentials",
    logo: "/placeholder.svg",
    products: ["Essential Oils", "Aromatherapy Diffusers", "Natural Candles"],
    status: "Active",
    relationship: 4.0,
    categoryFit: 3.5,
    revenueImpact: 3.2,
    categories: ["Health", "Household"],
    description: "Wellness Essentials creates aromatherapy and self-care products designed to enhance wellbeing through natural scents and therapeutic benefits."
  }
];

const Brands = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isImageGalleryOpen, setIsImageGalleryOpen] = useState(false);
  
  useEffect(() => {
    document.title = "Brand Partners - CPG Matchmaker";
    
    // If not authenticated or not a retailer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "retailer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);

  if (!isAuthenticated || role !== "retailer") {
    return null;
  }

  // Filter brands based on search query
  const filteredBrands = brandPartners.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.categories.some(category => category.toLowerCase().includes(searchQuery.toLowerCase())) ||
    brand.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getRatingStars = (rating: number) => {
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
        <span className="text-sm">{rating > 0 ? rating.toFixed(1) : 'N/A'}</span>
      </div>
    );
  };

  // Function to handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadedImage(file);
    setIsUploading(true);
    setUploadProgress(0);
    
    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedImageUrl(previewUrl);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };
  
  // Function to select image from gallery
  const selectImageFromGallery = (imageUrl: string) => {
    setUploadedImageUrl(imageUrl);
    setIsImageGalleryOpen(false);
  };
  
  // Function to remove selected image
  const removeSelectedImage = () => {
    setUploadedImage(null);
    setUploadedImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <RetailerLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">Brand Partners</h1>
                <p className="text-muted-foreground">{user?.companyName} - Brand relationships management</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="hover:shadow-md transition-shadow">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button className="hover:shadow-md transition-shadow">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Brand
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="mb-8 px-4 sm:px-6 lg:px-8">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search brands, categories, or products..." 
                className="pl-10 shadow-sm hover:shadow transition-shadow" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Brand partners grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 px-4 sm:px-6 lg:px-8">
            {filteredBrands.map((brand, index) => (
              <motion.div
                key={brand.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                          <Building className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{brand.name}</CardTitle>
                          <CardDescription>{brand.categories.join(", ")}</CardDescription>
                        </div>
                      </div>
                      {getStatusBadge(brand.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="space-y-3">
                      <div className="text-sm line-clamp-2 text-muted-foreground">
                        {brand.description}
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mb-2">
                        {brand.products.map((product, idx) => (
                          <Badge variant="secondary" key={idx} className="hover:bg-secondary/70 transition-colors">{product}</Badge>
                        ))}
                      </div>
                      
                      {brand.status !== "Pending" && (
                        <div className="grid grid-cols-3 gap-2 text-center text-sm">
                          <div>
                            <p className="text-muted-foreground text-xs">Relationship</p>
                            {getRatingStars(brand.relationship)}
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Category Fit</p>
                            {getRatingStars(brand.categoryFit)}
                          </div>
                          <div>
                            <p className="text-muted-foreground text-xs">Revenue</p>
                            {getRatingStars(brand.revenueImpact)}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <div className="px-6 py-4 bg-muted/30 flex justify-end">
                    <Button variant="ghost" size="sm" className="gap-1 hover:bg-background/80">
                      View Details <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
            
            {/* Add new brand card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: filteredBrands.length * 0.05 }}
            >
              <Card className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors duration-300">
                <CardContent className="pt-6 flex flex-col items-center">
                  <motion.div 
                    className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(var(--primary), 0.2)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  >
                    <Plus className="h-6 w-6 text-primary" />
                  </motion.div>
                  <h3 className="font-medium mb-2">Add New Brand Partner</h3>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    Connect with new brands to expand your product offerings
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </RetailerLayout>
  );
};

export default Brands;
