import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@/contexts/UserContext";

import Navbar from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Upload, Package, ArrowLeft, Check, X, AlertTriangle, Loader2 } from "lucide-react";

// Product categories (can be expanded based on your business needs)
const productCategories = [
  "Food",
  "Beverage",
  "Cosmetics",
  "Personal Care",
  "Home Care",
  "Supplements",
  "Snacks",
  "Confectionery",
  "Baby Products",
  "Pet Products",
  "Other"
];

// Form validation schema
const formSchema = z.object({
  name: z.string().min(3, { message: "Product name must be at least 3 characters" }),
  brand: z.string().min(2, { message: "Brand name must be at least 2 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  price: z.coerce.number().positive({ message: "Price must be a positive number" }),
  countInStock: z.coerce.number().int().nonnegative({ message: "Stock count must be a non-negative integer" }),
  image: z.string().url({ message: "Please enter a valid image URL" }).or(z.string().length(0))
});

type FormValues = z.infer<typeof formSchema>;

const AddProduct = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useUser();
  const { createProduct, error } = useProducts();
  const [isNavigating, setIsNavigating] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [newProductId, setNewProductId] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication and role
    if (!user) {
      navigate("/auth?type=signin");
    } else if (user.role !== "manufacturer") {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // Set up form with validation
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      brand: user?.companyName || "",
      category: "",
      description: "",
      price: 0,
      countInStock: 0,
      image: "https://via.placeholder.com/300x300.png?text=Product+Image"
    }
  });

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to add products",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Create product using the hook
      const product = await createProduct({
        name: data.name,
        brand: data.brand,
        category: data.category,
        description: data.description,
        price: data.price,
        countInStock: data.countInStock,
        image: data.image || "https://via.placeholder.com/300x300.png?text=Product+Image"
      });
      
      if (product) {
        setNewProductId(product._id);
        setShowSuccessDialog(true);
      } else {
        throw new Error("Failed to create product");
      }
    } catch (err) {
      console.error("Error adding product:", err);
      toast({
        title: "Error Adding Product",
        description: error || "There was an error adding your product. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle navigation back to products
  const handleGoBack = async () => {
    try {
      setIsNavigating(true);
      await navigate("/manufacturer/products");
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "Unable to navigate back. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsNavigating(false);
    }
  };

  // Handle navigation after success
  const handleViewProduct = async () => {
    try {
      setIsNavigating(true);
      await navigate(`/manufacturer/products`);
    } catch (error) {
      console.error('Navigation error:', error);
      toast({
        title: "Navigation Error",
        description: "Unable to navigate to products page. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsNavigating(false);
    }
  };

  // Handle adding another product
  const handleAddAnother = () => {
    form.reset();
    setShowSuccessDialog(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 pt-20">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={handleGoBack}
              className="mr-2"
              disabled={isNavigating}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Add New Product</h1>
          </motion.div>
        </div>
        
        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Form Section */}
          <motion.div 
            className="col-span-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
                <CardDescription>
                  Enter the details of your new product
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Product Name */}
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Product Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter product name" {...field} />
                          </FormControl>
                          <FormDescription>
                            Choose a clear and descriptive name
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Brand */}
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter brand name" {...field} />
                          </FormControl>
                          <FormDescription>
                            The brand name of the product
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Category */}
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productCategories.map(category => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the most relevant category
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Description */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description *</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter detailed product description" 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Detailed description of the product including features and benefits
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Price and Stock Count (side by side on larger screens) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price (USD) *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="0.01" 
                                placeholder="0.00" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="countInStock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Count *</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                min="0" 
                                step="1" 
                                placeholder="0" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Image URL */}
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormDescription>
                            Enter a URL for the product image, or leave empty for a placeholder
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Submit Button */}
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        className="min-w-[120px]"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing
                          </>
                        ) : (
                          <>Add Product</>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
          
          {/* Information Panel */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Adding a New Product
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-muted p-4">
                  <h3 className="font-medium mb-2">Tips for Adding Products</h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start">
                      <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                      <span>Use clear, descriptive names that include key attributes</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                      <span>Write detailed descriptions to help buyers understand your product</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                      <span>Add high-quality images to showcase your product</span>
                    </li>
                    <li className="flex items-start">
                      <Check className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                      <span>Select the most appropriate category for better visibility</span>
                    </li>
                  </ul>
                </div>
                
                <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/30 p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-800 dark:text-yellow-300 mb-1">Important</h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        After adding a product, it will be reviewed for compliance with platform standards 
                        before becoming visible to potential buyers.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-lg border p-4">
                  <h3 className="font-medium mb-2">Need Help?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    For any questions about adding products, contact our support team.
                  </p>
                  <Button variant="outline" className="w-full">
                    Contact Support
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      
      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center text-green-600">
              <Check className="mr-2 h-5 w-5" />
              Product Added Successfully
            </AlertDialogTitle>
            <AlertDialogDescription>
              Your product has been added to the system and is pending review.
              What would you like to do next?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel onClick={handleAddAnother} disabled={isNavigating}>
              Add Another Product
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleViewProduct} disabled={isNavigating}>
              {isNavigating ? "Navigating..." : "View Products"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddProduct; 