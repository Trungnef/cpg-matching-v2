
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, ArrowRight, Search, Tag } from "lucide-react";

// Mock blog post data
const blogPosts = [
  {
    id: 1,
    title: "How Supply Chain Visibility Can Improve CPG Manufacturing",
    excerpt: "Learn how modern supply chain visibility tools are transforming the CPG manufacturing landscape and improving efficiency.",
    category: "Supply Chain",
    image: "/placeholder.svg",
    author: "Sarah Johnson",
    date: "May 15, 2023",
    readTime: "5 min",
    featured: true,
    tags: ["Supply Chain", "Manufacturing", "Technology"]
  },
  {
    id: 2,
    title: "5 Sustainable Packaging Trends for CPG Brands in 2023",
    excerpt: "Explore the latest sustainable packaging innovations that are helping CPG brands reduce their environmental footprint.",
    category: "Packaging",
    image: "/placeholder.svg",
    author: "Michael Chen",
    date: "April 28, 2023",
    readTime: "7 min",
    featured: true,
    tags: ["Sustainability", "Packaging", "Trends"]
  },
  {
    id: 3,
    title: "The Role of AI in Optimizing CPG Manufacturing Processes",
    excerpt: "Discover how artificial intelligence is revolutionizing CPG manufacturing through predictive maintenance and process optimization.",
    category: "Technology",
    image: "/placeholder.svg",
    author: "David Williams",
    date: "April 10, 2023",
    readTime: "6 min",
    featured: false,
    tags: ["AI", "Manufacturing", "Innovation"]
  },
  {
    id: 4,
    title: "Building Successful Brand-Manufacturer Relationships",
    excerpt: "Tips for CPG brands and manufacturers to foster strong, productive partnerships that drive mutual growth.",
    category: "Partnerships",
    image: "/placeholder.svg",
    author: "Emily Rodriguez",
    date: "March 22, 2023",
    readTime: "4 min",
    featured: false,
    tags: ["Brands", "Manufacturers", "Partnerships"]
  },
  {
    id: 5,
    title: "Navigating Regulatory Compliance in CPG Manufacturing",
    excerpt: "A comprehensive guide to understanding and maintaining compliance with evolving regulations in the CPG industry.",
    category: "Compliance",
    image: "/placeholder.svg",
    author: "Robert Miller",
    date: "March 15, 2023",
    readTime: "8 min",
    featured: false,
    tags: ["Compliance", "Regulations", "Manufacturing"]
  },
  {
    id: 6,
    title: "From Concept to Shelf: Accelerating CPG Product Development",
    excerpt: "Strategies for streamlining the product development process to bring CPG products to market faster without sacrificing quality.",
    category: "Product Development",
    image: "/placeholder.svg",
    author: "Jessica Thompson",
    date: "March 5, 2023",
    readTime: "6 min",
    featured: false,
    tags: ["Product Development", "Innovation", "Time-to-Market"]
  }
];

const categories = [
  "All",
  "Supply Chain",
  "Packaging",
  "Technology",
  "Partnerships",
  "Compliance",
  "Product Development"
];

const popularTags = [
  "Manufacturing",
  "Sustainability",
  "Innovation",
  "Supply Chain",
  "Technology",
  "Packaging",
  "Regulations",
  "Partnerships"
];

const Blog = () => {
  useEffect(() => {
    document.title = "Blog - CPG Matchmaker";
    window.scrollTo(0, 0);
  }, []);

  const featuredPosts = blogPosts.filter(post => post.featured);
  const recentPosts = blogPosts.filter(post => !post.featured).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero section */}
        <div className="bg-secondary/50">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">CPG Matchmaker Blog</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Insights, trends, and strategies for the CPG manufacturing industry
              </p>
              
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10 pr-4 py-6" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          {/* Featured posts */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Featured Articles</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden transition-all hover:shadow-md">
                  <div className="aspect-video bg-muted">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{post.category}</Badge>
                      <span className="text-sm text-muted-foreground">
                        {post.date}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{post.title}</CardTitle>
                    <CardDescription>{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{post.readTime} read</span>
                    </div>
                    <Button variant="ghost" className="gap-1" asChild>
                      <Link to={`/blog/${post.id}`}>
                        Read Article <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="col-span-1 lg:col-span-2">
              <Tabs defaultValue="All" className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">Latest Articles</h2>
                  <TabsList>
                    {categories.slice(0, 4).map((category) => (
                      <TabsTrigger key={category} value={category}>
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                
                <TabsContent value="All" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {recentPosts.map((post) => (
                      <Card key={post.id} className="overflow-hidden hover:shadow-sm transition-all">
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline">{post.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              {post.date}
                            </span>
                          </div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <CardDescription>{post.excerpt}</CardDescription>
                        </CardHeader>
                        <CardFooter className="flex justify-between">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{post.readTime} read</span>
                          </div>
                          <Button variant="ghost" size="sm" className="gap-1" asChild>
                            <Link to={`/blog/${post.id}`}>
                              Read <ArrowRight className="h-3 w-3" />
                            </Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                {/* Create content for other tabs */}
                {categories.slice(1, 4).map((category) => (
                  <TabsContent key={category} value={category} className="mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {blogPosts
                        .filter(post => post.category === category)
                        .map((post) => (
                          <Card key={post.id} className="overflow-hidden hover:shadow-sm transition-all">
                            <CardHeader>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">{post.category}</Badge>
                                <span className="text-sm text-muted-foreground">
                                  {post.date}
                                </span>
                              </div>
                              <CardTitle className="text-lg">{post.title}</CardTitle>
                              <CardDescription>{post.excerpt}</CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-between">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{post.readTime} read</span>
                              </div>
                              <Button variant="ghost" size="sm" className="gap-1" asChild>
                                <Link to={`/blog/${post.id}`}>
                                  Read <ArrowRight className="h-3 w-3" />
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              
              <div className="flex justify-center mt-8">
                <Button variant="outline">View All Articles</Button>
              </div>
            </div>
            
            {/* Sidebar */}
            <div className="col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button 
                        key={category} 
                        variant="ghost" 
                        className="justify-between w-full"
                        asChild
                      >
                        <Link to={`/blog/category/${category}`}>
                          {category}
                          <Badge variant="secondary" className="ml-2">
                            {blogPosts.filter(post => 
                              category === "All" ? true : post.category === category
                            ).length}
                          </Badge>
                        </Link>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="hover:bg-secondary cursor-pointer">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Subscribe to Updates</CardTitle>
                  <CardDescription>
                    Get the latest articles and insights delivered to your inbox.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input placeholder="Your email address" />
                    <Button className="w-full">Subscribe</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
