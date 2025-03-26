
import React, { useEffect, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ease-in-out w-full ${
        scrolled 
          ? "py-3 bg-background/80 backdrop-blur-md shadow-subtle" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative h-10 w-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-soft"></div>
              <ShieldCheck className="h-6 w-6 text-primary relative" />
            </div>
            <span className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">
              HarmWatcher
            </span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            <a 
              href="#features" 
              className="text-sm text-foreground/80 hover:text-foreground transition-smooth"
            >
              Features
            </a>
            <a 
              href="#categories" 
              className="text-sm text-foreground/80 hover:text-foreground transition-smooth"
            >
              Harm Categories
            </a>
            <a 
              href="#about" 
              className="text-sm text-foreground/80 hover:text-foreground transition-smooth"
            >
              About
            </a>
          </nav>
          
          <div className="flex items-center space-x-4">
            <button className="hidden md:flex h-9 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-smooth">
              Documentation
            </button>
            <button className="h-9 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-subtle hover:shadow-elevation transition-all duration-300 transform hover:-translate-y-0.5">
              Start Analyzing
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
