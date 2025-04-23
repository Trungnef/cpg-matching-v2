import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
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
  Check,
  X,
  RefreshCw,
  FileDown,
  FileText,
  MoonStar,
  SunMedium,
  Users,
  Plus,
  Loader2,
  ArrowUp,
  ArrowDown,
  UserCog,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  AlertCircle,
  Shield,
  Edit2,
  AlertOctagon,
  Info,
  UserX
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
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { PageTitle } from '@/components/PageTitle';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Factory,
  BookOpen,
  ShoppingBag,
  ShieldCheck
} from "lucide-react";

// User type definition
interface User {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: string;
  lastActive: string;
  verified?: boolean;
  phone: string;
  position: string;
  notes: string;
  avatar: string;
}

// Sample users data
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Manufacturer",
    company: "Green Foods Corp",
    status: "active",
    lastActive: "2 hours ago",
    verified: true,
    phone: "+1 (555) 123-4567",
    position: "Product Manager",
    notes: "Experienced in organic food production",
    avatar: "https://example.com/john-doe.jpg"
  },
  {
    id: "2",
    name: "Alice Smith",
    email: "alice.smith@example.com",
    role: "Brand",
    company: "Healthy Harvest",
    status: "active",
    lastActive: "1 day ago",
    verified: true,
    phone: "+1 (555) 234-5678",
    position: "Brand Manager",
    notes: "Strong background in brand development",
    avatar: "https://example.com/alice-smith.jpg"
  },
  {
    id: "3",
    name: "Robert Wilson",
    email: "robert.wilson@example.com",
    role: "Retailer",
    company: "Fresh Choice Markets",
    status: "inactive",
    lastActive: "1 week ago",
    verified: true,
    phone: "+1 (555) 345-6789",
    position: "Store Manager",
    notes: "Experienced in retail operations",
    avatar: "https://example.com/robert-wilson.jpg"
  },
  {
    id: "4",
    name: "Emily Jackson",
    email: "emily.jackson@example.com",
    role: "Brand",
    company: "Organic Essentials",
    status: "pending",
    lastActive: "Never",
    verified: false,
    phone: "+1 (555) 456-7890",
    position: "Brand Associate",
    notes: "Learning about organic products",
    avatar: "https://example.com/emily-jackson.jpg"
  },
  {
    id: "5",
    name: "Michael Chen",
    email: "michael.chen@example.com",
    role: "Manufacturer",
    company: "Pure Foods Inc",
    status: "active",
    lastActive: "3 hours ago",
    verified: true,
    phone: "+1 (555) 567-8901",
    position: "Production Supervisor",
    notes: "Leads production team",
    avatar: "https://example.com/michael-chen.jpg"
  },
  {
    id: "6",
    name: "Sarah Lee",
    email: "sarah.lee@example.com",
    role: "Retailer",
    company: "Metro Grocers",
    status: "active",
    lastActive: "12 hours ago",
    verified: true,
    phone: "+1 (555) 678-9012",
    position: "Store Associate",
    notes: "Provides customer service",
    avatar: "https://example.com/sarah-lee.jpg"
  },
  {
    id: "7",
    name: "David Miller",
    email: "david.miller@example.com",
    role: "Brand",
    company: "Naturals Co.",
    status: "suspended",
    lastActive: "1 month ago",
    verified: true,
    phone: "+1 (555) 789-0123",
    position: "Brand Representative",
    notes: "Handles brand partnerships",
    avatar: "https://example.com/david-miller.jpg"
  },
  {
    id: "8",
    name: "Jennifer Kim",
    email: "jennifer.kim@example.com",
    role: "Manufacturer",
    company: "Eco Foods",
    status: "pending",
    lastActive: "Never",
    verified: false,
    phone: "+1 (555) 890-1234",
    position: "Quality Control Specialist",
    notes: "Ensures product quality",
    avatar: "https://example.com/jennifer-kim.jpg"
  }
];

const roleIcons = {
  Manufacturer: <Building2 className="h-4 w-4 text-blue-500" />,
  Brand: <BadgeCheck className="h-4 w-4 text-purple-500" />,
  Retailer: <ShieldCheck className="h-4 w-4 text-emerald-500" />,
  Admin: <ShieldCheck className="h-4 w-4 text-amber-500" />
};

