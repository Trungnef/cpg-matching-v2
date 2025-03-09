
import { CheckCircle2, Cpu, Handshake, Search } from "lucide-react";
import { motion } from "framer-motion";

const HowItWorks = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    },
    hover: { 
      y: -10,
      scale: 1.03,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: { duration: 0.2 }
    }
  };

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-20 left-[10%] w-64 h-64 bg-primary/5 rounded-full filter blur-[80px]" />
        <div className="absolute bottom-40 right-[5%] w-72 h-72 bg-accent/5 rounded-full filter blur-[80px]" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center max-w-2xl mx-auto mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
            variants={itemVariants}
          >
            How It Works
          </motion.h2>
          <motion.p 
            className="text-lg text-foreground/70"
            variants={itemVariants}
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
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex flex-col items-center text-center"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Search className="text-primary h-7 w-7" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">1. Search & Discover</h3>
            <p className="text-foreground/70">
              Browse our extensive database of products, manufacturers, and packaging solutions based on your specific needs.
            </p>
          </motion.div>
          
          {/* Step 2 */}
          <motion.div 
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex flex-col items-center text-center"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Cpu className="text-primary h-7 w-7" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">2. AI Matching</h3>
            <p className="text-foreground/70">
              Our advanced AI analyzes your requirements and preferences to suggest the most compatible business partners.
            </p>
          </motion.div>
          
          {/* Step 3 */}
          <motion.div 
            className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 flex flex-col items-center text-center"
            variants={cardVariants}
            whileHover="hover"
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              whileHover={{ rotate: 5, scale: 1.1 }}
            >
              <Handshake className="text-primary h-7 w-7" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2">3. Connect & Collaborate</h3>
            <p className="text-foreground/70">
              Establish direct communication with potential partners and start collaborating on your next successful product.
            </p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="mt-16 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-8 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <h3 className="text-xl font-semibold mb-4 text-center">Why Choose Our Platform?</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <CheckCircle2 className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Time Efficiency</h4>
                <p className="text-sm text-foreground/70">Reduce time spent finding compatible business partners</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <CheckCircle2 className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Higher Match Quality</h4>
                <p className="text-sm text-foreground/70">AI ensures more compatible and successful partnerships</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <CheckCircle2 className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Data-Driven Decisions</h4>
                <p className="text-sm text-foreground/70">Make informed choices based on comprehensive data</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <CheckCircle2 className="text-primary h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium">Streamlined Communication</h4>
                <p className="text-sm text-foreground/70">Built-in tools to facilitate smooth collaboration</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
