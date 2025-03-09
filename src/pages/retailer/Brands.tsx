
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Filter, ArrowLeft, Search, MoreVertical, Store, Package, CheckCircle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock brands data
const brands = [
  {
    id: 1,
    name: "Green Earth Organics",
    category: "Food & Beverage",
    status: "Active",
    products: 8,
    topSeller: "Organic Breakfast Cereal",
    customerRating: 4.8,
    image: "/placeholder.svg",
    certifications: ["Organic", "Non-GMO", "Sustainable"]
  },
  {
    id: 2,
    name: "Pure Nutrition",
    category: "Health & Wellness",
    status: "Active",
    products: 5,
    topSeller: "Plant Protein Powder",
    customerRating: 4.6,
    image: "/placeholder.svg",
    certifications: ["Vegan", "Gluten-Free"]
  },
  {
    id: 3,
    name: "Clean Living",
    category: "Household",
    status: "Active",
    products: 6,
    topSeller: "Eco-Friendly Dish Soap",
    customerRating: 4.7,
    image: "/placeholder.svg",
    certifications: ["Eco-Friendly", "Biodegradable"]
  },
  {
    id: 4,
    name: "Fresh Press",
    category: "Beverages",
    status: "Active",
    products: 4,
    topSeller: "Cold Pressed Orange Juice",
    customerRating: 4.5,
    image: "/placeholder.svg",
    certifications: ["Organic", "No Added Sugar"]
  },
  {
    id: 5,
    name: "Nature's Harvest",
    category: "Snacks",
    status: "Inactive",
    products: 3,
    topSeller: "Organic Trail Mix",
    customerRating: 4.3,
    image: "/placeholder.svg",
    certifications: ["Organic", "Non-GMO"]
  },
  {
    id: 6,
    name: "Wellness Essentials",
    category: "Personal Care",
    status: "Pending",
    products: 0,
    topSeller: "N/A",
    customerRating: 0,
    image: "/placeholder.svg",
    certifications: ["Cruelty-Free", "Natural Ingredients"]
  }
];

const Brands = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
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

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Inactive":
        return <Badge variant="secondary">Inactive</Badge>;
      case "Pending":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Pending</Badge>;
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
                <h1 className="text-3xl font-bold">Brand Partners</h1>
                <p className="text-muted-foreground">{user?.companyName} - Brand relationships management</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Discover Brands
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search brands..." className="pl-10" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Brands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">26</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+3</span> new this quarter
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Products Carried</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">154</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-blue-500">12</span> new this month
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
                <CardContent className="space-y-3 pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm">
                      <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Products:</span>
                      <span className="ml-1 font-medium">{brand.products}</span>
                    </div>
                    <div className="text-sm">
                      {getRatingStars(brand.customerRating)}
                    </div>
                  </div>
                  
                  {brand.products > 0 && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Top Seller:</span>
                      <span className="ml-1 font-medium">{brand.topSeller}</span>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {brand.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between pt-0">
                  <Button size="sm" variant="outline">View Profile</Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Products</DropdownMenuItem>
                      <DropdownMenuItem>View Analytics</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {brand.status === "Active" ? (
                        <>
                          <DropdownMenuItem>Contact Rep</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-500">Mark as Inactive</DropdownMenuItem>
                        </>
                      ) : brand.status === "Pending" ? (
                        <DropdownMenuItem className="text-green-500">Approve Partnership</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-green-500">Reactivate</DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Brands;
