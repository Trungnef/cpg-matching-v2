import React, { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { PageTitle } from '@/components/PageTitle';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Package,
  Tag,
  RefreshCw,
  Edit,
  Trash2,
  Plus,
  ChevronDown,
  ImageIcon,
  Loader2,
  Star,
  ExternalLink
} from 'lucide-react';
import { productApi } from '@/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

// Product interface
interface Product {
  _id: string;
  name: string;
  brand?: string;
  price?: number;
  pricePerUnit?: number;
  description?: string;
  ingredients?: string[];
  nutritionFacts?: Record<string, string>;
  images?: string[];
  primaryImage?: string;
  sourceUrl?: string;
  categories?: string[];
  keywords?: string[];
  sku?: string;
  barcode?: string;
  weight?: number;
  weightUnit?: string;
  
  // Catalog specific fields
  productCategoryId?: string;
  unitType?: string;
  currentAvailableStock?: number;
  minimumOrderQuantity?: number;
  dailyCapacity?: number;
  productType?: string;
  leadTime?: string;
  leadTimeUnit?: string;
  isSustainableProduct?: boolean;
  
  stock?: number;
  isActive: boolean;
  metadata?: Record<string, any>;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Filter interface
interface FilterState {
  search: string;
  category: string;
  brand: string;
  priceRange: [number, number];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const ProductCatalog: React.FC = () => {
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [filters, setFilters] = useState<FilterState>(() => {
    const savedFilters = localStorage.getItem('catalog-filters');
    if (savedFilters) {
      try {
        const parsed = JSON.parse(savedFilters);
        return {
          ...parsed,
          priceRange: Array.isArray(parsed.priceRange) && parsed.priceRange.length === 2 
            ? parsed.priceRange as [number, number] 
            : [0, availableFilters.priceRange?.max || 1000] as [number, number],
          category: parsed.category === '' ? 'all' : parsed.category,
          brand: parsed.brand === '' ? 'all' : parsed.brand
        } as FilterState;
      } catch (e) {
        console.error('Error parsing saved filters', e);
      }
    }
    return {
      search: '',
      category: 'all',
      brand: 'all',
      priceRange: [0, availableFilters.priceRange?.max || 1000] as [number, number],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
  });
  const [availableFilters, setAvailableFilters] = useState({
    brands: [] as string[],
    categories: [] as string[],
    priceRange: { min: 0, max: 1000 }
  });
  const [showFilters, setShowFilters] = useState(() => window.innerWidth >= 768);
  const [isFiltersCollapsed, setIsFiltersCollapsed] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [isEditingProduct, setIsEditingProduct] = useState(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [productSource, setProductSource] = useState<'catalog' | 'standard'>('catalog');
  const [hoveredImageIndex, setHoveredImageIndex] = useState<{productId: string, index: number} | null>(null);
  
  // Memoize selected product to prevent unnecessary re-renders
  const memoizedSelectedProduct = useMemo(() => selectedProduct, [
    selectedProduct?._id,
    selectedProduct?.name,
    selectedProduct?.price,
    selectedProduct?.brand,
    selectedProduct?.description
  ]);
  
  const { toast } = useToast();
  
  // Fetch products on mount and when filters or pagination change
  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, [currentPage, filters.sortBy, filters.sortOrder, productSource]);
  
  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = {
        page: currentPage,
        limit: 12,
        search: filters.search || undefined,
        category: filters.category === 'all' ? undefined : filters.category || undefined,
        brand: filters.brand === 'all' ? undefined : filters.brand || undefined,
        minPrice: filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
        maxPrice: filters.priceRange[1] < 1000 ? filters.priceRange[1] : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };
      
      let response;
      if (productSource === 'catalog') {
        response = await productApi.getCatalogProducts(params);
      } else {
        response = await productApi.getProducts(params);
      }
      
      setProducts(response.data.products);
      setTotalPages(response.data.totalPages);
      setTotalProducts(response.data.totalProducts);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch products',
        variant: 'destructive',
      });
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch available filters
  const fetchFilters = async () => {
    try {
      let response;
      if (productSource === 'catalog') {
        response = await productApi.getCatalogFilters();
      } else {
        response = await productApi.getFilters();
      }
      
      setAvailableFilters({
        brands: response.data.brands,
        categories: response.data.categories,
        priceRange: response.data.priceRange
      });
      
      // Update price range if needed
      if (response.data.priceRange.max > 0) {
        setFilters(prev => ({
          ...prev,
          priceRange: [prev.priceRange[0], response.data.priceRange.max]
        }));
      }
    } catch (error) {
      console.error('Error fetching filters:', error);
    }
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    setCurrentPage(1);
    // Lưu filters vào localStorage
    localStorage.setItem('catalog-filters', JSON.stringify(filters));
    fetchProducts();
    if (window.innerWidth < 768) {
      setShowFilters(false);
    }
  };
  
