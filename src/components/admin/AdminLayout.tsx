import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Layers,
  Activity,
  PanelLeft,
  UserCog,
  HelpCircle,
  ChevronLeft
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const prefersReducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Check authentication
  useEffect(() => {
    const adminAuth = localStorage.getItem('adminAuth');
    const adminUserData = localStorage.getItem('adminUser');
    
    if (adminAuth === 'true' && adminUserData) {
      setIsAuthenticated(true);
      setAdminUser(JSON.parse(adminUserData));
    } else {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Handle responsive changes
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 1024);
      if (width >= 1024) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <Layers className="h-5 w-5" /> },
    { name: 'User Management', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
    // { name: 'Announcements', path: '/admin/announcements', icon: <Bell className="h-5 w-5" /> },
    { name: 'Activity Log', path: '/admin/activity', icon: <Activity className="h-5 w-5" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
    // { name: 'System Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const sidebarVariants = {
    open: { 
      width: 250,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      } 
    },
    closed: { 
      width: 80,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 40,
        duration: 0.3
      } 
    }
  };

  const mobileMenuVariants = {
    open: { 
      x: 0, 
      opacity: 1,
      transition: { 
        type: 'spring', 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.07,
        delayChildren: 0.1
      } 
    },
    closed: { 
      x: '-100%', 
      opacity: 0,
      transition: { 
        type: 'spring',
        stiffness: 500,
        damping: 50, 
        staggerChildren: 0.05,
        staggerDirection: -1
      } 
    }
  };

  const contentVariants = {
    wide: { 
      marginLeft: 80,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      } 
    },
    narrow: { 
      marginLeft: 250,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.4
      } 
    }
  };

  const itemVariants = {
    open: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    closed: { 
      opacity: 0, 
      y: 20,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  const navItemVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.03,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.97,
      transition: { duration: 0.1 }
    },
    active: {
      scale: 1.03,
      transition: { duration: 0.2 }
    }
  };

  // Toggle sidebar collapse button
  const SidebarCollapseButton = () => (
    <motion.div
      className="relative py-3 flex justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Button
        size="icon"
        variant="secondary"
        onClick={() => setCollapsed(!collapsed)}
        className={`rounded-full h-10 w-10 shadow-md border ${
          isDark 
            ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:border-primary/50' 
            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-primary/50'
        }`}
      >
        <motion.div
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </motion.div>
      </Button>
    </motion.div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} flex flex-col`}>
      {/* Mobile menu toggle */}
      {isMobile && (
        <motion.div 
          className="fixed top-4 left-4 z-50"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Button
            size="icon"
            variant="outline"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`rounded-full ${isDark ? 'bg-primary text-white' : 'bg-primary text-white'} border-0 shadow-lg hover:shadow-primary/25 transition-all`}
          >
            <motion.div
              animate={{
                rotate: mobileMenuOpen ? 180 : 0
              }}
              transition={{ duration: 0.3 }}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>
        </motion.div>
      )}

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={mobileMenuVariants}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              className={`fixed left-0 top-0 bottom-0 w-64 ${isDark ? 'bg-gray-900' : 'bg-white'} shadow-2xl overflow-y-auto no-scrollbar`}
              onClick={(e) => e.stopPropagation()}
              variants={itemVariants}
            >
              <div className={`p-4 flex items-center justify-between border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  <Shield className="h-6 w-6 text-primary" />
                  <h1 className="font-bold text-xl">Admin Panel</h1>
                </motion.div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="p-4">
                <motion.div 
                  className={`flex items-center gap-3 mb-8 pb-4 border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                >
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarFallback className="bg-primary text-white">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{adminUser?.email || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">System Administrator</p>
                  </div>
                </motion.div>

                <nav className="space-y-1">
                  {navigation.map((item, index) => (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.08, duration: 0.3 }}
                      whileHover="hover"
                      whileTap="tap"
                      variants={navItemVariants}
                    >
                      <Button
                        variant={location.pathname === item.path ? "default" : "ghost"}
                        className={`w-full justify-start mb-1 ${
                          location.pathname === item.path
                            ? "bg-primary text-white shadow-md shadow-primary/20"
                            : isDark ? "text-gray-300" : "text-gray-700"
                        }`}
                        onClick={() => {
                          navigate(item.path);
                          setMobileMenuOpen(false);
                        }}
                      >
                        <span className="mr-3">{item.icon}</span>
                        {item.name}
                      </Button>
                    </motion.div>
                  ))}
                </nav>

                <motion.div 
                  className={`pt-4 mt-4 border-t ${isDark ? 'border-gray-800' : 'border-gray-200'}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                >
                  <Button
                    variant="destructive"
                    className="w-full justify-start group"
                    onClick={handleLogout}
                  >
                    <motion.div
                      className="mr-3 group-hover:rotate-12"
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <LogOut className="h-5 w-5" />
                    </motion.div>
                    Logout
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      {!isMobile && (
        <motion.div
          className={`fixed left-0 top-0 bottom-0 ${isDark ? 'bg-gray-900' : 'bg-white'} border-r ${isDark ? 'border-gray-800' : 'border-gray-200'} shadow-sm overflow-hidden z-30`}
          variants={sidebarVariants}
          animate={collapsed ? "closed" : "open"}
          initial={collapsed ? "closed" : "open"}
          layout
        >
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "justify-between"} border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <AnimatePresence mode="wait">
                {!collapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2"
                  >
                    <Shield className="h-6 w-6 text-primary" />
                    <h1 className="font-bold text-xl">Admin Panel</h1>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {collapsed && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center"
                >
                  <Shield className="h-6 w-6 text-primary" />
                </motion.div>
              )}
            </div>

            {/* User info */}
            <div className={`p-4 flex ${collapsed ? "justify-center" : "items-center gap-3"} mb-6 ${collapsed ? "pb-0" : "pb-2"} border-b ${isDark ? 'border-gray-800' : 'border-gray-200'}`}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                  <AvatarFallback className="bg-primary text-white">
                    A
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              
              <AnimatePresence>
                {!collapsed && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="font-medium truncate max-w-[160px]">{adminUser?.email || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">System Administrator</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 px-3 flex-1">
              <TooltipProvider delayDuration={0}>
                {navigation.map((item, index) => {
                  const isActive = location.pathname === item.path;
                  
                  return (
                    <Tooltip key={item.path}>
                      <TooltipTrigger asChild>
                        <motion.div
                          whileHover="hover"
                          whileTap="tap"
                          variants={navItemVariants}
                          animate={isActive ? "active" : "initial"}
                        >
                          <Button
                            variant={isActive ? "default" : "ghost"}
                            className={`w-full ${collapsed ? "h-10 p-0 justify-center" : "justify-start"} mb-1 ${
                              isActive
                                ? "bg-primary text-white shadow-md shadow-primary/20"
                                : isDark 
                                  ? "text-gray-300 hover:bg-gray-800" 
                                  : "text-gray-700 hover:bg-gray-100"
                            } transition-all duration-300`}
                            onClick={() => navigate(item.path)}
                          >
                            <motion.span 
                              className={collapsed ? '' : 'mr-3'}
                              animate={isActive ? { 
                                scale: [1, 1.2, 1],
                                transition: { duration: 0.4 }
                              } : {}}
                            >
                              {item.icon}
                            </motion.span>
                            
                            <AnimatePresence>
                              {!collapsed && (
                                <motion.span
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -10 }}
                                  transition={{ duration: 0.3 }}
                                >
                                  {item.name}
                                </motion.span>
                              )}
                            </AnimatePresence>
                            
                            {!collapsed && isActive && (
                              <motion.div
                                className="ml-auto"
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                              >
                                <ChevronRight className="h-4 w-4" />
                              </motion.div>
                            )}
                          </Button>
                        </motion.div>
                      </TooltipTrigger>
                      <TooltipContent side="right" className={collapsed ? 'block' : 'hidden'}>
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
            </nav>
            
            {/* Sidebar collapse button in the middle of the sidebar */}
            <SidebarCollapseButton />
            
            {/* Bottom actions */}
            <div className={`p-3 pt-2 mt-auto border-t ${isDark ? 'border-gray-800' : 'border-gray-200'} ${collapsed ? 'grid grid-cols-1 gap-3' : 'space-y-2'}`}>
              <TooltipProvider delayDuration={0}>
                {/* <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={navItemVariants}
                      className={collapsed ? "flex justify-center" : ""}
                    >
                      <Button
                        variant="outline"
                        size={collapsed ? 'icon' : 'default'}
                        className={`${collapsed ? "h-10 w-10 p-0" : "w-full justify-start"} group`}
                        onClick={() => navigate('/admin/profile')}
                      >
                        <motion.span 
                          className={`${collapsed ? '' : 'mr-2'} group-hover:text-primary`}
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <UserCog className="h-5 w-5" />
                        </motion.span>
                        {!collapsed && 'Account'}
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={collapsed ? 'block' : 'hidden'}>
                    Account
                  </TooltipContent>
                </Tooltip> */}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={navItemVariants}
                      className={collapsed ? "flex justify-center" : ""}
                    >
                      <Button
                        variant="outline"
                        size={collapsed ? 'icon' : 'default'}
                        className={`${collapsed ? "h-10 w-10 p-0" : "w-full justify-start"} group`}
                        onClick={() => navigate('/admin/settings')}
                      >
                        <motion.span 
                          className={`${collapsed ? '' : 'mr-2'} group-hover:text-primary`}
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Settings className="h-5 w-5" />
                        </motion.span>
                        {!collapsed && 'Settings'}
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={collapsed ? 'block' : 'hidden'}>
                    Settings
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={navItemVariants}
                      className={collapsed ? "flex justify-center" : ""}
                    >
                      <Button
                        variant="outline"
                        size={collapsed ? 'icon' : 'default'}
                        className={`${collapsed ? "h-10 w-10 p-0" : "w-full justify-start"} group`}
                        onClick={() => navigate('/admin/help')}
                      >
                        <motion.span 
                          className={`${collapsed ? '' : 'mr-2'} group-hover:text-primary`}
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <HelpCircle className="h-5 w-5" />
                        </motion.span>
                        {!collapsed && 'Help'}
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={collapsed ? 'block' : 'hidden'}>
                    Help
                  </TooltipContent>
                </Tooltip>

                {/* ThemeToggle is commented out */}

                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      whileHover="hover"
                      whileTap="tap"
                      variants={navItemVariants}
                      className={collapsed ? "flex justify-center" : ""}
                    >
                      <Button
                        variant="destructive"
                        size={collapsed ? 'icon' : 'default'}
                        className={`${collapsed ? "h-10 w-10 p-0" : "w-full justify-start"} group`}
                        onClick={handleLogout}
                      >
                        <motion.span 
                          className={collapsed ? '' : 'mr-2'}
                          whileHover={{ rotate: 12 }}
                          transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        >
                          <LogOut className="h-5 w-5" />
                        </motion.span>
                        {!collapsed && 'Logout'}
                      </Button>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={collapsed ? 'block' : 'hidden'}>
                    Logout
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <motion.main
        className={`flex-1 ${!isMobile ? 'ml-[250px]' : 'ml-0'} transition-all duration-300`}
        variants={contentVariants}
        animate={isMobile ? "wide" : (collapsed ? "wide" : "narrow")}
      >
        <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} p-4 md:p-6 lg:p-8 w-full`}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ 
                duration: prefersReducedMotion ? 0.1 : 0.3,
                type: "spring",
                stiffness: 260,
                damping: 20
              }}
              className="w-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLayout; 