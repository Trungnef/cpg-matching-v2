import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { useEffect, useState } from "react";

// Animation variants
const toggleVariants = {
  light: {
    rotate: [0, 15, -15, 0],
    scale: [1, 1.1, 1],
    transition: { 
      duration: 0.6,
      ease: "easeInOut"
    }
  },
  dark: {
    rotate: [0, -15, 15, 0],
    scale: [1, 1.1, 1],
    transition: { 
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [hasClicked, setHasClicked] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Function to handle theme toggle with animation
  const handleToggle = () => {
    setHasClicked(true);
    toggleTheme();
  };

  // Render particles based on theme
  const renderParticles = () => {
    if (prefersReducedMotion) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden rounded-full pointer-events-none">
        {isDark ? (
          // Stars for dark mode
          Array(6).fill(0).map((_, i) => (
            <motion.div
              key={`star-${i}`}
              className="absolute bg-yellow-100 rounded-full"
              initial={false}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                x: [0, (i % 2 === 0 ? 15 : -15) * (i + 1) / 3],
                y: [0, ((i % 3) - 1) * 15],
              }}
              transition={{
                duration: 1.5,
                ease: "easeOut",
                delay: hasClicked ? 0 : 0.5 + i * 0.1,
                repeat: hasClicked ? 0 : Infinity,
                repeatDelay: 3,
              }}
              style={{
                top: `${50 + ((i % 3) - 1) * 10}%`,
                left: `${50 + ((i % 2) * 10) - 5}%`,
                width: `${2 + (i % 3)}px`,
                height: `${2 + (i % 3)}px`,
              }}
            />
          ))
        ) : (
          // Rays for light mode
          Array(8).fill(0).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            return (
              <motion.div
                key={`ray-${i}`}
                className="absolute bg-yellow-400"
                initial={false}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [0.6, 1, 0.6],
                }}
                transition={{
                  duration: 2,
                  ease: "easeInOut",
                  delay: hasClicked ? 0 : i * 0.1,
                  repeat: hasClicked ? 0 : Infinity,
                }}
                style={{
                  height: '2px',
                  width: '10px',
                  borderRadius: '2px',
                  transformOrigin: 'left center',
                  left: '50%',
                  top: '50%',
                  transform: `rotate(${angle}rad) translateX(14px)`,
                }}
              />
            );
          })
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={300}>
        <TooltipTrigger asChild>
          <div className="relative">
            <motion.div
              className={`flex items-center justify-center w-9 h-9 rounded-full ${
                isDark 
                  ? 'bg-gradient-to-b from-slate-700 to-slate-900 shadow-inner shadow-slate-950/50' 
                  : 'bg-gradient-to-b from-blue-50 to-sky-100 shadow-inner shadow-sky-200/50'
              } transition-colors duration-300 ease-in-out relative overflow-hidden`}
              whileHover={{ 
                scale: 1.05,
                boxShadow: isDark 
                  ? '0 0 8px 2px rgba(148, 163, 184, 0.3)' 
                  : '0 0 8px 2px rgba(14, 165, 233, 0.2)' 
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Glow effect */}
              <motion.div 
                className="absolute inset-0 rounded-full blur-md"
                animate={{
                  background: isDark 
                    ? 'radial-gradient(circle at center, rgba(30, 58, 138, 0.15) 0%, rgba(15, 23, 42, 0) 70%)' 
                    : 'radial-gradient(circle at center, rgba(251, 191, 36, 0.2) 0%, rgba(251, 191, 36, 0) 70%)'
                }}
                initial={false}
                transition={{ duration: 0.6 }}
              />

              {renderParticles()}

              {/* Toggle button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleToggle}
                className="relative z-10 rounded-full p-0 h-full w-full bg-transparent hover:bg-transparent focus-visible:ring-1 focus-visible:ring-offset-1"
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                <motion.div
                  animate={hasClicked ? (isDark ? "dark" : "light") : ""}
                  variants={toggleVariants}
                  initial={false}
                >
                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: isDark ? 1 : 0,
                      scale: isDark ? 1 : 0.5,
                      rotateZ: isDark ? 0 : -90
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Moon className="h-[18px] w-[18px] text-blue-200" strokeWidth={1.75} />
                  </motion.div>
                  
                  <motion.div
                    initial={false}
                    animate={{ 
                      opacity: !isDark ? 1 : 0,
                      scale: !isDark ? 1 : 0.5,
                      rotateZ: !isDark ? 0 : 90
                    }}
                    transition={{ 
                      duration: 0.3,
                      ease: "easeInOut"
                    }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Sun className="h-[18px] w-[18px] text-amber-500" strokeWidth={1.75} />
                  </motion.div>
                </motion.div>
              </Button>
            </motion.div>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom"
          className={`${isDark ? 'bg-slate-800 text-slate-200' : 'bg-white text-slate-900'} px-3 py-1.5 text-xs font-medium border ${isDark ? 'border-slate-700' : 'border-slate-200'}`}
        >
          <p>{isDark ? 'Switch to light mode' : 'Switch to dark mode'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeToggle; 