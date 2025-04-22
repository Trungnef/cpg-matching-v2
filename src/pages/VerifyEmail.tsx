import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EmailVerification from "@/components/EmailVerification";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";

const VerifyEmail = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email");
  const isDark = theme === "dark";

  // Page title effect
  useEffect(() => {
    document.title = t('verify-email-title', "Verify Email - CPG Matchmaker");
  }, [t]);

  return (
    <div className={cn(
      "min-h-screen flex flex-col overflow-x-hidden",
      isDark ? "bg-background" : "bg-slate-50"
    )}>
      <Navbar />
      
      <div className="flex-grow pt-16 pb-12 flex flex-col items-center justify-center relative overflow-x-hidden">
        {/* Background blur circles - adjusted for better light theme visibility */}
        <div 
          className={cn(
            "absolute top-40 -left-40 w-80 h-80 rounded-full filter blur-3xl animate-pulse-slow",
            isDark ? "bg-primary/30 opacity-30" : "bg-primary/20 opacity-20"
          )} 
        />
        <div 
          className={cn(
            "absolute bottom-20 -right-40 w-80 h-80 rounded-full filter blur-3xl animate-pulse-slow",
            isDark ? "bg-accent/30 opacity-30" : "bg-accent/20 opacity-20"
          )} 
        />
        
        <motion.div
          className="w-full max-w-md mx-auto px-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Card wrapper for better light theme contrast */}
          <div className={cn(
            "rounded-xl p-6 shadow-lg",
            isDark ? "bg-background/60 backdrop-blur-md border border-border/50" : "bg-white border border-slate-200"
          )}>
            <EmailVerification />
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default VerifyEmail; 