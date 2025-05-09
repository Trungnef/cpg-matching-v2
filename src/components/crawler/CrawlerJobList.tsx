import React, { useState, useEffect, useMemo } from 'react';
import { format } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MoreVertical, 
  RefreshCw, 
  Eye, 
  Trash, 
  List, 
  Clock, 
  BarChart3, 
  AlertCircle, 
  CheckCircle, 
  Activity, 
  Database,
  Filter,
  Search,
  XCircle,
  Info,
  Calendar,
  Settings,
  ArrowUpDown,
  Link
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { crawlerApi } from '@/lib/api';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export interface CrawlTask {
  _id: string;
  url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  config: {
    depth: number;
    maxPages: number;
    selectors?: {
      productContainer?: string;
      name?: string;
      price?: string;
      description?: string;
      image?: string;
      ingredients?: string;
      nutritionFacts?: string;
      brand?: string;
    };
  };
  estimatedTime?: number; // Time in seconds
  autoSave: boolean; // Whether to automatically save to catalog
  aiProvider: string; // AI provider to use for processing
  error?: string;
  createdAt: string;
  updatedAt: string;
}

// Add queue status interface
export interface QueueStatus {
  queueLength: number;
  currentlyRunning: number;
  processingTasks: {
    id: string;
    url?: string;
    createdAt?: string;
    autoSave?: boolean;
    aiProvider?: string;
    progress?: number;
  }[];
}

interface CrawlerJobListProps {
  tasks: CrawlTask[];
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onViewResults: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onRefreshList: () => void;
}

