
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, ArrowRight, Search, PlayCircle, Calendar as CalendarIcon, Users, CheckCircle2 } from "lucide-react";

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

const Webinars = () => {
  const [filter, setFilter] = useState("all"); // all, upcoming, recorded
  
  useEffect(() => {
    document.title = "Webinars - CPG Matchmaker";
    window.scrollTo(0, 0);
  }, []);
  
  const featuredWebinars = webinars.filter(webinar => webinar.featured);
  
  const filteredWebinars = webinars.filter(webinar => {
    if (filter === "all") return !webinar.featured;
    return !webinar.featured && webinar.status === filter;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-20">
        {/* Hero section */}
        <div className="bg-primary/5">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-4">Live and On-Demand Webinars</h1>
              <p className="text-xl text-muted-foreground mb-8">
                Expert insights, industry trends, and practical knowledge for CPG brands and manufacturers
              </p>
              
              <div className="relative max-w-md mx-auto mb-8">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input 
                  placeholder="Search webinars..." 
                  className="pl-10 pr-4 py-6" 
                />
              </div>
              
              <div className="flex justify-center gap-4">
                <Button 
                  variant={filter === "all" ? "default" : "outline"}
                  onClick={() => setFilter("all")}
                >
                  All Webinars
                </Button>
                <Button 
                  variant={filter === "upcoming" ? "default" : "outline"}
                  onClick={() => setFilter("upcoming")}
                >
                  Upcoming
                </Button>
                <Button 
                  variant={filter === "recorded" ? "default" : "outline"}
                  onClick={() => setFilter("recorded")}
                >
                  Recorded
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-12">
          {/* Featured webinars */}
          <div className="mb-16">
            <h2 className="text-2xl font-bold mb-8">Featured Webinars</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredWebinars.map((webinar) => (
                <Card key={webinar.id} className="overflow-hidden shadow-md">
                  <div className="aspect-video bg-muted relative">
                    <img 
                      src={webinar.image} 
                      alt={webinar.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <PlayCircle className="h-16 w-16 text-white opacity-80" />
                    </div>
                    <Badge className="absolute top-4 right-4 uppercase">
                      {webinar.status === "upcoming" ? "Live" : "On-Demand"}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{webinar.category}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {webinar.duration}
                      </span>
                    </div>
                    <CardTitle className="text-xl">{webinar.title}</CardTitle>
                    <CardDescription>{webinar.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-3">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div className="text-sm">
                        {webinar.date} • {webinar.time}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-4">
                      <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                      <div className="text-sm font-medium">Speakers:</div>
                    </div>
                    
                    <div className="space-y-3">
                      {webinar.speakers.map((speaker, index) => (
                        <div key={index} className="flex items-center">
                          <div className="h-8 w-8 mr-3 rounded-full overflow-hidden">
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
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full gap-2">
                      {webinar.status === "upcoming" ? (
                        <>Register Now <ArrowRight className="h-4 w-4" /></>
                      ) : (
                        <>Watch Recording <PlayCircle className="h-4 w-4" /></>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
          
          {/* All webinars */}
          <div className="mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
              <h2 className="text-2xl font-bold">
                {filter === "upcoming" ? "Upcoming Webinars" : 
                 filter === "recorded" ? "Recorded Webinars" : "All Webinars"}
              </h2>
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
              {filteredWebinars.map((webinar) => (
                <Card key={webinar.id} className="overflow-hidden transition-all hover:shadow-sm">
                  <div className="relative">
                    <div className="aspect-video bg-muted">
                      <img 
                        src={webinar.image} 
                        alt={webinar.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <PlayCircle className="h-12 w-12 text-white opacity-70" />
                    </div>
                    <Badge 
                      className={`absolute top-2 right-2 uppercase ${
                        webinar.status === "upcoming" ? "bg-green-500" : ""
                      }`}
                    >
                      {webinar.status === "upcoming" ? "Live" : "On-Demand"}
                    </Badge>
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between mb-1">
                      <Badge variant="outline">{webinar.category}</Badge>
                      <span className="text-xs text-muted-foreground flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {webinar.duration}
                      </span>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{webinar.title}</CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex items-center mb-3 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {webinar.date}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {webinar.speakers.map((speaker, index) => (
                        <div key={index} className="flex items-center bg-secondary/50 rounded-full pl-1 pr-3 py-1">
                          <div className="h-5 w-5 mr-2 rounded-full overflow-hidden">
                            <img 
                              src={speaker.image} 
                              alt={speaker.name} 
                              className="h-full w-full object-cover" 
                            />
                          </div>
                          <div className="text-xs">{speaker.name}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button variant="outline" className="w-full gap-2" asChild>
                      <Link to={`/webinars/${webinar.id}`}>
                        {webinar.status === "upcoming" ? (
                          <>Register <ArrowRight className="h-4 w-4" /></>
                        ) : (
                          <>Watch <PlayCircle className="h-4 w-4" /></>
                        )}
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More</Button>
            </div>
          </div>
          
          {/* Subscribe section */}
          <div className="bg-primary/10 rounded-lg p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-3">Never Miss a Webinar</h2>
              <p className="text-muted-foreground mb-6">
                Subscribe to our newsletter to get notified about upcoming webinars and receive access to exclusive content
              </p>
              
              <div className="flex flex-col md:flex-row gap-3 max-w-md mx-auto">
                <Input placeholder="Your email address" className="md:flex-1" />
                <Button>Subscribe</Button>
              </div>
              
              <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  Weekly updates
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  Exclusive content
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                  No spam
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Webinars;
