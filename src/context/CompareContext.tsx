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

interface CompareContextType {
  compareItems: Manufacturer[];
  toggleCompare: (manufacturer: Manufacturer) => void;
  clearCompare: () => void;
  isCompared: (id: number) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE_ITEMS = 3;

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareItems, setCompareItems] = useState<Manufacturer[]>(() => {
    const saved = localStorage.getItem("compareManufacturers");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("compareManufacturers", JSON.stringify(compareItems));
  }, [compareItems]);

  const toggleCompare = (manufacturer: Manufacturer) => {
    setCompareItems(prev => {
      const exists = prev.some(item => item.id === manufacturer.id);
      if (exists) {
        toast.success(`${manufacturer.name} removed from comparison`);
        return prev.filter(item => item.id !== manufacturer.id);
      } else {
        if (prev.length >= MAX_COMPARE_ITEMS) {
          toast.error(`You can only compare up to ${MAX_COMPARE_ITEMS} manufacturers`);
          return prev;
        }
        toast.success(`${manufacturer.name} added to comparison`);
        return [...prev, manufacturer];
      }
    });
  };

  const clearCompare = () => {
    setCompareItems([]);
    toast.success("Comparison list cleared");
  };

  const isCompared = (id: number) => compareItems.some(item => item.id === id);

  return (
    <CompareContext.Provider value={{ compareItems, toggleCompare, clearCompare, isCompared }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
} 