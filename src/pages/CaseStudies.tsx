
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ArrowRight, Search, BarChart4, FileText } from "lucide-react";

// Mock case studies data
const caseStudies = [
  {
    id: 1,
    title: "How Green Earth Organics Reduced Manufacturing Costs by 30%",
    excerpt: "Learn how this organic food brand optimized their production processes and found the perfect manufacturing partner.",
    category: "Manufacturing",
    image: "/placeholder.svg",
    logoImage: "/placeholder.svg",
    client: "Green Earth Organics",
    date: "June 2023",
    readTime: "10 min",
    results: [
      "30% reduction in manufacturing costs",
      "50% decrease in production time",
      "15% increase in product quality ratings"
    ],
    featured: true
  },
  {
    id: 2,
    title: "Pure Nutrition's Journey to Sustainable Packaging",
    excerpt: "How a leading nutrition brand partnered with innovative manufacturers to develop eco-friendly packaging solutions.",
    category: "Packaging",
    image: "/placeholder.svg",
    logoImage: "/placeholder.svg",
    client: "Pure Nutrition",
    date: "May 2023",
    readTime: "8 min",
    results: [
      "100% recyclable packaging",
      "40% reduction in packaging costs",
      "28% increase in consumer brand perception"
    ],
    featured: true
  },
  {
    id: 3,
    title: "Scaling Production: Fresh Press Meets 300% Growth Demand",
    excerpt: "How Fresh Press leveraged CPG Matchmaker to find additional manufacturing capacity to meet unexpected growth.",
    category: "Scaling",
    image: "/placeholder.svg",
    logoImage: "/placeholder.svg",
    client: "Fresh Press Juices",
    date: "April 2023",
    readTime: "12 min",
    results: [
      "Met 300% increase in demand",
      "Added 5 new manufacturing partners",
      "Maintained 99.8% product consistency"
    ],
    featured: false
  },
  {
    id: 4,
    title: "Clean Living's Data-Driven Approach to Inventory Management",
    excerpt: "How this household products brand optimized their supply chain and inventory with real-time analytics.",
    category: "Supply Chain",
    image: "/placeholder.svg",
    logoImage: "/placeholder.svg",
    client: "Clean Living",
    date: "March 2023",
    readTime: "7 min",
    results: [
      "45% reduction in inventory holding costs",
      "Near-zero stockouts during peak season",
      "18% improvement in cash flow"
    ],
    featured: false
  },
  {
    id: 5,
    title: "Retailer Success: How GreenMart Diversified Their CPG Portfolio",
    excerpt: "GreenMart's strategy for finding and onboarding innovative CPG brands to differentiate in a competitive market.",
    category: "Retail",
    image: "/placeholder.svg",
    logoImage: "/placeholder.svg",
    client: "GreenMart",
    date: "February 2023",
    readTime: "9 min",
    results: [
      "35 new brand partnerships",
      "22% increase in specialty product sales",
      "18% higher customer retention"
    ],
    featured: false
  }
];

const categories = [
  "All",
  "Manufacturing",
  "Packaging",
  "Supply Chain",
  "Scaling",
  "Retail"
];

const CaseStudies = () => {
  useEffect(() => {
    document.title = "Case Studies - CPG Matchmaker";
    window.scrollTo(0, 0);
  }, []);
  
  const featuredCaseStudies = caseStudies.filter(study => study.featured);
  const otherCaseStudies = caseStudies.filter(study => !study.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero section */}
        <div className="bg-primary/5">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Success Stories</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Real-world examples of how our platform has helped brands, manufacturers, and retailers achieve their goals
              </p>
              
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search case studies..." 
                  className="pl-10 pr-4 py-6" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          {/* Featured case studies */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Featured Success Stories</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredCaseStudies.map((study) => (
                <Card key={study.id} className="overflow-hidden border-none shadow-md">
                  <div className="aspect-[16/9] bg-muted relative">
                    <img 
                      src={study.image} 
                      alt={study.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-4 left-4 bg-white h-12 w-12 rounded-full p-1 shadow-sm">
                      <img 
                        src={study.logoImage} 
                        alt={study.client} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <Badge className="absolute top-4 right-4">
                      {study.category}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="text-sm text-muted-foreground mb-2">
                      {study.client} • {study.date}
                    </div>
                    <CardTitle className="text-xl">{study.title}</CardTitle>
                    <CardDescription>{study.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Key Results:</div>
                      {study.results.map((result, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                          {result}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{study.readTime} read</span>
                    </div>
                    <Button className="gap-1" asChild>
                      <Link to={`/case-studies/${study.id}`}>
                        Read Case Study <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* All case studies */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">All Case Studies</h2>
              <Tabs defaultValue="All">
                <TabsList>
                  {categories.slice(0, 4).map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherCaseStudies.map((study) => (
                <Card key={study.id} className="overflow-hidden hover:shadow-sm transition-all">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                      <div className="bg-muted h-10 w-10 rounded-full p-0.5">
                        <img 
                          src={study.logoImage} 
                          alt={study.client} 
                          className="w-full h-full object-contain" 
                        />
                      </div>
                      <Badge variant="outline">{study.category}</Badge>
                    </div>
                    <h3 className="text-lg font-semibold line-clamp-2 mb-2">{study.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {study.excerpt}
                    </p>
                    <div className="text-sm font-medium mb-1">Highlights:</div>
                    <div className="space-y-1 mb-4">
                      {study.results.slice(0, 2).map((result, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <BarChart4 className="h-3 w-3 text-primary" />
                          {result}
                        </div>
                      ))}
                    </div>
                  </div>
                  <CardFooter className="flex justify-between py-3">
                    <div className="flex items-center">
                      <FileText className="h-3 w-3 mr-1 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{study.readTime}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="gap-1 text-primary" asChild>
                      <Link to={`/case-studies/${study.id}`}>
                        Read More <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Stats section */}
          <div className="bg-secondary/30 rounded-lg p-8 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">Proven Results</h2>
              <p className="text-muted-foreground">Success metrics from clients across our platform</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">35%</div>
                <div className="text-sm text-muted-foreground">Average Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">42%</div>
                <div className="text-sm text-muted-foreground">Faster Time to Market</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">250+</div>
                <div className="text-sm text-muted-foreground">Successful Partnerships</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">89%</div>
                <div className="text-sm text-muted-foreground">Client Retention Rate</div>
              </div>
            </div>
          </div>
          
          {/* CTA section */}
          <div className="bg-primary/10 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-3">Ready to create your own success story?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join thousands of brands, manufacturers, and retailers who are already using our platform to grow their businesses
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/manufacturers">Browse Manufacturers</Link>
              </Button>
              <Button asChild>
                <Link to="/auth?type=register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
