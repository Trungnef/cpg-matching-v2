
import { StarIcon, MapPin, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface ManufacturerCardProps {
  manufacturer: Manufacturer;
  className?: string;
}

const ManufacturerCard = ({ manufacturer, className }: ManufacturerCardProps) => {
  // Convert rating to array of stars (filled and unfilled)
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // Add filled stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} className="h-4 w-4 fill-primary text-primary" />);
    }
    
    // Add half star if needed
    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative">
          <StarIcon className="h-4 w-4 text-muted-foreground" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <StarIcon className="h-4 w-4 fill-primary text-primary" />
          </div>
        </div>
      );
    }
    
    // Add empty stars
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<StarIcon key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />);
    }
    
    return stars;
  };

  return (
    <Card className={cn("overflow-hidden transition-all hover:shadow-md", className)}>
      <div className="p-4">
        <div className="aspect-square bg-muted rounded-md flex items-center justify-center p-6 mb-4">
          <img 
            src={manufacturer.logo} 
            alt={manufacturer.name} 
            className="w-24 h-24 object-contain"
          />
        </div>
        
        <h3 className="font-semibold text-lg line-clamp-1">{manufacturer.name}</h3>
        
        <div className="flex items-center text-sm text-foreground/70 mt-1 mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          {manufacturer.location}
        </div>
        
        <div className="flex items-center gap-1 mb-3">
          {renderRating(manufacturer.rating)}
          <span className="text-xs text-foreground/70 ml-1">{manufacturer.rating.toFixed(1)}</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {manufacturer.categories.map((category, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs py-0 h-5"
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {manufacturer.certifications.map((certification, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs py-0 h-5"
            >
              {certification}
            </Badge>
          ))}
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Est. {manufacturer.establishedYear}</span>
          </div>
          <span>Min: {manufacturer.minOrderSize}</span>
        </div>
      </div>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Profile
        </Button>
        <Button size="sm" className="flex-1">
          Contact
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ManufacturerCard;
