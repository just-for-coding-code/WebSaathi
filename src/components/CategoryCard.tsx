
import React from 'react';
import { HelpCircle, MessageSquareX, AlertTriangle, UserX, EyeOff, ShieldAlert, ShieldCheck } from 'lucide-react';
import { HarmCategory, getCategoryInfo } from '../utils/analyzeContent';

interface CategoryCardProps {
  category: HarmCategory;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
  category, 
  isActive = false,
  onClick 
}) => {
  const info = getCategoryInfo(category);
  
  const getIcon = () => {
    switch (info.icon) {
      case 'MessageSquareX': return <MessageSquareX className="h-5 w-5" />;
      case 'AlertTriangle': return <AlertTriangle className="h-5 w-5" />;
      case 'UserX': return <UserX className="h-5 w-5" />;
      case 'EyeOff': return <EyeOff className="h-5 w-5" />;
      case 'ShieldAlert': return <ShieldAlert className="h-5 w-5" />;
      case 'ShieldCheck': return <ShieldCheck className="h-5 w-5" />;
      default: return <HelpCircle className="h-5 w-5" />;
    }
  };

  return (
    <div 
      className={`relative group rounded-xl p-4 transition-all duration-300 backdrop-blur-sm
        ${isActive 
          ? `bg-${info.color}/10 ring-1 ring-${info.color}/30 shadow-elevation` 
          : 'bg-gray-800/50 hover:bg-gray-800/80 hover:shadow-subtle cursor-pointer'
        }`}
      onClick={onClick}
    >
      <div className="absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
        style={{ 
          background: `radial-gradient(400px circle at var(--x, 0px) var(--y, 0px), ${info.color === 'harm-safe' ? '#27AE6020' : `#${info.color.substring(5)}20`}, transparent 40%)` 
        }} 
      />
      
      <div className="flex items-start space-x-3">
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-${info.color} bg-${info.color}/10`}>
          {getIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-white truncate">{info.title}</h3>
          <p className="mt-1 text-xs text-gray-400 text-balance line-clamp-2">
            {info.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
