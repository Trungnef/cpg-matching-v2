
import { StarIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  image: string;
  price: string;
  certifications: string[];
  rating: number;
  packagingType: string;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard = ({ product, className }: ProductCardProps) => {
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
      <div className="relative pt-4 px-4">
        <div className="aspect-square bg-muted rounded-md flex items-center justify-center p-4">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-24 h-24 object-contain"
          />
        </div>
        <Badge className="absolute top-6 right-6">{product.category}</Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold line-clamp-1">{product.name}</h3>
        <p className="text-sm text-foreground/70 mb-2">{product.manufacturer}</p>
        
        <div className="flex flex-wrap gap-1 mb-3">
          {product.certifications.map((cert, index) => (
            <Badge 
              key={index} 
              variant="outline" 
              className="text-xs py-0 h-5"
            >
              {cert}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center gap-1 mb-1">
          {renderRating(product.rating)}
          <span className="text-xs text-foreground/70 ml-1">{product.rating.toFixed(1)}</span>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <p className="font-medium">{product.price}</p>
          <Badge variant="secondary" className="text-xs">
            {product.packagingType}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button variant="outline" size="sm" className="flex-1">
          Details
        </Button>
        <Button size="sm" className="flex-1">
          Match
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
