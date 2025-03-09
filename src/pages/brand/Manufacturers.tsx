
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Factory, Filter, ArrowLeft, Search, MoreVertical, Tag, MapPin, CheckCircle } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    image: "/placeholder.svg",
    matchScore: 98
  },
  {
    id: 2,
    name: "Sustainable Nutrition Inc.",
    category: "Nutrition & Supplements",
    status: "Active Partner",
    location: "Boulder, CO",
    certifications: ["Organic", "Vegan", "B Corp"],
    products: 2,
    image: "/placeholder.svg",
    matchScore: 95
  },
  {
    id: 3,
    name: "Nature's Best Beverages",
    category: "Beverages",
    status: "Active Partner",
    location: "San Diego, CA",
    certifications: ["Fair Trade", "Non-GMO"],
    products: 1,
    image: "/placeholder.svg",
    matchScore: 92
  },
  {
    id: 4,
    name: "Eco-Packaging Solutions",
    category: "Packaging",
    status: "Potential Match",
    location: "Seattle, WA",
    certifications: ["Sustainable", "Recyclable"],
    products: 0,
    image: "/placeholder.svg",
    matchScore: 94
  },
  {
    id: 5,
    name: "GreenLeaf Co-Packing",
    category: "Contract Manufacturing",
    status: "Potential Match",
    location: "Minneapolis, MN",
    certifications: ["Organic", "B Corp"],
    products: 0,
    image: "/placeholder.svg",
    matchScore: 90
  },
  {
    id: 6,
    name: "Harvest & Co. Manufacturing",
    category: "Food & Beverage",
    status: "Potential Match",
    location: "Austin, TX",
    certifications: ["Organic", "Kosher"],
    products: 0,
    image: "/placeholder.svg",
    matchScore: 87
  }
];

const Manufacturers = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
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
                <h1 className="text-3xl font-bold">Manufacturing Partners</h1>
                <p className="text-muted-foreground">{user?.companyName} - Find & Manage Manufacturers</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Find New Partners
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search manufacturers..." className="pl-10" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Partners</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">6 Products</span> in production
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Potential Matches</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-blue-500">3</span> new this month
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Manufacturers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {manufacturers.map((manufacturer) => (
              <Card key={manufacturer.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src={manufacturer.image}
                    alt={manufacturer.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{manufacturer.name}</CardTitle>
                      <CardDescription>{manufacturer.category}</CardDescription>
                    </div>
                    {getStatusBadge(manufacturer.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="font-medium">{manufacturer.location}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {manufacturer.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {cert}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    {getMatchScoreBadge(manufacturer.matchScore)}
                    <span className="text-sm text-muted-foreground">
                      {manufacturer.products} {manufacturer.products === 1 ? 'product' : 'products'}
                    </span>
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
                      <DropdownMenuItem>Contact</DropdownMenuItem>
                      <DropdownMenuItem>Schedule Meeting</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {manufacturer.status === "Potential Match" ? (
                        <DropdownMenuItem className="text-green-500">Add as Partner</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem className="text-amber-500">Manage Relationship</DropdownMenuItem>
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

export default Manufacturers;
