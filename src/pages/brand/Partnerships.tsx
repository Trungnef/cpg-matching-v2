import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";
import { useTranslation } from "react-i18next";
import BrandLayout from "@/components/layouts/BrandLayout";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  PlusCircle, 
  Handshake, 
  Building, 
  Factory, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  MoreHorizontal 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock partnerships data - brands
const brandPartnerships = [
  {
    id: 1,
    name: "Green Earth Foods",
    status: "Active",
    products: 12,
    dateEstablished: "May 10, 2022",
    logoUrl: "/placeholder.svg",
    location: "Portland, OR",
    contactPerson: "Sarah Johnson",
    email: "sarah@greenearthfoods.com"
  },
  {
    id: 2,
    name: "Fresh Press",
    status: "Active",
    products: 8,
    dateEstablished: "July 22, 2022",
    logoUrl: "/placeholder.svg",
    location: "San Francisco, CA",
    contactPerson: "Alex Chen",
    email: "alex@freshpress.com"
  },
  {
    id: 3,
    name: "Pure Wellness",
    status: "Pending",
    products: 0,
    dateEstablished: "Pending Approval",
    logoUrl: "/placeholder.svg",
    location: "Boulder, CO",
    contactPerson: "Michael Rivera",
    email: "michael@purewellness.com"
  },
  {
    id: 4,
    name: "Clean Living",
    status: "Active",
    products: 5,
    dateEstablished: "February 5, 2023",
    logoUrl: "/placeholder.svg",
    location: "Austin, TX",
    contactPerson: "Emma Wilson",
    email: "emma@cleanliving.com"
  },
  {
    id: 5,
    name: "Nature's Harvest",
    status: "Inactive",
    products: 3,
    dateEstablished: "November 18, 2021",
    logoUrl: "/placeholder.svg",
    location: "Seattle, WA",
    contactPerson: "David Kim",
    email: "david@naturesharvest.com"
  }
];

// Mock partnerships data - manufacturers
const manufacturerPartnerships = [
  {
    id: 101,
    name: "EcoPackaging Solutions",
    status: "Active",
    products: 7,
    dateEstablished: "March 15, 2022",
    logoUrl: "/placeholder.svg",
    location: "Chicago, IL",
    contactPerson: "Robert Chen",
    email: "robert@ecopackaging.com"
  },
  {
    id: 102,
    name: "Organic Food Processing",
    status: "Active",
    products: 14,
    dateEstablished: "January 8, 2022",
    logoUrl: "/placeholder.svg",
    location: "Minneapolis, MN",
    contactPerson: "Lisa Garcia",
    email: "lisa@organicprocessing.com"
  },
  {
    id: 103,
    name: "Sustainable Packaging Inc",
    status: "Pending",
    products: 0,
    dateEstablished: "Pending Approval",
    logoUrl: "/placeholder.svg",
    location: "Denver, CO",
    contactPerson: "James Wilson",
    email: "james@sustainablepackaging.com"
  }
];

