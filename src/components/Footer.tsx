
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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
    <motion.footer 
      className="bg-card/50 backdrop-blur-sm border-t border-border/50 py-12 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Background elements */}
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary/5 rounded-full filter blur-[80px]" />
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-accent/5 rounded-full filter blur-[80px]" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <motion.div variants={itemVariants}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold">M</span>
              </div>
              <span className="font-bold text-xl">CPG Matchmaker</span>
            </div>
            <p className="text-sm text-foreground/70 mb-4">
              AI-powered matchmaking for the Consumer Packaged Goods industry.
            </p>
            <div className="flex gap-3 mt-4">
              <motion.a 
                href="#" 
                className="h-8 w-8 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <Twitter size={16} />
              </motion.a>
              <motion.a 
                href="#" 
                className="h-8 w-8 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <Linkedin size={16} />
              </motion.a>
              <motion.a 
                href="#" 
                className="h-8 w-8 rounded-full bg-foreground/5 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-colors"
                whileHover={{ y: -3, scale: 1.1 }}
              >
                <Github size={16} />
              </motion.a>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/solutions" className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center">
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Solutions
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center">
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Products
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/manufacturers" className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center">
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Manufacturers
                  </span>
                </Link>
              </li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center">
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    About Us
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center">
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Careers
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center">
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Contact
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center">
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Privacy Policy
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center">
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Terms of Service
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center">
                  <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-bottom-left">
                    Cookie Policy
                  </span>
                </a>
              </li>
            </ul>
          </motion.div>
        </div>
        
        <motion.div 
          className="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center"
          variants={itemVariants}
        >
          <p className="text-sm text-foreground/50">
            © {currentYear} CPG Matchmaker. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 sm:mt-0">
            <motion.a 
              href="#" 
              className="text-foreground/50 hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <span className="sr-only">Twitter</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </motion.a>
            <motion.a 
              href="#" 
              className="text-foreground/50 hover:text-foreground transition-colors"
              whileHover={{ scale: 1.1 }}
            >
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
