import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter,
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Check, 
  AlertCircle, 
  ArrowLeft, 
  ExternalLink, 
  MessageSquare,
  Brain,
  Code,
  Image,
  List,
  Plus,
  FileText,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from '@/components/ui/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export interface ProductData {
  productName?: string;
  brand?: string;
  price?: number;
  description?: string;
  ingredients?: string[];
  nutritionFacts?: Record<string, string>;
  images?: string[];
  url?: string;
  metadata?: Record<string, any>;
}

export interface AIAnalysis {
  categories?: string[];
  keywords?: string[];
  sentiment?: number;
  confidenceScore?: number;
  summary?: string;
}

export interface CrawlResult {
  _id: string;
  taskId: string;
  status: string;
  rawHtml?: string;
  extractedContent?: string;
  processedData: ProductData;
  aiAnalysis?: AIAnalysis;
  createdAt: string;
}

interface CrawlerResultViewProps {
  result: CrawlResult;
  onBack: () => void;
  onProcess: (resultId: string) => Promise<void>;
  onIntegrate: (productData: ProductData) => Promise<void>;
}

const CrawlerResultView: React.FC<CrawlerResultViewProps> = ({ 
  result, 
  onBack, 
  onProcess,
  onIntegrate
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRawHtml, setShowRawHtml] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [isIntegrating, setIsIntegrating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { processedData, aiAnalysis } = result;
  
  // Format description to make it more readable
  const formatDescription = (description: string): React.ReactNode => {
    // Check if description contains bullet points in the form of "• Feature"
    if (description.includes("• ") || description.includes("- ") || description.includes("—")) {
      // Try to extract bullet points sections and format them nicely
      const bulletPointMatches = description.match(/((•|\-|—)\s+[^•\-—\n]+(\n|$))+/g);
      
      if (bulletPointMatches && bulletPointMatches.length > 0) {
        // Format description with proper bullet points
        const parts = description.split(bulletPointMatches[0]);
        
        return (
          <>
            {parts[0] && <p className="mb-4">{parts[0]}</p>}
            
            <ul className="list-disc pl-5 my-4 space-y-2">
              {bulletPointMatches[0].split(/\n/).map((line, idx) => {
                const cleanLine = line.replace(/^(•|\-|—)\s+/, '').trim();
                if (cleanLine.length > 0) {
                  return (
                    <li key={idx} className="text-sm mb-2">
                      {cleanLine}
                    </li>
                  );
                }
                return null;
              }).filter(Boolean)}
            </ul>
            
            {parts[1] && <p className="mt-4">{parts[1]}</p>}
          </>
        );
      }
    }
    
    // Check if it's too long (more than 800 chars), truncate and show toggle
    if (description.length > 800) {
      const [showFull, setShowFull] = useState(false);
      
      const shortDescription = description.substring(0, 800);
      
      return (
        <div>
          {showFull ? (
            // Full description with line breaks preserved
            description.split('\n').map((line, i) => (
              <React.Fragment key={i}>
                {line}
                {i < description.split('\n').length - 1 && <br />}
              </React.Fragment>
            ))
          ) : (
            // Shortened description
            <>
              {shortDescription.split('\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < shortDescription.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
              <span>...</span>
            </>
          )}
          <button 
            onClick={() => setShowFull(!showFull)}
            className="mt-3 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:hover:bg-primary/30 rounded-md focus:outline-none text-xs font-medium block"
          >
            {showFull ? "Show Less" : "Show More"}
          </button>
        </div>
      );
    }
    
    // Default formatting - preserve line breaks
    return description.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < description.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };
  
  const handleProcess = async () => {
    try {
      setIsProcessing(true);
      await onProcess(result._id);
    } catch (error) {
      console.error('Error processing result:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleIntegrate = async () => {
    try {
      setIsIntegrating(true);
      
      // Format and clean the product data
      const cleanProductData = {
        ...processedData,
        // Ensure numeric values are properly formatted
        price: processedData.price !== undefined ? Number(processedData.price) : undefined,
        // Remove empty arrays and objects
        ingredients: (processedData.ingredients || []).length > 0 ? processedData.ingredients : undefined,
        images: (processedData.images || []).length > 0 ? processedData.images : undefined,
        // Ensure metadata is properly formatted
        metadata: processedData.metadata || {}
      };
      
      console.log('Integrating product with data:', cleanProductData);
      await onIntegrate(cleanProductData);
      
      toast({
        title: "Product Added to Catalog",
        description: "The product has been successfully added to your catalog.",
        duration: 3000,
      });
      
      // Programmatically navigate to the product catalog page
      setTimeout(() => {
        window.location.href = '/admin/catalog/productcatalog';
      }, 1000);
      
    } catch (error) {
      console.error('Error integrating product:', error);
      
      toast({
        title: "Integration Failed",
        description: "There was an error adding the product to the catalog.",
        variant: "destructive",
      });
    } finally {
      setIsIntegrating(false);
    }
  };
  
  // Format price with currency
  const formatPrice = (price?: number) => {
    if (price === undefined) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };
  
  // Get sentiment label and color
  const getSentimentInfo = (sentiment?: number) => {
    if (sentiment === undefined) return { label: 'N/A', color: 'bg-muted text-muted-foreground' };
    
    if (sentiment >= 0.5) return { label: 'Very Positive', color: 'bg-green-500 dark:bg-green-800 text-white' };
    if (sentiment > 0) return { label: 'Positive', color: 'bg-green-300 dark:bg-green-700 text-green-900 dark:text-green-100' };
    if (sentiment === 0) return { label: 'Neutral', color: 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200' };
    if (sentiment > -0.5) return { label: 'Negative', color: 'bg-red-300 dark:bg-red-700 text-red-900 dark:text-red-100' };
    return { label: 'Very Negative', color: 'bg-red-500 dark:bg-red-800 text-white' };
  };
  
  // Get confidence label and color
  const getConfidenceInfo = (score?: number) => {
    if (score === undefined) return { label: 'N/A', color: 'bg-muted text-muted-foreground' };
    
    if (score >= 0.8) return { label: 'High', color: 'bg-green-500 dark:bg-green-800 text-white' };
    if (score >= 0.5) return { label: 'Medium', color: 'bg-yellow-300 dark:bg-yellow-700 text-yellow-900 dark:text-yellow-100' };
    return { label: 'Low', color: 'bg-red-300 dark:bg-red-700 text-red-900 dark:text-red-100' };
  };
  
  const sentimentInfo = getSentimentInfo(aiAnalysis?.sentiment);
  const confidenceInfo = getConfidenceInfo(aiAnalysis?.confidenceScore);

  const containerAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 20,
        staggerChildren: 0.1 
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  // Group metadata by categories for better display
  const organizeMetadata = (metadata: Record<string, any> | undefined): Record<string, Record<string, any>> => {
    if (!metadata) return {};
    
    const groups: Record<string, Record<string, any>> = {
      'Product Details': {},
      'Specifications': {},
      'Pricing': {},
      'Shipping & Availability': {},
      'Other': {}
    };
    
    // Sort keys alphabetically
    const sortedKeys = Object.keys(metadata).sort();

    // Form-related patterns to filter out
    const formPatterns = [
      /price.*availability/i, /website.*online/i, /url\s*\*/i, /shipping cost/i, 
      /date of.*price/i, /store name/i, /city\s*\*/i, /state\s*\*/i, /province/i, 
      /submit/i, /feedback/i, /mm\/dd\/yyyy/i, /\d{2}\s*\/\s*\d{2}\s*\/\s*\d{4}/i,
      /please select/i, /enter the/i, /where you found/i, /online/i, /offline/i
    ];
    
    for (const key of sortedKeys) {
      const value = metadata[key];
      
      // Skip empty values
      if (value === '' || value === null || value === undefined) continue;
      
      // Skip form-related keys
      if (formPatterns.some(pattern => pattern.test(key) || (typeof value === 'string' && pattern.test(value)))) {
        continue;
      }
      
      // Skip functions, long strings that look like code
      if (typeof value === 'string' && 
          (value.includes('function(') || 
           value.includes('var ') || 
           value.length > 500)) {
        continue;
      }
      
      // Categorize keys
      if (key.startsWith('spec_') || key.includes('specification')) {
        // Remove spec_ prefix for display
        const displayKey = key.replace('spec_', '');
        groups['Specifications'][displayKey] = value;
      }
      else if (key.includes('price') || key.includes('discount') || key.includes('sale') || key.includes('cost')) {
        groups['Pricing'][key] = value;
      }
      else if (key.includes('shipping') || key.includes('delivery') || key.includes('availability') || 
               key.includes('stock') || key.includes('inventory')) {
        groups['Shipping & Availability'][key] = value;
      }
      else if (key.includes('dimension') || key.includes('weight') || key.includes('size') || 
               key.includes('color') || key.includes('material') || key.includes('brand') ||
               key.includes('model') || key.includes('manufacturer') || key.includes('sku') ||
               key.includes('upc') || key.includes('ean') || key.includes('gtin') ||
               key.includes('mpn') || key.includes('isbn')) {
        groups['Product Details'][key] = value;
      }
      else {
        groups['Other'][key] = value;
      }
    }
    
    // Remove empty groups
    for (const groupKey of Object.keys(groups)) {
      if (Object.keys(groups[groupKey]).length === 0) {
        delete groups[groupKey];
      }
    }
    
    return groups;
  };
  
  // Format metadata value for display
  const formatMetadataValue = (value: any): string => {
    if (value === null || value === undefined) return 'N/A';
    
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value);
    }
    
    return String(value);
  };
  
  // Format keys to be more readable
  const formatKey = (key: string): string => {
    return key
      .replace(/_/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };
  
  // Organize metadata
  const organizedMetadata = organizeMetadata(processedData.metadata);

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerAnimation}
      className="min-h-screen w-full flex flex-col p-4 md:p-6 space-y-6 max-w-full"
    >
      <motion.div 
        className="flex items-center justify-between"
        variants={itemAnimation}
      >
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="hover:bg-primary hover:text-white dark:border-slate-700 dark:hover:border-primary transition-all group"
        >
          <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Tasks
        </Button>
        
        <div className="flex items-center space-x-2">
          {result.status === 'completed' && !aiAnalysis && (
            <motion.div whileTap={{ scale: 0.97 }}>
              <Button 
                onClick={handleProcess} 
                disabled={isProcessing}
                className="flex items-center shadow-md hover:shadow-lg"
              >
                <motion.span 
                  animate={isProcessing ? { rotate: 360 } : {}}
                  transition={{ repeat: isProcessing ? Infinity : 0, duration: 2, ease: "linear" }}
                  className="mr-2"
                >
                  <Brain className="h-4 w-4" />
                </motion.span>
                {isProcessing ? 'Processing...' : 'Process with AI'}
              </Button>
            </motion.div>
          )}
          
          {result.status === 'completed' && aiAnalysis && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Button 
                onClick={handleIntegrate}
                disabled={isIntegrating}
                className="flex items-center bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 dark:text-white transition-colors"
              >
                {isIntegrating ? 'Adding...' : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Add to Catalog
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>
      
      <motion.div variants={itemAnimation} className="flex-1 flex flex-col w-full">
        <Card className="shadow-lg flex-1 flex flex-col dark:border-slate-700 w-full">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent dark:from-primary/10 dark:to-transparent flex-shrink-0">
            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
              <div>
                <CardTitle className="text-2xl break-words">
                  {processedData.productName || 'Unknown Product'}
                </CardTitle>
                {processedData.brand && (
                  <CardDescription className="text-lg mt-1">
                    {processedData.brand}
                  </CardDescription>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  {processedData.metadata?.volume && (
                    <Badge variant="outline" className="bg-primary/10 dark:bg-primary/20">
                      Volume: {processedData.metadata.volume}
                    </Badge>
                  )}
                  {processedData.metadata?.weight && (
                    <Badge variant="outline" className="bg-primary/10 dark:bg-primary/20">
                      Weight: {processedData.metadata.weight}
                      {processedData.metadata?.weight_unit || 'g'}
                    </Badge>
                  )}
                  {processedData.metadata?.rating && (
                    <Badge variant="outline" className="bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-800">
                      Rating: {processedData.metadata.rating}/5
                    </Badge>
                  )}
                  {processedData.metadata?.availability && (
                    <Badge 
                      variant="outline" 
                      className={
                        processedData.metadata.availability.toLowerCase().includes('in stock') 
                          ? "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 border-green-300 dark:border-green-800" 
                          : "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800"
                      }
                    >
                      {processedData.metadata.availability}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="text-left sm:text-right">
                {processedData.price !== undefined && (
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {formatPrice(processedData.price)}
                  </div>
                )}
                {processedData.metadata?.price_min && processedData.metadata?.price_max && 
                 processedData.metadata.price_min !== processedData.metadata.price_max && (
                  <div className="text-sm text-muted-foreground">
                    Range: {formatPrice(Number(processedData.metadata.price_min))} - {formatPrice(Number(processedData.metadata.price_max))}
                  </div>
                )}
                {processedData.url && (
                  <a
                    href={processedData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground flex items-center sm:justify-end mt-1 hover:underline group"
                  >
                    Visit Website
                    <ExternalLink className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
              <TabsList className="grid grid-cols-2 sm:grid-cols-5">
                <TabsTrigger 
                  value="details" 
                  className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:text-white"
                >
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Details</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="ingredients" 
                  className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:text-white"
                >
                  <List className="h-4 w-4" />
                  <span className="hidden sm:inline">Ingredients</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="images" 
                  className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:text-white"
                >
                  <Image className="h-4 w-4" />
                  <span className="hidden sm:inline">Images</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="analysis" 
                  disabled={!aiAnalysis}
                  className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:text-white"
                >
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">AI Analysis</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="raw" 
                  onClick={() => setShowRawHtml(true)}
                  className="flex items-center gap-1 data-[state=active]:bg-primary data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:text-white"
                >
                  <Code className="h-4 w-4" />
                  <span className="hidden sm:inline">Raw Data</span>
                </TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="h-full"
                  >
                    <TabsContent value="details" className="space-y-6 pt-4 h-full overflow-auto">
                      <div className="space-y-4">
                        {/* Description Section */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            Description
                          </h3>
                          <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md max-h-[400px] overflow-auto">
                            {processedData.description 
                              ? formatDescription(processedData.description)
                              : (
                                <div className="flex flex-col items-center justify-center py-6 text-center">
                                  <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                                  <p className="text-sm text-muted-foreground">No description available</p>
                                </div>
                              )
                            }
                          </div>
                        </div>
                        
                        {/* Basic Information in Table format */}
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Product Information</h3>
                          <Table>
                            <TableBody className="dark:text-slate-300">
                              <TableRow>
                                <TableCell className="font-medium">Name</TableCell>
                                <TableCell>{processedData.productName || 'Unknown Product'}</TableCell>
                              </TableRow>
                              {processedData.brand && (
                                <TableRow>
                                  <TableCell className="font-medium">Brand</TableCell>
                                  <TableCell>{processedData.brand}</TableCell>
                                </TableRow>
                              )}
                              {processedData.price !== undefined && (
                                <TableRow>
                                  <TableCell className="font-medium">Price</TableCell>
                                  <TableCell>{formatPrice(processedData.price)}</TableCell>
                                </TableRow>
                              )}
                              {processedData.metadata?.sku && (
                                <TableRow>
                                  <TableCell className="font-medium">SKU</TableCell>
                                  <TableCell>{processedData.metadata.sku}</TableCell>
                                </TableRow>
                              )}
                              {processedData.metadata?.barcode && (
                                <TableRow>
                                  <TableCell className="font-medium">Barcode</TableCell>
                                  <TableCell>{processedData.metadata.barcode}</TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                        
                        {/* Nutrition Facts Table */}
                        {processedData.nutritionFacts && Object.keys(processedData.nutritionFacts).length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Nutrition Facts</h3>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="dark:text-slate-300">Nutrient</TableHead>
                                  <TableHead className="text-right dark:text-slate-300">Value</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {Object.entries(processedData.nutritionFacts).map(([key, value]) => (
                                  <TableRow key={key}>
                                    <TableCell className="font-medium capitalize dark:text-slate-300">{key}</TableCell>
                                    <TableCell className="text-right dark:text-slate-300">{value}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                        
                        {/* Metadata in Accordion Format */}
                        {Object.keys(organizedMetadata).length > 0 && (
                          <div className="space-y-2">
                            <h3 className="text-sm font-medium">Additional Information</h3>
                            <Accordion type="multiple" className="w-full">
                              {Object.entries(organizedMetadata).map(([groupName, groupData]) => (
                                <AccordionItem key={groupName} value={groupName} className="dark:border-slate-700">
                                  <AccordionTrigger className="text-sm font-medium">
                                    {groupName}
                                  </AccordionTrigger>
                                  <AccordionContent>
                                    <Table>
                                      <TableBody>
                                        {Object.entries(groupData).map(([key, value]) => (
                                          <TableRow key={key}>
                                            <TableCell className="font-medium dark:text-slate-300">
                                              {formatKey(key)}
                                            </TableCell>
                                            <TableCell className="dark:text-slate-300">
                                              {formatMetadataValue(value)}
                                            </TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="ingredients" className="pt-4 h-full overflow-auto">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Ingredients List</h3>
                        {processedData.ingredients && processedData.ingredients.length > 0 ? (
                          <div className="bg-muted p-4 rounded-md">
                            <ul className="list-disc pl-5 space-y-1">
                              {processedData.ingredients.map((ingredient, index) => (
                                <motion.li 
                                  key={index} 
                                  className="text-sm hover:bg-muted/80 dark:hover:bg-muted/50 p-1 rounded-sm"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.03 }}
                                >
                                  {ingredient}
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No ingredients information available</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Try processing with AI to extract ingredients
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="images" className="pt-4 h-full overflow-auto">
                      <div className="space-y-4">
                        <h3 className="text-sm font-medium">Product Images</h3>
                        {processedData.images && processedData.images.length > 0 ? (
                          <div>
                            {selectedImage ? (
                              <div className="mb-4 relative">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white"
                                  onClick={() => setSelectedImage(null)}
                                >
                                  Close
                                </Button>
                                <img
                                  src={selectedImage}
                                  alt="Product full view"
                                  className="w-full max-h-[500px] object-contain rounded-md border dark:border-slate-700"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).src = 'https://placehold.co/400x400?text=Image+Error';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {processedData.images.map((img, index) => (
                                  <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => setSelectedImage(img)}
                                    className="cursor-pointer overflow-hidden rounded-md border dark:border-slate-700"
                                  >
                                    <img
                                      src={img}
                                      alt={`${processedData.productName || 'Product'} ${index + 1}`}
                                      className="aspect-square w-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://placehold.co/200x200?text=Image+Error';
                                      }}
                                    />
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-6 text-center">
                            <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-muted-foreground">No images available</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="analysis" className="pt-4 h-full overflow-auto">
                      {aiAnalysis ? (
                        <div className="space-y-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2 p-3 rounded-md border hover:border-primary dark:hover:border-primary transition-colors">
                              <Label className="text-xs text-muted-foreground">Sentiment</Label>
                              <div className="flex items-center space-x-2">
                                <motion.div 
                                  className={`w-4 h-4 rounded-full ${sentimentInfo.color}`}
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, repeatDelay: 2, duration: 1 }}
                                ></motion.div>
                                <span>{sentimentInfo.label}</span>
                              </div>
                            </div>
                            
                            <div className="space-y-2 p-3 rounded-md border hover:border-primary dark:hover:border-primary transition-colors">
                              <Label className="text-xs text-muted-foreground">Confidence</Label>
                              <div className="flex items-center space-x-2">
                                <motion.div 
                                  className={`w-4 h-4 rounded-full ${confidenceInfo.color}`}
                                  animate={{ scale: [1, 1.2, 1] }}
                                  transition={{ repeat: Infinity, repeatDelay: 2, duration: 1, delay: 0.5 }}
                                ></motion.div>
                                <span>{confidenceInfo.label}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-xs text-muted-foreground flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              Summary
                            </Label>
                            <p className="text-sm border rounded-md p-3 bg-muted">
                              {aiAnalysis.summary || 'No summary available'}
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Categories</Label>
                              <div className="flex flex-wrap gap-1">
                                {aiAnalysis.categories && aiAnalysis.categories.length > 0 ? (
                                  aiAnalysis.categories.map((category, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: index * 0.05 }}
                                    >
                                      <Badge variant="outline" className="hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors">
                                        {category}
                                      </Badge>
                                    </motion.div>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">No categories</span>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label className="text-xs text-muted-foreground">Keywords</Label>
                              <div className="flex flex-wrap gap-1">
                                {aiAnalysis.keywords && aiAnalysis.keywords.length > 0 ? (
                                  aiAnalysis.keywords.map((keyword, index) => (
                                    <motion.div
                                      key={index}
                                      initial={{ opacity: 0, scale: 0.8 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      transition={{ delay: 0.2 + index * 0.05 }}
                                    >
                                      <Badge variant="secondary" className="hover:bg-secondary/80 dark:hover:bg-secondary/50 transition-colors">
                                        {keyword}
                                      </Badge>
                                    </motion.div>
                                  ))
                                ) : (
                                  <span className="text-sm text-muted-foreground">No keywords</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Alert className="dark:border-slate-700">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>AI Analysis Required</AlertTitle>
                          <AlertDescription>
                            This product data hasn't been processed with AI yet. Click the "Process with AI" button to analyze this product.
                          </AlertDescription>
                        </Alert>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="raw" className="pt-4 h-full overflow-auto">
                      <Tabs defaultValue="json">
                        <TabsList>
                          <TabsTrigger value="json" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:text-white">
                            <Code className="mr-2 h-4 w-4" />
                            JSON Data
                          </TabsTrigger>
                          {result.rawHtml && (
                            <TabsTrigger value="html" className="flex items-center data-[state=active]:bg-primary data-[state=active]:text-white dark:text-slate-300 dark:data-[state=active]:text-white">
                              <Code className="mr-2 h-4 w-4" />
                              HTML
                            </TabsTrigger>
                          )}
                        </TabsList>
                        
                        <TabsContent value="json" className="mt-4">
                          <Collapsible className="w-full space-y-2">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-semibold">Processed Data</h4>
                              <CollapsibleTrigger className="rounded-md border dark:border-slate-700 px-2 py-1 text-xs hover:bg-muted">
                                View
                              </CollapsibleTrigger>
                            </div>
                            <CollapsibleContent>
                              <ScrollArea className="h-[400px] md:h-[500px] rounded-md border dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900">
                                <pre className="text-xs dark:text-slate-300">{JSON.stringify(processedData, null, 2)}</pre>
                              </ScrollArea>
                            </CollapsibleContent>
                          </Collapsible>
                        </TabsContent>
                        
                        {result.rawHtml && (
                          <TabsContent value="html" className="mt-4">
                            <Dialog open={showRawHtml} onOpenChange={setShowRawHtml}>
                              <DialogContent className="max-w-5xl h-[90vh] dark:border-slate-700 dark:bg-slate-950">
                                <DialogHeader>
                                  <DialogTitle>Raw HTML</DialogTitle>
                                  <DialogDescription>
                                    The original HTML content from the crawled page
                                  </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="h-full mt-4">
                                  <pre className="text-xs whitespace-pre-wrap dark:text-slate-300">{result.rawHtml}</pre>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                            
                            <Button 
                              variant="outline" 
                              onClick={() => setShowRawHtml(true)}
                              className="hover:bg-primary hover:text-white dark:border-slate-700 dark:hover:border-primary transition-colors"
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Raw HTML
                            </Button>
                          </TabsContent>
                        )}
                      </Tabs>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 bg-gradient-to-r from-transparent to-primary/5 dark:to-primary/10 py-4">
            <div className="flex items-center gap-2">
              {aiAnalysis ? (
                <Badge variant="outline" className="flex items-center bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800">
                  <Check className="mr-1 h-3 w-3" />
                  AI Processed
                </Badge>
              ) : (
                <Badge variant="outline" className="flex items-center text-muted-foreground">
                  <AlertCircle className="mr-1 h-3 w-3" />
                  Not Processed
                </Badge>
              )}

              <Badge variant="outline" className="flex items-center">
                {result.status}
              </Badge>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleIntegrate}
                disabled={isIntegrating}
                className="group hover:bg-primary hover:text-white dark:border-slate-700 dark:hover:border-primary transition-colors"
              >
                <Plus className="mr-2 h-4 w-4 group-hover:rotate-90 transition-transform" />
                {isIntegrating ? 'Adding...' : 'Add to Catalog'}
              </Button>
            </motion.div>
          </CardFooter>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default CrawlerResultView; 