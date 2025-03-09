
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, Search, MoreVertical, Handshake, Clock, Building, ShoppingBag } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock partnerships data
const partnerships = [
  {
    id: 1,
    name: "Health & Wellness Co-op",
    type: "Buying Group",
    status: "Active",
    members: 15,
    duration: "3 years",
    productsAccess: 120,
    discount: "12%",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Local Producers Alliance",
    type: "Supply Chain",
    status: "Active",
    members: 24,
    duration: "2 years",
    productsAccess: 85,
    discount: "8%",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Eco-Friendly Retailers Network",
    type: "Industry Group",
    status: "Active",
    members: 32,
    duration: "18 months",
    productsAccess: 65,
    discount: "5%",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Downtown Business Association",
    type: "Local Network",
    status: "Pending",
    members: 45,
    duration: "Negotiating",
    productsAccess: 0,
    discount: "TBD",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Organic Suppliers Collective",
    type: "Supply Chain",
    status: "Active",
    members: 18,
    duration: "1 year",
    productsAccess: 52,
    discount: "7%",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Regional Distribution Network",
    type: "Logistics",
    status: "Inactive",
    members: 0,
    duration: "Past Partner",
    productsAccess: 0,
    discount: "0%",
    image: "/placeholder.svg"
  }
];

const Partnerships = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Partnerships - CPG Matchmaker";
    
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
      case "Pending":
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
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
                <h1 className="text-3xl font-bold">Strategic Partnerships</h1>
                <p className="text-muted-foreground">{user?.companyName} - Partnership Management</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  <Handshake className="mr-2 h-4 w-4" />
                  New Partnership
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search partnerships..." className="pl-10" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Partnerships</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-yellow-500">1 pending</span> partnership
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Product Access</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">322</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">Avg. 8% discount</span> on wholesale
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Partnerships grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partnerships.map((partnership) => (
              <Card key={partnership.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src={partnership.image}
                    alt={partnership.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{partnership.name}</CardTitle>
                      <CardDescription>{partnership.type}</CardDescription>
                    </div>
                    {getStatusBadge(partnership.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Members:</span>
                      <span className="ml-1 font-medium">{partnership.members}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="ml-1 font-medium">{partnership.duration}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <ShoppingBag className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Products:</span>
                      <span className="ml-1 font-medium">{partnership.productsAccess}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <span className="text-muted-foreground">Discount:</span>
                      <span className="ml-1 font-medium">{partnership.discount}</span>
                    </div>
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
                      <DropdownMenuItem>View Members</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={partnership.status === "Active" ? "text-red-500" : "text-green-500"}>
                        {partnership.status === "Active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add new partnership card */}
            <Card className="flex flex-col items-center justify-center h-full border-dashed">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Handshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">New Partnership</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Create a new strategic alliance
                </p>
                <Button>Add Partnership</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partnerships;
