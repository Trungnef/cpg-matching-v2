
import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SearchSection from "@/components/SearchSection";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    document.title = "CPG Matchmaker - AI-Powered Partner Matching";
    
    // Add smooth scrolling behavior
    const handleScroll = () => {
      const elements = document.querySelectorAll('.motion-item');
      elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight * 0.85;
        
        if (isVisible) {
          el.classList.add('visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on load
    handleScroll();
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section with 3D effects */}
      <Hero />
      
      {/* Search Section with improved positioning */}
      <div className="container mx-auto px-4 -mt-20 relative z-20 mb-12">
        <SearchSection />
      </div>
      
      {/* How It Works with animations */}
      <HowItWorks />
      
      {/* Testimonials Section */}
      <Testimonials />
      
      {/* Footer moved to a separate component */}
      <Footer />
    </div>
  );
};

export default Index;
