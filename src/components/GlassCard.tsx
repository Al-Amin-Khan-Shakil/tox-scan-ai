import React, { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = React.memo(({ 
  children, 
  className = '', 
  hover = true 
}) => {
  return (
    <div className={`
      backdrop-blur-md bg-white/10 border border-white/20 rounded-xl
      ${hover ? 'hover:bg-white/15 hover:border-white/30 transition-all duration-300 transform hover:scale-[1.02]' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
});

export default GlassCard;