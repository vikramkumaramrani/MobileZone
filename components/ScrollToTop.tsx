
import React, { useState, useEffect } from 'react';
import { Icons } from '../constants';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.pageYOffset > 400) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-[100]">
      <button
        type="button"
        onClick={scrollToTop}
        className={`
          p-4 rounded-full bg-indigo-600 text-white shadow-2xl shadow-indigo-200 
          transition-all duration-300 transform 
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-50 pointer-events-none'}
          hover:bg-indigo-700 hover:-translate-y-1 active:scale-95
        `}
        aria-label="Scroll to top"
      >
        <Icons.ArrowUp />
      </button>
    </div>
  );
};

export default ScrollToTop;
