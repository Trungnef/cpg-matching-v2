import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  PieChart, 
  LineChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Download,
  RefreshCw,
  Calendar,
  Users,
  Clock,
  LayoutDashboard,
  BadgeAlert,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import {PageTitle} from '@/components/PageTitle';

// Let's simulate chart components (in a real app, you'd use a charting library like recharts, visx, or chart.js)
const LineChartPlaceholder = () => (
  <div className="w-full h-64 mt-4">
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <div className="text-sm font-medium">Traffic Trends</div>
          <div className="text-2xl font-bold">12,543</div>
          <div className="text-xs flex items-center text-green-500">
            <ArrowUpRight className="h-3 w-3 mr-1" />
            <span>12% from last month</span>
          </div>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-grow relative">
        <motion.svg
          width="100%"
          height="100%"
          viewBox="0 0 800 200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* Curved line */}
          <motion.path
            d="M0,150 C100,120 200,80 300,100 C400,120 500,40 600,60 C700,80 800,30 800,30"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          {/* Area below the line */}
          <motion.path
            d="M0,150 C100,120 200,80 300,100 C400,120 500,40 600,60 C700,80 800,30 800,30 L800,200 L0,200 Z"
            fill="url(#gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          />
          
          {/* Data points */}
          {[
            [0, 150], [100, 120], [200, 80], [300, 100], 
            [400, 120], [500, 40], [600, 60], [700, 80], [800, 30]
          ].map(([x, y], i) => (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r="5"
              fill="white"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1 + i * 0.1, duration: 0.3 }}
            />
          ))}
        </motion.svg>
      </div>
    </div>
  </div>
);

const BarChartPlaceholder = () => (
  <div className="w-full h-64 mt-4">
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="space-y-1">
          <div className="text-sm font-medium">User Registrations</div>
          <div className="text-2xl font-bold">8,764</div>
          <div className="text-xs flex items-center text-red-500">
            <ArrowDownRight className="h-3 w-3 mr-1" />
            <span>3% from last month</span>
          </div>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-grow flex items-end justify-between gap-2 pb-6 pt-8 px-4">
        {[65, 45, 75, 60, 90, 75, 50, 80, 40, 60, 75, 85].map((height, i) => (
          <motion.div
            key={i}
            className="bg-primary/90 rounded-t-sm w-full"
            style={{ height: `${height}%` }}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ 
              duration: 0.5, 
              delay: i * 0.05,
              ease: [0.33, 1, 0.68, 1]
            }}
          />
        ))}
      </div>
    </div>
  </div>
);

