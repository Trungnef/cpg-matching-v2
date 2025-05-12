import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Layers, Network, BarChart3, Lock, Sparkles } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer = {
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const Solutions = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "Solutions - CPG Matchmaker";
  }, []);

  const handleBookDemo = () => {
    navigate("/book-demo");
  };

  const handleSignIn = () => {
    navigate("/signin", { 
      state: { 
        from: "/solutions",
        message: "Sign in to get started with CPG Matchmaker" 
      } 
    });
  };

  const handleLearnMore = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <div className="pt-32 pb-20 relative">
        {/* Enhanced background animations */}
        <motion.div 
          className="absolute top-40 -left-40 w-80 h-80 bg-primary/20 dark:bg-primary/30 rounded-full filter blur-3xl opacity-70 dark:opacity-80"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.15, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/20 dark:bg-accent/30 rounded-full filter blur-3xl opacity-70 dark:opacity-80"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.1, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                backgroundPosition: ["0%", "100%"]
              }}
              transition={{ 
                delay: 0.2, 
                duration: 0.6,
                backgroundPosition: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "mirror"
                }
              }}
            >
              {t('solutions-title')}
            </motion.h1>
            <motion.p 
              className="text-xl text-foreground/70 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              {t('solutions-subtitle')}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4 justify-center"
            >
              <Button 
                size="lg" 
                className="rounded-full px-8 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300"
                onClick={handleBookDemo}
              >
                {t('book-demo')}
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-full px-8 hover:bg-primary/5 transition-all duration-300"
                onClick={() => handleLearnMore("/features")}
              >
                {t('solutions-learn-more')}
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Solutions Tabs */}
      <div className="py-16 bg-secondary/10 dark:bg-secondary/20 relative">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="manufacturers" className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
            <TabsList className="grid grid-cols-3 w-full mb-8">
                <TabsTrigger value="manufacturers" className="data-[state=active]:bg-primary/20 transition-all duration-300">{t('solutions-for-manufacturers')}</TabsTrigger>
                <TabsTrigger value="brands" className="data-[state=active]:bg-primary/20 transition-all duration-300">{t('solutions-for-brands')}</TabsTrigger>
                <TabsTrigger value="retailers" className="data-[state=active]:bg-primary/20 transition-all duration-300">{t('solutions-for-retailers')}</TabsTrigger>
            </TabsList>
            </motion.div>
            
            {/* Manufacturers Tab */}
            <TabsContent value="manufacturers" className="space-y-8">
              <motion.div 
                className="grid md:grid-cols-2 gap-8 items-center"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeInUp}>
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('expand-network')}</h2>
                  <p className="text-foreground/70 mb-6">
                    {t('manufacturers-connect')}
                  </p>
                  <motion.ul className="space-y-3" variants={staggerContainer}>
                    {[
                      { icon: <Layers className="h-5 w-5" />, text: t('showcase-capabilities') },
                      { icon: <BrainCircuit className="h-5 w-5" />, text: t('ai-driven-matches') },
                      { icon: <Network className="h-5 w-5" />, text: t('expand-qualified-leads') }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300"
                        variants={fadeInUp}
                      >
                      <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                          {item.icon}
                      </div>
                        <span>{item.text}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <motion.div 
                    className="mt-6"
                    variants={fadeInUp}
                  >
                    <Button
                      onClick={() => handleLearnMore("/manufacturers")}
                      className="rounded-full px-6 hover:shadow-lg transition-all duration-300"
                    >
                      {t('solutions-learn-more')}
                    </Button>
                  </motion.div>
                </motion.div>
                <motion.div 
                  className="rounded-xl p-8 h-[400px] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background border border-primary/10 dark:border-primary/20 shadow-sm dark:shadow-primary/10 dark:bg-gradient-to-br dark:from-background/80 dark:via-primary/10 dark:to-background/80 hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative"
                    >
                      <BrainCircuit className="h-20 w-20 text-primary mx-auto mb-6 relative z-10" />
                      <motion.div 
                        className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-xl"
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-foreground">{t('intelligent-matching')}</h3>
                    <p className="text-foreground/70">
                      {t('ai-analyzes')}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Case Studies */}
              <motion.div 
                className="pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-6">{t('solutions-success-stories')}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    transition={{ duration: 0.2 }}
                    onClick={() => handleLearnMore("/case-studies/naturepack")}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 dark:border-primary/20">
                    <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('nature-pack')}</CardTitle>
                      <CardDescription>{t('sustainable-packaging')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        {t('nature-pack-story')}
                      </p>
                    </CardContent>
                  </Card>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    transition={{ duration: 0.2 }}
                    onClick={() => handleLearnMore("/case-studies/purefoods")}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 dark:border-primary/20">
                    <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('pure-foods')}</CardTitle>
                      <CardDescription>{t('organic-food')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/70">
                        {t('pure-foods-story')}
                      </p>
                    </CardContent>
                  </Card>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Brands Tab */}
            <TabsContent value="brands" className="space-y-8">
              <motion.div 
                className="grid md:grid-cols-2 gap-8 items-center"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeInUp}>
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('find-manufacturing')}</h2>
                  <p className="text-foreground/70 mb-6">
                    {t('discover-manufacturers')}
                  </p>
                  <motion.ul className="space-y-3" variants={staggerContainer}>
                    {[
                      { icon: <BarChart3 className="h-5 w-5" />, text: t('compare-metrics') },
                      { icon: <Lock className="h-5 w-5" />, text: t('verify-certifications') },
                      { icon: <Sparkles className="h-5 w-5" />, text: t('intelligent-recommendations') }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300"
                        variants={fadeInUp}
                      >
                        <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span>{item.text}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
                <motion.div 
                  className="rounded-xl p-8 h-[400px] flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-background border border-accent/10 dark:border-accent/20 shadow-sm dark:shadow-accent/10 dark:bg-gradient-to-br dark:from-background/80 dark:via-accent/10 dark:to-background/80 hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative"
                    >
                      <Sparkles className="h-20 w-20 text-accent mx-auto mb-6 relative z-10" />
                      <motion.div 
                        className="absolute inset-0 bg-accent/10 dark:bg-accent/20 rounded-full blur-xl"
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-foreground">{t('smart-discovery')}</h3>
                    <p className="text-foreground/70">
                      {t('filter-manufacturers')}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Case Studies */}
              <motion.div 
                className="pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-6">{t('solutions-success-stories')}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-accent/10 dark:border-accent/20">
                      <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">{t('green-life')}</CardTitle>
                        <CardDescription>{t('plant-based')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/70">
                          {t('green-life-story')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-accent/10 dark:border-accent/20">
                      <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">{t('refresh-beverages')}</CardTitle>
                        <CardDescription>{t('functional-drink')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/70">
                          {t('refresh-beverages-story')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Retailers Tab */}
            <TabsContent value="retailers" className="space-y-8">
              <motion.div 
                className="grid md:grid-cols-2 gap-8 items-center"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={fadeInUp}>
                  <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent to-primary">{t('discover-products')}</h2>
                  <p className="text-foreground/70 mb-6">
                    {t('find-products')}
                  </p>
                  <motion.ul className="space-y-3" variants={staggerContainer}>
                    {[
                      { icon: <Layers className="h-5 w-5" />, text: t('browse-product-specs') },
                      { icon: <Network className="h-5 w-5" />, text: t('connect-brands-retail') },
                      { icon: <BarChart3 className="h-5 w-5" />, text: t('track-trends') }
                    ].map((item, index) => (
                      <motion.li 
                        key={index}
                        className="flex items-start p-3 rounded-lg hover:bg-primary/5 transition-colors duration-300"
                        variants={fadeInUp}
                      >
                        <div className="mr-3 h-6 w-6 text-primary flex items-center justify-center">
                          {item.icon}
                        </div>
                        <span>{item.text}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                </motion.div>
                <motion.div 
                  className="rounded-xl p-8 h-[400px] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background border border-primary/10 dark:border-primary/20 shadow-sm dark:shadow-primary/10 dark:bg-gradient-to-br dark:from-background/80 dark:via-primary/10 dark:to-background/80 hover:shadow-xl transition-all duration-300"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="text-center">
                    <motion.div
                      animate={{
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="relative"
                    >
                      <Network className="h-20 w-20 text-primary mx-auto mb-6 relative z-10" />
                      <motion.div 
                        className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full blur-xl"
                        animate={{
                          scale: [0.8, 1.2, 0.8],
                          opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-2 text-foreground">{t('product-discovery')}</h3>
                    <p className="text-foreground/70">
                      {t('stay-ahead')}
                    </p>
                  </div>
                </motion.div>
              </motion.div>
              
              {/* Case Studies */}
              <motion.div 
                className="pt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-2xl font-bold mb-6">{t('solutions-success-stories')}</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 dark:border-primary/20">
                      <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('natural-market')}</CardTitle>
                        <CardDescription>{t('health-food')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/70">
                          {t('natural-market-story')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    transition={{ duration: 0.2 }}
                    className="cursor-pointer"
                  >
                    <Card className="hover:shadow-lg transition-all duration-300 border-primary/10 dark:border-primary/20">
                      <CardHeader>
                        <CardTitle className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">{t('urban-grocers')}</CardTitle>
                        <CardDescription>{t('boutique-grocery')}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-foreground/70">
                          {t('urban-grocers-story')}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* CTA Section */}
      <motion.div 
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-4">
          <motion.div 
            className="p-8 md:p-12 rounded-2xl max-w-4xl mx-auto text-center bg-gradient-to-br from-background via-primary/5 to-background dark:from-background/90 dark:via-primary/10 dark:to-background/90 border border-primary/10 dark:border-primary/20 shadow-lg dark:shadow-primary/10"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.4 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto]"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ 
                delay: 0.2,
                backgroundPosition: {
                  duration: 8,
                  repeat: Infinity,
                  ease: "linear",
                  repeatType: "mirror"
                }
              }}
              animate={{
                backgroundPosition: ["0%", "100%"]
              }}
            >
              {t('transform-business')}
            </motion.h2>
            <motion.p 
              className="text-lg text-foreground/70 mb-8 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              {t('join-solutions-platform')}
            </motion.p>
            <motion.div 
              className="flex flex-wrap justify-center gap-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="rounded-full px-8 bg-gradient-to-r from-primary to-accent hover:shadow-lg transition-all duration-300 group"
                onClick={handleSignIn}
              >
                <motion.span 
                  className="group-hover:translate-x-1 transition-transform"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {t('solutions-get-started')}
                </motion.span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="rounded-full px-8 hover:bg-primary/5 transition-all duration-300 group"
                onClick={handleBookDemo}
              >
                <motion.span 
                  className="group-hover:translate-x-1 transition-transform"
                  whileHover={{ x: 2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {t('schedule-demo')}
                </motion.span>
              </Button>
            </motion.div>
            <motion.p
              className="text-sm text-muted-foreground mt-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              {t('already-account')}{" "}
              <Link 
                to="/signin" 
                className="text-primary hover:underline hover:text-primary/90 transition-colors"
              >
                {t('sign-in-here')}
              </Link>
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Solutions;
