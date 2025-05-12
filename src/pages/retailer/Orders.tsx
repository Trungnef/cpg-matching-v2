import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import RetailerLayout from "@/components/layouts/RetailerLayout";
import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Filter, 
  Search, 
  Plus,
  ShoppingBag, 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck,
  Calendar,
  User,
  CreditCard,
  MoreHorizontal,
  Download,
  Eye
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

// Mock orders data
const ordersData = [
  {
    id: "ORD-5962",
    customerName: "Emma Wilson",
    customerEmail: "emma@example.com",
    status: "completed",
    total: 128.50,
    items: 5,
    date: new Date(2023, 8, 25),
    shipping: "Standard Delivery",
    paymentMethod: "Credit Card",
    products: [
      { name: "Organic Cereal", quantity: 2, price: 24.99 },
      { name: "Protein Bars", quantity: 1, price: 18.50 },
      { name: "Cold Pressed Juice", quantity: 2, price: 30.00 }
    ]
  },
  {
    id: "ORD-5843",
    customerName: "James Rodriguez",
    customerEmail: "james@example.com",
    status: "processing",
    total: 76.25,
    items: 3,
    date: new Date(2023, 8, 27),
    shipping: "Express Delivery",
    paymentMethod: "PayPal",
    products: [
      { name: "Vitamin Supplements", quantity: 1, price: 42.50 },
      { name: "Organic Trail Mix", quantity: 2, price: 16.75 }
    ]
  },
  {
    id: "ORD-5791",
    customerName: "Olivia Chen",
    customerEmail: "olivia@example.com",
    status: "shipped",
    total: 95.80,
    items: 4,
    date: new Date(2023, 8, 26),
    shipping: "Standard Delivery",
    paymentMethod: "Credit Card",
    products: [
      { name: "Eco-Friendly Dish Soap", quantity: 2, price: 18.90 },
      { name: "Natural Energy Bars", quantity: 3, price: 19.50 }
    ]
  },
  {
    id: "ORD-5724",
    customerName: "Michael Thompson",
    customerEmail: "michael@example.com",
    status: "cancelled",
    total: 152.40,
    items: 6,
    date: new Date(2023, 8, 23),
    shipping: "Express Delivery",
    paymentMethod: "Debit Card",
    products: [
      { name: "Organic Snacks", quantity: 4, price: 22.60 },
      { name: "Protein Powder", quantity: 1, price: 62.00 }
    ]
  },
  {
    id: "ORD-5692",
    customerName: "Sarah Johnson",
    customerEmail: "sarah@example.com",
    status: "pending",
    total: 64.75,
    items: 2,
    date: new Date(2023, 8, 28),
    shipping: "Standard Delivery",
    paymentMethod: "Credit Card",
    products: [
      { name: "Fresh Pressed Juice", quantity: 3, price: 21.50 }
    ]
  }
];

