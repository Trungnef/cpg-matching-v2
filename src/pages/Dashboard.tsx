import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import {
  BarChart4,
  Building2,
  Factory,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Store,
  Users,
  LogOut,
  Truck,
  Warehouse,
  Handshake,
  User,
  Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import ManufacturerDashboard from "@/components/dashboard/ManufacturerDashboard";
import BrandDashboard from "@/components/dashboard/BrandDashboard";
import RetailerDashboard from "@/components/dashboard/RetailerDashboard";

const Dashboard = () => {
  const { role, isAuthenticated, user, logout } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    document.title = `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard - CPG Matchmaker`;
    
    // If not authenticated, redirect to auth page
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    }
  }, [role, navigate, isAuthenticated]);

  // Handle logout
  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/");
  };
  
  // Function to render the correct dashboard content based on user role
  const renderRoleSpecificDashboard = () => {
    switch(role) {
      case "manufacturer":
        return <ManufacturerDashboard />;
      case "brand":
        return <BrandDashboard />;
      case "retailer":
        return <RetailerDashboard />;
      default:
        return <div>Please select a role</div>;
    }
  };

  if (!isAuthenticated) {
    // Return empty div while redirecting
    return <div></div>;
  }

  // Role-specific navigation items
  const getNavigationItems = () => {
    switch(role) {
      case "manufacturer":
        return (
          <>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/manufacturer/production">
                <Factory className="h-4 w-4" />
                Production
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/manufacturer/products">
                <Package className="h-4 w-4" />
                Products
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/manufacturer/inventory">
                <Warehouse className="h-4 w-4" />
                Inventory
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/manufacturer/suppliers">
                <Truck className="h-4 w-4" />
                Suppliers
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/manufacturer/matches">
                <Users className="h-4 w-4" />
                Matches
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/manufacturer/analytics">
                <BarChart4 className="h-4 w-4" />
                Analytics
              </Link>
            </Button>
          </>
        );
      case "brand":
        return (
          <>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/brand/products">
                <Package className="h-4 w-4" />
                Products
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/brand/manufacturers">
                <Factory className="h-4 w-4" />
                Manufacturers
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/brand/brands">
                <Building2 className="h-4 w-4" />
                Brands
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/brand/analytics">
                <BarChart4 className="h-4 w-4" />
                Analytics
              </Link>
            </Button>
          </>
        );
      case "retailer":
        return (
          <>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/retailer/inventory">
                <ShoppingCart className="h-4 w-4" />
                Inventory
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/retailer/brands">
                <Building2 className="h-4 w-4" />
                Brands
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/retailer/partnerships">
                <Handshake className="h-4 w-4" />
                Partnerships
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link to="/retailer/analytics">
                <BarChart4 className="h-4 w-4" />
                Analytics
              </Link>
            </Button>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="flex min-h-screen pt-16">
        {/* Sidebar */}
        <aside className="w-64 border-r hidden lg:block p-6">
          <div className="space-y-4">
            <div className="mb-8">
              <h2 className="text-xl font-bold capitalize">{role} Dashboard</h2>
              <p className="text-sm text-foreground/60">
                {user?.companyName || "Company Name"}
              </p>
            </div>
            
            {/* User info */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user?.name || "User Name"}</p>
                  <p className="text-xs text-muted-foreground">{user?.email || "user@example.com"}</p>
                </div>
              </div>
              
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full justify-start"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
            
            <nav className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link to="/dashboard" className="bg-secondary">
                  <Home className="h-4 w-4" />
                  Overview
                </Link>
              </Button>
              
              {/* Role-specific navigation */}
              {getNavigationItems()}
            </nav>
            
            <div className="pt-4 mt-4 border-t">
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link to="/profile">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2" asChild>
                <Link to={`/${role}/settings`}>
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
        </aside>
        
        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold capitalize">{role} Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name || "User"}</p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline">Export Data</Button>
                <Button>New Project</Button>
              </div>
            </div>
            
            {/* Dashboard tabs for mobile */}
            <div className="block md:hidden mb-8">
              <Tabs defaultValue="overview" className="mb-8">
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="matches">Matches</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Role-specific dashboard content */}
            {renderRoleSpecificDashboard()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
