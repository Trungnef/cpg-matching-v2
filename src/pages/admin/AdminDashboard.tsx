import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { 
  Users, 
  Bell,
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Eye, 
  Activity,
  AlertCircle,
  ShieldCheck,
  Building2,
  BadgeCheck,
  MoonStar,
  SunMedium,
  PlusCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';

// Mock data for analytics
const analyticsData = {
  totalUsers: 1243,
  activeUsers: 876,
  pendingApprovals: 32,
  systemAlerts: 8,
  userGrowth: 12.5,
  roleDistribution: {
    manufacturers: 428,
    brands: 356,
    retailers: 459
  },
  activeAnnouncements: 24,
  recentActivity: [
    { id: 1, user: 'John Doe', action: 'Updated profile information', time: '12 minutes ago', role: 'Manufacturer' },
    { id: 2, user: 'Alice Smith', action: 'Created new product listing', time: '1 hour ago', role: 'Brand' },
    { id: 3, user: 'Robert Wilson', action: 'Approved retailer application', time: '2 hours ago', role: 'Admin' },
    { id: 4, user: 'Emily Jackson', action: 'Generated monthly report', time: '3 hours ago', role: 'Retailer' },
    { id: 5, user: 'Michael Chen', action: 'Updated system settings', time: '5 hours ago', role: 'Admin' }
  ],
  pendingRequests: [
    { id: 1, user: 'Green Foods Corp', type: 'Manufacturer Verification', submitted: '2 days ago', priority: 'high' },
    { id: 2, user: 'Healthy Harvest', type: 'Brand Registration', submitted: '1 day ago', priority: 'medium' },
    { id: 3, user: 'Fresh Choice Markets', type: 'Retailer Application', submitted: '3 days ago', priority: 'low' },
    { id: 4, user: 'Organic Essentials', type: 'Certification Update', submitted: '6 hours ago', priority: 'high' }
  ]
};

const roleIcons = {
  Manufacturer: <Building2 className="h-4 w-4 text-blue-500" />,
  Brand: <BadgeCheck className="h-4 w-4 text-purple-500" />,
  Retailer: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
  Admin: <ShieldCheck className="h-4 w-4 text-amber-500" />
};

const priorityClasses = {
  high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  low: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
};

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(analyticsData);
  const [activeTab, setActiveTab] = useState("overview");
  const prefersReducedMotion = useReducedMotion();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const loadingVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "linear"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    })
  };

  const pulseVariant = {
    initial: { scale: 1 },
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut"
      }
    }
  };

  const tabSwitchVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: "spring",
        stiffness: 500,
        damping: 30,
        duration: 0.3
      }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { 
        duration: 0.2
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          className="relative h-16 w-16"
        >
          <motion.div
            variants={loadingVariants}
            animate="animate"
            className="absolute top-0 left-0 w-full h-full border-4 border-primary border-t-transparent rounded-full"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center text-primary font-semibold text-sm"
          >
            Loading
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ 
            duration: 0.5,
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
        >
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400' : 'text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70'}`}>Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of system metrics and activities
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center space-x-2 mt-4 md:mt-0"
        >
          <Button variant="outline" size="sm" className={`h-9 group ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}>
            <motion.span 
              className="mr-2"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Clock className="h-4 w-4 group-hover:text-primary transition-colors" />
            </motion.span>
            Last updated: Today at 09:45 AM
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className={`h-9 relative overflow-hidden group ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white'}`}
            onClick={toggleTheme}
          >
            <motion.span
              className="absolute inset-0 bg-primary/10 rounded-md"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
            <motion.div
              initial={{ y: 0 }}
              animate={{ y: [0, -20, 20, 0] }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mr-2 relative z-10"
            >
              {isDark ? (
                <MoonStar className="h-4 w-4 text-blue-400" />
              ) : (
                <SunMedium className="h-4 w-4 text-amber-500" />
              )}
            </motion.div>
            <span className="relative z-10">{isDark ? 'Dark Mode' : 'Light Mode'}</span>
          </Button>
        </motion.div>
      </div>

      {/* Key metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className={`border-l-4 border-l-primary transition-all duration-300 hover:shadow-md hover:shadow-primary/10 ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Users className="h-4 w-4 text-primary" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.userGrowth > 0 ? (
                  <span className="text-emerald-500 flex items-center">
                    <motion.span 
                      animate={{ x: [0, 2, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <TrendingUp className="mr-1 h-3 w-3" />
                    </motion.span>
                    {stats.userGrowth}% increase from last month
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center">
                    <motion.span 
                      animate={{ x: [0, 2, 0] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    >
                      <TrendingDown className="mr-1 h-3 w-3" />
                    </motion.span>
                    {Math.abs(stats.userGrowth)}% decrease from last month
                  </span>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className={`border-l-4 border-l-blue-400 transition-all duration-300 hover:shadow-md hover:shadow-blue-400/10 ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <motion.div
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Activity className="h-4 w-4 text-blue-400" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <div className="mt-2">
                <Progress value={(stats.activeUsers / stats.totalUsers) * 100} className={`h-2 ${isDark ? 'bg-blue-950/40' : 'bg-blue-100'}`}>
                  <motion.div 
                    className="h-full bg-blue-400 rounded-full" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${(stats.activeUsers / stats.totalUsers) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </Progress>
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% of total users
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className={`border-l-4 border-l-amber-400 transition-all duration-300 hover:shadow-md hover:shadow-amber-400/10 ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <motion.div
                variants={pulseVariant}
                initial="initial"
                animate={stats.pendingApprovals > 20 ? "pulse" : "initial"}
              >
                <AlertCircle className="h-4 w-4 text-amber-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingApprovals > 20 ? (
                  <motion.span 
                    className="text-amber-500 inline-flex items-center"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    Requires attention
                  </motion.span>
                ) : (
                  <span className="text-emerald-500">Within normal range</span>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          custom={3}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <Card className={`border-l-4 border-l-red-400 transition-all duration-300 hover:shadow-md hover:shadow-red-400/10 ${isDark ? 'bg-gray-800/50' : 'bg-white'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
              <motion.div
                variants={pulseVariant}
                initial="initial"
                animate={stats.systemAlerts > 5 ? "pulse" : "initial"}
              >
                <Bell className="h-4 w-4 text-red-500" />
              </motion.div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemAlerts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.systemAlerts > 5 ? (
                  <motion.span 
                    className="text-red-500 inline-flex items-center"
                    initial={{ opacity: 0.8 }}
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Critical - Action required
                  </motion.span>
                ) : (
                  <span className="text-emerald-500">System operating normally</span>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs 
        defaultValue="overview" 
        className="space-y-4"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className={`grid grid-cols-3 w-full max-w-md relative ${isDark ? 'bg-gray-800/50' : 'bg-gray-100/50'}`}>
          <motion.div 
            className="absolute bottom-0 h-[2px] bg-primary rounded-full"
            initial={false}
            animate={{ 
              left: activeTab === "overview" ? "0%" : activeTab === "activity" ? "33.33%" : "66.66%",
              width: "33.33%"
            }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
          <TabsTrigger 
            value="overview" 
            className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="activity" 
            className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Activity
          </TabsTrigger>
          <TabsTrigger 
            value="pending" 
            className="relative z-10 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none"
          >
            Pending
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              variants={tabSwitchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TabsContent value="overview" className="m-0" forceMount>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <motion.div
                    custom={4}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    className="md:col-span-2"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className={`h-full border-t-4 ${isDark ? 'border-t-primary/40 bg-gray-800/50' : 'border-t-primary/20 bg-white'} transition-all hover:shadow-md`}>
                      <CardHeader>
                        <CardTitle>Users by Role</CardTitle>
                        <CardDescription>Current distribution of registered users</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Building2 className="h-4 w-4 text-blue-500 mr-2" />
                                <span className="text-sm font-medium">Manufacturers</span>
                              </div>
                              <span className="text-sm">{stats.roleDistribution.manufacturers}</span>
                            </div>
                            <Progress value={(stats.roleDistribution.manufacturers / stats.totalUsers) * 100} className={`h-2 ${isDark ? 'bg-blue-950/40' : 'bg-blue-100'}`}>
                              <motion.div 
                                className="h-full bg-blue-500 rounded-full" 
                                initial={{ width: "0%" }}
                                animate={{ width: `${(stats.roleDistribution.manufacturers / stats.totalUsers) * 100}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </Progress>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <BadgeCheck className="h-4 w-4 text-purple-500 mr-2" />
                                <span className="text-sm font-medium">Brands</span>
                              </div>
                              <span className="text-sm">{stats.roleDistribution.brands}</span>
                            </div>
                            <Progress value={(stats.roleDistribution.brands / stats.totalUsers) * 100} className={`h-2 ${isDark ? 'bg-purple-950/40' : 'bg-purple-100'}`}>
                              <motion.div 
                                className="h-full bg-purple-500 rounded-full" 
                                initial={{ width: "0%" }}
                                animate={{ width: `${(stats.roleDistribution.brands / stats.totalUsers) * 100}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                              />
                            </Progress>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <ShieldCheck className="h-4 w-4 text-emerald-500 mr-2" />
                                <span className="text-sm font-medium">Retailers</span>
                              </div>
                              <span className="text-sm">{stats.roleDistribution.retailers}</span>
                            </div>
                            <Progress value={(stats.roleDistribution.retailers / stats.totalUsers) * 100} className={`h-2 ${isDark ? 'bg-emerald-950/40' : 'bg-emerald-100'}`}>
                              <motion.div 
                                className="h-full bg-emerald-500 rounded-full" 
                                initial={{ width: "0%" }}
                                animate={{ width: `${(stats.roleDistribution.retailers / stats.totalUsers) * 100}%` }}
                                transition={{ duration: 1, delay: 0.4 }}
                              />
                            </Progress>
                          </div>
                        </div>
                        
                        <div className={`mt-6 pt-6 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between">
                            <CardDescription>Active Announcements</CardDescription>
                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                              {stats.activeAnnouncements}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <Button variant="outline" size="sm" className={`h-8 text-xs group ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200'}`}>
                              <motion.span 
                                className="inline-block mr-1"
                                whileHover={{ rotate: [0, -10, 0] }}
                                transition={{ duration: 0.5 }}
                              >
                                <Bell className="h-3 w-3 inline group-hover:text-primary transition-colors" />
                              </motion.span>
                              Manage Announcements
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 text-xs group">
                              <motion.span 
                                className="inline-block mr-1"
                                whileHover={{ scale: 1.2 }}
                                transition={{ duration: 0.2 }}
                              >
                                <PlusCircle className="h-3 w-3 inline group-hover:text-primary transition-colors" />
                              </motion.span>
                              Create New
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    custom={5}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  >
                    <Card className={`h-full border-t-4 ${isDark ? 'border-t-emerald-500/40 bg-gray-800/50' : 'border-t-emerald-500/20 bg-white'} transition-all hover:shadow-md`}>
                      <CardHeader>
                        <CardTitle>System Status</CardTitle>
                        <CardDescription>All services operational</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">API Services</span>
                            <Badge variant="outline" className={`${isDark ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200'} hover:bg-emerald-100`}>
                              Operational
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Database</span>
                            <Badge variant="outline" className={`${isDark ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200'} hover:bg-emerald-100`}>
                              Operational
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Authentication</span>
                            <Badge variant="outline" className={`${isDark ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200'} hover:bg-emerald-100`}>
                              Operational
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Notification Service</span>
                            <Badge variant="outline" className={`${isDark ? 'bg-amber-900/30 text-amber-400 border-amber-800' : 'bg-amber-100 text-amber-800 border-amber-200'} hover:bg-amber-100`}>
                              Degraded
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Storage Service</span>
                            <Badge variant="outline" className={`${isDark ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' : 'bg-emerald-100 text-emerald-800 border-emerald-200'} hover:bg-emerald-100`}>
                              Operational
                            </Badge>
                          </div>
                        </div>
                        
                        <Button size="sm" className="w-full mt-6 group overflow-hidden relative">
                          <motion.div
                            className="absolute inset-0 bg-primary/10"
                            initial={{ x: "-100%" }}
                            whileHover={{ x: "0%" }}
                            transition={{ duration: 0.3 }}
                          />
                          <span className="relative z-10">View Detailed Status</span>
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "activity" && (
            <motion.div
              key="activity"
              variants={tabSwitchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TabsContent value="activity" className="m-0" forceMount>
                <motion.div
                  custom={6}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className={`border-t-4 ${isDark ? 'border-t-blue-400/40 bg-gray-800/50' : 'border-t-blue-400/20 bg-white'} transition-all hover:shadow-md`}>
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest actions performed in the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {stats.recentActivity.map((activity, index) => (
                          <div 
                            key={activity.id}
                            className={`flex items-start space-x-4 pb-4 border-b last:border-0 last:pb-0 ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={`https://avatars.dicebear.com/api/initials/${activity.user.replace(/\s+/g, '')}.svg`} />
                              <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-medium leading-none">{activity.user}</p>
                                <div className="flex items-center">
                                  {roleIcons[activity.role as keyof typeof roleIcons]}
                                  <span className="text-xs text-muted-foreground ml-1">{activity.time}</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground">{activity.action}</p>
                              <Badge variant="secondary" className="text-xs mt-1">{activity.role}</Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "pending" && (
            <motion.div
              key="pending"
              variants={tabSwitchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <TabsContent value="pending" className="m-0" forceMount>
                <motion.div
                  custom={7}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className={`border-t-4 ${isDark ? 'border-t-amber-400/40 bg-gray-800/50' : 'border-t-amber-400/20 bg-white'} transition-all hover:shadow-md`}>
                    <CardHeader>
                      <CardTitle>Pending Requests</CardTitle>
                      <CardDescription>Awaiting admin approval or review</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className={`rounded-md border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className={`grid grid-cols-5 gap-4 p-4 text-sm font-medium ${isDark ? 'bg-gray-800/70' : 'bg-gray-50/80'}`}>
                          <div>User/Company</div>
                          <div>Request Type</div>
                          <div>Submitted</div>
                          <div>Priority</div>
                          <div className="text-right">Action</div>
                        </div>
                        {stats.pendingRequests.map((request) => (
                          <div 
                            key={request.id}
                            className={`grid grid-cols-5 gap-4 p-4 items-center border-t text-sm ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                          >
                            <div className="font-medium">{request.user}</div>
                            <div>{request.type}</div>
                            <div className="text-muted-foreground">{request.submitted}</div>
                            <div>
                              <Badge className={priorityClasses[request.priority as keyof typeof priorityClasses]}>
                                {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                              </Badge>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button size="sm" variant="outline" className={`h-8 ${isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200'}`}>
                                Review
                              </Button>
                              <Button size="sm" className="h-8">
                                Approve
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between mt-4">
                        <Button variant="outline" className={isDark ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200'}>View All Requests</Button>
                        <Button variant="default">Batch Process</Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 