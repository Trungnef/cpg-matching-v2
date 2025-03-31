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

// Mock product data
const products = [
  {
    id: 1,
    name: "Organic Cereal",
    category: "Food",
    status: "Active",
    moq: 1000,
    capacity: "15,000 units/day",
    clients: 3,
    image: "/placeholder.svg",
    inventory: [
      {
        id: 101,
        name: "Organic Oats",
        category: "Raw Materials",
        status: "In Stock",
        quantity: 15000,
        unit: "kg",
        threshold: 5000,
        location: "Warehouse A"
      },
      {
        id: 102,
        name: "Honey",
        category: "Raw Materials",
        status: "Low Stock",
        quantity: 1200,
        unit: "liters",
        threshold: 1500,
        location: "Warehouse B"
      },
      {
        id: 103,
        name: "Cardboard Boxes",
        category: "Packaging",
        status: "In Stock",
        quantity: 12000,
        unit: "units",
        threshold: 5000,
        location: "Warehouse C"
      }
    ]
  },
  {
    id: 2,
    name: "Energy Bars",
    category: "Food",
    status: "Active",
    moq: 2000,
    capacity: "12,000 units/day",
    clients: 2,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Protein Shake",
    category: "Beverage",
    status: "Development",
    moq: 5000,
    capacity: "8,000 units/day",
    clients: 0,
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Organic Juice",
    category: "Beverage",
    status: "Active",
    moq: 3000,
    capacity: "10,000 units/day",
    clients: 4,
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Trail Mix",
    category: "Food",
    status: "Active",
    moq: 1500,
    capacity: "8,000 units/day",
    clients: 1,
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Vegan Cookies",
    category: "Food",
    status: "Inactive",
    moq: 2000,
    capacity: "5,000 units/day",
    clients: 0,
    image: "/placeholder.svg"
  }
];

// Mock production data
const productionLines = [
  { 
    id: 1, 
    name: "Line A", 
    status: "Active", 
    product: "Organic Cereal", 
    efficiency: 92,
    daily_capacity: "6,000 units",
    next_maintenance: "2023-10-15"
  },
  { 
    id: 2, 
    name: "Line B", 
    status: "Active", 
    product: "Energy Bars", 
    efficiency: 88,
    daily_capacity: "5,200 units",
    next_maintenance: "2023-10-12"
  },
  { 
    id: 3, 
    name: "Line C", 
    status: "Active", 
    product: "Organic Juice", 
    efficiency: 95,
    daily_capacity: "8,000 units",
    next_maintenance: "2023-10-22"
  },
  { 
    id: 4, 
    name: "Line D", 
    status: "Maintenance", 
    product: "Trail Mix", 
    efficiency: 0,
    daily_capacity: "4,000 units",
    next_maintenance: "2023-10-18"
  }
];

// Mock alerts
const alerts = [
  { id: 1, type: "warning", message: "Line B maintenance scheduled for tomorrow", time: "2 hours ago" },
  { id: 2, type: "critical", message: "Raw material shortage for Line C", time: "1 day ago" },
  { id: 3, type: "info", message: "Quality check passed for Line A", time: "3 days ago" },
];

// Mock suppliers data
const suppliers = [
  {
    id: 1,
    name: "Organic Farms Co.",
    category: "Raw Materials",
    status: "Active",
    reliability: "98%",
    leadTime: "3-5 days",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Eco Packaging Ltd.",
    category: "Packaging",
    status: "Active",
    reliability: "95%",
    leadTime: "4-6 days",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Pure Ingredients Inc.",
    category: "Raw Materials",
    status: "Active",
    reliability: "99%",
    leadTime: "2-4 days",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Green Box Solutions",
    category: "Packaging",
    status: "Inactive",
    reliability: "85%",
    leadTime: "7-10 days",
    image: "/placeholder.svg"
  }
];

