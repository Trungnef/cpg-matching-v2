import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/contexts/UserContext";
import SearchPanel from "./SearchPanel";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import FavoritesMenu from "./FavoritesMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useUser();

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
            {/* Enhanced Logo with animation */}
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

            {/* Desktop Navigation with enhanced styling */}
            <div className="hidden md:flex items-center space-x-2">
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

              {/* Enhanced Resources Dropdown */}
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
                  <DropdownMenuContent className="bg-background/80 backdrop-blur-xl border-white/10">
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {[
                        { to: "/blog", text: "Blog" },
                        { to: "/case-studies", text: "Case Studies" },
                        { to: "/webinars", text: "Webinars" }
                      ].map((item, index) => (
                        <DropdownMenuItem 
                          key={item.to} 
                          asChild
                          className="hover:bg-gradient-to-r hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
                        >
                          <Link to={item.to}>{item.text}</Link>
                  </DropdownMenuItem>
                      ))}
                    </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
              </motion.div>
              
              {/* Theme and Favorite Icons */}
              <div className="flex items-center gap-1">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ThemeToggle />
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FavoritesMenu />
                </motion.div>

                {/* Enhanced Search Button */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.75 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={toggleSearchPanel}
                    aria-label="Search"
                    className="relative group hover:bg-transparent"
                  >
                    <motion.div
                      animate={{
                        rotate: searchPanelOpen ? 90 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10"
                    >
                      <motion.div
                        className="relative"
                        whileHover={{
                          scale: 1.1,
                        }}
                      >
                        <Search className="h-5 w-5 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300" />
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300"
                        />
                      </motion.div>
                    </motion.div>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-300"
                    />
                  </Button>
                </motion.div>
              </div>
            </div>

            {/* Enhanced Auth Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                      <motion.div
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                      >
                        <Button 
                          variant="ghost" 
                          className="gap-2 relative group overflow-hidden bg-gradient-to-r hover:from-primary/20 hover:to-accent/20"
                        >
                          <User className="h-4 w-4 text-primary" />
                          <span className="bg-gradient-to-r from-primary to-accent bg-[length:0%_2px] group-hover:bg-[length:100%_2px] bg-no-repeat bg-left-bottom transition-all duration-500">
                      {user?.name}
                          </span>
                    </Button>
                      </motion.div>
                  </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end"
                      className="bg-background/80 backdrop-blur-xl border-white/10"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2 }}
                      >
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
                      </motion.div>
                  </DropdownMenuContent>
                </DropdownMenu>
                </motion.div>
              ) : (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button 
                      variant="ghost" 
                      asChild
                      className="relative group overflow-hidden"
                    >
                      <Link to="/auth?type=signin">
                        <span className="relative z-10 bg-gradient-to-r from-primary to-accent bg-[length:0%_2px] group-hover:bg-[length:100%_2px] bg-no-repeat bg-left-bottom transition-all duration-500">
                          Sign In
                        </span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </Link>
                  </Button>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                    whileHover="hover"
                    whileTap="tap"
                    variants={buttonVariants}
                  >
                    <Button 
                      asChild
                      className="relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
                    >
                      <Link to="/auth?type=register">
                        <span className="relative z-10">Register</span>
                        <motion.div
                          className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                        />
                      </Link>
                  </Button>
                  </motion.div>
                </>
              )}
            </div>

            {/* Mobile Menu Button with animation */}
            <div className="md:hidden flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ThemeToggle />
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <FavoritesMenu />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="focus:outline-none relative group hover:bg-transparent"
                  onClick={toggleSearchPanel}
                >
                  <motion.div
                    className="relative z-10"
                  >
                    <motion.div
                      className="relative"
                      whileHover={{
                        scale: 1.1,
                      }}
                    >
                      <Search className="h-5 w-5 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300" />
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 blur-sm transition-all duration-300"
                      />
                    </motion.div>
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-all duration-300"
                  />
                </Button>
              </motion.div>
              
              <motion.button
                className="focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 180, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                  <X className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 180, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -180, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                  <Menu className="h-6 w-6" />
                    </motion.div>
                )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with animation */}
        <AnimatePresence>
        {isOpen && (
            <motion.div 
              className="md:hidden bg-background/95 backdrop-blur-sm"
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
            >
              <motion.div 
                className="container mx-auto px-4 py-4 space-y-2"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {[
                  { to: "/", text: "Home" },
                  { to: "/products", text: "Products" },
                  { to: "/manufacturers", text: "Manufacturers" },
                  { to: "/solutions", text: "Solutions" }
                ].map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 10 }}
                  >
              <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to={item.to}>{item.text}</Link>
              </Button>
                  </motion.div>
                ))}
              
                {/* Resources Section */}
                <motion.div 
                  className="border-t border-border pt-2 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                <p className="text-sm text-muted-foreground mb-2 px-3">Resources</p>
                  {[
                    { to: "/blog", text: "Blog" },
                    { to: "/case-studies", text: "Case Studies" },
                    { to: "/webinars", text: "Webinars" }
                  ].map((item, index) => (
                    <motion.div
                      key={item.to}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      whileHover={{ x: 10 }}
                    >
                <Button variant="ghost" className="w-full justify-start" asChild>
                        <Link to={item.to}>{item.text}</Link>
                </Button>
                    </motion.div>
                  ))}
                </motion.div>
              
                {/* Auth Buttons for Mobile */}
                <motion.div 
                  className="border-t border-border pt-2 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                {isAuthenticated ? (
                  <>
                      <motion.p 
                        className="text-sm px-3 mb-2"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                      Signed in as <span className="font-medium">{user?.name}</span>
                      </motion.p>
                      {[
                        { to: "/dashboard", text: "Dashboard" },
                        { to: "/profile", text: "Profile" }
                      ].map((item, index) => (
                        <motion.div
                          key={item.to}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          whileHover={{ x: 10 }}
                        >
                    <Button variant="ghost" className="w-full justify-start" asChild>
                            <Link to={item.to}>{item.text}</Link>
                    </Button>
                        </motion.div>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start mt-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                      </motion.div>
                  </>
                ) : (
                  <>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                      >
                    <Button variant="outline" className="w-full mb-2" asChild>
                      <Link to="/auth?type=signin">Sign In</Link>
                    </Button>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        whileHover={{ scale: 1.02 }}
                      >
                        <Button 
                          className="w-full bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300" 
                          asChild
                        >
                      <Link to="/auth?type=register">Register</Link>
                    </Button>
                      </motion.div>
                  </>
                )}
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Global Search Panel */}
      <SearchPanel 
        isOpen={searchPanelOpen} 
        onClose={() => setSearchPanelOpen(false)} 
      />
    </>
  );
};

export default Navbar;
