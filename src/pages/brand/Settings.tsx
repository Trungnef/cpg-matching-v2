
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
import { Badge } from "@/components/ui/badge";
import { Building, Lock, User, Bell, Tag, PlusCircle, X } from "lucide-react";
import Footer from "@/components/Footer";

const BrandSettings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState(["Organic", "Vegan", "Non-GMO", "Sustainable"]);
  const [newTag, setNewTag] = useState("");
  
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
  
  // Handle adding a new tag
  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };
  
  // Handle removing a tag
  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
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
                <TabsTrigger value="brand">Brand</TabsTrigger>
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
                            defaultValue="ACME Health Foods" 
                            placeholder="Enter your company name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input 
                            id="website" 
                            defaultValue="https://www.acmehealthfoods.com" 
                            placeholder="Enter your website URL"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Contact Email</Label>
                          <Input 
                            id="email" 
                            type="email" 
                            defaultValue="partnerships@acmehealthfoods.com" 
                            placeholder="Enter your contact email"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Contact Phone</Label>
                          <Input 
                            id="phone" 
                            defaultValue="+1 (415) 555-1234" 
                            placeholder="Enter your contact phone"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio">Company Bio</Label>
                        <Textarea 
                          id="bio" 
                          rows={4} 
                          defaultValue="ACME Health Foods is a leading producer of organic, non-GMO health food products. Founded in 2010, we are dedicated to providing high-quality, nutritious foods that promote health and wellness." 
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
              
              {/* Brand Settings */}
              <TabsContent value="brand">
                <Card>
                  <CardHeader>
                    <CardTitle>Brand Settings</CardTitle>
                    <CardDescription>
                      Configure your brand identity and product preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Brand Identity</h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="brand-name">Brand Name</Label>
                          <Input 
                            id="brand-name" 
                            defaultValue="Nature's Bounty" 
                            placeholder="Enter your brand name"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="slogan">Brand Slogan</Label>
                          <Input 
                            id="slogan" 
                            defaultValue="Health from nature, made simple" 
                            placeholder="Enter your brand slogan"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Product Categories</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="px-3 py-1">
                                {tag}
                                <button 
                                  onClick={() => handleRemoveTag(tag)}
                                  className="ml-2 text-muted-foreground hover:text-foreground"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input 
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              placeholder="Add a product category"
                            />
                            <Button 
                              type="button" 
                              size="icon" 
                              onClick={handleAddTag}
                              variant="outline"
                            >
                              <PlusCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Manufacturing Requirements</h3>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="certified-only">Certified Manufacturers Only</Label>
                            <Switch id="certified-only" defaultChecked={true} />
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Only show certified manufacturers in your matches
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="production-capacity">Minimum Production Capacity</Label>
                          <Input 
                            id="production-capacity" 
                            type="number" 
                            defaultValue="10000" 
                            placeholder="Units per month"
                          />
                          <p className="text-sm text-muted-foreground">
                            Minimum production capacity in units per month
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lead-time">Maximum Lead Time (days)</Label>
                          <Input 
                            id="lead-time" 
                            type="number" 
                            defaultValue="30" 
                            placeholder="Enter maximum lead time in days"
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
                            <Label htmlFor="match-emails">Manufacturer Match Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive an email when a new manufacturer match is found
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
                            <Label htmlFor="production-emails">Production Updates</Label>
                            <p className="text-sm text-muted-foreground">
                              Receive an email when there's an update on your production
                            </p>
                          </div>
                          <Switch id="production-emails" defaultChecked={true} />
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
                        <h3 className="text-lg font-medium">Data Privacy</h3>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="api-access">API Access</Label>
                            <p className="text-sm text-muted-foreground">
                              Allow third-party applications to access your data
                            </p>
                          </div>
                          <Switch id="api-access" defaultChecked={true} />
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
            </Tabs>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BrandSettings;