  // Reset filters
  const handleResetFilters = () => {
    const resetFilters: FilterState = {
      search: '',
      category: 'all',
      brand: 'all',
      priceRange: [0, availableFilters.priceRange.max || 1000] as [number, number],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    setFilters(resetFilters);
    // Xóa filters khỏi localStorage
    localStorage.removeItem('catalog-filters');
    setCurrentPage(1);
    // Thêm một small delay để đảm bảo UI cập nhật trước khi fetch
    setTimeout(() => {
      fetchProducts();
    }, 10);
  };
  
  // Theo dõi sự thay đổi của filters để hiển thị UI cập nhật
  useEffect(() => {
    // Lưu filters vào localStorage khi có thay đổi
    localStorage.setItem('catalog-filters', JSON.stringify(filters));
  }, [filters]);
  
  // Theo dõi thay đổi cửa sổ để điều chỉnh hiển thị filter
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setShowFilters(true);
        setIsFiltersCollapsed(false);
      } else {
        setShowFilters(false);
        setIsFiltersCollapsed(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle search input change with debounce
  const handleSearchChange = (value: string) => {
    setFilters(prev => ({ ...prev, search: value }));
    // Thực hiện fetch sau 500ms kể từ lần nhập cuối cùng
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts();
    }, 500);
    
    return () => clearTimeout(timer);
  };
  
