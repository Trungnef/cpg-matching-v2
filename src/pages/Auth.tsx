
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import RegistrationForm from "@/components/RegistrationForm";
import ThreeScene from "@/components/ThreeScene";
import { useUser } from "@/contexts/UserContext";

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
    <div className="min-h-screen">
      <Navbar />
      
      <div className="min-h-screen pt-24 pb-12 flex items-center justify-center relative">
        {/* Background blur circles */}
        <div className="absolute top-40 -left-40 w-80 h-80 bg-primary/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        <div className="absolute bottom-20 -right-40 w-80 h-80 bg-accent/30 rounded-full filter blur-3xl opacity-30 animate-pulse-slow" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <RegistrationForm />
            </div>
            
            <div className="order-1 md:order-2 text-center md:text-left">
              <h1 className="text-4xl font-bold mb-4">
                {type === "register" ? "Join Our Platform" : "Welcome Back"}
              </h1>
              <p className="text-lg text-foreground/70 mb-8">
                {type === "register" 
                  ? "Create an account to connect with the perfect partners in the CPG industry."
                  : "Sign in to access your account and continue your journey in the CPG industry."
                }
              </p>
              
              <div className="h-[300px] w-full relative">
                <div className="absolute inset-0 glass rounded-xl overflow-hidden">
                  <ThreeScene />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
