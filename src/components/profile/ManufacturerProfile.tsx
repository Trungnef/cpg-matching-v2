import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Factory, 
  Package, 
  Truck, 
  Users, 
  FileText, 
  Settings, 
  BarChart, 
  Download, 
  Upload, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Edit, 
  RefreshCw,
  ChevronRight,
  Clock
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 }
  }
};

const scaleVariants = {
  hover: { scale: 1.02, transition: { duration: 0.2 } },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

const ManufacturerProfile = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showMoreEquipment, setShowMoreEquipment] = useState(false);
  
  // State for production capacity modal
  const [capacityUtilization, setCapacityUtilization] = useState(78);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    // Simulate loading
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Data refreshed",
        description: "Your profile information has been updated.",
      });
    }, 1500);
  };

  // Additional equipment items to show on "View more"
  const additionalEquipment = [
    {
      name: "Packaging Line C",
      capacity: "7,500 units/day",
      status: "active",
      icon: <Package className="w-5 h-5 text-primary" />
    },
    {
      name: "Quality Control Lab",
      capacity: "15,000 tests/day",
      status: "active",
      icon: <CheckCircle2 className="w-5 h-5 text-primary" />
    }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Profile Header Section */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/20 to-primary/5 p-6 border shadow-sm"
      >
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]" />
        
        <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between relative z-10">
          <div className="flex gap-4 items-center">
            <Avatar className="w-16 h-16 border-2 border-primary/20">
              <AvatarImage src="/placeholders/manufacturer-logo.svg" alt="Alpha Manufacturing" />
              <AvatarFallback className="bg-primary/10 text-primary text-lg font-bold">AM</AvatarFallback>
            </Avatar>
            
            <div>
              <h2 className="text-2xl font-bold">Alpha Manufacturing Inc.</h2>
              <p className="text-muted-foreground flex items-center mt-1">
                <Factory className="w-4 h-4 mr-1" />
                Premium Manufacturing Partner
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={handleRefreshData} disabled={isRefreshing}>
              {isRefreshing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </>
              )}
            </Button>
            <Button size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <motion.div 
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-3 rounded-lg"
          >
            <Package className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Products</div>
              <div className="text-xl font-bold">28</div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-3 rounded-lg"
          >
            <Users className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Team Size</div>
              <div className="text-xl font-bold">120</div>
            </div>
          </motion.div>
          
          <motion.div 
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm p-3 rounded-lg"
          >
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm font-medium">Years Active</div>
              <div className="text-xl font-bold">15</div>
            </div>
          </motion.div>
        </div>
      </motion.div>
      
      {/* Tabs Navigation */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b pb-px mb-4 rounded-none bg-transparent h-auto p-0">
            <TabsTrigger 
              value="overview"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="capabilities"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Capabilities
            </TabsTrigger>
            <TabsTrigger 
              value="certifications"
              className="data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-b-2 border-transparent rounded-none px-4 py-2"
            >
              Certifications
            </TabsTrigger>
          </TabsList>
          
          {/* Overview Tab Content */}
          <TabsContent value="overview" className="mt-0">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 gap-6"
            >
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-3">
                    <CardTitle className="flex items-center">
                      <BarChart className="w-5 h-5 mr-2 text-primary" />
                      Production Capacity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span>Current Utilization</span>
                        <span className="font-medium">{capacityUtilization}%</span>
                      </div>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${capacityUtilization}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      >
                        <Progress value={capacityUtilization} className="h-2" />
                      </motion.div>
                      <p className="text-sm text-muted-foreground flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Updated 2 hours ago</span>
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-primary">{100 - capacityUtilization}%</span> availability for new projects
                        </p>
                        <motion.div whileHover="hover" whileTap="tap" variants={scaleVariants}>
                          <Button size="sm">Manage Capacity</Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants}>
                <Card className="overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-3">
                    <CardTitle className="flex items-center">
                      <Factory className="w-5 h-5 mr-2 text-primary" />
                      Production Lines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <motion.div 
                          whileHover={{ y: -3 }}
                          className="p-3 border rounded-md text-center shadow-sm"
                        >
                          <div className="text-2xl font-bold text-primary">5</div>
                          <div className="text-xs text-muted-foreground">Active Lines</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ y: -3 }}
                          className="p-3 border rounded-md text-center shadow-sm"
                        >
                          <div className="text-2xl font-bold text-yellow-500">2</div>
                          <div className="text-xs text-muted-foreground">Maintenance</div>
                        </motion.div>
                        <motion.div 
                          whileHover={{ y: -3 }}
                          className="p-3 border rounded-md text-center shadow-sm"
                        >
                          <div className="text-2xl font-bold text-green-500">98.2%</div>
                          <div className="text-xs text-muted-foreground">Efficiency</div>
                        </motion.div>
                      </div>
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
                        <p className="text-sm text-muted-foreground flex items-center">
                          <CheckCircle2 className="w-4 h-4 mr-1 text-green-500" />
                          <span>All systems operational</span>
                        </p>
                        <motion.div whileHover="hover" whileTap="tap" variants={scaleVariants}>
                          <Button size="sm">View Details</Button>
                        </motion.div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div variants={itemVariants} className="md:col-span-2">
                <Card>
                  <CardHeader className="bg-primary/5 pb-3">
                    <CardTitle className="flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-primary" />
                      Production Calendar
                    </CardTitle>
                    <CardDescription>
                      Upcoming production schedule and key dates
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 border rounded-md bg-green-500/5 hover:shadow-sm transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-green-500" />
                          </div>
                          <div>
                            <div className="font-medium">Organic Cereal Production</div>
                            <div className="text-xs text-muted-foreground">Line A - Oct 15-20, 2023</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">
                          Confirmed
                        </Badge>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 border rounded-md hover:shadow-sm transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">Protein Bar Production</div>
                            <div className="text-xs text-muted-foreground">Line B - Oct 22-28, 2023</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-primary/10 text-primary hover:bg-primary/20">
                          Scheduled
                        </Badge>
                      </motion.div>
                      
                      <motion.div 
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 border rounded-md bg-yellow-500/5 hover:shadow-sm transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-yellow-500" />
                          </div>
                          <div>
                            <div className="font-medium">Line A Maintenance</div>
                            <div className="text-xs text-muted-foreground">Oct 21, 2023</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">
                          Maintenance
                        </Badge>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {/* Capabilities Tab Content */}
          <TabsContent value="capabilities" className="mt-0">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="bg-primary/5 pb-3">
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-2 text-primary" />
                      Manufacturing Capabilities
                    </CardTitle>
                    <CardDescription>
                      Showcase your production expertise to potential partners
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm font-medium mb-3">Production Types</h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">Food Processing</Badge>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">Bottling</Badge>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">Packaging</Badge>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">Quality Control</Badge>
                          </motion.div>
                          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <Badge variant="secondary" className="bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">Cold Storage</Badge>
                          </motion.div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-3">Production Metrics</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          <motion.div 
                            whileHover={{ y: -3 }}
                            className="p-3 border rounded-md text-center bg-muted/30"
                          >
                            <div className="text-2xl font-bold text-primary">25K</div>
                            <div className="text-xs text-muted-foreground">Units/Day</div>
                          </motion.div>
                          <motion.div 
                            whileHover={{ y: -3 }}
                            className="p-3 border rounded-md text-center bg-muted/30"
                          >
                            <div className="text-2xl font-bold text-primary">5</div>
                            <div className="text-xs text-muted-foreground">Production Lines</div>
                          </motion.div>
                          <motion.div 
                            whileHover={{ y: -3 }}
                            className="p-3 border rounded-md text-center bg-muted/30"
                          >
                            <div className="text-2xl font-bold text-primary">15K</div>
                            <div className="text-xs text-muted-foreground">Sq. Ft. Facility</div>
                          </motion.div>
                          <motion.div 
                            whileHover={{ y: -3 }}
                            className="p-3 border rounded-md text-center bg-muted/30"
                          >
                            <div className="text-2xl font-bold text-primary">98%</div>
                            <div className="text-xs text-muted-foreground">Quality Rate</div>
                          </motion.div>
                        </div>
                      </div>
                      
                      <motion.div 
                        initial={{ height: showMoreEquipment ? "auto" : "auto" }}
                        animate={{ height: showMoreEquipment ? "auto" : "auto" }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Available Equipment</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowMoreEquipment(!showMoreEquipment)}
                          >
                            {showMoreEquipment ? "Show Less" : "View All"}
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <motion.div 
                            whileHover={{ x: 3 }}
                            className="flex items-center p-3 border rounded-md hover:shadow-sm transition-shadow"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">Processing Line A</div>
                              <div className="text-xs text-muted-foreground">Capacity: 10,000 units/day</div>
                            </div>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ x: 3 }}
                            className="flex items-center p-3 border rounded-md hover:shadow-sm transition-shadow"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium">Packaging Line B</div>
                              <div className="text-xs text-muted-foreground">Capacity: 5,000 units/day</div>
                            </div>
                          </motion.div>
                          
                          {showMoreEquipment && additionalEquipment.map((item, index) => (
                            <motion.div 
                              key={index}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              whileHover={{ x: 3 }}
                              className="flex items-center p-3 border rounded-md hover:shadow-sm transition-shadow"
                            >
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                                {item.icon}
                              </div>
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-xs text-muted-foreground">Capacity: {item.capacity}</div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                        
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                          className="flex justify-center"
                        >
                          <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            Add New Equipment
                          </Button>
                        </motion.div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          {/* Certifications Tab Content */}
          <TabsContent value="certifications" className="mt-0">
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div variants={itemVariants}>
                <Card>
                  <CardHeader className="bg-primary/5 pb-3">
                    <CardTitle className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 mr-2 text-primary" />
                      Compliance & Certifications
                    </CardTitle>
                    <CardDescription>
                      Manage your quality certifications and compliance documents
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-4">
                    <motion.div 
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                      className="flex items-center justify-between p-4 border rounded-lg bg-green-500/5"
                    >
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-3 bg-green-500/10 text-green-500">Valid</Badge>
                        <div>
                          <span className="font-medium">ISO 9001:2015</span>
                          <p className="text-xs text-muted-foreground mt-1">Expires: Dec 15, 2024</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                      className="flex items-center justify-between p-4 border rounded-lg bg-green-500/5"
                    >
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-3 bg-green-500/10 text-green-500">Valid</Badge>
                        <div>
                          <span className="font-medium">Food Safety Certification</span>
                          <p className="text-xs text-muted-foreground mt-1">Expires: Nov 30, 2023</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </motion.div>
                    
                    <motion.div 
                      whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                      className="flex items-center justify-between p-4 border rounded-lg bg-yellow-500/5"
                    >
                      <div className="flex items-center">
                        <Badge variant="outline" className="mr-3 bg-yellow-500/10 text-yellow-500">Expiring Soon</Badge>
                        <div>
                          <span className="font-medium">Organic Certification</span>
                          <p className="text-xs text-muted-foreground mt-1">Expires: Oct 15, 2023</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">View</Button>
                        <Button size="sm">Renew</Button>
                      </div>
                    </motion.div>
                    
                    <div className="pt-2 flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        Keep your certifications up to date to maintain compliance
                      </p>
                      <Button>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload New
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default ManufacturerProfile;
