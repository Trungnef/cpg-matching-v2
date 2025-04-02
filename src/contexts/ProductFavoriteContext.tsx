import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

// Define Product interface based on the error information
interface Product {
  id: number;
  name: string;
  category: string;
  manufacturer: string;
  image: string;
  price: string;
  rating: number;
  productType: string;
  description: string;
  minOrderQuantity: number;
  leadTime: string;
  sustainable: boolean;
}

interface ProductFavoriteContextType {
  favorites: Product[];
  toggleFavorite: (product: Product) => void;
  clearFavorites: () => void;
  isFavorite: (id: number) => boolean;
}

const ProductFavoriteContext = createContext<ProductFavoriteContextType | undefined>(undefined);

export function ProductFavoriteProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Product[]>(() => {
    const saved = localStorage.getItem("favoriteProducts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoriteProducts", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product: Product) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === product.id);
      if (exists) {
        toast.success(`${product.name} removed from favorites`);
        return prev.filter(f => f.id !== product.id);
      } else {
        toast.success(`${product.name} added to favorites`);
        return [...prev, product];
      }
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.success("All product favorites cleared");
  };

  const isFavorite = (id: number) => favorites.some(f => f.id === id);

  return (
    <ProductFavoriteContext.Provider value={{ favorites, toggleFavorite, clearFavorites, isFavorite }}>
      {children}
    </ProductFavoriteContext.Provider>
  );
}

export function useProductFavorites() {
  const context = useContext(ProductFavoriteContext);
  if (context === undefined) {
    throw new Error("useProductFavorites must be used within a ProductFavoriteProvider");
  }
  return context;
} 