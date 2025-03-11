import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { Building2, ShoppingBag, Factory, Store, Droplet, Coffee, Pizza, ShoppingCart, Sandwich, Cookie, Apple, Wine, Beef, Beer, Milk, IceCream, Candy, Fish, Soup, Carrot } from "lucide-react";

const Index = () => {
  const { scrollYProgress, scrollY } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax effect for background elements
  const yBg1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const yBg2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  useEffect(() => {
    document.title = "CPG Matchmaker - AI-Powered Partner Matching";
  }, []);

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
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen overflow-x-hidden bg-gradient-to-b from-background via-background/95 to-background"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Enhanced Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-50"
        style={{ scaleX, transformOrigin: "0%" }}
      />

      {/* Enhanced Background Elements with Parallax */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full filter blur-[120px]"
          style={{ y: yBg1, opacity }}
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 45, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full filter blur-[100px]"
          style={{ y: yBg2, opacity }}
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [45, 0, 45],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Enhanced Content Layout */}
      <div className="relative z-10">
        <motion.div 
          variants={itemVariants}
          className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-white/10"
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

          {/* How It Works Section */}
          <motion.section
            variants={itemVariants}
            className="relative py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"
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

          {/* Featured Partners Section */}
          <motion.section
            variants={itemVariants}
            className="relative py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"
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
                  Our Featured Partners
                </motion.h2>
                <motion.p 
                  className="text-muted-foreground text-lg max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  Join our growing network of successful partnerships in the CPG industry
                </motion.p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                  {
                    icon: Building2,
                    title: "Manufacturers",
                    count: "987+",
                    description: "Leading CPG manufacturers"
                  },
                  {
                    icon: ShoppingBag,
                    title: "Brands",
                    count: "1000+",
                    description: "Innovative consumer brands"
                  },
                  {
                    icon: Factory,
                    title: "Suppliers",
                    count: "300+",
                    description: "Quality material suppliers"
                  },
                  {
                    icon: Store,
                    title: "Retailers",
                    count: "200+",
                    description: "Global retail partners"
                  }
                ].map((partner, index) => (
                  <motion.div
                    key={partner.title}
                    className="relative group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="relative p-6 rounded-2xl bg-background/50 backdrop-blur-sm border border-primary/10 group-hover:border-primary/20 transition-all duration-300">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
                      
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                          <partner.icon className="w-6 h-6 text-primary" />
                        </div>
                        
                        <h3 className="text-xl font-semibold mb-2">{partner.title}</h3>
                        <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2">
                          {partner.count}
                        </div>
                        <p className="text-muted-foreground">{partner.description}</p>
                      </div>
                    </div>

                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl opacity-0 group-hover:opacity-10 blur-xl transition-all duration-300"
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

              {/* Partner Logos */}
              <div className="mt-16">
                <motion.div 
                  className="text-center text-muted-foreground mb-12"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h3 className="text-2xl font-semibold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">Our Global Partners</h3>
                  <p>Trusted by leading companies worldwide</p>
                </motion.div>
                
                <motion.div 
                  className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 items-center justify-items-center"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                >
                  {[
                    { icon: Droplet, name: "Coca-Cola", color: "text-[#FF0000]" },
                    { icon: Coffee, name: "Nestlé", color: "text-[#009CA6]" },
                    { icon: Pizza, name: "PepsiCo", color: "text-[#004B93]" },
                    { icon: ShoppingCart, name: "Unilever", color: "text-[#1F36C7]" },
                    { icon: Sandwich, name: "Kraft Heinz", color: "text-[#FF0000]" },
                    { icon: Cookie, name: "Mondelez", color: "text-[#7B5AA6]" },
                    { icon: Apple, name: "Danone", color: "text-[#0066B3]" },
                    { icon: Wine, name: "P&G", color: "text-[#004B93]" },
                    { icon: Beef, name: "Tyson Foods", color: "text-[#008542]" },
                    { icon: Beer, name: "AB InBev", color: "text-[#FFC200]" },
                    { icon: Milk, name: "General Mills", color: "text-[#301E46]" },
                    { icon: IceCream, name: "Mars Inc", color: "text-[#FF0000]" },
                    { icon: Candy, name: "Hershey's", color: "text-[#89443C]" },
                    { icon: Fish, name: "Kellogg's", color: "text-[#FF0000]" },
                    { icon: Soup, name: "Campbell's", color: "text-[#E31837]" }
                  ].map((company, i) => (
                    <motion.div
                      key={company.name}
                      className="relative group w-36 h-24"
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
                      <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm rounded-xl border border-primary/10 group-hover:border-primary/20 transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden">
                        <motion.div
                          animate={{
                            y: [0, -2, 0],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.1
                          }}
                        >
                          <company.icon className={`w-8 h-8 ${company.color} group-hover:scale-110 transition-transform duration-300`} />
                        </motion.div>
                        <span className={`text-sm font-semibold ${company.color} opacity-90 group-hover:opacity-100`}>
                          {company.name}
                        </span>
                      </div>
                      
                      {/* Enhanced Glow Effect */}
                      <motion.div
                        className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-300"
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

                {/* Trust Badges */}
                <motion.div 
                  className="mt-12 flex flex-wrap justify-center items-center gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {[
                    "ISO Certified",
                    "GDPR Compliant",
                    "Enterprise Ready",
                    "24/7 Support",
                    "Global Network",
                    "Secure Platform"
                  ].map((badge, i) => (
                    <motion.div
                      key={badge}
                      className="px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-primary/10 text-sm text-muted-foreground flex items-center gap-2"
                      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="w-2 h-2 rounded-full bg-primary/50" />
                      {badge}
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Testimonials Section */}
          <motion.section
            variants={itemVariants}
            className="relative py-16"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent"
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

        {/* Enhanced Footer */}
        <motion.footer
          variants={itemVariants}
          className="relative bg-gradient-to-t from-background via-background/95 to-transparent"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent"
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

      {/* Enhanced Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              background: i % 2 ? 'var(--primary)' : 'var(--accent)',
              filter: 'blur(1px)',
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default Index;
