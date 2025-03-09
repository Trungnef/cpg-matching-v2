
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Store, ShoppingCart, CircleDollarSign, Package, Users, BarChart3 } from "lucide-react";

const RetailerProfile = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Retailer Overview</CardTitle>
          <CardDescription>
            Manage your store information and inventory metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass p-6 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Store className="w-5 h-5 mr-2 text-primary" />
                Store Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-2xl font-bold">8</div>
                    <div className="text-xs text-muted-foreground">Physical Locations</div>
                  </div>
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-2xl font-bold">1</div>
                    <div className="text-xs text-muted-foreground">Online Store</div>
                  </div>
                </div>
                <Button size="sm">Manage Locations</Button>
              </div>
            </div>
            
            <div className="glass p-6 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2 text-primary" />
                Inventory Status
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Stock Levels</span>
                  <span className="font-medium">92% In Stock</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: "92%" }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  15 products require restocking in the next 7 days
                </p>
                <Button size="sm">View Inventory</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Manage your product offerings and discover new brands
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Top Product Categories</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="p-4 border rounded-md text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-medium">Food & Beverage</div>
                  <div className="text-xs text-muted-foreground">245 products</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-medium">Personal Care</div>
                  <div className="text-xs text-muted-foreground">128 products</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-medium">Household</div>
                  <div className="text-xs text-muted-foreground">92 products</div>
                </div>
                <div className="p-4 border rounded-md text-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                    <Package className="w-5 h-5 text-primary" />
                  </div>
                  <div className="font-medium">Health & Wellness</div>
                  <div className="text-xs text-muted-foreground">76 products</div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-3">Brand Partnerships</h4>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">Top Brands</Badge>
                <Badge variant="secondary">Local Producers</Badge>
                <Badge variant="secondary">Exclusive Lines</Badge>
                <Badge variant="secondary">Sustainable Products</Badge>
              </div>
              <Button size="sm">Discover New Brands</Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Sales & Performance</CardTitle>
          <CardDescription>
            Track your sales metrics and customer insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 border rounded-md text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <CircleDollarSign className="w-5 h-5 text-primary" />
                </div>
                <div className="text-lg font-bold">$42.5K</div>
                <div className="text-xs text-muted-foreground">Monthly Sales</div>
              </div>
              
              <div className="p-4 border rounded-md text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="text-lg font-bold">3,542</div>
                <div className="text-xs text-muted-foreground">Active Customers</div>
              </div>
              
              <div className="p-4 border rounded-md text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div className="text-lg font-bold">+18%</div>
                <div className="text-xs text-muted-foreground">Growth Rate</div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button size="sm" variant="outline">View Sales Report</Button>
              <Button size="sm">Customer Insights</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RetailerProfile;
