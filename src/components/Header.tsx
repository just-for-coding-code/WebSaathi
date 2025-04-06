
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu } from 'lucide-react';
import { 
  Sheet, SheetContent, SheetTrigger 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import CardSpotlight from './CardSpotlight';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
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

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { name: 'Features', href: '/#features' },
    { name: 'Harm Categories', href: '/#categories' },
    { name: 'Extension', href: '/#extension' },
    { name: 'About', href: '/#about' }
  ];

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-500 ease-in-out w-full ${
        scrolled 
          ? "py-3 bg-background/80 backdrop-blur-md border-b border-gray-800/30 shadow-subtle" 
          : "py-5 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CardSpotlight
              containerClassName="relative rounded-full"
              className="p-0"
              spotlightColor="rgba(155, 135, 245, 0.4)"
            >
              <Link to="/" className="flex items-center space-x-2">
                <div className="relative h-10 w-10 flex items-center justify-center group">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-soft group-hover:bg-primary/20 transition-colors duration-300"></div>
                  <ShieldCheck className="h-6 w-6 text-primary relative group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-primary">
                  WebSaathi
                </span>
              </Link>
            </CardSpotlight>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                className="text-sm text-foreground/80 hover:text-primary transition-all duration-300 flex items-center relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:origin-bottom-left hover:after:scale-x-100"
              >
                {item.name}
              </a>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-gray-800/30">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="py-16 bg-gray-900/95 backdrop-blur-lg border-gray-800">
                <div className="flex flex-col space-y-6">
                  {navItems.map((item) => (
                    <a 
                      key={item.name}
                      href={item.href}
                      className="text-foreground hover:text-primary text-lg font-medium transition-colors flex items-center"
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
