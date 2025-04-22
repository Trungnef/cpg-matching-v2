import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, Search, Check, CircleEllipsis, Clock, LayoutDashboard, Settings, LogOut, Globe, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import SearchPanel from "./SearchPanel";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import FavoritesMenu from "./FavoritesMenu";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, updateUserStatus } = useUser();
  const { t } = useTranslation();

  // Handle scroll effect with enhanced animation
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Close mobile menu when location changes
  useEffect(() => {
    setIsOpen(false);
    setSearchPanelOpen(false);
  }, [location]);

  // Toggle search panel
  const toggleSearchPanel = () => {
    setSearchPanelOpen(!searchPanelOpen);
  };

  // Check if current page should show search
  const shouldShowSearch = !['/', '/solutions'].includes(location.pathname);

  // Handle click outside search panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchPanelOpen && 
          searchPanelRef.current && 
          !searchPanelRef.current.contains(event.target as Node)) {
        setSearchPanelOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchPanelOpen]);

  // Enhanced nav variants with glass effect
  const navVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 1
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    open: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const linkVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  // User menu component
  const UserMenuDropdown = () => {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [isOpen, setIsOpen] = useState(false);
    
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
    
    return (
      <div className="relative" ref={dropdownRef}>
        <motion.button
          className="flex items-center space-x-2 rounded-full p-0.5 focus:outline-none group"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="relative">
            <Avatar className="h-8 w-8 border-2 border-primary/20 dark:border-primary/30 transition-all duration-300 group-hover:border-primary/60 dark:group-hover:border-primary/70 shadow-sm">
              <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
              <AvatarFallback className="bg-primary/5 dark:bg-primary/10">{user?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background ${
              user?.status === "online" ? "bg-green-500" : 
              user?.status === "away" ? "bg-yellow-500" : "bg-red-500"
            }`} />
          </div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute right-0 mt-2 w-80 z-50 overflow-hidden origin-top-right"
            >
              <div className="rounded-xl border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
                {/* User info section with subtle background */}
                <div className="p-4 border-b border-border bg-muted">
                  <div className="flex items-start gap-4">
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                      <Avatar className="h-14 w-14 border-2 border-primary/20 dark:border-primary/30 shadow-md">
                        <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                        <AvatarFallback className="text-lg bg-primary/5 dark:bg-primary/10">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold truncate">{user?.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
                      
                      <div className="flex items-center mt-1 space-x-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-200">
                              <span className={`h-2 w-2 rounded-full mr-2 ${
                                user?.status === "online" ? "bg-green-500" : 
                                user?.status === "away" ? "bg-yellow-500" : "bg-red-500"
                              }`} />
                              {user?.status === "online" ? "Online" : 
                                user?.status === "away" ? "Away" : "Busy"}
                              <ChevronDown className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="start" className="w-40 bg-popover text-popover-foreground border-border">
                            <DropdownMenuItem onClick={() => updateUserStatus("online")} className="hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                                <span>Online</span>
                                {user?.status === "online" && <Check className="h-3.5 w-3.5 ml-auto" />}
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserStatus("away")} className="hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                                <span>Away</span>
                                {user?.status === "away" && <Check className="h-3.5 w-3.5 ml-auto" />}
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateUserStatus("busy")} className="hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                              <div className="flex items-center">
                                <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                                <span>Busy</span>
                                {user?.status === "busy" && <Check className="h-3.5 w-3.5 ml-auto" />}
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        {user?.role && (
                          <Badge variant="secondary" className="text-xs px-2 py-0 h-5 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary">
                            {user.role === 'brand' ? 'Brand' : 
                             user.role === 'manufacturer' ? 'Manufacturer' : 
                             user.role === 'retailer' ? 'Retailer' : 'User'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* User stats if available */}
                  {user?.role && (
                    <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                      <motion.div whileHover={{ scale: 1.05 }} className="bg-muted rounded-lg p-2 border border-border/30 dark:border-border/20 shadow-sm">
                        <p className="text-lg font-semibold">0</p>
                        <p className="text-xs text-muted-foreground">Messages</p>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className="bg-muted rounded-lg p-2 border border-border/30 dark:border-border/20 shadow-sm">
                        <p className="text-lg font-semibold">0</p>
                        <p className="text-xs text-muted-foreground">Matches</p>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} className="bg-muted rounded-lg p-2 border border-border/30 dark:border-border/20 shadow-sm">
                        <p className="text-lg font-semibold">0</p>
                        <p className="text-xs text-muted-foreground">Favorites</p>
                      </motion.div>
                    </div>
                  )}
                </div>

                {/* Menu items - Remove hover effect and improve text visibility */}
                <div className="p-2">
                  <div className="grid grid-cols-1 gap-1">
                    <motion.button
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-background dark:hover:bg-background/50 text-left group"
                      onClick={() => navigate("/dashboard")}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="p-1.5 rounded-md bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary transition-colors">
                        <LayoutDashboard className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">{t('dashboard')}</p>
                        <p className="text-xs text-muted-foreground">View your dashboard</p>
                      </div>
                    </motion.button>

                    <motion.button
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-background dark:hover:bg-background/50 text-left group"
                      onClick={() => navigate("/profile")}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="p-1.5 rounded-md bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary transition-colors">
                        <User className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">{t('profile')}</p>
                        <p className="text-xs text-muted-foreground">Manage your information</p>
                      </div>
                    </motion.button>

                    <motion.button
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-background dark:hover:bg-background/50 text-left group"
                      onClick={() => navigate(`/${user?.role}/settings`)}
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <div className="p-1.5 rounded-md bg-primary/15 dark:bg-primary/20 text-primary dark:text-primary/90 transition-colors">
                        <Settings className="h-4 w-4" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-foreground">{t('settings')}</p>
                        <p className="text-xs text-muted-foreground">Account preferences</p>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* Logout - Improved contrast for dark theme */}
                <div className="p-2 border-t border-border">
                  <motion.button
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-destructive/10 dark:hover:bg-red-900/20 transition-colors duration-300 text-left"
                    onClick={handleLogout}
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <div className="p-1.5 rounded-md bg-destructive/10 dark:bg-red-500/20 text-destructive dark:text-red-400 transition-colors">
                      <LogOut className="h-4 w-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-destructive dark:text-red-400">{t('logout')}</p>
                      <p className="text-xs text-muted-foreground">Sign out of your account</p>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Enhanced Language Switcher Component
  const EnhancedLanguageSwitcher = () => {
    const { t, i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    
    // Close dropdown when clicking outside
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
    
    const languages = [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    ];
    
    return (
      <div className="relative" ref={dropdownRef}>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center gap-2 rounded-full p-2 text-sm font-medium focus:outline-none group hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Globe className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline-block">{i18n.language.toUpperCase()}</span>
          <motion.div 
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className="h-3.5 w-3.5 text-primary/70" />
          </motion.div>
        </motion.button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute right-0 mt-2 w-48 z-50 overflow-hidden origin-top-right"
            >
              <div className="rounded-xl border border-border bg-popover text-popover-foreground shadow-lg overflow-hidden">
                <div className="p-2">
                  {languages.map((language) => (
                    <motion.button
                      key={language.code}
                      onClick={() => {
                        i18n.changeLanguage(language.code);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-primary/10 dark:hover:bg-primary/20 text-left ${
                        i18n.language === language.code ? 'bg-primary/5 dark:bg-primary/10' : ''
                      }`}
                      whileHover={{ x: 3 }}
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background/80 dark:bg-background/60 shadow-sm border border-border/30 dark:border-border/20">
                        <span className="text-xl">{language.flag}</span>
                      </div>
                      <div className="flex-1">
                        <p>{language.name}</p>
                        <p className="text-xs text-muted-foreground">{t(language.code === 'en' ? 'english' : 'japanese')}</p>
                      </div>
                      {i18n.language === language.code && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-2 w-2 rounded-full bg-primary"
                        />
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-background/60 backdrop-blur-xl border-b border-border/30 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]" 
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Column 1: Logo */}
            <div className="flex-1 flex justify-start">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative"
              >
                <Link to="/" className="flex items-center space-x-2">
                  <motion.span 
                    className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]"
                    animate={{
                      backgroundPosition: ["0%", "100%", "0%"],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  >
                    CPG Matchmaker
                  </motion.span>
                  <motion.div
                    className="absolute -inset-x-6 -inset-y-2 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-xl opacity-50"
                    animate={{
                      opacity: [0.5, 0.3, 0.5],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </Link>
              </motion.div>
            </div>

            {/* Column 2: Main Navigation */}
            <div className="hidden md:flex items-center justify-end ml-auto mr-44 space-x-4">
              {[
                { to: "/", text: t('home') },
                { to: "/products", text: t('products') },
                { to: "/manufacturers", text: t('manufacturers') },
                { to: "/solutions", text: t('solutions') }
              ].map((item, index) => (
                <motion.div
                  key={item.to}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  <Button 
                    variant="ghost" 
                    asChild
                    className="relative overflow-hidden group"
                  >
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={linkVariants}
                    >
                      <Link to={item.to} className="relative z-10">
                        <span className="bg-gradient-to-r from-primary to-accent bg-[length:0%_2px] group-hover:bg-[length:100%_2px] bg-no-repeat bg-left-bottom transition-all duration-500">
                          {item.text}
                        </span>
                      </Link>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                        animate={{ scale: [0.9, 1], opacity: [0, 1] }}
                        exit={{ scale: 0.9, opacity: 0 }}
                      />
                    </motion.div>
                  </Button>
                </motion.div>
              ))}

              {/* Resources Dropdown */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={buttonVariants}
                      className="relative group"
                    >
                      <Button variant="ghost" className="gap-1 relative overflow-hidden">
                        <span className="bg-gradient-to-r from-primary to-accent bg-[length:0%_2px] group-hover:bg-[length:100%_2px] bg-no-repeat bg-left-bottom transition-all duration-500">
                          {t('resources')}
                        </span>
                        <motion.div
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="text-primary z-10 relative"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background/95 dark:bg-background/80 backdrop-blur-md border-border shadow-lg dark:shadow-primary/5">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownMenuItem asChild className="focus:bg-accent hover:bg-accent">
                        <Link to="/blog">{t('blog')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-accent hover:bg-accent">
                        <Link to="/case-studies">{t('case-studies')}</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="focus:bg-accent hover:bg-accent">
                        <Link to="/webinars">{t('webinars')}</Link>
                      </DropdownMenuItem>
                    </motion.div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            </div>

            {/* Column 3: Tools */}
            <div className="hidden md:flex items-center space-x-3 mr-5">
              {/* Search Button - Hidden on Home and Solutions pages */}
              {shouldShowSearch && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSearchPanel}
                  >
                    <Search className="h-4 w-4 text-primary" />
                  </Button>
                </motion.div>
              )}

              {/* Language Switcher - Replace with Enhanced version */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.75 }}
              >
                <EnhancedLanguageSwitcher />
              </motion.div>

              {/* Theme Toggle */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                <ThemeToggle />
              </motion.div>

              {/* Favorites Menu */}
              {isAuthenticated && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                <FavoritesMenu />
              </motion.div>
              )}
            </div>

            {/* Column 4: User Controls */}
            <div className="flex items-center justify-end">
              {/* User Menu */}
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <UserMenuDropdown />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Button asChild variant="default" className="hover:scale-105 transition-transform">
                    <Link to="/auth">{t('sign-in')}</Link>
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="relative group"
              >
                {isOpen ? (
                  <X className="h-6 w-6 text-primary" />
                ) : (
                  <Menu className="h-6 w-6 text-primary" />
                )}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="md:hidden fixed inset-x-0 top-16 bg-background/90 dark:bg-background/80 backdrop-blur-md border-b border-border/50 dark:border-border/30 z-40 shadow-lg dark:shadow-primary/5"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-2">
                {[
                  { to: "/", text: t('home') },
                  { to: "/products", text: t('products') },
                  { to: "/manufacturers", text: t('manufacturers') },
                  { to: "/solutions", text: t('solutions') },
                  { to: "/blog", text: t('blog') },
                  { to: "/case-studies", text: t('case-studies') },
                  { to: "/webinars", text: t('webinars') }
                ].map((item) => (
                  <Button
                    key={item.to}
                    variant="ghost"
                    asChild
                    className="w-full justify-start hover:bg-accent"
                  >
                    <Link to={item.to}>{item.text}</Link>
                  </Button>
                ))}
                
                {/* Language Switcher in Mobile Menu - Enhanced version */}
                <div className="py-3 border-t border-border/30 dark:border-border/20 mt-2">
                  <p className="text-sm text-muted-foreground mb-2">{t('language')}</p>
                  <div className="flex space-x-2">
                    <Button
                      variant={useTranslation().i18n.language === 'en' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => useTranslation().i18n.changeLanguage('en')}
                      className="flex-1 flex items-center gap-2 justify-center group transition-all duration-300"
                    >
                      <motion.div
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-background/80 dark:bg-background/60 shadow-sm border border-border/30 dark:border-border/20 group-hover:scale-110 transition-transform"
                      >
                        <span className="text-base">🇺🇸</span>
                      </motion.div>
                      <span className="text-xs">{t('english')}</span>
                      {useTranslation().i18n.language === 'en' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-1.5 w-1.5 rounded-full bg-background ml-1"
                        />
                      )}
                    </Button>
                    <Button
                      variant={useTranslation().i18n.language === 'ja' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => useTranslation().i18n.changeLanguage('ja')}
                      className="flex-1 flex items-center gap-2 justify-center group transition-all duration-300"
                    >
                      <motion.div
                        className="flex items-center justify-center w-7 h-7 rounded-full bg-background/80 dark:bg-background/60 shadow-sm border border-border/30 dark:border-border/20 group-hover:scale-110 transition-transform"
                      >
                        <span className="text-base">🇯🇵</span>
                      </motion.div>
                      <span className="text-xs">{t('japanese')}</span>
                      {useTranslation().i18n.language === 'ja' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-1.5 w-1.5 rounded-full bg-background ml-1"
                        />
                      )}
                    </Button>
                  </div>
                </div>
                
                {isAuthenticated ? (
                  <div className="space-y-2 border-t border-border/30 dark:border-border/20 pt-3 mt-2">
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start hover:bg-accent"
                    >
                      <Link to="/dashboard">{t('dashboard')}</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start hover:bg-accent"
                    >
                      <Link to="/profile">{t('profile')}</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start hover:bg-accent"
                    >
                      <Link to={`/${user?.role}/settings`}>{t('settings')}</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start text-destructive hover:bg-destructive/10 font-bold"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      {t('logout')}
                    </Button>
                  </div>
                ) : (
                  <Button asChild variant="default" className="w-full mt-2">
                    <Link to="/auth">{t('sign-in')}</Link>
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Panel - Hidden on Home and Solutions pages */}
      <AnimatePresence mode="wait">
        {searchPanelOpen && shouldShowSearch && (
          <div ref={searchPanelRef}>
            <SearchPanel isOpen={searchPanelOpen} onClose={() => setSearchPanelOpen(false)} />
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
