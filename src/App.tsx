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

// Let's create page wrapper components to add Footer to specific pages
import Footer from "./components/Footer";

// Page wrapper component to include Footer
const PageWithFooter = ({ Component }: { Component: React.ComponentType }) => {
  return (
    <>
      <Component />
      <Footer />
    </>
  );
};

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
import BrandSettings from "./pages/brand/Settings";

// Retailer pages
import RetailerInventory from "./pages/retailer/Inventory";
import RetailerBrands from "./pages/retailer/Brands";
import RetailerAnalytics from "./pages/retailer/Analytics";
import RetailerPartnerships from "./pages/retailer/Partnerships";
import RetailerSettings from "./pages/retailer/Settings";

// TODO: Create ThemeContext and FavoriteContext files in src/contexts/
import { ThemeProvider } from "@/contexts/ThemeContext";
import { FavoriteProvider } from "@/contexts/FavoriteContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { ManufacturerFavoriteProvider } from "@/contexts/ManufacturerFavoriteContext";
import { ManufacturerCompareProvider } from "@/contexts/ManufacturerCompareContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <ThemeProvider>
          <FavoriteProvider>
            <CompareProvider>
              <ManufacturerFavoriteProvider>
                <ManufacturerCompareProvider>
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
                      
                      {/* Updated routes with Footer for all pages as requested */}
                      <Route path="/products" element={<PageWithFooter Component={Products} />} />
                      <Route path="/manufacturers" element={<PageWithFooter Component={Manufacturers} />} />
                      <Route path="/solutions" element={<PageWithFooter Component={Solutions} />} />
                      <Route path="/blog" element={<PageWithFooter Component={Blog} />} />
                      <Route path="/case-studies" element={<PageWithFooter Component={CaseStudies} />} />
                      <Route path="/webinars" element={<PageWithFooter Component={Webinars} />} />
                      
                      <Route 
                        path="/profile" 
                        element={
                          <ProtectedRoute 
                            element={<Profile />} 
                            allowedRoles={["manufacturer", "brand", "retailer"]} 
                          />
                        } 
                      />
                      
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
                      <Route 
                        path="/brand/settings" 
                        element={
                          <ProtectedRoute 
                            element={<BrandSettings />} 
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
                      <Route 
                        path="/retailer/settings" 
                        element={
                          <ProtectedRoute 
                            element={<RetailerSettings />} 
                            allowedRoles={["retailer"]} 
                          />
                        } 
                      />
                      
                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </BrowserRouter>
                </ManufacturerCompareProvider>
              </ManufacturerFavoriteProvider>
            </CompareProvider>
          </FavoriteProvider>
        </ThemeProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
