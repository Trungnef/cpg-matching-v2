import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./contexts/UserContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import Manufacturers from "./pages/Manufacturers";
import Profile from "./pages/Profile";
import Solutions from "./pages/Solutions";
import NotFound from "./pages/NotFound";
import VerifyEmail from "./pages/VerifyEmail";
import ProfileSetupPage from "./pages/ProfileSetupPage"; // BỎ TẠM THỜI: không cần bước này

// Resource pages
import Blog from "./pages/Blog";
import CaseStudies from "./pages/CaseStudies";
import Webinars from "./pages/Webinars";

// AI Web Crawler
import WebCrawler from "./pages/admin/crawler/WebCrawler";
import ProductCatalog from "./pages/admin/catalog/ProductCatalog";

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
import BrandParterships from "./pages/brand/Partnerships";
import BrandRetailers from "./pages/brand/Retailers";
import BrandSettings from "./pages/brand/Settings";

// Retailer pages
import RetailerInventory from "./pages/retailer/Inventory";
import RetailerBrands from "./pages/retailer/Brands";
import RetailerAnalytics from "./pages/retailer/Analytics";
import RetailerPartnerships from "./pages/retailer/Partnerships";
import RetailerSettings from "./pages/retailer/Settings";
import RetailerOrders from "./pages/retailer/Orders";

// Contexts
import { FavoriteProvider } from "@/contexts/FavoriteContext";
import { CompareProvider } from "@/contexts/CompareContext";
import { ManufacturerFavoriteProvider } from "@/contexts/ManufacturerFavoriteContext";
import { ManufacturerCompareProvider } from "@/contexts/ManufacturerCompareContext";
import { ScrollProvider } from "@/contexts/ScrollContext";
import { ProductFavoriteProvider } from "@/contexts/ProductFavoriteContext";

// Admin pages
import AdminLogin from './pages/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import Analytics from './pages/admin/Analytics';
import ActivityLog from './pages/admin/ActivityLog';
import Announcements from './pages/admin/Announcements';
import Settings from './pages/admin/Settings';
import AdminProfile from './pages/admin/AdminProfile';
import AdminHelp from './pages/admin/AdminHelp';

import { ThemeProvider } from "./contexts/ThemeContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <UserProvider>
        <LanguageProvider>
          <ThemeProvider>
            <ScrollProvider>
              <FavoriteProvider>
                <ProductFavoriteProvider>
                  <CompareProvider>
                    <ManufacturerFavoriteProvider>
                      <ManufacturerCompareProvider>
                        <Toaster />
                        <Sonner />
                        <Router>
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
                            <Route path="/verify-email" element={<VerifyEmail />} />

                            {/* BỎ TẠM THỜI: Không dùng bước profile-setup */}
                            <Route 
                              path="/profile-setup" 
                              element={
                                <ProtectedRoute 
                                  element={<ProfileSetupPage />} 
                                  allowedRoles={["manufacturer", "brand", "retailer"]} 
                                />
                              } 
                            />

                            {/* Pages with footer */}
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
                            
                            {/* Manufacturer */}
                            <Route path="/manufacturer/production" element={<ProtectedRoute element={<ManufacturerProduction />} allowedRoles={["manufacturer"]} />} />
                            <Route path="/manufacturer/matches" element={<ProtectedRoute element={<ManufacturerMatches />} allowedRoles={["manufacturer"]} />} />
                            <Route path="/manufacturer/analytics" element={<ProtectedRoute element={<ManufacturerAnalytics />} allowedRoles={["manufacturer"]} />} />
                            <Route path="/manufacturer/settings" element={<ProtectedRoute element={<ManufacturerSettings />} allowedRoles={["manufacturer"]} />} />
                            <Route path="/manufacturer/inventory" element={<ProtectedRoute element={<ManufacturerInventory />} allowedRoles={["manufacturer"]} />} />
                            <Route path="/manufacturer/suppliers" element={<ProtectedRoute element={<ManufacturerSuppliers />} allowedRoles={["manufacturer"]} />} />

                            {/* Brand */}
                            <Route path="/brand/products" element={<ProtectedRoute element={<BrandProducts />} allowedRoles={["brand"]} />} />
                            <Route path="/brand/manufacturers" element={<ProtectedRoute element={<BrandManufacturers />} allowedRoles={["brand"]} />} />
                            <Route path="/brand/analytics" element={<ProtectedRoute element={<BrandAnalytics />} allowedRoles={["brand"]} />} />
                            <Route path="/brand/brands" element={<ProtectedRoute element={<BrandBrands />} allowedRoles={["brand"]} />} />
                            <Route path="/brand/retailers" element={<ProtectedRoute element={<BrandRetailers />} allowedRoles={["brand"]} />} />
                            <Route path="/brand/settings" element={<ProtectedRoute element={<BrandSettings />} allowedRoles={["brand"]} />} />
                            <Route path="/brand/partnerships" element={<ProtectedRoute element={<BrandParterships />} allowedRoles={["brand"]} />} />

                            {/* Retailer */}
                            <Route path="/retailer/inventory" element={<ProtectedRoute element={<RetailerInventory />} allowedRoles={["retailer"]} />} />
                            <Route path="/retailer/brands" element={<ProtectedRoute element={<RetailerBrands />} allowedRoles={["retailer"]} />} />
                            <Route path="/retailer/analytics" element={<ProtectedRoute element={<RetailerAnalytics />} allowedRoles={["retailer"]} />} />
                            <Route path="/retailer/partnerships" element={<ProtectedRoute element={<RetailerPartnerships />} allowedRoles={["retailer"]} />} />
                            <Route path="/retailer/settings" element={<ProtectedRoute element={<RetailerSettings />} allowedRoles={["retailer"]} />} />
                            <Route path="/retailer/orders" element={<ProtectedRoute element={<RetailerOrders />} allowedRoles={["retailer"]} />} />

                            {/* Admin */}
                            <Route path="/admin/login" element={<AdminLogin />} />
                            <Route path="/admin" element={<AdminLayout />}>
                              <Route index element={<Navigate to="/admin/dashboard" replace />} />
                              <Route path="dashboard" element={<AdminDashboard />} />
                              <Route path="users" element={<UserManagement />} />
                              <Route path="announcements" element={<Announcements />} />
                              <Route path="activity" element={<ActivityLog />} />
                              <Route path="analytics" element={<Analytics />} />
                              <Route path="settings" element={<Settings />} />
                              <Route path="profile" element={<AdminProfile />} />
                              <Route path="help" element={<AdminHelp />} />
                              <Route path="crawler/webcrawler" element={<WebCrawler />} />
                              <Route path="catalog/productcatalog" element={<ProductCatalog />} />
                            </Route>

                            {/* Catch all */}
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </Router>
                      </ManufacturerCompareProvider>
                    </ManufacturerFavoriteProvider>
                  </CompareProvider>
                </ProductFavoriteProvider>
              </FavoriteProvider>
            </ScrollProvider>
          </ThemeProvider>
        </LanguageProvider>
      </UserProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