const Orders = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = t("orders") + " - CPG Matchmaker";
    
    // If not authenticated or not a retailer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "retailer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role, t]);

  if (!isAuthenticated || role !== "retailer") {
    return null;
  }

  // Filter orders based on search query and status filter
  const filteredOrders = ordersData.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === "all" || 
      order.status === statusFilter;
    
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "recent" && new Date().getTime() - order.date.getTime() < 7 * 24 * 60 * 60 * 1000) ||
      (activeTab === "processing" && (order.status === "processing" || order.status === "pending")) ||
      (activeTab === "completed" && order.status === "completed");
    
    return matchesSearch && matchesStatus && matchesTab;
  });

  // Helper function for status badges
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="mr-1 h-3 w-3" /> {t("completed")}
          </Badge>
        );
      case "processing":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Clock className="mr-1 h-3 w-3" /> {t("processing")}
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">
            <Truck className="mr-1 h-3 w-3" /> {t("shipped")}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="mr-1 h-3 w-3" /> {t("pending")}
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="outline" className="text-red-500 border-red-200">
            <AlertCircle className="mr-1 h-3 w-3" /> {t("cancelled")}
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExpandOrder = (orderId: string) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  return (
    <RetailerLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="mb-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{t("orders-management")}</h1>
              <p className="text-muted-foreground">{user?.companyName} - {t("manage-track-customer-orders")}</p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" className="hover:shadow-md transition-shadow">
                <Download className="mr-2 h-4 w-4" />
                {t("export")}
              </Button>
              <Button className="hover:shadow-md transition-shadow">
                <Plus className="mr-2 h-4 w-4" />
                {t("new-order")}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Tabs and Filters */}
        <div className="px-4 sm:px-6 lg:px-8 mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">{t("all-orders")}</TabsTrigger>
                <TabsTrigger value="recent">{t("recent")}</TabsTrigger>
                <TabsTrigger value="processing">{t("processing")}</TabsTrigger>
                <TabsTrigger value="completed">{t("completed")}</TabsTrigger>
              </TabsList>
              
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder={t("search-orders")} 
                    className="pl-10 shadow-sm hover:shadow transition-shadow w-full sm:w-64" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder={t("filter-by-status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t("order-status")}</SelectLabel>
                      <SelectItem value="all">{t("all-statuses")}</SelectItem>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                      <SelectItem value="processing">{t("processing")}</SelectItem>
                      <SelectItem value="shipped">{t("shipped")}</SelectItem>
                      <SelectItem value="completed">{t("completed")}</SelectItem>
                      <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Tabs>
        </div>
        
        {/* Orders List */}
        <div className="px-4 sm:px-6 lg:px-8 space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-2">{t("no-orders-found")}</h3>
                <p className="text-sm text-muted-foreground text-center">
                  {t("adjust-filters-or-search")}
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-md transition-all duration-300 overflow-hidden hover:border-primary/20">
                    <CardHeader className="pb-2">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex items-center">
                          <div className="mr-3 p-2 bg-primary/10 rounded-full">
                            <ShoppingBag className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium">{order.id}</h3>
                              {getStatusBadge(order.status)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {format(order.date, "MMMM d, yyyy")} • {order.items} {t("items")} • ${order.total.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="gap-1"
                            onClick={() => handleExpandOrder(order.id)}
                          >
                            <Eye className="h-4 w-4" />
                            {expandedOrder === order.id ? t("hide-details") : t("view-details")}
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>{t("view-order")}</DropdownMenuItem>
                              <DropdownMenuItem>{t("print-invoice")}</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>{t("update-status")}</DropdownMenuItem>
                              {order.status !== "cancelled" && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-500">{t("cancel-order")}</DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </CardHeader>
                    
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CardContent className="pb-3 pt-0">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left column - Customer Info */}
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("customer-information")}</h4>
                                <div className="flex items-center">
                                  <Avatar className="h-10 w-10 mr-3">
                                    <AvatarFallback>{order.customerName.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{order.customerName}</p>
                                    <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <div className="flex items-center text-sm mb-1 text-muted-foreground">
                                    <Truck className="h-3.5 w-3.5 mr-1" />
                                    {t("shipping")}
                                  </div>
                                  <p className="text-sm font-medium">{order.shipping}</p>
                                </div>
                                <div>
                                  <div className="flex items-center text-sm mb-1 text-muted-foreground">
                                    <CreditCard className="h-3.5 w-3.5 mr-1" />
                                    {t("payment")}
                                  </div>
                                  <p className="text-sm font-medium">{order.paymentMethod}</p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Right column - Product List */}
                            <div>
                              <h4 className="text-sm font-medium mb-2 text-muted-foreground">{t("order-items")}</h4>
                              <div className="space-y-2">
                                {order.products.map((product, i) => (
                                  <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                                    <div className="flex items-center">
                                      <div className="h-8 w-8 bg-muted rounded flex items-center justify-center mr-3">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <p className="font-medium text-sm">{product.name}</p>
                                        <p className="text-xs text-muted-foreground">{t("qty")}: {product.quantity}</p>
                                      </div>
                                    </div>
                                    <p className="font-medium">${product.price.toFixed(2)}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                        
                        <CardFooter className="bg-muted/30 justify-between py-3">
                          <div className="flex items-center text-sm">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-muted-foreground">{t("order-placed-on")} {format(order.date, "MMM d, yyyy 'at' h:mm a")}</span>
                          </div>
                          <div className="flex items-center">
                            <span className="text-muted-foreground mr-2">{t("total")}:</span>
                            <span className="font-bold">${order.total.toFixed(2)}</span>
                          </div>
                        </CardFooter>
                      </motion.div>
                    )}
                    
                    {expandedOrder !== order.id && (
                      <CardFooter className="justify-between py-3 border-t">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-1 text-muted-foreground" />
                          <span>{order.customerName}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-bold">${order.total.toFixed(2)}</span>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                </motion.div>
              ))}
            </>
          )}
        </div>
      </motion.div>
    </RetailerLayout>
  );
};

export default Orders; 