
import React from 'react';
import Header from './Header';
import { Github } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white relative">
      {/* Background decorative elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(155,135,245,0.05),transparent_50%)] absolute"></div>
        <div className="absolute top-20 right-0 w-80 h-80 bg-blue-500/5 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"></div>
        <div className="absolute bottom-40 left-20 w-72 h-72 bg-primary/5 rounded-full filter blur-3xl opacity-20 animate-pulse-soft"></div>
        
        {/* Additional decorative elements for a more finished look */}
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-purple-500/5 rounded-full filter blur-2xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/3 w-48 h-48 bg-blue-400/5 rounded-full filter blur-2xl opacity-20"></div>
      </div>
      
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {children}
      </main>
      <footer className="w-full border-t border-gray-800 py-6 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            WebSaathi: Advanced content analysis for a safer online experience
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href="https://github.com/websaathi/content-guard" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors flex items-center gap-2 group"
            >
              <Github className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              <span className="text-sm">GitHub</span>
            </a>
            <span className="text-sm text-gray-400">© {new Date().getFullYear()} WebSaathi</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
