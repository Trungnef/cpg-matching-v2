import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Filter, 
  Search, 
  UserCircle, 
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Trash,
  RefreshCw,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from '@/components/ui/use-toast';
import { PageTitle } from '@/components/PageTitle';

const ActivityLog = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activityType, setActivityType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [timeFrame, setTimeFrame] = useState('24h');
  const { toast } = useToast();

  // Mock activity data
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Simulating API call
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockData = [
        {
          id: 1,
          type: 'login',
          user: 'admin@cpg.com',
          userRole: 'Admin',
          action: 'Logged in to the system',
          timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
          status: 'success',
          ipAddress: '192.168.1.1',
          details: { browser: 'Chrome', device: 'Desktop', location: 'New York, US' }
        },
        {
          id: 2,
          type: 'user',
          user: 'admin@cpg.com',
          userRole: 'Admin',
          action: 'Created new user: john.doe@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          status: 'success',
          ipAddress: '192.168.1.1',
          details: { userId: 'usr_123', userEmail: 'john.doe@example.com', userRole: 'Brand' }
        },
        {
          id: 3,
          type: 'user',
          user: 'admin@cpg.com',
          userRole: 'Admin',
          action: 'Updated user: sarah.smith@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
          status: 'success',
          ipAddress: '192.168.1.1',
          details: { userId: 'usr_456', userEmail: 'sarah.smith@example.com', changes: { role: 'Manufacturer to Retailer' } }
        },
        {
          id: 4,
          type: 'announcement',
          user: 'admin@cpg.com',
          userRole: 'Admin',
          action: 'Created new announcement: System Maintenance',
          timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
          status: 'success',
          ipAddress: '192.168.1.1',
          details: { announcementId: 'ann_123', title: 'System Maintenance', audience: 'All Users' }
        },
        {
          id: 5,
          type: 'error',
          user: 'sarah.smith@example.com',
          userRole: 'Retailer',
          action: 'Failed login attempt',
          timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
          status: 'error',
          ipAddress: '192.168.1.2',
          details: { reason: 'Incorrect password', attemptCount: 2 }
        },
        {
          id: 6,
          type: 'system',
          user: 'system',
          userRole: 'System',
          action: 'Database backup completed',
          timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
          status: 'success',
          ipAddress: 'internal',
          details: { backupSize: '236MB', duration: '2m 34s', location: 'S3://backups/daily/2023-03-15' }
        },
        {
          id: 7,
          type: 'user',
          user: 'admin@cpg.com',
          userRole: 'Admin',
          action: 'Deleted user: james.wilson@example.com',
          timestamp: new Date(Date.now() - 1000 * 60 * 240).toISOString(),
          status: 'success',
          ipAddress: '192.168.1.1',
          details: { userId: 'usr_789', userEmail: 'james.wilson@example.com', userRole: 'Brand' }
        },
        {
          id: 8,
          type: 'login',
          user: 'sarah.smith@example.com',
          userRole: 'Retailer',
          action: 'Logged in to the system',
          timestamp: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
          status: 'success',
          ipAddress: '192.168.1.2',
          details: { browser: 'Firefox', device: 'Mobile', location: 'Chicago, US' }
        },
      ];

      setActivities(mockData);
      setIsLoading(false);
    };

    loadData();
  }, [timeFrame]);

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Activity Log Refreshed",
        description: "Latest activities have been loaded",
      });
      setIsLoading(false);
    }, 1000);
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Activity log is being exported to CSV",
    });
  };

  const viewActivityDetails = (activity) => {
    setSelectedActivity(activity);
    setIsDialogOpen(true);
  };

  const filteredActivities = activities.filter((activity) => {
    // Filter by search query
    const matchesSearch = 
      activity.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
      activity.action.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by activity type
    const matchesType = activityType === 'all' || activity.type === activityType;
    
    return matchesSearch && matchesType;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  const getActionIcon = (type) => {
    switch(type) {
      case 'login': return <UserCircle className="h-4 w-4" />;
      case 'user': return <Eye className="h-4 w-4" />;
      case 'announcement': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <XCircle className="h-4 w-4" />;
      case 'system': return <CheckCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  const getTimeSince = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 24 * 60) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / (60 * 24))}d ago`;
  };

  const tableRowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.2,
        ease: [0.35, 0, 0.35, 1]
      }
    }),
    exit: { opacity: 0, transition: { duration: 0.1 } }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full p-6 space-y-6 overflow-auto"
    >
      <PageTitle
        title="Activity Log"
        description="Monitor and analyze system activities and user actions"
        icon={<Clock className="h-6 w-6 text-primary" />}
      />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="w-full md:w-auto"
        >
          <Tabs 
            defaultValue="24h" 
            className="w-full" 
            onValueChange={setTimeFrame}
          >
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="24h" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Last 24 Hours</TabsTrigger>
              <TabsTrigger value="7d" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Last 7 Days</TabsTrigger>
              <TabsTrigger value="30d" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Last 30 Days</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex gap-2"
        >
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refreshData}
            disabled={isLoading}
            className="flex items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportData}
            className="flex items-center gap-1 hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users or actions..."
                className="pl-8 border-primary/20 focus-visible:ring-primary/30"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Filter className="h-4 w-4 text-primary" />
              Filter by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger className="border-primary/20 focus:ring-primary/30">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activities</SelectItem>
                <SelectItem value="login">Login Activities</SelectItem>
                <SelectItem value="user">User Management</SelectItem>
                <SelectItem value="announcement">Announcements</SelectItem>
                <SelectItem value="error">Errors</SelectItem>
                <SelectItem value="system">System Activities</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-primary" />
              Activity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.2 }}
              >
                <span className="text-2xl font-bold">{activities.length}</span>
                <span className="text-xs text-muted-foreground">Total Activities</span>
              </motion.div>
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.2 }}
              >
                <span className="text-2xl font-bold">
                  {activities.filter(a => a.status === 'success').length}
                </span>
                <span className="text-xs text-muted-foreground">Successful</span>
              </motion.div>
              <motion.div 
                className="flex flex-col"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.2 }}
              >
                <span className="text-2xl font-bold">
                  {activities.filter(a => a.status === 'error').length}
                </span>
                <span className="text-xs text-muted-foreground">Errors</span>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.3 }}
      >
        <Card className="overflow-hidden shadow-md">
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[50px]">Status</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Skeleton loading state
                    Array(5).fill(0).map((_, i) => (
                      <TableRow key={`skeleton-${i}`}>
                        <TableCell>
                          <Skeleton className="h-6 w-6 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-[200px]" />
                            <Skeleton className="h-3 w-[150px]" />
                          </div>
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-[60px] ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <AnimatePresence>
                      {filteredActivities.map((activity, index) => (
                        <motion.tr
                          key={activity.id}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          custom={index}
                          variants={tableRowVariants}
                          className="group hover:bg-muted/50"
                        >
                          <TableCell>
                            <motion.div 
                              className={`h-2.5 w-2.5 rounded-full ${getStatusColor(activity.status)}`}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.1 * index, duration: 0.2 }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-muted-foreground mr-1">
                                  {getActionIcon(activity.type)}
                                </span>
                                <span className="font-medium">{activity.action}</span>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                IP: {activity.ipAddress}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{activity.user}</span>
                              <Badge variant="outline" className="text-xs w-fit">
                                {activity.userRole}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="text-sm">{getTimeSince(activity.timestamp)}</span>
                              <span className="text-xs text-muted-foreground">
                                {formatTimestamp(activity.timestamp)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => viewActivityDetails(activity)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                            >
                              View
                            </Button>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                  {!isLoading && filteredActivities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center">
                        No matching activities found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Activity Details</DialogTitle>
            <DialogDescription>
              Detailed information about this activity
            </DialogDescription>
          </DialogHeader>
          
          {selectedActivity && (
            <div className="space-y-4 py-4">
              <div className="flex items-center space-x-2">
                <div className={`h-3 w-3 rounded-full ${getStatusColor(selectedActivity.status)}`} />
                <span className="font-medium">{selectedActivity.action}</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">User</p>
                  <p>{selectedActivity.user}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p>{selectedActivity.userRole}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">IP Address</p>
                  <p>{selectedActivity.ipAddress}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Timestamp</p>
                  <p>{formatTimestamp(selectedActivity.timestamp)}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Additional Details</p>
                <div className="rounded-md bg-muted p-3 text-sm">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(selectedActivity.details, null, 2)}</pre>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="secondary" 
              onClick={() => setIsDialogOpen(false)}
              className="hover:bg-primary hover:text-primary-foreground"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default ActivityLog; 