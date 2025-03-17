import { CheckCircle2, Cpu, Handshake, Search } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";

const HowItWorks = () => {
  const { t } = useTranslation();
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
    <section id="how-it-works" className="py-20 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {t('how-it-works')}
          </motion.h2>
          <motion.div 
            className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mx-auto mb-6"
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 80 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, amount: 0.3 }}
          />
          <motion.p 
            className="max-w-2xl mx-auto text-foreground/70"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            {t('how-it-works-description', 'Our AI-powered platform simplifies the process of connecting manufacturers with retailers and brands in the CPG industry.')}
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
              {t('step-1-title', '1. Search & Discover')}
            </motion.h3>
            <motion.p 
              className="text-foreground/70"
              variants={itemVariants}
            >
              {t('step-1-description', 'Browse our extensive database of products, manufacturers, and packaging solutions based on your specific needs.')}
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
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.h3 
              className="text-xl font-semibold mb-2"
              variants={itemVariants}
            >
              {t('step-2-title', '2. AI Matchmaking')}
            </motion.h3>
            <motion.p 
              className="text-foreground/70"
              variants={itemVariants}
            >
              {t('step-2-description', 'Our AI algorithms analyze requirements, capabilities, and preferences to suggest the most compatible business partnerships.')}
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
                  ease: "easeInOut"
                }}
              />
            </motion.div>
            <motion.h3 
              className="text-xl font-semibold mb-2"
              variants={itemVariants}
            >
              {t('step-3-title', '3. Connect & Collaborate')}
            </motion.h3>
            <motion.p 
              className="text-foreground/70"
              variants={itemVariants}
            >
              {t('step-3-description', 'Establish connections with your matches, communicate directly, and form productive business relationships.')}
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
            {t('why-choose-platform', 'Why Choose Our Platform?')}
          </motion.h3>
          
          <div className="space-y-4 relative z-10">
            {[
              {
                title: t('benefit-time', 'Time Efficiency'),
                description: t('benefit-time-description', 'Reduce time spent finding compatible business partners')
              },
              {
                title: t('benefit-quality', 'Higher Match Quality'),
                description: t('benefit-quality-description', 'AI ensures more compatible and successful partnerships')
              },
              {
                title: t('benefit-data', 'Data-Driven Decisions'),
                description: t('benefit-data-description', 'Make informed choices based on comprehensive data')
              },
              {
                title: t('benefit-communication', 'Streamlined Communication'),
                description: t('benefit-communication-description', 'Built-in tools to facilitate smooth collaboration')
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
                  <h4 className="font-medium text-foreground">{item.title}</h4>
                  <p className="text-sm text-foreground/70">{item.description}</p>
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
