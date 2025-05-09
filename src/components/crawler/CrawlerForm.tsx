import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Link, Link2, Binary, Layers, Clock, Sparkles, FileUp, X, Plus, List, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { crawlerApi } from '@/lib/api';
import {
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from '@/components/ui/scroll-area';

// Define the form schema with Zod
const formSchema = z.object({
  urls: z.array(z.string().url({ message: 'Please enter a valid URL' })).min(1, { message: 'At least one URL is required' }),
  depth: z.number().min(1).max(5).default(1),
  maxPages: z.number().min(1).max(50).default(10),
  useCustomSelectors: z.boolean().default(false),
  autoSave: z.boolean().default(false),
  aiProvider: z.enum(['default', 'openai', 'gemini', 'claude']).default('default'),
  selectors: z.object({
    productContainer: z.string().optional(),
    name: z.string().optional(),
    price: z.string().optional(),
    description: z.string().optional(),
    image: z.string().optional(),
    ingredients: z.string().optional(),
    nutritionFacts: z.string().optional(),
    brand: z.string().optional(),
  }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

// Định nghĩa kiểu dữ liệu khi gửi đi (có url thay vì urls)
interface SubmitData {
  url: string;
  depth: number;
  maxPages: number;
  selectors?: {
    productContainer?: string;
    name?: string;
    price?: string;
    description?: string;
    image?: string;
    ingredients?: string;
    nutritionFacts?: string;
    brand?: string;
  };
  autoSave?: boolean;
  aiProvider?: 'default' | 'openai' | 'gemini' | 'claude';
}

interface CrawlerFormProps {
  onSubmit: (data: SubmitData) => Promise<void>;
}

const CrawlerForm: React.FC<CrawlerFormProps> = ({ onSubmit }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState<number>(0);
  const [urlInput, setUrlInput] = useState<string>('');
  const [showBulkUrlDialog, setShowBulkUrlDialog] = useState(false);
  const [bulkUrls, setBulkUrls] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urls: [],
      depth: 1,
      maxPages: 10,
      useCustomSelectors: false,
      autoSave: false,
      aiProvider: 'default',
      selectors: {
        productContainer: '',
        name: '',
        price: '',
        description: '',
        image: '',
        ingredients: '',
        nutritionFacts: '',
        brand: '',
      },
    },
  });

  const useCustomSelectors = form.watch('useCustomSelectors');
  const depth = form.watch('depth');
  const maxPages = form.watch('maxPages');
  const selectors = form.watch('selectors');
  const urls = form.watch('urls');

  // Calculate estimated time whenever relevant form values change
  useEffect(() => {
    // Base time per page in seconds
    const baseTimePerPage = 5;
    
    // Calculate estimated time
    let timePerUrl = baseTimePerPage * Math.min(maxPages || 1, 10); // Cap at 10 pages for estimation
    
    // Multiply by depth factor
    timePerUrl *= Math.sqrt(depth || 1); // Using square root to avoid linear growth
    
    // Add time for custom selectors if enabled
    if (useCustomSelectors && selectors) {
      const selectorCount = Object.values(selectors).filter(Boolean).length;
      timePerUrl += selectorCount * 2; // 2 seconds per selector
    }
    
    // Multiply by number of URLs
    const totalTime = timePerUrl * Math.max(urls.length, 1);
    
    // Set the estimated time
    setEstimatedTime(Math.round(totalTime));
  }, [depth, maxPages, useCustomSelectors, selectors, urls.length]);

  // Format time from seconds to readable format
  const formatEstimatedTime = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      
      if (remainingSeconds === 0) {
        return `${minutes}m`;
      } else {
        return `${minutes}m ${remainingSeconds}s`;
      }
    } else {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      
      if (minutes === 0) {
        return `${hours}h`;
      } else {
        return `${hours}h ${minutes}m`;
      }
    }
  };

  const handleAddUrl = () => {
    if (!urlInput) return;
    
    // Check if URL is valid
    try {
      new URL(urlInput);
      
      // Add URL to form state
      const currentUrls = form.getValues('urls');
      
      // Check if URL already exists
      if (!currentUrls.includes(urlInput)) {
        form.setValue('urls', [...currentUrls, urlInput]);
        setUrlInput('');
      } else {
        toast({
          title: 'URL already added',
          description: 'This URL is already in the list',
          variant: 'destructive',
        });
      }
    } catch (e) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid URL',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveUrl = (index: number) => {
    const currentUrls = form.getValues('urls');
    currentUrls.splice(index, 1);
    form.setValue('urls', [...currentUrls]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const fileUrls = content
          .split(/\r?\n/)
          .map(line => line.trim())
          .filter(line => line.length > 0);

        // Validate URLs and add unique ones
        const validUrls: string[] = [];
        const invalidUrls: string[] = [];
        const currentUrls = form.getValues('urls');

        fileUrls.forEach(url => {
          try {
            new URL(url);
            if (!currentUrls.includes(url) && !validUrls.includes(url)) {
              validUrls.push(url);
            }
          } catch {
            invalidUrls.push(url);
          }
        });

        if (validUrls.length > 0) {
          form.setValue('urls', [...currentUrls, ...validUrls]);
          toast({
            title: 'URLs imported',
            description: `Added ${validUrls.length} new URLs${invalidUrls.length > 0 ? `, skipped ${invalidUrls.length} invalid ones` : ''}`,
            variant: 'default',
          });
        } else if (invalidUrls.length > 0) {
          toast({
            title: 'Import failed',
            description: `Found ${invalidUrls.length} invalid URLs and no valid ones`,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'No new URLs',
            description: 'All URLs from the file are already in the list',
            variant: 'default',
          });
        }
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleBulkAdd = () => {
    if (!bulkUrls.trim()) {
      setShowBulkUrlDialog(false);
      return;
    }

    const urlsArray = bulkUrls
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line.length > 0);

    // Validate URLs and add unique ones
    const validUrls: string[] = [];
    const invalidUrls: string[] = [];
    const currentUrls = form.getValues('urls');

    urlsArray.forEach(url => {
      try {
        new URL(url);
        if (!currentUrls.includes(url) && !validUrls.includes(url)) {
          validUrls.push(url);
        }
      } catch {
        invalidUrls.push(url);
      }
    });

    if (validUrls.length > 0) {
      form.setValue('urls', [...currentUrls, ...validUrls]);
      toast({
        title: 'URLs added',
        description: `Added ${validUrls.length} new URLs${invalidUrls.length > 0 ? `, skipped ${invalidUrls.length} invalid ones` : ''}`,
        variant: 'default',
      });
    } else if (invalidUrls.length > 0) {
      toast({
        title: 'No URLs added',
        description: `Found ${invalidUrls.length} invalid URLs and no valid ones`,
        variant: 'destructive',
      });
    }

    setBulkUrls('');
    setShowBulkUrlDialog(false);
  };

  const handleSubmit = async (data: FormValues) => {
    if (data.urls.length === 0) {
      toast({
        title: 'No URLs specified',
        description: 'Please add at least one URL to crawl',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create a base form data object for all URLs
      const baseFormData: Omit<SubmitData, 'url'> = {
        depth: data.depth,
        maxPages: data.maxPages,
        selectors: data.useCustomSelectors ? data.selectors : undefined,
        autoSave: data.autoSave,
        aiProvider: data.aiProvider,
      };
      
      // Create a task for each URL
      const promises = data.urls.map(async (url) => {
        const submitData: SubmitData = {
          ...baseFormData,
          url: url,
        };
        return onSubmit(submitData);
      });
      
      // Wait for all tasks to be submitted
      await Promise.all(promises);
      
      toast({
        title: 'Crawl tasks created',
        description: `The crawler has started processing ${data.urls.length} URL${data.urls.length > 1 ? 's' : ''}`,
        variant: 'default',
      });
      
      // Reset the form
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create crawl tasks',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 24,
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  const iconVariants = {
    hover: { 
      rotate: 15,
      scale: 1.1,
      transition: { type: "spring", stiffness: 400, damping: 10 }
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="w-full max-w-full"
    >
      <Card className="w-full shadow-md border-border/60 bg-card">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-b">
          <div className="flex items-center gap-3">
            <motion.div whileHover="hover" variants={iconVariants}>
              <Link className="h-5 w-5 text-primary" />
            </motion.div>
            <div>
              <CardTitle className="text-xl font-semibold tracking-tight">Web Crawler</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Enter product URLs to extract information using AI
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                      <Link2 className="h-4 w-4 text-primary" />
                      Product URLs
                    </FormLabel>
                    <div className="flex gap-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              onClick={() => setShowBulkUrlDialog(true)}
                            >
                              <List className="h-4 w-4" />
                              <span className="ml-1">Bulk Add</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Add multiple URLs at once</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              className="h-8 px-2"
                              onClick={() => fileInputRef.current?.click()}
                            >
                              <FileUp className="h-4 w-4" />
                              <span className="ml-1">Import</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Import URLs from a text file (one URL per line)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept=".txt,.csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/product"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                      />
                      <Button 
                        type="button" 
                        onClick={handleAddUrl}
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="urls"
                      render={() => (
                        <FormItem>
                          <FormControl>
                            <div className="hidden">
                              {/* Hidden input for validation */}
                              <input type="text" {...form.register('urls')} />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {urls.length > 0 ? (
                      <ScrollArea className="max-h-[200px] rounded-md border">
                        <div className="p-4 space-y-2">
                          <AnimatePresence>
                            {urls.map((url, index) => (
                              <motion.div
                                key={`${url}-${index}`}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center justify-between gap-2 p-2 rounded-md border bg-card/50"
                              >
                                <div className="truncate text-sm text-muted-foreground">
                                  {url}
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleRemoveUrl(index)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </ScrollArea>
                    ) : (
                      <div className="flex items-center justify-center p-4 rounded-md border border-dashed">
                        <div className="flex flex-col items-center gap-1.5 text-muted-foreground">
                          <Link className="h-6 w-6 stroke-[1.25px] opacity-50" />
                          <p className="text-sm">No URLs added yet. Add URLs to crawl.</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Badge variant="outline" className="mr-2">
                        {urls.length} URL{urls.length !== 1 ? 's' : ''}
                      </Badge>
                      {urls.length > 10 && (
                        <span className="text-orange-500">
                          Large number of URLs may take significant time to process
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="depth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                        <Layers className="h-4 w-4 text-primary" />
                        Crawl Depth
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={5}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        How many links deep to crawl (1-5)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="maxPages"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                        <Binary className="h-4 w-4 text-primary" />
                        Max Pages
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={50}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                          className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Maximum pages to crawl (1-50)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <Separator className="my-6" />
              
              <motion.div variants={itemVariants} className="space-y-4">
                <div className="flex flex-col space-y-4">
                  <FormField
                    control={form.control}
                    name="autoSave"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Auto-Save to Catalog
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Automatically process with AI and save to product catalog
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="useCustomSelectors"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            Use Custom CSS Selectors
                          </FormLabel>
                          <FormDescription className="text-xs">
                            Specify custom CSS selectors to extract data from specific elements
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aiProvider"
                    render={({ field }) => (
                      <FormItem className="rounded-md border p-4 shadow-sm">
                        <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                          <Sparkles className="h-4 w-4 text-primary" />
                          AI Provider
                        </FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger className="transition-all focus:ring-primary/20 mt-1.5">
                              <SelectValue placeholder="Select AI Provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="default">Default (System Configuration)</SelectItem>
                              <SelectItem value="openai">OpenAI GPT-4o</SelectItem>
                              <SelectItem value="gemini">Google Gemini Pro</SelectItem>
                              <SelectItem value="claude">AWS Claude 3.7 Sonnet</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription className="text-xs mt-1.5">
                          Choose the AI model to process the crawled data
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
              
              {/* Custom CSS Selectors */}
              {useCustomSelectors && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4 border rounded-md p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium">Custom CSS Selectors</h3>
                    <Badge variant="outline" className="text-xs bg-primary/10">Optional</Badge>
                  </div>
                  <Separator />
                  
                  <Tabs defaultValue="basic" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-2">
                      <TabsTrigger 
                        value="basic" 
                        className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Basic Info
                      </TabsTrigger>
                      <TabsTrigger 
                        value="details" 
                        className="text-sm data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Product Details
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="basic" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="selectors.productContainer"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Product Container</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder=".product, #product" 
                                {...field} 
                                className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Product Name</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder=".product-name, h1" 
                                {...field} 
                                className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Price</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder=".price, .product-price" 
                                {...field} 
                                className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.image"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Product Image</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder=".product-image img, #main-image" 
                                {...field} 
                                className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="details" className="space-y-4 pt-4">
                      <FormField
                        control={form.control}
                        name="selectors.description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Description</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder=".description, #product-description" 
                                {...field} 
                                className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.ingredients"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Ingredients</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder=".ingredients, #ingredients-list" 
                                {...field} 
                                className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.nutritionFacts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Nutrition Facts</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder=".nutrition, .nutrition-facts" 
                                {...field} 
                                className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="selectors.brand"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm">Brand</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder=".brand, .manufacturer, #brand" 
                                {...field} 
                                className="transition-all focus-visible:ring-primary/20 focus-visible:ring-offset-0" 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}
              
              <CardFooter className="px-0 pb-0 pt-4">
                <div className="w-full space-y-4">
                  <div className="flex justify-between items-center">
                    <Badge 
                      variant="outline" 
                      className={`flex items-center gap-1.5 ${urls.length > 5 ? 'bg-warning/10 text-warning' : 'bg-muted/50'}`}
                    >
                      {urls.length > 0 ? (
                        <>
                          <List className="h-3 w-3" />
                          {urls.length} URL{urls.length !== 1 ? 's' : ''}
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-3 w-3 text-muted-foreground" />
                          No URLs added
                        </>
                      )}
                    </Badge>
                    
                    <Badge variant="outline" className="flex items-center gap-1.5 bg-muted/50">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      Estimated time: {formatEstimatedTime(estimatedTime)}
                    </Badge>
                  </div>
                  <motion.div 
                    className="w-full"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button 
                      type="submit" 
                      className="w-full bg-primary hover:bg-primary/90 transition-all text-primary-foreground font-medium"
                      disabled={isSubmitting || urls.length === 0}
                      size="lg"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : urls.length > 0 ? (
                        `Start Crawling (${urls.length} URL${urls.length !== 1 ? 's' : ''})`
                      ) : (
                        'Start Crawling'
                      )}
                    </Button>
                  </motion.div>
                </div>
              </CardFooter>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Bulk URL Dialog */}
      <Dialog open={showBulkUrlDialog} onOpenChange={setShowBulkUrlDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Multiple URLs</DialogTitle>
            <DialogDescription>
              Enter one URL per line to add multiple products at once.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-2">
            <Textarea
              placeholder="https://example.com/product1&#10;https://example.com/product2&#10;https://example.com/product3"
              rows={10}
              value={bulkUrls}
              onChange={(e) => setBulkUrls(e.target.value)}
              className="font-mono text-xs"
            />
            <p className="text-xs text-muted-foreground">
              {bulkUrls.split(/\r?\n/).filter(line => line.trim().length > 0).length} URLs entered
            </p>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setBulkUrls('');
                setShowBulkUrlDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleBulkAdd}
              disabled={!bulkUrls.trim()}
            >
              Add URLs
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CrawlerForm; 