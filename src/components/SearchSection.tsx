
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Search, Filter, Sliders } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useUser } from "@/contexts/UserContext";

interface SearchFilter {
  id: string;
  label: string;
  active: boolean;
}

const SearchSection = () => {
  const navigate = useNavigate();
  const { role } = useUser();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [filters, setFilters] = useState<SearchFilter[]>([
    { id: "organic", label: "Organic", active: false },
    { id: "gluten-free", label: "Gluten Free", active: false },
    { id: "vegan", label: "Vegan", active: false },
    { id: "dairy-free", label: "Dairy Free", active: false },
    { id: "sugar-free", label: "Sugar Free", active: false },
  ]);

  const toggleFilter = (id: string) => {
    setFilters(filters.map(filter => 
      filter.id === id ? { ...filter, active: !filter.active } : filter
    ));
  };

  const activeFilters = filters.filter(filter => filter.active);

  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (searchQuery) {
      params.set('q', searchQuery);
    }
    
    if (categoryFilter) {
      params.set('category', categoryFilter);
    }
    
    if (activeFilters.length > 0) {
      params.set('filters', activeFilters.map(f => f.id).join(','));
    }
    
    navigate(`/products?${params.toString()}`);
  };

  // Role-specific placeholder text
  const getPlaceholderText = () => {
    switch(role) {
      case "manufacturer":
        return "Search for products to manufacture or packaging solutions...";
      case "brand":
        return "Search for manufacturers, packaging options, or retailers...";
      case "retailer":
        return "Search for brands, products, or packaging options...";
      default:
        return "Search for products, manufacturers, or packaging...";
    }
  };

  // Role-specific category options
  const getCategoryOptions = () => {
    const commonOptions = [
      <SelectItem key="food" value="food">Food & Beverage</SelectItem>,
      <SelectItem key="personal-care" value="personal-care">Personal Care</SelectItem>,
      <SelectItem key="household" value="household">Household Products</SelectItem>,
    ];
    
    switch(role) {
      case "manufacturer":
        return [...commonOptions, <SelectItem key="materials" value="materials">Raw Materials</SelectItem>];
      case "brand":
        return [...commonOptions, <SelectItem key="packaging" value="packaging">Packaging</SelectItem>];
      case "retailer":
        return [...commonOptions, <SelectItem key="local" value="local">Local Products</SelectItem>];
      default:
        return commonOptions;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto glass p-8 rounded-xl backdrop-blur-lg border border-white/10 shadow-lg">
      <h3 className="text-2xl font-semibold mb-6">Find Your Perfect Match</h3>
      
      <div className="grid md:grid-cols-[1fr_auto_auto] gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={getPlaceholderText()}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {getCategoryOptions()}
          </SelectContent>
        </Select>
        
        <Button onClick={handleSearch} className="gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>
      
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Quick Filters:</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Sliders className="h-3.5 w-3.5" />
          Advanced
        </Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={filter.active ? "default" : "outline"}
            size="sm"
            className="rounded-full flex items-center gap-1 h-8 transition-all"
            onClick={() => toggleFilter(filter.id)}
          >
            {filter.active && <Check className="h-3 w-3" />}
            {filter.label}
          </Button>
        ))}
      </div>
      
      {showAdvanced && (
        <Accordion type="single" collapsible className="w-full bg-background/50 rounded-lg p-2 mt-4">
          <AccordionItem value="price-range">
            <AccordionTrigger className="px-4 py-2 text-sm">Price Range</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Min Price</label>
                  <Input type="number" placeholder="0" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Max Price</label>
                  <Input type="number" placeholder="1000" />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="location">
            <AccordionTrigger className="px-4 py-2 text-sm">Location</AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <Input placeholder="Enter location" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
      
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-muted-foreground">
          {activeFilters.length > 0
            ? `${activeFilters.length} active filter${activeFilters.length > 1 ? 's' : ''}`
            : "No active filters"}
        </div>
        
        {activeFilters.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFilters(filters.map(f => ({ ...f, active: false })))}
          >
            Clear all
          </Button>
        )}
      </div>
    </div>
  );
};

export default SearchSection;
