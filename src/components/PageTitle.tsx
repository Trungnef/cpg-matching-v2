import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageTitleProps {
  title: string;
  description: string;
  icon?: ReactNode;
  className?: string;
}

export function PageTitle({ 
  title, 
  description, 
  icon, 
  className 
}: PageTitleProps) {
  return (
    <div className={cn("flex flex-col space-y-1.5", className)}>
      <motion.div 
        className="flex items-center gap-2" 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      </motion.div>
      
      <motion.p 
        className="text-sm text-muted-foreground max-w-2xl"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {description}
      </motion.p>
    </div>
  );
} 