import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, ShoppingBag, Trash2, Eye, Building2, MapPin, Star, Factory, Globe, Mail, Phone } from "lucide-react";
import { useFavorites } from "@/contexts/FavoriteContext";
import { useManufacturerFavorites } from "@/contexts/ManufacturerFavoriteContext";
import { useProductFavorites } from "@/contexts/ProductFavoriteContext";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface Manufacturer {
  id: number;
  name: string;
  logo: string;
  location: string;
  categories: string[];
  certifications: string[];
  rating: number;
  website?: string;
  email?: string;
  phone?: string;
  description?: string;
  minOrderSize: string;
  establishedYear: number;
}

interface Product {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  image: string;
  price: string;
  certifications: string[];
  rating: number;
  packagingType: string;
  description?: string;
  minOrderQuantity?: number;
  leadTime?: string;
  sustainable?: boolean;
}

const FavoritesMenu = () => {
  const { favorites: productFavorites, toggleFavorite: toggleProduct, clearFavorites: clearProducts } = useProductFavorites();
  const { favorites: manufacturerFavorites, toggleFavorite: toggleManufacturer } = useManufacturerFavorites();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const [activeTab, setActiveTab] = useState("products");
  const [selectedManufacturer, setSelectedManufacturer] = useState<Manufacturer | null>(null);
  const [showManufacturerDetails, setShowManufacturerDetails] = useState(false);

  const totalFavorites = productFavorites.length + manufacturerFavorites.length;

  // Add shake animation when new item is added to favorites
  useEffect(() => {
    if (totalFavorites > 0) {
      setIsShaking(true);
      const timer = setTimeout(() => setIsShaking(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [totalFavorites]);

  const viewProductDetails = (productId: number) => {
    setIsOpen(false);
    navigate(`/products?productId=${productId}`);
  };

  const viewManufacturerDetails = (manufacturer: Manufacturer) => {
    setSelectedManufacturer(manufacturer);
    setShowManufacturerDetails(true);
    setIsOpen(false);
  };

  const handleViewDetails = (manufacturerId: number) => {
    navigate(`/manufacturers?id=${manufacturerId}`);
  };

  return (
    <>
      <Dialog open={showManufacturerDetails} onOpenChange={setShowManufacturerDetails}>
        <DialogContent className="max-w-[800px] p-0">
          {selectedManufacturer && (
            <div className="overflow-y-auto no-scrollbar">
              <div className="relative h-56 bg-gradient-to-b from-primary/20 to-muted">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 h-8 w-8 bg-background/50 backdrop-blur-sm hover:bg-background/80"
                  onClick={() => setShowManufacturerDetails(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                <div className="absolute -bottom-16 left-6">
                  <div className="w-32 h-32 rounded-xl bg-background shadow-lg flex items-center justify-center p-3 ring-2 ring-border">
                    <img
                      src={selectedManufacturer.logo}
                      alt={selectedManufacturer.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="px-6 pt-20 pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-semibold">{selectedManufacturer.name}</h3>
                    <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{selectedManufacturer.location}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 hover:bg-red-50 hover:border-red-200 transition-colors"
                    onClick={() => toggleManufacturer(selectedManufacturer)}
                  >
                    <Heart className={cn(
                      "h-4 w-4 transition-colors",
                      manufacturerFavorites.some(m => m.id === selectedManufacturer.id) 
                        ? "fill-red-500 text-red-500" 
                        : "text-muted-foreground"
                    )} />
                    {manufacturerFavorites.some(m => m.id === selectedManufacturer.id) 
                      ? "Remove from Favorites"
                      : "Add to Favorites"
                    }
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8">
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <span className="bg-primary/10 p-1.5 rounded-md">
                          <Building2 className="h-4 w-4 text-primary" />
                        </span>
                        Categories
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedManufacturer.categories.map((category) => (
                          <Badge key={category} variant="secondary" className="bg-primary/10 hover:bg-primary/20 transition-colors">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <span className="bg-blue-50 p-1.5 rounded-md">
                          <Star className="h-4 w-4 text-blue-500" />
                        </span>
                        Certifications
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedManufacturer.certifications.map((cert) => (
                          <Badge key={cert} variant="outline" className="hover:bg-muted/50 transition-colors">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <span className="bg-green-50 p-1.5 rounded-md">
                          <Building2 className="h-4 w-4 text-green-500" />
                        </span>
                        Business Information
                      </h4>
                      <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Established</p>
                          <p className="text-sm font-medium">{selectedManufacturer.establishedYear}</p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground">Minimum Order</p>
                          <p className="text-sm font-medium">{selectedManufacturer.minOrderSize}</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <span className="bg-yellow-50 p-1.5 rounded-md">
                          <Star className="h-4 w-4 text-yellow-500" />
                        </span>
                        Rating
                      </h4>
                      <div className="p-4 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-5 w-5",
                                i < selectedManufacturer.rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground/30"
                              )}
                            />
                          ))}
                          <span className="text-sm font-medium text-muted-foreground ml-2">
                            ({selectedManufacturer.rating}/5)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium flex items-center gap-2">
                        <span className="bg-purple-50 p-1.5 rounded-md">
                          <Phone className="h-4 w-4 text-purple-500" />
                        </span>
                        Contact Information
                      </h4>
                      <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                        {selectedManufacturer.website && (
                          <div className="flex items-center gap-3 group">
                            <div className="p-2 rounded-md bg-background">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <a
                              href={selectedManufacturer.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                            >
                              {selectedManufacturer.website}
                            </a>
                          </div>
                        )}
                        {selectedManufacturer.email && (
                          <div className="flex items-center gap-3 group">
                            <div className="p-2 rounded-md bg-background">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <a
                              href={`mailto:${selectedManufacturer.email}`}
                              className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                            >
                              {selectedManufacturer.email}
                            </a>
                          </div>
                        )}
                        {selectedManufacturer.phone && (
                          <div className="flex items-center gap-3 group">
                            <div className="p-2 rounded-md bg-background">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <a
                              href={`tel:${selectedManufacturer.phone}`}
                              className="text-sm text-muted-foreground hover:text-primary hover:underline transition-colors"
                            >
                              {selectedManufacturer.phone}
                            </a>
                          </div>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-2 hover:bg-primary hover:text-primary-foreground"
                          onClick={() => {
                            window.location.href = `mailto:${selectedManufacturer.email}?subject=Inquiry about ${selectedManufacturer.name}`;
                          }}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email Inquiry
                        </Button>
                      </div>
                    </div>

                    {selectedManufacturer.description && (
                      <div className="space-y-3">
                        <h4 className="text-sm font-medium flex items-center gap-2">
                          <span className="bg-orange-50 p-1.5 rounded-md">
                            <Building2 className="h-4 w-4 text-orange-500" />
                          </span>
                          About
                        </h4>
                        <div className="p-4 bg-muted/30 rounded-lg">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {selectedManufacturer.description}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <Button
                    variant="outline"
                    className="sm:w-auto"
                    onClick={() => setShowManufacturerDetails(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="sm:w-auto"
                    onClick={() => {
                      setShowManufacturerDetails(false);
                      handleViewDetails(selectedManufacturer.id);
                    }}
                  >
                    View Full Profile
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <motion.div
            className="relative inline-flex items-center justify-center"
            initial={false}
            animate={isShaking ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            <Button
              variant="ghost"
              size="icon"
              className="relative h-9 w-9 rounded-full hover:bg-muted/50"
              aria-label="Favorites"
            >
              <Heart
                className={cn(
                  "h-[18px] w-[18px] transition-all duration-300",
                  totalFavorites > 0 ? "text-red-500 fill-red-500 scale-110" : "scale-100"
                )}
              />
              <AnimatePresence>
                {totalFavorites > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1 -right-1"
                  >
                    <Badge
                      variant="secondary"
                      className="bg-red-500 hover:bg-red-600 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center p-0 rounded-full"
                    >
                      {totalFavorites}
                    </Badge>
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="end" 
          className="w-[400px] p-2"
          sideOffset={8}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-2">
              <TabsList className="grid w-[320px] grid-cols-2 p-1 bg-muted/50">
                <TabsTrigger 
                  value="products" 
                  className={cn(
                    "relative flex items-center justify-center py-2 text-sm",
                    activeTab === "products" && "bg-background shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-shrink-0">Products</span>
                  </div>
                  {productFavorites.length > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 bg-primary/10 text-primary px-1.5 min-w-[20px] h-5 flex-shrink-0"
                    >
                      {productFavorites.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger 
                  value="manufacturers" 
                  className={cn(
                    "relative flex items-center justify-center py-2 text-sm",
                    activeTab === "manufacturers" && "bg-background shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Factory className="h-4 w-4 flex-shrink-0" />
                    <span className="flex-shrink-0">Manufacturers</span>
                  </div>
                  {manufacturerFavorites.length > 0 && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 bg-primary/10 text-primary px-1.5 min-w-[20px] h-5 flex-shrink-0"
                    >
                      {manufacturerFavorites.length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>
              {((activeTab === "products" && productFavorites.length > 0) || 
                (activeTab === "manufacturers" && manufacturerFavorites.length > 0)) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 hover:bg-muted/50 ml-2 flex-shrink-0"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (activeTab === "products") {
                            clearProducts();
                          } else {
                            manufacturerFavorites.forEach(m => toggleManufacturer(m));
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>Clear all {activeTab}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            <TabsContent value="products" className="mt-1 relative">
              {productFavorites.length > 0 ? (
                <DropdownMenuGroup className="max-h-[320px] overflow-y-auto custom-scrollbar pr-1 no-scrollbar">
                  {productFavorites.map((product) => (
                    <DropdownMenuItem key={product.id} className="p-0 focus:bg-transparent">
                      <div className="w-full p-2 hover:bg-muted/50 rounded-lg flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{product.manufacturer}</p>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-background"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    viewProductDetails(product.id);
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>View details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-background"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleProduct(product);
                                  }}
                                >
                                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>Remove from favorites</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ) : (
                <div className="py-12 px-4 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">No favorite products</p>
                  <p className="text-xs text-muted-foreground/70 mt-1 mb-6">Products you like will appear here</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/products');
                    }}
                  >
                    Browse Products
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="manufacturers" className="mt-1 relative">
              {manufacturerFavorites.length > 0 ? (
                <DropdownMenuGroup className="max-h-[320px] overflow-y-auto custom-scrollbar pr-1 no-scrollbar">
                  {manufacturerFavorites.map((manufacturer) => (
                    <DropdownMenuItem key={manufacturer.id} className="p-0 focus:bg-transparent">
                      <div className="w-full p-2 hover:bg-muted/50 rounded-lg flex items-center gap-3 group">
                        <div className="w-12 h-12 bg-muted/50 rounded-lg flex items-center justify-center overflow-hidden">
                          <img
                            src={manufacturer.logo}
                            alt={manufacturer.name}
                            className="w-8 h-8 object-contain"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{manufacturer.name}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{manufacturer.location}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-background"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    viewManufacturerDetails(manufacturer);
                                  }}
                                >
                                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>View details</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 hover:bg-background"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    toggleManufacturer(manufacturer);
                                  }}
                                >
                                  <X className="h-3.5 w-3.5 text-muted-foreground" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="left">
                                <p>Remove from favorites</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
              ) : (
                <div className="py-12 px-4 text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-sm font-medium text-muted-foreground">No favorite manufacturers</p>
                  <p className="text-xs text-muted-foreground/70 mt-1 mb-6">Manufacturers you like will appear here</p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/manufacturers');
                    }}
                  >
                    Browse Manufacturers
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {((activeTab === "products" && productFavorites.length > 0) || 
            (activeTab === "manufacturers" && manufacturerFavorites.length > 0)) && (
            <>
              <DropdownMenuSeparator className="my-2" />
              <Button 
                className="w-full h-9 text-sm"
                onClick={() => {
                  setIsOpen(false);
                  if (activeTab === "products") {
                    navigate('/products?view=favorites');
                  } else {
                    navigate('/manufacturers?favorites=true');
                  }
                }}
              >
                {activeTab === "products" ? "View All Favorite Products" : "View All Favorite Manufacturers"}
              </Button>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default FavoritesMenu; 