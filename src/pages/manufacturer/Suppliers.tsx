
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Filter, Search, MoreVertical, UserPlus, Truck, Clock, DollarSign, ThumbsUp } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock suppliers data
const suppliers = [
  {
    id: 1,
    name: "Organic Farms Co.",
    category: "Raw Materials",
    status: "Active",
    reliability: "98%",
    leadTime: "3-5 days",
    materials: 5,
    relationship: "4 years",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Premium Packaging Ltd.",
    category: "Packaging",
    status: "Active",
    reliability: "95%",
    leadTime: "7-10 days",
    materials: 8,
    relationship: "3 years",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Global Ingredients Inc.",
    category: "Raw Materials",
    status: "Under Review",
    reliability: "87%",
    leadTime: "10-14 days",
    materials: 3,
    relationship: "6 months",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Allied Logistics",
    category: "Shipping",
    status: "Active",
    reliability: "92%",
    leadTime: "1-2 days",
    materials: 0,
    relationship: "2 years",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "NaturePure Extracts",
    category: "Raw Materials",
    status: "Active",
    reliability: "96%",
    leadTime: "4-7 days",
    materials: 2,
    relationship: "1 year",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "EcoPackage Solutions",
    category: "Packaging",
    status: "Inactive",
    reliability: "81%",
    leadTime: "14-21 days",
    materials: 0,
    relationship: "Past Supplier",
    image: "/placeholder.svg"
  }
];

const Suppliers = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Supplier Management - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);

  if (!isAuthenticated || role !== "manufacturer") {
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "Active":
        return <Badge className="bg-green-500">Active</Badge>;
      case "Under Review":
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Under Review</Badge>;
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
                <h1 className="text-3xl font-bold">Supplier Management</h1>
                <p className="text-muted-foreground">{user?.companyName} - Supply Chain Partners</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Supplier
                </Button>
              </div>
            </div>
          </div>
          
          {/* Search and stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search suppliers..." className="pl-10" />
              </div>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-blue-500">1 supplier</span> under review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Reliability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94.2%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-500">+1.5%</span> from last quarter
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Suppliers grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {suppliers.map((supplier) => (
              <Card key={supplier.id} className="overflow-hidden">
                <div className="aspect-video bg-muted flex items-center justify-center">
                  <img 
                    src={supplier.image}
                    alt={supplier.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{supplier.name}</CardTitle>
                      <CardDescription>{supplier.category}</CardDescription>
                    </div>
                    {getStatusBadge(supplier.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 pb-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <ThumbsUp className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Reliability:</span>
                      <span className="ml-1 font-medium">{supplier.reliability}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Lead Time:</span>
                      <span className="ml-1 font-medium">{supplier.leadTime}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Materials:</span>
                      <span className="ml-1 font-medium">{supplier.materials}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span className="text-muted-foreground">Relationship:</span>
                      <span className="ml-1 font-medium">{supplier.relationship}</span>
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
                      <DropdownMenuItem>Edit Supplier</DropdownMenuItem>
                      <DropdownMenuItem>View Materials</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className={supplier.status === "Active" ? "text-red-500" : "text-green-500"}>
                        {supplier.status === "Active" ? "Deactivate" : "Activate"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardFooter>
              </Card>
            ))}
            
            {/* Add new supplier card */}
            <Card className="flex flex-col items-center justify-center h-full border-dashed">
              <CardContent className="pt-6 flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <UserPlus className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium mb-2">Add New Supplier</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Expand your supply chain network
                </p>
                <Button>Add Supplier</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Suppliers;
