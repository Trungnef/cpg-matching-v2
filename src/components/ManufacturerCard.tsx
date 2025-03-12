import { StarIcon, MapPin, Calendar, Heart, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import { useManufacturerFavorites } from "@/contexts/ManufacturerFavoriteContext";
import { useManufacturerCompare } from "@/contexts/ManufacturerCompareContext";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  onViewDetails?: (id: number) => void;
}

const ManufacturerCard = ({ manufacturer, className, onViewDetails }: ManufacturerCardProps) => {
  const { favorites, toggleFavorite } = useManufacturerFavorites();
  const { compareItems, toggleCompare } = useManufacturerCompare();
  const isFavorite = favorites.some(f => f.id === manufacturer.id);
  const isCompared = compareItems.some(c => c.id === manufacturer.id);

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    hover: {
      y: -5,
      transition: { duration: 0.2 }
    }
  };

  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <motion.div
          key={`star-${i}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.1 }}
        >
          <StarIcon className="h-4 w-4 fill-primary text-primary" />
        </motion.div>
      );
    }
    
    if (hasHalfStar) {
      stars.push(
        <motion.div
          key="half-star"
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: fullStars * 0.1 }}
        >
          <StarIcon className="h-4 w-4 text-muted-foreground" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <StarIcon className="h-4 w-4 fill-primary text-primary" />
          </div>
        </motion.div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <motion.div
          key={`empty-${i}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: (fullStars + (hasHalfStar ? 1 : 0) + i) * 0.1 }}
        >
          <StarIcon className="h-4 w-4 text-muted-foreground" />
        </motion.div>
      );
    }
    
    return stars;
  };

  return (
    <TooltipProvider>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        layoutId={`manufacturer-${manufacturer.id}`}
      >
        <Card className={cn("overflow-hidden group", className)}>
          <div className="p-4">
            <div className="relative">
              <motion.div 
                className="absolute top-2 right-2 z-10 flex gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full"
                      onClick={() => toggleFavorite(manufacturer)}
                    >
                      <Heart
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isFavorite ? "fill-primary text-primary" : "text-muted-foreground"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFavorite ? "Remove from favorites" : "Add to favorites"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 rounded-full"
                      onClick={() => toggleCompare(manufacturer)}
                    >
                      <Scale
                        className={cn(
                          "h-4 w-4 transition-colors",
                          isCompared ? "fill-primary text-primary" : "text-muted-foreground"
                        )}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isCompared ? "Remove from compare" : "Add to compare"}
                  </TooltipContent>
                </Tooltip>
              </motion.div>

              <motion.div 
                className="aspect-square bg-muted rounded-md flex items-center justify-center p-6 mb-4 group-hover:bg-muted/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img 
                  src={manufacturer.logo} 
                  alt={manufacturer.name} 
                  className="w-24 h-24 object-contain"
                />
              </motion.div>
            </div>
            
            <motion.h3 
              className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {manufacturer.name}
            </motion.h3>
            
            <motion.div 
              className="flex items-center text-sm text-foreground/70 mt-1 mb-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {manufacturer.location}
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-1 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {renderRating(manufacturer.rating)}
              <span className="text-xs text-foreground/70 ml-1">{manufacturer.rating.toFixed(1)}</span>
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap gap-1 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {manufacturer.categories.map((category, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="text-xs py-0 h-5 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {category}
                </Badge>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex flex-wrap gap-1 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {manufacturer.certifications.map((certification, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs py-0 h-5 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  {certification}
                </Badge>
              ))}
            </motion.div>
            
            <motion.div 
              className="flex justify-between items-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Est. {manufacturer.establishedYear}</span>
              </div>
              <span>Min: {manufacturer.minOrderSize}</span>
            </motion.div>
          </div>
          
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 group-hover:bg-primary/10"
              onClick={() => onViewDetails?.(manufacturer.id)}
            >
              View Details
            </Button>
            <Button 
              size="sm" 
              className="flex-1"
            >
              Contact
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
};

export default ManufacturerCard;
