import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Star,
  Calendar,
  Building2,
  Factory,
  Award,
  Package,
  Users,
  Clock,
  Truck,
  Mail,
  Phone,
  Globe,
  Heart
} from "lucide-react";
import { useManufacturerFavorites } from "@/contexts/ManufacturerFavoriteContext";
import { cn } from "@/lib/utils";

interface Manufacturer {
  id: number;
  name: string;
  location: string;
  logo: string;
  categories: string[];
  certifications: string[];
  minOrderSize: string;
  establishedYear: number;
  rating: number;
}

interface ManufacturerDetailsProps {
  manufacturer: Manufacturer;
  isOpen: boolean;
  onClose: () => void;
}

const ManufacturerDetails = ({ manufacturer, isOpen, onClose }: ManufacturerDetailsProps) => {
  const { favorites, toggleFavorite } = useManufacturerFavorites();
  const isFavorite = favorites.some(f => f.id === manufacturer.id);

  // Animation variants
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`star-${i}`} className="h-4 w-4 fill-primary text-primary" />
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <Star className="h-4 w-4 text-muted-foreground" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star className="h-4 w-4 fill-primary text-primary" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
      );
    }
    
    return stars;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                <img src={manufacturer.logo} alt={manufacturer.name} className="w-12 h-12" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold">{manufacturer.name}</DialogTitle>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{manufacturer.location}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => toggleFavorite(manufacturer)}
            >
              <Heart className={cn(
                "h-5 w-5 transition-colors",
                isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
              )} />
            </Button>
          </div>
        </DialogHeader>

        <ScrollArea className="h-full px-6 pb-6">
          <Tabs defaultValue="overview" className="mt-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
              <TabsTrigger value="certifications">Certifications</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
            </TabsList>

            <motion.div
              variants={contentVariants}
              initial="hidden"
              animate="visible"
            >
              <TabsContent value="overview" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>Company Name</span>
                        </div>
                        <span className="font-medium">{manufacturer.name}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>Location</span>
                        </div>
                        <span className="font-medium">{manufacturer.location}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Established</span>
                        </div>
                        <span className="font-medium">{manufacturer.establishedYear}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 text-muted-foreground" />
                          <span>Rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {renderRating(manufacturer.rating)}
                          <span className="ml-2 font-medium">{manufacturer.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Categories</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {manufacturer.categories.map((category, index) => (
                          <Badge key={index} variant="secondary">
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="capabilities" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Manufacturing Capabilities</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Factory className="h-4 w-4" />
                        Production Capacity
                      </h4>
                      <p className="text-muted-foreground">
                        Information about production capacity and capabilities will be displayed here.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Minimum Order
                      </h4>
                      <p className="font-medium">{manufacturer.minOrderSize}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Lead Times
                      </h4>
                      <p className="text-muted-foreground">
                        Information about production and delivery lead times will be displayed here.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Shipping Capabilities
                      </h4>
                      <p className="text-muted-foreground">
                        Information about shipping and logistics capabilities will be displayed here.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="certifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Certifications & Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {manufacturer.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                      <div className="pt-4">
                        <p className="text-muted-foreground">
                          Additional certification and compliance information will be displayed here.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="contact" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          Key Contacts
                        </h4>
                        <div className="space-y-3 text-muted-foreground">
                          <p>Contact information will be displayed here.</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium mb-3">Contact Methods</h4>
                        <div className="space-y-3">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span>Email address will be displayed here</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Phone className="h-4 w-4" />
                            <span>Phone number will be displayed here</span>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Globe className="h-4 w-4" />
                            <span>Website will be displayed here</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4">
                      <Button className="w-full">Contact Manufacturer</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ManufacturerDetails; 