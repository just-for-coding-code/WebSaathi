
import React from 'react';
import { cn } from '@/lib/utils';
import { Button, ButtonProps } from '@/components/ui/button';

type GlowingButtonProps = ButtonProps & {
  glowColor?: string;
  hoverScale?: boolean;
  pulseEffect?: boolean;
  className?: string;
  children: React.ReactNode;
};

const GlowingButton = ({
  glowColor = "rgba(155, 135, 245, 0.5)",
  hoverScale = true,
  pulseEffect = false,
  className,
  children,
  ...props
}: GlowingButtonProps) => {
  return (
    <div className="relative group">
      {/* Glow effect */}
      <div
        className={cn(
          "absolute -inset-1 rounded-full opacity-70 blur-lg transition-all duration-300 group-hover:opacity-100",
          pulseEffect && "animate-pulse-soft",
          hoverScale && "group-hover:scale-110 group-hover:-inset-1.5"
        )}
        style={{ background: glowColor }}
      />
      <Button
        className={cn(
          "relative z-10 transition-all duration-300",
          hoverScale && "group-hover:scale-105",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    </div>
  );
};

export default GlowingButton;
