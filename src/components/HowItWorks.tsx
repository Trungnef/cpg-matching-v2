import { CheckCircle2, Cpu, Handshake, Search } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";

const HowItWorks = () => {
  const { scrollYProgress } = useScroll();
  
  // Enhanced animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.8,
        ease: [0.6, 0.05, -0.01, 0.9]
      }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: { 
      y: -15,
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const iconVariants = {
    hidden: { scale: 0, rotate: -180 },
    visible: { 
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20
      }
    },
    hover: {
      scale: 1.2,
      rotate: 360,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Enhanced background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <motion.div 
          className="absolute top-20 left-[10%] w-96 h-96 bg-primary/5 rounded-full filter blur-[100px]"
          style={{
            scale: useTransform(scrollYProgress, [0, 1], [0.8, 1.2]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])
          }}
        />
        <motion.div 
          className="absolute bottom-40 right-[5%] w-[500px] h-[500px] bg-accent/5 rounded-full filter blur-[120px]"
          style={{
            scale: useTransform(scrollYProgress, [0, 1], [1.2, 0.8]),
            opacity: useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.7, 0.4])
          }}
        />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="inline-block"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6 relative"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="relative inline-block bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient bg-300%">
                How It Works
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-xl -z-10"
                  animate={{
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
              </span>
            </motion.h2>
          </motion.div>
          <motion.p 
            className="text-lg text-foreground/70"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
          >
            Our platform simplifies the connection process between manufacturers, brands, and retailers
            through our advanced AI-driven matchmaking system.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={containerVariants}
        >
          {/* Step 1 */}
          <motion.div 
            className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex flex-col items-center text-center group"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <motion.div 
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 relative"
              variants={iconVariants}
              whileHover="hover"
            >
              <Search className="text-primary h-7 w-7" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.h3 
              className="text-xl font-semibold mb-2"
              variants={itemVariants}
            >
              1. Search & Discover
            </motion.h3>
            <motion.p 
              className="text-foreground/70"
              variants={itemVariants}
            >
              Browse our extensive database of products, manufacturers, and packaging solutions based on your specific needs.
            </motion.p>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div 
            className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex flex-col items-center text-center group"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <motion.div 
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 relative"
              variants={iconVariants}
              whileHover="hover"
            >
              <Cpu className="text-primary h-7 w-7" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.3
                }}
              />
            </motion.div>
            <motion.h3 
              className="text-xl font-semibold mb-2"
              variants={itemVariants}
            >
              2. AI Matching
            </motion.h3>
            <motion.p 
              className="text-foreground/70"
              variants={itemVariants}
            >
              Our advanced AI analyzes your requirements and preferences to suggest the most compatible business partners.
            </motion.p>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div 
            className="relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex flex-col items-center text-center group"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
            <motion.div 
              className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 relative"
              variants={iconVariants}
              whileHover="hover"
            >
              <Handshake className="text-primary h-7 w-7" />
              <motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-sm"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.6
                }}
              />
            </motion.div>
            <motion.h3 
              className="text-xl font-semibold mb-2"
              variants={itemVariants}
            >
              3. Connect & Collaborate
            </motion.h3>
            <motion.p 
              className="text-foreground/70"
              variants={itemVariants}
            >
              Establish direct communication with potential partners and start collaborating on your next successful product.
            </motion.p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 max-w-3xl mx-auto overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          whileHover={{
            scale: 1.02,
            transition: { duration: 0.3 }
          }}
        >
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
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
          
          <motion.h3 
            className="text-xl font-semibold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Why Choose Our Platform?
          </motion.h3>
          
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: "Time Efficiency",
                description: "Reduce time spent finding compatible business partners"
              },
              {
                title: "Higher Match Quality",
                description: "AI ensures more compatible and successful partnerships"
              },
              {
                title: "Data-Driven Decisions",
                description: "Make informed choices based on comprehensive data"
              },
              {
                title: "Streamlined Communication",
                description: "Built-in tools to facilitate smooth collaboration"
              }
            ].map((item, index) => (
            <motion.div 
                key={item.title}
                className="flex items-start gap-3 group"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
                whileHover={{ x: 5 }}
              >
            <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.2 }}
            >
              <CheckCircle2 className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
                  <motion.div
                    className="absolute inset-0 bg-primary/20 rounded-full blur-sm"
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: index * 0.2
                    }}
                  />
                </motion.div>
              <div>
                  <motion.h4 
                    className="font-medium"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {item.title}
                  </motion.h4>
                  <motion.p 
                    className="text-sm text-foreground/70"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {item.description}
                  </motion.p>
              </div>
            </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
