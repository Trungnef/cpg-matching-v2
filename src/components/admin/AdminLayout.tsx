import { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  HelpCircle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);

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
    { name: 'Announcements', path: '/admin/announcements', icon: <Bell className="h-5 w-5" /> },
    { name: 'Activity Log', path: '/admin/activity', icon: <Activity className="h-5 w-5" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'System Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const sidebarVariants = {
    open: { width: 250, transition: { duration: 0.3 } },
    closed: { width: 80, transition: { duration: 0.3 } }
  };

  const mobileMenuVariants = {
    open: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', opacity: 0, transition: { duration: 0.3 } }
  };

  const contentVariants = {
    wide: { marginLeft: 80, transition: { duration: 0.3 } },
    narrow: { marginLeft: 250, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex flex-col">
      {/* Mobile menu toggle */}
      {isMobile && (
        <div className="fixed top-4 left-4 z-50">
          <Button
            size="icon"
            variant="outline"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-full bg-primary text-white border-0 shadow-lg"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
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
              className="fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 flex items-center justify-between border-b dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <h1 className="font-bold text-xl">Admin Panel</h1>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b dark:border-gray-800">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white">
                      A
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{adminUser?.email || 'Admin'}</p>
                    <p className="text-xs text-muted-foreground">System Administrator</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {navigation.map((item) => (
                    <Button
                      key={item.path}
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className={`w-full justify-start mb-1 ${
                        location.pathname === item.path
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                      onClick={() => {
                        navigate(item.path);
                        setMobileMenuOpen(false);
                      }}
                    >
                      <span className="mr-3">{item.icon}</span>
                      {item.name}
                    </Button>
                  ))}
                </nav>

                <div className="pt-4 mt-4 border-t dark:border-gray-800">
                  <Button
                    variant="destructive"
                    className="w-full justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop sidebar */}
      {!isMobile && (
        <motion.div
          className="fixed left-0 top-0 bottom-0 bg-white dark:bg-gray-900 border-r dark:border-gray-800 shadow-sm overflow-hidden z-30"
          variants={sidebarVariants}
          animate={collapsed ? "closed" : "open"}
          initial={collapsed ? "closed" : "open"}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar header */}
            <div className={`p-4 flex items-center ${collapsed ? "justify-center" : "justify-between"} border-b dark:border-gray-800`}>
              {!collapsed && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Shield className="h-6 w-6 text-primary" />
                  <h1 className="font-bold text-xl">Admin Panel</h1>
                </motion.div>
              )}
              {collapsed && (
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  <Shield className="h-6 w-6 text-primary" />
                </motion.div>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setCollapsed(!collapsed)}
                className={collapsed ? "rotate-180" : ""}
              >
                <PanelLeft className="h-5 w-5" />
              </Button>
            </div>

            {/* User info */}
            <div className={`p-4 flex ${collapsed ? "justify-center" : "items-center gap-3"} mb-6 pb-2 border-b dark:border-gray-800`}>
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary text-white">
                  A
                </AvatarFallback>
              </Avatar>
              
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
            </div>

            {/* Navigation */}
            <nav className="space-y-1 px-3 flex-1">
              <TooltipProvider delayDuration={0}>
                {navigation.map((item) => (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <Button
                        variant={location.pathname === item.path ? "default" : "ghost"}
                        className={`w-full justify-${collapsed ? 'center' : 'start'} mb-1 ${
                          location.pathname === item.path
                            ? "bg-primary text-white"
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                        onClick={() => navigate(item.path)}
                      >
                        <span className={collapsed ? '' : 'mr-3'}>{item.icon}</span>
                        {!collapsed && item.name}
                        {!collapsed && location.pathname === item.path && (
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
                    </TooltipTrigger>
                    <TooltipContent side="right" className={collapsed ? 'block' : 'hidden'}>
                      {item.name}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
            
            {/* Bottom actions */}
            <div className={`p-3 pt-2 mt-auto border-t dark:border-gray-800 ${collapsed ? '' : 'space-y-2'}`}>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size={collapsed ? 'icon' : 'default'}
                      className="w-full justify-start"
                      onClick={() => navigate('/admin/profile')}
                    >
                      <UserCog className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
                      {!collapsed && 'Account'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={collapsed ? 'block' : 'hidden'}>
                    Account
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size={collapsed ? 'icon' : 'default'}
                      className="w-full justify-start"
                      onClick={() => navigate('/admin/help')}
                    >
                      <HelpCircle className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
                      {!collapsed && 'Help'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className={collapsed ? 'block' : 'hidden'}>
                    Help
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="destructive"
                      size={collapsed ? 'icon' : 'default'}
                      className="w-full justify-start"
                      onClick={handleLogout}
                    >
                      <LogOut className={`h-5 w-5 ${collapsed ? '' : 'mr-2'}`} />
                      {!collapsed && 'Logout'}
                    </Button>
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
        <div className="min-h-screen bg-gray-100 dark:bg-gray-950 p-4 md:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="container mx-auto"
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