import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  verificationCode: z.string().length(6, {
    message: "Verification code must be 6 digits",
  }),
});

type FormValues = z.infer<typeof formSchema>;

const EmailVerification = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const { verifyEmail, resendVerificationEmail } = useUser();

  // Handle countdown for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Define form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      verificationCode: "",
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormValues) => {
    if (!email) {
      toast({
        title: t("verification-error", "Verification Error"),
        description: t("email-not-found", "Email address not found. Please try again."),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Verify the email with the verification code
      await verifyEmail(email, data.verificationCode);
      
      toast({
        title: t("email-verified", "Email Verified"),
        description: t("email-verified-success", "Your email has been verified successfully."),
      });
      
      // Redirect to profile setup
      navigate("/dashboard");
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: t("verification-failed", "Verification Failed"),
        description: t("invalid-verification-code", "Invalid verification code. Please try again."),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend verification email
  const handleResendCode = async () => {
    if (!email) {
      toast({
        title: t("resend-error", "Resend Error"),
        description: t("email-not-found", "Email address not found. Please try again."),
        variant: "destructive",
      });
      return;
    }

    setResendLoading(true);
    
    try {
      // Resend verification email
      await resendVerificationEmail(email);
      
      toast({
        title: t("email-sent", "Email Sent"),
        description: t("verification-email-resent", "Verification email has been resent to your email address."),
      });
      
      // Start countdown
      setCountdown(60);
    } catch (error) {
      console.error("Resend error:", error);
      toast({
        title: t("resend-failed", "Resend Failed"),
        description: t("could-not-resend", "Could not resend verification email. Please try again later."),
        variant: "destructive",
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className={cn(
      "p-8 rounded-xl w-full max-w-md",
      isDark 
        ? "glass" 
        : "bg-white border border-slate-200 shadow-sm"
    )}>
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
              className={cn(
                "inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient",
                isDark ? "" : "text-shadow-sm"
              )}
            >
              {t("verify-email", "Verify Your Email")}
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
          className={cn(
            "relative h-1 w-32 mx-auto mt-4 overflow-hidden rounded-full",
            isDark 
              ? "bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20" 
              : "bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10"
          )}
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

        {/* Email Info */}
        <motion.p 
          className="text-muted-foreground mt-4 text-base"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {t("verification-code-sent", "We've sent a verification code to")}
          {" "}
          <motion.span
            className="font-semibold text-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            {email}
          </motion.span>
        </motion.p>
        
        <motion.p 
          className="text-muted-foreground mt-2 text-sm"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {t("enter-verification-code", "Enter the 6-digit verification code below to verify your email.")}
        </motion.p>
      </motion.div>

      {/* Animation for the email verification graphic */}
      <motion.div
        className="relative w-20 h-20 mx-auto mt-6 mb-8"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
      >
        {/* Envelope Base */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-lg",
            isDark 
              ? "bg-gradient-to-r from-primary to-accent" 
              : "bg-gradient-to-r from-primary/90 to-accent/90"
          )}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Envelope Content */}
        <motion.div
          className={cn(
            "absolute inset-[3px] rounded-[6px] flex items-center justify-center",
            isDark ? "bg-background" : "bg-white"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {/* Check Mark Icon */}
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-primary"
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
            />
          </motion.svg>
        </motion.div>

        {/* Animated Dots */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className={cn(
              "absolute w-2.5 h-2.5 rounded-full",
              isDark ? "bg-accent" : "bg-accent/90"
            )}
            style={{
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: Math.cos((i * 2 * Math.PI) / 3 + Math.PI / 6) * 32 - 10,
              y: Math.sin((i * 2 * Math.PI) / 3 + Math.PI / 6) * 32 - 10,
              scale: [1, 1.3, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2.5,
              delay: i * 0.3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Verification Code Input Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="verificationCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("verification-code", "Verification Code")}</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="123456" 
                    {...field} 
                    className={cn(
                      "text-center text-lg tracking-widest",
                      isDark ? "" : "border-slate-300 focus:border-primary"
                    )}
                    maxLength={6}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("verifying", "Verifying...") : t("verify-email", "Verify Email")}
          </Button>
        </form>
      </Form>

      {/* Resend Code Option */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          {t("didnt-receive-code", "Didn't receive the code?")}
        </p>
        <Button 
          variant="link" 
          onClick={handleResendCode}
          disabled={countdown > 0 || resendLoading}
          className="mt-1 h-auto p-0"
        >
          {countdown > 0 
            ? `${t("resend-in", "Resend in")} ${countdown}s` 
            : resendLoading 
              ? t("sending", "Sending...") 
              : t("resend-code", "Resend code")}
        </Button>
      </div>

      {/* Step Indicator */}
      <motion.div
        className="flex items-center justify-center mt-8 space-x-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <motion.div className="h-2 w-10 rounded-full bg-primary" />
        <motion.div className={cn("h-2 w-2 rounded-full", isDark ? "bg-muted" : "bg-slate-200")} />
        <motion.div className={cn("h-2 w-2 rounded-full", isDark ? "bg-muted" : "bg-slate-200")} />
      </motion.div>
    </div>
  );
};

export default EmailVerification; 