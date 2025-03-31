import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Factory, Filter, Search, Building, ArrowRight, Plus, MapPin, CheckCircle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import BrandLayout from "@/components/layouts/BrandLayout";
import { motion } from "framer-motion";

// Mock manufacturer data
const manufacturers = [
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

const Manufacturers = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
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

  // Filter manufacturers based on search query
  const filteredManufacturers = manufacturers.filter(manufacturer => 
    manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manufacturer.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    manufacturer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active Partner":
        return <Badge className="bg-green-500">Active Partner</Badge>;
      case "Potential Match":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Potential Match</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const getMatchScoreBadge = (score: number) => {
    let color = "bg-green-500";
    if (score < 85) color = "bg-yellow-500";
    if (score < 70) color = "bg-red-500";
    
    return (
      <div className="flex items-center">
        <div className={`h-2.5 w-2.5 rounded-full ${color} mr-1.5`}></div>
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
                <h1 className="text-3xl font-bold">Manufacturing Partners</h1>
                <p className="text-muted-foreground">{user?.companyName} - Find and manage manufacturing partnerships</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Find Manufacturers
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                placeholder="Search manufacturers, categories, or locations..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* Manufacturers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredManufacturers.map(manufacturer => (
              <Card key={manufacturer.id} className="overflow-hidden transition-all duration-300 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                        <Factory className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{manufacturer.name}</CardTitle>
                        <CardDescription>{manufacturer.category}</CardDescription>
                      </div>
                    </div>
                    {getStatusBadge(manufacturer.status)}
                  </div>
                </CardHeader>
                <CardContent className="pb-3">
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
                <div className="px-6 py-4 bg-muted/30 flex justify-end">
                  <Button variant="ghost" size="sm" className="gap-1">
                    View Details <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
            
            {/* Add new manufacturer card */}
            <Card className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors duration-300">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Find New Manufacturers</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Discover production partners that match your brand's needs
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </BrandLayout>
  );
};

export default Manufacturers;
