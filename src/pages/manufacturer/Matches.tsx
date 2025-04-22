import { useEffect, useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, Building, Search, Filter, MessageSquare, Star, 
  Clock, Calendar, Check, X, ChevronRight, RefreshCw, Share2,
  Info, BellRing, Bell, Sparkles, GridIcon, ListFilter, ArrowUpDown,
  Send, Loader2
} from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ManufacturerLayout from "@/components/layouts/ManufacturerLayout";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectItem, SelectContent } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

// Helper functions for match styling
const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-600 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700/70 shadow-sm font-medium transition-all duration-300">Pending</Badge>;
    case "accepted":
      return <Badge variant="outline" className="bg-green-100 text-green-600 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700/70 shadow-sm font-medium transition-all duration-300">Accepted</Badge>;
    case "declined":
      return <Badge variant="outline" className="bg-red-100 text-red-600 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700/70 shadow-sm font-medium transition-all duration-300">Declined</Badge>;
    default:
      return <Badge variant="outline" className="shadow-sm font-medium transition-all duration-300">Unknown</Badge>;
  }
};

// Get color for match score
const getMatchScoreColor = (score: number) => {
  if (score >= 90) return "text-green-600 dark:text-green-400 font-medium";
  if (score >= 80) return "text-green-600 dark:text-green-500 font-medium";
  if (score >= 70) return "text-yellow-600 dark:text-yellow-400 font-medium";
  return "text-yellow-600 dark:text-yellow-500 font-medium";
};

// Get background color for progress bar
const getProgressColor = (score: number) => {
  if (score >= 90) return "bg-green-500 dark:bg-green-400";
  if (score >= 80) return "bg-green-500 dark:bg-green-500";
  if (score >= 70) return "bg-yellow-500 dark:bg-yellow-400";
  return "bg-yellow-500 dark:bg-yellow-500";
};

// Mock matches data
const potentialMatches = [
  {
    id: 1,
    companyName: "Green Foods Inc.",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Organic food brand looking for cereal manufacturer",
    requestedProduct: "Organic Cereal",
    matchScore: 92,
    location: "San Francisco, CA",
    size: "Medium",
    status: "New"
  },
  {
    id: 2,
    companyName: "Fitness Nutrition Co.",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Sports nutrition brand expanding product line",
    requestedProduct: "Protein Bars",
    matchScore: 88,
    location: "Denver, CO",
    size: "Large",
    status: "New"
  },
  {
    id: 3,
    companyName: "Healthy Snacks Ltd.",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Healthy snack company seeking manufacturing partner",
    requestedProduct: "Trail Mix",
    matchScore: 85,
    location: "Portland, OR",
    size: "Small",
    status: "Reviewed"
  },
  {
    id: 4,
    companyName: "Natural Beverages",
    role: "brand",
    logo: "/placeholder.svg",
    description: "Beverage company looking to expand production",
    requestedProduct: "Organic Juice",
    matchScore: 79,
    location: "Austin, TX",
    size: "Medium",
    status: "Reviewed"
  }
];

const activeMatches = [
  {
    id: 101,
    companyName: "Eco-Friendly Foods",
    role: "brand",
    logo: "/placeholder.svg",
    product: "Organic Cereal",
    status: "Contract Negotiation",
    lastActivity: "2 days ago",
    nextMeeting: "2023-10-05"
  },
  {
    id: 102,
    companyName: "Wellness Nutrition",
    role: "brand",
    logo: "/placeholder.svg",
    product: "Energy Bars",
    status: "Sample Production",
    lastActivity: "5 days ago",
    nextMeeting: "2023-10-12"
  },
  {
    id: 103,
    companyName: "Organic Life Foods",
    role: "brand",
    logo: "/placeholder.svg",
    product: "Organic Juice",
    status: "Active Production",
    lastActivity: "1 day ago",
    nextMeeting: "2023-10-08"
  }
];

// Define role tabs
const roleTabs = [
  { id: "overview", label: "Overview", path: "/dashboard" },
  { id: "production", label: "Production Lines", path: "/dashboard" },
  { id: "orders", label: "Orders", path: "/dashboard" },
  { id: "performance", label: "Performance", path: "/dashboard" },
  { id: "opportunities", label: "Opportunities", path: "/dashboard" },
  { id: "inventory", label: "Inventory", path: "/manufacturer/inventory" },
  { id: "analytics", label: "Analytics", path: "/manufacturer/analytics" },
  { id: "suppliers", label: "Suppliers", path: "/manufacturer/suppliers" },
  { id: "matches", label: "Matches", path: "/manufacturer/matches" },
  { id: "settings", label: "Settings", path: "/manufacturer/settings" }
];

  // Mock data for matches
  const matchesData = [
    {
      id: 1,
      companyName: "Organic Valley Foods",
      matchScore: 95,
      productCategory: "Cereals",
      location: "Portland, OR",
      status: "pending",
      logoUrl: "https://placehold.co/100",
      description: "A premium organic food brand looking for manufacturing partners for their new line of organic cereals."
    },
    {
      id: 2,
      companyName: "NutriBoost",
      matchScore: 88,
      productCategory: "Protein Supplements",
      location: "Austin, TX",
      status: "accepted",
      logoUrl: "https://placehold.co/100",
      description: "Leading protein supplement brand seeking manufacturing capabilities for plant-based protein powders."
    },
    {
      id: 3,
      companyName: "Green Earth Beverages",
      matchScore: 92,
      productCategory: "Beverages",
      location: "Seattle, WA",
      status: "declined",
      logoUrl: "https://placehold.co/100",
      description: "Eco-friendly beverage company looking for sustainable manufacturing practices for their new line of plant-based drinks."
    },
    {
      id: 4,
      companyName: "Snack Haven",
      matchScore: 85,
      productCategory: "Snack Bars",
      location: "Chicago, IL",
      status: "pending",
      logoUrl: "https://placehold.co/100",
      description: "Innovative snack company looking to partner with manufacturers for their healthy snack bar product line."
    },
    {
      id: 5,
      companyName: "Fresh Start Foods",
      matchScore: 79,
      productCategory: "Cereals",
      location: "Denver, CO",
      status: "pending",
      logoUrl: "https://placehold.co/100",
      description: "Health-focused food brand seeking manufacturing partners for breakfast products and ready-to-eat meals."
    }
  ];

