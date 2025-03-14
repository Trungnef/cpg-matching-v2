import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  BadgeCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

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

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
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
          <Button variant="outline" size="sm" className="h-9">
            <Clock className="mr-2 h-4 w-4" />
            Last updated: Today at 09:45 AM
          </Button>
          <Button size="sm" className="h-9">
            <Eye className="mr-2 h-4 w-4" />
            View System Status
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
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                {stats.userGrowth > 0 ? (
                  <span className="text-emerald-500 flex items-center">
                    <TrendingUp className="mr-1 h-3 w-3" />
                    {stats.userGrowth}% increase from last month
                  </span>
                ) : (
                  <span className="text-red-500 flex items-center">
                    <TrendingDown className="mr-1 h-3 w-3" />
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
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
              <div className="mt-2">
                <Progress value={(stats.activeUsers / stats.totalUsers) * 100} className="h-2" />
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
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <AlertCircle className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
              <p className="text-xs text-muted-foreground">
                {stats.pendingApprovals > 20 ? (
                  <span className="text-amber-500">Requires attention</span>
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
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">System Alerts</CardTitle>
              <Bell className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.systemAlerts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.systemAlerts > 5 ? (
                  <span className="text-red-500">Critical - Action required</span>
                ) : (
                  <span className="text-emerald-500">System operating normally</span>
                )}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dashboard Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              custom={4}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              className="md:col-span-2"
            >
              <Card className="h-full">
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
                      <Progress value={(stats.roleDistribution.manufacturers / stats.totalUsers) * 100} className="h-2 bg-blue-100" indicatorClassName="bg-blue-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <BadgeCheck className="h-4 w-4 text-purple-500 mr-2" />
                          <span className="text-sm font-medium">Brands</span>
                        </div>
                        <span className="text-sm">{stats.roleDistribution.brands}</span>
                      </div>
                      <Progress value={(stats.roleDistribution.brands / stats.totalUsers) * 100} className="h-2 bg-purple-100" indicatorClassName="bg-purple-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <ShieldCheck className="h-4 w-4 text-emerald-500 mr-2" />
                          <span className="text-sm font-medium">Retailers</span>
                        </div>
                        <span className="text-sm">{stats.roleDistribution.retailers}</span>
                      </div>
                      <Progress value={(stats.roleDistribution.retailers / stats.totalUsers) * 100} className="h-2 bg-emerald-100" indicatorClassName="bg-emerald-500" />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t">
                    <div className="flex items-center justify-between">
                      <CardDescription>Active Announcements</CardDescription>
                      <Badge variant="outline">{stats.activeAnnouncements}</Badge>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs">
                        Manage Announcements
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs">
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
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                  <CardDescription>All services operational</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">API Services</span>
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Database</span>
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Authentication</span>
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Notification Service</span>
                      <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200">
                        Degraded
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Storage Service</span>
                      <Badge variant="outline" className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100 border-emerald-200">
                        Operational
                      </Badge>
                    </div>
                  </div>
                  
                  <Button size="sm" className="w-full mt-6">
                    View Detailed Status
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <motion.div
            custom={6}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions performed in the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, index) => (
                    <div 
                      key={activity.id}
                      className="flex items-start space-x-4 pb-4 border-b last:border-0 last:pb-0"
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
                <Button variant="outline" className="w-full mt-4">
                  View All Activity
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="pending">
          <motion.div
            custom={7}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
          >
            <Card>
              <CardHeader>
                <CardTitle>Pending Requests</CardTitle>
                <CardDescription>Awaiting admin approval or review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <div className="grid grid-cols-5 gap-4 p-4 text-sm font-medium bg-muted/50">
                    <div>User/Company</div>
                    <div>Request Type</div>
                    <div>Submitted</div>
                    <div>Priority</div>
                    <div className="text-right">Action</div>
                  </div>
                  {stats.pendingRequests.map((request) => (
                    <div 
                      key={request.id}
                      className="grid grid-cols-5 gap-4 p-4 items-center border-t text-sm"
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
                        <Button size="sm" variant="outline" className="h-8">
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
                  <Button variant="outline">View All Requests</Button>
                  <Button variant="default">Batch Process</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 