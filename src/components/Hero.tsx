import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// Enhanced CountUp component with more vibrant animations
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
      className="text-center p-4 rounded-xl bg-gradient-to-br from-primary/5 via-accent/10 to-primary/5 backdrop-blur-lg border border-white/10 shadow-lg"
      whileHover={{ 
        y: -5, 
        scale: 1.03,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
      ref={countRef}
    >
      <motion.div
        className="relative"
        animate={{
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <motion.p 
          className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.5, type: "spring" }}
        >
          {count}{end > 100 ? "+" : "%"}
        </motion.p>
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-lg blur-[2px]"
          animate={{
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      <p className="text-sm font-medium text-foreground/70 mt-1">{title}</p>
    </motion.div>
  );
};

const Hero = () => {
  const { t } = useTranslation();
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
      className="min-h-screen pt-32 relative overflow-hidden"
    >
      {/* Enhanced background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-full filter blur-[120px]"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-accent/40 via-primary/40 to-accent/40 rounded-full filter blur-[100px]"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-gradient-to-bl from-primary/30 via-accent/30 to-primary/30 rounded-full filter blur-[130px]"
          animate={{
            scale: [1.1, 0.9, 1.1],
            rotate: [-45, 45, -45],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
      </div>
      
      <motion.div 
        className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12 h-screen-80 z-10 relative"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={containerVariants}
      >
        {/* Left content with enhanced animations */}
        <div className="flex-1 z-10">
          <motion.div 
            className="inline-flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-full mb-6 backdrop-blur-sm border border-white/10"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span 
              className="h-3 w-3 rounded-full bg-gradient-to-r from-primary to-accent"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <p className="text-sm font-medium bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t('ai-powered-matchmaking', 'AI-Powered Matchmaking')}
            </p>
          </motion.div>
          
          <motion.h1 
            className="text-6xl md:text-7xl font-bold leading-tight mb-8"
            variants={itemVariants}
          >
            {t('connect-with-the', 'Connect With The')}{' '}
            <motion.span 
              className="relative inline-block"
              whileHover={{
                scale: 1.05,
                transition: { type: "spring", stiffness: 400, damping: 10 }
              }}
            >
              <span className="relative z-10 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                {t('perfect-partner', 'Perfect Partner')}
              </span>
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 blur-lg -z-10"
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.span>{' '}
            {t('in-the-cpg-industry', 'In The CPG Industry')}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-foreground/80 mb-10 leading-relaxed"
            variants={itemVariants}
          >
            {t('hero-description', 'Our AI-driven platform connects manufacturers, brands, and retailers, enabling efficient product discovery and matchmaking through smart algorithms.')}
          </motion.p>
          
          {/* Enhanced buttons */}
          <motion.div 
            className="flex flex-wrap gap-6"
            variants={itemVariants}
          >
            <Link to="/auth?type=register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button size="lg" className="rounded-full px-8 py-6 text-lg bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/20 transition-all duration-300">
                  {t('get-started')} <ArrowRight size={20} />
              </Button>
              </motion.div>
            </Link>
            <Link to="/solutions">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-2 hover:bg-primary/10 transition-all duration-300">
                  {t('learn-more')}
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          
          {/* Enhanced features list */}
          <motion.div 
            className="mt-16 grid gap-4"
            variants={itemVariants}
          >
            {[
              t('feature-ai-matchmaking', 'AI-powered matchmaking algorithms'),
              t('feature-customized', 'Customized solutions for manufacturers, brands & retailers'),
              t('feature-streamlined', 'Streamlined product discovery process')
            ].map((feature, index) => (
            <motion.div 
                key={index}
                className="flex items-center gap-3 bg-gradient-to-r from-primary/5 to-accent/5 p-4 rounded-xl backdrop-blur-sm"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 400, damping: 10 }
                }}
              >
            <motion.div 
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.2
                  }}
            >
                  <CheckCircle className="text-primary h-6 w-6" />
            </motion.div>
                <p className="text-foreground/90 font-medium">{feature}</p>
            </motion.div>
            ))}
          </motion.div>
          
          {/* Enhanced stats */}
          <motion.div 
            className="grid grid-cols-3 gap-4 mt-12"
            variants={itemVariants}
          >
            <CountUp end={978} title={t('manufacturers')} />
            <CountUp end={8500} title={t('products')} />
            <CountUp end={98} title={t('match-rate', 'Match Rate')} />
          </motion.div>
        </div>
        
        {/* Enhanced right visual */}
        <motion.div 
          className="flex-1 h-[600px] w-full max-w-[600px] relative z-10 perspective-1000"
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            rotateY: 5,
            rotateX: 5,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <motion.div 
            className="absolute inset-0 glass rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"
              animate={{
                opacity: [0.3, 0.5, 0.3],
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <img 
              src={"/placeholder.jpg"} 
              alt="CPG Industry Matching"
              className="w-full h-full object-cover object-center"
            />
          </motion.div>

          {/* Enhanced floating elements */}
          {[...Array(4)].map((_, i) => (
          <motion.div
              key={i}
              className={`absolute ${
                i === 0 ? "top-10 left-5" :
                i === 1 ? "bottom-20 right-10" :
                i === 2 ? "top-1/2 left-10" :
                "bottom-10 right-20"
              } h-${10 + i * 2} w-${10 + i * 2} rounded-${i % 2 ? 'full' : 'lg'} 
              bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-md`}
            animate={{ 
                y: [0, (i % 2 ? 15 : -15), 0],
                rotate: [0, i * 10, 0],
                scale: [1, 1.1, 1],
            }}
            transition={{ 
                duration: 4 + i,
              repeat: Infinity,
              repeatType: "reverse",
                delay: i * 0.5
            }}
          />
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
