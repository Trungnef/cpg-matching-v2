import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { 
  Search, 
  Tag, 
  Settings2, 
  Loader, 
  Save, 
  History, 
  Clock, 
  Star, 
  Filter, 
  XCircle, 
  Download, 
  ArrowRight, 
  Trash2, 
  SlidersHorizontal, 
  Calendar as CalendarIcon,
  Check,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useTranslation } from "react-i18next";

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchFilters {
  categories: string[];
  location: string;
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

const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<{query: string; timestamp: number}[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [resultsCount, setResultsCount] = useState(0);
  const [scrollOffset, setScrollOffset] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    location: "",
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

  // Handle scroll position for panel
  useEffect(() => {
    const handleScroll = () => {
      // Tính toán offset dựa trên vị trí scroll của trang
      const scrollY = window.scrollY;
      const newOffset = Math.min(0, -Math.max(0, scrollY - 50) * 0.08);
      
      if (panelRef.current) {
        panelRef.current.style.transform = `translateY(${newOffset}px)`;
      }
    };

    if (isOpen) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initialize position
    }
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  // Add keyboard event to close panel with Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Sử dụng hook useClickOutside để đóng panel khi click bên ngoài
  useClickOutside(panelRef, (event) => {
    // Kiểm tra xem click có trên overlay không
    if (!overlayRef.current?.contains(event.target as Node)) {
      return;
    }
    onClose();
  });

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
      onClose();
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

  if (!isOpen) return null;

  return (
    <motion.div
      key="search-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4 sm:pt-24"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <motion.div 
        key="search-panel"
        ref={panelRef}
        initial={{ y: -30, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: -30, opacity: 0, scale: 0.95 }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 30,
          mass: 1
        }}
        className="w-full max-w-3xl rounded-xl border border-border bg-card shadow-xl overflow-hidden"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <div className="p-4 sm:p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t('advanced-search')}</h2>
            {resultsCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {resultsCount} {t('results')}
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
                      {t('export-results')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            )}
          </div>

          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Input 
                  placeholder={t('search-placeholder', "Search by keyword, category, or company name")} 
                  className="w-full pr-10 h-11"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
                {isLoading ? (
                  <Loader className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
                ) : (
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                )}

                <AnimatePresence>
                  {suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-md shadow-lg z-50"
                    >
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          type="button"
                          className="w-full text-left px-3 py-2 hover:bg-accent text-sm flex items-center gap-2"
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
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="h-11" disabled={isLoading}>
                  {isLoading ? (
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  {t('search')}
                </Button>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11"
                        onClick={saveCurrentSearch}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('save-this-search', "Save this search")}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {recentSearches.length > 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-wrap gap-2 items-center"
              >
                <History className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{t('recent-searches')}:</span>
                {recentSearches.map(({query, timestamp}) => (
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
                          {t('save-this-search', "Save this search")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </Badge>
                ))}
              </motion.div>
            )}
          </form>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-muted-foreground"
              >
                Clear all
              </Button>
            </div>

            <div className="space-y-4">
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
                <div className="flex flex-col sm:flex-row gap-2">
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
                          <span>Start date</span>
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
                          <span>End date</span>
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
          </div>

          {savedSearches.length > 0 && (
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
        </div>

        <div className="p-4 border-t border-border flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button 
            variant="default" 
            onClick={() => {
              console.log("Applying filters:", filters);
              onClose();
            }}
          >
            Apply Filters
          </Button>
        </div>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[-1]" 
        onClick={onClose}
        aria-hidden="true"
      />
    </motion.div>
  );
};

export default SearchPanel;
