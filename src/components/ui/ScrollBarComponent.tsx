import React, { useEffect, useRef } from 'react';
import { useScroll } from '@/contexts/ScrollContext';

interface ScrollBarComponentProps {
  children: React.ReactNode;
  className?: string;
  hideScrollbar?: boolean; // Override global setting if needed
}

/**
 * A component that wraps its children and applies scrollbar styling
 * This can be used to wrap any scrollable content in the application
 */
const ScrollBarComponent: React.FC<ScrollBarComponentProps> = ({
  children,
  className = '',
  hideScrollbar,
}) => {
  const { hideScrollbars: globalHideScrollbars } = useScroll();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Determine if scrollbar should be hidden
  const shouldHideScrollbar = hideScrollbar !== undefined ? hideScrollbar : globalHideScrollbars;
  
  // Generate className based on conditions
  const scrollbarClass = shouldHideScrollbar ? 'no-scrollbar' : 'custom-scrollbar';
  
  // Apply scrollbar class to element
  useEffect(() => {
    if (containerRef.current) {
      if (shouldHideScrollbar) {
        containerRef.current.classList.add('no-scrollbar');
        containerRef.current.classList.remove('custom-scrollbar');
      } else {
        containerRef.current.classList.add('custom-scrollbar');
        containerRef.current.classList.remove('no-scrollbar');
      }
    }
  }, [shouldHideScrollbar]);
  
  return (
    <div 
      ref={containerRef} 
      className={`${scrollbarClass} ${className}`}
    >
      {children}
    </div>
  );
};

export default ScrollBarComponent; 