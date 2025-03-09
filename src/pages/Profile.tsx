
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Building, Mail, Phone, MapPin, Edit, Settings, Heart, ClipboardList, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import ManufacturerProfile from "@/components/profile/ManufacturerProfile";
import BrandProfile from "@/components/profile/BrandProfile";
import RetailerProfile from "@/components/profile/RetailerProfile";

const Profile = () => {
  const { role, user, isAuthenticated, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Set page title and check authentication
  useEffect(() => {
    document.title = "My Profile - CPG Matchmaker";
    
    // If not authenticated, redirect to auth page
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    }
  }, [navigate, isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };

  // Function to render the correct profile content based on user role
  const renderRoleSpecificContent = () => {
    switch(role) {
      case "manufacturer":
        return <ManufacturerProfile />;
      case "brand":
        return <BrandProfile />;
      case "retailer":
        return <RetailerProfile />;
      default:
        return <div>Please select a role</div>;
    }
  };

  if (!isAuthenticated) {
    // Return empty div while redirecting
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left sidebar - Profile summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="text-center pb-2">
                  <div className="w-24 h-24 bg-primary/10 text-primary rounded-full mx-auto flex items-center justify-center mb-4">
                    <UserCircle className="w-16 h-16" />
                  </div>
                  <CardTitle>{user?.name || "User Name"}</CardTitle>
                  <CardDescription>
                    <Badge className="mt-1 capitalize">{role}</Badge>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Building className="w-4 h-4 mr-2" />
                      {user?.companyName || "Company Name"}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Mail className="w-4 h-4 mr-2" />
                      {user?.email || "user@example.com"}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Phone className="w-4 h-4 mr-2" />
                      +1 (555) 123-4567
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      San Francisco, CA
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <div className="text-sm text-muted-foreground mb-2 flex justify-between">
                      <span>Profile completion</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-secondary h-2 rounded-full">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `85%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="pt-4 flex flex-col space-y-2">
                    <Button variant="outline" className="justify-start">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Main content */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab - Role-specific content */}
                <TabsContent value="overview" className="space-y-6">
                  {renderRoleSpecificContent()}
                </TabsContent>
                
                {/* Favorites Tab */}
                <TabsContent value="favorites">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Favorites</CardTitle>
                      <CardDescription>
                        View and manage your saved products, manufacturers, and retailers.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Heart className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No favorites yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          When you find products or manufacturers you're interested in, save them here for quick access.
                        </p>
                        <div className="flex gap-4 justify-center">
                          <Button variant="outline">Explore Products</Button>
                          <Button>Find Manufacturers</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                {/* Projects Tab */}
                <TabsContent value="projects">
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Projects</CardTitle>
                      <CardDescription>
                        Track and manage your registered projects and product requests.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <ClipboardList className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-4" />
                        <h3 className="text-lg font-medium mb-2">No projects yet</h3>
                        <p className="text-muted-foreground max-w-md mx-auto mb-6">
                          Start by creating a new project to find matching manufacturers or suppliers for your product needs.
                        </p>
                        <Button>Create New Project</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
