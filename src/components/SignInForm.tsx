import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import ForgotPasswordForm from "./ForgotPasswordForm";
import { useUser } from "@/contexts/UserContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Factory, ShoppingBag, Store } from "lucide-react";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  accountType: z.enum(["manufacturer", "brand", "retailer"]).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SignInForm = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { toast } = useToast();
  const { login } = useUser();
  const navigate = useNavigate();

  // Form schema
  const formSchema = z.object({
    email: z.string().email({ message: t('invalid-email', "Please enter a valid email address") }),
    password: z.string().min(8, { message: t('password-min-length', "Password must be at least 8 characters") }),
    accountType: z.enum(["manufacturer", "brand", "retailer"]),
  });

  // Define form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      accountType: "manufacturer",
    },
  });

  // Sign in form handler
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Use the login function from context with the selected role
      await login(data.email, data.password, data.accountType);
      
      toast({
        title: t('welcome-back', 'Welcome back'),
        description: t('sign-in-success', 'You\'ve successfully signed in.'),
      });
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Sign in error:", error);
      toast({
        title: t('auth-failed', 'Authentication failed'),
        description: t('incorrect-credentials', 'Incorrect email or password.'),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Social login handlers
  const handleGoogleSignIn = async () => {
    try {
      // Implement Google OAuth
      toast({
        title: "Google Sign In",
        description: "Google authentication will be implemented here.",
      });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Could not sign in with Google.",
        variant: "destructive",
      });
    }
  };

  const handleLineSignIn = async () => {
    try {
      // Implement Line OAuth
      toast({
        title: "Line Sign In",
        description: "Line authentication will be implemented here.",
      });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Could not sign in with Line.",
        variant: "destructive",
      });
    }
  };

  const handleOutlookSignIn = async () => {
    try {
      // Implement Outlook OAuth
      toast({
        title: "Outlook Sign In",
        description: "Outlook authentication will be implemented here.",
      });
    } catch (error) {
      toast({
        title: "Authentication failed",
        description: "Could not sign in with Outlook.",
        variant: "destructive",
      });
    }
  };

  if (showForgotPassword) {
    return <ForgotPasswordForm onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="bg-background/80 dark:bg-background/60 backdrop-blur-md shadow-lg dark:shadow-primary/5 border border-border/40 dark:border-border/20 p-8 rounded-xl w-full max-w-md relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 dark:bg-primary/20 rounded-full blur-3xl opacity-60"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 dark:bg-accent/20 rounded-full blur-3xl opacity-60"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Animated Title Section */}
      <motion.div 
        className="text-center mb-8 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div className="relative inline-block">
          <motion.h2 
            className="text-3xl font-bold"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.span
              className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]"
              animate={{
                backgroundPosition: ["0%", "100%"]
              }}
              transition={{ 
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                repeatType: "mirror"
              }}
            >
              {t('lovely-mate', 'Lovely Mate')}
            </motion.span>
          </motion.h2>
          <motion.div
            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-primary via-accent to-primary"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </motion.div>

        <motion.div
          className="relative h-1 w-32 mx-auto mt-4 overflow-hidden rounded-full bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20"
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary"
            initial={{ x: "-100%" }}
            animate={{ 
              x: "100%",
              transition: {
                repeat: Infinity,
                duration: 2,
                ease: "linear"
              }
            }}
          />
        </motion.div>

        {/* Animated Welcome Text */}
        <motion.p 
          className="text-muted-foreground mt-4 text-base relative"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {t('great-to-see-you', 'Great to see you')}
          </motion.span>
          {" "}
          <motion.span
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-medium"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {t('again', 'again')}
          </motion.span>
          {" "}
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {t('in-our-platform', 'in our platform')}
          </motion.span>
        </motion.p>
      </motion.div>

      {/* Social Login Options */}
      <motion.div 
        className="mb-6 space-y-3 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center h-11 transition-all group"
          onClick={handleGoogleSignIn}
        >
          <div className="w-8 flex justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </div>
          <span className="flex-1 text-center group-hover:translate-x-1 transition-transform">
            {t('continue-with-google', 'Continue with Google')}
          </span>
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center h-11 transition-all group dark:text-white bg-[#06c755] dark:bg-[#06c755] text-white hover:bg-[#06c755]/90 dark:hover:bg-[#06c755]/90 border-[#06c755] dark:border-[#06c755]"
          onClick={handleLineSignIn}
        >
          <div className="w-8 flex justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.11 17.205c-.372 0-.754-.019-1.108-.058l-1.594-.132-.434.999c-.312.715-1.459 2.992-1.459 2.992s-1.248-2.754-1.462-3.217a2.975 2.975 0 0 1-.064-.582V7.21c0-1.645 1.353-2.999 3.007-2.999 1.653 0 2.996 1.345 2.996 2.999v6.997c0 1.644-1.343 2.998-2.997 2.998zM8.15 22.007c-2.054 0-3.729-1.666-3.729-3.719V7.208c0-2.045 1.675-3.71 3.73-3.71 2.053 0 3.729 1.665 3.729 3.71v11.08c0 2.054-1.676 3.719-3.73 3.719z"/>
            </svg>
          </div>
          <span className="flex-1 text-center group-hover:translate-x-1 transition-transform">
            {t('continue-with-line', 'Continue with Line')}
          </span>
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center h-11 transition-all group dark:text-white bg-[#0078d4] dark:bg-[#0078d4] text-white hover:bg-[#0078d4]/90 dark:hover:bg-[#0078d4]/90 border-[#0078d4] dark:border-[#0078d4]"
          onClick={handleOutlookSignIn}
        >
          <div className="w-8 flex justify-center">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.17 3.25H13.21a1.2 1.2 0 0 0-1.2 1.2v2.44l9.35 2.82a.8.8 0 0 0 1.01-.75v-4.5a1.2 1.2 0 0 0-1.2-1.2z" />
              <path d="M13.21 8.45V20.3c0 .44.46.7.84.47l8.49-5.19a.59.59 0 0 0 .27-.49v-3.69l-9.6-2.95z" />
              <path d="M2.5 8.45L12 12.58l9.5-4.13v10.41c0 .82-.67 1.5-1.5 1.5h-16A1.5 1.5 0 0 1 2.5 18.86V8.45z" />
              <path d="M10.67 11.55l-8.33-4.4v11.71c0 .83.67 1.5 1.5 1.5h6.83V11.55z" />
            </svg>
          </div>
          <span className="flex-1 text-center group-hover:translate-x-1 transition-transform">
            {t('continue-with-outlook', 'Continue with Outlook')}
          </span>
        </Button>
      </motion.div>

      <div className="flex items-center gap-2 my-6 relative z-10">
        <Separator className="flex-1 bg-border/50 dark:bg-border/30" />
        <span className="text-xs text-muted-foreground px-2">{t('or-continue-with', 'or continue with')}</span>
        <Separator className="flex-1 bg-border/50 dark:bg-border/30" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 relative z-10">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">{t('email', 'Email')}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder={t('email-placeholder', 'your@email.com')} 
                    {...field}
                    className="bg-background/70 dark:bg-background/50 border-border/50 dark:border-border/30 focus:border-primary focus:ring-1 focus:ring-primary" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-foreground">{t('password', 'Password')}</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder={t('password-placeholder', '********')} 
                    {...field}
                    className="bg-background/70 dark:bg-background/50 border-border/50 dark:border-border/30 focus:border-primary focus:ring-1 focus:ring-primary" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Account Type Selection - Development Testing Only */}
          <div className="border border-dashed border-yellow-300 bg-yellow-50/30 dark:bg-yellow-900/10 p-3 rounded-md relative">
            <div className="text-sm font-medium text-yellow-700 dark:text-yellow-300 mb-2 flex items-center gap-2">
              <span>⚙️</span> Development Mode: Select Account Type
            </div>
            <FormField
              control={form.control}
              name="accountType"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="grid grid-cols-3 gap-2"
                    >
                      <div>
                        <RadioGroupItem
                          value="manufacturer"
                          id="manufacturer"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="manufacturer"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 dark:bg-background/50 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
                        >
                          <Factory className="mb-1 h-4 w-4" />
                          <span className="text-xs">Manufacturer</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="brand"
                          id="brand"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="brand"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 dark:bg-background/50 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
                        >
                          <ShoppingBag className="mb-1 h-4 w-4" />
                          <span className="text-xs">Brand</span>
                        </Label>
                      </div>
                      <div>
                        <RadioGroupItem
                          value="retailer"
                          id="retailer"
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor="retailer"
                          className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-background/80 dark:bg-background/50 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer text-center"
                        >
                          <Store className="mb-1 h-4 w-4" />
                          <span className="text-xs">Retailer</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="text-right">
            <Button 
              type="button" 
              variant="link" 
              className="p-0 h-auto text-xs text-primary hover:text-primary/80 dark:text-primary dark:hover:text-primary/80"
              onClick={() => setShowForgotPassword(true)}
            >
              {t('forgot-password-question', 'Forgot password?')}
            </Button>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? t('signing-in', 'Signing in...') : t('sign-in', 'Sign In')}
            </Button>
          </motion.div>
        </form>
      </Form>
    </div>
  );
};

export default SignInForm; 