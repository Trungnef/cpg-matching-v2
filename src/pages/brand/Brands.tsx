import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, Search, Globe, Ship, Clock, Star, ArrowRight, Plus, Building } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import BrandLayout from "@/components/layouts/BrandLayout";
import { motion } from "framer-motion";

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
    description: "Nutritional supplement company focused on performance optimization and recovery support for active lifestyles and athletic performance."
  }
];

const Brands = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  useEffect(() => {
    document.title = "Brand Partnerships - CPG Matchmaker";
    
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

  // Filter brands based on search query
  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active Partner":
        return <Badge className="bg-green-500">Active Partner</Badge>;
      case "Negotiating":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Negotiating</Badge>;
      case "Onboarding":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Onboarding</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
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
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Brand Partnerships</h1>
              <p className="text-muted-foreground">{user?.companyName} - Partner Brands Management</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add New Partner
              </Button>
            </div>
          </div>
        </div>
        
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input 
              placeholder="Search partners, categories, or descriptions..." 
              className="pl-10" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Brand partnerships grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredBrands.map(brand => (
            <Card key={brand.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                      <Building className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{brand.name}</CardTitle>
                      <CardDescription>{brand.category}</CardDescription>
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
                  
                  {brand.status !== "Negotiating" && brand.status !== "Inactive" && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="flex flex-col items-center text-center">
                        <div className="text-xs text-muted-foreground mb-1">Products</div>
                        <Badge variant="outline">{brand.products}</Badge>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="text-sm font-medium">{brand.relationship}</div>
                      </div>
                      <div className="flex flex-col items-center text-center">
                        <div className="text-xs text-muted-foreground mb-1">Rating</div>
                        {getStarRating(brand.rating)}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <div className="px-6 py-4 bg-muted/30 flex justify-end">
                <Button variant="ghost" size="sm" className="gap-1">
                  View Details <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
          
          {/* Add new partner card */}
          <Card className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors duration-300">
            <CardContent className="pt-6 flex flex-col items-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-2">Add New Brand Partner</h3>
              <p className="text-sm text-muted-foreground text-center mb-4">
                Establish new strategic brand partnerships to grow your network
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </BrandLayout>
  );
};

export default Brands;
