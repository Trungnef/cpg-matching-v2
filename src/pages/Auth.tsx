import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SignInForm from "@/components/SignInForm";
import RegisterForm from "@/components/RegisterForm";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import Footer from "@/components/Footer";
import AnimatedTitle from "@/components/ui/animated-title";
import { Users, ShieldCheck, Globe2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(searchParams.get("type") === "register");
  const { isAuthenticated } = useUser();

  // Redirect to the proper URL if needed
  useEffect(() => {
    if (searchParams.get("type") !== "signin" && searchParams.get("type") !== "register") {
      navigate("/auth?type=signin", { replace: true });
    }
    
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [searchParams, navigate, isAuthenticated]);

  // Page title effect
  useEffect(() => {
    document.title = isRegister ? t('register-title', "Register - CPG Matchmaker") : t('sign-in-title', "Sign In - CPG Matchmaker");
  }, [isRegister, t]);

  useEffect(() => {
    setIsRegister(searchParams.get("type") === "register");
  }, [searchParams]);

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      
      <div className="flex-grow pt-16 pb-12 flex flex-col items-center justify-start relative overflow-x-hidden">
        {/* Background blur circles */}
        <div className="absolute top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        
        <div className="container mx-auto px-4">
          {/* Main Title Section */}
          <div className="mb-16">
            <AnimatedTitle
              title={isRegister ? t('join-platform', "Join Our Platform") : t('welcome-back', "Welcome Back!")}
              subtitle={
                isRegister
                  ? t('create-account-description', "Create your account and start connecting with CPG industry professionals")
                  : t('sign-in-description', "Sign in to your account and continue your journey")
              }
              size="xl"
              className="relative z-10"
            />
            </div>
            
          {/* Content Grid */}
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
            {/* Illustration Section */}
            <div className="order-1">
              <motion.div 
                className="h-[400px] w-full relative rounded-2xl overflow-hidden shadow-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {/* Modern Abstract Background */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 20% 30%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%),
                      linear-gradient(45deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)
                    `
                  }}
                />

                {/* Center Icon */}
                <motion.div 
                  className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 shadow-xl flex items-center justify-center backdrop-blur-sm z-10"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    scale: {
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    },
                    rotate: {
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }
                  }}
                >
                  <span className="text-2xl">📦</span>
                </motion.div>

                {/* Top Icon */}
                <motion.div 
                  className="absolute top-[15%] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
                  animate={{ 
                    y: [0, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-xl">💄</span>
                </motion.div>

                {/* Right Icon */}
                <motion.div 
                  className="absolute top-1/2 right-[15%] -translate-y-1/2 w-14 h-14 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
                  animate={{ 
                    x: [0, 10, 0],
                    scale: [1, 1.08, 1]
                  }}
                  transition={{ 
                    duration: 4.5,
                    repeat: Infinity,
                    delay: 0.5,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-2xl">🥤</span>
                </motion.div>

                {/* Bottom Icon */}
                <motion.div 
                  className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
                  animate={{ 
                    y: [0, 10, 0],
                    scale: [1, 1.12, 1]
                  }}
                  transition={{ 
                    duration: 4.8,
                    repeat: Infinity,
                    delay: 1,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-xl">🧴</span>
                </motion.div>

                {/* Left Icon */}
                <motion.div 
                  className="absolute top-1/2 left-[15%] -translate-y-1/2 w-13 h-13 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
                  animate={{ 
                    x: [0, -10, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ 
                    duration: 5.2,
                    repeat: Infinity,
                    delay: 1.5,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-xl">🍿</span>
                </motion.div>

                {/* Top Right Icon */}
                <motion.div 
                  className="absolute top-[25%] right-[25%] w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
                  animate={{ 
                    y: [0, -8, 0],
                    x: [0, 8, 0],
                    scale: [1, 1.08, 1]
                  }}
                  transition={{ 
                    duration: 4.2,
                    repeat: Infinity,
                    delay: 0.8,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-lg">🧃</span>
                </motion.div>

                {/* Bottom Right Icon */}
                <motion.div 
                  className="absolute bottom-[25%] right-[25%] w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
                  animate={{ 
                    y: [0, 8, 0],
                    x: [0, 8, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4.5,
                    repeat: Infinity,
                    delay: 1.2,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-xl">💊</span>
                </motion.div>
                
                {/* Bottom Left Icon */}
                <motion.div 
                  className="absolute bottom-[25%] left-[25%] w-12 h-12 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
                  animate={{ 
                    y: [0, 8, 0],
                    x: [0, -8, 0],
                    scale: [1, 1.12, 1]
                  }}
                  transition={{ 
                    duration: 4.8,
                    repeat: Infinity,
                    delay: 1.8,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-xl">🧼</span>
                </motion.div>
                
                {/* Top Left Icon */}
                <motion.div 
                  className="absolute top-[25%] left-[25%] w-11 h-11 rounded-full bg-white/90 shadow-lg flex items-center justify-center backdrop-blur-sm"
                  animate={{ 
                    y: [0, -8, 0],
                    x: [0, -8, 0],
                    scale: [1, 1.15, 1]
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    delay: 2,
                    ease: "easeInOut"
                  }}
                >
                  <span className="text-lg">🥫</span>
                </motion.div>

                {/* Connecting Lines */}
                <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.1 }}>
                  <motion.path
                    d="M 50% 15% L 50% 50% L 85% 50% L 50% 50% L 75% 75% L 50% 50% L 50% 85% L 50% 50% L 25% 75% L 50% 50% L 15% 50% L 50% 50% L 25% 25%"
                    stroke="var(--primary)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="10,10"
                    animate={{
                      strokeDashoffset: [0, -100]
                    }}
                    transition={{
                      duration: 20,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                </svg>

                {/* Center Glow */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-[300px] h-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: "radial-gradient(circle, var(--primary) 0%, transparent 70%)",
                    opacity: 0.1,
                    filter: "blur(40px)"
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.15, 0.1]
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>

              {/* Stats Section */}
              <motion.div
                className="mt-8 grid grid-cols-3 gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Active Users */}
                <motion.div
                  className="flex flex-col items-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Users className="w-5 h-5 text-primary" />
                  </motion.div>
                  <motion.span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    10K+
                  </motion.span>
                  <span className="text-sm text-muted-foreground mt-1">{t('active-users', "Active Users")}</span>
                </motion.div>

                {/* Secure Platform */}
                <motion.div
                  className="flex flex-col items-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                  >
                    <ShieldCheck className="w-5 h-5 text-primary" />
                  </motion.div>
                  <motion.span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    100%
                  </motion.span>
                  <span className="text-sm text-muted-foreground mt-1">{t('secure-platform', "Secure Platform")}</span>
                </motion.div>

                {/* Global Reach */}
                <motion.div
                  className="flex flex-col items-center p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-primary/10"
                  whileHover={{ scale: 1.02, y: -2 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <motion.div
                    className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2"
                    animate={{
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.6
                    }}
                  >
                    <Globe2 className="w-5 h-5 text-primary" />
                  </motion.div>
                  <motion.span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    50+
                  </motion.span>
                  <span className="text-sm text-muted-foreground mt-1">{t('countries', "Countries")}</span>
                </motion.div>
              </motion.div>
              
              {/* Decorative Line */}
              <motion.div
                className="mt-6 h-[1px] w-full bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />
            </div>

            {/* Form Section */}
            <div className="order-2">
              <motion.div
                className="flex justify-center w-full"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {isRegister ? <RegisterForm /> : <SignInForm />}
              </motion.div>

              {/* Switch Form Type */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <p className="text-muted-foreground">
                  {isRegister ? t('already-have-account', "Already have an account?") : t('dont-have-account', "Don't have an account?")}
                  {" "}
                  <motion.button
                    className="text-primary hover:text-accent transition-colors"
                    onClick={() => setIsRegister(!isRegister)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isRegister ? t('sign-in', "Sign In") : t('register', "Register")}
                  </motion.button>
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Auth;
