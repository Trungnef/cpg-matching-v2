import React, { createContext, useContext, useEffect } from 'react';

interface ScrollContextType {
  hideScrollbars: boolean;
  applyScrollbarClass: (element: HTMLElement) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hideScrollbars = true; // Set to false if you want to show scrollbars
  
  // Apply no-scrollbar class to the root HTML element
  useEffect(() => {
    // Apply to HTML
    const htmlElement = document.documentElement;
    htmlElement.classList.add('no-scrollbar');
    
    // Apply to body
    document.body.classList.add('no-scrollbar');
    
    // Apply to all scrollable elements
    const scrollableElements = document.querySelectorAll('[class*="overflow-"]');
    scrollableElements.forEach((element) => {
      if (element instanceof HTMLElement) {
        element.classList.add('no-scrollbar');
      }
    });
    
    return () => {
      // Cleanup if component unmounts
      htmlElement.classList.remove('no-scrollbar');
      document.body.classList.remove('no-scrollbar');
      scrollableElements.forEach((element) => {
        if (element instanceof HTMLElement) {
          element.classList.remove('no-scrollbar');
        }
      });
    };
  }, []);
  
  // Helper function to apply no-scrollbar class to any element
  const applyScrollbarClass = (element: HTMLElement) => {
    if (hideScrollbars) {
      element.classList.add('no-scrollbar');
    } else {
      element.classList.remove('no-scrollbar');
    }
  };
  
  return (
    <ScrollContext.Provider value={{ hideScrollbars, applyScrollbarClass }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}; 