import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Search, 
  Plus,
  MoreHorizontal,
  Calendar,
  Users,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  X,
  Filter,
  ArrowUpDown,
  MegaphoneIcon,
  MessageCircle
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock data for announcements
const mockAnnouncements = [
  {
    id: 1,
    title: "New Platform Features Released",
    content: "We're excited to announce several new features that have been added to our platform to improve your experience.",
    type: "update",
    priority: "high",
    audience: ["all"],
    createdBy: "Admin",
    createdAt: "2023-11-10T10:30:00Z",
    expiresAt: "2023-12-10T23:59:59Z",
    status: "active",
    views: 245
  },
  {
    id: 2,
    title: "Scheduled Maintenance Notice",
    content: "We will be performing scheduled maintenance on our servers from 2 AM to 4 AM EST on November 15th, 2023. During this time, the platform may be temporarily unavailable.",
    type: "maintenance",
    priority: "medium",
    audience: ["all"],
    createdBy: "System",
    createdAt: "2023-11-08T14:15:00Z",
    expiresAt: "2023-11-16T04:00:00Z",
    status: "active",
    views: 178
  },
  {
    id: 3,
    title: "New Retailer Partnership Opportunity",
    content: "Exclusive for Brand subscribers: We've partnered with a major retail chain looking for sustainable product lines. Submit your interest through the partnerships portal by Nov 30.",
    type: "opportunity",
    priority: "medium",
    audience: ["Brand"],
    createdBy: "Admin",
    createdAt: "2023-11-05T09:45:00Z",
    expiresAt: "2023-11-30T23:59:59Z", 
    status: "active",
    views: 92
  },
  {
    id: 4,
    title: "Holiday Season Operating Hours",
    content: "Please note our customer support team will be operating with reduced hours during the upcoming holiday season (Dec 24 - Jan 2).",
    type: "notice",
    priority: "low",
    audience: ["all"],
    createdBy: "Admin",
    createdAt: "2023-11-01T11:30:00Z",
    expiresAt: "2024-01-03T23:59:59Z",
    status: "scheduled",
    views: 0
  },
  {
    id: 5,
    title: "System Update Complete",
    content: "The scheduled system update has been completed successfully. All services are now running normally with improved performance.",
    type: "update",
    priority: "low",
    audience: ["all"],
    createdBy: "System",
    createdAt: "2023-10-28T05:15:00Z",
    expiresAt: "2023-11-05T23:59:59Z",
    status: "expired",
    views: 203
  }
];

// Type definitions
type Announcement = typeof mockAnnouncements[0];
type AnnouncementType = 'update' | 'maintenance' | 'opportunity' | 'notice';
type AnnouncementPriority = 'high' | 'medium' | 'low';
type AnnouncementStatus = 'active' | 'scheduled' | 'expired' | 'draft';
type AnnouncementAudience = 'all' | 'Brand' | 'Manufacturer' | 'Retailer';

const priorityStyles = {
  high: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  medium: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  low: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800"
};

const typeStyles = {
  update: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  maintenance: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  opportunity: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800",
  notice: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800"
};

const statusStyles = {
  active: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  scheduled: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  expired: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-200 dark:border-gray-800",
  draft: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800"
};

