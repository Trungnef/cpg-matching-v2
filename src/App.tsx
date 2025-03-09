
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import Manufacturers from "./pages/Manufacturers";
import Profile from "./pages/Profile";
import Solutions from "./pages/Solutions";
import NotFound from "./pages/NotFound";

// Resource pages
import Blog from "./pages/Blog";
import CaseStudies from "./pages/CaseStudies";
import Webinars from "./pages/Webinars";

// Manufacturer pages
import ManufacturerProduction from "./pages/manufacturer/Production";
import ManufacturerProducts from "./pages/manufacturer/Products";
import ManufacturerMatches from "./pages/manufacturer/Matches";
import ManufacturerAnalytics from "./pages/manufacturer/Analytics";
import ManufacturerSettings from "./pages/manufacturer/Settings";
import ManufacturerInventory from "./pages/manufacturer/Inventory";
import ManufacturerSuppliers from "./pages/manufacturer/Suppliers";

// Brand pages
import BrandProducts from "./pages/brand/Products";
import BrandManufacturers from "./pages/brand/Manufacturers";
import BrandAnalytics from "./pages/brand/Analytics";
import BrandBrands from "./pages/brand/Brands";

// Retailer pages
import RetailerInventory from "./pages/retailer/Inventory";
import RetailerBrands from "./pages/retailer/Brands";
import RetailerAnalytics from "./pages/retailer/Analytics";
import RetailerPartnerships from "./pages/retailer/Partnerships";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute 
                  element={<Dashboard />} 
                  allowedRoles={["manufacturer", "brand", "retailer"]} 
                />
              } 
            />
            <Route path="/auth" element={<Auth />} />
            <Route path="/products" element={<Products />} />
            <Route path="/manufacturers" element={<Manufacturers />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute 
                  element={<Profile />} 
                  allowedRoles={["manufacturer", "brand", "retailer"]} 
                />
              } 
            />
            <Route path="/solutions" element={<Solutions />} />
            
            {/* Resource pages */}
            <Route path="/blog" element={<Blog />} />
            <Route path="/case-studies" element={<CaseStudies />} />
            <Route path="/webinars" element={<Webinars />} />
            
            {/* Manufacturer specific routes */}
            <Route 
              path="/manufacturer/production" 
              element={
                <ProtectedRoute 
                  element={<ManufacturerProduction />} 
                  allowedRoles={["manufacturer"]} 
                />
              } 
            />
            <Route 
              path="/manufacturer/products" 
              element={
                <ProtectedRoute 
                  element={<ManufacturerProducts />} 
                  allowedRoles={["manufacturer"]} 
                />
              } 
            />
            <Route 
              path="/manufacturer/matches" 
              element={
                <ProtectedRoute 
                  element={<ManufacturerMatches />} 
                  allowedRoles={["manufacturer"]} 
                />
              } 
            />
            <Route 
              path="/manufacturer/analytics" 
              element={
                <ProtectedRoute 
                  element={<ManufacturerAnalytics />} 
                  allowedRoles={["manufacturer"]} 
                />
              } 
            />
            <Route 
              path="/manufacturer/settings" 
              element={
                <ProtectedRoute 
                  element={<ManufacturerSettings />} 
                  allowedRoles={["manufacturer"]} 
                />
              } 
            />
            <Route 
              path="/manufacturer/inventory" 
              element={
                <ProtectedRoute 
                  element={<ManufacturerInventory />} 
                  allowedRoles={["manufacturer"]} 
                />
              } 
            />
            <Route 
              path="/manufacturer/suppliers" 
              element={
                <ProtectedRoute 
                  element={<ManufacturerSuppliers />} 
                  allowedRoles={["manufacturer"]} 
                />
              } 
            />
            
            {/* Brand specific routes */}
            <Route 
              path="/brand/products" 
              element={
                <ProtectedRoute 
                  element={<BrandProducts />} 
                  allowedRoles={["brand"]} 
                />
              } 
            />
            <Route 
              path="/brand/manufacturers" 
              element={
                <ProtectedRoute 
                  element={<BrandManufacturers />} 
                  allowedRoles={["brand"]} 
                />
              } 
            />
            <Route 
              path="/brand/analytics" 
              element={
                <ProtectedRoute 
                  element={<BrandAnalytics />} 
                  allowedRoles={["brand"]} 
                />
              } 
            />
            <Route 
              path="/brand/brands" 
              element={
                <ProtectedRoute 
                  element={<BrandBrands />} 
                  allowedRoles={["brand"]} 
                />
              } 
            />
            
            {/* Retailer specific routes */}
            <Route 
              path="/retailer/inventory" 
              element={
                <ProtectedRoute 
                  element={<RetailerInventory />} 
                  allowedRoles={["retailer"]} 
                />
              } 
            />
            <Route 
              path="/retailer/brands" 
              element={
                <ProtectedRoute 
                  element={<RetailerBrands />} 
                  allowedRoles={["retailer"]} 
                />
              } 
            />
            <Route 
              path="/retailer/analytics" 
              element={
                <ProtectedRoute 
                  element={<RetailerAnalytics />} 
                  allowedRoles={["retailer"]} 
                />
              } 
            />
            <Route 
              path="/retailer/partnerships" 
              element={
                <ProtectedRoute 
                  element={<RetailerPartnerships />} 
                  allowedRoles={["retailer"]} 
                />
              } 
            />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
