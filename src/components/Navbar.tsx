import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, Search, Check, CircleEllipsis, Clock } from "lucide-react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const searchPanelRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, updateUserStatus } = useUser();

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

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={navVariants}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          scrolled 
            ? "bg-background/60 backdrop-blur-xl border-b border-white/10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]" 
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
                { to: "/", text: "Home" },
                { to: "/products", text: "Products" },
                { to: "/manufacturers", text: "Manufacturers" },
                { to: "/solutions", text: "Solutions" }
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
                          Resources
                        </span>
                        <motion.div
                          animate={{ rotate: [0, 180, 360] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                          className="text-primary"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </motion.div>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background/80 backdrop-blur-xl border-white/10">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <DropdownMenuItem asChild>
                        <Link to="/blog">Blog</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/case-studies">Case Studies</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/webinars">Webinars</Link>
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
                    className="relative group"
                  >
                    <Search className="h-4 w-4 text-primary" />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"
                    />
                  </Button>
                </motion.div>
              )}

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2 relative p-0 h-9 w-9 rounded-full">
                        <div className="relative flex items-center justify-center w-full h-full">
                          <Avatar>
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-background ${
                            user?.status === "online" 
                              ? "bg-green-500" 
                              : user?.status === "away" 
                              ? "bg-yellow-500" 
                              : "bg-red-500"}`}
                          />
                        </div>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <div className="flex items-center p-2">
                        <div className="flex items-center flex-1 space-x-2">
                          <Avatar>
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex flex-col space-y-0.5">
                            <p className="text-sm font-medium">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">{user?.email}</p>
                          </div>
                        </div>
                      </div>
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>
                          <div className="flex items-center space-x-2">
                            <CircleEllipsis className="w-4 h-4" />
                            <span>Status</span>
                          </div>
                        </DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                          <DropdownMenuSubContent>
                            <DropdownMenuRadioGroup value={user?.status} onValueChange={updateUserStatus}>
                              <DropdownMenuRadioItem value="online">
                                <div className="flex items-center space-x-2">
                                  <Check className="w-4 h-4 text-green-500" />
                                  <span>Online</span>
                                </div>
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="away">
                                <div className="flex items-center space-x-2">
                                  <Clock className="w-4 h-4 text-yellow-500" />
                                  <span>Away</span>
                                </div>
                              </DropdownMenuRadioItem>
                              <DropdownMenuRadioItem value="offline">
                                <div className="flex items-center space-x-2">
                                  <CircleEllipsis className="w-4 h-4 text-red-500" />
                                  <span>Offline</span>
                                </div>
                              </DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <Button asChild variant="default">
                    <Link to="/auth">Sign In</Link>
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
            className="md:hidden fixed inset-x-0 top-16 bg-background/80 backdrop-blur-xl border-b border-white/10 z-40"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex flex-col space-y-4">
                {[
                  { to: "/", text: "Home" },
                  { to: "/products", text: "Products" },
                  { to: "/manufacturers", text: "Manufacturers" },
                  { to: "/solutions", text: "Solutions" },
                  { to: "/blog", text: "Blog" },
                  { to: "/case-studies", text: "Case Studies" },
                  { to: "/webinars", text: "Webinars" }
                ].map((item) => (
                  <Button
                    key={item.to}
                    variant="ghost"
                    asChild
                    className="w-full justify-start"
                  >
                    <Link to={item.to}>{item.text}</Link>
                  </Button>
                ))}
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start"
                    >
                      <Link to="/profile">Profile</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleLogout}
                      className="w-full justify-start"
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <Button asChild variant="default" className="w-full">
                    <Link to="/auth">Sign In</Link>
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
