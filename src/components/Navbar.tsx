
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useUser();

  // Handle scroll effect
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

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-background/80 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <span className="font-bold text-xl">CPG Matchmaker</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Button variant="ghost" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/products">Products</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/manufacturers">Manufacturers</Link>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/solutions">Solutions</Link>
              </Button>

              {/* Resources Dropdown Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1">
                    Resources <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/blog">Blog</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/case-studies">Case Studies</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/webinars">Webinars</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Enhanced Search Button */}
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleSearchPanel}
                aria-label="Search"
                className="relative"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="h-4 w-4" />
                      {user?.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
              ) : (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/auth?type=signin">Sign In</Link>
                  </Button>
                  <Button asChild>
                    <Link to="/auth?type=register">Register</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu Button and Search Button */}
            <div className="md:hidden flex items-center gap-2">
              {/* Mobile search button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="focus:outline-none"
                onClick={toggleSearchPanel}
              >
                <Search className="h-5 w-5" />
              </Button>
              
              <button
                className="focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/">Home</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/products">Products</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/manufacturers">Manufacturers</Link>
              </Button>
              <Button variant="ghost" className="w-full justify-start" asChild>
                <Link to="/solutions">Solutions</Link>
              </Button>
              
              {/* Resources Section */}
              <div className="border-t border-border pt-2 mt-2">
                <p className="text-sm text-muted-foreground mb-2 px-3">Resources</p>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/blog">Blog</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/case-studies">Case Studies</Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start" asChild>
                  <Link to="/webinars">Webinars</Link>
                </Button>
              </div>
              
              {/* Auth Buttons for Mobile */}
              <div className="border-t border-border pt-2 mt-2">
                {isAuthenticated ? (
                  <>
                    <p className="text-sm px-3 mb-2">
                      Signed in as <span className="font-medium">{user?.name}</span>
                    </p>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/dashboard">Dashboard</Link>
                    </Button>
                    <Button variant="ghost" className="w-full justify-start" asChild>
                      <Link to="/profile">Profile</Link>
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="w-full justify-start mt-2"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="w-full mb-2" asChild>
                      <Link to="/auth?type=signin">Sign In</Link>
                    </Button>
                    <Button className="w-full" asChild>
                      <Link to="/auth?type=register">Register</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Global Search Panel */}
      <SearchPanel 
        isOpen={searchPanelOpen} 
        onClose={() => setSearchPanelOpen(false)} 
      />
    </>
  );
};

export default Navbar;
