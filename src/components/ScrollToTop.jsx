// src/components/ScrollToTop.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  // Get the current location object.
  const { pathname } = useLocation();

  // The effect runs every time the pathname changes.
  useEffect(() => {
    // Instantly scroll the page to the top.
    window.scrollTo(0, 0);
    
    // For smooth scrolling, replace the line above with:
    // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [pathname]); // Dependency array: effect re-runs when pathname changes.

  // This component doesn't render anything to the DOM.
  return null;
}

export default ScrollToTop;