  // Delete product
  const handleDeleteProduct = async (productId: string) => {
    try {
      if (productSource === 'catalog') {
        await productApi.deleteCatalogProduct(productId);
      } else {
        await productApi.deleteProduct(productId);
      }
      
      toast({
        title: 'Product Deleted',
        description: 'The product has been removed from the catalog',
      });
      
      fetchProducts();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        variant: 'destructive',
      });
      console.error('Error deleting product:', error);
    }
  };
  
  // Save edited product
  const handleSaveProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      // Create a clean copy of the product data without any undefined or invalid values
      const productToUpdate = {
        ...selectedProduct,
        // Ensure numerical fields are properly formatted
        price: selectedProduct.price !== undefined && selectedProduct.price !== null ? Number(selectedProduct.price) : undefined,
        pricePerUnit: selectedProduct.pricePerUnit !== undefined && selectedProduct.pricePerUnit !== null ? Number(selectedProduct.pricePerUnit) : undefined,
        currentAvailableStock: selectedProduct.currentAvailableStock !== undefined && selectedProduct.currentAvailableStock !== null ? Number(selectedProduct.currentAvailableStock) : undefined,
        minimumOrderQuantity: selectedProduct.minimumOrderQuantity !== undefined && selectedProduct.minimumOrderQuantity !== null ? Number(selectedProduct.minimumOrderQuantity) : undefined,
        dailyCapacity: selectedProduct.dailyCapacity !== undefined && selectedProduct.dailyCapacity !== null ? Number(selectedProduct.dailyCapacity) : undefined,
        weight: selectedProduct.weight !== undefined && selectedProduct.weight !== null ? Number(selectedProduct.weight) : undefined,
        // Ensure arrays are properly initialized
        categories: selectedProduct.categories || [],
        keywords: selectedProduct.keywords || [],
        images: selectedProduct.images || [],
        ingredients: selectedProduct.ingredients || [],
      };
      
      // Ensure empty optional values don't get sent as empty strings but as undefined/null
      Object.keys(productToUpdate).forEach(key => {
        if (productToUpdate[key] === '' || productToUpdate[key] === null) {
          productToUpdate[key] = undefined;
        }
      });
      
      console.log('Updating product with data:', productToUpdate);
      
      if (productSource === 'catalog') {
        await productApi.updateCatalogProduct(selectedProduct._id, productToUpdate);
      } else {
        await productApi.updateProduct(selectedProduct._id, productToUpdate);
      }
      
      toast({
        title: 'Product Updated',
        description: 'The product has been successfully updated',
      });
      
      setIsEditingProduct(false);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: 'Error',
        description: 'Failed to update product. Please check your input values.',
        variant: 'destructive',
      });
    }
  };
  
  // Format price
  const formatPrice = (price?: number) => {
    if (price === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };
  
  // Custom CSS for hiding scrollbars
  const hideScrollbarStyle = {
    scrollbarWidth: 'none' as 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none'
    }
  };
  
  return (
    <div className="w-full py-6 space-y-8 px-4 md:px-6">
      <div className="flex justify-between items-center">
        <PageTitle title="Product Catalog" description="Manage your product inventory" />
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            className="ml-auto flex items-center gap-1" 
            onClick={() => setIsAddProductModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </motion.div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 w-full">
        {/* Filter toggle for mobile */}
        <div className="md:hidden w-full">
          <Button 
            variant="outline" 
            className="w-full flex justify-between items-center" 
            onClick={() => setShowFilters(!showFilters)}
          >
            <span className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* Filters Section */}
        <AnimatePresence>
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className={`bg-white dark:bg-gray-950 rounded-lg border shadow-sm border-gray-200 dark:border-gray-800 md:sticky md:self-start md:top-4 ${
                isFiltersCollapsed ? 'w-auto' : 'md:w-80 lg:w-96 w-full'
              }`}
            >
              <div className={`${isFiltersCollapsed ? 'p-2' : 'p-4'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    {!isFiltersCollapsed && <h3 className="font-medium text-lg">Filters</h3>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-accent"
                      onClick={() => setIsFiltersCollapsed(!isFiltersCollapsed)}
                    >
                      <ChevronLeft className={`h-4 w-4 transition-transform duration-200 ${isFiltersCollapsed ? 'rotate-180' : ''}`} />
                    </Button>
                    {!isFiltersCollapsed && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 md:hidden hover:bg-accent"
                        onClick={() => setShowFilters(false)}
                      >
                        <ChevronDown className="h-4 w-4 rotate-180" />
                      </Button>
                    )}
                  </div>
                </div>

                <AnimatePresence>
                  {!isFiltersCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-4"
                    >
                      {/* Product Source Selection */}
                      <div className="space-y-2">
                        <Label htmlFor="product-source">Product Source</Label>
                        <Select 
                          value={productSource} 
                          onValueChange={(value) => setProductSource(value as 'catalog' | 'standard')}
                        >
                          <SelectTrigger id="product-source">
                            <SelectValue placeholder="Select product source" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="catalog">Crawled Catalog Products</SelectItem>
                            <SelectItem value="standard">Standard Products</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    
                      <div className="space-y-2">
                        <Label htmlFor="search">Search</Label>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="search"
                            placeholder="Search products..."
                            className="pl-8"
                            value={filters.search}
                            onChange={(e) => handleSearchChange(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select 
                          value={filters.category} 
                          onValueChange={(value) => setFilters({ ...filters, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {availableFilters.categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="brand">Brand</Label>
                        <Select 
                          value={filters.brand} 
                          onValueChange={(value) => setFilters({ ...filters, brand: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="All Brands" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Brands</SelectItem>
                            {availableFilters.brands.map(brand => (
                              <SelectItem key={brand} value={brand}>
                                {brand}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Label htmlFor="price-range">Price Range</Label>
                          <span className="text-sm text-muted-foreground">
                            {formatPrice(filters.priceRange[0])} - {formatPrice(filters.priceRange[1])}
                          </span>
                        </div>
                        <Slider
                          id="price-range"
                          min={0}
                          max={availableFilters.priceRange.max || 1000}
                          step={1}
                          value={filters.priceRange}
                          onValueChange={(value) => setFilters({ ...filters, priceRange: value as [number, number] })}
                          className="py-4"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sort">Sort By</Label>
                        <div className="flex gap-2">
                          <Select 
                            value={filters.sortBy} 
                            onValueChange={(value) => setFilters({ ...filters, sortBy: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="createdAt">Date Added</SelectItem>
                              <SelectItem value="name">Name</SelectItem>
                              <SelectItem value="price">Price</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Select 
                            value={filters.sortOrder} 
                            onValueChange={(value) => setFilters({ ...filters, sortOrder: value as 'asc' | 'desc' })}
                          >
                            <SelectTrigger className="w-auto">
                              <SelectValue placeholder="Order" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="asc">Ascending</SelectItem>
                              <SelectItem value="desc">Descending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="mt-8 space-x-2 flex">
                        <motion.div className="w-1/2" whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="default"
                            onClick={handleApplyFilters}
                            className="w-full"
                          >
                            Apply Filters
                          </Button>
                        </motion.div>
                        <motion.div className="w-1/2" whileTap={{ scale: 0.95 }}>
                          <Button
                            variant="outline"
                            onClick={handleResetFilters}
                            className="w-full flex items-center justify-center gap-2"
                          >
                            <RefreshCw className="h-3 w-3" />
                            Reset
                          </Button>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Products Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold">
                {totalProducts} {totalProducts === 1 ? 'Product' : 'Products'} Found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Page {currentPage} of {totalPages}
              </p>
            </div>
            <div className="flex items-center mt-2 sm:mt-0 gap-2">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  className="pl-9 h-9 w-full sm:w-[250px] rounded-lg"
                  placeholder="Search products..."
                  value={filters.search}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
              <Select
                value={`${filters.sortBy}:${filters.sortOrder}`}
                onValueChange={(value) => {
                  const [sortBy, sortOrder] = value.split(':');
                  setFilters((prev) => ({
                    ...prev,
                    sortBy,
                    sortOrder: sortOrder as 'asc' | 'desc',
                  }));
                  setCurrentPage(1);
                  setTimeout(fetchProducts, 10);
                }}
              >
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt:desc">Newest First</SelectItem>
                  <SelectItem value="createdAt:asc">Oldest First</SelectItem>
                  <SelectItem value="price:asc">Price: Low-High</SelectItem>
                  <SelectItem value="price:desc">Price: High-Low</SelectItem>
                  <SelectItem value="name:asc">Name: A-Z</SelectItem>
                  <SelectItem value="name:desc">Name: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 8 }).map((_, index) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  key={`skeleton-${index}`}
                  className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 h-[360px] animate-pulse"
                >
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-800 rounded-md mb-4"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-1/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-full mt-4"></div>
                </motion.div>
              ))
            ) : products.length > 0 ? (
              <AnimatePresence>
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ 
                      y: -5, 
                      transition: { duration: 0.2 },
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
                    }}
                    className="bg-white dark:bg-gray-950 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden relative group"
                  >
                    <div 
                      className="relative w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-900 cursor-pointer"
                      onClick={() => {
                        setSelectedProduct(product);
                        setShowProductDetails(true);
                      }}
                      onMouseEnter={() => {
                        if (product.images && product.images.length > 1) {
                          setHoveredImageIndex({ productId: product._id, index: 0 });
                        }
                      }}
                      onMouseLeave={() => setHoveredImageIndex(null)}
                    >
                      {/* Product Image */}
                      <AnimatePresence mode="wait">
                        {hoveredImageIndex && hoveredImageIndex.productId === product._id && product.images && product.images.length > 1 ? (
                          <motion.img
                            key={`${product._id}-${hoveredImageIndex.index}`}
                            src={product.images[hoveredImageIndex.index]}
                            alt={product.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full object-contain"
                            onLoad={(e) => {
                              // Check if the image has loaded correctly
                              const img = e.target as HTMLImageElement;
                              if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                                img.src = "https://placehold.co/400x400/F5F5F5/CCCCCC?text=No+Image";
                              }
                            }}
                            onError={(e) => {
                              // Fallback for broken images
                              const img = e.target as HTMLImageElement;
                              img.src = "https://placehold.co/400x400/F5F5F5/CCCCCC?text=No+Image";
                            }}
                          />
                        ) : (
                          <motion.img
                            key={`${product._id}-main`}
                            src={product.primaryImage || product.images?.[0] || "https://placehold.co/400x400/F5F5F5/CCCCCC?text=No+Image"}
                            alt={product.name}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full object-contain"
                            onLoad={(e) => {
                              // Check if the image has loaded correctly
                              const img = e.target as HTMLImageElement;
                              if (img.naturalWidth === 0 || img.naturalHeight === 0) {
                                img.src = "https://placehold.co/400x400/F5F5F5/CCCCCC?text=No+Image";
                              }
                            }}
                            onError={(e) => {
                              // Fallback for broken images
                              const img = e.target as HTMLImageElement;
                              img.src = "https://placehold.co/400x400/F5F5F5/CCCCCC?text=No+Image";
                            }}
                          />
                        )}
                      </AnimatePresence>
                        
                      {/* Image Carousel Dots */}
                      {product.images && product.images.length > 1 && hoveredImageIndex && hoveredImageIndex.productId === product._id && (
                        <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                          {product.images.map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setHoveredImageIndex({ productId: product._id, index: i });
                              }}
                              className={`w-2 h-2 rounded-full ${
                                hoveredImageIndex.index === i 
                                  ? 'bg-primary' 
                                  : 'bg-gray-300 dark:bg-gray-600'
                              }`}
                              aria-label={`View image ${i + 1}`}
                            />
                          ))}
                        </div>
                      )}
                        
                      {/* Status Badge */}
                      <div className="absolute top-2 right-2">
                        <Badge
                          className={`${
                            product.isActive
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
                              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                      
                    <div className="p-4">
                      <div className="mb-2 flex items-start justify-between gap-1">
                        <h3 
                          className="font-medium line-clamp-2 text-sm sm:text-base hover:text-primary cursor-pointer"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowProductDetails(true);
                          }}
                        >
                          {product.name}
                        </h3>
                      </div>
                        
                      {product.brand && (
                        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
                          <Tag className="h-3 w-3 mr-1" />
                          {product.brand}
                        </div>
                      )}
                        
                      {product.price !== undefined && (
                        <div className="font-semibold mt-1">{formatPrice(product.price)}</div>
                      )}
                        
                      {/* Categories */}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.categories?.slice(0, 2).map((category, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors"
                          >
                            {category}
                          </Badge>
                        ))}
                        {(product.categories?.length || 0) > 2 && (
                          <Badge
                            variant="outline"
                            className="bg-gray-100 dark:bg-gray-800 text-xs"
                          >
                            +{(product.categories?.length || 0) - 2} more
                          </Badge>
                        )}
                      </div>
                        
                      {/* Action Buttons - only show on hover */}
                      <div className="mt-3 flex justify-between">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 mr-2"
                          onClick={() => {
                            setSelectedProduct(product);
                            setShowProductDetails(true);
                          }}
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsEditingProduct(true);
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
                <Package className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium mb-1">No products found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <Button onClick={handleResetFilters} variant="outline" className="gap-2">
                  <RefreshCw className="h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            )}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-8 gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setCurrentPage((prev) => Math.max(prev - 1, 1));
                }}
                disabled={currentPage === 1 || loading}
                className="transition-all duration-200 hover:bg-primary/10"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page Numbers */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`page-${currentPage}`}
                  className="flex gap-2"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.15 }}
                >
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    let pageNumber;
                    
                    // Logic to show 5 pages with current page in the middle where possible
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = currentPage - 2 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNumber}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="icon"
                        onClick={() => {
                          setCurrentPage(pageNumber);
                        }}
                        disabled={loading}
                        className={`transition-all duration-200 ${
                          currentPage === pageNumber 
                            ? "font-semibold" 
                            : "hover:bg-primary/10"
                        }`}
                      >
                        {pageNumber}
                      </Button>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                }}
                disabled={currentPage === totalPages || loading}
                className="transition-all duration-200 hover:bg-primary/10"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
      
      {/* Product Details Dialog */}
      {memoizedSelectedProduct && (
        <Dialog open={showProductDetails} onOpenChange={setShowProductDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="pb-2 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-xl font-semibold">{memoizedSelectedProduct.name}</DialogTitle>
                  {memoizedSelectedProduct.brand && (
                    <DialogDescription className="text-sm mt-1">
                      <span className="font-medium">Brand:</span> {memoizedSelectedProduct.brand}
                    </DialogDescription>
                  )}
                </div>
                <Badge 
                  variant={memoizedSelectedProduct.isActive ? "default" : "secondary"}
                  className={memoizedSelectedProduct.isActive 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                    : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"}
                >
                  {memoizedSelectedProduct.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full" type="always" scrollHideDelay={0} style={{
                '--scrollbar-size': '0px'
              } as React.CSSProperties}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 py-4 px-4">
                  {/* Product Images */}
                  <div className="md:col-span-2">
                    {/* Main Image Display */}
                    <div className="bg-muted dark:bg-muted/20 rounded-lg overflow-hidden border">
                      {memoizedSelectedProduct.primaryImage ? (
                        <img 
                          id="main-product-image"
                          src={memoizedSelectedProduct.primaryImage} 
                          alt={memoizedSelectedProduct.name} 
                          className="w-full aspect-square object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                          }}
                        />
                      ) : memoizedSelectedProduct.images && memoizedSelectedProduct.images.length > 0 ? (
                        <img 
                          id="main-product-image"
                          src={memoizedSelectedProduct.images[0]} 
                          alt={memoizedSelectedProduct.name} 
                          className="w-full aspect-square object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x400?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full aspect-square">
                          <ImageIcon className="h-24 w-24 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    
                    {/* Product Gallery */}
                    {memoizedSelectedProduct.images && memoizedSelectedProduct.images.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium mb-2">Product Gallery</h4>
                        <div className="grid grid-cols-5 gap-2">
                          {memoizedSelectedProduct.images.slice(0, 10).map((image, idx) => (
                            <img 
                              key={idx}
                              src={image} 
                              alt={`${memoizedSelectedProduct.name} ${idx + 1}`}
                              className="rounded-md border object-cover aspect-square hover:opacity-80 hover:border-primary transition-all cursor-pointer"
                              onClick={(e) => {
                                const mainImage = document.getElementById('main-product-image') as HTMLImageElement;
                                if (mainImage) {
                                  mainImage.src = image;
                                }
                              }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x100?text=Error';
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="md:col-span-3 space-y-6">
                    {/* Basic Product Details */}
                    <div className="space-y-4">
                      <div className="flex items-baseline justify-between">
                        <div>
                          {memoizedSelectedProduct.price !== undefined && (
                            <div className="flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-primary">
                                {formatPrice(memoizedSelectedProduct.price)}
                              </span>
                              {memoizedSelectedProduct.pricePerUnit !== undefined && memoizedSelectedProduct.unitType && (
                                <span className="text-sm text-muted-foreground">
                                  ({formatPrice(memoizedSelectedProduct.pricePerUnit)}/{memoizedSelectedProduct.unitType})
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          {memoizedSelectedProduct.metadata?.availability && (
                            <Badge 
                              variant="secondary" 
                              className={
                                String(memoizedSelectedProduct.metadata.availability).toLowerCase().includes('in stock') 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }
                            >
                              {memoizedSelectedProduct.metadata.availability}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Rating moved here for better logical positioning */}
                      {memoizedSelectedProduct.metadata?.rating && (
                        <div className="flex items-center">
                          <h4 className="text-sm font-medium mr-2">Rating:</h4>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`h-4 w-4 ${
                                  parseFloat(memoizedSelectedProduct.metadata?.rating) >= star 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                            <span className="ml-2 text-sm font-medium">
                              {memoizedSelectedProduct.metadata.rating}/5
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {memoizedSelectedProduct.description && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Description</h4>
                          <div className="relative max-h-[200px] overflow-y-auto mb-4 border rounded-md p-3 bg-muted/10">
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {memoizedSelectedProduct.description}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {memoizedSelectedProduct.sku && (
                          <div>
                            <span className="text-muted-foreground block">SKU:</span>
                            <span className="font-medium">{memoizedSelectedProduct.sku}</span>
                          </div>
                        )}
                        
                        {memoizedSelectedProduct.currentAvailableStock !== undefined && (
                          <div>
                            <span className="text-muted-foreground block">Stock:</span>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{memoizedSelectedProduct.currentAvailableStock} {memoizedSelectedProduct.unitType || 'units'}</span>
                              <Badge 
                                variant="outline" 
                                className={memoizedSelectedProduct.currentAvailableStock > 0 
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-800 px-1.5 py-0 text-[10px]" 
                                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-800 px-1.5 py-0 text-[10px]"}
                              >
                                {memoizedSelectedProduct.currentAvailableStock > 0 ? 'In Stock' : 'Out of Stock'}
                              </Badge>
                            </div>
                          </div>
                        )}
                        
                        {memoizedSelectedProduct.minimumOrderQuantity && (
                          <div>
                            <span className="text-muted-foreground block">Minimum Order:</span>
                            <span className="font-medium">{memoizedSelectedProduct.minimumOrderQuantity} {memoizedSelectedProduct.unitType || 'units'}</span>
                          </div>
                        )}
                        
                        {memoizedSelectedProduct.dailyCapacity && (
                          <div>
                            <span className="text-muted-foreground block">Daily Capacity:</span>
                            <span className="font-medium">{memoizedSelectedProduct.dailyCapacity} {memoizedSelectedProduct.unitType || 'units'}</span>
                          </div>
                        )}
                        
                        {memoizedSelectedProduct.leadTime && (
                          <div>
                            <span className="text-muted-foreground block">Lead Time:</span>
                            <span className="font-medium">{memoizedSelectedProduct.leadTime} {memoizedSelectedProduct.leadTimeUnit || 'days'}</span>
                          </div>
                        )}
                      </div>
                      
                      {memoizedSelectedProduct.categories && memoizedSelectedProduct.categories.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-1">Categories</h4>
                          <div className="flex flex-wrap gap-1">
                            {memoizedSelectedProduct.categories.map((category, idx) => (
                              <Badge key={idx} variant="secondary">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Detailed Specs */}
                    <Tabs defaultValue="general" className="mt-6">
                      <TabsList className="grid grid-cols-4 w-full">
                        <TabsTrigger value="general">General</TabsTrigger>
                        <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
                        <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
                        <TabsTrigger value="specifications">Specifications</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="general" className="space-y-4 pt-4">
                        {memoizedSelectedProduct.keywords && memoizedSelectedProduct.keywords.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Keywords</h4>
                            <div className="flex flex-wrap gap-1">
                              {memoizedSelectedProduct.keywords.map((keyword, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {keyword}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {memoizedSelectedProduct.metadata?.dimensions && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Dimensions</h4>
                            <p className="text-sm">{memoizedSelectedProduct.metadata.dimensions}</p>
                          </div>
                        )}
                        
                        {memoizedSelectedProduct.weight && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Weight</h4>
                            <p className="text-sm">{memoizedSelectedProduct.weight} {memoizedSelectedProduct.weightUnit || 'g'}</p>
                          </div>
                        )}
                        
                        {memoizedSelectedProduct.sourceUrl && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Source URL</h4>
                            <a 
                              href={memoizedSelectedProduct.sourceUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-blue-500 dark:text-blue-400 hover:underline flex items-center gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Visit source
                            </a>
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="nutrition" className="pt-4">
                        {memoizedSelectedProduct.nutritionFacts && 
                         Object.keys(memoizedSelectedProduct.nutritionFacts).length > 0 ? (
                          <div className="border rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Nutrient</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground tracking-wider">Amount</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {Object.entries(memoizedSelectedProduct.nutritionFacts).map(([key, value], idx) => (
                                  <tr key={idx} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                                    <td className="px-4 py-2 text-sm capitalize">{key}</td>
                                    <td className="px-4 py-2 text-sm text-right">{value}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No nutrition information available
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="ingredients" className="pt-4">
                        {memoizedSelectedProduct.ingredients && memoizedSelectedProduct.ingredients.length > 0 ? (
                          <div className="border rounded-lg p-4">
                            <h4 className="text-sm font-medium mb-2">Ingredients List</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {memoizedSelectedProduct.ingredients.map((ingredient, idx) => (
                                <li key={idx} className="text-sm">{ingredient}</li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No ingredients information available
                          </div>
                        )}
                      </TabsContent>
                      
                      <TabsContent value="specifications" className="pt-4">
                        {memoizedSelectedProduct.metadata && Object.entries(memoizedSelectedProduct.metadata).filter(([key]) => key.startsWith('spec_')).length > 0 ? (
                          <div className="border rounded-md overflow-hidden">
                            <table className="min-w-full divide-y divide-border">
                              <thead className="bg-muted">
                                <tr>
                                  <th className="px-4 py-2 text-left text-xs font-medium text-muted-foreground tracking-wider">Specification</th>
                                  <th className="px-4 py-2 text-right text-xs font-medium text-muted-foreground tracking-wider">Value</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-border">
                                {Object.entries(memoizedSelectedProduct.metadata)
                                  .filter(([key]) => key.startsWith('spec_'))
                                  .map(([key, value], idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                                      <td className="px-4 py-2 text-sm capitalize">{key.replace('spec_', '').replace(/_/g, ' ')}</td>
                                      <td className="px-4 py-2 text-sm text-right">{String(value)}</td>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            No specification information available
                          </div>
                        )}
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </ScrollArea>
            </div>
            
            <DialogFooter className="border-t pt-4 mt-2">
              <Button variant="outline" onClick={() => setShowProductDetails(false)}>
                Close
              </Button>
              <Button onClick={() => {
                setIsEditingProduct(true);
                setShowProductDetails(false);
              }}>
                Edit Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Product Edit Dialog */}
      {selectedProduct && (
        <Dialog open={isEditingProduct} onOpenChange={setIsEditingProduct}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="border-b pb-4">
              <DialogTitle className="text-xl font-semibold">{selectedProduct.name}</DialogTitle>
              <DialogDescription>
                Update the product information below
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="flex-1 pr-4 max-h-[60vh]">
              <div className="space-y-6 py-4">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name</Label>
                      <Input 
                        id="name" 
                        value={selectedProduct.name}
                        onChange={(e) => setSelectedProduct({
                          ...selectedProduct,
                          name: e.target.value
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="brand">Brand</Label>
                      <Input 
                        id="brand" 
                        value={selectedProduct.brand || ''}
                        onChange={(e) => setSelectedProduct({
                          ...selectedProduct,
                          brand: e.target.value
                        })}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input 
                        id="price" 
                        type="number"
                        min="0"
                        step="0.01"
                        value={selectedProduct.price === undefined || selectedProduct.price === null ? '' : selectedProduct.price}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          setSelectedProduct({
                            ...selectedProduct,
                            price: value
                          });
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pricePerUnit">Price Per Unit</Label>
                      <Input 
                        id="pricePerUnit" 
                        type="number"
                        min="0"
                        step="0.01"
                        value={selectedProduct.pricePerUnit === undefined || selectedProduct.pricePerUnit === null ? '' : selectedProduct.pricePerUnit}
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          setSelectedProduct({
                            ...selectedProduct,
                            pricePerUnit: value
                          });
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="unitType">Unit Type</Label>
                      <Select 
                        value={selectedProduct.unitType || 'units'}
                        onValueChange={(value) => setSelectedProduct({
                          ...selectedProduct,
                          unitType: value
                        })}
                      >
                        <SelectTrigger id="unitType">
                          <SelectValue placeholder="Select unit type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="units">Units</SelectItem>
                          <SelectItem value="kg">Kilograms</SelectItem>
                          <SelectItem value="g">Grams</SelectItem>
                          <SelectItem value="liter">Liters</SelectItem>
                          <SelectItem value="ml">Milliliters</SelectItem>
                          <SelectItem value="pcs">Pieces</SelectItem>
                          <SelectItem value="box">Boxes</SelectItem>
                          <SelectItem value="case">Cases</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sku">SKU</Label>
                      <Input 
                        id="sku" 
                        value={selectedProduct.sku || ''}
                        onChange={(e) => setSelectedProduct({
                          ...selectedProduct,
                          sku: e.target.value || undefined
                        })}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock</Label>
                      <Input 
                        id="stock" 
                        type="number"
                        min="0"
                        step="1"
                        value={
                          (selectedProduct.currentAvailableStock === undefined || selectedProduct.currentAvailableStock === null) 
                            ? (selectedProduct.stock === undefined || selectedProduct.stock === null ? '' : selectedProduct.stock)
                            : selectedProduct.currentAvailableStock
                        }
                        onChange={(e) => {
                          const value = e.target.value === '' ? undefined : Number(e.target.value);
                          setSelectedProduct({
                            ...selectedProduct,
                            currentAvailableStock: value,
                            stock: value
                          });
                        }}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="isActive">Status</Label>
                      <div className="flex items-center space-x-2 pt-2">
                        <Checkbox 
                          id="isActive" 
                          checked={selectedProduct.isActive}
                          onCheckedChange={(checked) => setSelectedProduct({
                            ...selectedProduct,
                            isActive: checked as boolean
                          })}
                        />
                        <label
                          htmlFor="isActive"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Active
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Catalog Specific Fields */}
                {productSource === 'catalog' && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-sm font-medium">Catalog Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="minOrder">Minimum Order Quantity</Label>
                        <Input 
                          id="minOrder" 
                          type="number"
                          min="0"
                          step="1"
                          value={selectedProduct.minimumOrderQuantity === undefined || selectedProduct.minimumOrderQuantity === null ? '' : selectedProduct.minimumOrderQuantity}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                            setSelectedProduct({
                              ...selectedProduct,
                              minimumOrderQuantity: value
                            });
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dailyCapacity">Daily Capacity</Label>
                        <Input 
                          id="dailyCapacity" 
                          type="number"
                          min="0"
                          step="1"
                          value={selectedProduct.dailyCapacity === undefined || selectedProduct.dailyCapacity === null ? '' : selectedProduct.dailyCapacity}
                          onChange={(e) => {
                            const value = e.target.value === '' ? undefined : Number(e.target.value);
                            setSelectedProduct({
                              ...selectedProduct,
                              dailyCapacity: value
                            });
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="productType">Product Type</Label>
                        <Select 
                          value={selectedProduct.productType || 'finishedGood'}
                          onValueChange={(value) => setSelectedProduct({
                            ...selectedProduct,
                            productType: value
                          })}
                        >
                          <SelectTrigger id="productType">
                            <SelectValue placeholder="Select product type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="finishedGood">Finished Good</SelectItem>
                            <SelectItem value="rawMaterial">Raw Material</SelectItem>
                            <SelectItem value="packaging">Packaging</SelectItem>
                            <SelectItem value="component">Component</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="leadTime">Lead Time</Label>
                        <Input 
                          id="leadTime" 
                          value={selectedProduct.leadTime || ''}
                          onChange={(e) => setSelectedProduct({
                            ...selectedProduct,
                            leadTime: e.target.value
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="leadTimeUnit">Lead Time Unit</Label>
                        <Select 
                          value={selectedProduct.leadTimeUnit || 'days'}
                          onValueChange={(value) => setSelectedProduct({
                            ...selectedProduct,
                            leadTimeUnit: value
                          })}
                        >
                          <SelectTrigger id="leadTimeUnit">
                            <SelectValue placeholder="Select unit" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                            <SelectItem value="months">Months</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sustainable">Sustainability</Label>
                        <div className="flex items-center space-x-2 pt-2">
                          <Checkbox 
                            id="sustainable" 
                            checked={selectedProduct.isSustainableProduct || false}
                            onCheckedChange={(checked) => setSelectedProduct({
                              ...selectedProduct,
                              isSustainableProduct: checked as boolean
                            })}
                          />
                          <label
                            htmlFor="sustainable"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Sustainable Product
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    className="flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedProduct.description || ''}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      description: e.target.value
                    })}
                  />
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter className="border-t pt-4">
              <Button variant="outline" onClick={() => setIsEditingProduct(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveProduct}>
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Add Product Modal */}
      <Dialog open={isAddProductModalOpen} onOpenChange={setIsAddProductModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new product to your catalog
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-name" className="text-right">
                Name
              </Label>
              <Input id="product-name" className="col-span-3" placeholder="Product name" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-description" className="text-right">
                Description
              </Label>
              <Input id="product-description" className="col-span-3" placeholder="Product description" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-price" className="text-right">
                Price
              </Label>
              <Input id="product-price" className="col-span-3" type="number" placeholder="0.00" />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-category" className="text-right">
                Category
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select a category</SelectItem>
                  {availableFilters.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="product-brand" className="text-right">
                Brand
              </Label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a brand" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Select a brand</SelectItem>
                  {availableFilters.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddProductModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Add Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductCatalog; 