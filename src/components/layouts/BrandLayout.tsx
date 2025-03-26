import { FC, ReactNode, useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { 
  Package, 
  BarChart3, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Home,
  PanelLeft,
  PanelRight,
  Building,
  ShoppingCart,
  Store,
  Bell,
  MessageSquare,
  HelpCircle,
  Shield,
  Moon,
  Sun,
  Languages,
  Search,
  ChevronDown,
  LayoutDashboard,
  User,
  ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface BrandLayoutProps {
  children: ReactNode;
}

const BrandLayout: FC<BrandLayoutProps> = ({ children }) => {
  const { isAuthenticated, user, logout, role, updateUserStatus } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(true);
  const [hasMessages, setHasMessages] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [language, setLanguage] = useState('en');
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Toggle theme function
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    localStorage.setItem('theme', newTheme);
  };

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Check if the current route is active
  const isRouteActive = (path: string) => {
    return location.pathname === path;
  };

  // Get the current page title
  const getCurrentPageTitle = () => {
    const currentPath = location.pathname;
    const item = navigationItems.find(item => item.path === currentPath);
    return item ? item.name : "Dashboard";
  };

  // Handle resize to detect mobile devices
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/auth?type=signin');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?type=signin');
    } else if (role !== 'brand') {
      navigate('/dashboard');
    }
  }, [isAuthenticated, role, navigate]);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle status change
  const handleStatusChange = (status: "online" | "away" | "busy") => {
    updateUserStatus(status);
    setIsOpen(false);
  };

  // Navigate to specific page
  const navigateTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  // Add a useEffect for detecting clicks outside the search container
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchOpen && 
          searchContainerRef.current && 
          !searchContainerRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchOpen]);

  if (!isAuthenticated || role !== 'brand') {
    return null;
  }

  // Navigation items for brand
  const navigationItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: 'Home',
      path: '/',
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: 'Products',
      path: '/brand/products',
      icon: <Package className="h-5 w-5" />,
    },
    {
      name: 'Manufacturers',
      path: '/brand/manufacturers',
      icon: <Building className="h-5 w-5" />,
    },
    {
      name: 'Retailers',
      path: '/brand/retailers',
      icon: <Store className="h-5 w-5" />,
    },
    {
      name: 'Analytics',
      path: '/brand/analytics',
      icon: <BarChart3 className="h-5 w-5" />,
    },
  ];

  // Languages available
  const languages = [
    { value: 'en', label: 'English' },
    { value: 'vi', label: 'Tiếng Việt' },
    { value: 'fr', label: 'Français' },
    { value: 'es', label: 'Español' },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar for desktop */}
      <motion.aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 hidden lg:block",
          sidebarCollapsed ? "w-16" : "w-64"
        )}
        animate={{ 
          width: sidebarCollapsed ? 64 : 256,
          boxShadow: sidebarCollapsed ? "none" : "0 0 15px rgba(0, 0, 0, 0.05)"
        }}
        transition={{ 
          duration: 0.3, 
          ease: "easeInOut" 
        }}
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-background border-r no-scrollbar">
          <div className={cn("flex items-center justify-between mb-8", sidebarCollapsed && "justify-center")}>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Link to="/dashboard" className="flex items-center text-xl font-semibold">
                  <span className="text-primary">CPG Matchmaker</span>
                </Link>
              </motion.div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="inline-flex lg:flex text-primary hover:bg-primary/10"
            >
              {sidebarCollapsed ? <PanelRight className="h-5 w-5" /> : <PanelLeft className="h-5 w-5" />}
            </Button>
          </div>

          <div className="space-y-2">
            <AnimatePresence>
              {navigationItems.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: sidebarCollapsed ? 0 : index * 0.05 
                  }}
                >
                  <Link
                    to={item.path}
                    className={cn(
                      "flex items-center p-3 text-base font-normal rounded-lg hover:bg-primary/10 group transition-all",
                      isRouteActive(item.path) 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "text-muted-foreground hover:text-primary",
                      sidebarCollapsed && "justify-center px-3"
                    )}
                  >
                    <div className={isRouteActive(item.path) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}>
                      {item.icon}
                    </div>
                    {!sidebarCollapsed && (
                      <motion.span 
                        className="ml-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                    {sidebarCollapsed && (
                      <span className="absolute left-full rounded-md px-2 py-1 ml-6 bg-popover text-popover-foreground text-sm invisible opacity-0 -translate-x-3 group-hover:visible group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-md">
                        {item.name}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </motion.aside>

      {/* Mobile menu button */}
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="focus:outline-none shadow-sm hover:shadow-md transition-shadow"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 z-40 lg:hidden bg-background/80 backdrop-blur-sm" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className="fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r"
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-full px-3 py-4 overflow-y-auto no-scrollbar">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/dashboard" className="flex items-center text-xl font-semibold">
                    <span className="text-primary">CPG Matchmaker</span>
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-primary hover:bg-primary/10"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <AnimatePresence>
                    {navigationItems.map((item, index) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05 
                        }}
                      >
                        <Link
                          to={item.path}
                          className={cn(
                            "flex items-center p-3 text-base font-normal rounded-lg hover:bg-primary/10 group transition-all",
                            isRouteActive(item.path) 
                              ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                              : "text-muted-foreground hover:text-primary"
                          )}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <div className={isRouteActive(item.path) ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"}>
                            {item.icon}
                          </div>
                          <span className="ml-3">{item.name}</span>
                        </Link>
                      </motion.div>
                    ))}

                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: navigationItems.length * 0.05 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full flex items-center p-3 text-base font-normal rounded-lg hover:bg-destructive/10 hover:text-destructive mt-4"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="ml-3">Log Out</span>
                      </Button>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className={cn("flex-1 flex flex-col min-h-screen", sidebarCollapsed ? "lg:ml-20" : "lg:ml-64")}>
        {/* Enhanced sticky header */}
        <header className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b shadow-sm transition-all duration-300 ease-in-out">
          <div className="flex h-16 items-center justify-between px-4 md:px-6">
            {/* Left section - Title and breadcrumb */}
            <div className="flex items-center gap-2">
              <motion.h1 
                className="text-xl font-bold hidden sm:block bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.03 }}
              >
                {getCurrentPageTitle()}
              </motion.h1>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Badge variant="outline" className="hidden md:flex items-center gap-1 text-xs border-primary/40 text-primary">
                  <span className="relative after:absolute after:bottom-0 after:left-0 after:h-[1px] after:w-0 after:bg-primary/60 after:transition-all hover:after:w-full">Brand</span>
                </Badge>
              </motion.div>
            </div>
            
            {/* Center section - Search */}
            <AnimatePresence mode="wait">
              {searchOpen ? (
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center bg-background/95 px-4 md:px-6 h-16 backdrop-blur-md"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  ref={searchContainerRef}
                >
                  <div className="w-full max-w-md flex items-center relative">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2"
                    >
                      <Search className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                    <Input 
                      type="text" 
                      placeholder="Search dashboards, products, reports..." 
                      className="w-full pl-10 pr-4 bg-transparent border-primary/30 focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all shadow-none focus:shadow-sm dark:bg-background/60 dark:border-primary/20 dark:focus:border-primary/40 focus:outline-none"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {searchQuery && (
                      <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        className="absolute right-2 top-1/2 -translate-y-1/2"
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-muted-foreground hover:text-foreground"
                          onClick={() => setSearchQuery("")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
            
            {/* Right section - Actions */}
            <div className="flex items-center gap-2">
              {/* Search button */}
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setSearchOpen(true)}
                >
                  <motion.div
                    whileHover={{ rotate: 15, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Search className="h-5 w-5" />
                  </motion.div>
                </Button>
              </motion.div>
              
              {/* Language toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors">
                      <Languages className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Select Language</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={language} onValueChange={setLanguage}>
                      {languages.map((lang) => (
                        <DropdownMenuRadioItem
                          key={lang.value}
                          value={lang.value}
                          className="cursor-pointer"
                        >
                          {lang.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              
              {/* Theme toggle */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors"
                  onClick={toggleTheme}
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={theme}
                      initial={{ opacity: 0, rotate: -30, scale: 0.5, y: -20 }}
                      animate={{ opacity: 1, rotate: 0, scale: 1, y: 0 }}
                      exit={{ opacity: 0, rotate: 30, scale: 0.5, y: 20 }}
                      transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
                    >
                      {theme === 'dark' ? (
                        <Moon className="h-5 w-5" />
                      ) : (
                        <Sun className="h-5 w-5" />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </Button>
              </motion.div>
              
              {/* Help */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors relative group"
                >
                  <HelpCircle className="h-5 w-5" />
                  <motion.span 
                    className="absolute -bottom-8 right-0 min-w-max px-2 py-1 rounded-md text-xs font-medium bg-popover text-popover-foreground shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all"
                    initial={{ opacity: 0, y: -5 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    Help Center
                  </motion.span>
                </Button>
              </motion.div>
              
              {/* Notifications */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 transition-colors">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      {hasNotifications && (
                        <motion.span 
                          className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"
                          initial={{ scale: 0.5 }}
                          animate={{ scale: [0.8, 1.2, 0.8] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                        ></motion.span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="flex items-center justify-between p-2">
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                      <Badge variant="secondary" className="ml-auto">New 2</Badge>
                    </div>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto no-scrollbar">
                      <motion.div 
                        className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
                        whileHover={{ x: 2, backgroundColor: "rgba(var(--muted), 0.5)" }}
                      >
                        <p className="font-medium">New partnership opportunity</p>
                        <p className="text-sm text-muted-foreground">Eco Foods Inc. wants to feature your products in their stores.</p>
                        <p className="text-xs text-muted-foreground mt-1">2 minutes ago</p>
                      </motion.div>
                      <motion.div 
                        className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
                        whileHover={{ x: 2, backgroundColor: "rgba(var(--muted), 0.5)" }}
                      >
                        <p className="font-medium">Product analytics updated</p>
                        <p className="text-sm text-muted-foreground">June sales reports are now available.</p>
                        <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                      </motion.div>
                    </div>
                    <DropdownMenuSeparator />
                    <Button variant="ghost" className="w-full justify-center" size="sm">
                      View all notifications
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              
              {/* Messages */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative hover:bg-primary/5 transition-colors">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      {hasMessages && (
                        <motion.span 
                          className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"
                          animate={{ 
                            opacity: [1, 0.5, 1],
                            scale: [1, 0.8, 1]
                          }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                        ></motion.span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Messages</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <div className="max-h-80 overflow-y-auto no-scrollbar">
                      <motion.div 
                        className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
                        whileHover={{ x: 2, backgroundColor: "rgba(var(--muted), 0.5)" }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>NS</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Natural Selects Inc.</p>
                            <p className="text-sm line-clamp-1 text-muted-foreground">We'd like to discuss placing a large order...</p>
                            <p className="text-xs text-muted-foreground mt-1">10 minutes ago</p>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="p-3 hover:bg-muted rounded-md cursor-pointer transition-colors"
                        whileHover={{ x: 2, backgroundColor: "rgba(var(--muted), 0.5)" }}
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarImage src="/placeholder.svg" />
                            <AvatarFallback>MF</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">Modern Foods Manufacturing</p>
                            <p className="text-sm line-clamp-1 text-muted-foreground">Your request for production samples has been...</p>
                            <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    <DropdownMenuSeparator />
                    <Button variant="ghost" className="w-full justify-center" size="sm">
                      View all messages
                    </Button>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
              
              {/* User avatar */}
              <UserMenu />
            </div>
          </div>
          
          {/* Secondary nav with actions or tabs - hidden to match other layouts */}
          <div className="hidden">
            {/* Secondary navigation content */}
          </div>
        </header>
        
        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10 no-scrollbar w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

// User dropdown menu
const UserMenu = () => {
  const { user, logout, updateUserStatus } = useUser();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle user logout
  const handleLogout = () => {
    logout();
    navigate("/auth?type=signin");
  };

  // Handle status change
  const handleStatusChange = (status: "online" | "away" | "busy") => {
    updateUserStatus(status);
    setIsOpen(false);
  };

  // Navigate to specific page
  const navigateTo = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center space-x-2 rounded-full p-0.5 focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="relative">
          <Avatar className="h-8 w-8 border-2 border-primary/10 transition group-hover:border-primary/30">
            <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
            <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
            user?.status === "online" ? "bg-green-500" : 
            user?.status === "away" ? "bg-yellow-500" : "bg-red-500"
          }`} />
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 z-50 overflow-hidden origin-top-right"
          >
            <div className="rounded-xl border border-border bg-background/95 backdrop-blur-sm shadow-lg">
              {/* User info section with darker background */}
              <div className="p-4 border-b border-border bg-muted/80">
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14 border-2 border-primary/20">
                    <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                    <AvatarFallback className="text-lg">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-semibold truncate">{user?.name}</h4>
                    <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                    
                    <div className="flex items-center mt-1 space-x-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                            <span className={`h-2 w-2 rounded-full mr-2 ${
                              user?.status === "online" ? "bg-green-500" : 
                              user?.status === "away" ? "bg-yellow-500" : "bg-red-500"
                            }`} />
                            {user?.status === "online" ? "Online" : 
                              user?.status === "away" ? "Away" : "Busy"}
                            <ChevronDown className="h-3.5 w-3.5 ml-1" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-40">
                          <DropdownMenuItem onClick={() => handleStatusChange("online")}>
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                              <span>Online</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange("away")}>
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                              <span>Away</span>
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleStatusChange("busy")}>
                            <div className="flex items-center">
                              <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                              <span>Busy</span>
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Badge variant="secondary" className="text-xs px-2 py-0 h-5">
                        Brand
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Brand-specific stats */}
                <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                  <div className="bg-background/70 rounded-lg p-2">
                    <p className="text-lg font-semibold">{user?.brandSettings?.productCategories?.length || "0"}</p>
                    <p className="text-xs text-muted-foreground">Categories</p>
                  </div>
                  <div className="bg-background/70 rounded-lg p-2">
                    <p className="text-lg font-semibold">12</p>
                    <p className="text-xs text-muted-foreground">Products</p>
                  </div>
                  <div className="bg-background/70 rounded-lg p-2">
                    <p className="text-lg font-semibold">8</p>
                    <p className="text-xs text-muted-foreground">Retailers</p>
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="p-2">
                <div className="grid grid-cols-1 gap-1">
                  <button
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => navigateTo("/brand/dashboard")}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <div className="flex-1 text-left">
                      <p>Dashboard</p>
                      <p className="text-xs text-muted-foreground">Brand overview</p>
                    </div>
                  </button>

                  <button
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => navigateTo("/profile")}
                  >
                    <User className="h-4 w-4" />
                    <div className="flex-1 text-left">
                      <p>Profile</p>
                      <p className="text-xs text-muted-foreground">Manage your information</p>
                    </div>
                  </button>

                  <button
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
                    onClick={() => navigateTo("/brand/settings")}
                  >
                    <Settings className="h-4 w-4" />
                    <div className="flex-1 text-left">
                      <p>Settings</p>
                      <p className="text-xs text-muted-foreground">Account preferences</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Logout */}
              <div className="p-2 border-t border-border">
                <button
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-destructive transition-colors hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  <div className="flex-1 text-left">
                    <p>Log out</p>
                    <p className="text-xs text-muted-foreground">Sign out of your account</p>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BrandLayout; 