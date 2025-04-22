import { useEffect, useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring, useTransform, AnimatePresence, useMotionValue } from "framer-motion";
import { Building2, ShoppingBag, Factory, Store, Droplet, Coffee, Pizza, ShoppingCart, Sandwich, Cookie, Apple, Wine, Beef, Beer, Milk, IceCream, Candy, Fish, Soup } from "lucide-react";
import { useTranslation } from "react-i18next";

const Index = () => {
  const { t } = useTranslation();
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // References for interactive elements
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Enhanced parallax effect for background elements
  const yBg1 = useTransform(scrollY, [0, 1500], [0, 400]);
  const yBg2 = useTransform(scrollY, [0, 1500], [0, -300]);
  const scaleBg = useTransform(scrollY, [0, 500], [1, 1.1]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);
  const rotation = useTransform(scrollY, [0, 1000], [0, 15]);

  useEffect(() => {
    document.title = "CPG Matchmaker - AI-Powered Partner Matching";
    
    // Mouse move handler for 3D effect
    function handleMouseMove(event) {
      const containerElement = containerRef.current;
      if (!containerElement) return;
      
      const rect = containerElement.getBoundingClientRect();
      const offsetX = event.clientX - rect.left - rect.width / 2;
      const offsetY = event.clientY - rect.top - rect.height / 2;
      
      // Update motion values for reactive animations
      mouseX.set(offsetX / 100);
      mouseY.set(offsetY / 100);
    }
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Transform values for 3D rotation effect based on mouse position
  const rotateY = useTransform(mouseX, [-5, 5], [5, -5]);
  const rotateX = useTransform(mouseY, [-5, 5], [-5, 5]);

  // Enhanced animation variants
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
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1] // Enhanced cubic-bezier for smoother transitions
      }
    }
  };

  // Floating elements for visual enhancement
  const floatingElements = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    size: Math.random() * 5 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 10 + 5,
    delay: Math.random() * 3,
    color: i % 4 === 0 ? 'var(--primary)' : 
           i % 4 === 1 ? 'var(--accent)' : 
           i % 4 === 2 ? 'var(--muted)' : 'var(--secondary)'
  }));

  // 3D card animation
  const cardVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background via-background/95 to-background dark:from-background dark:via-background/95 dark:to-background perspective-1000"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{
        perspective: "1000px"
      }}
    >
      {/* Enhanced Progress Bar with better gradient and shine effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-50 overflow-hidden"
        style={{ scaleX, transformOrigin: "0%" }}
      >
        <motion.div 
          className="absolute inset-0 opacity-60 bg-white dark:bg-white"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "easeInOut"
          }}
          style={{ width: '30%' }}
        />
      </motion.div>

      {/* Enhanced Background Elements with Parallax and Theme Adaptation */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary large background gradient */}
        <motion.div
          className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-br from-primary/15 via-accent/10 to-transparent dark:from-primary/20 dark:via-accent/15 dark:to-transparent rounded-full filter blur-[130px]"
          style={{ 
            y: yBg1, 
            opacity, 
            scale: scaleBg,
            rotateZ: rotation 
          }}
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Secondary background gradient */}
        <motion.div
          className="absolute -bottom-40 -left-40 w-[700px] h-[700px] bg-gradient-to-tr from-accent/15 via-primary/10 to-transparent dark:from-accent/20 dark:via-primary/15 dark:to-transparent rounded-full filter blur-[120px]"
          style={{ 
            y: yBg2, 
            opacity,
            rotateZ: useTransform(rotation, r => -r) 
          }}
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [15, 0, 15],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Additional small accent gradient for visual interest */}
        <motion.div
          className="absolute top-[30%] left-[10%] w-[300px] h-[300px] bg-gradient-to-tr from-primary/5 via-accent/10 to-transparent dark:from-primary/10 dark:via-accent/15 dark:to-transparent rounded-full filter blur-[80px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      {/* Enhanced Content Layout with improved theme compatibility and 3D transformation */}
      <div 
        className="relative z-10"
        style={{
          transformStyle: "preserve-3d"
        }}
      >
        <motion.div 
          variants={itemVariants}
          className="sticky top-0 z-50 bg-background/70 dark:bg-background/50 backdrop-blur-xl border-b border-border/30 dark:border-border/20"
        >
          <Navbar />
        </motion.div>

        {/* Main Content Sections */}
        <div className="space-y-24 pb-20">
          {/* Hero Section */}
          <motion.section
            variants={itemVariants}
            className="relative min-h-screen"
          >
            <Hero />
          </motion.section>

          {/* How It Works Section with enhanced gradient background */}
          <motion.section
            variants={itemVariants}
            className="relative py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent dark:via-primary/10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <div className="container mx-auto px-4">
              <HowItWorks />
            </div>
          </motion.section>

          {/* Featured Partners Section with enhanced 3D visuals */}
          <motion.section
            variants={itemVariants}
            className="relative py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent dark:via-accent/10"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            
            <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                <motion.h2 
                  className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {t('featured-partners', 'Our Featured Partners')}
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {t('featured-partners-description', 'Join our growing network of successful partnerships in the CPG industry')}
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: Building2,
                    title: t('manufacturers-title', 'Manufacturers'),
                    count: t('manufacturers-count', '987+'),
                    description: t('manufacturers-description', 'Leading CPG manufacturers')
                  },
                  {
                    icon: ShoppingBag,
                    title: t('brands-title', 'Brands'),
                    count: t('brands-count', '1000+'),
                    description: t('brands-description', 'Innovative consumer brands')
                  },
                  {
                    icon: Factory,
                    title: t('suppliers-title', 'Suppliers'),
                    count: t('suppliers-count', '300+'),
                    description: t('suppliers-description', 'Quality material suppliers')
                  },
                  {
                    icon: Store,
                    title: t('retailers-title', 'Retailers'),
                    count: t('retailers-count', '200+'),
                    description: t('retailers-description', 'Global retail partners')
                  }
                ].map((partner, index) => (
                  <motion.div
                    key={partner.title}
                    className="relative group transform perspective-1000"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover="hover"
                    variants={cardVariants}
                    style={{
                      transformStyle: "preserve-3d"
                    }}
                  >
                    <motion.div 
                      className="relative p-6 rounded-2xl bg-background/50 dark:bg-background/30 backdrop-blur-sm border border-border dark:border-border/50 group-hover:border-primary/20 dark:group-hover:border-primary/30 transition-all duration-300 h-full"
                      style={{
                        transformStyle: "preserve-3d",
                        rotateX: useTransform(mouseY, [-100, 100], [5, -5]),
                        rotateY: useTransform(mouseX, [-100, 100], [-5, 5]),
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 dark:from-primary/10 dark:to-accent/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={false}
                        animate={{
                          scale: [1, 1.02, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                      
                      <div className="relative" style={{ transform: "translateZ(20px)" }}>
                        <motion.div 
                          className="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                          whileHover={{ 
                            rotateY: 180,
                            transition: { duration: 0.8 }
                          }}
                        >
                          <partner.icon className="w-6 h-6 text-primary" />
                        </motion.div>
                        
                        <h3 className="text-xl font-semibold mb-2">{partner.title}</h3>
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                          {partner.count}
                        </div>
                        <p className="text-muted-foreground">{partner.description}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 blur-xl transition-all duration-300"
                      initial={false}
                      animate={{
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Partner Logos with enhanced 3D theme compatibility */}
              <div className="mt-16">
                <motion.div 
                  className="text-center text-muted-foreground mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('global-partners', 'Our Global Partners')}</h3>
                  <p>{t('trusted-companies', 'Trusted by leading companies worldwide')}</p>
                </motion.div>
                
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-items-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {[
                    { icon: Droplet, name: t('company-cocacola', 'Coca-Cola'), color: "text-[#FF0000]" },
                    { icon: Coffee, name: t('company-nestle', 'Nestlé'), color: "text-[#009CA6]" },
                    { icon: Pizza, name: t('company-pepsico', 'PepsiCo'), color: "text-[#004B93]" },
                    { icon: ShoppingCart, name: t('company-unilever', 'Unilever'), color: "text-[#1F36C7]" },
                    { icon: Sandwich, name: t('company-kraftheinz', 'Kraft Heinz'), color: "text-[#FF0000]" },
                    { icon: Cookie, name: t('company-mondelez', 'Mondelez'), color: "text-[#7B5AA6]" },
                    { icon: Apple, name: t('company-danone', 'Danone'), color: "text-[#0066B3]" },
                    { icon: Wine, name: t('company-pg', 'P&G'), color: "text-[#004B93]" },
                    { icon: Beef, name: t('company-tyson', 'Tyson Foods'), color: "text-[#008542]" },
                    { icon: Beer, name: t('company-abinbev', 'AB InBev'), color: "text-[#FFC200]" },
                    { icon: Milk, name: t('company-generalmills', 'General Mills'), color: "text-[#008542]" },
                    { icon: IceCream, name: t('company-mars', 'Mars Inc'), color: "text-[#FF0000]" },
                    { icon: Candy, name: t('company-hersheys', 'Hershey\'s'), color: "text-[#89443C]" },
                    { icon: Fish, name: t('company-kelloggs', 'Kellogg\'s'), color: "text-[#FF0000]" },
                    { icon: Soup, name: t('company-campbells', 'Campbell\'s'), color: "text-[#E31837]" }
                  ].map((company, i) => (
                    <motion.div
                      key={company.name}
                      className="relative group w-36 h-24 perspective-800"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                      whileHover={{ 
                        scale: 1.05,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 dark:from-background/60 dark:to-background/20 backdrop-blur-sm rounded-xl border border-border dark:border-border/50 group-hover:border-primary/20 dark:group-hover:border-primary/30 transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden"
                        style={{
                          transformStyle: "preserve-3d",
                          rotateX: useTransform(mouseY, [-5000, 5000], [5, -5], { clamp: false }),
                          rotateY: useTransform(mouseX, [-5000, 5000], [-5, 5], { clamp: false }),
                        }}
                      >
                        <motion.div
                          animate={{
                            y: [0, -2, 0],
                            scale: [1, 1.05, 1],
                            rotateZ: [0, i % 2 ? 5 : -5, 0]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1
                          }}
                          style={{ transformStyle: "preserve-3d", transform: "translateZ(10px)" }}
                        >
                          <company.icon className={`w-8 h-8 ${company.color} group-hover:scale-110 transition-transform duration-300`} />
                        </motion.div>
                        <span className={`text-sm font-semibold ${company.color} opacity-90 group-hover:opacity-100`} style={{ transform: "translateZ(5px)" }}>
                          {company.name}
                        </span>
                      </motion.div>
                      
                      {/* Enhanced Glow Effect with better theme adaptation */}
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl opacity-0 group-hover:opacity-70 dark:group-hover:opacity-80 blur-xl transition-all duration-300"
                        initial={false}
                        animate={{
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Trust Badges with enhanced 3D theme adaptation */}
                <motion.div 
                  className="mt-12 flex flex-wrap justify-center items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {[
                    t('badge-iso', 'ISO Certified'),
                    t('badge-gdpr', 'GDPR Compliant'),
                    t('badge-enterprise', 'Enterprise Ready'),
                    t('badge-support', '24/7 Support'),
                    t('badge-network', 'Global Network'),
                    t('badge-secure', 'Secure Platform')
                  ].map((badge, i) => (
                    <motion.div
                      key={badge}
                      className="px-4 py-2 rounded-full bg-background/50 dark:bg-background/30 backdrop-blur-sm border border-border dark:border-border/50 text-sm text-muted-foreground flex items-center gap-2 hover:border-primary/30 dark:hover:border-primary/50 transition-colors duration-300"
                      whileHover={{ 
                        scale: 1.05,
                        rotateZ: i % 2 ? 1 : -1,
                        transition: { duration: 0.2 } 
                      }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <motion.div 
                        className="w-2 h-2 rounded-full bg-primary/50 dark:bg-primary/70"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: i * 0.2
                        }}
                      />
                      {badge}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Testimonials Section with enhanced 3D theme adaptation */}
          <motion.section
            variants={itemVariants}
            className="relative py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent dark:via-accent/10"
              animate={{
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
              }}
            />
            <Testimonials />
          </motion.section>
        </div>

        {/* Enhanced Footer with better theme adaptation */}
        <motion.footer
          variants={itemVariants}
          className="relative bg-gradient-to-t from-background via-background/95 to-transparent dark:from-background dark:via-background/95 dark:to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent dark:from-primary/10 dark:via-transparent dark:to-transparent"
            animate={{
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <Footer />
        </motion.footer>
      </div>

      {/* Enhanced Floating Elements with improved theme adaptation and 3D effect */}
      <div className="fixed inset-0 pointer-events-none">
        <AnimatePresence>
          {floatingElements.map((el) => (
            <motion.div
              key={el.id}
              className="absolute rounded-full"
              style={{
                top: `${el.y}%`,
                left: `${el.x}%`,
                width: `${el.size}px`,
                height: `${el.size}px`,
                background: el.color,
                filter: 'blur(1px)',
                transformStyle: "preserve-3d",
                transform: `translateZ(${el.id % 4 * 10}px)`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [1, 1.2, 1],
                rotateZ: [0, 180, 360],
              }}
              transition={{
                duration: el.duration,
                repeat: Infinity,
                ease: "easeInOut",
                delay: el.delay,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Index;
