import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminUsers } from '@/hooks/useAdminUsers';
import { useToast } from '@/components/ui/use-toast';
import { 
  Search, 
  PlusCircle, 
  MoreHorizontal, 
  Filter, 
  Download, 
  Trash2, 
  Edit, 
  UserPlus,
  Building2,
  BadgeCheck,
  ShieldCheck,
  Check,
  X,
  Eye,
  Save
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Switch
} from "@/components/ui/switch";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  lastActive: string;
  verified: boolean;
}

const roleIcons = {
  Manufacturer: <Building2 className="h-4 w-4 text-blue-500" />,
  Brand: <BadgeCheck className="h-4 w-4 text-purple-500" />,
  Retailer: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
  Admin: <ShieldCheck className="h-4 w-4 text-amber-500" />
};

const statusStyles = {
  active: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
  inactive: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
};

const UserManagement = () => {
  const { users, loading, error, fetchUsers, deleteUser, updateUserRole, updateUserStatus, updateUserProfile } = useAdminUsers();
  const { toast } = useToast();
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: '',
    company: ''
  });
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // New states for user profile view/edit
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<Partial<User>>({});

  // Handle search and filtering
  useEffect(() => {
    let result = [...users];
    
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query) ||
          user.company.toLowerCase().includes(query)
      );
    }
    
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role.toLowerCase() === roleFilter.toLowerCase());
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status.toLowerCase() === statusFilter.toLowerCase());
    }
    
    setFilteredUsers(result);
    setCurrentPage(1); // Reset to first page
  }, [searchQuery, roleFilter, statusFilter, users]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Toggle select all users
  const toggleSelectAll = () => {
    if (selectedUsers.length === currentUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(currentUsers.map(user => user.id));
    }
  };

  // Toggle select a single user
  const toggleSelectUser = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Handle user profile view
  const handleViewProfile = (user: User) => {
    setSelectedUser(user);
    setEditedUser({...user});
    setIsEditing(false);
    setIsProfileOpen(true);
  };

  // Handle edit mode toggle
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing && selectedUser) {
      setEditedUser({...selectedUser});
    }
  };

  // Handle edited user field changes
  const handleEditChange = (field: keyof User, value: any) => {
    setEditedUser({...editedUser, [field]: value});
  };

  // Handle save profile changes
  const handleSaveProfile = async () => {
    if (!selectedUser || !editedUser) return;
    
    try {
      await updateUserProfile(selectedUser.id, editedUser);
      setIsEditing(false);
      setSelectedUser({...selectedUser, ...editedUser});
      toast({
        title: "Success",
        description: "User profile updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user profile",
        variant: "destructive",
      });
    }
  };

  // Handle user actions
  const handleAddUser = () => {
    // In a real app, this would send data to an API
    const newUserId = (Math.max(...users.map(user => parseInt(user.id, 10) || 0)) + 1).toString();
    const userToAdd: User = {
      id: newUserId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      company: newUser.company,
      status: 'pending',
      lastActive: 'Never',
      verified: false
    };
    
    // In a real app we would call an API to create the user
    // For now just fetch users again to refresh the list
    fetchUsers();
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'Brand', company: '' });
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        toast({
          title: "Success",
          description: "User deleted successfully",
        });
        setDeleteConfirmOpen(false);
        setUserToDelete(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete user",
          variant: "destructive",
        });
      }
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedUsers.map(id => deleteUser(id)));
      setSelectedUsers([]);
      toast({
        title: "Success",
        description: "Selected users deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete some users",
        variant: "destructive",
      });
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive' | 'pending' | 'suspended') => {
    try {
      await updateUserStatus(userId, newStatus);
      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with the following details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="John Doe"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="john.doe@example.com" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({...newUser, role: value})}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                      <SelectItem value="Brand">Brand</SelectItem>
                      <SelectItem value="Retailer">Retailer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="company">Company</Label>
                  <Input 
                    id="company" 
                    value={newUser.company}
                    onChange={(e) => setNewUser({...newUser, company: e.target.value})}
                    placeholder="Company Name" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>Cancel</Button>
                <Button onClick={handleAddUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {selectedUsers.length > 0 && (
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          )}
        </div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-col md:flex-row gap-3"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-3 flex-wrap md:flex-nowrap">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Role: {roleFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="manufacturer">Manufacturer</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="retailer">Retailer</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Status: {statusFilter}</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>

      {/* User Table */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>Users</CardTitle>
              <CardDescription>
                Showing {currentUsers.length} of {filteredUsers.length} users
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table className="mt-2">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox 
                      checked={selectedUsers.length === currentUsers.length && currentUsers.length > 0} 
                      onCheckedChange={toggleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="hidden md:table-cell">Company</TableHead>
                  <TableHead className="hidden md:table-cell">Role</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {currentUsers.map((user) => (
                    <motion.tr
                      key={user.id}
                      variants={childVariants}
                      exit={{ opacity: 0, x: -100 }}
                      layout
                      className="group"
                    >
                      <TableCell>
                        <Checkbox 
                          checked={selectedUsers.includes(user.id)} 
                          onCheckedChange={() => toggleSelectUser(user.id)}
                          aria-label={`Select ${user.name}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={`https://avatars.dicebear.com/api/initials/${user.name.replace(/\s+/g, '')}.svg`} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">
                            <div>{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                          {user.verified && (
                            <Badge variant="outline" className="hidden sm:flex bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                              <Check className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-medium">
                        {user.company}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-1">
                          {roleIcons[user.role as keyof typeof roleIcons]}
                          {user.role}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge className={statusStyles[user.status as keyof typeof statusStyles]}>
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <span className="text-xs text-muted-foreground mr-4">{user.lastActive}</span>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => handleViewProfile(user)}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                onClick={() => {
                                  handleViewProfile(user);
                                  setIsEditing(true);
                                }}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="cursor-pointer text-red-600 focus:text-red-600" 
                                onClick={() => {
                                  setUserToDelete(user);
                                  setDeleteConfirmOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {currentUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No users found matching the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing page {currentPage} of {totalPages}
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => paginate(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => {
                  const pageNumber = index + 1;
                  
                  // Show current page, first, last, and pages around current
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
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  }
                  
                  // Show ellipsis for gaps
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
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the user: <span className="font-medium">{userToDelete?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* User Profile View/Edit Dialog */}
      <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{isEditing ? 'Edit User Profile' : 'User Profile'}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleToggleEdit}
                className="flex items-center gap-1 text-xs"
              >
                {isEditing ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span>View Mode</span>
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    <span>Edit Mode</span>
                  </>
                )}
              </Button>
            </DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Edit the user information below and save when done.' 
                : `Viewing user profile for ${selectedUser?.name}.`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="py-4">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Basic Info</TabsTrigger>
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="permissions">Permissions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4 pt-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://avatars.dicebear.com/api/initials/${selectedUser.name.replace(/\s+/g, '')}.svg`} />
                      <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h3 className="text-lg font-medium">{selectedUser.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Full Name</Label>
                      {isEditing ? (
                        <Input 
                          id="edit-name"
                          value={editedUser.name || ''}
                          onChange={(e) => handleEditChange('name', e.target.value)}
                        />
                      ) : (
                        <div className="p-2 rounded-md border">{selectedUser.name}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      {isEditing ? (
                        <Input 
                          id="edit-email"
                          value={editedUser.email || ''}
                          onChange={(e) => handleEditChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="p-2 rounded-md border">{selectedUser.email}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-company">Company</Label>
                      {isEditing ? (
                        <Input 
                          id="edit-company"
                          value={editedUser.company || ''}
                          onChange={(e) => handleEditChange('company', e.target.value)}
                        />
                      ) : (
                        <div className="p-2 rounded-md border">{selectedUser.company}</div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-last-active">Last Active</Label>
                      <div className="p-2 rounded-md border bg-muted">{selectedUser.lastActive}</div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="account" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-role">Role</Label>
                      {isEditing ? (
                        <Select 
                          value={editedUser.role}
                          onValueChange={(value) => handleEditChange('role', value)}
                        >
                          <SelectTrigger id="edit-role">
                            <SelectValue placeholder="Select a role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                            <SelectItem value="Brand">Brand</SelectItem>
                            <SelectItem value="Retailer">Retailer</SelectItem>
                            <SelectItem value="Admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className="p-2 rounded-md border flex items-center gap-2">
                          {roleIcons[selectedUser.role as keyof typeof roleIcons]}
                          {selectedUser.role}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-status">Status</Label>
                      {isEditing ? (
                        <Select 
                          value={editedUser.status}
                          onValueChange={(value: any) => handleEditChange('status', value)}
                        >
                          <SelectTrigger id="edit-status">
                            <SelectValue placeholder="Select a status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge className={statusStyles[selectedUser.status as keyof typeof statusStyles]}>
                          {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="edit-verified">Email Verified</Label>
                      <div className="flex items-center gap-2">
                        {isEditing ? (
                          <Switch 
                            checked={editedUser.verified}
                            onCheckedChange={(checked) => handleEditChange('verified', checked)}
                          />
                        ) : (
                          selectedUser.verified ? (
                            <Badge variant="outline" className="flex bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800">
                              <Check className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="flex bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800">
                              <X className="h-3 w-3 mr-1" />
                              Not Verified
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="permissions" className="space-y-4 pt-4">
                  <p className="text-sm text-muted-foreground">
                    Permission settings for this user based on their role.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Access Dashboard</Label>
                        <p className="text-sm text-muted-foreground">User can access the main dashboard</p>
                      </div>
                      <Switch checked disabled={!isEditing} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Manage Products</Label>
                        <p className="text-sm text-muted-foreground">User can create and manage products</p>
                      </div>
                      <Switch checked={selectedUser.role === 'Manufacturer' || selectedUser.role === 'Brand'} disabled={!isEditing} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">View Analytics</Label>
                        <p className="text-sm text-muted-foreground">User can view analytics data</p>
                      </div>
                      <Switch checked disabled={!isEditing} />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          
          <DialogFooter>
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  setEditedUser(selectedUser || {});
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSaveProfile}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsProfileOpen(false)}>
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement; 