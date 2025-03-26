import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import ManufacturerDashboard from "@/components/dashboard/ManufacturerDashboard";
import BrandDashboard from "@/components/dashboard/BrandDashboard";
import RetailerDashboard from "@/components/dashboard/RetailerDashboard";
import { Loader2 } from "lucide-react";
import ManufacturerLayout from "@/components/layouts/ManufacturerLayout";
import BrandLayout from "@/components/layouts/BrandLayout";
import RetailerLayout from "@/components/layouts/RetailerLayout";
import { motion } from "framer-motion";

// Define task tabs for each role
type RoleTabs = {
  [key: string]: {
    id: string;
    label: string;
    path?: string; // Optional path for external pages
  }[];
};

const roleTabs: RoleTabs = {
  manufacturer: [
    { id: "overview", label: "Overview" },
    { id: "production", label: "Production Lines" },
    { id: "orders", label: "Orders" },
    { id: "performance", label: "Performance" },
    { id: "opportunities", label: "Opportunities" },
    { id: "inventory", label: "Inventory", path: "/manufacturer/inventory" },
    { id: "analytics", label: "Analytics", path: "/manufacturer/analytics" },
    { id: "suppliers", label: "Suppliers", path: "/manufacturer/suppliers" },
    { id: "matches", label: "Matches", path: "/manufacturer/matches" },
    { id: "settings", label: "Settings", path: "/manufacturer/settings" }
  ],
  brand: [
    { id: "overview", label: "Overview" },
    { id: "products", label: "Products" },
    { id: "orders", label: "Orders" },
    { id: "insights", label: "Market Insights" },
    { id: "partnerships", label: "Partnerships" }
  ],
  retailer: [
    { id: "overview", label: "Overview" },
    { id: "inventory", label: "Inventory" },
    { id: "orders", label: "Orders" },
    { id: "sales", label: "Sales Analytics" },
    { id: "partnerships", label: "Partnerships" }
  ]
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, role: userRole } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Lấy role từ user
  const role = userRole || "";
  
  useEffect(() => {
    document.title = `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard - CPG Matchmaker`;
    
    // Nếu không authenticated, chuyển hướng đến trang auth
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
      return;
    }
  }, [role, navigate, isAuthenticated]);

  if (!isAuthenticated) {
      return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
    
  // Handle tab changes, including navigation to external pages
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // If tab has an external path, navigate to it
    const tabs = roleTabs[role] || [];
    const selectedTab = tabs.find(tab => tab.id === value);
    
    if (selectedTab?.path) {
      navigate(selectedTab.path);
    }
  };

  // Render dashboard dựa trên role
  const renderDashboardByRole = () => {
    switch(role) {
      case "manufacturer":
        return (
          <ManufacturerLayout>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <ManufacturerDashboard activeTab={activeTab} />
            </motion.div>
          </ManufacturerLayout>
        );
      case "brand":
        return (
          <BrandLayout>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <BrandDashboard activeTab={activeTab} />
            </motion.div>
          </BrandLayout>
        );
      case "retailer":
        return (
          <RetailerLayout>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <RetailerDashboard activeTab={activeTab} />
            </motion.div>
          </RetailerLayout>
        );
      default:
    return (
          <div className="flex items-center justify-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
    }
  };

  return renderDashboardByRole();
};

export default Dashboard;
