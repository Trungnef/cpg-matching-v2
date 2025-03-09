
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";

// Mock product data - in a real app, this would come from an API
const mockProducts = [
  {
    id: 1,
    name: "Organic Granola",
    category: "Breakfast Foods",
    manufacturer: "Nature's Best",
    image: "/placeholder.svg",
    price: "$4.99",
    certifications: ["Organic", "Non-GMO"],
    rating: 4.5,
    packagingType: "Cardboard Box"
  },
  {
    id: 2,
    name: "Premium Coffee Beans",
    category: "Beverages",
    manufacturer: "Mountain Roasters",
    image: "/placeholder.svg",
    price: "$12.99",
    certifications: ["Fair Trade", "Organic"],
    rating: 4.8,
    packagingType: "Resealable Bag"
  },
  {
    id: 3,
    name: "Almond Butter",
    category: "Spreads",
    manufacturer: "Pure Foods Co.",
    image: "/placeholder.svg",
    price: "$7.99",
    certifications: ["Non-GMO", "Gluten-Free"],
    rating: 4.2,
    packagingType: "Glass Jar"
  },
  {
    id: 4,
    name: "Protein Bars",
    category: "Snacks",
    manufacturer: "Fitness Nutrition",
    image: "/placeholder.svg",
    price: "$2.49",
    certifications: ["High-Protein", "Low-Sugar"],
    rating: 4.0,
    packagingType: "Wrapper"
  },
  {
    id: 5,
    name: "Sparkling Water",
    category: "Beverages",
    manufacturer: "Clear Springs",
    image: "/placeholder.svg",
    price: "$1.29",
    certifications: ["Zero-Calorie"],
    rating: 4.3,
    packagingType: "Aluminum Can"
  },
  {
    id: 6,
    name: "Dried Fruit Mix",
    category: "Snacks",
    manufacturer: "Harvest Farms",
    image: "/placeholder.svg",
    price: "$5.49",
    certifications: ["No Added Sugar", "Organic"],
    rating: 4.6,
    packagingType: "Resealable Pouch"
  }
];

// Category options
const categories = [
  "All Categories",
  "Breakfast Foods",
  "Beverages",
  "Snacks",
  "Spreads",
  "Condiments",
  "Dairy & Alternatives",
  "Baking"
];

// Certification options
const certifications = [
  "Organic",
  "Non-GMO",
  "Gluten-Free",
  "Fair Trade",
  "No Added Sugar",
  "High-Protein",
  "Low-Sugar",
  "Zero-Calorie"
];

