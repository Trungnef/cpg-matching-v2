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
import { useUser } from "@/contexts/UserContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Separator } from "@/components/ui/separator";

const RegisterForm = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { register } = useUser();
  const navigate = useNavigate();

  // Form schema
  const formSchema = z.object({
    name: z.string().min(2, { message: t('name-min-length', "Name must be at least 2 characters") }),
    email: z.string().email({ message: t('invalid-email', "Please enter a valid email address") }),
    password: z.string().min(8, { message: t('password-min-length', "Password must be at least 8 characters") }),
    confirmPassword: z.string().min(8, { message: t('password-min-length', "Password must be at least 8 characters") }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('passwords-do-not-match', "Passwords do not match"),
    path: ["confirmPassword"],
  });

  type FormValues = z.infer<typeof formSchema>;

  // Define form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    
    try {
      // Register user and send verification email
      await register({
        name: data.name,
        email: data.email,
        password: data.password,
        status: 'online',
        role: 'manufacturer',
        companyName: 'pending',
      });
      
      toast({
        title: t('verification-email-sent', 'Verification email sent'),
        description: t('verification-email-description', 'Please check your email to verify your account.'),
      });
      
      // Redirect to email verification page
      navigate("/verify-email?email=" + encodeURIComponent(data.email));
    } catch (error: unknown) {
      console.error("Registration error:", error);
      
      // Display detailed error message from API if available
      const errorObj = error as { response?: { data?: { message?: string } } };
      const errorMessage = errorObj.response?.data?.message || t('register-failed', 'Registration failed. Please try again later.');
      
      toast({
        title: t('registration-failed', 'Registration failed'),
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Social registration handlers
  const handleGoogleRegister = async () => {
    try {
      // Implement Google OAuth
      toast({
        title: "Google Registration",
        description: "Google authentication will be implemented here.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Could not register with Google.",
        variant: "destructive",
      });
    }
  };

  const handleLineRegister = async () => {
    try {
      // Implement Line OAuth
      toast({
        title: "Line Registration",
        description: "Line authentication will be implemented here.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Could not register with Line.",
        variant: "destructive",
      });
    }
  };

  const handleOutlookRegister = async () => {
    try {
      // Implement Outlook OAuth
      toast({
        title: "Outlook Registration",
        description: "Outlook authentication will be implemented here.",
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: "Could not register with Outlook.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="glass p-8 rounded-xl w-full max-w-md">
      {/* Animated Title Section */}
      <motion.div 
        className="text-center mb-8"
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
              className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient"
            >
              {t('create-account', 'Create Account')}
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
            {t('join-our', 'Join our')}
          </motion.span>
          {" "}
          <motion.span
            className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-medium"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {t('community', 'community')}
          </motion.span>
          {" "}
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {t('cpg-professionals', 'of CPG industry professionals')}
          </motion.span>
        </motion.p>

        {/* Decorative Dots */}
        <motion.div className="absolute top-0 right-0 -mr-6 -mt-6">
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary/50"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.4,
                delay: 1.2 + i * 0.1,
                ease: "easeOut"
              }}
              style={{
                top: i * 6,
                right: i * 6,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Animated User Avatar */}
      <motion.div
        className="relative w-20 h-20 mx-auto mt-6 mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
      >
        {/* Avatar Circle */}
        <motion.div
          className="absolute inset-0 rounded-full bg-gradient-to-r from-primary via-accent to-primary"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 360],
          }}
          transition={{
            scale: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            rotate: {
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }
          }}
        />
        
        {/* Inner Circle */}
        <motion.div
          className="absolute inset-0.5 rounded-full bg-background flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* User Icon */}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <motion.path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.svg>
        </motion.div>

        {/* Orbiting Dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full bg-accent"
            style={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: Math.cos((i * 2 * Math.PI) / 3) * 40,
              y: Math.sin((i * 2 * Math.PI) / 3) * 40,
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>

      {/* Social Login Options */}
      <motion.div 
        className="mb-6 space-y-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 h-11 transition-all"
          onClick={handleGoogleRegister}
        >
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
          <span>{t('continue-with-google', 'Continue with Google')}</span>
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 h-11 bg-[#06c755] text-white hover:bg-[#06c755]/90"
          onClick={handleLineRegister}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
            <path d="M19.11 17.205c-.372 0-.754-.019-1.108-.058l-1.594-.132-.434.999c-.312.715-1.459 2.992-1.459 2.992s-1.248-2.754-1.462-3.217a2.975 2.975 0 0 1-.064-.582V7.21c0-1.645 1.353-2.999 3.007-2.999 1.653 0 2.996 1.345 2.996 2.999v6.997c0 1.644-1.343 2.998-2.997 2.998zM8.15 22.007c-2.054 0-3.729-1.666-3.729-3.719V7.208c0-2.045 1.675-3.71 3.73-3.71 2.053 0 3.729 1.665 3.729 3.71v11.08c0 2.054-1.676 3.719-3.73 3.719z"/>
          </svg>
          <span>{t('continue-with-line', 'Continue with Line')}</span>
        </Button>
        
        <Button 
          type="button" 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2 h-11 bg-[#0078d4] text-white hover:bg-[#0078d4]/90"
          onClick={handleOutlookRegister}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="white">
            <path d="M21.17 3.25H13.21a1.2 1.2 0 0 0-1.2 1.2v2.44l9.35 2.82a.8.8 0 0 0 1.01-.75v-4.5a1.2 1.2 0 0 0-1.2-1.2z" />
            <path d="M13.21 8.45V20.3c0 .44.46.7.84.47l8.49-5.19a.59.59 0 0 0 .27-.49v-3.69l-9.6-2.95z" />
            <path d="M2.5 8.45L12 12.58l9.5-4.13v10.41c0 .82-.67 1.5-1.5 1.5h-16A1.5 1.5 0 0 1 2.5 18.86V8.45z" />
            <path d="M10.67 11.55l-8.33-4.4v11.71c0 .83.67 1.5 1.5 1.5h6.83V11.55z" />
          </svg>
          <span>{t('continue-with-outlook', 'Continue with Outlook')}</span>
        </Button>
      </motion.div>

      <div className="flex items-center gap-2 my-6">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground px-2">{t('or-continue-with', 'or continue with')}</span>
        <Separator className="flex-1" />
      </div>

      {/* Decorative Elements */}
      <motion.div
        className="absolute -top-4 -right-4 w-20 h-20"
        initial={{ opacity: 0, rotate: -45 }}
        animate={{ opacity: 0.5, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-xl" />
      </motion.div>
      <motion.div
        className="absolute -bottom-4 -left-4 w-16 h-16"
        initial={{ opacity: 0, rotate: 45 }}
        animate={{ opacity: 0.5, rotate: 0 }}
        transition={{ duration: 0.8, delay: 0.7 }}
      >
        <div className="w-full h-full bg-gradient-to-tr from-accent/10 to-primary/10 rounded-full blur-xl" />
      </motion.div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('full-name', 'Full Name')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('full-name-placeholder', 'John Doe')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('email', 'Email')}</FormLabel>
                <FormControl>
                  <Input placeholder={t('email-placeholder', 'your@email.com')} {...field} />
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
                <FormLabel>{t('password', 'Password')}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t('password-placeholder', '********')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('confirm-password', 'Confirm Password')}</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={t('password-placeholder', '********')} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('creating-account', 'Creating Account...') : t('create-account', 'Create Account')}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default RegisterForm; 