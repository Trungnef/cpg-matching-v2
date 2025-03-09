
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Building, Search, ArrowLeft, Filter, MessageSquare, Star, Clock, Calendar, Check, X } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Mock matches data
const potentialMatches = [
  {
    id: 1,
    companyName: "Green Foods Inc.",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Organic food brand looking for cereal manufacturer",
    requestedProduct: "Organic Cereal",
    matchScore: 92,
    location: "San Francisco, CA",
    size: "Medium",
    status: "New"
  },
  {
    id: 2,
    companyName: "Fitness Nutrition Co.",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Sports nutrition brand expanding product line",
    requestedProduct: "Protein Bars",
    matchScore: 88,
    location: "Denver, CO",
    size: "Large",
    status: "New"
  },
  {
    id: 3,
    companyName: "Healthy Snacks Ltd.",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Healthy snack company seeking manufacturing partner",
    requestedProduct: "Trail Mix",
    matchScore: 85,
    location: "Portland, OR",
    size: "Small",
    status: "Reviewed"
  },
  {
    id: 4,
    companyName: "Natural Beverages",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Beverage company looking to expand production",
    requestedProduct: "Organic Juice",
    matchScore: 79,
    location: "Austin, TX",
    size: "Medium",
    status: "Reviewed"
  }
];

const activeMatches = [
  {
    id: 101,
    companyName: "Eco-Friendly Foods",
    role: "brand",
    logo: "/placeholder.svg",
    product: "Organic Cereal",
    status: "Contract Negotiation",
    lastActivity: "2 days ago",
    nextMeeting: "2023-10-05"
  },
  {
    id: 102,
    companyName: "Wellness Nutrition",
    role: "brand",
    logo: "/placeholder.svg",
    product: "Energy Bars",
    status: "Sample Production",
    lastActivity: "5 days ago",
    nextMeeting: "2023-10-12"
  },
  {
    id: 103,
    companyName: "Organic Life Foods",
    role: "brand",
    logo: "/placeholder.svg",
    product: "Organic Juice",
    status: "Active Production",
    lastActivity: "1 day ago",
    nextMeeting: "2023-10-08"
  }
];

const Matches = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  useEffect(() => {
    document.title = "Matches - CPG Matchmaker";
    
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
      case "New":
        return <Badge className="bg-blue-500">New</Badge>;
      case "Reviewed":
        return <Badge variant="outline">Reviewed</Badge>;
      case "Contract Negotiation":
        return <Badge className="bg-yellow-500">Contract</Badge>;
      case "Sample Production":
        return <Badge className="bg-purple-500">Sampling</Badge>;
      case "Active Production":
        return <Badge className="bg-green-500">Active</Badge>;
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
                <h1 className="text-3xl font-bold">Partnership Matches</h1>
                <p className="text-muted-foreground">{user?.companyName} - Find and manage brand partnerships</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
                <Button>
                  <Building className="mr-2 h-4 w-4" />
                  Update Preferences
                </Button>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="potential" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="potential">Potential Matches</TabsTrigger>
              <TabsTrigger value="active">Active Partnerships</TabsTrigger>
            </TabsList>
            
            <TabsContent value="potential">
              {/* Search and stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search potential matches..." className="pl-10" />
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Match Requests</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-blue-500">2 New</span>, 2 Reviewed
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Potential matches list */}
              <div className="space-y-4">
                {potentialMatches.map((match) => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Company logo and basic info */}
                        <div className="md:w-3/12 flex flex-row md:flex-col gap-4 items-center md:items-start">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={match.logo} alt={match.companyName} />
                            <AvatarFallback>{match.companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{match.companyName}</h3>
                            <Badge variant="outline" className="mt-1 capitalize">{match.role}</Badge>
                            <div className="flex items-center mt-2 text-sm text-muted-foreground">
                              <Building className="h-3 w-3 mr-1" /> {match.location}
                            </div>
                          </div>
                        </div>
                        
                        {/* Match details */}
                        <div className="md:w-6/12 space-y-3">
                          <div className="flex items-center gap-1">
                            {getStatusBadge(match.status)}
                            <span className="text-sm ml-2">Looking for: <span className="font-medium">{match.requestedProduct}</span></span>
                          </div>
                          <p className="text-sm">{match.description}</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <Badge variant="secondary">Organic</Badge>
                            <Badge variant="secondary">Non-GMO</Badge>
                            <Badge variant="secondary">Sustainable</Badge>
                          </div>
                        </div>
                        
                        {/* Match score and actions */}
                        <div className="md:w-3/12 flex flex-row md:flex-col justify-between items-center md:items-end">
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-2">
                              <span className="font-bold text-lg">{match.matchScore}%</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Match Score</p>
                          </div>
                          
                          <div className="space-y-2">
                            <Button size="sm" className="w-full">View Details</Button>
                            <div className="flex gap-2">
                              <Button size="icon" variant="outline" className="h-9 w-9 rounded-full">
                                <X className="h-4 w-4" />
                              </Button>
                              <Button size="icon" className="h-9 w-9 rounded-full">
                                <Check className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="active">
              {/* Active partnerships */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="md:col-span-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input placeholder="Search active partnerships..." className="pl-10" />
                  </div>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Partners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      <span className="text-green-500">1 Active</span>, 2 In Process
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Active partnerships list */}
              <div className="space-y-4">
                {activeMatches.map((match) => (
                  <Card key={match.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Company logo and basic info */}
                        <div className="md:w-3/12 flex flex-row md:flex-col gap-4 items-center md:items-start">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={match.logo} alt={match.companyName} />
                            <AvatarFallback>{match.companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-medium">{match.companyName}</h3>
                            <Badge variant="outline" className="mt-1 capitalize">{match.role}</Badge>
                            <p className="text-sm mt-2">
                              Product: <span className="font-medium">{match.product}</span>
                            </p>
                          </div>
                        </div>
                        
                        {/* Partnership details */}
                        <div className="md:w-6/12 space-y-3">
                          <div>
                            {getStatusBadge(match.status)}
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-3">
                            <div className="flex items-center gap-2 text-sm">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Last activity:</span>
                              <span>{match.lastActivity}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Next meeting:</span>
                              <span>{match.nextMeeting}</span>
                            </div>
                          </div>
                          <div className="pt-2">
                            <p className="text-sm">
                              {match.status === "Contract Negotiation" && "Finalizing production agreement and pricing."}
                              {match.status === "Sample Production" && "Producing samples for brand approval and testing."}
                              {match.status === "Active Production" && "Currently in full production with regular shipments."}
                            </p>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="md:w-3/12 flex flex-row md:flex-col justify-between items-center md:items-end gap-2">
                          <Button size="sm" className="w-full">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Message
                          </Button>
                          <Button size="sm" variant="outline" className="w-full">View Details</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Matches;
