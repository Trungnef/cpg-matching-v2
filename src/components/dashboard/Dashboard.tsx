import { LayoutDashboard, LogOut, Users, Package, ShoppingCart, BarChart3, Settings, User } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "@/contexts/UserContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ManufacturerDashboard from "@/components/dashboard/ManufacturerDashboard";
import BrandDashboard from "@/components/dashboard/BrandDashboard";
import RetailerDashboard from "@/components/dashboard/RetailerDashboard";
import { motion } from "framer-motion";

// Define the role tabs with their respective icons and paths
const roleTabs = {
  "manufacturer": [
    { value: "overview", title: "Overview", icon: <LayoutDashboard className="h-4 w-4" />, path: "manufacturer" },
    { value: "orders", title: "Orders", icon: <ShoppingCart className="h-4 w-4" />, path: "manufacturer-orders" },
    { value: "production", title: "Production", icon: <Package className="h-4 w-4" />, path: "manufacturer-production" },
    { value: "analytics", title: "Analytics", icon: <BarChart3 className="h-4 w-4" />, path: "manufacturer-analytics" },
  ],
  "brand": [
    { value: "overview", title: "Overview", icon: <LayoutDashboard className="h-4 w-4" />, path: "brand" },
    { value: "products", title: "Products", icon: <Package className="h-4 w-4" />, path: "brand-products" },
    { value: "retailers", title: "Retailers", icon: <Users className="h-4 w-4" />, path: "brand-retailers" },
    { value: "analytics", title: "Analytics", icon: <BarChart3 className="h-4 w-4" />, path: "brand-analytics" },
  ],
  "retailer": [
    { value: "overview", title: "Overview", icon: <LayoutDashboard className="h-4 w-4" />, path: "retailer" },
    { value: "inventory", title: "Inventory", icon: <Package className="h-4 w-4" />, path: "retailer-inventory" },
    { value: "orders", title: "Orders", icon: <ShoppingCart className="h-4 w-4" />, path: "retailer-orders" },
    { value: "sales", title: "Sales", icon: <BarChart3 className="h-4 w-4" />, path: "retailer-sales" },
    { value: "partnerships", title: "Partnerships", icon: <Users className="h-4 w-4" />, path: "retailer-partnerships" },
  ]
};

export default function Dashboard() {
  const { user, isAuthenticated, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  
  const path = location.pathname.split("/").pop();
  let tabValue = "overview";
  let pageTitle = "Dashboard";
  
  // Extract tab from URL and set active tab
  useEffect(() => {
    if (path) {
      if (path.includes('-')) {
        const parts = path.split('-');
        const tabKey = parts[parts.length - 1];
        if (tabKey) {
          setActiveTab(tabKey);
          
          // Set page title based on tab
          const role = user?.role || "user";
          const tabs = roleTabs[role as keyof typeof roleTabs] || [];
          const tab = tabs.find(t => t.path.includes(tabKey));
          if (tab) {
            pageTitle = tab.title;
          }
        }
      } else {
        setActiveTab("overview");
      }
    }
  }, [path, user?.role]);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/auth?type=signin");
  };
  
  // If not authenticated, redirect to sign in
  if (!isAuthenticated) {
    return <Navigate to="/auth?type=signin" />;
  }
  
  // Render the appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case "manufacturer":
        return <ManufacturerDashboard activeTab={activeTab} />;
      case "brand":
        return <BrandDashboard activeTab={activeTab} />;
      case "retailer":
        return <RetailerDashboard activeTab={activeTab} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center min-h-[300px]">
            <p className="text-muted-foreground mb-4">Welcome to the dashboard!</p>
            <p className="text-muted-foreground">Please select a role to continue.</p>
          </div>
        );
    }
  };
  
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tight">{pageTitle}</h2>
          <p className="text-muted-foreground">
            {user?.name ? `Welcome back, ${user.name.split(" ")[0]}!` : "Welcome to your dashboard"}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center space-x-2">
            <Button onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="space-y-4"
      >
        <Tabs
          defaultValue={activeTab}
          onValueChange={(value) => {
            if (roleTabs[user?.role as keyof typeof roleTabs]?.find(tab => tab.value === value)?.path) {
              setActiveTab(value as string);
              navigate(`/dashboard/${roleTabs[user?.role as keyof typeof roleTabs]?.find(tab => tab.value === value)?.path}`);
            } else if (value === "settings") {
              navigate("/settings");
            } else if (value === "profile") {
              navigate("/profile");
            }
          }}
          className="space-y-4"
        >
          <TabsList className="h-10">
            {roleTabs[user?.role as keyof typeof roleTabs]?.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="text-sm"
                data-state={activeTab === tab.value ? "active" : "inactive"}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.title}
              </TabsTrigger>
            ))}
          </TabsList>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value={activeTab} className="space-y-4">
              {renderDashboard()}
            </TabsContent>
          </motion.div>
        </Tabs>
      </motion.div>
    </div>
  );
} 