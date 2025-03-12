import { motion } from "framer-motion";

interface AnimatedTitleProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "gradient" | "outline";
}

const titleSizes = {
  sm: "text-2xl md:text-3xl",
  md: "text-3xl md:text-4xl",
  lg: "text-4xl md:text-5xl",
  xl: "text-5xl md:text-6xl",
};

const titleVariants = {
  default: "text-foreground",
  gradient: "bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-300% animate-gradient",
  outline: "text-transparent bg-clip-text bg-background stroke-foreground stroke-2",
};

export const AnimatedTitle = ({
  title,
  subtitle,
  className = "",
  align = "center",
  size = "lg",
  variant = "gradient",
}: AnimatedTitleProps) => {
  const words = title.split(" ");
  
  return (
    <motion.div 
      className={`relative ${align === "center" ? "text-center" : `text-${align}`} ${className}`}
      initial="hidden"
      animate="visible"
    >
      {/* Main Title */}
      <motion.div className="relative inline-block">
        <motion.h1 
          className={`font-bold ${titleSizes[size]} tracking-wide`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className={`inline-block ${titleVariants[variant]} mx-2 first:ml-0 last:mr-0`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: "easeOut",
              }}
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Animated Underline */}
        <motion.div
          className="absolute -bottom-2 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-accent to-primary"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />
      </motion.div>

      {/* Subtitle if provided */}
      {subtitle && (
        <motion.p
          className="mt-6 text-muted-foreground text-lg max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {subtitle}
        </motion.p>
      )}

      {/* Decorative Elements */}
      <motion.div 
        className="absolute -top-4 -right-4 w-24 h-24 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <div className="w-full h-full bg-gradient-to-br from-primary to-accent rounded-full blur-2xl" />
      </motion.div>

      <motion.div 
        className="absolute -bottom-4 -left-4 w-20 h-20 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 1, delay: 0.4 }}
      >
        <div className="w-full h-full bg-gradient-to-tr from-accent to-primary rounded-full blur-2xl" />
      </motion.div>

      {/* Floating Dots */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.5, 1],
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </motion.div>
  );
};

export default AnimatedTitle; 