const CrawlerJobList: React.FC<CrawlerJobListProps> = ({
  tasks,
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
  onViewResults,
  onDeleteTask,
  onRefreshList
}) => {
  const [selectedTask, setSelectedTask] = useState<CrawlTask | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string>("");
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);
  const { toast } = useToast();

  // Refresh queue status on mount and every 10 seconds if autoRefresh is enabled
  useEffect(() => {
    fetchQueueStatus();
    
    let interval: NodeJS.Timeout;
    
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchQueueStatus();
        // Only auto refresh the list if there are active tasks
        if (queueStatus && (queueStatus.queueLength > 0 || queueStatus.currentlyRunning > 0)) {
          onRefreshList();
        }
      }, 10000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, onRefreshList]);

  // Sync processingTasks with main tasks list
  useEffect(() => {
    if (queueStatus?.processingTasks && tasks.length > 0) {
      // Check if any processingTasks have been completed but not updated in queue status
      const completedProcessingTasks = queueStatus.processingTasks.filter(processingTask => 
        tasks.some(task => 
          task._id === processingTask.id && task.status === 'completed'
        )
      );

      // If found any, refresh the queue status to get the latest data
      if (completedProcessingTasks.length > 0) {
        fetchQueueStatus();
      }
    }
  }, [tasks, queueStatus]);

  // Fetch queue status
  const fetchQueueStatus = async () => {
    try {
      setIsLoadingQueue(true);
      const response = await crawlerApi.getQueueStatus();
      
      // Filter out processingTasks that are already completed in the main tasks list
      if (response.data.processingTasks && tasks.length > 0) {
        const updatedProcessingTasks = response.data.processingTasks.filter(processingTask => 
          !tasks.some(task => 
            task._id === processingTask.id && task.status === 'completed'
          )
        );
        
        setQueueStatus({
          ...response.data,
          processingTasks: updatedProcessingTasks,
          currentlyRunning: updatedProcessingTasks.length
        });
      } else {
        setQueueStatus(response.data);
      }
    } catch (error) {
      console.error('Error fetching queue status:', error);
    } finally {
      setIsLoadingQueue(false);
    }
  };

  // Clear queue handler
  const handleClearQueue = async () => {
    try {
      await crawlerApi.clearQueue();
      toast({
        title: 'Queue Cleared',
        description: 'All pending tasks have been removed from the queue.',
      });
      fetchQueueStatus();
      onRefreshList();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to clear the queue',
        variant: 'destructive',
      });
    }
  };

  // Batch delete handler
  const handleBatchDelete = async (status: string) => {
    try {
      await crawlerApi.batchDeleteByStatus(status);
      
      toast({
        title: 'Tasks Deleted',
        description: `All ${status} tasks have been deleted.`,
      });
      onRefreshList();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete tasks',
        variant: 'destructive',
      });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="flex items-center gap-1 dark:border-slate-700">
            <Clock className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
            <RefreshCw className="h-3 w-3 animate-spin" />
            <span>Processing</span>
          </Badge>
        );
      case 'completed':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300">
            <CheckCircle className="h-3 w-3" />
            <span>Completed</span>
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            <span>Failed</span>
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="dark:border-slate-700">
            {status}
          </Badge>
        );
    }
  };

  // Format time in seconds to human readable format
  const formatTime = (seconds: number | undefined) => {
    if (seconds === undefined) return 'Unknown';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes === 0) {
      return `${remainingSeconds} seconds`;
    } else if (remainingSeconds === 0) {
      return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    } else {
      return `${minutes} minute${minutes > 1 ? 's' : ''} ${remainingSeconds} sec`;
    }
  };

  // Show error details
  const showError = (error: string | undefined) => {
    if (!error) return;
    setErrorDetails(error);
    setShowErrorDialog(true);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 } 
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 } 
    }
  };

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter(task => {
        // Filter by status tab
        if (activeTab !== "all" && task.status !== activeTab) {
          return false;
        }
        
        // Filter by search term
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          return (
            task.url.toLowerCase().includes(term) ||
            task.aiProvider.toLowerCase().includes(term)
          );
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by selected field
        let valueA, valueB;
        
        if (sortBy === "createdAt") {
          valueA = new Date(a.createdAt).getTime();
          valueB = new Date(b.createdAt).getTime();
        } else if (sortBy === "url") {
          valueA = a.url.toLowerCase();
          valueB = b.url.toLowerCase();
        } else if (sortBy === "status") {
          valueA = a.status;
          valueB = b.status;
        } else if (sortBy === "depth") {
          valueA = a.config.depth;
          valueB = b.config.depth;
        } else if (sortBy === "maxPages") {
          valueA = a.config.maxPages;
          valueB = b.config.maxPages;
        } else {
          valueA = a[sortBy as keyof CrawlTask];
          valueB = b[sortBy as keyof CrawlTask];
        }
        
        if (sortOrder === "asc") {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
  }, [tasks, activeTab, searchTerm, sortBy, sortOrder]);

  // Get counts for each status
  const statusCounts = useMemo(() => {
    const counts = {
      all: tasks.length,
      pending: 0,
      processing: 0,
      completed: 0,
      failed: 0
    };
    
    tasks.forEach(task => {
      if (counts[task.status as keyof typeof counts] !== undefined) {
        counts[task.status as keyof typeof counts]++;
      }
    });
    
    return counts;
  }, [tasks]);

  // Toggle sort order
  const toggleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 w-full">
        <h2 className="text-2xl font-bold tracking-tight">Crawler Tasks</h2>
        
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            className="flex items-center gap-1"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>{autoRefresh ? "Auto-Refresh On" : "Auto-Refresh Off"}</span>
          </Button>
          
          <Button
            onClick={onRefreshList}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={isLoading}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {/* Queue Status Panel */}
      <motion.div
        className="mb-6 p-4 border dark:border-slate-700 rounded-lg bg-muted/40 dark:bg-slate-800/40 w-full"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold flex items-center gap-1">
            <Activity className="h-4 w-4" />
            Queue Status
          </h3>
          <div className="flex gap-2">
            <Button 
              variant="ghost"
              size="sm" 
              onClick={fetchQueueStatus}
              disabled={isLoadingQueue}
              className="dark:text-slate-300 dark:hover:text-white"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoadingQueue ? 'animate-spin' : ''}`} />
            </Button>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline"
                    size="sm" 
                    onClick={handleClearQueue}
                    disabled={!queueStatus || queueStatus.queueLength === 0}
                    className="dark:border-slate-700 dark:hover:border-slate-600"
                  >
                    Clear Queue
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Remove all pending tasks from the queue</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
          <Card className="bg-white dark:bg-slate-900 dark:border-slate-700 transition-all hover:shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Waiting in Queue</p>
                <h4 className="text-2xl font-bold dark:text-white">
                  {isLoadingQueue ? <Skeleton className="h-8 w-12" /> : (queueStatus?.queueLength || 0)}
                </h4>
              </div>
              <Database className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-900 dark:border-slate-700 transition-all hover:shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Currently Processing</p>
                <h4 className="text-2xl font-bold dark:text-white">
                  {isLoadingQueue ? <Skeleton className="h-8 w-12" /> : (queueStatus?.currentlyRunning || 0)}
                </h4>
              </div>
              <RefreshCw className="h-8 w-8 text-blue-400 dark:text-blue-500" />
            </CardContent>
          </Card>
          
          <Card className="bg-white dark:bg-slate-900 dark:border-slate-700 transition-all hover:shadow-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <h4 className="text-2xl font-bold dark:text-white">
                  {isLoading ? <Skeleton className="h-8 w-12" /> : tasks.length}
                </h4>
              </div>
              <BarChart3 className="h-8 w-8 text-primary/60 dark:text-primary/80" />
            </CardContent>
          </Card>
        </div>
        
        {/* Queue Status Panel - Currently Processing Tasks */}
        {queueStatus?.processingTasks.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2 dark:text-slate-300">Currently Processing:</h4>
            <div className="space-y-2">
              {queueStatus.processingTasks.map((processingTask) => {
                // Find corresponding task in the main tasks list to get the latest status
                const matchingTask = tasks.find(task => task._id === processingTask.id);
                // Skip rendering if task is already completed
                if (matchingTask?.status === 'completed') return null;
                
                return (
                  <div key={processingTask.id} className="text-xs p-2 bg-blue-50 dark:bg-blue-900/30 rounded border border-blue-100 dark:border-blue-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-3 w-3 animate-spin text-blue-500 dark:text-blue-400" />
                      <span className="font-medium dark:text-slate-200 truncate max-w-[200px] sm:max-w-[300px]">{processingTask.url || processingTask.id}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {processingTask.progress !== undefined && (
                        <div className="flex items-center gap-1">
                          <div className="h-1.5 w-16 bg-blue-100 dark:bg-blue-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 dark:bg-blue-400" 
                              style={{ width: `${Math.min(100, processingTask.progress)}%` }}
                            />
                          </div>
                          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{Math.round(processingTask.progress || 0)}%</span>
                        </div>
                      )}
                      {processingTask.createdAt && (
                        <span className="text-muted-foreground dark:text-slate-400">
                          Started: {formatDate(processingTask.createdAt)}
                        </span>
                      )}
                      {matchingTask && (
                        <span className="text-xs font-medium px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300">
                          {matchingTask.status.charAt(0).toUpperCase() + matchingTask.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.div>

      {/* Filtering and Search Controls */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="grid grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="all" className="text-xs">
              All
              <Badge variant="outline" className="ml-1 text-xs py-0 px-1.5 h-4">{statusCounts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="text-xs">
              Pending
              <Badge variant="outline" className="ml-1 text-xs py-0 px-1.5 h-4">{statusCounts.pending}</Badge>
            </TabsTrigger>
            <TabsTrigger value="processing" className="text-xs">
              Processing
              <Badge variant="outline" className="ml-1 text-xs py-0 px-1.5 h-4">{statusCounts.processing}</Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="text-xs">
              Completed
              <Badge variant="outline" className="ml-1 text-xs py-0 px-1.5 h-4">{statusCounts.completed}</Badge>
            </TabsTrigger>
            <TabsTrigger value="failed" className="text-xs">
              Failed
              <Badge variant="outline" className="ml-1 text-xs py-0 px-1.5 h-4">{statusCounts.failed}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by URL or provider..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full h-9"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full w-8"
                onClick={() => setSearchTerm("")}
              >
                <XCircle className="h-4 w-4 text-muted-foreground" />
              </Button>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Select
              value={sortBy}
              onValueChange={setSortBy}
            >
              <SelectTrigger className="h-9 w-[140px]">
                <div className="flex items-center gap-1">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  <span>Sort by</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt">Created Date</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="aiProvider">AI Provider</SelectItem>
                <SelectItem value="depth">Depth</SelectItem>
                <SelectItem value="maxPages">Max Pages</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            >
              {sortOrder === "asc" ? (
                <ArrowUpDown className="h-4 w-4 rotate-180" />
              ) : (
                <ArrowUpDown className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {activeTab !== "all" && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-xs"
                    onClick={() => handleBatchDelete(activeTab)}
                    disabled={statusCounts[activeTab as keyof typeof statusCounts] === 0}
                  >
                    <Trash className="h-3.5 w-3.5 mr-1" />
                    Delete All {activeTab}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete all tasks with {activeTab} status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center p-8 border dark:border-slate-700 rounded-lg">
          <div className="mx-auto w-12 h-12 rounded-full bg-muted dark:bg-slate-800 flex items-center justify-center mb-3">
            <Database className="h-6 w-6 text-muted-foreground" />
          </div>
          {searchTerm ? (
            <>
              <h3 className="font-medium text-lg mb-1">No matching tasks found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Try adjusting your search term or filters
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setActiveTab("all");
                }}
              >
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <h3 className="font-medium text-lg mb-1">No tasks found</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Create a new crawl task to get started
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredTasks.map((task) => (
              <motion.div key={task._id} variants={itemVariants}>
                <Card className="bg-card dark:bg-slate-900 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-0">
                    <div className="p-4 flex flex-col md:flex-row justify-between">
                      <div className="mb-3 md:mb-0">
                        <h3 className="font-semibold mb-1 text-base dark:text-slate-200 break-all">
                          {task.url.length > 60
                            ? task.url.substring(0, 60) + '...'
                            : task.url}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-sm">
                          {getStatusBadge(task.status)}
                          
                          <Badge variant="outline" className="flex items-center gap-1 dark:border-slate-700">
                            <span>Depth: {task.config.depth}</span>
                          </Badge>
                          
                          <Badge variant="outline" className="flex items-center gap-1 dark:border-slate-700">
                            <span>Max Pages: {task.config.maxPages}</span>
                          </Badge>
                          
                          {task.autoSave && (
                            <Badge className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/70">
                              Auto-Save
                            </Badge>
                          )}
                          
                          {task.aiProvider && task.aiProvider !== 'default' && (
                            <Badge className="bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/70">
                              {task.aiProvider === 'openai' ? 'OpenAI' : 
                               task.aiProvider === 'gemini' ? 'Gemini' : 
                               'Claude'}
                            </Badge>
                          )}
                          
                          {task.estimatedTime !== undefined && (
                            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                              <Clock className="h-3 w-3" />
                              <span>Est. time: {formatTime(task.estimatedTime)}</span>
                            </Badge>
                          )}
                          
                          {task.error && (
                            <Badge 
                              variant="outline" 
                              className="cursor-pointer flex items-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-200 dark:border-red-800"
                              onClick={() => showError(task.error)}
                            >
                              <AlertCircle className="h-3 w-3" />
                              <span>View Error</span>
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end justify-between">
                        <div className="flex space-x-2">
                          {task.status === 'completed' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => onViewResults(task._id)}
                              className="gap-1"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View Results
                            </Button>
                          )}
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => window.open(task.url, '_blank')}>
                                <Link className="h-4 w-4 mr-2" />
                                Open URL
                              </DropdownMenuItem>
                              
                              {task.status === 'pending' && (
                                <DropdownMenuItem onClick={() => console.log('Move to top')}>
                                  <ArrowUpDown className="h-4 w-4 mr-2" />
                                  Move to Top of Queue
                                </DropdownMenuItem>
                              )}
                              
                              <DropdownMenuItem onClick={() => console.log('Clone task')}>
                                <Settings className="h-4 w-4 mr-2" />
                                Clone with Same Settings
                              </DropdownMenuItem>
                              
                              <DropdownMenuSeparator />
                              
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTask(task);
                                  setShowDeleteDialog(true);
                                }}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        
                        <div className="flex items-center text-xs text-muted-foreground mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>{formatDate(task.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Indicator for Processing Tasks */}
                    {task.status === 'processing' && (
                      <div className="h-1 w-full bg-muted overflow-hidden">
                        <motion.div 
                          className="h-full bg-primary"
                          initial={{ width: '0%' }}
                          animate={{ 
                            width: '100%',
                            transition: { 
                              repeat: Infinity, 
                              duration: 2,
                              ease: 'linear'
                            }
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
                    
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 py-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => onPageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const page = i + 1;
                    
                    // Only show current page, first, last, and one on each side of current page
                    if (
                      page === 1 || 
                      page === totalPages || 
                      page === currentPage || 
                      page === currentPage - 1 || 
                      page === currentPage + 1
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            isActive={page === currentPage}
                            onClick={() => onPageChange(page)}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    } else if (
                      (page === 2 && currentPage > 3) || 
                      (page === totalPages - 1 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this crawl task and all associated results.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (selectedTask) {
                  onDeleteTask(selectedTask._id);
                  setShowDeleteDialog(false);
                  setSelectedTask(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Error Details Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              Error Details
            </DialogTitle>
          </DialogHeader>
          <div className="bg-muted p-3 rounded-md max-h-[300px] overflow-y-auto">
            <pre className="text-xs whitespace-pre-wrap break-words text-destructive/90">{errorDetails}</pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CrawlerJobList; 