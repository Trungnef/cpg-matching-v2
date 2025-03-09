
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, Search, MoreVertical, Globe, Ship, Clock, Star } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Pure Wellness",
    category: "Health Supplements",
    status: "Active Partner",
    products: 8,
    relationship: "2 years",
    rating: 4.5,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Natural Living",
    category: "Household Products",
    status: "Negotiating",
    products: 0,
    relationship: "Prospect",
    rating: 4.2,
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Fresh Harvest",
    category: "Organic Foods",
    status: "Active Partner",
    products: 5,
    relationship: "1 year",
    rating: 4.6,
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Eco Essentials",
    category: "Sustainable Products",
    status: "Onboarding",
    products: 3,
    relationship: "New Partner",
    rating: 4.0,
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Vital Nutrition",
    category: "Health Supplements",
    status: "Inactive",
    products: 0,
    relationship: "Past Partner",
    rating: 3.7,
    image: "/placeholder.svg"
  }
];

const Brands = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb and header */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              className="mb-4 pl-0 text-muted-foreground" 
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
            
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
                  Add New Partner
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search partners..." className="pl-10" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-blue-500">2 potential</span> partners in pipeline
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Products Listed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+3</span> added this month
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Brands grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {brands.map((brand) => (
              <Card key={brand.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src={brand.image}
                    alt={brand.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{brand.name}</CardTitle>
                      <CardDescription>{brand.category}</CardDescription>
                    </div>
                    {getStatusBadge(brand.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <Ship className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Products:</span>
                      <span className="ml-1 font-medium">{brand.products}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Rating:</span>
                      <span className="ml-1 font-medium">{brand.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-sm">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-muted-foreground">Relationship:</span>
                    <span className="ml-1 font-medium">{brand.relationship}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button size="sm" variant="outline">View Details</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit Partnership</DropdownMenuItem>
                      <DropdownMenuItem>View Products</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={brand.status === "Active Partner" ? "text-red-500" : "text-green-500"}>
                        {brand.status === "Active Partner" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add new partner card */}
            <Card className="flex flex-col items-center justify-center h-full border-dashed">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Add New Partner</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Expand your brand network
                </p>
                <Button>Add Partner</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;
