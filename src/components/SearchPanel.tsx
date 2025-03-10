
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

interface SearchPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchPanel = ({ isOpen, onClose }: SearchPanelProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
    // Here you would implement the search functionality
    // For example: navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-16 px-4 sm:pt-24">
      <div 
        className="w-full max-w-3xl rounded-xl border border-border bg-card shadow-xl animate-in fade-in-0 zoom-in-95 duration-300"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        <div className="p-4 sm:p-6">
          <form onSubmit={handleSearchSubmit}>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Input 
                  placeholder="Search by keyword, category, or company name" 
                  className="w-full pr-10 h-11"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  autoFocus
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
              <Button type="submit" className="h-11">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </form>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <div className="text-sm font-medium text-muted-foreground">Popular:</div>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Organic Foods</Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Sustainable</Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-primary/10 transition-colors">Plant-Based</Badge>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="gap-1"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>

          {showAdvanced && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50 animate-in fade-in-0 slide-in-from-top-5 duration-200">
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="food">Food & Beverage</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                    <SelectItem value="household">Household Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="usa">United States</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                    <SelectItem value="europe">Europe</SelectItem>
                    <SelectItem value="asia">Asia</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Certifications</label>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Organic</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Non-GMO</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Fair Trade</Badge>
                  <Badge variant="outline" className="cursor-pointer hover:bg-secondary">Vegan</Badge>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Order Quantity</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Any quantity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Small (1-1,000 units)</SelectItem>
                    <SelectItem value="medium">Medium (1,001-5,000 units)</SelectItem>
                    <SelectItem value="large">Large (5,001-10,000 units)</SelectItem>
                    <SelectItem value="xlarge">Very Large (10,000+ units)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border flex justify-end">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          {showAdvanced && (
            <Button variant="default" className="ml-2">Apply Filters</Button>
          )}
        </div>
      </div>
      
      {/* Background overlay to close the panel */}
      <div 
        className="fixed inset-0 z-[-1]" 
        onClick={onClose}
        aria-hidden="true"
      />
    </div>
  );
};

export default SearchPanel;
