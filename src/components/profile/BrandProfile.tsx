
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, BarChart, Target, TrendingUp, Package, PieChart } from "lucide-react";

const BrandProfile = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Brand Overview</CardTitle>
          <CardDescription>
            Manage your product lines and market presence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass p-6 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <ShoppingBag className="w-5 h-5 mr-2 text-primary" />
                Product Portfolio
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-xs text-muted-foreground">Active Products</div>
                  </div>
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-2xl font-bold">3</div>
                    <div className="text-xs text-muted-foreground">In Development</div>
                  </div>
                </div>
                <Button size="sm">Manage Products</Button>
              </div>
            </div>
            
            <div className="glass p-6 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <BarChart className="w-5 h-5 mr-2 text-primary" />
                Market Performance
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Growth Rate</span>
                  <span className="font-medium">+15% YoY</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: "65%" }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your brand is outperforming 65% of similar brands in your category
                </p>
                <Button size="sm">View Analytics</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Marketing & Branding</CardTitle>
          <CardDescription>
            Manage your brand identity and marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Brand Assets</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="aspect-square bg-secondary/50 rounded-md flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Logo</span>
                </div>
                <div className="aspect-square bg-secondary/50 rounded-md flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Brand Guide</span>
                </div>
                <div className="aspect-square bg-secondary/50 rounded-md flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Product Images</span>
                </div>
                <div className="aspect-square bg-secondary/50 rounded-md flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Packaging</span>
                </div>
              </div>
              <Button size="sm" className="mt-3">Manage Assets</Button>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Active Campaigns</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <Target className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Summer Promotion</div>
                      <div className="text-xs text-muted-foreground">Ends in 14 days</div>
                    </div>
                  </div>
                  <Badge>Active</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-md">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Product Launch</div>
                      <div className="text-xs text-muted-foreground">Starting in 7 days</div>
                    </div>
                  </div>
                  <Badge variant="outline">Scheduled</Badge>
                </div>
              </div>
              <Button size="sm" className="mt-3">Create Campaign</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Retailer Partnerships</CardTitle>
          <CardDescription>
            Manage your distribution channels and retail partnerships
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary">National Retailers</Badge>
              <Badge variant="secondary">Regional Stores</Badge>
              <Badge variant="secondary">E-commerce</Badge>
              <Badge variant="secondary">Direct-to-Consumer</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              <div className="flex items-center p-3 border rounded-md">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">National Chain</div>
                  <div className="text-xs text-muted-foreground">250 locations</div>
                </div>
              </div>
              <div className="flex items-center p-3 border rounded-md">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <PieChart className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Online Marketplaces</div>
                  <div className="text-xs text-muted-foreground">5 platforms</div>
                </div>
              </div>
            </div>
            
            <Button size="sm" className="mt-2">Find New Retailers</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandProfile;
