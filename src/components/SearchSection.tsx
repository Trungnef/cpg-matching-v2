
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet,
  SheetContent, 
  SheetDescription, 
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Filter, Search } from "lucide-react";

const SearchSection = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Toggle search expanded state
  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Here you would typically handle the search request
  };

  return (
    <div className="bg-card/90 backdrop-blur-sm shadow-lg rounded-xl border border-border/50 overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium hidden sm:block">Find Your Perfect Match</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with advanced filtering options
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                      <SelectItem value="household">Household Products</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Certifications</label>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Organic</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Non-GMO</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Fair Trade</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Vegan</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Kosher</Badge>
                    <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Gluten-Free</Badge>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usa">United States</SelectItem>
                      <SelectItem value="canada">Canada</SelectItem>
                      <SelectItem value="europe">Europe</SelectItem>
                      <SelectItem value="asia">Asia</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Order Quantity</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any quantity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (1-1,000 units)</SelectItem>
                      <SelectItem value="medium">Medium (1,001-5,000 units)</SelectItem>
                      <SelectItem value="large">Large (5,001-10,000 units)</SelectItem>
                      <SelectItem value="xlarge">Very Large (10,000+ units)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end mt-4">
                <Button>Apply Filters</Button>
              </div>
            </SheetContent>
          </Sheet>
          
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={toggleSearch}
            aria-label={isSearchExpanded ? "Collapse search" : "Expand search"}
            className="transition-transform duration-200"
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isSearchExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>
      
      {/* Expandable search content with improved animation and styling */}
      <div 
        className={`transition-all duration-300 overflow-hidden ${
          isSearchExpanded ? 'max-h-[300px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <form onSubmit={handleSearchSubmit} className="p-4 pt-0 space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex-1 relative">
              <Input 
                placeholder="Search by keyword, category, or company name" 
                className="w-full pr-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button type="submit" className="flex-shrink-0">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="text-sm font-medium text-muted-foreground mr-2">Popular:</div>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Organic Foods</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Sustainable Packaging</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Plant-Based</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Cold-Pressed</Badge>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchSection;
