
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Store, 
  Settings, 
  Users, 
  Bell, 
  ShieldCheck, 
  CreditCard, 
  ArrowLeft, 
  CheckCircle, 
  Globe, 
  Truck, 
  Package 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const RetailerSettings = () => {
  const { isAuthenticated, user, role, updateUserProfile, updateRoleSettings } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock settings state
  const [storeSettings, setStoreSettings] = useState({
    notifyLowStock: true,
    autoReorder: true,
    inventoryAlerts: true,
    salesNotifications: true,
    newBrandAlerts: true,
    displayCurrency: "USD",
    inventoryThreshold: 15,
    storeLocations: user?.retailerSettings?.storeLocations || 0,
    preferredCategories: user?.retailerSettings?.preferredCategories || [],
    customerBase: user?.retailerSettings?.customerBase || [],
  });
  
  // Set page title and check authentication
  useEffect(() => {
    document.title = "Retailer Settings - CPG Matchmaker";
    
    // If not authenticated or not a retailer, redirect
    if (!isAuthenticated) {
      navigate("/auth?type=signin");
    } else if (role !== "retailer") {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate, role]);

  // Handle settings updates
  const handleSettingsUpdate = () => {
    // Update the user's retailer settings in context
    updateRoleSettings({
      storeLocations: storeSettings.storeLocations,
      preferredCategories: storeSettings.preferredCategories,
      customerBase: storeSettings.customerBase,
    });
    
    toast({
      title: "Settings Updated",
      description: "Your retailer settings have been successfully updated.",
    });
  };

  if (!isAuthenticated || role !== "retailer") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-24">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb and header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 pl-0 text-muted-foreground"
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">Settings</h1>
                <p className="text-muted-foreground">
                  Manage your retailer preferences and account settings
                </p>
              </div>

              <Button onClick={handleSettingsUpdate}>
                Save Changes
              </Button>
            </div>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full md:w-auto grid-cols-1 md:grid-cols-5">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="users">Team Members</TabsTrigger>
            </TabsList>
            
            {/* General Settings */}
            <TabsContent value="general" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Store Information</CardTitle>
                  <CardDescription>
                    Update your basic store information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        value={user?.companyName || ""} 
                        onChange={(e) => updateUserProfile({ companyName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        value={user?.email || ""} 
                        onChange={(e) => updateUserProfile({ email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" placeholder="+1 (555) 123-4567" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="storeLocations">Number of Store Locations</Label>
                      <Input 
                        id="storeLocations" 
                        type="number" 
                        value={storeSettings.storeLocations} 
                        onChange={(e) => setStoreSettings(prev => ({
                          ...prev,
                          storeLocations: parseInt(e.target.value)
                        }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Primary Store Address</Label>
                    <Input id="address" placeholder="123 Main St, City, State, ZIP" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Store Description</Label>
                    <textarea 
                      id="description" 
                      rows={4} 
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Tell brands about your store and customer base..."
                    ></textarea>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>
                    Configure how the platform works for your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="currency">Currency</Label>
                      <Select 
                        value={storeSettings.displayCurrency}
                        onValueChange={(value) => setStoreSettings(prev => ({
                          ...prev,
                          displayCurrency: value
                        }))}
                      >
                        <SelectTrigger id="currency">
                          <SelectValue placeholder="Select currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD ($)</SelectItem>
                          <SelectItem value="EUR">EUR (€)</SelectItem>
                          <SelectItem value="GBP">GBP (£)</SelectItem>
                          <SelectItem value="CAD">CAD (C$)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="darkMode">Dark Mode</Label>
                      <p className="text-sm text-muted-foreground">
                        Switch between light and dark themes
                      </p>
                    </div>
                    <Switch id="darkMode" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="analytics">Share Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow sharing anonymized data for better matches
                      </p>
                    </div>
                    <Switch id="analytics" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Inventory Settings */}
            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>
                    Configure how inventory is managed and tracked
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="lowStock">Low Stock Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive alerts when items are running low
                      </p>
                    </div>
                    <Switch 
                      id="lowStock" 
                      checked={storeSettings.notifyLowStock}
                      onCheckedChange={(checked) => setStoreSettings(prev => ({
                        ...prev,
                        notifyLowStock: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="autoReorder">Automatic Reordering</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically create purchase orders for low stock items
                      </p>
                    </div>
                    <Switch 
                      id="autoReorder" 
                      checked={storeSettings.autoReorder}
                      onCheckedChange={(checked) => setStoreSettings(prev => ({
                        ...prev,
                        autoReorder: checked
                      }))}
                    />
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="threshold">Low Stock Threshold (%)</Label>
                      <Input 
                        id="threshold" 
                        type="number" 
                        value={storeSettings.inventoryThreshold}
                        onChange={(e) => setStoreSettings(prev => ({
                          ...prev,
                          inventoryThreshold: parseInt(e.target.value)
                        }))} 
                      />
                      <p className="text-xs text-muted-foreground">
                        Items below this percentage of max stock will trigger alerts
                      </p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="leadTime">Standard Lead Time (days)</Label>
                      <Input id="leadTime" type="number" defaultValue={7} />
                      <p className="text-xs text-muted-foreground">
                        Average time between order and delivery
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Forecasting Settings</CardTitle>
                  <CardDescription>
                    Configure demand forecasting parameters
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="forecastPeriod">Forecasting Period</Label>
                      <Select defaultValue="90">
                        <SelectTrigger id="forecastPeriod">
                          <SelectValue placeholder="Select period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seasonalityModel">Seasonality Model</Label>
                      <Select defaultValue="auto">
                        <SelectTrigger id="seasonalityModel">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="auto">Auto-detect</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includeSeasonal">Include Seasonal Trends</Label>
                      <p className="text-sm text-muted-foreground">
                        Factor in historical seasonal patterns
                      </p>
                    </div>
                    <Switch id="includeSeasonal" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="includePromo">Factor in Promotions</Label>
                      <p className="text-sm text-muted-foreground">
                        Adjust forecasts based on planned promotions
                      </p>
                    </div>
                    <Switch id="includePromo" defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Notifications Settings */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Configure which notifications you receive and how
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="inventoryAlerts">Inventory Alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Low stock, stockouts, and reordering
                      </p>
                    </div>
                    <Switch 
                      id="inventoryAlerts" 
                      checked={storeSettings.inventoryAlerts}
                      onCheckedChange={(checked) => setStoreSettings(prev => ({
                        ...prev,
                        inventoryAlerts: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="salesNotifications">Sales Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        Daily and weekly sales summaries
                      </p>
                    </div>
                    <Switch 
                      id="salesNotifications" 
                      checked={storeSettings.salesNotifications}
                      onCheckedChange={(checked) => setStoreSettings(prev => ({
                        ...prev,
                        salesNotifications: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="newBrandAlerts">New Brand Matches</Label>
                      <p className="text-sm text-muted-foreground">
                        Alerts about new potential brand partners
                      </p>
                    </div>
                    <Switch 
                      id="newBrandAlerts" 
                      checked={storeSettings.newBrandAlerts}
                      onCheckedChange={(checked) => setStoreSettings(prev => ({
                        ...prev,
                        newBrandAlerts: checked
                      }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="productAlerts">Product Updates</Label>
                      <p className="text-sm text-muted-foreground">
                        New products from existing suppliers
                      </p>
                    </div>
                    <Switch id="productAlerts" defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Notification Delivery</CardTitle>
                  <CardDescription>
                    Configure how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <Label>Delivery Methods</Label>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="email" defaultChecked />
                        <Label htmlFor="email">Email</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="sms" />
                        <Label htmlFor="sms">SMS</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="push" defaultChecked />
                        <Label htmlFor="push">Push Notifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="inApp" defaultChecked />
                        <Label htmlFor="inApp">In-App</Label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Digest Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger id="frequency">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="realtime">Real-time</SelectItem>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preferences Settings */}
            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Product Preferences</CardTitle>
                  <CardDescription>
                    Configure your product category preferences for better matches
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Preferred Product Categories</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Organic", "Local", "Sustainable", "Health food", "Vegan", "Gluten-free"].map((category) => (
                          <Badge key={category} variant="outline" className="py-1.5">
                            {category}
                            <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">Add Category</Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Customer Base Demographics</Label>
                      <div className="flex flex-wrap gap-2">
                        {["Urban professionals", "Health-conscious families", "Millennials", "Gen Z", "Eco-conscious"].map((demo) => (
                          <Badge key={demo} variant="outline" className="py-1.5">
                            {demo}
                            <button className="ml-1 text-muted-foreground hover:text-foreground">×</button>
                          </Badge>
                        ))}
                        <Button variant="outline" size="sm">Add Demographic</Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priceRange">Price Range Preference</Label>
                    <Select defaultValue="mid">
                      <SelectTrigger id="priceRange">
                        <SelectValue placeholder="Select price range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="budget">Budget</SelectItem>
                        <SelectItem value="mid">Mid-range</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="all">All price points</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="localPreference">Prioritize Local Producers</Label>
                      <p className="text-sm text-muted-foreground">
                        Give higher matching scores to nearby producers
                      </p>
                    </div>
                    <Switch id="localPreference" defaultChecked />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Brand Relationship Preferences</CardTitle>
                  <CardDescription>
                    Configure how you work with brands and manufacturers
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="minOrderValue">Minimum Order Value</Label>
                    <Input id="minOrderValue" type="number" placeholder="$500" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="leadTime">Preferred Lead Time</Label>
                    <Select defaultValue="1-2weeks">
                      <SelectTrigger id="leadTime">
                        <SelectValue placeholder="Select lead time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1week">Less than 1 week</SelectItem>
                        <SelectItem value="1-2weeks">1-2 weeks</SelectItem>
                        <SelectItem value="2-4weeks">2-4 weeks</SelectItem>
                        <SelectItem value="4+weeks">4+ weeks</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Certifications Preferred</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="organic" defaultChecked />
                        <Label htmlFor="organic">Organic</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="fairtrade" defaultChecked />
                        <Label htmlFor="fairtrade">Fair Trade</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="nongmo" defaultChecked />
                        <Label htmlFor="nongmo">Non-GMO</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="bcorp" />
                        <Label htmlFor="bcorp">B Corp</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Team Members Settings */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Team Members</CardTitle>
                  <CardDescription>
                    Manage user accounts and permissions
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    {[
                      { name: "Sarah Johnson", email: "sarah@example.com", role: "Admin", status: "Active" },
                      { name: "Michael Chen", email: "michael@example.com", role: "Inventory Manager", status: "Active" },
                      { name: "Jessica Williams", email: "jessica@example.com", role: "Purchasing", status: "Pending" },
                    ].map((member, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{member.name}</p>
                            <p className="text-xs text-muted-foreground">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={member.status === "Active" ? "default" : "outline"}>
                            {member.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{member.role}</span>
                          <Button variant="ghost" size="sm">Edit</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    Invite Team Member
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Roles & Permissions</CardTitle>
                  <CardDescription>
                    Configure access levels for different roles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>Admin</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Full account access</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Manage users and permissions</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Financial data access</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Brand partnership management</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>Inventory Manager</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>Full inventory management</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Create purchase orders</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>View analytics</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Financial data access</span>
                            <span className="text-sm text-muted-foreground">Limited</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>Purchasing</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span>View inventory</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Create purchase orders</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Brand partnership management</span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex items-center justify-between">
                            <span>User management</span>
                            <span className="text-sm text-muted-foreground">None</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <Button variant="outline" className="w-full">
                    Create Custom Role
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default RetailerSettings;
