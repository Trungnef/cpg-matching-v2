import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

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

interface ManufacturerFavoriteContextType {
  favorites: Manufacturer[];
  toggleFavorite: (manufacturer: Manufacturer) => void;
  clearFavorites: () => void;
  isFavorite: (id: number) => boolean;
}

const ManufacturerFavoriteContext = createContext<ManufacturerFavoriteContextType | undefined>(undefined);

export function ManufacturerFavoriteProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Manufacturer[]>(() => {
    const saved = localStorage.getItem("favoriteManufacturers");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favoriteManufacturers", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (manufacturer: Manufacturer) => {
    setFavorites(prev => {
      const exists = prev.some(f => f.id === manufacturer.id);
      if (exists) {
        toast.success(`${manufacturer.name} removed from favorites`);
        return prev.filter(f => f.id !== manufacturer.id);
      } else {
        toast.success(`${manufacturer.name} added to favorites`);
        return [...prev, manufacturer];
      }
    });
  };

  const clearFavorites = () => {
    setFavorites([]);
    toast.success("All favorites cleared");
  };

  const isFavorite = (id: number) => favorites.some(f => f.id === id);

  return (
    <ManufacturerFavoriteContext.Provider value={{ favorites, toggleFavorite, clearFavorites, isFavorite }}>
      {children}
    </ManufacturerFavoriteContext.Provider>
  );
}

export function useManufacturerFavorites() {
  const context = useContext(ManufacturerFavoriteContext);
  if (context === undefined) {
    throw new Error("useManufacturerFavorites must be used within a ManufacturerFavoriteProvider");
  }
  return context;
} 