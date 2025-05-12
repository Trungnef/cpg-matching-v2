import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  ArrowRight,
  Search,
  Tag,
  Share2,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  Filter,
  SlidersHorizontal,
  Calendar,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

// Mock blog post data
const blogPosts = [
  {
    id: 1,
    title: "How Supply Chain Visibility Can Improve CPG Manufacturing",
    excerpt:
      "Learn how modern supply chain visibility tools are transforming the CPG manufacturing landscape and improving efficiency.",
    category: "Supply Chain",
    image: "/placeholder.svg",
    author: "Sarah Johnson",
    date: "May 15, 2023",
    readTime: "5 min",
    featured: true,
    tags: ["Supply Chain", "Manufacturing", "Technology"],
  },
  {
    id: 2,
    title: "5 Sustainable Packaging Trends for CPG Brands in 2023",
    excerpt:
      "Explore the latest sustainable packaging innovations that are helping CPG brands reduce their environmental footprint.",
    category: "Packaging",
    image: "/placeholder.svg",
    author: "Michael Chen",
    date: "April 28, 2023",
    readTime: "7 min",
    featured: true,
    tags: ["Sustainability", "Packaging", "Trends"],
  },
  {
    id: 3,
    title: "The Role of AI in Optimizing CPG Manufacturing Processes",
    excerpt:
      "Discover how artificial intelligence is revolutionizing CPG manufacturing through predictive maintenance and process optimization.",
    category: "Technology",
    image: "/placeholder.svg",
    author: "David Williams",
    date: "April 10, 2023",
    readTime: "6 min",
    featured: false,
    tags: ["AI", "Manufacturing", "Innovation"],
  },
  {
    id: 4,
    title: "Building Successful Brand-Manufacturer Relationships",
    excerpt:
      "Tips for CPG brands and manufacturers to foster strong, productive partnerships that drive mutual growth.",
    category: "Partnerships",
    image: "/placeholder.svg",
    author: "Emily Rodriguez",
    date: "March 22, 2023",
    readTime: "4 min",
    featured: false,
    tags: ["Brands", "Manufacturers", "Partnerships"],
  },
  {
    id: 5,
    title: "Navigating Regulatory Compliance in CPG Manufacturing",
    excerpt:
      "A comprehensive guide to understanding and maintaining compliance with evolving regulations in the CPG industry.",
    category: "Compliance",
    image: "/placeholder.svg",
    author: "Robert Miller",
    date: "March 15, 2023",
    readTime: "8 min",
    featured: false,
    tags: ["Compliance", "Regulations", "Manufacturing"],
  },
  {
    id: 6,
    title: "From Concept to Shelf: Accelerating CPG Product Development",
    excerpt:
      "Strategies for streamlining the product development process to bring CPG products to market faster without sacrificing quality.",
    category: "Product Development",
    image: "/placeholder.svg",
    author: "Jessica Thompson",
    date: "March 5, 2023",
    readTime: "6 min",
    featured: false,
    tags: ["Product Development", "Innovation", "Time-to-Market"],
  },
];

const categories = [
  "All",
  "Supply Chain",
  "Packaging",
  "Technology",
  "Partnerships",
  "Compliance",
  "Product Development",
];