const Matches = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("matches");
  const [activeStatus, setActiveStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState("matchScore");
  const [sortDirection, setSortDirection] = useState("desc");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showStats, setShowStats] = useState(false);
  const [showFilterSheet, setShowFilterSheet] = useState(false);
  const [recentlyUpdated, setRecentlyUpdated] = useState<number[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [notifications, setNotifications] = useState(3);
  const [showMatchDetails, setShowMatchDetails] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [scheduleData, setScheduleData] = useState({
    date: "",
    time: "",
    duration: "30 minutes",
    type: "Initial Meeting",
    notes: ""
  });
  
  // Advanced filters state
  const [filters, setFilters] = useState({
    minMatchScore: 70,
    maxDistance: 500,
    categories: [] as string[],
    showVerifiedOnly: false,
    availability: "all", // all, immediate, future
  });
  
  // Stats for the overview banner
  const matchStats = useMemo(() => ({
    totalMatches: matchesData.length,
    pending: matchesData.filter(m => m.status === "pending").length,
    accepted: matchesData.filter(m => m.status === "accepted").length,
    declined: matchesData.filter(m => m.status === "declined").length,
    highMatches: matchesData.filter(m => m.matchScore >= 90).length,
    averageScore: Math.round(matchesData.reduce((acc, curr) => acc + curr.matchScore, 0) / matchesData.length),
  }), [matchesData]);
  
  useEffect(() => {
    document.title = "Matches - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
      navigate("/dashboard");
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [isAuthenticated, navigate, role]);

  if (!isAuthenticated || role !== "manufacturer") {
    return null;
  }

  // Handle tab changes, including navigation to other pages
  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Find the selected tab and navigate to its path
    const selectedTab = roleTabs.find(tab => tab.id === value);
    if (selectedTab?.path) {
      navigate(selectedTab.path);
    }
  };

  // Get unique product categories for filter
  const productCategories = ["all", ...Array.from(new Set(matchesData.map(match => match.productCategory)))];

  // Apply filters and sorting
  const filteredAndSortedMatches = useMemo(() => {
    let filtered = matchesData;
    
    // Filter by status
    if (activeStatus !== "all") {
      filtered = filtered.filter(match => match.status === activeStatus);
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(match => 
        match.companyName.toLowerCase().includes(query) || 
        match.description.toLowerCase().includes(query) ||
        match.location.toLowerCase().includes(query) ||
        match.productCategory.toLowerCase().includes(query)
      );
    }
    
    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(match => match.productCategory === selectedCategory);
    }
    
    // Apply advanced filters
    if (filters.minMatchScore > 70) {
      filtered = filtered.filter(match => match.matchScore >= filters.minMatchScore);
    }
    
    if (filters.categories.length > 0) {
      filtered = filtered.filter(match => filters.categories.includes(match.productCategory));
    }
    
    if (filters.showVerifiedOnly) {
      // For demo purposes, consider matches with score > 85 as "verified"
      filtered = filtered.filter(match => match.matchScore > 85);
    }
    
    // Sort matches
    return [...filtered].sort((a, b) => {
      if (sortBy === "matchScore") {
        return sortDirection === "desc" 
          ? b.matchScore - a.matchScore 
          : a.matchScore - b.matchScore;
      } else if (sortBy === "name") {
        return sortDirection === "desc"
          ? b.companyName.localeCompare(a.companyName)
          : a.companyName.localeCompare(b.companyName);
      } else if (sortBy === "location") {
        return sortDirection === "desc"
          ? b.location.localeCompare(a.location)
          : a.location.localeCompare(b.location);
      }
      return 0;
    });
  }, [matchesData, activeStatus, searchQuery, sortBy, sortDirection, selectedCategory, filters]);

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("desc");
    }
  };

  // Handle match action
  const handleMatchAction = (id: number, action: string) => {
    console.log(`Match ID ${id}: ${action}`);
    // Here you would implement the actual action logic
  };

  // Animation variants for the stats banner - optimized for smoother transitions
  const statsVariants = {
    hidden: { 
      opacity: 0, 
      height: 0, 
      marginBottom: 0,
      transition: {
        opacity: { duration: 0.15 }, // Reduced from 0.2
        height: { duration: 0.2, delay: 0.05 } // Reduced from 0.3, 0.1
      }
    },
    visible: { 
      opacity: 1, 
      height: 'auto', 
      marginBottom: '1.5rem',
      transition: { 
        opacity: { duration: 0.2 }, // Reduced from 0.3
        height: { duration: 0.3, type: "spring", stiffness: 200, damping: 15 } // Increased stiffness, reduced damping
      } 
    }
  };
  
  // View match details handler
  const viewMatchDetails = (match: any) => {
    setSelectedMatch(match);
    setShowMatchDetails(true);
  };
  
  // Search handler
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInputRef.current) {
      setSearchQuery(searchInputRef.current.value);
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory("all");
    setSortBy("matchScore");
    setSortDirection("desc");
    setSearchQuery("");
    if (searchInputRef.current) {
      searchInputRef.current.value = "";
    }
    setFilters({
      minMatchScore: 70,
      maxDistance: 500,
      categories: [],
      showVerifiedOnly: false,
      availability: "all",
    });
  };
  
  // Handle match refresh - simulated API call
  const refreshMatches = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setIsLoading(false);
      // Show a notification or toast here
      const updatedMatches = [...matchesData];
      // Simulate getting new match with high score
      if (!updatedMatches.some(m => m.id === 6)) {
        const newMatch = {
          id: 6,
          companyName: "Healthy Essentials",
          matchScore: 94,
          productCategory: "Supplements",
          location: "Boston, MA",
          status: "pending",
          logoUrl: "https://placehold.co/100",
          description: "Fast-growing supplements brand looking for manufacturing partners with organic certifications."
        };
        // For demonstration purposes, just update notifications
        setNotifications(prev => prev + 1);
      }
    }, 1200);
  };

  const MotionCard = motion(Card);

  // Handle export details
  const handleExportDetails = (match: any) => {
    const data = {
      companyName: match.companyName,
      matchScore: match.matchScore,
      productCategory: match.productCategory,
      location: match.location,
      status: match.status,
      description: match.description,
      timestamp: new Date().toISOString(),
      exportDate: new Date().toLocaleDateString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `match-details-${match.companyName.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle send message
  const handleSendMessage = (match: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Sending message to ${match.companyName}: ${messageContent}`);
      setMessageContent("");
      setShowMessageDialog(false);
      setIsLoading(false);
      toast({
        title: "Message Sent",
        description: `Your message has been sent to ${match.companyName}.`,
        variant: "default",
      });
    }, 1000);
  };

  // Handle schedule meeting
  const handleScheduleMeeting = (match: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Scheduling meeting with ${match.companyName}:`, scheduleData);
      setShowScheduleDialog(false);
      setScheduleData({
        date: "",
        time: "",
        duration: "30 minutes",
        type: "Initial Meeting",
        notes: ""
      });
      setIsLoading(false);
      toast({
        title: "Meeting Scheduled",
        description: `Meeting with ${match.companyName} has been scheduled for ${scheduleData.date} at ${scheduleData.time}.`,
        variant: "default",
      });
    }, 1000);
  };

  // Handle reconsider match
  const handleReconsiderMatch = (match: any) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Reconsidering match with ${match.companyName}`);
      setIsLoading(false);
      toast({
        title: "Match Reconsidered",
        description: `Your match with ${match.companyName} has been moved back to pending status.`,
        variant: "default",
      });
    }, 1000);
  };

  return (
    <ManufacturerLayout>
      <motion.div 
        className="max-w-none px-4 sm:px-6 lg:px-8 pb-6"
        initial={{ opacity: 0, y: 10 }} // Reduced y from 20 to 10
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }} // Reduced from 0.5
      >
        <div className="space-y-6">
          <motion.div 
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }} // Reduced from delay: 0.2 to duration: 0.2 for immediate start
          >
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                Brand Matches
              </h1>
            </div>
              <p className="text-muted-foreground mt-1">Discover and manage potential manufacturing partnerships</p>
          </div>
            
            <div className="flex flex-wrap gap-2 items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setShowStats(!showStats)}
                      className={showStats ? "bg-muted" : ""}
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{showStats ? "Hide" : "Show"} match statistics</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                    >
                      {viewMode === "grid" ? (
                        <GridIcon className="h-4 w-4" />
                      ) : (
                        <ListFilter className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Toggle view mode</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <Sheet open={showFilterSheet} onOpenChange={setShowFilterSheet}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filters</span>
                    {(selectedCategory !== "all" || filters.minMatchScore > 70 || filters.showVerifiedOnly) && (
                      <Badge className="ml-1 h-5 px-1.5" variant="secondary">
                        {(selectedCategory !== "all" ? 1 : 0) + 
                         (filters.minMatchScore > 70 ? 1 : 0) + 
                         (filters.showVerifiedOnly ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full lg:w-2/3 xl:w-1/2 p-0">
                  <div className="h-full overflow-y-auto">
                    <SheetHeader className="pb-6">
                      <SheetTitle className="text-xl">Filter Matches</SheetTitle>
                      <SheetDescription className="text-muted-foreground">
                        Apply filters to find the perfect manufacturing partners
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Product Categories</h3>
                        <div className="grid grid-cols-2 gap-2">
                          {productCategories.map((category) => (
                            category !== "all" && (
                              <div key={category} className="flex items-center space-x-2">
                                <Checkbox 
                                  id={`category-${category}`} 
                                  checked={selectedCategory === category || filters.categories.includes(category)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setFilters({
                                        ...filters,
                                        categories: [...filters.categories, category]
                                      });
                                    } else {
                                      setFilters({
                                        ...filters,
                                        categories: filters.categories.filter(c => c !== category)
                                      });
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={`category-${category}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {category}
                                </label>
                              </div>
                            )
                          ))}
            </div>
          </div>
                    
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Match Score</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Minimum score: {filters.minMatchScore}%</span>
                          </div>
                          <Slider
                            defaultValue={[filters.minMatchScore]}
                            max={100}
                            min={50}
                            step={5}
                            onValueChange={(value) => {
                              setFilters({
                                ...filters,
                                minMatchScore: value[0]
                              });
                            }}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Additional Options</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="verified-only" className="cursor-pointer">
                              Verified companies only
                            </Label>
                            <Switch 
                              id="verified-only" 
                              checked={filters.showVerifiedOnly}
                              onCheckedChange={(checked) => {
                                setFilters({
                                  ...filters,
                                  showVerifiedOnly: checked
                                });
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="text-sm mb-2">Availability</h4>
                            <div className="grid grid-cols-3 gap-2">
                              <Button 
                                variant={filters.availability === "all" ? "default" : "outline"} 
                                size="sm"
                                onClick={() => setFilters({...filters, availability: "all"})}
                              >
                                All
                              </Button>
                              <Button 
                                variant={filters.availability === "immediate" ? "default" : "outline"} 
                                size="sm"
                                onClick={() => setFilters({...filters, availability: "immediate"})}
                              >
                                Immediate
                              </Button>
                              <Button 
                                variant={filters.availability === "future" ? "default" : "outline"} 
                                size="sm"
                                onClick={() => setFilters({...filters, availability: "future"})}
                              >
                                Future
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <SheetFooter className="flex-row justify-between gap-3 sm:justify-between">
                      <Button variant="outline" onClick={resetFilters}>Reset All</Button>
                      <SheetClose asChild>
                        <Button>Apply Filters</Button>
                      </SheetClose>
                    </SheetFooter>
                  </div>
                </SheetContent>
              </Sheet>
              
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search matches..."
                  ref={searchInputRef}
                  defaultValue={searchQuery}
                  className="pl-8 max-w-xs"
                  type="search"
                />
              </form>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="flex-nowrap gap-1 hover:shadow-md transition-all duration-300 hover:translate-y-[-1px]">
                    <Sparkles className="h-4 w-4" />
                    <span>Find Matches</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Find New Brand Matches</DialogTitle>
                    <DialogDescription>
                      Optimize your profile to find the best manufacturing partnerships
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Matching Priorities</h3>
                      <p className="text-sm text-muted-foreground">
                        Choose what's most important in your brand matches
                      </p>
                      <div className="grid gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="priority-location" />
                          <label htmlFor="priority-location" className="text-sm font-medium">Location proximity</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="priority-size" defaultChecked />
                          <label htmlFor="priority-size" className="text-sm font-medium">Company size</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="priority-specialty" defaultChecked />
                          <label htmlFor="priority-specialty" className="text-sm font-medium">Product specialty</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox id="priority-certifications" />
                          <label htmlFor="priority-certifications" className="text-sm font-medium">Certifications</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" className="gap-1">
                      <Share2 className="h-4 w-4" />
                      Update Profile
                    </Button>
                    <Button type="submit" className="gap-1" onClick={refreshMatches}>
                      <RefreshCw className="h-4 w-4" />
                      Find Matches
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>
          
          <AnimatePresence>
            {showStats && (
              <motion.div
                variants={statsVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-muted/40 rounded-lg p-4 border border-border/50 hover:border-border/70 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  <motion.div 
                    className="space-y-1"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                  >
                    <p className="text-sm text-muted-foreground">Total Matches</p>
                    <p className="text-2xl font-bold">{matchStats.totalMatches}</p>
                  </motion.div>
                  <motion.div 
                    className="space-y-1"
                    initial={{ opacity: 0, y: 5 }} // Reduced from y: 10
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.15 }} // Reduced from 0.2, 0.15
                  >
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">{matchStats.pending}</p>
                  </motion.div>
                  <motion.div 
                    className="space-y-1"
                    initial={{ opacity: 0, y: 5 }} // Reduced from y: 10
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.2 }} // Reduced from 0.2, 0.2
                  >
                    <p className="text-sm text-muted-foreground">Accepted</p>
                    <p className="text-2xl font-bold text-green-500 dark:text-green-400">{matchStats.accepted}</p>
                  </motion.div>
                  <motion.div 
                    className="space-y-1" 
                    initial={{ opacity: 0, y: 5 }} // Reduced from y: 10
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.25 }} // Reduced from 0.2, 0.25
                  >
                    <p className="text-sm text-muted-foreground">Declined</p>
                    <p className="text-2xl font-bold text-red-500 dark:text-red-400">{matchStats.declined}</p>
                  </motion.div>
                  <motion.div 
                    className="space-y-1"
                    initial={{ opacity: 0, y: 5 }} // Reduced from y: 10
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.3 }} // Reduced from 0.2, 0.3
                  >
                    <p className="text-sm text-muted-foreground">Premium Matches</p>
                    <p className="text-2xl font-bold text-primary">{matchStats.highMatches}</p>
                  </motion.div>
                  <motion.div 
                    className="space-y-1"
                    initial={{ opacity: 0, y: 5 }} // Reduced from y: 10
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.35 }} // Reduced from 0.2, 0.35
                  >
                    <p className="text-sm text-muted-foreground">Avg. Score</p>
                    <p className="text-2xl font-bold">{matchStats.averageScore}%</p>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="space-y-6">
            <Tabs value={activeStatus} onValueChange={setActiveStatus} className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-card border border-border shadow-md rounded-md overflow-hidden transition-colors duration-300">
                <TabsTrigger value="all" className="relative overflow-hidden group data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300 py-2.5">
                  <span className="relative z-10">All Matches ({matchesData.length})</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeStatus === "all" ? 1 : 0 }}
                    transition={{ duration: 0.2 }} // Reduced from 0.3
                  />
                </TabsTrigger>
                <TabsTrigger value="pending" className="relative overflow-hidden group data-[state=active]:bg-yellow-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300 py-2.5">
                  <div className="flex items-center gap-1.5 relative z-10">
                    <span>Pending</span>
                    <AnimatePresence>
                      {matchesData.filter(m => m.status === "pending").length > 0 && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <Badge variant="secondary" className="ml-0.5 bg-yellow-200 text-yellow-700 dark:bg-yellow-700/70 dark:text-yellow-100 border border-yellow-300 dark:border-yellow-600/50 shadow-sm">
                            {matchesData.filter(m => m.status === "pending").length}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeStatus === "pending" ? 1 : 0 }}
                    transition={{ duration: 0.2 }} // Reduced from 0.3
                  />
                </TabsTrigger>
                <TabsTrigger value="accepted" className="relative overflow-hidden group data-[state=active]:bg-green-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300 py-2.5">
                  <span className="relative z-10">Accepted ({matchesData.filter(m => m.status === "accepted").length})</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeStatus === "accepted" ? 1 : 0 }}
                    transition={{ duration: 0.2 }} // Reduced from 0.3
                  />
                </TabsTrigger>
                <TabsTrigger value="declined" className="relative overflow-hidden group data-[state=active]:bg-red-500 data-[state=active]:text-white data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300 py-2.5">
                  <span className="relative z-10">Declined ({matchesData.filter(m => m.status === "declined").length})</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: activeStatus === "declined" ? 1 : 0 }}
                    transition={{ duration: 0.2 }} // Reduced from 0.3
                  />
                </TabsTrigger>
              </TabsList>
              
              <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <span className="mr-1">Showing</span>
                  <span className="font-medium text-foreground">{filteredAndSortedMatches.length}</span>
                  <span className="mx-1">of</span>
                  <span className="font-medium text-foreground">{matchesData.length}</span>
                  <span className="ml-1">matches</span>
                </div>
                
                <div className="flex rounded-md overflow-hidden border">
                  <Button 
                    variant={sortBy === "matchScore" ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => handleSortChange("matchScore")}
                    className="rounded-none gap-1 transition-all duration-300 hover:bg-primary/10"
                  >
                    Match % {sortBy === "matchScore" && (
                      <motion.div
                        animate={{ rotate: sortDirection === "desc" ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowUpDown className="h-3.5 w-3.5" />
                      </motion.div>
                    )}
                  </Button>
                  <Button 
                    variant={sortBy === "name" ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => handleSortChange("name")}
                    className="rounded-none gap-1"
                  >
                    Name {sortBy === "name" && (
                      <ArrowUpDown className={`h-3.5 w-3.5 transition-transform duration-200 ${sortDirection === "desc" ? "rotate-180" : "rotate-0"}`} />
                    )}
                  </Button>
                  <Button 
                    variant={sortBy === "location" ? "default" : "ghost"} 
                    size="sm"
                    onClick={() => handleSortChange("location")}
                    className="rounded-none gap-1"
                  >
                    Location {sortBy === "location" && (
                      <ArrowUpDown className={`h-3.5 w-3.5 transition-transform duration-200 ${sortDirection === "desc" ? "rotate-180" : "rotate-0"}`} />
                    )}
                  </Button>
                </div>
              </div>
              
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((n) => (
                      <Card key={n} className="p-6">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                          </div>
                        </div>
                        <Skeleton className="h-4 w-full mt-4" />
                        <Skeleton className="h-4 w-3/4 mt-2" />
                        <div className="flex justify-end mt-4">
                          <Skeleton className="h-10 w-[100px]" />
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <TabsContent value={activeStatus} className="space-y-4">
                    {filteredAndSortedMatches.length === 0 ? (
                      <motion.div 
                        className="flex flex-col items-center justify-center p-8 text-center"
                        initial={{ opacity: 0, y: 10 }} // Reduced from y: 20
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ 
                          type: "spring",
                          stiffness: 200, // Increased from 100
                          damping: 12, // Reduced from 15
                          duration: 0.3 // Reduced from 0.5
                        }}
                      >
                        <motion.div
                          initial={{ scale: 0.9, opacity: 0 }} // Changed from 0.8 to 0.9
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.1, duration: 0.3 }} // Reduced from 0.2, 0.4
                        >
                          <Search className="h-12 w-12 text-muted-foreground mb-4" />
                        </motion.div>
                        <motion.h3 
                          className="text-xl font-medium"
                          initial={{ opacity: 0, y: 5 }} // Reduced from y: 10
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2, duration: 0.3 }} // Reduced from 0.3, 0.4
                        >
                          No matches found
                        </motion.h3>
                        <motion.p 
                          className="text-muted-foreground"
                          initial={{ opacity: 0, y: 5 }} // Reduced from y: 10
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.25, duration: 0.3 }} // Reduced from 0.4, 0.4
                        >
                          Try adjusting your search or filters to find more matches
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5, duration: 0.4 }}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            variant="outline" 
                            className="mt-4 bg-card hover:bg-muted hover:border-primary/30 transition-all duration-300 shadow-sm hover:shadow"
                            onClick={resetFilters}
                          >
                            Reset Filters
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <>
                        {viewMode === "grid" ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <AnimatePresence initial={false} mode="sync">
                              {filteredAndSortedMatches.map((match, index) => (
                                <motion.div
                                  key={match.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.97, y: 10 }} // Reduced values for smoother appearance
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.97, y: -10 }}
                                  transition={{ 
                                    duration: 0.25, // Faster animation
                                    delay: index * 0.03, // Reduced stagger delay
                                    type: "spring",
                                    stiffness: 200, // Increased for snappier animation
                                    damping: 12, // Lower damping for more responsive feel
                                    layout: { duration: 0.2 } // Faster layout transitions
                                  }}
                                  whileHover={{ 
                                    y: -3, // Subtler hover effect
                                    transition: { duration: 0.15 } // Faster hover transition
                                  }}
                                >
                                  <Card className="h-full border border-border/50 overflow-hidden hover:shadow-lg hover:border-primary/40 transition-all duration-300 group bg-card dark:bg-card/95">
                                    <EnhancedMatchCard match={match} onAction={handleMatchAction} onViewDetails={() => viewMatchDetails(match)} />
                                  </Card>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <AnimatePresence initial={false}>
                              {filteredAndSortedMatches.map((match, index) => (
                                <MotionCard 
                                  key={match.id}
                                  layout
                                  initial={{ opacity: 0, y: 10 }} // Reduced y value
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: -10 }}
                                  transition={{ 
                                    duration: 0.2, // Faster animation
                                    delay: index * 0.03, // Reduced stagger delay
                                    layout: { duration: 0.2 } // Faster layout transitions
                                  }}
                                  className="border overflow-hidden"
                                >
                                  <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                                    <div className="flex items-center gap-3 flex-grow">
                                      <Avatar className="h-10 w-10 rounded-md border border-border/40 shadow-sm group-hover:border-primary/30 transition-all duration-300">
                                        <AvatarImage src={match.logoUrl} alt={match.companyName} />
                                        <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                          {match.companyName.substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                      </Avatar>
                                      <div>
                                        <h3 className="font-medium">
                                          {match.companyName}
                                          {match.matchScore > 90 && (
                                            <motion.div 
                                              className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border-2 border-white dark:border-gray-800 shadow-sm"
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              transition={{ type: "spring", stiffness: 300, damping: 15 }}
                                              whileHover={{ 
                                                scale: 1.2,
                                                transition: { duration: 0.2 }  
                                              }}
                                            >
                                              <Star className="h-3 w-3 fill-white text-white" />
                                            </motion.div>
                                          )}
                                        </h3>
                                        <p className="text-sm text-muted-foreground">{match.location} • {match.productCategory}</p>
                                      </div>
                                    </div>
                                    
                                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-6">
                                      <div className="flex items-center gap-2">
                                        {getStatusBadge(match.status)}
                                        <div className="flex items-center gap-1.5">
                                          <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                                            <motion.div 
                                              className={`h-full ${getProgressColor(match.matchScore)}`}
                                              initial={{ width: 0 }}
                                              animate={{ width: `${match.matchScore}%` }}
                                              transition={{ duration: 0.5, ease: "easeOut" }} // Reduced from 0.8
                                            />
                                          </div>
                                          <span className={`text-xs font-medium ${getMatchScoreColor(match.matchScore)}`}>
                                            {match.matchScore}%
                                          </span>
                                        </div>
                                      </div>
                                      
                                      <div className="flex gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          className="gap-1.5 transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 shadow-sm hover:shadow group"
                                          onClick={() => viewMatchDetails(match)}
                                        >
                                          View Profile
                                          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                                        </Button>
                                        
                                        {match.status === "pending" && (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              size="sm"
                                              className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:hover:border-red-700/50 transition-all duration-300 shadow-sm hover:shadow"
                                              onClick={() => handleMatchAction(match.id, "decline")}
                                              disabled={isLoading}
                                            >
                                              {isLoading ? (
                                                <motion.div
                                                  animate={{ rotate: 360 }}
                                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                  <RefreshCw className="h-4 w-4 mr-1" />
                                                </motion.div>
                                              ) : (
                                                <X className="h-4 w-4 mr-1" />
                                              )}
                                              Decline
                                            </Button>
                                            <Button 
                                              size="sm" 
                                              className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all duration-300 hover:translate-y-[-1px]"
                                              onClick={() => handleMatchAction(match.id, "accept")}
                                              disabled={isLoading}
                                            >
                                              {isLoading ? (
                                                <motion.div
                                                  animate={{ rotate: 360 }}
                                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                  <RefreshCw className="h-4 w-4 mr-1" />
                                                </motion.div>
                                              ) : (
                                                <Check className="h-4 w-4 mr-1" />
                                              )}
                                              Accept
                                            </Button>
                                          </>
                                        )}
                                        {match.status === "accepted" && (
                                          <Button 
                                            size="sm"
                                            className="gap-1.5"
                                            onClick={() => handleMatchAction(match.id, "contact")}
                                            disabled={isLoading}
                                          >
                                            <Calendar className="h-4 w-4" />
                                            Schedule Meeting
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </MotionCard>
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                        
                        <div className="flex justify-center mt-8">
                          <motion.div
                            whileHover={{ scale: 1.02 }} // Reduced from 1.03
                            whileTap={{ scale: 0.98 }} // Changed from 0.97
                            transition={{ type: "spring", stiffness: 500, damping: 17 }} // Increased stiffness from 400
                          >
                            <Button 
                              variant="outline" 
                              className="gap-2 border-border/60 bg-card hover:bg-muted/50 hover:border-primary/30 shadow-sm hover:shadow transition-all duration-300"
                              onClick={() => console.log("Loading more matches...")}
                            >
                              <RefreshCw className="h-4 w-4" />
                              Load More Matches
                            </Button>
                          </motion.div>
                        </div>
                      </>
                    )}
              </TabsContent>
                )}
              </AnimatePresence>
            </Tabs>
          </div>
        </div>
      </motion.div>
      
      {/* Match Detail Dialog */}
      <Dialog open={showMatchDetails} onOpenChange={setShowMatchDetails}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto transition-all duration-200">
          {selectedMatch && (
            <>
              <DialogHeader className="mb-6">
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  <Avatar className="h-12 w-12 rounded-md">
                    <AvatarImage src={selectedMatch.logoUrl} alt={selectedMatch.companyName} />
                    <AvatarFallback>{selectedMatch.companyName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {selectedMatch.companyName}
                  {selectedMatch.matchScore > 90 && (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-600 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700/70 text-sm">
                      Premium Match
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-lg">Match score: <span className="font-semibold">{selectedMatch.matchScore}%</span></DialogDescription>
              </DialogHeader>
              
              <div className="grid md:grid-cols-2 gap-8 mt-6">
                <div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">Company Profile</h3>
                      <Card className="p-4">
                        <p className="text-sm text-muted-foreground mb-4">{selectedMatch.description}</p>
                        <div className="grid grid-cols-2 gap-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{selectedMatch.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Size:</span>
                            <span className="font-medium">Medium</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Established:</span>
                            <span className="font-medium">2019</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">Communication:</span>
                            <span className="font-medium">English</span>
                          </div>
                        </div>
                      </Card>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Product Requirements</h3>
                      <Card className="p-4">
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium mb-1">Product Category</h4>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {selectedMatch.productCategory}
                            </Badge>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Production Volume</h4>
                            <p className="text-sm text-muted-foreground">Medium-scale (5,000-10,000 units/month)</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium mb-1">Required Certifications</h4>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="outline">Organic</Badge>
                              <Badge variant="outline">Non-GMO</Badge>
                              <Badge variant="outline">GMP</Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Match Analysis</h3>
                    <Card className="p-4">
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Overall Match</span>
                            <span className={getMatchScoreColor(selectedMatch.matchScore)}>{selectedMatch.matchScore}%</span>
                          </div>
                          <Progress value={selectedMatch.matchScore} max={100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Location Compatibility</span>
                            <span className={getMatchScoreColor(85)}>85%</span>
                          </div>
                          <Progress value={85} max={100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Production Capacity</span>
                            <span className={getMatchScoreColor(95)}>95%</span>
                          </div>
                          <Progress value={95} max={100} className="h-2" />
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Certification Match</span>
                            <span className={getMatchScoreColor(90)}>90%</span>
                          </div>
                          <Progress value={90} max={100} className="h-2" />
                        </div>
                      </div>
                    </Card>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-1">Communication Timeline</h3>
                    <Card className="p-4">
                      <div className="space-y-4">
                        <div className="relative pl-5 pb-4 border-l-2 border-muted">
                          <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-0"></div>
                          <div className="mb-1 text-sm">
                            <span className="font-medium">Match Created</span>
                            <span className="text-muted-foreground ml-2 text-xs">Today</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {selectedMatch.companyName} was matched with your manufacturing profile.
                          </p>
                        </div>
                        
                        {selectedMatch.status === "pending" && (
                          <div className="relative pl-5 border-l-2 border-dashed border-muted">
                            <div className="absolute w-3 h-3 bg-muted rounded-full -left-[7px] top-0"></div>
                            <div className="mb-1 text-sm">
                              <span className="font-medium">Awaiting Response</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Respond to this match to start the collaboration process.
                            </p>
                          </div>
                        )}
                        
                        {selectedMatch.status === "accepted" && (
                          <>
                            <div className="relative pl-5 pb-4 border-l-2 border-muted">
                              <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-0"></div>
                              <div className="mb-1 text-sm">
                                <span className="font-medium">Match Accepted</span>
                                <span className="text-muted-foreground ml-2 text-xs">2 days ago</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                You accepted the connection request.
                              </p>
                            </div>
                            
                            <div className="relative pl-5 border-l-2 border-dashed border-muted">
                              <div className="absolute w-3 h-3 bg-muted rounded-full -left-[7px] top-0"></div>
                              <div className="mb-1 text-sm">
                                <span className="font-medium">Next Steps</span>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Schedule a meeting or send a message to discuss specific requirements.
                              </p>
                            </div>
                          </>
                        )}
                        
                        {selectedMatch.status === "declined" && (
                          <div className="relative pl-5 border-l-2 border-muted">
                            <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[7px] top-0"></div>
                            <div className="mb-1 text-sm">
                              <span className="font-medium">Match Declined</span>
                              <span className="text-muted-foreground ml-2 text-xs">3 days ago</span>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              You declined this match. You can reconsider this decision if needed.
                            </p>
                          </div>
                        )}
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-4 sm:gap-0 mt-8">
                <Button 
                  variant="outline" 
                  className="gap-2"
                  onClick={() => handleExportDetails(selectedMatch)}
                >
                  <Share2 className="h-5 w-5" />
                  Export Details
                </Button>
                
                <div className="flex gap-4">
                  {selectedMatch?.status === "pending" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:hover:border-red-700/50"
                        onClick={() => {
                          handleMatchAction(selectedMatch.id, "decline");
                          setShowMatchDetails(false);
                        }}
                      >
                        <X className="h-5 w-5 mr-2" />
                        Decline
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        size="lg"
                        onClick={() => {
                          handleMatchAction(selectedMatch.id, "accept");
                          setShowMatchDetails(false);
                        }}
                      >
                        <Check className="h-5 w-5 mr-2" />
                        Accept
                      </Button>
                    </>
                  )}
                  
                  {selectedMatch?.status === "accepted" && (
                    <>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setShowMessageDialog(true);
                          setShowMatchDetails(false);
                        }}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        Message
                      </Button>
                      <Button 
                        size="sm"
                        className="gap-1.5"
                        onClick={() => {
                          setShowScheduleDialog(true);
                          setShowMatchDetails(false);
                        }}
                        disabled={isLoading}
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule Meeting
                      </Button>
                    </>
                  )}
                  
                  {selectedMatch?.status === "declined" && (
                    <Button 
                      variant="outline"
                      onClick={() => {
                        handleReconsiderMatch(selectedMatch);
                        setShowMatchDetails(false);
                      }}
                    >
                      Reconsider
                    </Button>
                  )}
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Message Dialog */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent className="sm:max-w-[500px] transition-all duration-200">
          <DialogHeader>
            <DialogTitle>Send Message</DialogTitle>
            <DialogDescription>
              Send a message to {selectedMatch?.companyName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Type your message here..."
                className="min-h-[150px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleSendMessage(selectedMatch)}
              disabled={isLoading || !messageContent.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Schedule Meeting Dialog */}
      <Dialog open={showScheduleDialog} onOpenChange={setShowScheduleDialog}>
        <DialogContent className="sm:max-w-[500px] transition-all duration-200">
          <DialogHeader>
            <DialogTitle>Schedule Meeting</DialogTitle>
            <DialogDescription>
              Schedule a meeting with {selectedMatch?.companyName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={scheduleData.date}
                onChange={(e) => setScheduleData({...scheduleData, date: e.target.value})}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={scheduleData.time}
                onChange={(e) => setScheduleData({...scheduleData, time: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={scheduleData.duration}
                onValueChange={(value) => setScheduleData({...scheduleData, duration: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15 minutes">15 minutes</SelectItem>
                  <SelectItem value="30 minutes">30 minutes</SelectItem>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Meeting Type</Label>
              <Select
                value={scheduleData.type}
                onValueChange={(value) => setScheduleData({...scheduleData, type: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Initial Meeting">Initial Meeting</SelectItem>
                  <SelectItem value="Follow-up">Follow-up</SelectItem>
                  <SelectItem value="Contract Discussion">Contract Discussion</SelectItem>
                  <SelectItem value="Technical Review">Technical Review</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={scheduleData.notes}
                onChange={(e) => setScheduleData({...scheduleData, notes: e.target.value})}
                placeholder="Add any additional notes..."
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowScheduleDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => handleScheduleMeeting(selectedMatch)}
              disabled={isLoading || !scheduleData.date || !scheduleData.time}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Meeting
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ManufacturerLayout>
  );
};

interface MatchCardProps {
  match: {
    id: number;
    companyName: string;
    matchScore: number;
    productCategory: string;
    location: string;
    status: string;
    logoUrl: string;
    description: string;
  };
  onAction: (id: number, action: string) => void;
  onViewDetails: () => void;
}

const EnhancedMatchCard = ({ match, onAction, onViewDetails }: MatchCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation variants for expandable details - optimized for speed
  const detailsVariants = {
    hidden: { height: 0, opacity: 0, transition: { duration: 0.2, ease: "easeInOut" } }, // Reduced from 0.3
    visible: { height: 'auto', opacity: 1, transition: { duration: 0.2, ease: "easeOut" } } // Reduced from 0.3
  };

  const handleAction = (action: string) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      onAction(match.id, action);
      setIsLoading(false);
    }, 600);
  };

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Avatar className="h-12 w-12 rounded-md border border-border/50 shadow-sm group-hover:border-primary/30 transition-all duration-300">
                <AvatarImage src={match.logoUrl} alt={match.companyName} />
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {match.companyName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {match.matchScore > 90 && (
                <motion.div 
                  className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-0.5 border-2 border-white dark:border-gray-800 shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }} // Increased stiffness, reduced damping
                  whileHover={{ 
                    scale: 1.15, // Reduced from 1.2
                    transition: { duration: 0.15 } // Reduced from 0.2
                  }}
                >
                  <Star className="h-3 w-3 fill-white text-white" />
                </motion.div>
              )}
            </div>
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {match.companyName}
                <motion.span
                  initial={{ scale: 1 }}
                  animate={{ scale: isHovered && match.matchScore > 90 ? [1, 1.2, 1] : 1 }}
                  transition={{ duration: 0.5, repeat: isHovered && match.matchScore > 90 ? Infinity : 0, repeatDelay: 1 }}
                >
                  {match.matchScore > 90 && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                        </TooltipTrigger>
                        <TooltipContent side="right" align="center" sideOffset={10} className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-md dark:shadow-black/20 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
                          <p className="font-medium">Match score: {match.matchScore}%</p>
                          <div className="text-xs text-muted-foreground">
                            Based on your manufacturing capabilities
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </motion.span>
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5 text-muted-foreground" />
                {match.location}
                <span className="mx-1">•</span>
                <Badge variant="secondary" className="px-1.5 py-0 h-5 text-xs font-normal bg-primary/10 text-primary/90 border border-primary/20 shadow-sm dark:bg-primary/20 dark:border-primary/30 dark:text-primary-foreground/90">
                  {match.productCategory}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(match.status)}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="cursor-default">
                  <div className="flex items-center gap-1.5 group">
                    <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        className={`h-full ${getProgressColor(match.matchScore)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${match.matchScore}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }} // Reduced from 0.8
                      />
                    </div>
                    <span className={`text-xs ${getMatchScoreColor(match.matchScore)}`}>
                      {match.matchScore}%
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" align="center" sideOffset={10} className="bg-card/95 backdrop-blur-sm border border-border/50 shadow-md dark:shadow-black/20 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200">
                  <p className="font-medium">Match score: {match.matchScore}%</p>
                  <div className="text-xs text-muted-foreground">
                    Based on your manufacturing capabilities
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{match.description}</p>
        
        <AnimatePresence>
          {showDetails && (
            <motion.div 
              variants={detailsVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="mt-4 rounded-md bg-muted/50 p-3 overflow-hidden"
            >
              <h4 className="text-sm font-medium mb-2">Match Details</h4>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Company Size:</span>
                  <span className="font-medium">Medium</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Response Time:</span>
                  <span className="font-medium">24-48 hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Joined:</span>
                  <span className="font-medium">Mar 2023</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Communication:</span>
                  <span className="font-medium">English</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
      <CardFooter className="pt-1 flex flex-col gap-3">
        <div className="w-full flex justify-between items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-xs px-0 hover:bg-transparent hover:underline"
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? "Hide details" : "Show details"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="gap-1.5 transition-all duration-300 hover:bg-primary/10 hover:border-primary/30 shadow-sm hover:shadow group"
            onClick={onViewDetails}
          >
            View Profile
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>
        
        <div className="w-full flex justify-end space-x-2">
          {match.status === "pending" && (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/30 dark:hover:text-red-400 dark:hover:border-red-700/50 transition-all duration-300 shadow-sm hover:shadow"
                onClick={() => handleAction("decline")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                  </motion.div>
                ) : (
                  <X className="h-4 w-4 mr-1" />
                )}
                Decline
              </Button>
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow transition-all duration-300 hover:translate-y-[-1px]"
                onClick={() => handleAction("accept")}
                disabled={isLoading}
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                  </motion.div>
                ) : (
                  <Check className="h-4 w-4 mr-1" />
                )}
                Accept
              </Button>
            </>
          )}
          {match.status === "accepted" && (
            <>
              <Button 
                variant="outline"
                onClick={() => handleAction("message")}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Message
              </Button>
              <Button 
                size="sm"
                className="gap-1.5"
                onClick={() => handleAction("contact")}
                disabled={isLoading}
              >
                <Calendar className="h-4 w-4" />
                Schedule Meeting
              </Button>
            </>
          )}
          {match.status === "declined" && (
            <Button 
              variant="outline"
              onClick={() => {
                handleAction("reconsider");
                setShowDetails(false);
              }}
            >
              Reconsider
            </Button>
          )}
        </div>
      </CardFooter>
      
      <motion.div 
        className={`absolute top-0 left-0 h-full w-1.5 rounded-l-md ${
          match.matchScore >= 80 
            ? "bg-gradient-to-b from-green-500 to-green-600" 
            : "bg-gradient-to-b from-yellow-500 to-yellow-600"
        }`}
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: isHovered ? 1 : 0, opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Highlight effect on hover */}
      <motion.div 
        className="absolute inset-0 rounded-md bg-primary/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }} // Reduced from 0.3
      />
    </div>
  );
};

// Checkbox component (simplified version if not already imported)
const Checkbox = ({ id, checked, onCheckedChange, defaultChecked }: any) => {
  return (
    <input 
      type="checkbox" 
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      defaultChecked={defaultChecked}
      className="rounded border-gray-300 text-primary focus:ring-primary"
    />
  );
};

// Slider component (simplified version if not already imported)
const Slider = ({ defaultValue, min, max, step, onValueChange }: any) => {
  return (
    <input 
      type="range"
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      onChange={(e) => onValueChange?.([parseInt(e.target.value)])}
      className="w-full"
    />
  );
};

export default Matches;
