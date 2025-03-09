
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import ManufacturerCard from "@/components/ManufacturerCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, X } from "lucide-react";

// Mock manufacturer data - in a real app, this would come from an API
const mockManufacturers = [
  {
    id: 1,
    name: "Nature's Best Foods",
    location: "Portland, Oregon",
    logo: "/placeholder.svg",
    categories: ["Snacks", "Breakfast Foods"],
    certifications: ["Organic", "Non-GMO", "Gluten-Free"],
    minOrderSize: "1,000 units",
    establishedYear: 2008,
    rating: 4.8
  },
  {
    id: 2,
    name: "Pure Foods Co.",
    location: "Austin, Texas",
    logo: "/placeholder.svg",
    categories: ["Spreads", "Condiments"],
    certifications: ["Organic", "Non-GMO"],
    minOrderSize: "5,000 units",
    establishedYear: 2012,
    rating: 4.5
  },
  {
    id: 3,
    name: "Mountain Roasters",
    location: "Seattle, Washington",
    logo: "/placeholder.svg",
    categories: ["Beverages"],
    certifications: ["Fair Trade", "Organic"],
    minOrderSize: "2,500 units",
    establishedYear: 2005,
    rating: 4.9
  },
  {
    id: 4,
    name: "Fitness Nutrition",
    location: "Los Angeles, California",
    logo: "/placeholder.svg",
    categories: ["Protein Products", "Health Foods"],
    certifications: ["Gluten-Free", "High-Protein"],
    minOrderSize: "10,000 units",
    establishedYear: 2015,
    rating: 4.2
  },
  {
    id: 5,
    name: "Clear Springs Beverage Co.",
    location: "Denver, Colorado",
    logo: "/placeholder.svg",
    categories: ["Beverages", "Water"],
    certifications: ["BPA-Free"],
    minOrderSize: "25,000 units",
    establishedYear: 2010,
    rating: 4.6
  },
  {
    id: 6,
    name: "Harvest Farms Products",
    location: "Chicago, Illinois",
    logo: "/placeholder.svg",
    categories: ["Snacks", "Dried Goods"],
    certifications: ["Organic", "No Added Sugar"],
    minOrderSize: "3,000 units",
    establishedYear: 2007,
    rating: 4.7
  }
];

// Category options
const categories = [
  "All Categories",
  "Beverages",
  "Breakfast Foods",
  "Condiments",
  "Dried Goods",
  "Health Foods",
  "Protein Products",
  "Snacks",
  "Spreads",
  "Water"
];

// Certification options
const certifications = [
  "Organic",
  "Non-GMO",
  "Gluten-Free",
  "Fair Trade",
  "No Added Sugar",
  "High-Protein",
  "BPA-Free"
];

// Locations
const locations = [
  "All Locations",
  "Portland, Oregon",
  "Austin, Texas",
  "Seattle, Washington",
  "Los Angeles, California",
  "Denver, Colorado",
  "Chicago, Illinois"
];

const Manufacturers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [manufacturers, setManufacturers] = useState(mockManufacturers);
  const [showFilters, setShowFilters] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeLocation, setActiveLocation] = useState("All Locations");
  const [selectedCertifications, setSelectedCertifications] = useState<string[]>([]);

  // Page title effect
  useEffect(() => {
    document.title = "Manufacturers - CPG Matchmaker";
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

  // Filter manufacturers based on search term, category, location, and certifications
  useEffect(() => {
    let filteredManufacturers = [...mockManufacturers];

    // Filter by search term
    if (searchTerm) {
      filteredManufacturers = filteredManufacturers.filter(
        manufacturer => 
          manufacturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          manufacturer.categories.some(category => 
            category.toLowerCase().includes(searchTerm.toLowerCase())
          ) ||
          manufacturer.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (activeCategory !== "All Categories") {
      filteredManufacturers = filteredManufacturers.filter(
        manufacturer => manufacturer.categories.includes(activeCategory)
      );
    }

    // Filter by location
    if (activeLocation !== "All Locations") {
      filteredManufacturers = filteredManufacturers.filter(
        manufacturer => manufacturer.location === activeLocation
      );
    }

    // Filter by certifications
    if (selectedCertifications.length > 0) {
      filteredManufacturers = filteredManufacturers.filter(manufacturer => 
        selectedCertifications.every(cert => 
          manufacturer.certifications.includes(cert)
        )
      );
    }

    setManufacturers(filteredManufacturers);
  }, [searchTerm, activeCategory, activeLocation, selectedCertifications]);

  // Toggle certification selection
  const toggleCertification = (cert: string) => {
    setSelectedCertifications(prev => 
      prev.includes(cert) 
        ? prev.filter(c => c !== cert) 
        : [...prev, cert]
    );
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveCategory("All Categories");
    setActiveLocation("All Locations");
    setSelectedCertifications([]);
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Manufacturers</h1>
              <p className="text-foreground/70">
                Find the perfect manufacturer for your CPG products
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
                {(selectedCertifications.length > 0 || activeCategory !== "All Categories" || activeLocation !== "All Locations") && (
                  <Badge variant="secondary" className="ml-1">
                    {selectedCertifications.length + (activeCategory !== "All Categories" ? 1 : 0) + (activeLocation !== "All Locations" ? 1 : 0)}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
          
          <div className="mb-8 relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search manufacturers, categories, or locations..."
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
          {(selectedCertifications.length > 0 || activeCategory !== "All Categories" || activeLocation !== "All Locations") && (
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
              
              {activeLocation !== "All Locations" && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {activeLocation}
                  <button onClick={() => setActiveLocation("All Locations")}>
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
              
              <Button variant="ghost" size="sm" onClick={clearFilters} className="text-xs">
                Clear all
              </Button>
            </div>
          )}
          
          {/* Filter sidebar and manufacturers grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Filter sidebar - shown/hidden on mobile */}
            {showFilters && (
              <div className="md:col-span-1 space-y-6 bg-card p-4 rounded-lg shadow-sm">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
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
                  <h4 className="text-sm font-medium mb-2">Location</h4>
                  <div className="space-y-1">
                    {locations.map(location => (
                      <Button
                        key={location}
                        variant={activeLocation === location ? "secondary" : "ghost"}
                        size="sm"
                        className="w-full justify-start text-sm h-8"
                        onClick={() => setActiveLocation(location)}
                      >
                        {location !== "All Locations" && <MapPin className="h-3 w-3 mr-2" />}
                        {location}
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
            
            {/* Manufacturers grid */}
            <div className={`${showFilters ? 'md:col-span-3' : 'md:col-span-4'}`}>
              {manufacturers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {manufacturers.map(manufacturer => (
                    <ManufacturerCard key={manufacturer.id} manufacturer={manufacturer} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-lg text-foreground/70">No manufacturers found matching your criteria.</p>
                  <Button variant="outline" className="mt-4" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Manufacturers;
