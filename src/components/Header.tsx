
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldCheck, Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import CardSpotlight from './CardSpotlight';

const Header: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
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
    { name: 'About', href: '/#about' },
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ease-in-out w-full ${
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
                <div className="relative h-10 w-10 flex items-center justify-center">
                  <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse-soft"></div>
                  <ShieldCheck className="h-6 w-6 text-primary relative" />
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
                className="text-sm text-foreground/80 hover:text-primary transition-smooth"
              >
                {item.name}
              </a>
            ))}
            {user && (
              <Link 
                to="/dashboard" 
                className="text-sm text-foreground/80 hover:text-primary transition-smooth"
              >
                Dashboard
              </Link>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-primary/20 text-primary">{user.email?.[0].toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-900/90 backdrop-blur-lg border border-gray-700">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm text-white">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild className="focus:bg-gray-800">
                    <Link to="/dashboard" className="cursor-pointer flex w-full items-center text-gray-300 hover:text-white">
                      <User className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    onSelect={handleSignOut}
                    className="cursor-pointer text-gray-300 hover:text-white focus:bg-gray-800"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link to="/auth" className="hidden md:flex h-9 px-4 py-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary text-sm font-medium transition-smooth">
                  Sign In
                </Link>
                <CardSpotlight
                  containerClassName="hidden md:block"
                  className="p-0"
                  spotlightColor="rgba(155, 135, 245, 0.4)"
                >
                  <Link to="/auth" className="inline-flex h-9 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium shadow-subtle hover:shadow-elevation transition-all duration-300 transform hover:-translate-y-0.5">
                    Get Started
                  </Link>
                </CardSpotlight>
              </>
            )}
            
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
                      className="text-foreground hover:text-primary text-lg font-medium transition-colors"
                    >
                      {item.name}
                    </a>
                  ))}
                  {user && (
                    <Link 
                      to="/dashboard" 
                      className="text-foreground hover:text-primary text-lg font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <div className="pt-6">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <Avatar className="h-10 w-10 mr-3 bg-primary/20">
                            <AvatarFallback className="text-primary">{user.email?.[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-white">{user.email}</p>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-white" onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log Out
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col space-y-3">
                        <Link to="/auth">
                          <Button variant="outline" className="w-full border-gray-700 hover:bg-gray-800 text-white">Sign In</Button>
                        </Link>
                        <Link to="/auth">
                          <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                        </Link>
                      </div>
                    )}
                  </div>
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
