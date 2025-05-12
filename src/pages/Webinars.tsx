import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  Clock, 
  ArrowRight, 
  Search, 
  PlayCircle,
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  Share2,
  Bookmark,
  BookmarkCheck,
  Filter,
  SlidersHorizontal,
  ChevronRight,
  Building2,
  Trophy,
  Target,
  TrendingUp,
  AlertCircle,
  MoreVertical,
  SearchX
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select";
import {
  Skeleton
} from "@/components/ui/skeleton";

// Mock webinars data
const webinars = [
  {
    id: 1,
    title: "Optimizing Your Supply Chain: Strategies for CPG Brands",
    description: "Learn practical strategies to streamline your supply chain, reduce costs, and improve efficiency in this expert-led session.",
    image: "/placeholder.svg",
    date: "June 15, 2023",
    time: "11:00 AM - 12:30 PM EST",
    speakers: [
      { name: "Jennifer Lopez", title: "Supply Chain Director, CPG Solutions", image: "/placeholder.svg" },
      { name: "Marcus Chen", title: "Head of Operations, GreenEarth Foods", image: "/placeholder.svg" }
    ],
    category: "Supply Chain",
    duration: "90 min",
    status: "upcoming",
    featured: true
  },
  {
    id: 2,
    title: "Sustainable Packaging Innovations for 2023 and Beyond",
    description: "Explore the latest developments in eco-friendly packaging solutions that can reduce environmental impact while delighting consumers.",
    image: "/placeholder.svg",
    date: "June 22, 2023",
    time: "1:00 PM - 2:00 PM EST",
    speakers: [
      { name: "Sarah Johnson", title: "Sustainability Expert, EcoPack", image: "/placeholder.svg" }
    ],
    category: "Packaging",
    duration: "60 min",
    status: "upcoming",
    featured: true
  },
  {
    id: 3,
    title: "Manufacturing Partnerships: Finding the Perfect Match",
    description: "Discover key factors to consider when selecting manufacturing partners and learn how to build successful long-term relationships.",
    image: "/placeholder.svg",
    date: "May 18, 2023",
    time: "10:00 AM - 11:30 AM EST",
    speakers: [
      { name: "David Williams", title: "CEO, CPG Matchmaker", image: "/placeholder.svg" },
      { name: "Rebecca Liu", title: "Partnerships Lead, PureGood Brands", image: "/placeholder.svg" }
    ],
    category: "Partnerships",
    duration: "90 min",
    status: "recorded",
    featured: false
  },
  {
    id: 4,
    title: "Scaling Production: How to Meet Growing Demand",
    description: "Expert insights on scaling your manufacturing capacity efficiently while maintaining product quality and consistency.",
    image: "/placeholder.svg",
    date: "May 5, 2023",
    time: "2:00 PM - 3:00 PM EST",
    speakers: [
      { name: "Michael Brown", title: "Operations Director, Scale Manufacturing", image: "/placeholder.svg" }
    ],
    category: "Scaling",
    duration: "60 min",
    status: "recorded",
    featured: false
  },
  {
    id: 5,
    title: "Regulatory Compliance in Food and Beverage Manufacturing",
    description: "Navigate the complex world of regulations with this comprehensive overview of compliance requirements for CPG manufacturers.",
    image: "/placeholder.svg",
    date: "April 20, 2023",
    time: "11:00 AM - 12:00 PM EST",
    speakers: [
      { name: "Lisa Rodriguez", title: "Regulatory Affairs Specialist, CompliancePro", image: "/placeholder.svg" }
    ],
    category: "Compliance",
    duration: "60 min",
    status: "recorded",
    featured: false
  },
  {
    id: 6,
    title: "Digital Transformation in CPG Manufacturing",
    description: "Learn how smart technologies and digital processes are revolutionizing manufacturing efficiency and product innovation.",
    image: "/placeholder.svg",
    date: "April 12, 2023",
    time: "1:00 PM - 2:30 PM EST",
    speakers: [
      { name: "Robert Johnson", title: "CTO, TechManufacture", image: "/placeholder.svg" },
      { name: "Amelia Wong", title: "Digital Innovation Lead, Future CPG", image: "/placeholder.svg" }
    ],
    category: "Technology",
    duration: "90 min",
    status: "recorded",
    featured: false
  }
];

