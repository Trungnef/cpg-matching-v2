import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet,
  SheetContent, 
  SheetDescription, 
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ChevronDown,
  Filter,
  Search,
  History,
  Star,
  StarOff,
  Trash2,
  SlidersHorizontal,
  X,
  Loader,
  Calendar as CalendarIcon,
  Download,
  Save,
  Clock,
  Tag,
  Settings2,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchFilters {
  categories: string[];
  location: string;
  minOrderQuantity: string;
  priceRange: [number, number];
  certifications: string[];
  sortBy: string;
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
}

interface SavedSearch {
  query: string;
  filters: SearchFilters;
  timestamp: number;
}

const SearchSection = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<{query: string; timestamp: number}[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [showSavedSearches, setShowSavedSearches] = useState(false);

  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    location: "",
    minOrderQuantity: "",
    priceRange: [0, 1000],
    certifications: [],
    sortBy: "relevance",
    dateRange: {
      from: undefined,
      to: undefined
    }
  });

  // Load saved data from localStorage
  useEffect(() => {
    const loadSavedData = () => {
      const saved = localStorage.getItem("recentSearches");
      const savedSearches = localStorage.getItem("savedSearches");
      
      if (saved) {
        setRecentSearches(JSON.parse(saved));
      }
      if (savedSearches) {
        setSavedSearches(JSON.parse(savedSearches));
      }
    };

    loadSavedData();
  }, []);

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    if (value.length > 2) {
      // Enhanced suggestion logic with categories
      const suggestions = [
        { type: 'category', text: `in:food ${value}` },
        { type: 'category', text: `in:beauty ${value}` },
        { type: 'certification', text: `cert:organic ${value}` },
        { type: 'location', text: `location:usa ${value}` },
        { text: value }
      ];
      
      setSuggestions(suggestions.map(s => s.text));
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save to recent searches with timestamp
      const newSearch = { query: searchQuery, timestamp: Date.now() };
      const newRecentSearches = [newSearch, ...recentSearches.slice(0, 4)];
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResultsCount(Math.floor(Math.random() * 100) + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const saveCurrentSearch = () => {
    const newSavedSearch: SavedSearch = {
      query: searchQuery,
      filters,
      timestamp: Date.now()
    };
    
    const updatedSavedSearches = [newSavedSearch, ...savedSearches];
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem("savedSearches", JSON.stringify(updatedSavedSearches));
  };

  const removeSavedSearch = (timestamp: number) => {
    const updatedSavedSearches = savedSearches.filter(s => s.timestamp !== timestamp);
    setSavedSearches(updatedSavedSearches);
    localStorage.setItem("savedSearches", JSON.stringify(updatedSavedSearches));
  };

  const loadSavedSearch = (saved: SavedSearch) => {
    setSearchQuery(saved.query);
    setFilters(saved.filters);
  };

  const toggleCertification = (cert: string) => {
    setFilters(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      location: "",
      minOrderQuantity: "",
      priceRange: [0, 1000],
      certifications: [],
      sortBy: "relevance",
      dateRange: {
        from: undefined,
        to: undefined
      }
    });
  };

  const exportResults = () => {
    const data = {
      query: searchQuery,
      filters,
      timestamp: Date.now(),
      results: resultsCount
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-results-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-card/90 backdrop-blur-sm shadow-lg rounded-xl border border-border/50 overflow-hidden transition-all duration-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-medium hidden sm:block">Find Your Perfect Match</h3>
          {resultsCount > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="ml-2">
                {resultsCount} results
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={exportResults}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Export results
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => setShowSavedSearches(!showSavedSearches)}
                >
                  <Star className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Saved searches
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filters</span>
                {(filters.certifications.length > 0 || filters.categories.length > 0) && (
                  <Badge variant="secondary" className="ml-1">
                    {filters.certifications.length + filters.categories.length}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto no-scrollbar">
              <SheetHeader>
                <SheetTitle>Advanced Filters</SheetTitle>
                <SheetDescription>
                  Refine your search with advanced filtering options
                </SheetDescription>
              </SheetHeader>
              
              <div className="space-y-4 py-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Filters</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2 text-muted-foreground"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {["Food & Beverage", "Health & Wellness", "Beauty & Personal Care", "Household Products"].map((cat) => (
                      <Badge
                        key={cat}
                        variant={filters.categories.includes(cat) ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleCategory(cat)}
                      >
                        {cat}
                        {filters.categories.includes(cat) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Date Range</label>
                  <div className="flex flex-col gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.from ? (
                            format(filters.dateRange.from, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.from}
                          onSelect={(date) => 
                            setFilters(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, from: date }
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !filters.dateRange.to && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {filters.dateRange.to ? (
                            format(filters.dateRange.to, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={filters.dateRange.to}
                          onSelect={(date) =>
                            setFilters(prev => ({
                              ...prev,
                              dateRange: { ...prev.dateRange, to: date }
                            }))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Price Range</label>
                  <div className="pt-2">
                    <Slider
                      value={filters.priceRange}
                      min={0}
                      max={1000}
                      step={10}
                      onValueChange={(value: [number, number]) => 
                        setFilters(prev => ({ ...prev, priceRange: value }))
                      }
                      className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                    />
                    <div className="flex justify-between mt-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Min: </span>
                        <span className="font-medium">${filters.priceRange[0]}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Max: </span>
                        <span className="font-medium">${filters.priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Certifications</label>
                  <div className="flex flex-wrap gap-2">
                    {["Organic", "Non-GMO", "Fair Trade", "Vegan", "Kosher", "Gluten-Free"].map((cert) => (
                      <Badge
                        key={cert}
                        variant={filters.certifications.includes(cert) ? "default" : "outline"}
                        className="cursor-pointer transition-colors"
                        onClick={() => toggleCertification(cert)}
                      >
                        {cert}
                        {filters.certifications.includes(cert) && (
                          <X className="h-3 w-3 ml-1" />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Location</label>
                  <Select
                    value={filters.location}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, location: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Popular</SelectLabel>
                        <SelectItem value="usa">United States</SelectItem>
                        <SelectItem value="canada">Canada</SelectItem>
                        <SelectItem value="europe">Europe</SelectItem>
                      </SelectGroup>
                      <SelectGroup>
                        <SelectLabel>Other</SelectLabel>
                        <SelectItem value="asia">Asia</SelectItem>
                        <SelectItem value="other">Other Regions</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Sort By</label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="relevance">Relevance</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <SheetFooter>
                <Button 
                  variant="outline" 
                  onClick={saveCurrentSearch}
                  className="gap-2"
                >
                  <Save className="h-4 w-4" />
                  Save Search
                </Button>
                <Button onClick={() => console.log("Applying filters:", filters)}>
                  Apply Filters
                </Button>
              </SheetFooter>
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
      
      <div 
        className={`transition-all duration-300 overflow-hidden ${
          isSearchExpanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 pt-0 space-y-4">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Search by keyword, category, or company name" 
                  className="w-full pr-10"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                {isLoading ? (
                  <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}

                {suggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        className="w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center gap-2 group"
                        onClick={() => setSearchQuery(suggestion)}
                      >
                        {suggestion.startsWith('in:') ? (
                          <Tag className="h-3 w-3 text-muted-foreground" />
                        ) : suggestion.startsWith('cert:') ? (
                          <Settings2 className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <Search className="h-3 w-3 text-muted-foreground" />
                        )}
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button type="submit" className="flex-shrink-0" disabled={isLoading}>
                {isLoading ? (
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 mr-2" />
                )}
                Search
              </Button>
            </div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="flex flex-wrap gap-2 items-center">
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Recent:</span>
                {recentSearches.map(({query, timestamp}, index) => (
                  <Badge
                    key={timestamp}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary/10 transition-colors group"
                    onClick={() => setSearchQuery(query)}
                  >
                    <span className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {query}
                    </span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Star
                            className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              saveCurrentSearch();
                            }}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          Save this search
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Badge>
                ))}
              </div>
            )}
          </form>

          {/* Saved Searches */}
          {showSavedSearches && savedSearches.length > 0 && (
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Star className="h-4 w-4" />
                Saved Searches
              </h4>
              <div className="space-y-2">
                {savedSearches.map((saved) => (
                  <div
                    key={saved.timestamp}
                    className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50 group"
                  >
                    <button
                      className="flex items-center gap-2 flex-1"
                      onClick={() => loadSavedSearch(saved)}
                    >
                      <Search className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{saved.query}</span>
                      <span className="text-xs text-muted-foreground">
                        {format(saved.timestamp, 'MMM d, yyyy')}
                      </span>
                    </button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeSavedSearch(saved.timestamp)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            <div className="text-sm font-medium text-muted-foreground mr-2">Popular:</div>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Organic Foods</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Sustainable Packaging</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Plant-Based</Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Cold-Pressed</Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
