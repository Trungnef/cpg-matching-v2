import { motion } from "framer-motion";
import { StarIcon, Heart, Info, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Product {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  image: string;
  price: string;
  rating: number;
  productType: string;
  description?: string;
  minOrderQuantity?: number;
  leadTime?: string;
  sustainable?: boolean;
}

interface ProductCardProps {
  product: Product;
  className?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  onDetailsClick?: () => void;
}

const ProductCard = ({ 
  product, 
  className,
  isFavorite = false,
  onFavoriteToggle,
  onDetailsClick 
}: ProductCardProps) => {
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
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-md border group", className)}>
      <div className="relative pt-4 px-4">
        <motion.div 
          className="aspect-square bg-muted rounded-md flex items-center justify-center p-4 overflow-hidden"
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <motion.img 
            src={product.image} 
            alt={product.name} 
            className="w-24 h-24 object-contain"
            whileHover={{ 
              scale: 1.1,
              transition: { duration: 0.5 }
            }}
          />
          {product.sustainable && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute top-6 left-6 bg-green-100 text-green-800 rounded-full p-1">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Sustainable Product</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </motion.div>
        
        <Badge className="absolute top-6 right-6 animate-fadeIn">{product.category}</Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors duration-300 flex-1">
            {product.name}
          </h3>
          
          <motion.button 
            className={`p-1.5 ml-2 rounded-full ${isFavorite ? 'text-red-500 bg-red-50' : 'text-muted-foreground hover:text-red-500 bg-transparent hover:bg-muted'} transition-colors duration-300`}
            onClick={onFavoriteToggle}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </motion.button>
        </div>
        
        <p className="text-sm text-foreground/70 mb-2">{product.manufacturer}</p>
        
        <div className="flex items-center gap-1 mb-1">
          {renderRating(product.rating)}
          <span className="text-xs text-foreground/70 ml-1">{product.rating.toFixed(1)}</span>
        </div>
        
        {product.minOrderQuantity && (
          <p className="text-xs text-muted-foreground mt-1">
            Min. Order: {product.minOrderQuantity} units
          </p>
        )}
        
        <div className="flex justify-between items-center mt-3">
          <p className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent group-hover:opacity-100 opacity-90 transition-opacity duration-300">
            {product.price}
          </p>
          <Badge variant="secondary" className="text-xs">
            {product.productType}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full flex items-center justify-center gap-1 group-hover:border-primary transition-colors duration-300"
            onClick={onDetailsClick}
          >
            <Info className="h-4 w-4 group-hover:animate-pulse" />
            Details
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex-1">
          <Button 
            size="sm" 
            className="w-full flex items-center justify-center gap-1"
          >
            Match
            <ArrowUpRight className="h-4 w-4 opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Button>
        </motion.div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