const PieChartPlaceholder = () => {
  const segments = [
    { portion: 0.4, color: 'hsl(var(--primary))' },
    { portion: 0.3, color: 'hsl(var(--primary) / 0.75)' },
    { portion: 0.2, color: 'hsl(var(--primary) / 0.5)' },
    { portion: 0.1, color: 'hsl(var(--primary) / 0.25)' },
  ];

  return (
    <div className="w-full h-64 mt-4">
      <div className="w-full h-full flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <div className="text-sm font-medium">User Distribution</div>
            <div className="text-2xl font-bold">3 Types</div>
            <div className="text-xs flex items-center text-blue-500">
              <span>Manufacturers, Brands, Retailers</span>
            </div>
          </div>
        </div>
        
        <div className="flex-grow flex items-center justify-center">
          <div className="relative w-44 h-44">
            <svg width="100%" height="100%" viewBox="0 0 100 100">
              {segments.map((segment, i) => {
                // Calculate the starting angle based on previous segments
                const startAngle = segments
                  .slice(0, i)
                  .reduce((acc, curr) => acc + curr.portion * 360, 0);
                const endAngle = startAngle + segment.portion * 360;
                
                // Convert angles to radians for calculation
                const startRad = (startAngle - 90) * (Math.PI / 180);
                const endRad = (endAngle - 90) * (Math.PI / 180);
                
                // Calculate arc points
                const x1 = 50 + 50 * Math.cos(startRad);
                const y1 = 50 + 50 * Math.sin(startRad);
                const x2 = 50 + 50 * Math.cos(endRad);
                const y2 = 50 + 50 * Math.sin(endRad);
                
                // Create arc path - large arc flag is 1 if angle > 180 degrees
                const largeArcFlag = segment.portion > 0.5 ? 1 : 0;
                
                const path = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
                
                return (
                  <motion.path
                    key={i}
                    d={path}
                    fill={segment.color}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.2, duration: 0.5 }}
                  />
                );
              })}
              <circle cx="50" cy="50" r="25" fill="hsl(var(--background))" />
            </svg>
            
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <div className="text-center">
                <div className="text-xl font-bold">40%</div>
                <div className="text-xs text-muted-foreground">Brands</div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-4">
          {[
            { label: 'Brands', value: '40%', color: 'hsl(var(--primary))' },
            { label: 'Manufacturers', value: '30%', color: 'hsl(var(--primary) / 0.75)' },
            { label: 'Retailers', value: '20%', color: 'hsl(var(--primary) / 0.5)' },
            { label: 'Other', value: '10%', color: 'hsl(var(--primary) / 0.25)' },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + i * 0.1 }}
            >
              <div className="w-3 h-3 rounded-full mb-1" style={{ backgroundColor: item.color }} />
              <div className="text-xs font-medium">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [activeTab]); // Reset loading when tab changes

  const refreshData = () => {
    setIsLoading(true);
    setTimeout(() => {
      toast({
        title: "Analytics Refreshed",
        description: "Latest data has been loaded",
      });
      setIsLoading(false);
    }, 1000);
  };

  const exportData = () => {
    toast({
      title: "Export Started",
      description: "Analytics data is being exported to CSV",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6 w-full"
    >
      <PageTitle
        title="Analytics"
        description="Track and analyze user activities and platform metrics"
        icon={<BarChart3 className="h-6 w-6 text-primary" />}
      />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="w-full md:w-auto"
        >
          <Tabs 
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
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
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportData}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>
      </div>

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Total Users', value: '12,345', trend: '+15%', icon: <TrendingUp className="h-4 w-4 text-green-500" /> },
              { title: 'Active Users', value: '8,764', trend: '+8%', icon: <TrendingUp className="h-4 w-4 text-green-500" /> },
              { title: 'New Connections', value: '1,432', trend: '+32%', icon: <TrendingUp className="h-4 w-4 text-green-500" /> },
              { title: 'Engagement Rate', value: '46%', trend: '+5%', icon: <TrendingUp className="h-4 w-4 text-green-500" /> },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.3 }}
              >
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <Skeleton className="h-8 w-20" />
                    ) : (
                      <div className="text-2xl font-bold">{stat.value}</div>
                    )}
                    <div className="flex items-center mt-1 text-xs">
                      {isLoading ? (
                        <Skeleton className="h-4 w-14" />
                      ) : (
                        <>
                          {stat.icon}
                          <span className="ml-1 text-green-500">{stat.trend} vs. last period</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="h-5 w-5 text-primary" />
                    <span>Traffic Overview</span>
                  </CardTitle>
                  <CardDescription>
                    User traffic analysis over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <LineChartPlaceholder />
                  )}
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-primary" />
                    <span>Registration Trends</span>
                  </CardTitle>
                  <CardDescription>
                    New user registrations by month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-64 w-full" />
                  ) : (
                    <BarChartPlaceholder />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-primary" />
                  <span>User Distribution</span>
                </CardTitle>
                <CardDescription>
                  Distribution of users by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-64 w-full" />
                ) : (
                  <PieChartPlaceholder />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      {/* Users Tab Content */}
      {activeTab === 'users' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'New Users', value: '1,234', trend: '+12%', period: 'This month', color: 'bg-blue-500' },
              { title: 'User Retention', value: '76%', trend: '+4%', period: 'vs. last month', color: 'bg-green-500' },
              { title: 'User Churn', value: '3.2%', trend: '-1.5%', period: 'vs. last month', color: 'bg-amber-500' }
            ].map((stat, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`h-2 w-2 rounded-full ${stat.color}`}></div>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className="text-2xl font-bold">{stat.value}</div>
                  )}
                  <div className="flex items-center mt-1 text-xs">
                    {isLoading ? (
                      <Skeleton className="h-4 w-14" />
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500">{stat.trend}</span>
                        <span className="text-muted-foreground ml-1">{stat.period}</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>User Acquisition</span>
                </CardTitle>
                <CardDescription>
                  Sources and channels of user acquisition
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[400px] w-full" />
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Acquisition Channel</div>
                      <div className="grid gap-4">
                        {[
                          { channel: 'Direct', value: 42, percentage: '42%' },
                          { channel: 'Organic Search', value: 28, percentage: '28%' },
                          { channel: 'Referral', value: 18, percentage: '18%' },
                          { channel: 'Social Media', value: 12, percentage: '12%' }
                        ].map((item, i) => (
                          <div key={i} className="flex items-center">
                            <div className="w-36 text-sm">{item.channel}</div>
                            <div className="w-full max-w-md h-4 bg-secondary rounded-full overflow-hidden">
                              <motion.div 
                                className="h-full bg-primary" 
                                initial={{ width: 0 }}
                                animate={{ width: `${item.value}%` }}
                                transition={{ duration: 1, delay: i * 0.1 }}
                              />
                            </div>
                            <div className="w-12 text-right text-sm font-medium ml-2">{item.percentage}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <div className="text-sm font-medium mb-4">Geographic Distribution</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <table className="w-full">
                            <thead>
                              <tr className="text-left text-xs text-muted-foreground">
                                <th className="pb-2">Country</th>
                                <th className="pb-2 text-right">Users</th>
                                <th className="pb-2 text-right">Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {[
                                { country: 'United States', users: 5420, percentage: '44.2%' },
                                { country: 'United Kingdom', users: 1953, percentage: '15.9%' },
                                { country: 'Germany', users: 1218, percentage: '9.9%' },
                                { country: 'France', users: 964, percentage: '7.8%' },
                                { country: 'Japan', users: 841, percentage: '6.8%' }
                              ].map((item, i) => (
                                <motion.tr 
                                  key={i} 
                                  className="text-sm"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.3, delay: i * 0.05 }}
                                >
                                  <td className="py-2">{item.country}</td>
                                  <td className="py-2 text-right">{item.users.toLocaleString()}</td>
                                  <td className="py-2 text-right">{item.percentage}</td>
                                </motion.tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <div>
                          <div className="h-[200px] relative">
                            <motion.div 
                              className="absolute inset-0 p-4 flex items-center justify-center"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <div className="text-center text-muted-foreground">
                                Geographic map visualization would be here
                              </div>
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}

      {/* Engagement Tab Content */}
      {activeTab === 'engagement' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Avg. Session Duration', value: '4m 32s', trend: '+8%', period: 'vs. last month', icon: <Clock className="h-4 w-4 text-blue-500" /> },
              { title: 'Pages Per Session', value: '3.7', trend: '+12%', period: 'vs. last month', icon: <LayoutDashboard className="h-4 w-4 text-green-500" /> },
              { title: 'Bounce Rate', value: '38.2%', trend: '-5%', period: 'vs. last month', icon: <BadgeAlert className="h-4 w-4 text-amber-500" /> }
            ].map((stat, i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    {stat.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <Skeleton className="h-8 w-24" />
                  ) : (
                    <div className="text-2xl font-bold">{stat.value}</div>
                  )}
                  <div className="flex items-center mt-1 text-xs">
                    {isLoading ? (
                      <Skeleton className="h-4 w-14" />
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-green-500">{stat.trend}</span>
                        <span className="text-muted-foreground ml-1">{stat.period}</span>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <span>Feature Usage</span>
                </CardTitle>
                <CardDescription>
                  Most used platform features
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="space-y-6">
                    {[
                      { feature: 'Search', percentage: 86, color: 'bg-primary' },
                      { feature: 'Matching', percentage: 72, color: 'bg-blue-500' },
                      { feature: 'Messaging', percentage: 64, color: 'bg-green-500' },
                      { feature: 'Reporting', percentage: 51, color: 'bg-orange-500' },
                      { feature: 'Analytics', percentage: 42, color: 'bg-purple-500' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="text-sm font-medium">{item.feature}</div>
                          <div className="text-sm font-medium">{item.percentage}%</div>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div 
                            className={`h-full ${item.color}`} 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-primary" />
                  <span>Activity by Time</span>
                </CardTitle>
                <CardDescription>
                  User engagement throughout the day
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : (
                  <div className="h-[300px] pt-4">
                    <div className="flex items-end h-[220px] gap-2">
                      {Array.from({ length: 24 }).map((_, i) => {
                        // Generate a natural curve for the data
                        const baseHeight = 40; // Minimum height percentage
                        const hour = i;
                        
                        // Create a curve that peaks during work hours
                        let height = baseHeight;
                        if (hour >= 7 && hour <= 19) {
                          // Working hours simulation
                          height += Math.sin((hour - 7) * Math.PI / 12) * 45;
                        }
                        
                        return (
                          <motion.div
                            key={i}
                            className="flex-1 bg-primary/80 hover:bg-primary rounded-t transition-colors"
                            style={{ height: `${height}%` }}
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ duration: 0.5, delay: i * 0.03 }}
                          />
                        );
                      })}
                    </div>
                    <div className="flex justify-between mt-2 px-1 text-xs text-muted-foreground">
                      <div>12 AM</div>
                      <div>6 AM</div>
                      <div>12 PM</div>
                      <div>6 PM</div>
                      <div>12 AM</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <span>User Retention</span>
              </CardTitle>
              <CardDescription>
                Week-by-week user retention cohort analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead>
                      <tr>
                        <th className="text-left text-xs font-medium text-muted-foreground p-2">Cohort</th>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
                          <th key={week} className="text-center text-xs font-medium text-muted-foreground p-2">
                            Week {week}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { week: "Week 1", retention: [100, 80, 68, 54, 48, 42, 39, 36] },
                        { week: "Week 2", retention: [100, 76, 64, 52, 45, 40, 36, null] },
                        { week: "Week 3", retention: [100, 77, 62, 49, 43, 38, null, null] },
                        { week: "Week 4", retention: [100, 75, 61, 48, 42, null, null, null] },
                        { week: "Week 5", retention: [100, 79, 65, 51, null, null, null, null] },
                        { week: "Week 6", retention: [100, 78, 63, null, null, null, null, null] },
                        { week: "Week 7", retention: [100, 77, null, null, null, null, null, null] },
                        { week: "Week 8", retention: [100, null, null, null, null, null, null, null] }
                      ].map((row, rowIndex) => (
                        <motion.tr 
                          key={rowIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: rowIndex * 0.05 }}
                        >
                          <td className="p-2 text-sm font-medium">{row.week}</td>
                          {row.retention.map((value, colIndex) => {
                            const intensity = value !== null ? Math.max(10, value) : 0;
                            const color = `rgba(var(--primary-rgb), ${intensity / 100})`;
                            return (
                              <td key={colIndex} className="p-1 text-center">
                                {value !== null && (
                                  <motion.div 
                                    className="w-full h-full p-2 text-sm rounded flex items-center justify-center"
                                    style={{ 
                                      backgroundColor: color,
                                      color: intensity > 50 ? 'white' : 'inherit'
                                    }}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: (rowIndex + colIndex) * 0.03 }}
                                  >
                                    {value}%
                                  </motion.div>
                                )}
                              </td>
                            );
                          })}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Analytics; 