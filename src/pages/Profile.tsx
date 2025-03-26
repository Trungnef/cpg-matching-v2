import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserCircle, Building, Mail, Phone, MapPin, Edit, Settings, Heart, ClipboardList, LogOut, User, Globe, Save, X, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import RoleProfileHandler from "@/components/profile/RoleProfileHandler";
import ProfileForm from "@/components/profile/ProfileForm";

const Profile = () => {
  const { user, isAuthenticated, logout, updateUserAvatar } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  
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

  if (!isAuthenticated) {
    // Return empty div while redirecting
    return <div></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-20 pb-6 px-4 md:px-6 lg:pt-24 lg:pb-10">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 group cursor-pointer">
                    <label htmlFor="avatar-upload" className="cursor-pointer block">
                      <Avatar className="h-24 w-24 border-4 border-background">
                        <AvatarImage 
                          src={user?.avatar || ""} 
                          alt={user?.name || "User"} 
                        />
                        <AvatarFallback className="text-2xl">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="h-8 w-8 text-white" />
                      </div>
                    </label>
                    <Input 
                      id="avatar-upload" 
                      type="file" 
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            if (e.target?.result) {
                              updateUserAvatar(e.target.result as string);
                              toast({
                                title: "Avatar Updated",
                                description: "Your profile picture has been updated successfully.",
                              });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </div>
                  <CardTitle>{user?.name || "Demo User"}</CardTitle>
                  <Badge className="mt-2 capitalize font-medium px-3 py-1 text-sm" variant="secondary">
                    {user?.role === "manufacturer" ? "Manufacturer" : 
                     user?.role === "brand" ? "Brand" : 
                     user?.role === "retailer" ? "Retailer" : "Role"}
                  </Badge>
                  <div className="flex items-center mt-3">
                    <span className={`h-2.5 w-2.5 rounded-full mr-2 
                      ${user?.status === "online" ? "bg-green-500" : 
                        user?.status === "away" ? "bg-yellow-500" : 
                        "bg-red-500"}`} 
                    />
                    <span className="text-sm text-muted-foreground">
                      {user?.status === "online" ? "Online" : 
                        user?.status === "away" ? "Away" : 
                        "Busy"}
                    </span>
                  </div>
                </div>
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
                    {user?.phone || "+1 (555) 123-4567"}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {user?.address || "San Francisco, CA"}
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col space-y-2">
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
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
            {isEditing ? (
              // Show edit form when editing is true
              <ProfileForm onCancel={() => setIsEditing(false)} />
            ) : (
              // Otherwise show normal profile content
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full max-w-md">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="favorites">Favorites</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab - Role-specific content */}
                <TabsContent value="overview" className="space-y-6">
                  <RoleProfileHandler />
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