const Announcements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filteredAnnouncements, setFilteredAnnouncements] = useState<Announcement[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const announcementsPerPage = 5;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Simulating API call for data
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnnouncements(mockAnnouncements);
      setFilteredAnnouncements(mockAnnouncements);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle filtering and searching
  useEffect(() => {
    let results = [...announcements];
    
    // Apply search filter
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      results = results.filter(
        announcement => 
          announcement.title.toLowerCase().includes(lowerCaseQuery) || 
          announcement.content.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Apply type filter
    if (typeFilter !== 'all') {
      results = results.filter(announcement => announcement.type === typeFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(announcement => announcement.status === statusFilter);
    }
    
    setFilteredAnnouncements(results);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchQuery, typeFilter, statusFilter, announcements]);

  // Pagination logic
  const indexOfLastAnnouncement = currentPage * announcementsPerPage;
  const indexOfFirstAnnouncement = indexOfLastAnnouncement - announcementsPerPage;
  const currentAnnouncements = filteredAnnouncements.slice(indexOfFirstAnnouncement, indexOfLastAnnouncement);
  const totalPages = Math.ceil(filteredAnnouncements.length / announcementsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Handle view announcement
  const handleViewAnnouncement = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsViewDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div
          className="relative h-16 w-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className={`text-3xl font-bold tracking-tight ${isDark ? 'bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400' : 'text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70'}`}>
            Announcements
          </h1>
          <p className="text-muted-foreground">
            Manage system-wide announcements and notifications
          </p>
        </div>
        
        <div>
          <Button className="relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-primary/10 rounded-md"
              initial={{ x: "-100%" }}
              whileHover={{ x: "0%" }}
              transition={{ duration: 0.3 }}
            />
            <Plus className="mr-2 h-4 w-4 relative z-10 group-hover:scale-110 transition-transform" />
            <span className="relative z-10">New Announcement</span>
          </Button>
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 0.1,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="flex flex-col md:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-10 h-9 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}
          />
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
              onClick={() => setSearchQuery('')}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X className="h-4 w-4" />
            </motion.button>
          )}
        </div>
        
        <div className="flex gap-3 flex-wrap md:flex-nowrap">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className={`w-[180px] h-9 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="capitalize">{typeFilter === 'all' ? 'All Types' : typeFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="maintenance">Maintenance</SelectItem>
              <SelectItem value="opportunity">Opportunity</SelectItem>
              <SelectItem value="notice">Notice</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className={`w-[180px] h-9 ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="capitalize">{statusFilter === 'all' ? 'All Statuses' : statusFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Announcements Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className={`border-t-4 border-t-primary/20 transition-all duration-300 hover:shadow-md ${isDark ? 'bg-gray-800/50 border-gray-700 hover:shadow-primary/5' : 'bg-white border-gray-200 hover:shadow-primary/5'}`}>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>All Announcements</CardTitle>
              <CardDescription className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Showing {currentAnnouncements.length} of {filteredAnnouncements.length} announcements
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table className="mt-2">
              <TableHeader className={isDark ? 'bg-gray-800/70' : 'bg-gray-50/80'}>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead className="hidden md:table-cell">Priority</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {currentAnnouncements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Bell className="h-8 w-8 text-muted-foreground/50" />
                          <p className="text-muted-foreground">No announcements found matching the current filters.</p>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => {
                              setSearchQuery('');
                              setTypeFilter('all');
                              setStatusFilter('all');
                            }}
                            className={`mt-2 ${isDark ? 'bg-gray-800 text-gray-300 border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}
                          >
                            Reset filters
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentAnnouncements.map((announcement, index) => (
                      <TableRow 
                        key={announcement.id}
                        className={`group ${isDark ? 'border-gray-700' : 'border-gray-200'} hover:bg-primary/5`}
                      >
                        <TableCell>
                          <div className="font-medium">{announcement.title}</div>
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {announcement.content}
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={typeStyles[announcement.type as keyof typeof typeStyles]}>
                            {announcement.type.charAt(0).toUpperCase() + announcement.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={priorityStyles[announcement.priority as keyof typeof priorityStyles]}>
                            {announcement.priority.charAt(0).toUpperCase() + announcement.priority.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge className={statusStyles[announcement.status as keyof typeof statusStyles]}>
                            {announcement.status.charAt(0).toUpperCase() + announcement.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                          {formatDate(announcement.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 group-hover:bg-primary/10">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className={isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}>
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem 
                                onClick={() => handleViewAnnouncement(announcement)}
                                className="cursor-pointer flex items-center"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer flex items-center">
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className={isDark ? 'bg-gray-700' : 'bg-gray-200'} />
                              <DropdownMenuItem 
                                className={`cursor-pointer flex items-center ${isDark ? 'text-red-400 focus:text-red-400' : 'text-red-600 focus:text-red-600'}`}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className={`flex items-center justify-between border-t ${isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/50'}`}>
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : `cursor-pointer ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  
                  if (
                    pageNumber === 1 || 
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={pageNumber === currentPage}
                          onClick={() => paginate(pageNumber)}
                          className={pageNumber === currentPage ? "bg-primary text-white" : ""}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  
                  return null;
                })}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : `cursor-pointer ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </motion.div>

      {/* View Announcement Dialog */}
      {selectedAnnouncement && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className={`sm:max-w-[600px] ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <DialogHeader>
              <div className="flex items-center gap-2">
                <Badge className={typeStyles[selectedAnnouncement.type as keyof typeof typeStyles]}>
                  {selectedAnnouncement.type.charAt(0).toUpperCase() + selectedAnnouncement.type.slice(1)}
                </Badge>
                <Badge className={priorityStyles[selectedAnnouncement.priority as keyof typeof priorityStyles]}>
                  {selectedAnnouncement.priority.charAt(0).toUpperCase() + selectedAnnouncement.priority.slice(1)}
                </Badge>
                <Badge className={statusStyles[selectedAnnouncement.status as keyof typeof statusStyles]}>
                  {selectedAnnouncement.status.charAt(0).toUpperCase() + selectedAnnouncement.status.slice(1)}
                </Badge>
              </div>
              <DialogTitle className="text-xl mt-2">{selectedAnnouncement.title}</DialogTitle>
              <DialogDescription className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Created by {selectedAnnouncement.createdBy} • {formatDate(selectedAnnouncement.createdAt)}
              </DialogDescription>
            </DialogHeader>
            <div className={`p-4 rounded-md ${isDark ? 'bg-gray-900/50' : 'bg-gray-50'} my-2`}>
              <p className="whitespace-pre-line">{selectedAnnouncement.content}</p>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Audience:</span>
                <span className="font-medium">{selectedAnnouncement.audience.join(', ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">{formatDate(selectedAnnouncement.expiresAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Views:</span>
                <span className="font-medium">{selectedAnnouncement.views}</span>
              </div>
            </div>
            <DialogFooter className="flex justify-between mt-4">
              <Button
                variant="outline"
                className={isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'}
                onClick={() => setIsViewDialogOpen(false)}
              >
                Close
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="default" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Publish
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default Announcements; 