const BrandPartnerships = () => {
  const { isAuthenticated, user, role } = useUser();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("brands");
  
  useEffect(() => {
    document.title = t("partnerships") + " - CPG Matchmaker";
    
    // If not authenticated or not a Brand, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "brand") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role, t]);

  if (!isAuthenticated || role !== "brand") {
    return null;
  }

  // Filter partnerships based on search query and active tab
  const filteredPartnerships = activeTab === "brands" 
    ? brandPartnerships.filter(partner => 
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : manufacturerPartnerships.filter(partner => 
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.location.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Active":
        return <Badge className="bg-green-500">{t("active")}</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500">{t("pending")}</Badge>;
      case "Inactive":
        return <Badge variant="outline" className="text-gray-500 border-gray-500">{t("inactive")}</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <BrandLayout>
      <motion.div 
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="mb-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">{t("partnerships-management")}</h1>
                <p className="text-muted-foreground">{user?.companyName} - {t("manage-brand-manufacturer-relationships")}</p>
              </div>
              
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="group hover:shadow-md transition-shadow">
                    <PlusCircle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    {t("new-partnership")}
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>{t("create-new-partnership")}</DialogTitle>
                    <DialogDescription>
                      {t("send-partnership-request-description")}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="partnerType" className="text-right text-sm font-medium col-span-1">
                        {t("type")}
                      </label>
                      <select 
                        id="partnerType" 
                        className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value="brand">{t("brand")}</option>
                        <option value="manufacturer">{t("manufacturer")}</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="partnerName" className="text-right text-sm font-medium col-span-1">
                        {t("name")}
                      </label>
                      <Input
                        id="partnerName"
                        placeholder={t("partner-company-name")}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="contactEmail" className="text-right text-sm font-medium col-span-1">
                        {t("email")}
                      </label>
                      <Input
                        id="contactEmail"
                        placeholder={t("contact-email-address")}
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <label htmlFor="message" className="text-right text-sm font-medium col-span-1">
                        {t("message")}
                      </label>
                      <textarea
                        id="message"
                        placeholder={t("partnership-message-placeholder")}
                        className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">{t("send-request")}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          
          {/* Tabs for Brand/Manufacturer */}
          <div className="px-4 sm:px-6 lg:px-8">
            <Tabs 
              defaultValue="brands" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="mb-8"
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
                <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
                  <TabsTrigger value="brands" className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    {t("brand-partners")}
                  </TabsTrigger>
                  <TabsTrigger value="manufacturers" className="flex items-center gap-2">
                    <Factory className="h-4 w-4" />
                    {t("manufacturer-partners")}
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input 
                      placeholder={t("search-partnerships")} 
                      className="pl-10 shadow-sm hover:shadow transition-shadow" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="group hover:shadow-md transition-shadow">
                    <Filter className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    {t("filter")}
                  </Button>
                </div>
              </div>
              
              <TabsContent value="brands" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPartnerships.map((partner, index) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 hover:border-primary/30">
                        <div className="h-24 bg-muted flex items-center justify-center p-4">
                          <img 
                            src={partner.logoUrl} 
                            alt={partner.name} 
                            className="h-16 w-auto object-contain"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{partner.name}</CardTitle>
                            {getStatusBadge(partner.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">{t("location")}:</span>
                              <span className="ml-1 font-medium">{partner.location}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{t("products")}:</span>
                              <span className="ml-1 font-medium">{partner.products}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">{t("since")}:</span>
                              <span className="ml-1 font-medium">{partner.dateEstablished}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">{t("contact")}:</span>
                              <span className="ml-1 font-medium">{partner.contactPerson}</span>
                            </div>
                          </div>
                          
                          {partner.status === "Active" && (
                            <div className="flex items-center text-xs text-green-500 font-medium">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t("active-partnership")}
                            </div>
                          )}
                          {partner.status === "Pending" && (
                            <div className="flex items-center text-xs text-yellow-500 font-medium">
                              <Clock className="h-3 w-3 mr-1" />
                              {t("awaiting-approval")}
                            </div>
                          )}
                          {partner.status === "Inactive" && (
                            <div className="flex items-center text-xs text-gray-500 font-medium">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              {t("partnership-inactive")}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Button 
                            size="sm" 
                            variant={partner.status === "Active" ? "outline" : "default"}
                            className="group"
                          >
                            {partner.status === "Active" ? (
                              <>{t("view-products")}</>
                            ) : partner.status === "Pending" ? (
                              <>{t("review-request")}</>
                            ) : (
                              <>{t("reactivate")}</>
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>{t("view-details")}</DropdownMenuItem>
                              <DropdownMenuItem>{t("contact-partner")}</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {partner.status === "Active" ? (
                                <DropdownMenuItem className="text-red-500">{t("deactivate")}</DropdownMenuItem>
                              ) : partner.status === "Inactive" ? (
                                <DropdownMenuItem>{t("reactivate")}</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-red-500">{t("cancel-request")}</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {/* Add New Partnership Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: filteredPartnerships.length * 0.05 }}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors duration-300">
                          <CardContent className="pt-6 flex flex-col items-center">
                            <motion.div 
                              className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Handshake className="h-6 w-6 text-primary" />
                            </motion.div>
                            <h3 className="font-medium mb-2">{t("new-brand-partnership")}</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                              {t("connect-with-brand-description")}
                            </p>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{t("request-brand-partnership")}</DialogTitle>
                          <DialogDescription>
                            {t("request-brand-partnership-description")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="brandName" className="text-right text-sm font-medium col-span-1">
                              {t("brand-name")}
                            </label>
                            <Input
                              id="brandName"
                              placeholder={t("brand-company-name")}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="contactEmail" className="text-right text-sm font-medium col-span-1">
                              {t("email")}
                            </label>
                            <Input
                              id="contactEmail"
                              placeholder={t("contact-email-address")}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="message" className="text-right text-sm font-medium col-span-1">
                              {t("message")}
                            </label>
                            <textarea
                              id="message"
                              placeholder={t("partnership-message-placeholder")}
                              className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">{t("send-request")}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="manufacturers" className="m-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPartnerships.map((partner, index) => (
                    <motion.div
                      key={partner.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300 hover:border-primary/30">
                        <div className="h-24 bg-muted flex items-center justify-center p-4">
                          <img 
                            src={partner.logoUrl} 
                            alt={partner.name} 
                            className="h-16 w-auto object-contain"
                          />
                        </div>
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg">{partner.name}</CardTitle>
                            {getStatusBadge(partner.status)}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3 pb-2">
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-muted-foreground">{t("location")}:</span>
                              <span className="ml-1 font-medium">{partner.location}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">{t("products")}:</span>
                              <span className="ml-1 font-medium">{partner.products}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">{t("since")}:</span>
                              <span className="ml-1 font-medium">{partner.dateEstablished}</span>
                            </div>
                            <div className="col-span-2">
                              <span className="text-muted-foreground">{t("contact")}:</span>
                              <span className="ml-1 font-medium">{partner.contactPerson}</span>
                            </div>
                          </div>
                          
                          {partner.status === "Active" && (
                            <div className="flex items-center text-xs text-green-500 font-medium">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {t("active-partnership")}
                            </div>
                          )}
                          {partner.status === "Pending" && (
                            <div className="flex items-center text-xs text-yellow-500 font-medium">
                              <Clock className="h-3 w-3 mr-1" />
                              {t("awaiting-approval")}
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="flex justify-between pt-0">
                          <Button 
                            size="sm" 
                            variant={partner.status === "Active" ? "outline" : "default"}
                            className="group"
                          >
                            {partner.status === "Active" ? (
                              <>{t("view-products")}</>
                            ) : partner.status === "Pending" ? (
                              <>{t("review-request")}</>
                            ) : (
                              <>{t("reactivate")}</>
                            )}
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="icon" variant="ghost">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>{t("view-details")}</DropdownMenuItem>
                              <DropdownMenuItem>{t("contact-partner")}</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {partner.status === "Active" ? (
                                <DropdownMenuItem className="text-red-500">{t("deactivate")}</DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem className="text-red-500">{t("cancel-request")}</DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {/* Add New Partnership Card */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: filteredPartnerships.length * 0.05 }}
                  >
                    <Dialog>
                      <DialogTrigger asChild>
                        <Card className="flex flex-col items-center justify-center h-full border-dashed cursor-pointer hover:border-primary hover:bg-muted/50 transition-colors duration-300">
                          <CardContent className="pt-6 flex flex-col items-center">
                            <motion.div 
                              className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4"
                              whileHover={{ scale: 1.1 }}
                              transition={{ type: "spring", stiffness: 400, damping: 17 }}
                            >
                              <Factory className="h-6 w-6 text-primary" />
                            </motion.div>
                            <h3 className="font-medium mb-2">{t("new-manufacturer-partnership")}</h3>
                            <p className="text-sm text-muted-foreground text-center mb-4">
                              {t("connect-with-manufacturer-description")}
                            </p>
                          </CardContent>
                        </Card>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{t("request-manufacturer-partnership")}</DialogTitle>
                          <DialogDescription>
                            {t("request-manufacturer-partnership-description")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="manufacturerName" className="text-right text-sm font-medium col-span-1">
                              {t("name")}
                            </label>
                            <Input
                              id="manufacturerName"
                              placeholder={t("manufacturer-company-name")}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="contactEmail" className="text-right text-sm font-medium col-span-1">
                              {t("email")}
                            </label>
                            <Input
                              id="contactEmail"
                              placeholder={t("contact-email-address")}
                              className="col-span-3"
                            />
                          </div>
                          <div className="grid grid-cols-4 items-center gap-4">
                            <label htmlFor="message" className="text-right text-sm font-medium col-span-1">
                              {t("message")}
                            </label>
                            <textarea
                              id="message"
                              placeholder={t("manufacturer-message-placeholder")}
                              className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button type="submit">{t("send-request")}</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </motion.div>
    </BrandLayout>
  );
};

export default BrandPartnerships;
