import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";

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
  description?: string;
  minOrderQuantity?: number;
  leadTime?: string;
  sustainable?: boolean;
}

interface FavoriteContextType {
  favorites: Product[];
  favoriteIds: number[];
  addToFavorites: (product: Product) => void;
  removeFromFavorites: (productId: number) => void;
  toggleFavorite: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  clearFavorites: () => void;
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined);

export const FavoriteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Product[]>([]);
  
  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Failed to parse favorites from localStorage:', error);
        localStorage.removeItem('favorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const favoriteIds = favorites.map(fav => fav.id);

  const addToFavorites = (product: Product) => {
    if (!favoriteIds.includes(product.id)) {
      setFavorites(prev => [...prev, product]);
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
        duration: 3000,
      });
    }
  };

  const removeFromFavorites = (productId: number) => {
    if (favoriteIds.includes(productId)) {
      const product = favorites.find(fav => fav.id === productId);
      setFavorites(prev => prev.filter(item => item.id !== productId));
      toast({
        title: "Removed from favorites",
        description: `${product?.name || 'Product'} has been removed from your favorites.`,
        duration: 3000,
      });
    }
  };

  const toggleFavorite = (product: Product) => {
    if (favoriteIds.includes(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const isFavorite = (productId: number) => {
    return favoriteIds.includes(productId);
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast({
      title: "Favorites cleared",
      description: "All products have been removed from your favorites.",
      duration: 3000,
    });
  };

  return (
    <FavoriteContext.Provider value={{ 
      favorites, 
      favoriteIds,
      addToFavorites, 
      removeFromFavorites, 
      toggleFavorite,
      isFavorite,
      clearFavorites 
    }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoriteContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoriteProvider');
  }
  return context;
}; 