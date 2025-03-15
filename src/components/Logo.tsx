
import React from 'react';
import { Scissors } from 'lucide-react';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  withText?: boolean;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ 
  size = 'medium', 
  withText = true,
  className = ''
}) => {
  const sizeClasses = {
    small: 'text-xl',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="relative">
        <Scissors className={`text-salon-500 ${sizeClasses[size]}`} />
        <span className="absolute top-0 right-0 w-2 h-2 bg-salon-300 rounded-full animate-pulse-gentle"></span>
      </div>
      
      {withText && (
        <span className={`font-display font-bold ${sizeClasses[size]}`}>
          Salão<span className="text-salon-500">Zap</span>
        </span>
      )}
    </div>
  );
};

export default Logo;
