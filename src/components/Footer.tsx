import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, Phone, ArrowUpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer 
      className="bg-card/50 backdrop-blur-sm border-t border-border/50 pt-16 pb-8 relative overflow-hidden"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {/* Enhanced Background Elements */}
      <motion.div 
        className="absolute -bottom-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/10 via-accent/5 to-transparent rounded-full filter blur-[100px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      <motion.div 
        className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-tr from-accent/10 via-primary/5 to-transparent rounded-full filter blur-[100px]"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          {/* Company Info Section */}
          <motion.div className="md:col-span-4" variants={itemVariants}>
            <div className="flex items-center gap-2 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-bold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                CPG Matchmaker
              </span>
            </div>
            <p className="text-base text-foreground/70 mb-6">
              {t('hero-subtitle')}
            </p>
            <div className="space-y-3 mb-6">
              <motion.a 
                href="mailto:contact@cpgmatchmaker.com"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ x: 5 }}
              >
                <Mail size={16} />
                contact@cpgmatchmaker.com
              </motion.a>
              <motion.a 
                href="#"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ x: 5 }}
              >
                <Phone size={16} />
                +1 (555) 123-4567
              </motion.a>
              <motion.a 
                href="#"
                className="flex items-center gap-2 text-sm text-foreground/70 hover:text-foreground transition-colors"
                whileHover={{ x: 5 }}
              >
                <MapPin size={16} />
                123 Innovation Street, Tech City
              </motion.a>
            </div>
            <div className="flex gap-4">
              <motion.a 
                href="#" 
                className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Twitter size={18} />
              </motion.a>
              <motion.a 
                href="#" 
                className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Linkedin size={18} />
              </motion.a>
              <motion.a 
                href="#" 
                className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Github size={18} />
              </motion.a>
            </div>
          </motion.div>

          {/* Quick Links Sections */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6">{t('platform')}</h4>
            <ul className="space-y-3">
              {[
                { key: 'solutions', text: t('solutions') },
                { key: 'products', text: t('products') },
                { key: 'manufacturers', text: t('manufacturers') },
                { key: 'pricing', text: t('pricing') },
                { key: 'integration', text: t('integration', 'Integration') },
              ].map(({ key, text }) => (
                <li key={key}>
                  <Link 
                    to={`/${key.toLowerCase()}`} 
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center group"
                  >
                    <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                      {text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="md:col-span-2" variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6">{t('company-section')}</h4>
            <ul className="space-y-3">
              {[
                { key: 'about-us', text: t('about-us') },
                { key: 'careers', text: t('careers', 'Careers') },
                { key: 'blog', text: t('blog') },
                { key: 'partners', text: t('partners', 'Partners') },
                { key: 'contact-us', text: t('contact-us') },
              ].map(({ key, text }) => (
                <li key={key}>
                  <Link 
                    to={`/${key}`} 
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center group"
                  >
                    <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                      {text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="md:col-span-2" variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6">{t('legal', 'Legal')}</h4>
            <ul className="space-y-3">
              {[
                { key: 'privacy-policy', text: t('privacy-policy') },
                { key: 'terms-of-service', text: t('terms-of-service') },
                { key: 'cookie-policy', text: t('cookie-policy', 'Cookie Policy') },
                { key: 'security', text: t('security', 'Security') },
                { key: 'compliance', text: t('compliance', 'Compliance') },
              ].map(({ key, text }) => (
                <li key={key}>
                  <Link 
                    to={`/${key}`} 
                    className="text-sm text-foreground/70 hover:text-foreground transition-colors inline-flex items-center group"
                  >
                    <span className="relative after:content-[''] after:absolute after:w-full after:scale-x-0 after:h-0.5 after:-bottom-1 after:left-0 after:bg-primary after:origin-bottom-right after:transition-transform after:duration-300 group-hover:after:scale-x-100 group-hover:after:origin-bottom-left">
                      {text}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Newsletter Section */}
          <motion.div className="md:col-span-2" variants={itemVariants}>
            <h4 className="font-semibold text-lg mb-6">{t('stay-updated', 'Stay Updated')}</h4>
            <p className="text-sm text-foreground/70 mb-4">
              {t('newsletter-description', 'Subscribe to our newsletter for the latest updates and insights.')}
            </p>
            <form className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  placeholder={t('enter-email', 'Enter your email')}
                  className="w-full px-4 py-2 rounded-xl bg-foreground/5 border border-border/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
              </div>
              <motion.button
                type="submit"
                className="w-full px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-medium text-sm hover:opacity-90 transition-opacity"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {t('subscribe')}
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          className="pt-8 mt-8 border-t border-border/50 flex flex-col items-center gap-6"
          variants={itemVariants}
        >
          <motion.button
            onClick={scrollToTop}
            className="h-10 w-10 rounded-xl bg-foreground/5 flex items-center justify-center text-foreground/70 hover:text-foreground hover:bg-foreground/10 transition-all"
            whileHover={{ y: -5, scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowUpCircle size={20} />
          </motion.button>
          
          <p className="text-sm text-foreground/50 text-center">
            © {currentYear} CPG Matchmaker. {t('all-rights-reserved')}
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
