import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Layers, Network, BarChart3, Lock, Sparkles } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Solutions = () => {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Solutions - CPG Matchmaker";
  }, []);

  const handleBookDemo = () => {
    navigate("/book-demo");
  };

  const handleSignIn = () => {
    navigate("/signin", { 
      state: { 
        from: "/solutions",
        message: "Sign in to get started with CPG Matchmaker" 
      } 
    });
  };

  const handleLearnMore = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative">
        {/* Enhanced background animations */}
        <motion.div 
          className="absolute top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/30 rounded-full filter blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              AI-Powered Solutions for the CPG Industry
            </motion.h1>
            <motion.p 
              className="text-xl text-foreground/70 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Discover how our platform solves critical challenges in the Consumer Packaged Goods industry through innovative technology.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="rounded-full px-8 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
                onClick={handleBookDemo}
              >
                Book a Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full px-8 hover:bg-primary/5 transition-all duration-300"
                onClick={() => handleLearnMore("/features")}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Solutions Tabs */}
      <div className="py-16 bg-secondary/20 relative">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="manufacturers" className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            <TabsList className="grid grid-cols-3 w-full mb-8">
                <TabsTrigger value="manufacturers" className="data-[state=active]:bg-primary/20 transition-all duration-300">For Manufacturers</TabsTrigger>
                <TabsTrigger value="brands" className="data-[state=active]:bg-primary/20 transition-all duration-300">For Brands</TabsTrigger>
                <TabsTrigger value="retailers" className="data-[state=active]:bg-primary/20 transition-all duration-300">For Retailers</TabsTrigger>
            </TabsList>
            </motion.div>
            
            {/* Manufacturers Tab */}
            <TabsContent value="manufacturers" className="space-y-8">
              <motion.div 
                className="grid md:grid-cols-2 gap-8 items-center"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeInUp}>
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Expand Your Network</h2>
                  <p className="text-foreground/70 mb-6">
                    Connect with brands looking for exactly what you manufacture. Our AI matching system identifies perfect partnerships based on capabilities, capacity, and certifications.
                  </p>
                  <motion.ul className="space-y-3" variants={staggerContainer}>
                    {[
                      { icon: <Layers className="h-5 w-5" />, text: "Showcase your manufacturing capabilities to relevant brands" },
                      { icon: <BrainCircuit className="h-5 w-5" />, text: "AI-driven matches based on equipment capabilities and certification" },
                      { icon: <Network className="h-5 w-5" />, text: "Expand your network with qualified leads" }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300"
                        variants={fadeInUp}
                      >
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                          {item.icon}
                      </div>
                        <span>{item.text}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <motion.div 
                    className="mt-6"
                    variants={fadeInUp}
                  >
                    <Button
                      onClick={() => handleLearnMore("/manufacturers")}
                      className="rounded-full px-6 hover:shadow-lg transition-all duration-300"
                    >
                      Learn More About Manufacturing
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="glass rounded-xl p-8 h-[400px] flex items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    >
                    <BrainCircuit className="h-20 w-20 text-primary mx-auto mb-6" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2">Intelligent Matching</h3>
                    <p className="text-foreground/70">
                      Our AI analyzes 50+ data points to match you with the right partners.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Case Studies */}
              <motion.div 
                className="pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-6">Success Stories</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    transition={{ duration: 0.2 }}
                    onClick={() => handleLearnMore("/case-studies/naturepack")}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-gradient">NaturePack Co.</CardTitle>
                      <CardDescription>Sustainable Packaging Manufacturer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        "We increased our client base by 35% within six months of joining the platform. The AI matching system connected us with brands that perfectly aligned with our sustainable packaging capabilities."
                      </p>
                    </CardContent>
                  </Card>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    transition={{ duration: 0.2 }}
                    onClick={() => handleLearnMore("/case-studies/purefoods")}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300">
                    <CardHeader>
                        <CardTitle className="text-gradient">PureFoods Manufacturing</CardTitle>
                      <CardDescription>Organic Food Producer</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        "The platform helped us identify brands looking specifically for our organic certification and production capabilities, resulting in three major contracts within our first quarter."
                      </p>
                    </CardContent>
                  </Card>
                  </motion.div>
                </div>
              </motion.div>
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
      <motion.div 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="glass p-8 md:p-12 rounded-2xl max-w-4xl mx-auto text-center bg-gradient-to-br from-primary/5 via-background to-accent/5"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p 
              className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join our platform today and discover how our AI-powered solutions can help you grow in the Consumer Packaged Goods industry.
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="rounded-full px-8 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 group"
                onClick={handleSignIn}
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Get Started
                </span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 hover:bg-primary/5 transition-all duration-300 group"
                onClick={handleBookDemo}
              >
                <span className="group-hover:translate-x-1 transition-transform">
                  Schedule a Demo
                </span>
              </Button>
            </motion.div>
            <motion.p
              className="text-sm text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Already have an account?{" "}
              <Link 
                to="/signin" 
                className="text-primary hover:underline hover:text-primary/90 transition-colors"
              >
                Sign in here
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Solutions;
