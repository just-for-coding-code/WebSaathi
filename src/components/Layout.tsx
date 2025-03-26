
import React from 'react';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white">
      <Header />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto">
        {children}
      </main>
      <footer className="w-full border-t border-gray-800 py-6 px-4 sm:px-6 lg:px-8 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400">
            Advanced content analysis for a safer online experience
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">© {new Date().getFullYear()} HarmWatcher</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
