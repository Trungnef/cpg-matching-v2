import { useEffect, useRef } from 'react';
import { useScroll } from '@/contexts/ScrollContext';

/**
 * A hook that manages scrollbar styling for a ref element
 * @param initialHidden Whether the scrollbar should be hidden initially (defaults to global setting)
 * @returns An object with the ref and functions to control scrollbar visibility
 */
export const useScrollbar = <T extends HTMLElement>(initialHidden?: boolean) => {
  const ref = useRef<T>(null);
  const { hideScrollbars: globalHideScrollbars, applyScrollbarClass } = useScroll();
  
  // Determine if scrollbar should be hidden
  const isHidden = initialHidden !== undefined ? initialHidden : globalHideScrollbars;
  
  // Apply scrollbar class to element on mount
  useEffect(() => {
    if (ref.current) {
      if (isHidden) {
        ref.current.classList.add('no-scrollbar');
        ref.current.classList.remove('custom-scrollbar');
      } else {
        ref.current.classList.add('custom-scrollbar');
        ref.current.classList.remove('no-scrollbar');
      }
    }
  }, [isHidden]);
  
  // Function to hide scrollbar
  const hideScrollbar = () => {
    if (ref.current) {
      ref.current.classList.add('no-scrollbar');
      ref.current.classList.remove('custom-scrollbar');
    }
  };
  
  // Function to show styled scrollbar
  const showScrollbar = () => {
    if (ref.current) {
      ref.current.classList.add('custom-scrollbar');
      ref.current.classList.remove('no-scrollbar');
    }
  };
  
  // Function to toggle scrollbar visibility
  const toggleScrollbar = () => {
    if (ref.current) {
      if (ref.current.classList.contains('no-scrollbar')) {
        showScrollbar();
      } else {
        hideScrollbar();
      }
    }
  };
  
  return {
    ref,
    hideScrollbar,
    showScrollbar,
    toggleScrollbar,
    isScrollbarHidden: isHidden
  };
}; 