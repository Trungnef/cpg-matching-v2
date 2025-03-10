
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Bell, Building, Lock, User } from "lucide-react";
import Footer from "@/components/Footer";

const RetailerSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  
  // Mock form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      toast({
        title: "Settings updated",
        description: "Your settings have been successfully updated.",
      });
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container max-w-6xl mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="sticky top-24">
              <h1 className="text-2xl font-bold mb-6">Settings</h1>
              
              <div className="space-y-1">
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/dashboard")}
                >
                  <Building className="h-4 w-4" />
                  Dashboard
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-full justify-start gap-2"
                  onClick={() => navigate("/profile")}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
              </div>
            </div>
          </div>
          
          {/* Settings content */}
          <div className="flex-1">
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="retail">Retail</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>
              
              {/* General Settings */}
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Manage your basic account settings and preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="company-name">Company Name</Label>
                          <Input 
                            id="company-name" 
                            defaultValue="Whole Foods Market" 
                            placeholder="Enter your company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input 
                            id="website" 
                            defaultValue="https://www.wholefoods.com" 
                            placeholder="Enter your website URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Contact Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            defaultValue="partnerships@wholefoods.com" 
                            placeholder="Enter your contact email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Contact Phone</Label>
                          <Input 
                            id="phone" 
                            defaultValue="+1 (512) 555-7890" 
                            placeholder="Enter your contact phone"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Company Bio</Label>
                        <Textarea 
                          id="bio" 
                          rows={4} 
                          defaultValue="Whole Foods Market is an American multinational supermarket chain known for selling products free from hydrogenated fats and artificial colors, flavors, and preservatives." 
                          placeholder="Enter a brief description of your company"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Retail Settings */}
              <TabsContent value="retail">
                <Card>
                  <CardHeader>
                    <CardTitle>Retail Settings</CardTitle>
                    <CardDescription>
                      Configure your retail preferences and requirements
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Store Locations</h3>
                        <div className="space-y-2">
                          <Label htmlFor="locations">Number of Locations</Label>
                          <Input 
                            id="locations" 
                            type="number" 
                            defaultValue="500" 
                            placeholder="Enter number of locations"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="regions">Regions</Label>
                          <Textarea 
                            id="regions" 
                            rows={2} 
                            defaultValue="United States, Canada, United Kingdom" 
                            placeholder="Enter the regions where you operate"
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Product Requirements</h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="organic-only">Organic Products Only</Label>
                            <Switch id="organic-only" defaultChecked={false} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Only show organic certified products when browsing
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="local-sourcing">Local Sourcing Priority</Label>
                            <Switch id="local-sourcing" defaultChecked={true} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Prioritize locally sourced products in matches
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="min-order">Minimum Order Value ($)</Label>
                          <Input 
                            id="min-order" 
                            type="number" 
                            defaultValue="5000" 
                            placeholder="Enter minimum order value"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Notification Settings */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Control when and how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="match-emails">New Match Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive an email when a new match is found
                            </p>
                          </div>
                          <Switch id="match-emails" defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="message-emails">Message Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive an email when you get a new message
                            </p>
                          </div>
                          <Switch id="message-emails" defaultChecked={true} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="marketing-emails">Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive updates about new features and promotions
                            </p>
                          </div>
                          <Switch id="marketing-emails" defaultChecked={false} />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="browser-notifications">Browser Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Show browser notifications for activities
                            </p>
                          </div>
                          <Switch id="browser-notifications" defaultChecked={true} />
                        </div>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Settings */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and access preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input 
                            id="current-password" 
                            type="password" 
                            placeholder="Enter your current password"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input 
                            id="new-password" 
                            type="password" 
                            placeholder="Enter your new password"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input 
                            id="confirm-password" 
                            type="password" 
                            placeholder="Confirm your new password"
                          />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <Switch id="two-factor" defaultChecked={false} />
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Session Management</h3>
                        <Button variant="outline" className="w-full sm:w-auto">
                          Sign out from all devices
                        </Button>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={saving}>
                          {saving ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default RetailerSettings;