// Packaging types
const packagingTypes = [
  "Cardboard Box",
  "Glass Jar",
  "Aluminum Can",
  "Plastic Bottle",
  "Resealable Bag",
  "Resealable Pouch",
  "Wrapper",
  "Tetra Pak"
];

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [products, setProducts] = useState(mockProducts);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);
  const [selectedPackaging, setSelectedPackaging] = useState<string[]>([]);
  const [activeView, setActiveView] = useState("grid");

  // Page title effect
  useEffect(() => {
    document.title = "Browse Products - CPG Matchmaker";
  }, []);

  // Update search params when search term changes
  useEffect(() => {
    if (searchTerm) {
      searchParams.set("q", searchTerm);
    } else {
      searchParams.delete("q");
    }
    setSearchParams(searchParams);
  }, [searchTerm, searchParams, setSearchParams]);

  // Filter products based on search term, category, certifications, and packaging
  useEffect(() => {
    let filteredProducts = [...mockProducts];

    // Filter by search term
    if (searchTerm) {
      filteredProducts = filteredProducts.filter(
        product => 
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory !== "All Categories") {
      filteredProducts = filteredProducts.filter(
        product => product.category === activeCategory
      );
    }

    // Filter by certifications
    if (selectedCertifications.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedCertifications.every(cert => 
          product.certifications.includes(cert)
        )
      );
    }

    // Filter by packaging type
    if (selectedPackaging.length > 0) {
      filteredProducts = filteredProducts.filter(product => 
        selectedPackaging.includes(product.packagingType)
      );
    }

    setProducts(filteredProducts);
  }, [searchTerm, activeCategory, selectedCertifications, selectedPackaging]);

  // Toggle certification selection
  const toggleCertification = (cert: string) => {
    setSelectedCertifications(prev => 
      prev.includes(cert) 
        ? prev.filter(c => c !== cert) 
        : [...prev, cert]
    );
  };

  // Toggle packaging selection
  const togglePackaging = (packaging: string) => {
    setSelectedPackaging(prev => 
      prev.includes(packaging) 
        ? prev.filter(p => p !== packaging) 
        : [...prev, packaging]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory("All Categories");
    setSelectedCertifications([]);
    setSelectedPackaging([]);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Browse Products</h1>
              <p className="text-foreground/70">
                Discover the perfect products for your CPG business
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                Filters
                {(selectedCertifications.length > 0 || selectedPackaging.length > 0 || activeCategory !== "All Categories") && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCertifications.length + selectedPackaging.length + (activeCategory !== "All Categories" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
              
              <Tabs defaultValue={activeView} onValueChange={setActiveView} className="w-auto">
                <TabsList className="grid w-[120px] grid-cols-2">
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="mb-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search products, manufacturers, or categories..."
                className="pl-10 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
          
          {/* Active filters */}
          {(selectedCertifications.length > 0 || selectedPackaging.length > 0 || activeCategory !== "All Categories") && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-foreground/70">Active filters:</span>
              
              {activeCategory !== "All Categories" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {activeCategory}
                  <button onClick={() => setActiveCategory("All Categories")}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              
              {selectedCertifications.map(cert => (
                <Badge key={cert} variant="secondary" className="flex items-center gap-1">
                  {cert}
                  <button onClick={() => toggleCertification(cert)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              {selectedPackaging.map(pkg => (
                <Badge key={pkg} variant="secondary" className="flex items-center gap-1">
                  {pkg}
                  <button onClick={() => togglePackaging(pkg)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                Clear all
              </Button>
            </div>
          )}
          
          {/* Filter sidebar and product grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filter sidebar - shown/hidden on mobile */}
            {showFilters && (
              <div className="md:col-span-1 space-y-6 bg-card p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="md:hidden"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <div className="space-y-1">
                    {categories.map(category => (
                      <Button
                        key={category}
                        variant={activeCategory === category ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-sm h-8"
                        onClick={() => setActiveCategory(category)}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Certifications</h4>
                  <div className="flex flex-wrap gap-2">
                    {certifications.map(cert => (
                      <Badge
                        key={cert}
                        variant={selectedCertifications.includes(cert) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleCertification(cert)}
                      >
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Packaging Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {packagingTypes.map(pkg => (
                      <Badge
                        key={pkg}
                        variant={selectedPackaging.includes(pkg) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => togglePackaging(pkg)}
                      >
                        {pkg}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={clearFilters}
                >
                  Clear All Filters
                </Button>
              </div>
            )}
            
            {/* Products grid */}
            <div className={`${showFilters ? 'md:col-span-3' : 'md:col-span-4'}`}>
              <Tabs value={activeView} className="w-full">
                <TabsContent value="grid" className="m-0">
                  {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-lg text-foreground/70">No products found matching your criteria.</p>
                      <Button variant="outline" className="mt-4" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="list" className="m-0">
                  {products.length > 0 ? (
                    <div className="space-y-4">
                      {products.map(product => (
                        <div key={product.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                          <div className="w-full sm:w-32 h-32 bg-muted rounded-md flex items-center justify-center">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="w-16 h-16 object-contain"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-foreground/70">{product.manufacturer}</p>
                            <p className="text-sm mb-2">{product.category}</p>
                            <div className="flex flex-wrap gap-1 mb-2">
                              {product.certifications.map(cert => (
                                <Badge key={cert} variant="outline" className="text-xs">
                                  {cert}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="font-medium">{product.price}</p>
                              <Badge>{product.packagingType}</Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-lg text-foreground/70">No products found matching your criteria.</p>
                      <Button variant="outline" className="mt-4" onClick={clearFilters}>
                        Clear Filters
                      </Button>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