const popularTags = [
  "Manufacturing",
  "Sustainability",
  "Innovation",
  "Supply Chain",
  "Technology",
  "Packaging",
  "Regulations",
  "Partnerships",
];

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const Blog = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState("latest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    document.title = "Blog - CPG Matchmaker";
    window.scrollTo(0, 0);

    // Load saved posts from localStorage
    const saved = localStorage.getItem("savedPosts");
    if (saved) {
      setSavedPosts(JSON.parse(saved));
    }
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSavePost = (postId: number) => {
    setSavedPosts((prev) => {
      const newSaved = prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId];

      localStorage.setItem("savedPosts", JSON.stringify(newSaved));
      return newSaved;
    });
  };

  const handleShare = (post: (typeof blogPosts)[0]) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    }
  };

  const filteredPosts = blogPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => post.tags.includes(tag));

      return matchesSearch && matchesCategory && matchesTags;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const recentPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-20">
        {/* Hero section */}
        <motion.div
          className="bg-secondary/50 relative overflow-hidden"
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
                ease: "easeInOut",
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
                delay: 1,
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
                {t('blog-title')}
              </motion.h1>
              <motion.p
                className="text-xl text-muted-foreground mb-8"
                variants={fadeInUp}
              >
                {t('blog-subtitle')}
              </motion.p>

              <motion.div
                className="relative max-w-md mx-auto"
                variants={fadeInUp}
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder={t('search-articles')}
                  className="pl-10 pr-4 py-6 rounded-full"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>{t('filter-articles')}</SheetTitle>
                      <SheetDescription>
                        {t('refine-search')}
                      </SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">{t('blog-sort-by')}</h4>
                        <Select value={sortBy} onValueChange={setSortBy}>
                          <SelectTrigger>
                            <SelectValue placeholder={t('blog-sort-by')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="latest">{t('sort-latest')}</SelectItem>
                            <SelectItem value="popular">
                              {t('sort-popular')}
                            </SelectItem>
                            <SelectItem value="trending">{t('sort-trending')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">{t('blog-categories')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {categories.map((category) => (
                            <Badge
                              key={category}
                              variant={
                                selectedCategory === category
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer"
                              onClick={() => setSelectedCategory(category)}
                            >
                              {t(category === "All" 
                                ? "blog-category-all" 
                                : `blog-category-${category.toLowerCase().replace(" ", "-")}`)}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">{t('blog-tags')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {popularTags.map((tag) => (
                            <Badge
                              key={tag}
                              variant={
                                selectedTags.includes(tag)
                                  ? "default"
                                  : "outline"
                              }
                              className="cursor-pointer"
                              onClick={() => handleTagSelect(tag)}
                            >
                              <Tag className="h-3 w-3 mr-1" />
                              {t(`blog-tag-${tag.toLowerCase().replace(" ", "-")}`)}
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
                          setSelectedTags([]);
                          setSortBy("latest");
                        }}
                      >
                        {t('blog-reset-filters')}
                      </Button>
                      <Button onClick={() => setIsFiltersOpen(false)}>
                        {t('blog-apply-filters')}
                      </Button>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        <div className="container mx-auto px-4 py-12">
          {/* Featured posts */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold">{t('featured-articles')}</h2>
              <Button variant="ghost" className="gap-2" asChild>
                <Link to="/blog/featured">
                  {t('view-all')} <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video bg-muted relative group">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSavePost(post.id);
                          }}
                        >
                          {savedPosts.includes(post.id) ? (
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
                            handleShare(post);
                          }}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">
                          {t(`blog-category-${post.category.toLowerCase().replace(" ", "-")}`)}
                        </Badge>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {post.date}
                        </span>
                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {post.author}
                        </span>
                      </div>
                      <Link to={`/blog/${post.id}`}>
                        <CardTitle className="text-xl hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </Link>
                      <CardDescription>{post.excerpt}</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {t('read-time', { time: post.readTime })}
                        </span>
                      </div>
                      <Button variant="ghost" className="gap-1" asChild>
                        <Link to={`/blog/${post.id}`}>
                          {t('read-article')} <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content */}
            <div className="col-span-1 lg:col-span-2">
              <Tabs defaultValue="All" className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">{t('latest-articles')}</h2>
                  <TabsList>
                    {categories.slice(0, 4).map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        onClick={() => setSelectedCategory(category)}
                      >
                        {t(category === "All" 
                          ? "blog-category-all" 
                          : `blog-category-${category.toLowerCase().replace(" ", "-")}`)}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedCategory}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {recentPosts.map((post) => (
                        <motion.div
                          key={post.id}
                          whileHover={{ scale: 1.02 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Card className="overflow-hidden hover:shadow-lg transition-all group">
                            <CardHeader>
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="outline">
                                  {t(`blog-category-${post.category.toLowerCase().replace(" ", "-")}`)}
                                </Badge>
                                <span className="text-sm text-muted-foreground flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {post.date}
                                </span>
                              </div>
                              <Link to={`/blog/${post.id}`}>
                                <CardTitle className="text-lg hover:text-primary transition-colors">
                                  {post.title}
                                </CardTitle>
                              </Link>
                              <CardDescription>{post.excerpt}</CardDescription>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {post.tags.map((tag) => (
                                  <Badge
                                    key={tag}
                                    variant="outline"
                                    className="text-xs"
                                    onClick={() => handleTagSelect(tag)}
                                  >
                                    {t(`blog-tag-${tag.toLowerCase().replace(" ", "-")}`)}
                                  </Badge>
                                ))}
                              </div>
                            </CardHeader>
                            <CardFooter className="flex justify-between">
                              <div className="flex items-center gap-4">
                                <span className="flex items-center text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {t('read-time', { time: post.readTime })}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleSavePost(post.id)}
                                >
                                  {savedPosts.includes(post.id) ? (
                                    <BookmarkCheck className="h-4 w-4" />
                                  ) : (
                                    <Bookmark className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                                asChild
                              >
                                <Link to={`/blog/${post.id}`}>
                                  {t('read')} <ArrowRight className="h-3 w-3" />
                                </Link>
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </Tabs>

              {recentPosts.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button variant="outline">{t('load-more')}</Button>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <motion.div
              className="col-span-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('blog-categories')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={
                          selectedCategory === category ? "default" : "ghost"
                        }
                        className="justify-between w-full"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {t(category === "All" 
                          ? "blog-category-all" 
                          : `blog-category-${category.toLowerCase().replace(" ", "-")}`)}
                        <Badge variant="secondary" className="ml-2">
                          {
                            blogPosts.filter((post) =>
                              category === "All"
                                ? true
                                : post.category === category
                            ).length
                          }
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('blog-tags')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={
                          selectedTags.includes(tag) ? "default" : "outline"
                        }
                        className="hover:bg-secondary cursor-pointer"
                        onClick={() => handleTagSelect(tag)}
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {t(`blog-tag-${tag.toLowerCase().replace(" ", "-")}`)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('subscribe-updates')}</CardTitle>
                  <CardDescription>
                    {t('subscribe-description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form
                    className="space-y-4"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <Input placeholder={t('your-email')} type="email" />
                    <Button className="w-full">{t('blog-subscribe')}</Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>{t('saved-articles')}</CardTitle>
                  <CardDescription>
                    {t('saved-description')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {savedPosts.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        {t('no-saved')}
                      </p>
                    ) : (
                      blogPosts
                        .filter((post) => savedPosts.includes(post.id))
                        .map((post) => (
                          <div
                            key={post.id}
                            className="flex items-start gap-3 group"
                          >
                            <div className="flex-1">
                              <Link
                                to={`/blog/${post.id}`}
                                className="text-sm font-medium hover:text-primary transition-colors"
                              >
                                {post.title}
                              </Link>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-muted-foreground">
                                  {post.date}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {t('read-time', { time: post.readTime })}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => handleSavePost(post.id)}
                            >
                              <BookmarkCheck className="h-4 w-4" />
                            </Button>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
