import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  ArrowRight, 
  Search, 
  BarChart4, 
  FileText,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Building2,
  Trophy,
  TrendingUp,
  Target,
  Users,
  Calendar,
  MoreVertical
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const CaseStudies = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedStudies, setSavedStudies] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);

  useEffect(() => {
    document.title = "Case Studies - CPG Matchmaker";
    window.scrollTo(0, 0);
    
    // Load saved case studies from localStorage
    const saved = localStorage.getItem("savedCaseStudies");
    if (saved) {
      setSavedStudies(JSON.parse(saved));
    }
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSaveStudy = (studyId: number) => {
    setSavedStudies(prev => {
      const newSaved = prev.includes(studyId)
        ? prev.filter(id => id !== studyId)
        : [...prev, studyId];
      
      localStorage.setItem("savedCaseStudies", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const handleShare = (study: typeof caseStudies[0]) => {
    if (navigator.share) {
      navigator.share({
        title: study.title,
        text: study.excerpt,
        url: window.location.href,
      });
    }
  };

  const filteredStudies = caseStudies
    .filter(study => {
      const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          study.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          study.client.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || study.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  const featuredCaseStudies = filteredStudies.filter(study => study.featured);
  const otherCaseStudies = filteredStudies.filter(study => !study.featured);
  const bookmarkedCaseStudies = caseStudies.filter(study => savedStudies.includes(study.id));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero section */}
        <motion.div 
          className="bg-primary/5 relative overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          {/* Background Patterns */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 to-accent/5" />
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full filter blur-3xl"
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
              className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full filter blur-3xl"
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
          </div>

          <div className="container mx-auto px-4 py-16 relative">
            <motion.div 
              className="max-w-3xl mx-auto text-center"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.h1 
                className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                variants={fadeInUp}
              >
                Success Stories
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground mb-8"
                variants={fadeInUp}
              >
                Real-world examples of how our platform has helped brands, manufacturers, and retailers achieve their goals
              </motion.p>
              
              <motion.div 
                className="relative max-w-md mx-auto"
                variants={fadeInUp}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search case studies..." 
                  className="pl-10 pr-24 py-6 rounded-full"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
                  <Dialog open={isBookmarkDialogOpen} onOpenChange={setIsBookmarkDialogOpen}>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="rounded-full relative"
                      >
                        <Bookmark className="h-4 w-4" />
                        {savedStudies.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            {savedStudies.length}
                          </span>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto no-scrollbar">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                          Saved Case Studies
                          <Badge variant="outline" className="ml-2">
                            {savedStudies.length} saved
                          </Badge>
                        </DialogTitle>
                        <DialogDescription>
                          Your bookmarked case studies for quick access
                        </DialogDescription>
                      </DialogHeader>

                      {bookmarkedCaseStudies.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                          {bookmarkedCaseStudies.map((study) => (
                            <motion.div
                              key={study.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="overflow-hidden h-full group hover:shadow-md transition-all duration-300">
                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <Badge variant="outline" className="text-xs">
                                      {study.category}
                                    </Badge>
                                    <span className="text-xs text-muted-foreground flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {study.readTime}
                                    </span>
                                  </div>
                                  <CardTitle className="text-base hover:text-primary transition-colors line-clamp-2">
                                    <Link to={`/case-studies/${study.id}`}>
                                      {study.title}
                                    </Link>
                                  </CardTitle>
                                </CardHeader>
                                
                                <CardContent className="pb-2">
                                  <div className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                    {study.excerpt}
                                  </div>
                                  <div className="flex items-center gap-2 text-sm">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-medium">{study.client}</span>
                                    <span className="text-muted-foreground">•</span>
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-muted-foreground">{study.date}</span>
                                  </div>
                                </CardContent>
                                
                                <CardFooter className="pt-2 flex justify-between border-t">
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                      <DropdownMenuItem onClick={() => handleShare(study)}>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Share
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleSaveStudy(study.id)}>
                                        <Bookmark className="h-4 w-4 mr-2" />
                                        Remove from saved
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="gap-1"
                                    asChild
                                  >
                                    <Link to={`/case-studies/${study.id}`}>
                                      Read Case Study
                                      <ArrowRight className="h-3 w-3" />
                                    </Link>
                                  </Button>
                                </CardFooter>
                              </Card>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Bookmark className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">No saved case studies</h3>
                          <p className="text-muted-foreground mb-4">
                            Click the bookmark icon on any case study to save it for later
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsBookmarkDialogOpen(false)}
                          >
                            Browse Case Studies
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon"
                        className="rounded-full"
                      >
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Filter Case Studies</SheetTitle>
                        <SheetDescription>
                          Refine your search with these filters
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Sort By</h4>
                          <Select
                            value={sortBy}
                            onValueChange={setSortBy}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="latest">Latest First</SelectItem>
                              <SelectItem value="impact">Highest Impact</SelectItem>
                              <SelectItem value="popular">Most Popular</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Categories</h4>
                          <div className="flex flex-wrap gap-2">
                            {categories.map((category) => (
                              <Badge
                                key={category}
                                variant={selectedCategory === category ? "default" : "outline"}
                                className="cursor-pointer"
                                onClick={() => setSelectedCategory(category)}
                              >
                                {category}
                              </Badge>
                            ))}
              </div>
            </div>
          </div>
                      <SheetFooter>
                        <Button 
                          variant="outline" 
                          onClick={() => {
                            setSelectedCategory("All");
                            setSortBy("latest");
                          }}
                        >
                          Reset Filters
                        </Button>
                        <Button onClick={() => setIsFiltersOpen(false)}>
                          Apply Filters
                        </Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
                </div>
              </motion.div>
            </motion.div>
        </div>
        </motion.div>
        
        <div className="container mx-auto px-4 py-12">
          {/* Featured case studies */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">Featured Success Stories</h2>
              <Button variant="ghost" className="gap-2" asChild>
                <Link to="/case-studies/featured">
                  View All <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredCaseStudies.map((study) => (
                <motion.div
                  key={study.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300">
                    <div className="aspect-[16/9] bg-muted relative group">
                    <img 
                      src={study.image} 
                      alt={study.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
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
                      <div className="absolute top-4 right-20 flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSaveStudy(study.id);
                          }}
                        >
                          {savedStudies.includes(study.id) ? (
                            <BookmarkCheck className="h-4 w-4" />
                          ) : (
                            <Bookmark className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            handleShare(study);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                  </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {study.client}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {study.date}
                        </span>
                      </div>
                      <Link to={`/case-studies/${study.id}`}>
                        <CardTitle className="text-xl hover:text-primary transition-colors">
                          {study.title}
                        </CardTitle>
                      </Link>
                    <CardDescription>{study.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                      <div className="space-y-3">
                        <div className="text-sm font-medium flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-primary" />
                          Key Results:
                        </div>
                        {study.results.map((result, index) => (
                          <motion.div 
                            key={index} 
                            className="flex items-center gap-2 text-sm"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                            {result}
                          </motion.div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{study.readTime} read</span>
                    </div>
                      <Button className="gap-1 group" asChild>
                      <Link to={`/case-studies/${study.id}`}>
                          <span className="group-hover:translate-x-1 transition-transform">
                            Read Case Study
                          </span>
                          <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* All case studies */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">All Case Studies</h2>
              <Tabs defaultValue={selectedCategory} onValueChange={setSelectedCategory}>
                <TabsList>
                  {categories.slice(0, 4).map((category) => (
                    <TabsTrigger key={category} value={category}>
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
            
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
              {otherCaseStudies.map((study) => (
                  <motion.div
                    key={study.id}
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all group">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                      <div className="bg-muted h-10 w-10 rounded-full p-0.5">
                        <img 
                          src={study.logoImage} 
                          alt={study.client} 
                          className="w-full h-full object-contain" 
                        />
                            </div>
                            <div className="text-sm font-medium">{study.client}</div>
                      </div>
                      <Badge variant="outline">{study.category}</Badge>
                    </div>
                        <Link to={`/case-studies/${study.id}`}>
                          <h3 className="text-lg font-semibold line-clamp-2 hover:text-primary transition-colors mb-2">
                            {study.title}
                          </h3>
                        </Link>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                      {study.excerpt}
                    </p>
                        <div className="space-y-2">
                          <div className="text-sm font-medium flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
                            Key Achievements:
                          </div>
                      {study.results.slice(0, 2).map((result, index) => (
                            <motion.div 
                              key={index} 
                              className="flex items-center gap-2 text-xs"
                              initial={{ opacity: 0, x: -20 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                            >
                              <Target className="h-3 w-3 text-primary" />
                          {result}
                            </motion.div>
                      ))}
                    </div>
                  </div>
                  <CardFooter className="flex justify-between py-3">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center text-xs text-muted-foreground">
                            <FileText className="h-3 w-3 mr-1" />
                            {study.readTime}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleSaveStudy(study.id)}
                          >
                            {savedStudies.includes(study.id) ? (
                              <BookmarkCheck className="h-4 w-4" />
                            ) : (
                              <Bookmark className="h-4 w-4" />
                            )}
                          </Button>
                    </div>
                        <Button variant="ghost" size="sm" className="gap-1 group" asChild>
                      <Link to={`/case-studies/${study.id}`}>
                            <span className="group-hover:translate-x-1 transition-transform">
                              Read More
                            </span>
                            <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                  </motion.div>
              ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Stats section */}
          <motion.div 
            className="bg-secondary/30 rounded-lg p-8 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                Proven Results
              </h2>
              <p className="text-muted-foreground">Success metrics from clients across our platform</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { value: "35%", label: "Average Cost Reduction", icon: TrendingUp },
                { value: "42%", label: "Faster Time to Market", icon: Clock },
                { value: "250+", label: "Successful Partnerships", icon: Users },
                { value: "89%", label: "Client Retention Rate", icon: Target }
              ].map((stat, index) => (
                <motion.div 
                  key={index}
                  className="text-center p-4 rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className="inline-block text-primary mb-2"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: index
                    }}
                  >
                    <stat.icon className="h-6 w-6" />
                  </motion.div>
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* CTA section */}
          <motion.div 
            className="bg-gradient-to-br from-primary/10 via-background to-accent/10 rounded-lg p-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
            >
              Ready to create your own success story?
            </motion.h2>
            <motion.p 
              className="text-muted-foreground mb-6 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              Join thousands of brands, manufacturers, and retailers who are already using our platform to grow their businesses
            </motion.p>
            <motion.div 
              className="flex gap-4 justify-center"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Button 
                variant="outline" 
                className="group"
                asChild
              >
                <Link to="/manufacturers">
                  <span className="group-hover:translate-x-1 transition-transform">
                    Browse Manufacturers
                  </span>
                </Link>
              </Button>
              <Button 
                className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 group"
                asChild
              >
                <Link to="/auth?type=register">
                  <span className="group-hover:translate-x-1 transition-transform">
                    Get Started
                  </span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
