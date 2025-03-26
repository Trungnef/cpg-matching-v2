import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/contexts/UserContext";
import { LineChart, BarChart, PieChart, AreaChart } from "@/components/charts";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";
import ManufacturerLayout from "@/components/layouts/ManufacturerLayout";
import { 
  Download, 
  Calendar, 
  TrendingUp, 
  BarChart2, 
  PieChart as PieChartIcon,
  LineChart as LineChartIcon,
  AreaChart as AreaChartIcon,
  RefreshCw,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  Info,
  ZoomIn,
  ZoomOut,
  Download as DownloadIcon,
  Share2,
  Printer,
  Settings,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter as FilterIcon,
  SortAsc,
  SortDesc,
  Bell,
  Plus,
  BarChart as BarChartIcon,
  HelpCircle,
  Sparkles,
  FileText,
  Bookmark,
  Target,
  Eye,
  EyeOff,
  Trash2,
  Sliders,
  Save,
  AlertTriangle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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

// Define interface for dashboard metrics
interface Metric {
  id: string;
  name: string;
  value: string | number;
  change: number;
  changeType: 'increase' | 'decrease';
  progressValue: number;
}

// Define interface for alert items
interface AlertItem {
  id: string;
  title: string;
  description: string;
  timestamp: Date;
  severity: 'critical' | 'warning' | 'info' | 'success';
  isRead: boolean;
}

// Define interface for dashboard saveView
interface SavedView {
  id: string;
  name: string;
  timestamp: Date;
  settings: {
    metrics: string[];
    dateRange: string;
    chartType: string;
    analyticsView: string;
  };
}

const Analytics = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  
  // UI state
  const [activeTab, setActiveTab] = useState("analytics");
  const [analyticsView, setAnalyticsView] = useState("performance");
  const [isLoading, setIsLoading] = useState(false);
  const [chartType, setChartType] = useState<"line" | "area" | "bar">("line");
  const [showFilters, setShowFilters] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

  // Time range state
  const [dateRange, setDateRange] = useState("30days");
  const [customDateRange, setCustomDateRange] = useState<{ from: Date; to: Date } | undefined>();
  const [compareMode, setCompareMode] = useState(false);
  const [compareDateRange, setCompareDateRange] = useState<{ from: Date; to: Date } | undefined>();
  
  // Data filtering and display state
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["production", "revenue", "efficiency"]);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [dataRefreshInterval, setDataRefreshInterval] = useState<number | null>(null);

  // Chart and visualization settings
  const [chartSettings, setChartSettings] = useState({
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    animation: true,
    showDataLabels: false,
    theme: 'default'
  });

  // New Advanced features state
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [showAlertsDialog, setShowAlertsDialog] = useState(false);
  const [savedViews, setSavedViews] = useState<SavedView[]>([]);
  const [showSaveViewDialog, setShowSaveViewDialog] = useState(false);
  const [newViewName, setNewViewName] = useState("");
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [emailToShare, setEmailToShare] = useState("");
  const [showFullscreenMode, setShowFullscreenMode] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [annotationMode, setAnnotationMode] = useState(false);
  const [annotations, setAnnotations] = useState<{point: string, text: string}[]>([]);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [favoriteCharts, setFavoriteCharts] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'excel' | 'json'>('pdf');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("data");
  
  useEffect(() => {
    document.title = "Analytics - CPG Matchmaker";
    
    // If not authenticated or not a manufacturer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "manufacturer") {
      navigate("/dashboard");
    }
    
    // Load mock alerts
    setAlerts([
      {
        id: '1',
        title: 'Line C Efficiency Drop',
        description: 'Line C efficiency has dropped below 80% for the first time this week.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: 'warning',
        isRead: false
      },
      {
        id: '2',
        title: 'Line B Efficiency Improvement',
        description: 'Line B efficiency has improved by 5% after maintenance.',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        severity: 'success',
        isRead: true
      },
      {
        id: '3',
        title: 'Production Target Reached',
        description: 'Monthly production target has been reached 3 days ahead of schedule.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
        severity: 'info',
        isRead: false
      }
    ]);
    
    // Load mock saved views
    setSavedViews([
      {
        id: '1',
        name: 'Monthly Performance',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        settings: {
          metrics: ['production', 'revenue', 'efficiency'],
          dateRange: '30days',
          chartType: 'line',
          analyticsView: 'performance'
        }
      },
      {
        id: '2',
        name: 'Efficiency Focus',
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        settings: {
          metrics: ['efficiency', 'quality'],
          dateRange: '90days',
          chartType: 'area',
          analyticsView: 'efficiency'
        }
      }
    ]);
    
    // Set up auto-refresh interval if enabled
    if (dataRefreshInterval) {
      const interval = setInterval(() => {
        handleRefreshData();
      }, dataRefreshInterval * 1000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, navigate, role, dataRefreshInterval]);

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

  // Handle export report
  const handleExportReport = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const data = {
        dateRange,
        customDateRange,
        metrics: selectedMetrics,
        timestamp: new Date().toISOString(),
        companyName: user?.companyName,
        exportFormat
      };
      
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.${exportFormat === 'excel' ? 'xlsx' : exportFormat}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsLoading(false);
      toast({
        title: "Report Exported",
        description: `Your analytics report has been exported successfully as ${exportFormat.toUpperCase()}.`,
        variant: "default",
      });
    }, 1000);
  };

  // Handle refresh data
  const handleRefreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data Refreshed",
        description: "Analytics data has been updated successfully.",
        variant: "default",
      });
    }, 1000);
  };

  // Mock data for charts
  const productionData = [
    { name: "Jan", value: 1200 },
    { name: "Feb", value: 1900 },
    { name: "Mar", value: 2100 },
    { name: "Apr", value: 2400 },
    { name: "May", value: 2700 },
    { name: "Jun", value: 3000 },
    { name: "Jul", value: 2800 }
  ];
  
  const revenueData = [
    { name: "Jan", value: 45000 },
    { name: "Feb", value: 52000 },
    { name: "Mar", value: 48000 },
    { name: "Apr", value: 61000 },
    { name: "May", value: 55000 },
    { name: "Jun", value: 67000 },
    { name: "Jul", value: 72000 }
  ];
  
  const efficiencyData = [
    { name: "Line A", value: 85 },
    { name: "Line B", value: 92 },
    { name: "Line C", value: 78 },
    { name: "Line D", value: 88 }
  ];
  
  const productsBreakdown = [
    { name: "Cereals", value: 35 },
    { name: "Snack Bars", value: 25 },
    { name: "Beverages", value: 20 },
    { name: "Protein Products", value: 15 },
    { name: "Other", value: 5 }
  ];

  // Handle data comparison
  const handleCompareData = () => {
    setCompareMode(!compareMode);
    if (!compareMode) {
      setCompareDateRange({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        to: new Date()
      });
    }
  };

  // Handle sorting
  const handleSort = (key: string) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle chart settings
  const handleChartSettingsChange = (setting: keyof typeof chartSettings) => {
    setChartSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  // New handlers for advanced features
  const handleMarkAllAlertsAsRead = () => {
    setAlerts(prev => prev.map(alert => ({...alert, isRead: true})));
    toast({
      title: "Alerts Updated",
      description: "All alerts marked as read.",
      variant: "default",
    });
  };
  
  const handleDismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    toast({
      title: "Alert Dismissed",
      description: "The alert has been removed from your notifications.",
      variant: "default",
    });
  };
  
  const handleMarkAlertAsRead = (id: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === id ? {...alert, isRead: true} : alert
    ));
  };
  
  const handleSaveCurrentView = () => {
    if (!newViewName.trim()) {
      toast({
        title: "Error",
        description: "Please provide a name for your saved view.",
        variant: "destructive",
      });
      return;
    }
    
    const newView: SavedView = {
      id: Date.now().toString(),
      name: newViewName,
      timestamp: new Date(),
      settings: {
        metrics: selectedMetrics,
        dateRange,
        chartType,
        analyticsView
      }
    };
    
    setSavedViews(prev => [...prev, newView]);
    setNewViewName("");
    setShowSaveViewDialog(false);
    
    toast({
      title: "View Saved",
      description: `Your view "${newViewName}" has been saved successfully.`,
      variant: "default",
    });
  };
  
  const handleLoadSavedView = (view: SavedView) => {
    setSelectedMetrics(view.settings.metrics);
    setDateRange(view.settings.dateRange);
    setChartType(view.settings.chartType as "line" | "area" | "bar");
    setAnalyticsView(view.settings.analyticsView);
    
    toast({
      title: "View Loaded",
      description: `"${view.name}" has been loaded successfully.`,
      variant: "default",
    });
  };
  
  const handleDeleteSavedView = (id: string) => {
    setSavedViews(prev => prev.filter(view => view.id !== id));
    
    toast({
      title: "View Deleted",
      description: "The saved view has been deleted.",
      variant: "default",
    });
  };
  
  const handleShareView = () => {
    if (!emailToShare.trim()) {
      toast({
        title: "Error",
        description: "Please provide an email address to share with.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate sharing
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setEmailToShare("");
      setShowShareDialog(false);
      
      toast({
        title: "Dashboard Shared",
        description: `The dashboard has been shared with ${emailToShare}.`,
        variant: "default",
      });
    }, 1000);
  };
  
  const handleToggleFullscreen = () => {
    setShowFullscreenMode(!showFullscreenMode);
    document.documentElement.style.overflow = !showFullscreenMode ? 'hidden' : 'auto';
  };
  
  const handleAddAnnotation = (point: string, text: string) => {
    if (!text.trim()) return;
    
    setAnnotations(prev => [...prev, {point, text}]);
    setAnnotationMode(false);
    
    toast({
      title: "Annotation Added",
      description: "Your annotation has been added to the chart.",
      variant: "default",
    });
  };
  
  const handleDeleteAnnotation = (index: number) => {
    setAnnotations(prev => prev.filter((_, i) => i !== index));
    
    toast({
      title: "Annotation Removed",
      description: "The annotation has been removed from the chart.",
      variant: "default",
    });
  };
  
  const handleToggleFavorite = (chartId: string) => {
    setFavoriteCharts(prev => 
      prev.includes(chartId) 
        ? prev.filter(id => id !== chartId) 
        : [...prev, chartId]
    );
  };
  
  const handleSetAutoRefresh = (seconds: number | null) => {
    setDataRefreshInterval(seconds);
    
    toast({
      title: seconds ? "Auto-refresh Enabled" : "Auto-refresh Disabled",
      description: seconds ? `Data will refresh every ${seconds} seconds.` : "Auto-refresh has been turned off.",
      variant: "default",
    });
  };
  
  const handlePrint = () => {
    window.print();
  };
  
  // Filter data based on search query
  const filteredData = useMemo(() => 
    productsBreakdown.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]);

  // Sort data based on sort configuration
  const sortedData = useMemo(() => 
    sortConfig ? [...filteredData].sort((a, b) => {
      if (sortConfig.direction === 'asc') {
        return a[sortConfig.key as keyof typeof a] > b[sortConfig.key as keyof typeof b] ? 1 : -1;
      }
      return a[sortConfig.key as keyof typeof a] < b[sortConfig.key as keyof typeof b] ? 1 : -1;
    }) : filteredData
  , [filteredData, sortConfig]);
  
  // Count unread alerts
  const unreadAlertsCount = useMemo(() => 
    alerts.filter(alert => !alert.isRead).length
  , [alerts]);

  return (
    <ManufacturerLayout>
      <MotionConfig reducedMotion="user">
      <motion.div 
          className={`mx-auto transition-all duration-300 ${showFullscreenMode ? 'max-w-none px-6' : 'max-w-none px-4 sm:px-6 lg:px-8'}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4">
            <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">Manufacturing Analytics</h1>
                  {showFullscreenMode && (
                    <Button variant="ghost" size="icon" onClick={handleToggleFullscreen}>
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">
                  {user?.companyName} - Production Performance and Insights
                </p>
            </div>
            
              <div className="flex flex-wrap items-center gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        onClick={handleRefreshData}
                        disabled={isLoading}
                        className="relative"
                      >
                        {isLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <RefreshCw className="h-4 w-4" />
                        )}
                        {dataRefreshInterval && (
                          <span className="absolute -top-1 -right-1 h-2 w-2 bg-primary rounded-full" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>Refresh data</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadAlertsCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                          {unreadAlertsCount}
                        </span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0" align="end">
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                      <h4 className="font-medium">Notifications</h4>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleMarkAllAlertsAsRead}
                        disabled={unreadAlertsCount === 0}
                      >
                        Mark all read
                      </Button>
                    </div>
                    <ScrollArea className="h-80">
                      {alerts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center p-6 text-center">
                          <Bell className="h-10 w-10 text-muted-foreground/50 mb-2" />
                          <p className="text-sm text-muted-foreground">No notifications</p>
                        </div>
                      ) : (
                        <div className="grid gap-1 p-1">
                          {alerts.map(alert => (
                            <div 
                              key={alert.id}
                              className={`flex p-3 rounded-md transition-colors ${!alert.isRead ? 'bg-muted/60' : 'hover:bg-muted/40'}`}
                            >
                              <div className="mr-3 mt-0.5">
                                {alert.severity === 'critical' && <AlertCircle className="h-5 w-5 text-destructive" />}
                                {alert.severity === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                                {alert.severity === 'info' && <Info className="h-5 w-5 text-blue-500" />}
                                {alert.severity === 'success' && <CheckIcon className="h-5 w-5 text-green-500" />}
                              </div>
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-sm font-medium">{alert.title}</p>
                                  <button 
                                    onClick={() => handleDismissAlert(alert.id)}
                                    className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                                <p className="text-xs text-muted-foreground line-clamp-2">{alert.description}</p>
                                <div className="flex items-center justify-between pt-1">
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(alert.timestamp).toLocaleTimeString([], {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                  {!alert.isRead && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleMarkAlertAsRead(alert.id)}
                                    >
                                      Mark read
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Bookmark className="h-4 w-4" />
                      Saved Views
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Saved Views</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {savedViews.length === 0 ? (
                      <div className="px-2 py-4 text-center">
                        <p className="text-sm text-muted-foreground">No saved views</p>
                      </div>
                    ) : (
                      savedViews.map(view => (
                        <DropdownMenuItem 
                          key={view.id}
                          className="flex items-center justify-between"
                          onClick={() => handleLoadSavedView(view)}
                        >
                          <span>{view.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSavedView(view.id);
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                          </Button>
                        </DropdownMenuItem>
                      ))
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onSelect={() => setShowSaveViewDialog(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Save Current View
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  variant="outline" 
                  onClick={() => setShowFilters(!showFilters)}
                  className="gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                </Button>

                <Button
                  variant="outline"
                  onClick={handleCompareData}
                  className={`gap-2 ${compareMode ? 'bg-primary/10' : ''}`}
                >
                  <TrendingUp className="h-4 w-4" />
                  Compare
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <DownloadIcon className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={() => {
                        setExportFormat('pdf');
                        handleExportReport();
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export as PDF
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setExportFormat('csv');
                        handleExportReport();
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setExportFormat('excel');
                        handleExportReport();
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export as Excel
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => {
                        setExportFormat('json');
                        handleExportReport();
                      }}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowShareDialog(true)}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handlePrint}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print Dashboard
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Dashboard Settings</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowSettings(!showSettings)}>
                      <Sliders className="h-4 w-4 mr-2" />
                      Chart Settings
                    </DropdownMenuItem>
                    {/* <DropdownMenuItem onClick={handleToggleFullscreen}>
                      {showFullscreenMode ? (
                        <>
                          <ZoomOut className="h-4 w-4 mr-2" />
                          Exit Fullscreen
                        </>
                      ) : (
                        <>
                          <ZoomIn className="h-4 w-4 mr-2" />
                          Enter Fullscreen
                        </>
                      )}
                    </DropdownMenuItem> */}
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Auto-refresh</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => handleSetAutoRefresh(null)}>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${dataRefreshInterval === null ? 'bg-primary' : 'bg-transparent'}`} />
                        Off
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSetAutoRefresh(30)}>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${dataRefreshInterval === 30 ? 'bg-primary' : 'bg-transparent'}`} />
                        30 seconds
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSetAutoRefresh(60)}>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${dataRefreshInterval === 60 ? 'bg-primary' : 'bg-transparent'}`} />
                        1 minute
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleSetAutoRefresh(300)}>
                      <div className="flex items-center">
                        <div className={`h-2 w-2 rounded-full mr-2 ${dataRefreshInterval === 300 ? 'bg-primary' : 'bg-transparent'}`} />
                        5 minutes
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowHelpDialog(true)}>
                      <HelpCircle className="h-4 w-4 mr-2" />
                      Help & Documentation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-muted/40 rounded-lg p-4 border border-border/50 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Chart Settings</h3>
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <HelpCircle className="h-4 w-4" />
                          </Button>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="font-medium">Chart Customization</h4>
                            <p className="text-sm text-muted-foreground">
                              Customize your chart display settings. Changes apply to all charts in the dashboard.
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-grid" className="flex items-center gap-2">
                            <GridIcon className="h-4 w-4 text-muted-foreground" />
                            Show Grid
                          </Label>
                          <Switch
                            id="show-grid"
                            checked={chartSettings.showGrid}
                            onCheckedChange={() => handleChartSettingsChange('showGrid')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-legend" className="flex items-center gap-2">
                            <ListIcon className="h-4 w-4 text-muted-foreground" />
                            Show Legend
                          </Label>
                          <Switch
                            id="show-legend"
                            checked={chartSettings.showLegend}
                            onCheckedChange={() => handleChartSettingsChange('showLegend')}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="show-tooltip" className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-muted-foreground" />
                            Show Tooltips
                          </Label>
                          <Switch
                            id="show-tooltip"
                            checked={chartSettings.showTooltip}
                            onCheckedChange={() => handleChartSettingsChange('showTooltip')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="animation" className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                            Enable Animation
                          </Label>
                          <Switch
                            id="animation"
                            checked={chartSettings.animation}
                            onCheckedChange={() => handleChartSettingsChange('animation')}
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zoom-level" className="mb-2 block">Zoom Level: {zoomLevel}%</Label>
                      <Slider
                        id="zoom-level"
                        min={50}
                        max={150}
                        step={10}
                        value={[zoomLevel]}
                        onValueChange={([value]) => setZoomLevel(value)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-muted/40 rounded-lg p-4 border border-border/50 shadow-sm"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium">Data Filters</h3>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => {
                          setSelectedMetrics(["production", "revenue", "efficiency"]);
                          setDateRange("30days");
                          setCustomDateRange(undefined);
                          setCompareDateRange(undefined);
                          setCompareMode(false);
                          setSortConfig(null);
                          setSearchQuery("");
                        }}
                      >
                        Reset All
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Date Range</h3>
                      <div className="flex flex-col space-y-4">
              <Select value={dateRange} onValueChange={setDateRange}>
                          <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last Quarter</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
              
                        {dateRange === "custom" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="start-date">Start Date</Label>
                              <Input
                                id="start-date"
                                type="date"
                                value={customDateRange?.from ? customDateRange.from.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                  const date = e.target.value ? new Date(e.target.value) : undefined;
                                  setCustomDateRange(prev => ({
                                    from: date || new Date(),
                                    to: prev?.to || new Date()
                                  }));
                                }}
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="end-date">End Date</Label>
                              <Input
                                id="end-date"
                                type="date"
                                value={customDateRange?.to ? customDateRange.to.toISOString().split('T')[0] : ''}
                                onChange={(e) => {
                                  const date = e.target.value ? new Date(e.target.value) : undefined;
                                  setCustomDateRange(prev => ({
                                    from: prev?.from || new Date(),
                                    to: date || new Date()
                                  }));
                                }}
                                className="w-full"
                              />
                            </div>
                          </div>
                        )}
            </div>
          </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Metrics to Display</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {["production", "revenue", "efficiency", "quality", "downtime", "defects", "cost", "utilization"].map((metric) => (
                          <div key={metric} className="flex items-center space-x-2">
                            <Checkbox
                              id={metric}
                              checked={selectedMetrics.includes(metric)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedMetrics([...selectedMetrics, metric]);
                                } else {
                                  setSelectedMetrics(selectedMetrics.filter(m => m !== metric));
                                }
                              }}
                            />
                            <label
                              htmlFor={metric}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {metric.charAt(0).toUpperCase() + metric.slice(1)}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {compareMode && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Compare With</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="compare-start-date">Start Date</Label>
                            <Input
                              id="compare-start-date"
                              type="date"
                              value={compareDateRange?.from ? compareDateRange.from.toISOString().split('T')[0] : ''}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                setCompareDateRange(prev => ({
                                  from: date || new Date(),
                                  to: prev?.to || new Date()
                                }));
                              }}
                              className="w-full"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="compare-end-date">End Date</Label>
                            <Input
                              id="compare-end-date"
                              type="date"
                              value={compareDateRange?.to ? compareDateRange.to.toISOString().split('T')[0] : ''}
                              onChange={(e) => {
                                const date = e.target.value ? new Date(e.target.value) : undefined;
                                setCompareDateRange(prev => ({
                                  from: prev?.from || new Date(),
                                  to: date || new Date()
                                }));
                              }}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          
          <Tabs value={analyticsView} onValueChange={setAnalyticsView} className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 mb-6 bg-card border border-border shadow-md rounded-md overflow-hidden">
                <TabsTrigger value="performance" className="relative overflow-hidden group data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300 py-2.5">
                  <span className="relative z-10">Performance</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: analyticsView === "performance" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
                <TabsTrigger value="production" className="relative overflow-hidden group data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300 py-2.5">
                  <span className="relative z-10">Production</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: analyticsView === "production" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
                <TabsTrigger value="efficiency" className="relative overflow-hidden group data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300 py-2.5">
                  <span className="relative z-10">Efficiency</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: analyticsView === "efficiency" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
                <TabsTrigger value="forecasting" className="relative overflow-hidden group data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300 py-2.5">
                  <span className="relative z-10">Forecasting</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: analyticsView === "forecasting" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
                <TabsTrigger value="trends" className="relative overflow-hidden group data-[state=active]:bg-primary/90 data-[state=active]:text-primary-foreground data-[state=active]:shadow-md data-[state=active]:font-semibold transition-all duration-300 py-2.5">
                  <span className="relative z-10">Market Trends</span>
                  <motion.div 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: analyticsView === "trends" ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance" className="space-y-6">
              {/* Performance metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Production Volume</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18,542 units</div>
                      <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        +12.5%
                      </Badge>
                        <span className="text-xs text-muted-foreground">from last period</span>
                      </div>
                      <Progress value={85} className="mt-2" />
                  </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                </Card>
                
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$72,000</div>
                      <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        +7.3%
                      </Badge>
                        <span className="text-xs text-muted-foreground">from last period</span>
                      </div>
                      <Progress value={78} className="mt-2" />
                  </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                </Card>
                
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">85.7%</div>
                      <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
                          <ArrowUpRight className="h-3 w-3 mr-1" />
                        +3.2%
                      </Badge>
                        <span className="text-xs text-muted-foreground">from last period</span>
                      </div>
                      <Progress value={85.7} className="mt-2" />
                  </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                </Card>
                
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Defect Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.8%</div>
                      <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/10">
                          <ArrowDownRight className="h-3 w-3 mr-1" />
                        -0.4%
                      </Badge>
                        <span className="text-xs text-muted-foreground">from last period</span>
                      </div>
                      <Progress value={18} className="mt-2" />
                  </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                      <div className="flex items-center justify-between">
                    <CardTitle>Production Volume Trend</CardTitle>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setChartType("line")}
                            className={chartType === "line" ? "bg-primary/10" : ""}
                          >
                            <LineChartIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setChartType("area")}
                            className={chartType === "area" ? "bg-primary/10" : ""}
                          >
                            <AreaChartIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setChartType("bar")}
                            className={chartType === "bar" ? "bg-primary/10" : ""}
                          >
                            <BarChart2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                        <AnimatePresence mode="wait">
                          {chartType === "line" && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <LineChart 
                                data={productionData}
                                index="name"
                                categories={["value"]}
                                colors={["blue"]}
                                valueFormatter={(value) => `${value.toLocaleString()} units`}
                              />
                            </motion.div>
                          )}
                          {chartType === "area" && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                      <AreaChart 
                        data={productionData}
                        index="name"
                        categories={["value"]}
                        colors={["blue"]}
                        valueFormatter={(value) => `${value.toLocaleString()} units`}
                      />
                            </motion.div>
                          )}
                          {chartType === "bar" && (
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -20 }}
                              transition={{ duration: 0.3 }}
                            >
                              <BarChart 
                                data={productionData}
                                index="name"
                                categories={["value"]}
                                colors={["blue"]}
                                valueFormatter={(value) => `${value.toLocaleString()} units`}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                    </div>
                  </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                </Card>
                
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <LineChart 
                        data={revenueData}
                        index="name"
                        categories={["value"]}
                        colors={["green"]}
                        valueFormatter={(value) => `$${value.toLocaleString()}`}
                      />
                    </div>
                  </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="production" className="space-y-6">
              {/* Production metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                      <div className="space-y-1">
                        <CardTitle className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent inline-block">Production by Product Category</CardTitle>
                        <CardDescription>Distribution of manufacturing output by product type</CardDescription>
                      </div>
                  </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row h-[400px]">
                        <div className="h-full w-full md:w-3/4 p-2 relative">
                          <AnimatePresence mode="wait">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.5 }}
                              className="h-full"
                            >
                      <PieChart 
                        data={productsBreakdown}
                        index="name"
                        categories={["value"]}
                                colors={["hsl(220, 70%, 50%)", "hsl(180, 70%, 50%)", "hsl(265, 70%, 50%)", "hsl(320, 70%, 50%)", "hsl(30, 70%, 50%)"]}
                        valueFormatter={(value) => `${value}%`}
                              />
                            </motion.div>
                          </AnimatePresence>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            initial={false}
                          />
                        </div>
                        <div className="p-4 md:w-1/4">
                          <h4 className="text-sm font-medium mb-4">Categories</h4>
                          <div className="space-y-3 mt-2">
                            {productsBreakdown.map((item, index) => (
                              <motion.div 
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center justify-between gap-2 hover:bg-muted/60 p-2 rounded-md cursor-pointer transition-all hover:translate-x-1"
                                onClick={() => toast({
                                  title: item.name,
                                  description: `${item.value}% of total production`,
                                  variant: "default",
                                })}
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="h-3 w-3 rounded-full shadow-sm" 
                                    style={{ 
                                      backgroundColor: index === 0 ? "hsl(220, 70%, 50%)" : 
                                                      index === 1 ? "hsl(180, 70%, 50%)" : 
                                                      index === 2 ? "hsl(265, 70%, 50%)" : 
                                                      index === 3 ? "hsl(320, 70%, 50%)" : "hsl(30, 70%, 50%)" 
                                    }}
                                  />
                                  <span className="text-sm">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium">{item.value}%</span>
                              </motion.div>
                            ))}
                          </div>
                        </div>
                    </div>
                  </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                </Card>
                
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Production Line Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <BarChart 
                        data={efficiencyData}
                        index="name"
                        categories={["value"]}
                        colors={["blue"]}
                        valueFormatter={(value) => `${value}%`}
                      />
                    </div>
                  </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                </Card>
              </div>
              
              {/* Production metrics */}
                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle>Production Line Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[500px]">
                    <table className="min-w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="px-4 py-3 text-left">Line</th>
                          <th className="px-4 py-3 text-left">Output</th>
                          <th className="px-4 py-3 text-left">Efficiency</th>
                          <th className="px-4 py-3 text-left">Downtime</th>
                          <th className="px-4 py-3 text-left">Defect Rate</th>
                          <th className="px-4 py-3 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                          <tr className="border-b hover:bg-muted/50 transition-colors duration-200">
                          <td className="px-4 py-3 font-medium">Line A</td>
                          <td className="px-4 py-3">5,842 units</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Progress value={85} className="w-20" />
                                <span>85%</span>
                              </div>
                            </td>
                          <td className="px-4 py-3">3.2%</td>
                          <td className="px-4 py-3">1.1%</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Active
                              </Badge>
                            </td>
                        </tr>
                          <tr className="border-b hover:bg-muted/50 transition-colors duration-200">
                          <td className="px-4 py-3 font-medium">Line B</td>
                          <td className="px-4 py-3">6,120 units</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Progress value={92} className="w-20" />
                                <span>92%</span>
                              </div>
                            </td>
                          <td className="px-4 py-3">1.8%</td>
                          <td className="px-4 py-3">0.9%</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Active
                              </Badge>
                            </td>
                        </tr>
                          <tr className="border-b hover:bg-muted/50 transition-colors duration-200">
                          <td className="px-4 py-3 font-medium">Line C</td>
                          <td className="px-4 py-3">4,231 units</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Progress value={78} className="w-20" />
                                <span>78%</span>
                              </div>
                            </td>
                          <td className="px-4 py-3">5.6%</td>
                          <td className="px-4 py-3">1.7%</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500">
                                Maintenance
                              </Badge>
                            </td>
                        </tr>
                          <tr className="hover:bg-muted/50 transition-colors duration-200">
                          <td className="px-4 py-3 font-medium">Line D</td>
                          <td className="px-4 py-3">4,349 units</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Progress value={88} className="w-20" />
                                <span>88%</span>
                              </div>
                            </td>
                          <td className="px-4 py-3">2.9%</td>
                          <td className="px-4 py-3">1.3%</td>
                            <td className="px-4 py-3">
                              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                                Active
                              </Badge>
                            </td>
                        </tr>
                      </tbody>
                    </table>
                    </ScrollArea>
                </CardContent>
                  <motion.div 
                    className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
              </Card>
            </TabsContent>
            
            <TabsContent value="efficiency" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Efficiency Trends</CardTitle>
                      <CardDescription>Track efficiency metrics over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <LineChart 
                          data={[
                            { name: "Mon", value: 82 },
                            { name: "Tue", value: 85 },
                            { name: "Wed", value: 88 },
                            { name: "Thu", value: 86 },
                            { name: "Fri", value: 90 },
                            { name: "Sat", value: 87 },
                            { name: "Sun", value: 89 }
                          ]}
                          index="name"
                          categories={["value"]}
                          colors={["blue"]}
                          valueFormatter={(value) => `${value}%`}
                        />
                </div>
                    </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </Card>

                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="space-y-1">
                        <CardTitle className="bg-gradient-to-r from-red-600 to-amber-500 bg-clip-text text-transparent inline-block">Downtime Analysis</CardTitle>
                        <CardDescription>Breakdown of downtime causes</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row h-[400px]">
                        <div className="h-full w-full md:w-3/4 p-2 relative">
                          <AnimatePresence mode="wait">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.5 }}
                              className="h-full"
                            >
                              <PieChart 
                                data={[
                                  { name: "Maintenance", value: 45 },
                                  { name: "Breakdowns", value: 25 },
                                  { name: "Changeovers", value: 20 },
                                  { name: "Other", value: 10 }
                                ]}
                                index="name"
                                categories={["value"]}
                                colors={["hsl(200, 75%, 55%)", "hsl(340, 75%, 55%)", "hsl(45, 75%, 55%)", "hsl(130, 75%, 55%)"]}
                                valueFormatter={(value) => `${value}%`}
                              />
                            </motion.div>
                          </AnimatePresence>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-bl from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            initial={false}
                          />
                        </div>
                        <div className="p-4 md:w-1/4">
                          <h4 className="text-sm font-medium mb-4">Downtime Causes</h4>
                          <div className="space-y-3 mt-2">
                            {[
                              { name: "Maintenance", value: 45, color: "hsl(200, 75%, 55%)" },
                              { name: "Breakdowns", value: 25, color: "hsl(340, 75%, 55%)" },
                              { name: "Changeovers", value: 20, color: "hsl(45, 75%, 55%)" },
                              { name: "Other", value: 10, color: "hsl(130, 75%, 55%)" }
                            ].map((item, index) => (
                              <motion.div 
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center justify-between gap-2 hover:bg-muted/60 p-2 rounded-md cursor-pointer transition-all hover:translate-x-1"
                                onClick={() => toast({
                                  title: item.name,
                                  description: `${item.value}% of total downtime`,
                                  variant: "default",
                                })}
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="h-3 w-3 rounded-full shadow-sm" 
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-sm">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium">{item.value}%</span>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t">
                            <p className="text-xs text-muted-foreground">
                              Click on segments for detailed information
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </Card>
                </div>

                <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Efficiency Alerts</CardTitle>
                    <CardDescription>Recent efficiency-related notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-900/20">
                        <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Line C Efficiency Drop</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Line C efficiency has dropped below 80% for the first time this week.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">2 hours ago</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-4 p-4 rounded-lg border bg-green-50 dark:bg-green-900/20">
                        <Info className="h-5 w-5 text-green-500 mt-0.5" />
                        <div>
                          <h4 className="font-medium">Line B Efficiency Improvement</h4>
                          <p className="text-sm text-muted-foreground mt-1">
                            Line B efficiency has improved by 5% after maintenance.
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">5 hours ago</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <motion.div 
                    className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={false}
                  />
              </Card>
            </TabsContent>
            
            <TabsContent value="forecasting" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Production Forecast</CardTitle>
                      <CardDescription>Predicted production volumes for next 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <AreaChart 
                          data={[
                            { name: "Week 1", value: 2500 },
                            { name: "Week 2", value: 2800 },
                            { name: "Week 3", value: 3100 },
                            { name: "Week 4", value: 3400 }
                          ]}
                          index="name"
                          categories={["value"]}
                          colors={["blue"]}
                          valueFormatter={(value) => `${value.toLocaleString()} units`}
                        />
                </div>
                    </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
              </Card>

                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Resource Requirements</CardTitle>
                      <CardDescription>Predicted resource needs for upcoming production</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Raw Materials</span>
                            <span className="text-sm text-muted-foreground">75% needed</span>
                          </div>
                          <Progress value={75} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Labor Hours</span>
                            <span className="text-sm text-muted-foreground">60% needed</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Machine Hours</span>
                            <span className="text-sm text-muted-foreground">85% needed</span>
                          </div>
                          <Progress value={85} className="h-2" />
                        </div>
                      </div>
                    </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </Card>
                </div>
            </TabsContent>
            
            <TabsContent value="trends" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <CardTitle>Market Demand Trends</CardTitle>
                      <CardDescription>Current market demand for different product categories</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[400px]">
                        <BarChart 
                          data={[
                            { name: "Cereals", value: 85 },
                            { name: "Snack Bars", value: 72 },
                            { name: "Beverages", value: 68 },
                            { name: "Protein", value: 92 },
                            { name: "Other", value: 45 }
                          ]}
                          index="name"
                          categories={["value"]}
                          colors={["blue"]}
                          valueFormatter={(value) => `${value}%`}
                        />
                </div>
                    </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
              </Card>

                  <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                      <div className="space-y-1">
                        <CardTitle className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent inline-block">Competitor Analysis</CardTitle>
                        <CardDescription>Market share comparison with competitors</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row h-[400px]">
                        <div className="h-full w-full md:w-3/4 p-2 relative">
                          <AnimatePresence mode="wait">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.9 }}
                              transition={{ duration: 0.5 }}
                              className="h-full"
                            >
                              <PieChart 
                                data={[
                                  { name: "Your Company", value: 35 },
                                  { name: "Competitor A", value: 25 },
                                  { name: "Competitor B", value: 20 },
                                  { name: "Competitor C", value: 15 },
                                  { name: "Others", value: 5 }
                                ]}
                                index="name"
                                categories={["value"]}
                                colors={["hsl(213, 92%, 60%)", "hsl(170, 80%, 45%)", "hsl(250, 70%, 55%)", "hsl(300, 65%, 50%)", "hsl(45, 60%, 55%)"]}
                                valueFormatter={(value) => `${value}%`}
                              />
                            </motion.div>
                          </AnimatePresence>
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                            initial={false}
                          />
                        </div>
                        <div className="p-4 md:w-1/4">
                          <h4 className="text-sm font-medium mb-4">Market Share</h4>
                          <div className="space-y-3 mt-2">
                            {[
                              { name: "Your Company", value: 35, color: "hsl(213, 92%, 60%)" },
                              { name: "Competitor A", value: 25, color: "hsl(170, 80%, 45%)" },
                              { name: "Competitor B", value: 20, color: "hsl(250, 70%, 55%)" },
                              { name: "Competitor C", value: 15, color: "hsl(300, 65%, 50%)" },
                              { name: "Others", value: 5, color: "hsl(45, 60%, 55%)" }
                            ].map((item, index) => (
                              <motion.div 
                                key={item.name}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                className="flex items-center justify-between gap-2 hover:bg-muted/30 p-2 rounded-md cursor-pointer transition-colors"
                                onClick={() => toast({
                                  title: item.name,
                                  description: `${item.value}% market share`,
                                  variant: "default",
                                })}
                              >
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="h-3 w-3 rounded-full" 
                                    style={{ backgroundColor: item.color }}
                                  />
                                  <span className="text-sm">{item.name}</span>
                                </div>
                                <span className="text-sm font-medium">{item.value}%</span>
                              </motion.div>
                            ))}
                          </div>
                          <div className="mt-4 pt-3 border-t">
                            <p className="text-xs text-muted-foreground">
                              <span className="font-medium">Your Lead: </span>
                              +10% from last quarter
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <motion.div 
                      className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={false}
                    />
                  </Card>
                </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>

        {/* Save View Dialog */}
        <Dialog open={showSaveViewDialog} onOpenChange={setShowSaveViewDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Save Current View</DialogTitle>
              <DialogDescription>
                Save your current dashboard configuration for quick access later.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="view-name">View Name</Label>
                <Input
                  id="view-name"
                  placeholder="My Performance Dashboard"
                  value={newViewName}
                  onChange={(e) => setNewViewName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Included Settings</Label>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    Selected metrics ({selectedMetrics.length})
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    Date range and filters
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    Chart types and settings
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-primary" />
                    Active tab ({analyticsView})
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSaveViewDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveCurrentView} disabled={!newViewName.trim()}>
                Save View
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Share Dialog */}
        <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Share Dashboard</DialogTitle>
              <DialogDescription>
                Share this dashboard configuration with team members.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="share-email">Email Address</Label>
                <Input
                  id="share-email"
                  placeholder="colleague@example.com"
                  type="email"
                  value={emailToShare}
                  onChange={(e) => setEmailToShare(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Permission Level</Label>
                <Select defaultValue="view">
                  <SelectTrigger>
                    <SelectValue placeholder="Select permission" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="view">View Only</SelectItem>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="manage">Manage</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="share-message">Message (Optional)</Label>
                <Textarea
                  id="share-message"
                  placeholder="Here's the dashboard I mentioned..."
                  className="resize-none"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowShareDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleShareView} disabled={!emailToShare.trim()}>
                Share
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Help Dialog */}
        <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Analytics Dashboard Help</DialogTitle>
              <DialogDescription>
                Learn how to use the analytics dashboard features.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Quick Start Guide</h3>
                <p className="text-sm text-muted-foreground">
                  The analytics dashboard provides real-time insights into your manufacturing operations. Here's how to get started:
                </p>
                <div className="grid gap-4 mt-4">
                  <div className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                      <span className="text-primary font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Choose Your View</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Select from Performance, Production, Efficiency, Forecasting, or Market Trends tabs to focus on different aspects of your operations.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                      <span className="text-primary font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Apply Filters</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use the Filters button to set date ranges and select which metrics to display.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                      <span className="text-primary font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Customize Your Dashboard</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use the Settings menu to customize chart appearance, set up auto-refresh, or enter fullscreen mode.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-primary/10 rounded-full p-2 h-8 w-8 flex items-center justify-center">
                      <span className="text-primary font-medium">4</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Save or Share</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Use the Save View option to store your current setup, or Export/Share to distribute your insights with others.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Feature Reference</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Compare Mode
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Compare metrics across different time periods to identify trends and patterns.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      Alerts
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about important events and threshold breaches.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Saved Views
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Save dashboard configurations for quick access to frequently-used setups.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export Options
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Export data in multiple formats including PDF, CSV, Excel, and JSON.
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Need More Help?</h3>
                <p className="text-sm text-muted-foreground">
                  Contact support or view detailed documentation for additional assistance.
                </p>
                <div className="flex gap-4 mt-4">
                  <Button variant="outline" className="gap-2">
                    <FileText className="h-4 w-4" />
                    View Documentation
                  </Button>
                  <Button className="gap-2">
                    <HelpCircle className="h-4 w-4" />
                    Contact Support
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        
        {/* Confirmation dialog for deleting saved views */}
        <AlertDialog>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the saved view.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </MotionConfig>
    </ManufacturerLayout>
  );
};

export default Analytics;

// Helper component for check icon
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

// Helper component for grid icon
function GridIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="3" x2="21" y1="9" y2="9" />
      <line x1="3" x2="21" y1="15" y2="15" />
      <line x1="9" x2="9" y1="3" y2="21" />
      <line x1="15" x2="15" y1="3" y2="21" />
    </svg>
  );
}

// Helper component for list icon
function ListIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}
