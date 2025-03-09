
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Layers, Network, BarChart3, Lock, Sparkles } from "lucide-react";

const Solutions = () => {
  // Set page title on mount
  useEffect(() => {
    document.title = "Solutions - CPG Matchmaker";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative">
        {/* Background blur circles */}
        <div className="absolute top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              AI-Powered <span className="text-gradient">Solutions</span> for the CPG Industry
            </h1>
            <p className="text-xl text-foreground/70 mb-8">
              Discover how our platform solves critical challenges in the Consumer Packaged Goods industry through innovative technology.
            </p>
            <Button size="lg" className="rounded-full px-8">Book a Demo</Button>
          </div>
        </div>
      </div>

      {/* Solutions Tabs */}
      <div className="py-16 bg-secondary/20">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="manufacturers" className="max-w-5xl mx-auto">
            <TabsList className="grid grid-cols-3 w-full mb-8">
              <TabsTrigger value="manufacturers">For Manufacturers</TabsTrigger>
              <TabsTrigger value="brands">For Brands</TabsTrigger>
              <TabsTrigger value="retailers">For Retailers</TabsTrigger>
            </TabsList>
            
            {/* Manufacturers Tab */}
            <TabsContent value="manufacturers" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Expand Your Network</h2>
                  <p className="text-foreground/70 mb-6">
                    Connect with brands looking for exactly what you manufacture. Our AI matching system identifies perfect partnerships based on capabilities, capacity, and certifications.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                        <Layers className="h-5 w-5" />
                      </div>
                      <span>Showcase your manufacturing capabilities to relevant brands</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                        <BrainCircuit className="h-5 w-5" />
                      </div>
                      <span>AI-driven matches based on equipment capabilities and certification</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                        <Network className="h-5 w-5" />
                      </div>
                      <span>Expand your network with qualified leads</span>
                    </li>
                  </ul>
                </div>
                <div className="glass rounded-xl p-8 h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="text-center">
                    <BrainCircuit className="h-20 w-20 text-primary mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Intelligent Matching</h3>
                    <p className="text-foreground/70">
                      Our AI analyzes 50+ data points to match you with the right partners.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Case Studies */}
              <div className="pt-8">
                <h3 className="text-2xl font-bold mb-6">Success Stories</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>NaturePack Co.</CardTitle>
                      <CardDescription>Sustainable Packaging Manufacturer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        "We increased our client base by 35% within six months of joining the platform. The AI matching system connected us with brands that perfectly aligned with our sustainable packaging capabilities."
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>PureFoods Manufacturing</CardTitle>
                      <CardDescription>Organic Food Producer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        "The platform helped us identify brands looking specifically for our organic certification and production capabilities, resulting in three major contracts within our first quarter."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Brands Tab */}
            <TabsContent value="brands" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Find Perfect Manufacturing Partners</h2>
                  <p className="text-foreground/70 mb-6">
                    Discover manufacturers that meet your exact specifications for product type, volume, certifications, and more. Save time on sourcing and focus on growing your brand.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <span>Compare manufacturers across key metrics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                        <Lock className="h-5 w-5" />
                      </div>
                      <span>Verify certifications and capabilities</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span>Get intelligent recommendations based on your needs</span>
                    </li>
                  </ul>
                </div>
                <div className="glass rounded-xl p-8 h-[400px] flex items-center justify-center bg-gradient-to-br from-accent/10 to-primary/10">
                  <div className="text-center">
                    <Sparkles className="h-20 w-20 text-accent mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Smart Discovery</h3>
                    <p className="text-foreground/70">
                      Filter through thousands of manufacturers to find your perfect match.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Case Studies */}
              <div className="pt-8">
                <h3 className="text-2xl font-bold mb-6">Success Stories</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>GreenLife Foods</CardTitle>
                      <CardDescription>Plant-based snack brand</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        "We had a specific list of requirements for our manufacturing partner. The platform helped us find three qualified manufacturers in just days, rather than the months it would have taken through traditional networking."
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Refresh Beverages</CardTitle>
                      <CardDescription>Functional drink startup</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        "As a startup, we didn't have the network to find the right manufacturer. This platform made it possible to connect with established manufacturers who were willing to work with our volumes and specifications."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            {/* Retailers Tab */}
            <TabsContent value="retailers" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">Discover Innovative Products</h2>
                  <p className="text-foreground/70 mb-6">
                    Find new and unique products to fill your shelves. Connect directly with brands and manufacturers to bring innovative offerings to your customers.
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                        <Layers className="h-5 w-5" />
                      </div>
                      <span>Browse thousands of products with detailed specifications</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                        <Network className="h-5 w-5" />
                      </div>
                      <span>Connect directly with brands for special retail arrangements</span>
                    </li>
                    <li className="flex items-start">
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                        <BarChart3 className="h-5 w-5" />
                      </div>
                      <span>Track market trends and emerging product categories</span>
                    </li>
                  </ul>
                </div>
                <div className="glass rounded-xl p-8 h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10">
                  <div className="text-center">
                    <Network className="h-20 w-20 text-primary mx-auto mb-6" />
                    <h3 className="text-2xl font-bold mb-2">Product Discovery</h3>
                    <p className="text-foreground/70">
                      Stay ahead of trends with our curated product recommendations.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Case Studies */}
              <div className="pt-8">
                <h3 className="text-2xl font-bold mb-6">Success Stories</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Natural Market</CardTitle>
                      <CardDescription>Health food store chain</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        "We've been able to identify and stock innovative products ahead of our competitors. The platform gives us a direct line to brands that align with our store's ethos."
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Urban Grocers</CardTitle>
                      <CardDescription>Boutique grocery stores</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        "The platform has become our go-to source for discovering unique, locally-produced items that give our stores a competitive edge in the market."
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="glass p-8 md:p-12 rounded-2xl max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Business?</h2>
            <p className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto">
              Join our platform today and discover how our AI-powered solutions can help you grow in the Consumer Packaged Goods industry.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-full px-8">Get Started</Button>
              <Button variant="outline" size="lg" className="rounded-full px-8">Schedule a Demo</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Solutions;
