import { motion } from "framer-motion";
import { SunMoon, Sun, Moon, Star } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Animated stars for dark mode
  const renderStars = () => {
    return Array(4).fill(0).map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        initial={false}
        animate={{
          scale: [0.5, 1, 0.5],
          opacity: [0.3, 0.8, 0.3],
        }}
        transition={{
          duration: 2 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.5
        }}
        style={{
          top: `${10 + (i * 15)}%`,
          left: `${(i * 20) % 80}%`,
          width: `${4 + (i % 2)}px`,
          height: `${4 + (i % 2)}px`,
          borderRadius: '50%',
          background: 'white'
        }}
      />
    ));
  };

  // Cloud particles for light mode
  const renderClouds = () => {
    return Array(3).fill(0).map((_, i) => (
      <motion.div
        key={i}
        className="absolute bg-white/80 rounded-full blur-[2px]"
        initial={false}
        animate={{
          x: [-(i*5), (i*5), -(i*5)],
          opacity: [0.7, 0.9, 0.7],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.3
        }}
        style={{
          top: `${35 + (i * 10)}%`,
          left: `${30 + (i * 10)}%`,
          width: `${8 + (i * 2)}px`,
          height: `${8 + (i * 2)}px`,
        }}
      />
    ));
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative w-10 h-10 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{
                background: isDark 
                  ? "radial-gradient(circle, rgba(30,41,59,1) 0%, rgba(17,24,39,1) 100%)" 
                  : "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(226,232,240,1) 100%)"
              }}
              initial={false}
              transition={{ duration: 0.6 }}
            />
            
            {/* Outer glowing ring */}
            <motion.div
              className="absolute inset-0 rounded-full blur-md"
              animate={{
                boxShadow: isDark 
                  ? "0 0 10px 2px rgba(147, 197, 253, 0.3), inset 0 0 4px rgba(147, 197, 253, 0.3)" 
                  : "0 0 15px 2px rgba(226, 232, 240, 0.5), inset 0 0 4px rgba(226, 232, 240, 0.5)"
              }}
              initial={false}
              transition={{ duration: 0.6 }}
            />
            
            {/* Star particles in dark mode */}
            {isDark && renderStars()}
            
            {/* Cloud particles in light mode */}
            {!isDark && renderClouds()}
            
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative z-10 bg-transparent hover:bg-transparent"
            >
              <motion.div
                className="relative"
                initial={false}
                animate={{ rotate: isDark ? 0 : 180 }}
                transition={{ 
                  type: "spring",
                  stiffness: 200,
                  damping: 10
                }}
              >
                {/* Sun or Moon Icon */}
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: isDark ? 1 : 0,
                    opacity: isDark ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Moon className="h-[18px] w-[18px] text-blue-300" strokeWidth={1.5} />
                </motion.div>
                
                <motion.div
                  initial={false}
                  animate={{ 
                    scale: !isDark ? 1 : 0,
                    opacity: !isDark ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Sun className="h-[18px] w-[18px] text-sky-500" strokeWidth={1.5} />
                </motion.div>
                
                {/* The combined icon that morphs */}
                <motion.div
                  initial={false}
                  animate={{ 
                    opacity: 0.2,
                    rotate: isDark ? 0 : 180,
                  }}
                  transition={{ duration: 0.5 }}
                  className="opacity-0"
                >
                  <SunMoon className="h-[22px] w-[22px]" />
                </motion.div>
              </motion.div>
            </Button>
            
            {/* Move effect on hover */}
            <motion.div
              className="absolute inset-0 rounded-full"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle; 