// Define columns for sorting
const columns = [
  { key: 'name', label: 'User' },
  { key: 'company', label: 'Company' },
  { key: 'role', label: 'Role' },
  { key: 'status', label: 'Status' },
  { key: 'lastActive', label: 'Last Active' }
];

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User',
    company: '',
    status: 'Active',
    phone: '',
    position: '',
    notes: '',
    joinDate: new Date().toISOString().split('T')[0]
  });
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteMultipleOpen, setIsDeleteMultipleOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof User;
    direction: "ascending" | "descending";
  } | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");
  const [changeRoleNotes, setChangeRoleNotes] = useState("");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Define statusStyles within the component where isDark is available
  const statusStyles = {
    active: `${isDark 
      ? 'bg-emerald-900/30 text-emerald-400 border-emerald-800' 
      : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`,
    inactive: `${isDark 
      ? 'bg-slate-900/30 text-slate-400 border-slate-800' 
      : 'bg-slate-50 text-slate-700 border-slate-200'}`,
    pending: `${isDark 
      ? 'bg-amber-900/30 text-amber-400 border-amber-800' 
      : 'bg-amber-50 text-amber-700 border-amber-200'}`,
    suspended: `${isDark 
      ? 'bg-red-900/30 text-red-400 border-red-800' 
      : 'bg-red-50 text-red-700 border-red-200'}`
  };

  // Function to filter users based on search query and filters
  const getFilteredUsers = (userList: User[], search: string, role: string, status: string) => {
    return userList.filter(user => {
      const matchesSearch = search === '' || 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.company.toLowerCase().includes(search.toLowerCase()) ||
        user.role.toLowerCase().includes(search.toLowerCase());
      
      const matchesRole = role === 'all' || role === '' || user.role.toLowerCase() === role.toLowerCase();
      const matchesStatus = status === 'all' || status === '' || user.status.toLowerCase() === status.toLowerCase();
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Simulating a loading state when page changes
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentPage]);

  // Simulate fetching users
  useEffect(() => {
    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setFilteredUsers(mockUsers);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Update the useEffect that filters users
  useEffect(() => {
    const filtered = getFilteredUsers(users, searchQuery, roleFilter, statusFilter);
    setFilteredUsers(filtered);
    // Reset to page 1 when filters change
    setCurrentPage(1);
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  // Add a safeguard to ensure we have users to display
  const currentUsers = filteredUsers.length > 0 
    ? filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
    : [];
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

  // Simulate adding a new user with form validation
  const handleAddUser = () => {
    // Basic validation
    if (!newUser.name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter a name for the user",
        variant: "destructive"
      });
      return;
    }

    if (!newUser.email.trim() || !/^\S+@\S+\.\S+$/.test(newUser.email)) {
      toast({
        title: "Valid email is required",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (!newUser.company.trim()) {
      toast({
        title: "Company is required",
        description: "Please enter a company name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const newId = String(Math.max(...mockUsers.map(u => parseInt(u.id))) + 1);
      const userToAdd: User = {
        id: newId,
      name: newUser.name,
      email: newUser.email,
      company: newUser.company,
        role: newUser.role,
      status: 'pending',
        lastActive: 'Just now',
        verified: false,
        phone: newUser.phone,
        position: newUser.position,
        notes: newUser.notes,
        avatar: "https://example.com/new-user.jpg"
      };
      
      const updatedUsers = [userToAdd, ...users];
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setNewUser({ name: '', email: '', role: 'Brand', company: '', status: 'pending', phone: '', position: '', notes: '', joinDate: new Date().toISOString().split('T')[0] });
      setIsAddUserDialogOpen(false);
      setLoading(false);
      
      toast({
        title: "User created successfully",
        description: `${userToAdd.name} has been added to the system`,
      });
    }, 600);
  };

  // Handle edit user
  const handleEditUser = () => {
    if (!editUser) return;

    // Basic validation
    if (!editUser.name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter a name for the user",
        variant: "destructive"
      });
      return;
    }

    if (!editUser.email.trim() || !/^\S+@\S+\.\S+$/.test(editUser.email)) {
      toast({
        title: "Valid email is required",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    if (!editUser.company.trim()) {
      toast({
        title: "Company is required",
        description: "Please enter a company name",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      const updatedUsers = users.map(user => 
        user.id === editUser.id ? editUser : user
      );
      
      setUsers(updatedUsers);
      setFilteredUsers(getFilteredUsers(updatedUsers, searchQuery, roleFilter, statusFilter));
      setIsEditUserOpen(false);
      setEditUser(null);
      setLoading(false);
      
      toast({
        title: "User updated successfully",
        description: `${editUser.name}'s information has been updated`,
      });
    }, 600);
  };

  // Simulate deleting a user
  const handleDeleteUser = () => {
    if (userToDelete) {
      setLoading(true);
      
      setTimeout(() => {
        const updatedUsers = users.filter(user => user.id !== userToDelete.id);
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
      setSelectedUsers(selectedUsers.filter(id => id !== userToDelete.id));
        setDeleteDialogOpen(false);
      setUserToDelete(null);
        setLoading(false);
        
        toast({
          title: "User deleted",
          description: "The user has been removed from the system",
        });
      }, 600);
    }
  };
  
  // Simulate bulk deleting users
  const handleDeleteMultipleUsers = () => {
    if (selectedUsers.length === 0) return;
    
    setLoading(true);
    
    setTimeout(() => {
      const updatedUsers = users.filter(user => !selectedUsers.includes(user.id));
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
    setSelectedUsers([]);
      setIsDeleteMultipleOpen(false);
      setLoading(false);
      
      toast({
        title: `${selectedUsers.length} users deleted`,
        description: "The selected users have been removed from the system",
      });
    }, 600);
  };

  const focusSearchInput = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
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
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  const tableRowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: i * 0.05,
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }),
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    },
    hover: {
      backgroundColor: "rgba(var(--primary), 0.05)",
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    idle: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { 
        duration: 0.2,
        type: "spring",
        stiffness: 400
      }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
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

  // Function to handle sorting of table data
  const requestSort = (key: keyof User) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };

  const handleChangeRole = () => {
    if (!selectedUser || !newRole) return;
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedUsers = users.map(user => {
        if (user.id === selectedUser.id) {
          return { ...user, role: newRole };
        }
        return user;
      });
      
      setUsers(updatedUsers);
      setFilteredUsers(getFilteredUsers(updatedUsers, searchQuery, roleFilter, statusFilter));
      
      toast({
        title: "Role Updated",
        description: `${selectedUser.name}'s role has been updated to ${newRole}`,
      });
      
      setIsChangeRoleOpen(false);
      setSelectedUser(null);
      setNewRole("");
      setChangeRoleNotes("");
      setLoading(false);
    }, 1000);
  };

  // Enhanced animations for dialogs
  const dialogVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { type: "spring", duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      transition: { duration: 0.2 }
    }
  };

  // Add user form reset function
  const resetAddUserForm = () => {
    setNewUser({
      name: '',
      email: '',
      role: 'Brand',
      company: '',
      status: 'pending',
      phone: '',
      position: '',
      notes: '',
      joinDate: new Date().toISOString().split('T')[0]
    });
    setCompany('');
    setJobTitle('');
  };

  // Handle add user dialog closing
  const handleAddUserDialogChange = (open: boolean) => {
    setIsAddUserDialogOpen(open);
    if (!open) {
      resetAddUserForm();
    }
  };

  // Edit user form reset function
  const resetEditUserForm = () => {
    setEditUser(null);
  };

  // Handle edit user dialog closing
  const handleEditUserDialogChange = (open: boolean) => {
    setIsEditUserOpen(open);
    if (!open) {
      resetEditUserForm();
    }
  };

  // Change role form reset function
  const resetChangeRoleForm = () => {
    setSelectedUser(null);
  };

  // Handle change role dialog closing
  const handleChangeRoleDialogChange = (open: boolean) => {
    setIsChangeRoleOpen(open);
    if (!open) {
      resetChangeRoleForm();
    }
  };

  // Enhanced Delete confirmation dialog
  const DeleteUserDialog = ({ isOpen, setIsOpen, user }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void; user: User | null }) => {
    if (!user) return null;

    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className={cn(
          "sm:max-w-md border",
          isDark ? "bg-slate-900 border-slate-700 text-white" : "bg-white border-slate-200"
        )}>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <DialogHeader>
              <DialogTitle className={cn(
                "text-xl font-bold",
                isDark ? "text-white" : "text-slate-900"
              )}>Confirm Deletion</DialogTitle>
              <DialogDescription className={isDark ? "text-slate-300" : "text-slate-600"}>
                Are you sure you want to delete user <span className="font-semibold">{user.name}</span>?
              </DialogDescription>
            </DialogHeader>

            <div className="flex items-center justify-center mt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "p-4 rounded-full mb-2",
                  isDark ? "bg-slate-800" : "bg-slate-100"
                )}
              >
                <UserX size={40} className="text-red-500" />
              </motion.div>
            </div>

            <p className={cn(
              "text-center mt-2 mb-4 text-sm",
              isDark ? "text-slate-300" : "text-slate-600"
            )}>
              This action cannot be undone. This will permanently remove the user from the system.
            </p>

            <DialogFooter className="flex space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex-1",
                  isDark 
                    ? "text-white hover:text-white hover:bg-slate-800 border-slate-700" 
                    : "border-slate-200 hover:bg-slate-100"
                )}
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center"
                >
                  Cancel
                </motion.span>
              </Button>
              <Button 
                variant="destructive"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={() => {
                  // Delete logic here
                  setIsOpen(false);
                }}
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </motion.span>
              </Button>
            </DialogFooter>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <motion.div className="relative flex flex-col items-center">
        <motion.div
            variants={loadingVariants}
            animate="animate"
            className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
          />
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.3 }}
            className="mt-4 text-primary font-medium"
          >
            Loading user data...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div
        className="p-6 space-y-6 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isMounted ? 1 : 0, y: isMounted ? 0 : 20 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-col gap-2">
          <PageTitle
            title="User Management"
            description="View and manage user accounts"
            icon={<Users className="h-6 w-6" />}
                  />
                </div>

        <motion.div 
          className="flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
              ref={searchInputRef}
              type="search"
              placeholder="Search users..."
              className="pl-8 w-full bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
          <div className="flex gap-2">
          {selectedUsers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Button 
                  variant="destructive" 
                  onClick={() => setIsDeleteMultipleOpen(true)}
                  className="flex items-center"
                >
              <Trash2 className="mr-2 h-4 w-4" />
                  Delete Selected ({selectedUsers.length})
            </Button>
              </motion.div>
            )}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <Button onClick={() => setIsAddUserDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </motion.div>
        </div>
      </motion.div>

      <motion.div
          className="flex flex-wrap items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <Select 
            defaultValue="all" 
            value={roleFilter}
            onValueChange={setRoleFilter}
          >
            <SelectTrigger className="w-[120px] h-8">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Role</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manufacturer">Manufacturer</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
              <SelectItem value="retailer">Retailer</SelectItem>
            </SelectContent>
          </Select>
          
          <Select 
            defaultValue="all"
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-[140px] h-8">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                <span>Status</span>
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
          
          <Button variant="outline" size="sm" className="h-8 px-3 group">
            <FileText className="h-3.5 w-3.5 mr-2 group-hover:text-primary transition-colors" />
            Export
          </Button>
      </motion.div>

        <div className="border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
      <motion.div
                className="flex justify-center items-center p-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </motion.div>
            ) : (
              <Table>
              <TableHeader>
                  <TableRow className={isDark ? "hover:bg-secondary/30" : "hover:bg-secondary/20"}>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedUsers.length === users.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedUsers(users.map((user) => user.id));
                          } else {
                            setSelectedUsers([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead 
                      key="name"
                      className={cn("w-[300px] cursor-pointer select-none transition-colors", 
                        sortConfig?.key === "name" ? "text-primary font-medium" : ""
                      )}
                      onClick={() => requestSort("name" as keyof User)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>User</span>
                        {sortConfig?.key === "name" && (
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {sortConfig.direction === "ascending" ? 
                              <ArrowUp className="h-3.5 w-3.5" /> : 
                              <ArrowDown className="h-3.5 w-3.5" />
                            }
                          </motion.span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      key="company"
                      className={cn("w-[180px] cursor-pointer select-none transition-colors", 
                        sortConfig?.key === "company" ? "text-primary font-medium" : ""
                      )}
                      onClick={() => requestSort("company" as keyof User)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Company</span>
                        {sortConfig?.key === "company" && (
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {sortConfig.direction === "ascending" ? 
                              <ArrowUp className="h-3.5 w-3.5" /> : 
                              <ArrowDown className="h-3.5 w-3.5" />
                            }
                          </motion.span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      key="role"
                      className={cn("w-[120px] cursor-pointer select-none transition-colors", 
                        sortConfig?.key === "role" ? "text-primary font-medium" : ""
                      )}
                      onClick={() => requestSort("role" as keyof User)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Role</span>
                        {sortConfig?.key === "role" && (
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {sortConfig.direction === "ascending" ? 
                              <ArrowUp className="h-3.5 w-3.5" /> : 
                              <ArrowDown className="h-3.5 w-3.5" />
                            }
                          </motion.span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      key="status"
                      className={cn("w-[120px] cursor-pointer select-none transition-colors", 
                        sortConfig?.key === "status" ? "text-primary font-medium" : ""
                      )}
                      onClick={() => requestSort("status" as keyof User)}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Status</span>
                        {sortConfig?.key === "status" && (
                          <motion.span 
                            initial={{ opacity: 0, scale: 0.8 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            {sortConfig.direction === "ascending" ? 
                              <ArrowUp className="h-3.5 w-3.5" /> : 
                              <ArrowDown className="h-3.5 w-3.5" />
                            }
                          </motion.span>
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
              <TableBody>
                  <AnimatePresence mode="wait">
                    {isSearching ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <motion.div 
                            className="flex justify-center items-center space-x-2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                            >
                              <RefreshCw className="h-4 w-4 text-primary" />
                            </motion.div>
                            <span>Searching...</span>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ) : currentUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="h-24 text-center">
                          <motion.div 
                            className="flex flex-col items-center justify-center space-y-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <motion.div
                              initial={{ scale: 0.9 }}
                              animate={{ scale: [0.9, 1.1, 0.9] }}
                              transition={{ duration: 3, repeat: Infinity }}
                            >
                              <FileText className="h-8 w-8 text-muted-foreground/50" />
                            </motion.div>
                            <p className="text-muted-foreground">No users found matching the current filters.</p>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => {
                                setSearchQuery('');
                                setRoleFilter('all');
                                setStatusFilter('all');
                              }}
                              className={`mt-2 ${isDark ? 'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600' : 'bg-white text-gray-700 border-gray-300'}`}
                            >
                              <motion.div
                                className="mr-2"
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                              >
                                <RefreshCw className="h-3 w-3" />
                              </motion.div>
                              Reset filters
                            </Button>
                          </motion.div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.05, 
                            ease: "easeOut" 
                          }}
                          className={cn(
                            "group relative border-b",
                            isDark 
                              ? "hover:bg-slate-800/40 border-slate-700/50" 
                              : "hover:bg-slate-50 border-slate-200/70"
                          )}
                        >
                          <TableCell className="p-4 w-[50px]">
                            <Checkbox
                              checked={selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedUsers([...selectedUsers, user.id]);
                                } else {
                                  setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                                }
                              }}
                              className="transition-all duration-200 data-[state=checked]:bg-primary"
                            />
                          </TableCell>
                          <TableCell className="p-4 w-[300px]">
                            <div className="flex items-center">
                              <motion.div 
                                className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center mr-3 text-primary shadow-sm"
                                whileHover={{ scale: 1.1 }}
                                transition={{ duration: 0.2 }}
                              >
                                {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                              </motion.div>
                              <div className="flex flex-col">
                                <span className="font-medium">{user.name}</span>
                                <span className="text-sm text-muted-foreground">{user.email}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="p-4 w-[180px]">
                            <span className="font-medium">{user.company}</span>
                          </TableCell>
                          <TableCell className="p-4 w-[120px]">
                            <div className="flex items-center">
                              {roleIcons[user.role as keyof typeof roleIcons]}
                              <span className="ml-2">{user.role}</span>
                            </div>
                          </TableCell>
                          <TableCell className="p-4 w-[120px]">
                            <Badge variant="outline" className={statusStyles[user.status as keyof typeof statusStyles]}>
                              <motion.div
                                className={`h-2 w-2 rounded-full mr-2 ${
                                  user.status === 'active' ? 'bg-green-500' : 
                                  user.status === 'inactive' ? 'bg-gray-500' : 
                                  user.status === 'pending' ? 'bg-yellow-500' : 
                                  'bg-red-500'
                                }`}
                                animate={user.status === 'active' ? { scale: [1, 1.2, 1] } : {}}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                              />
                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="p-4 w-[100px]">
                            <div className="flex items-center justify-end gap-3">
                              {/* <motion.button
                                whileHover={{ scale: 1.15 }}
                                whileTap={{ scale: 0.95 }}
                                className={`rounded-full p-2 ${
                                  isDark 
                                    ? 'bg-slate-800/50 hover:bg-slate-700 hover:text-primary-400' 
                                    : 'bg-slate-100/70 hover:bg-slate-200 hover:text-primary-600'
                                } transition-all shadow-sm`}
                                onClick={() => {
                                  setEditUser(user);
                                  setIsEditUserOpen(true);
                                }}
                              >
                                <Edit2 className="h-4 w-4 text-primary" />
                                <span className="sr-only">Edit User</span>
                              </motion.button> */}
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className={`h-9 w-9 rounded-full shadow-sm ${
                                      isDark 
                                        ? 'hover:bg-slate-700 data-[state=open]:bg-slate-700' 
                                        : 'hover:bg-slate-200 data-[state=open]:bg-slate-200'
                                    }`}
                                  >
                                    <span className="sr-only">Open menu</span>
                                    <MoreHorizontal className="h-5 w-5" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className={isDark ? 'bg-gray-800 border-gray-700 text-gray-200' : ''}>
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setNewRole(user.role);
                                      setIsChangeRoleOpen(true);
                                    }}
                                    className={`flex items-center gap-2 cursor-pointer ${isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`}
                                  >
                                    <UserCog className="h-4 w-4" />
                                    <span>Change Role</span>
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setEditUser(user);
                                      setIsEditUserOpen(true);
                                    }}
                                    className={`flex items-center gap-2 cursor-pointer ${isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                    <span>Edit User</span>
                                  </DropdownMenuItem>
                                  
                                  <DropdownMenuSeparator className={isDark ? 'bg-gray-700' : ''} />
                                  <DropdownMenuItem 
                                    onClick={() => {
                                      setUserToDelete(user);
                                      setDeleteDialogOpen(true);
                                    }}
                                    className={`flex items-center gap-2 cursor-pointer text-destructive ${isDark ? 'hover:bg-gray-700 focus:bg-gray-700' : ''}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Delete</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    )}
                  </AnimatePresence>
              </TableBody>
            </Table>
            )}
          </div>
        </div>
        
        {/* Pagination */}
        {!loading && (
          <motion.div 
            className="flex items-center justify-between py-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="text-sm text-muted-foreground">
              Showing {((currentPage - 1) * usersPerPage) + 1} - {Math.min(currentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Go to previous page</span>
                <motion.div
                  whileHover={{ x: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </motion.div>
              </Button>
              
              {Array.from({ length: Math.min(5, Math.ceil(filteredUsers.length / usersPerPage)) }).map((_, i) => {
                const pageNumber = i + 1;
                    return (
                  <Button
                    key={pageNumber}
                    variant={currentPage === pageNumber ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNumber)}
                    className={cn(
                      "h-8 w-8 p-0",
                      currentPage === pageNumber
                        ? "bg-primary"
                        : "hover:bg-primary/10"
                    )}
                  >
                    <motion.span
                      whileHover={{ scale: 1.2 }}
                      transition={{ duration: 0.2 }}
                        >
                          {pageNumber}
                    </motion.span>
                  </Button>
                );
              })}
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredUsers.length / usersPerPage), prev + 1))}
                disabled={currentPage === Math.ceil(filteredUsers.length / usersPerPage)}
                className="h-8 w-8 p-0"
              >
                <span className="sr-only">Go to next page</span>
                <motion.div
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronRight className="h-4 w-4" />
                </motion.div>
              </Button>
            </div>
          </motion.div>
        )}
        
        {/* Add User Dialog with enhanced UI and animations */}
        <Dialog open={isAddUserDialogOpen} onOpenChange={handleAddUserDialogChange}>
          <DialogContent className={`sm:max-w-lg overflow-hidden ${isDark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200'}`}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5 text-primary" />
                  Add New User
                </DialogTitle>
                <DialogDescription className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Complete the form below to add a new user to the system.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className={isDark ? 'text-slate-200' : ''}>Name</Label>
                    <Input
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                      placeholder="Enter full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className={isDark ? 'text-slate-200' : ''}>Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                      placeholder="user@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className={isDark ? 'text-slate-200' : ''}>Phone Number</Label>
                    <Input
                      id="phone"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="join-date" className={isDark ? 'text-slate-200' : ''}>Join Date</Label>
                    <Input
                      id="join-date"
                      type="date"
                      value={newUser.joinDate}
                      onChange={(e) => setNewUser({ ...newUser, joinDate: e.target.value })}
                      className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                    />
                  </div>
                </motion.div>
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="role" className={isDark ? 'text-slate-200' : ''}>Role</Label>
                    <Select 
                      value={newUser.role} 
                      onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                    >
                      <SelectTrigger className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Manufacturer">Manufacturer</SelectItem>
                        <SelectItem value="Brand">Brand</SelectItem>
                        <SelectItem value="Retailer">Retailer</SelectItem>
                        <SelectItem value="User">General User</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className={isDark ? 'text-slate-200' : ''}>Company</Label>
                    <Input
                      id="company"
                      value={newUser.company}
                      onChange={(e) => setNewUser({ ...newUser, company: e.target.value })}
                      className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                      placeholder="Company name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className={isDark ? 'text-slate-200' : ''}>Position</Label>
                    <Input
                      id="position"
                      value={newUser.position}
                      onChange={(e) => setNewUser({ ...newUser, position: e.target.value })}
                      className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}
                      placeholder="Job title or position"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status" className={isDark ? 'text-slate-200' : ''}>Status</Label>
                    <Select 
                      value={newUser.status} 
                      onValueChange={(value) => setNewUser({ ...newUser, status: value })}
                    >
                      <SelectTrigger className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}`}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent className={isDark ? 'bg-slate-800 border-slate-700 text-white' : ''}>
                        <SelectItem value="Active">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                            Active
                          </div>
                        </SelectItem>
                        <SelectItem value="Inactive">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                            Inactive
                          </div>
                        </SelectItem>
                        <SelectItem value="Suspended">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                            Suspended
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </motion.div>
              </div>
              <div className="mt-4 space-y-2">
                <Label htmlFor="notes" className={isDark ? 'text-slate-200' : ''}>Notes</Label>
                <Textarea
                  id="notes"
                  value={newUser.notes}
                  onChange={(e) => setNewUser({ ...newUser, notes: e.target.value })}
                  className={`${isDark ? 'bg-slate-800 border-slate-700 text-white' : ''} min-h-[80px]`}
                  placeholder="Additional information about this user"
                />
              </div>
              <motion.div 
                className={`mt-4 p-3 rounded-md ${
                  isDark ? 'bg-blue-900/20 border border-blue-900/30 text-blue-200' : 'bg-blue-50 border border-blue-100 text-blue-700'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                  <p className="text-sm">
                    Adding a user will send an invitation email to their address with instructions to set up their account.
                  </p>
                </div>
              </motion.div>
              <DialogFooter className="mt-6 gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddUserDialogOpen(false)}
                  className={isDark ? 'text-white hover:text-white hover:bg-slate-800 border-slate-700' : 'border-slate-200 hover:bg-slate-100'}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddUser}
                  className="relative overflow-hidden group"
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary-foreground/10 to-primary/0 opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
        
        {/* Edit User Dialog with improved UI */}
        <Dialog open={isEditUserOpen} onOpenChange={handleEditUserDialogChange}>
          <DialogContent className={`sm:max-w-md ${isDark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200 bg-white'}`}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Edit2 className="h-5 w-5 text-primary" />
                  Edit User
                </DialogTitle>
                <DialogDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Update user profile information and settings.
                </DialogDescription>
              </DialogHeader>
              
              {loading ? (
                <div className="py-8 flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  >
                    <Loader2 className="h-8 w-8 text-primary" />
                  </motion.div>
                  <p className="mt-4 text-sm text-muted-foreground">Updating user information...</p>
                </div>
              ) : editUser ? (
                <div className="mt-4 grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name" className="text-sm">Full Name</Label>
                      <Input 
                        id="edit-name" 
                        value={editUser.name}
                        onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                        className={isDark ? 'border-slate-700 bg-slate-800' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email" className="text-sm">Email Address</Label>
                      <Input 
                        id="edit-email" 
                        type="email"
                        value={editUser.email}
                        onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                        className={isDark ? 'border-slate-700 bg-slate-800' : ''}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-company" className="text-sm">Company</Label>
                      <Input 
                        id="edit-company" 
                        value={editUser.company}
                        onChange={(e) => setEditUser({...editUser, company: e.target.value})}
                        className={isDark ? 'border-slate-700 bg-slate-800' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone" className="text-sm">Phone Number</Label>
                      <Input 
                        id="edit-phone" 
                        value={editUser.phone || ''}
                        onChange={(e) => setEditUser({...editUser, phone: e.target.value})}
                        className={isDark ? 'border-slate-700 bg-slate-800' : ''}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-position" className="text-sm">Position/Title</Label>
                      <Input 
                        id="edit-position" 
                        value={editUser.position || ''}
                        onChange={(e) => setEditUser({...editUser, position: e.target.value})}
                        className={isDark ? 'border-slate-700 bg-slate-800' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-status" className="text-sm">Status</Label>
                      <Select 
                        value={editUser.status} 
                        onValueChange={(value) => setEditUser({...editUser, status: value})}
                      >
                        <SelectTrigger id="edit-status" className={isDark ? 'border-slate-700 bg-slate-800' : ''}>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                        <SelectContent className={isDark ? 'border-slate-700 bg-slate-800' : ''}>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-notes" className="text-sm">Notes</Label>
                    <Textarea 
                      id="edit-notes"
                      placeholder="Additional information about this user"
                      value={editUser.notes || ''}
                      onChange={(e) => setEditUser({...editUser, notes: e.target.value})}
                      className={`resize-none h-20 ${isDark ? 'border-slate-700 bg-slate-800' : ''}`}
                    />
                  </div>
                    
                  <motion.div 
                    className={`p-3 rounded-md ${
                      isDark ? 'bg-blue-900/20 border border-blue-900/30 text-blue-200' : 'bg-blue-50 border border-blue-100 text-blue-700'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                  >
                    <div className="flex items-start gap-2">
                      <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                      <p className="text-sm">
                        Updated information will be immediately applied to the user's account.
                      </p>
                    </div>
                  </motion.div>
                </div>
              ) : null}
              
              <DialogFooter className="mt-6 gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleEditUserDialogChange(false)}
                  className={isDark ? 'hover:bg-slate-800 border-slate-700' : ''}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditUser}
                  disabled={loading || !editUser?.name || !editUser?.email || !editUser?.company}
                  className={`${!editUser?.name || !editUser?.email || !editUser?.company ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>Update User</>
                  )}
                </Button>
              </DialogFooter>
            </motion.div>
          </DialogContent>
        </Dialog>
        
        {/* Delete Confirmation Dialog with improved theme handling */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className={`sm:max-w-md ${isDark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200 bg-white'}`}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
          <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-red-500 dark:text-red-400">
                  <AlertCircle className="h-5 w-5" />
                  Confirm Deletion
                </DialogTitle>
                <DialogDescription className={isDark ? 'text-slate-300' : 'text-slate-600'}>
                  Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
              <motion.div 
                className={`mt-4 p-4 rounded-md ${
                  isDark 
                    ? 'bg-red-950/40 border border-red-900/50 text-red-200' 
                    : 'bg-red-50 border border-red-100 text-red-800'
                }`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <div className="flex items-start gap-3">
                  <AlertOctagon className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5" />
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-red-300' : 'text-red-700'}`}>
                      User: {userToDelete?.name}
                    </p>
                    <p className={`text-sm ${isDark ? 'text-red-300/80' : 'text-red-600'}`}>
                      Email: {userToDelete?.email}
                    </p>
                    <p className={`text-sm mt-2 ${isDark ? 'text-red-300/80' : 'text-red-600'}`}>
                      This will permanently remove the user from your organization.
                    </p>
                  </div>
                </div>
              </motion.div>
              <DialogFooter className="mt-6 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                  className={`${isDark 
                    ? 'hover:bg-slate-800 border-slate-700 text-slate-200' 
                    : 'hover:bg-slate-100 text-slate-800'}`}
                >
              Cancel
            </Button>
                <Button 
                  variant="destructive"
                  onClick={handleDeleteUser}
                  className={`relative overflow-hidden group ${
                    isDark ? 'bg-red-700 hover:bg-red-600' : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  <motion.span 
                    className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-500/20 to-red-600/0 opacity-0 group-hover:opacity-100"
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  />
                  <Trash2 className="mr-2 h-4 w-4" />
              Delete User
            </Button>
          </DialogFooter>
            </motion.div>
        </DialogContent>
      </Dialog>
        
        {/* Bulk Delete Confirmation Dialog */}
        <Dialog open={isDeleteMultipleOpen} onOpenChange={setIsDeleteMultipleOpen}>
          <DialogContent className={`sm:max-w-[425px] ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Confirm Bulk Deletion
              </DialogTitle>
              <DialogDescription className={isDark ? 'text-gray-300' : ''}>
                Are you sure you want to delete {selectedUsers.length} users? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <motion.div 
              className={`p-4 my-2 rounded-md border ${isDark ? 'bg-red-900/20 border-red-800/50 text-gray-200' : 'bg-red-50 border-red-200'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <span className="font-medium">Selected users ({selectedUsers.length})</span>
              </div>
              
              <div className="max-h-[100px] overflow-y-auto">
                {selectedUsers.map(userId => {
                  const user = users.find(u => u.id === userId);
                  return user ? (
                    <div key={user.id} className="text-sm py-1 border-b last:border-b-0">
                      {user.name} ({user.email})
                    </div>
                  ) : null;
                })}
              </div>
            </motion.div>
            
            <DialogFooter className="gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => setIsDeleteMultipleOpen(false)}
                className={isDark ? 'border-gray-700 hover:bg-gray-700 text-gray-200' : ''}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive"
                onClick={handleDeleteMultipleUsers}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete {selectedUsers.length} Users
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Change Role Dialog with improved UI */}
        <Dialog open={isChangeRoleOpen} onOpenChange={handleChangeRoleDialogChange}>
          <DialogContent className={`sm:max-w-md ${isDark ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200 bg-white'}`}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                  Change User Role
                </DialogTitle>
                <DialogDescription className={isDark ? 'text-slate-400' : 'text-slate-500'}>
                  Update permissions by changing the user's role.
                </DialogDescription>
              </DialogHeader>
              
              {selectedUser && (
                <div className="mt-4 space-y-4">
                  <div className={`p-4 rounded-lg border ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10 border">
                        <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
                        <AvatarFallback className={isDark ? 'bg-slate-700' : ''}>
                          {selectedUser.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{selectedUser.name}</h4>
                        <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{selectedUser.email}</p>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                      <div className={`rounded py-1 px-2 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Company:</span> {selectedUser.company}
                      </div>
                      <div className={`rounded py-1 px-2 ${isDark ? 'bg-slate-700' : 'bg-slate-100'}`}>
                        <span className={isDark ? 'text-slate-400' : 'text-slate-500'}>Current Role:</span> {selectedUser.role}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <Label className="text-sm">Select New Role</Label>
                    <RadioGroup 
                      value={newRole || selectedUser.role} 
                      onValueChange={setNewRole}
                      className="grid grid-cols-2 gap-2"
                    >
                      <div>
                        <RadioGroupItem 
                          value="Admin" 
                          id="role-admin" 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor="role-admin"
                          className={`flex items-center gap-2 rounded-lg border p-3 hover:bg-slate-100 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 ${
                            isDark 
                            ? 'border-slate-700 hover:bg-slate-800' 
                            : 'border-slate-200'
                          }`}
                        >
                          <Shield className="h-4 w-4 text-primary" />
                          <div className="grid gap-0.5">
                            <span className="font-medium">Administrator</span>
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Full system access</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem 
                          value="Manufacturer" 
                          id="role-manufacturer" 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor="role-manufacturer"
                          className={`flex items-center gap-2 rounded-lg border p-3 hover:bg-slate-100 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 ${
                            isDark 
                            ? 'border-slate-700 hover:bg-slate-800' 
                            : 'border-slate-200'
                          }`}
                        >
                          <Factory className="h-4 w-4 text-primary" />
                          <div className="grid gap-0.5">
                            <span className="font-medium">Manufacturer</span>
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Manufacturing portal</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem 
                          value="Brand" 
                          id="role-brand" 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor="role-brand"
                          className={`flex items-center gap-2 rounded-lg border p-3 hover:bg-slate-100 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 ${
                            isDark 
                            ? 'border-slate-700 hover:bg-slate-800' 
                            : 'border-slate-200'
                          }`}
                        >
                          <BookOpen className="h-4 w-4 text-primary" />
                          <div className="grid gap-0.5">
                            <span className="font-medium">Brand</span>
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Brand management</span>
                          </div>
                        </Label>
                      </div>
                      
                      <div>
                        <RadioGroupItem 
                          value="Retailer" 
                          id="role-retailer" 
                          className="peer sr-only" 
                        />
                        <Label
                          htmlFor="role-retailer"
                          className={`flex items-center gap-2 rounded-lg border p-3 hover:bg-slate-100 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 ${
                            isDark 
                            ? 'border-slate-700 hover:bg-slate-800' 
                            : 'border-slate-200'
                          }`}
                        >
                          <ShoppingBag className="h-4 w-4 text-primary" />
                          <div className="grid gap-0.5">
                            <span className="font-medium">Retailer</span>
                            <span className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Retail operations</span>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <DialogFooter className="mt-6 gap-2">
                    <Button
                      variant="outline"
                      onClick={() => handleChangeRoleDialogChange(false)}
                      className={isDark ? 'hover:bg-slate-800 border-slate-700' : ''}
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleChangeRole}
                      disabled={!newRole || newRole === selectedUser.role}
                      className={`${!newRole || newRole === selectedUser.role ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Update Role
                    </Button>
                  </DialogFooter>
                </div>
              )}
            </motion.div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default UserManagement; 