import { useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import SignInForm from "@/components/SignInForm";
import RegisterForm from "@/components/RegisterForm";
import { motion } from "framer-motion";
import { useUser } from "@/contexts/UserContext";
import Footer from "@/components/Footer";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get("type") || "signin";
  const { isAuthenticated } = useUser();

  // Redirect to the proper URL if needed
  useEffect(() => {
    if (type !== "signin" && type !== "register") {
      navigate("/auth?type=signin", { replace: true });
    }
    
    // If user is already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [type, navigate, isAuthenticated]);

  // Page title effect
  useEffect(() => {
    document.title = type === "register" 
      ? "Register - CPG Matchmaker" 
      : "Sign In - CPG Matchmaker";
  }, [type]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-grow pt-24 pb-12 flex items-center justify-center relative">
        {/* Background blur circles */}
        <div className="absolute top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              {type === "signin" ? <SignInForm /> : <RegisterForm />}
            </div>
            
            <div className="order-1 md:order-2 text-center">
              {/* Enhanced Title Animation */}
              <div className="relative mb-8">
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-lg opacity-20 blur"
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  style={{
                    backgroundSize: "200% 200%"
                  }}
                />
                <motion.h1 
                  className="relative text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {type === "register" ? "Join Our Platform" : "Welcome Back"}
                </motion.h1>
                {/* Animated Underline */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "80%" }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: "easeOut"
                  }}
                />
              </div>

              <motion.p 
                className="text-xl text-foreground/70 mb-12 relative max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {type === "register" 
                  ? "Create an account to connect with the perfect partners in the CPG industry."
                  : "Sign in to access your account and continue your journey in the CPG industry."
                }
              </motion.p>
              
              <motion.div 
                className="h-[300px] w-full relative rounded-2xl overflow-hidden shadow-xl"
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
              
              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-foreground/60">
                  {type === "register" 
                    ? "Already have an account?" 
                    : "Don't have an account yet?"
                  }
                  {' '}
                  <Link 
                    to={type === "register" ? "/auth?type=signin" : "/auth?type=register"}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {type === "register" ? "Sign in" : "Create one"}
                  </Link>
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
