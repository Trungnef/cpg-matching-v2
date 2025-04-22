import { useState } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Product Manager",
    company: "Natural Foods Co.",
    content: "The CPG Matchmaker platform has transformed how we source ingredients. We found the perfect organic supplier in just two weeks, when previously it took months.",
    image: "/placeholder.jpg"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Operations Director",
    company: "Eco Packaging Solutions",
    content: "As a sustainable packaging manufacturer, finding the right brands to partner with was challenging. This platform's AI matching has increased our conversion rate by 65%.",
    image: "/placeholder.jpg"
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Procurement Specialist",
    company: "Wellness Brands Inc.",
    content: "The detailed filtering options and AI recommendations have streamlined our vendor selection process dramatically. We've reduced our sourcing cycle by 40%.",
    image: "/placeholder.jpg"
  }
];

const Testimonials = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const quoteVariants = {
    initial: { opacity: 0, scale: 0 },
    animate: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full overflow-hidden z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.div 
          className="absolute top-20 left-[10%] w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full filter blur-[80px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-[5%] w-72 h-72 bg-accent/5 dark:bg-accent/10 rounded-full filter blur-[80px]"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </motion.div>
      
      <motion.div 
        className="container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        <motion.div className="text-center max-w-2xl mx-auto mb-12">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            {t('testimonials-title', 'What Our Users Say')}
          </motion.h2>
          <motion.p 
            className="text-lg text-foreground/70"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            {t('testimonials-subtitle', 'Discover how our platform has helped businesses across the CPG industry')}
          </motion.p>
        </motion.div>
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="relative"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div 
              className="relative overflow-hidden rounded-2xl bg-background/80 dark:bg-background/30 backdrop-blur-md border border-border dark:border-border/50 p-8 md:p-12 shadow-lg"
              whileHover={{ 
                scale: 1.02,
                transition: { 
                  type: "spring", 
                  stiffness: 400, 
                  damping: 20 
                }
              }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 dark:from-primary/10 dark:to-accent/10"
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                variants={quoteVariants}
                initial="initial"
                animate="animate"
              >
                <Quote className="absolute top-6 left-6 h-12 w-12 text-primary/10 dark:text-primary/20" />
              </motion.div>
              
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeIndex}
                    className="flex flex-col"
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                  >
                    <motion.blockquote 
                      className="text-lg md:text-xl mb-6 text-foreground dark:text-foreground/90"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      "{t(`testimonial-${activeIndex+1}-content`, testimonials[activeIndex].content)}"
                    </motion.blockquote>
                    
                    <motion.div 
                      className="mt-auto flex items-center gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <motion.div 
                        className="h-12 w-12 rounded-full overflow-hidden bg-muted dark:bg-muted/50 ring-2 ring-primary/10 dark:ring-primary/20"
                        whileHover={{ 
                          scale: 1.1,
                          transition: { type: "spring", stiffness: 300, damping: 10 } 
                        }}
                      >
                        <img 
                          src={testimonials[activeIndex].image} 
                          alt={testimonials[activeIndex].name} 
                          className="h-full w-full object-cover"
                        />
                      </motion.div>
                      <div>
                        <motion.h4 
                          className="font-semibold text-foreground dark:text-foreground/90"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {t(`testimonial-${activeIndex+1}-name`, testimonials[activeIndex].name)}
                        </motion.h4>
                        <motion.p 
                          className="text-sm text-muted-foreground dark:text-muted-foreground/90"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {t(`testimonial-${activeIndex+1}-role`, testimonials[activeIndex].role)}, {t(`testimonial-${activeIndex+1}-company`, testimonials[activeIndex].company)}
                        </motion.p>
                      </div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
            
            {/* Navigation controls */}
            <motion.div 
              className="flex justify-center mt-6 gap-2"
              variants={containerVariants}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-background/80 backdrop-blur-sm dark:bg-background/20 hover:bg-background/90 dark:hover:bg-background/30"
                  onClick={prevTestimonial}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              </motion.div>
              
              <div className="flex gap-1 items-center">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    className={cn(
                      "h-2 rounded-full transition-all",
                      index === activeIndex 
                        ? "w-6 bg-primary" 
                        : "w-2 bg-muted dark:bg-muted/50 hover:bg-muted-foreground/50 dark:hover:bg-muted-foreground/30"
                    )}
                    onClick={() => setActiveIndex(index)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
              
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full bg-background/80 backdrop-blur-sm dark:bg-background/20 hover:bg-background/90 dark:hover:bg-background/30"
                  onClick={nextTestimonial}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
