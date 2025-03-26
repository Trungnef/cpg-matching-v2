import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProfileSetup from "@/components/ProfileSetup";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const ProfileSetupPage = () => {
  const { t } = useTranslation();

  // Page title effect
  useEffect(() => {
    document.title = t('profile-setup-title', "Complete Your Profile - CPG Matchmaker");
  }, [t]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      
      <div className="flex-grow pt-16 pb-12 flex flex-col items-center justify-start relative overflow-x-hidden">
        {/* Background blur circles */}
        <div className="absolute top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        
        <div className="container mx-auto px-4 py-8">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold">{t('complete-your-profile', 'Complete Your Profile')}</h1>
              <p className="text-muted-foreground mt-2">
                {t('profile-setup-description', 'Tell us more about your business to get started')}
              </p>
            </div>
            
            <ProfileSetup />
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProfileSetupPage; 