const categories = [
  "All",
  "Supply Chain",
  "Packaging",
  "Partnerships",
  "Scaling",
  "Compliance",
  "Technology"
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

const Webinars = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [savedWebinars, setSavedWebinars] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("date");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [isBookmarkDialogOpen, setIsBookmarkDialogOpen] = useState(false);
  
  useEffect(() => {
    document.title = "Webinars - CPG Matchmaker";
    window.scrollTo(0, 0);
    
    // Load saved webinars from localStorage
    const saved = localStorage.getItem("savedWebinars");
    if (saved) {
      setSavedWebinars(JSON.parse(saved));
    }
    
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleSaveWebinar = (webinarId: number) => {
    setSavedWebinars(prev => {
      const newSaved = prev.includes(webinarId)
        ? prev.filter(id => id !== webinarId)
        : [...prev, webinarId];
      
      localStorage.setItem("savedWebinars", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const handleShare = (webinar: typeof webinars[0]) => {
    if (navigator.share) {
      navigator.share({
        title: webinar.title,
        text: webinar.description,
        url: window.location.href,
      });
    }
  };

  const filteredWebinars = webinars
    .filter(webinar => {
      const matchesSearch = webinar.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          webinar.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filter === "all" || webinar.status === filter;
      const matchesCategory = selectedCategory === "All" || webinar.category === selectedCategory;
      
      return matchesSearch && matchesFilter && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  const featuredWebinars = filteredWebinars.filter(webinar => webinar.featured);
  const otherWebinars = filteredWebinars.filter(webinar => !webinar.featured);

  const bookmarkedWebinars = webinars.filter(webinar => savedWebinars.includes(webinar.id));

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
                {t('webinars-title')}
              </motion.h1>
              <motion.p 
                className="text-xl text-muted-foreground mb-8"
                variants={fadeInUp}
              >
                {t('webinars-subtitle')}
              </motion.p>
              
              <motion.div 
                className="relative max-w-md mx-auto mb-8"
                variants={fadeInUp}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder={t('search-webinars')}
                  className="pl-10 pr-24 py-6 rounded-full" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
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
                        {savedWebinars.length > 0 && (
                          <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                            {savedWebinars.length}
                          </span>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto no-scrollbar">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <BookmarkCheck className="h-5 w-5 text-primary" />
                          {t('saved-webinars')}
                          <Badge variant="outline" className="ml-2">
                            {savedWebinars.length} {t('webinars-saved')}
                          </Badge>
                        </DialogTitle>
                        <DialogDescription>
                          {t('bookmarked-webinars')}
                        </DialogDescription>
                      </DialogHeader>

                      {bookmarkedWebinars.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                          {bookmarkedWebinars.map((webinar) => (
                            <motion.div
                              key={webinar.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Card className="flex flex-col h-full group">
                                <div className="relative aspect-video">
                                  <img 
                                    src={webinar.image} 
                                    alt={webinar.title} 
                                    className="w-full h-full object-cover rounded-t-lg" 
                                  />
                                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <PlayCircle className="h-12 w-12 text-white" />
                                  </div>
                                  <Badge 
                                    className={`absolute top-2 right-2 uppercase ${
                                      webinar.status === "upcoming" ? "bg-green-500" : ""
                                    }`}
                                  >
                                    {webinar.status === "upcoming" ? t('live') : t('on-demand')}
                                  </Badge>
                                </div>

                                <CardHeader className="pb-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <Badge variant="outline">{webinar.category}</Badge>
                                    <span className="text-xs text-muted-foreground">
                                      {webinar.duration}
                                    </span>
                                  </div>
                                  <CardTitle className="text-base line-clamp-1">
                                    {webinar.title}
                                  </CardTitle>
                                </CardHeader>

                                <CardContent className="pb-2 flex-grow">
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span>{webinar.date}</span>
                                    {webinar.status === "upcoming" && (
                                      <>
                                        <span>•</span>
                                        <span>{webinar.time}</span>
                                      </>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap gap-1">
                                    {webinar.speakers.map((speaker, index) => (
                                      <div 
                                        key={index}
                                        className="flex items-center text-xs bg-secondary/50 rounded-full px-2 py-1"
                                      >
                                        <span>{speaker.name}</span>
                                      </div>
                                    ))}
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
                                      <DropdownMenuItem onClick={() => handleShare(webinar)}>
                                        <Share2 className="h-4 w-4 mr-2" />
                                        {t('share')}
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => handleSaveWebinar(webinar.id)}>
                                        <Bookmark className="h-4 w-4 mr-2" />
                                        {t('remove-saved')}
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                  <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="gap-1"
                                    asChild
                                  >
                                    <Link to={`/webinars/${webinar.id}`}>
                                      {webinar.status === "upcoming" ? t('register') : t('watch')}
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
                          <h3 className="text-lg font-medium mb-2">{t('no-saved-webinars')}</h3>
                          <p className="text-muted-foreground mb-4">
                            {t('click-bookmark')}
                          </p>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsBookmarkDialogOpen(false)}
                          >
                            {t('browse-webinars')}
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
                        <SheetTitle>{t('filter-webinars')}</SheetTitle>
                        <SheetDescription>
                          {t('refine-webinars-search')}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="py-4 space-y-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">{t('sort-by')}</h4>
                          <Select
                            value={sortBy}
                            onValueChange={setSortBy}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t('sort-by')} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="date">{t('newest-first')}</SelectItem>
                              <SelectItem value="popular">{t('most-popular')}</SelectItem>
                              <SelectItem value="duration">{t('duration')}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">{t('categories')}</h4>
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
                            setSortBy("date");
                          }}
                        >
                          {t('reset-filters')}
                        </Button>
                        <Button>{t('apply-filters')}</Button>
                      </SheetFooter>
                    </SheetContent>
                  </Sheet>
              </div>
              </motion.div>
              
              <motion.div 
                className="flex justify-center gap-4"
                variants={fadeInUp}
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                <Button 
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                        className="rounded-full"
                >
                  {t('all-webinars')}
                </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('all-webinars')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                <Button 
                  variant={filter === "upcoming" ? "default" : "outline"}
                  onClick={() => setFilter("upcoming")}
                        className="rounded-full"
                >
                  {t('upcoming')}
                </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('view-upcoming-webinars')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                <Button 
                  variant={filter === "recorded" ? "default" : "outline"}
                  onClick={() => setFilter("recorded")}
                        className="rounded-full"
                >
                  {t('recorded')}
                </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      {t('access-recorded-webinars')}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        
        <div className="container mx-auto px-4 py-12">
          {/* Featured webinars */}
          <motion.div 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{t('featured-webinars')}</h2>
              <Button variant="ghost" className="gap-2" asChild>
                <Link to="/webinars/featured">
                  {t('view-all')} <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {[1, 2].map((i) => (
                    <Card key={i} className="overflow-hidden shadow-md animate-pulse">
                      <div className="aspect-video bg-muted" />
                      <CardHeader>
                        <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                        <div className="h-6 bg-muted rounded w-3/4 mb-2" />
                        <div className="h-4 bg-muted rounded w-full" />
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-1/2" />
                          <div className="h-4 bg-muted rounded w-3/4" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
              {featuredWebinars.map((webinar) => (
                    <motion.div
                      key={webinar.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group">
                  <div className="aspect-video bg-muted relative">
                    <img 
                      src={webinar.image} 
                      alt={webinar.title} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <PlayCircle className="h-16 w-16 text-white opacity-80 group-hover:opacity-100 transition-opacity" />
                    </div>
                          <Badge 
                            className={`absolute top-4 right-4 uppercase ${
                              webinar.status === "upcoming" ? "bg-green-500" : ""
                            }`}
                          >
                      {webinar.status === "upcoming" ? t('live') : t('on-demand')}
                    </Badge>
                          <div className="absolute top-4 right-20 flex gap-2">
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleSaveWebinar(webinar.id)}
                            >
                              {savedWebinars.includes(webinar.id) ? (
                                <BookmarkCheck className="h-4 w-4" />
                              ) : (
                                <Bookmark className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="secondary"
                              size="icon"
                              className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleShare(webinar)}
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Building2 className="h-3 w-3" />
                              {webinar.speakers[0].title}
                            </span>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {webinar.date}
                      </span>
                    </div>
                          <CardTitle className="text-xl hover:text-primary transition-colors">
                            {webinar.title}
                          </CardTitle>
                    <CardDescription>{webinar.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                          <div className="space-y-3">
                            <div className="text-sm font-medium flex items-center gap-2">
                              <Trophy className="h-4 w-4 text-primary" />
                              {t('key-topics')}
                    </div>
                      {webinar.speakers.map((speaker, index) => (
                              <motion.div 
                                key={index} 
                                className="flex items-center gap-2"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                              >
                                <div className="h-8 w-8 rounded-full overflow-hidden">
                            <img 
                              src={speaker.image} 
                              alt={speaker.name} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium">{speaker.name}</div>
                            <div className="text-xs text-muted-foreground">{speaker.title}</div>
                          </div>
                              </motion.div>
                      ))}
                    </div>
                  </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {webinar.duration}
                            </span>
                            {webinar.status === "upcoming" && (
                              <Badge variant="outline" className="text-green-500 border-green-500">
                                <Calendar className="h-3 w-3 mr-1" />
                                {webinar.time}
                              </Badge>
                            )}
                          </div>
                          <Button className="gap-2 group" asChild>
                            <Link to={`/webinars/${webinar.id}`}>
                              <span className="group-hover:translate-x-1 transition-transform">
                                {webinar.status === "upcoming" ? t('register-now') : t('watch-recording')}
                              </span>
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                    </Button>
                  </CardFooter>
                </Card>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          
          {/* All webinars */}
          <motion.div
            className="py-16 container mx-auto px-4" 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold">{t('all-webinars')}</h2>
                <p className="text-muted-foreground">{t('browse-all-webinars')}</p>
              </div>
              
              <motion.div 
                className="flex gap-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={t('sort-by')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('sort-by')}</SelectLabel>
                      <SelectItem value="newest">{t('newest-first')}</SelectItem>
                      <SelectItem value="oldest">{t('oldest-first')}</SelectItem>
                      <SelectItem value="popular">{t('most-popular')}</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </motion.div>
            </div>

            <div className="mb-8 flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge 
                  key={category} 
                  variant={selectedCategory === category ? "default" : "outline"}
                  className="cursor-pointer hover:shadow-md transition-all"
                  onClick={() => setSelectedCategory(category)}
                >
                      {category}
                </Badge>
                  ))}
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-[320px] rounded-lg" />
                ))}
              </div>
            ) : filteredWebinars.length > 0 ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
              {filteredWebinars.map((webinar) => (
                  <motion.div
                    key={webinar.id}
                    variants={fadeInUp}
                    className="group"
                  >
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300">
                      <div className="relative aspect-video">
                      <img 
                        src={webinar.image} 
                        alt={webinar.title} 
                        className="w-full h-full object-cover" 
                      />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="bg-white rounded-full p-3"
                          >
                            <PlayCircle className="h-8 w-8 text-primary" />
                          </motion.div>
                    </div>
                    <Badge 
                      className={`absolute top-2 right-2 uppercase ${
                        webinar.status === "upcoming" ? "bg-green-500" : ""
                      }`}
                    >
                      {webinar.status === "upcoming" ? t('live') : t('on-demand')}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline">{webinar.category}</Badge>
                          <div className="flex items-center gap-2">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => handleShare(webinar)}
                                >
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t('share')}</p>
                              </TooltipContent>
                            </Tooltip>
                            
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleSaveWebinar(webinar.id)}
                                >
                                  {savedWebinars.includes(webinar.id) ? (
                                    <BookmarkCheck className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Bookmark className="h-4 w-4" />
                                  )}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{savedWebinars.includes(webinar.id) ? t('saved') : t('save-for-later')}</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                    </div>
                        <CardTitle className="text-lg hover:text-primary transition-colors duration-200">
                          <Link to={`/webinars/${webinar.id}`}>
                            {webinar.title}
                          </Link>
                        </CardTitle>
                  </CardHeader>
                  
                      <CardContent className="pb-2 flex-grow">
                        <div className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {webinar.description}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CalendarIcon className="h-4 w-4" />
                          <span>{webinar.date}</span>
                          {webinar.status === "upcoming" && (
                            <>
                              <span>•</span>
                              <span>{webinar.time}</span>
                            </>
                          )}
                    </div>
                      </CardContent>
                      
                      <CardFooter className="pt-2 flex items-center justify-between border-t">
                        <div className="flex -space-x-3">
                          {webinar.speakers.slice(0, 3).map((speaker, index) => (
                            <Tooltip key={index}>
                              <TooltipTrigger asChild>
                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center ring-2 ring-background">
                                  {speaker.image ? (
                            <img 
                              src={speaker.image} 
                              alt={speaker.name} 
                                      className="h-full w-full rounded-full object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs font-medium">
                                      {speaker.name.split(' ').map(n => n[0]).join('')}
                                    </span>
                                  )}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{speaker.name}</p>
                                <p className="text-xs text-muted-foreground">{speaker.title}</p>
                              </TooltipContent>
                            </Tooltip>
                          ))}
                          {webinar.speakers.length > 3 && (
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center ring-2 ring-background text-xs">
                              +{webinar.speakers.length - 3}
                          </div>
                          )}
                        </div>
                        
                        <Button 
                          variant="default" 
                          size="sm" 
                          className="gap-1"
                          asChild
                        >
                      <Link to={`/webinars/${webinar.id}`}>
                            {webinar.status === "upcoming" ? t('register') : t('watch')}
                            <ArrowRight className="h-3 w-3" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center py-16">
                <SearchX className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">{t('no-webinars-found')}</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  {t('no-webinars-message')}
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  {t('reset-filters')}
                </Button>
            </div>
            )}
          </motion.div>
          
          {/* Subscribe section */}
          <motion.div 
            className="bg-gradient-to-r from-primary/10 to-primary/5 py-16 relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="max-w-3xl mx-auto text-center">
              <motion.h2 
                className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
              >
                {t('never-miss-webinar')}
              </motion.h2>
              <motion.p 
                className="text-muted-foreground mb-6"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                {t('subscribe-newsletter')}
              </motion.p>
              
              <motion.div 
                className="flex flex-col md:flex-row gap-3 max-w-md mx-auto"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <Input placeholder={t('your-email')} className="md:flex-1" />
                <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300">
                  {t('subscribe')}
                </Button>
              </motion.div>
              
              <motion.div 
                className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  {t('weekly-updates')}
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  {t('exclusive-content')}
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  {t('no-spam')}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Webinars;
