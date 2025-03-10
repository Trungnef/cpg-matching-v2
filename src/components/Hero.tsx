
import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';

// CountUp component for animated statistics
const CountUp = ({ end, title, duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const inView = useInView(countRef, { once: true });
  
  useEffect(() => {
    if (inView) {
      let startTime;
      let animationFrame;
      
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));
        
        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        }
      };
      
      animationFrame = requestAnimationFrame(step);
      
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [end, duration, inView]);
  
  return (
    <motion.div 
      className="text-center p-3 rounded-xl bg-card/30 backdrop-blur-sm border border-white/10 hover:shadow-lg transition-all duration-300"
      whileHover={{ y: -5, scale: 1.03 }}
      ref={countRef}
    >
      <motion.p 
        className="text-3xl font-bold text-primary"
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 1 }}
      >
        {count}{end > 100 ? "+" : "%"}
      </motion.p>
      <p className="text-sm text-foreground/70">{title}</p>
    </motion.div>
  );
};

const Hero = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Observer for animations
  useEffect(() => {
    setIsVisible(true);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );

    const motionElements = document.querySelectorAll('.motion-item');
    motionElements.forEach(element => observer.observe(element));

    return () => {
      motionElements.forEach(element => observer.unobserve(element));
    };
  }, []);

  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section 
      ref={sectionRef}
      className="min-h-screen pt-32 relative overflow-hidden" // Added more top padding
    >
      {/* Enhanced background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full filter blur-[100px] opacity-50 animate-pulse-slow" />
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-accent/30 rounded-full filter blur-[80px] opacity-40 animate-pulse-slow" style={{animationDelay: '1s'}} />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-primary/30 rounded-full filter blur-[100px] opacity-30 animate-pulse-slow" style={{animationDelay: '2s'}} />
      </div>
      
      <motion.div 
        className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 h-screen-80 z-10 relative"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Left content */}
        <div className="flex-1 z-10">
          <motion.div 
            className="inline-flex items-center gap-2 py-1 px-3 bg-primary/10 rounded-full mb-4"
            variants={itemVariants}
          >
            <span className="h-2 w-2 rounded-full bg-primary animate-pulse"></span>
            <p className="text-sm font-medium text-primary">AI-Powered Matchmaking</p>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl font-bold leading-tight mb-6"
            variants={itemVariants}
          >
            Connect With The <span className="text-gradient bg-gradient-to-r from-primary via-primary to-accent">Perfect Partner</span> In The CPG Industry
          </motion.h1>
          
          <motion.p 
            className="text-lg text-foreground/80 mb-8"
            variants={itemVariants}
          >
            Our AI-driven platform connects manufacturers, brands, and retailers, enabling efficient product discovery and matchmaking through smart algorithms.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            variants={itemVariants}
          >
            <Link to="/auth?type=register">
              <Button size="lg" className="rounded-full px-6 gap-2 bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1">
                Get Started <ArrowRight size={16} />
              </Button>
            </Link>
            <Link to="/solutions">
              <Button variant="outline" size="lg" className="rounded-full px-6 border-2 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">Learn More</Button>
            </Link>
          </motion.div>
          
          {/* Features list with animated entrance */}
          <motion.div 
            className="mt-12 grid gap-3"
            variants={itemVariants}
          >
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <CheckCircle className="text-primary h-5 w-5" />
              <p className="text-foreground/80">AI-powered matchmaking algorithms</p>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
            >
              <CheckCircle className="text-primary h-5 w-5" />
              <p className="text-foreground/80">Customized solutions for manufacturers, brands & retailers</p>
            </motion.div>
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
            >
              <CheckCircle className="text-primary h-5 w-5" />
              <p className="text-foreground/80">Streamlined product discovery process</p>
            </motion.div>
          </motion.div>
          
          {/* Stats with counter animation */}
          <motion.div 
            className="grid grid-cols-3 gap-4 mt-12"
            variants={itemVariants}
          >
            <CountUp end={978} title="Manufacturers" />
            <CountUp end={8500} title="Products" />
            <CountUp end={98} title="Match Rate" />
          </motion.div>
        </div>
        
        {/* Right visual - Fixed image display issue */}
        <motion.div 
          className="flex-1 h-[500px] w-full max-w-[600px] relative z-10 perspective-1000"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className="absolute inset-0 glass rounded-2xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-500 transform hover:rotate-y-5 hover:rotate-x-5 card-3d"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <img 
              src={"/placeholder.jpg"} 
              alt="CPG Industry Matching"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[90%] h-16 bg-black/20 filter blur-xl rounded-full"></div>

          {/* Floating elements around the image for added depth */}
          <motion.div
            className="absolute top-10 left-5 h-10 w-10 rounded-lg bg-primary/30 backdrop-blur-md"
            animate={{ 
              y: [0, 15, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-10 h-8 w-8 rounded-full bg-accent/40 backdrop-blur-md"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, -15, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
        </motion.div>
      </motion.div>

      {/* Improved scroll indicator */}
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <p className="text-sm mb-2 text-foreground/60">Scroll to explore</p>
        <motion.div 
          className="w-6 h-10 border-2 border-foreground/20 rounded-full flex justify-center p-1"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div 
            className="w-1 h-2 bg-foreground/60 rounded-full"
            animate={{ 
              y: [0, 10, 0],
              opacity: [0.2, 1, 0.2]
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