// Mock inventory data
const inventory = [
  {
    id: 1,
    name: "Organic Oats",
    category: "Raw Materials",
    status: "In Stock",
    quantity: 15000,
    unit: "kg",
    threshold: 5000,
    usedIn: 3,
    location: "Warehouse A",
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Honey",
    category: "Raw Materials",
    status: "Low Stock",
    quantity: 1200,
    unit: "liters",
    threshold: 1500,
    usedIn: 4,
    location: "Warehouse B",
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Protein Powder",
    category: "Raw Materials",
    status: "In Stock",
    quantity: 8000,
    unit: "kg",
    threshold: 3000,
    usedIn: 2,
    location: "Warehouse A",
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Glass Bottles (500ml)",
    category: "Packaging",
    status: "Low Stock",
    quantity: 5000,
    unit: "units",
    threshold: 8000,
    usedIn: 1,
    location: "Warehouse C",
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Cardboard Boxes",
    category: "Packaging",
    status: "In Stock",
    quantity: 12000,
    unit: "units",
    threshold: 5000,
    usedIn: 5,
    location: "Warehouse C",
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Vitamin C",
    category: "Additives",
    status: "Out of Stock",
    quantity: 0,
    unit: "kg",
    threshold: 200,
    usedIn: 2,
    location: "Warehouse B",
    image: "/placeholder.svg"
  }
];

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

// Mock data for analytics charts
const monthlyProductionData = [
  { name: "Jan", volume: 12000 },
  { name: "Feb", volume: 14000 },
  { name: "Mar", volume: 15000 },
  { name: "Apr", volume: 13500 },
  { name: "May", volume: 15500 },
  { name: "Jun", volume: 16800 },
  { name: "Jul", volume: 18000 },
  { name: "Aug", volume: 17500 },
  { name: "Sep", volume: 16000 },
  { name: "Oct", volume: 15000 },
  { name: "Nov", volume: 16500 },
  { name: "Dec", volume: 17800 },
];

const productBreakdownData = [
  { name: "Organic Cereal", value: 40 },
  { name: "Energy Bars", value: 25 },
  { name: "Protein Shake", value: 15 },
  { name: "Organic Juice", value: 20 },
];

const qualityMetricsData = [
  { name: "Jan", defectRate: 0.8, qualityScore: 92 },
  { name: "Feb", defectRate: 0.7, qualityScore: 93 },
  { name: "Mar", defectRate: 0.5, qualityScore: 95 },
  { name: "Apr", defectRate: 0.9, qualityScore: 90 },
  { name: "May", defectRate: 0.6, qualityScore: 94 },
  { name: "Jun", defectRate: 0.4, qualityScore: 96 },
];

const clientDistributionData = [
  { name: "Direct Brands", value: 65 },
  { name: "White Label", value: 25 },
  { name: "Retailers", value: 10 },
];

const COLORS = ["#8884d8", "#83a6ed", "#8dd1e1", "#82ca9d", "#a4de6c"];

// Mock manufacturers data
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

// Mock brands data
const brandsData = [
  {
    id: 1,
    name: "Green Earth Foods",
    category: "Organic Foods",
    status: "Active Partner",
    products: 12,
    relationship: "3 years",
    rating: 4.8,
    image: "/placeholder.svg"
  },
  {
    id: 2,
    name: "Pure Wellness",
    category: "Health Supplements",
    status: "Active Partner",
    products: 8,
    relationship: "2 years",
    rating: 4.5,
    image: "/placeholder.svg"
  },
  {
    id: 3,
    name: "Natural Living",
    category: "Household Products",
    status: "Negotiating",
    products: 0,
    relationship: "Prospect",
    rating: 4.2,
    image: "/placeholder.svg"
  },
  {
    id: 4,
    name: "Fresh Harvest",
    category: "Organic Foods",
    status: "Active Partner",
    products: 5,
    relationship: "1 year",
    rating: 4.6,
    image: "/placeholder.svg"
  },
  {
    id: 5,
    name: "Eco Essentials",
    category: "Sustainable Products",
    status: "Onboarding",
    products: 3,
    relationship: "New Partner",
    rating: 4.0,
    image: "/placeholder.svg"
  },
  {
    id: 6,
    name: "Vital Nutrition",
    category: "Health Supplements",
    status: "Inactive",
    products: 0,
    relationship: "Past Partner",
    rating: 3.7,
    image: "/placeholder.svg"
  }
];

// Mock retailer brand partners data
const retailerBrands = [
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
