
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Factory, Package, Truck, Users, FileText, Settings } from "lucide-react";

const ManufacturerProfile = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Manufacturer Overview</CardTitle>
          <CardDescription>
            Manage your manufacturing capabilities and production capacity
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="glass p-6 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Factory className="w-5 h-5 mr-2 text-primary" />
                Production Capacity
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Current Utilization</span>
                  <span className="font-medium">78%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full">
                  <div 
                    className="bg-primary h-2 rounded-full" 
                    style={{ width: "78%" }}
                  ></div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your production capacity has 22% availability for new projects
                </p>
                <Button size="sm">Manage Capacity</Button>
              </div>
            </div>
            
            <div className="glass p-6 rounded-lg">
              <h3 className="font-medium mb-2 flex items-center">
                <Package className="w-5 h-5 mr-2 text-primary" />
                Production Lines
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-2xl font-bold">5</div>
                    <div className="text-xs text-muted-foreground">Active Lines</div>
                  </div>
                  <div className="p-3 border rounded-md text-center">
                    <div className="text-2xl font-bold">2</div>
                    <div className="text-xs text-muted-foreground">Maintenance</div>
                  </div>
                </div>
                <Button size="sm">Manage Production Lines</Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manufacturing Capabilities</CardTitle>
          <CardDescription>
            Showcase your production expertise to potential partners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="secondary">Food Processing</Badge>
              <Badge variant="secondary">Bottling</Badge>
              <Badge variant="secondary">Packaging</Badge>
              <Badge variant="secondary">Quality Control</Badge>
              <Badge variant="secondary">Cold Storage</Badge>
            </div>
            
            <Button size="sm" className="w-full sm:w-auto">Update Capabilities</Button>
          </div>
          
          <div className="mt-6 space-y-4">
            <h4 className="text-sm font-medium">Available Equipment</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center p-3 border rounded-md">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Processing Line A</div>
                  <div className="text-xs text-muted-foreground">Capacity: 10,000 units/day</div>
                </div>
              </div>
              <div className="flex items-center p-3 border rounded-md">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="font-medium">Packaging Line B</div>
                  <div className="text-xs text-muted-foreground">Capacity: 5,000 units/day</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Compliance & Certifications</CardTitle>
          <CardDescription>
            Manage your quality certifications and compliance documents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-3 bg-green-500/10">Valid</Badge>
                <span>ISO 9001:2015</span>
              </div>
              <Button size="sm" variant="outline">View</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-3 bg-green-500/10">Valid</Badge>
                <span>Food Safety Certification</span>
              </div>
              <Button size="sm" variant="outline">View</Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center">
                <Badge variant="outline" className="mr-3 bg-yellow-500/10 text-yellow-500">Expiring Soon</Badge>
                <span>Organic Certification</span>
              </div>
              <Button size="sm" variant="outline">Renew</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerProfile;
