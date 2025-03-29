
import React from 'react';
import { cn } from '@/lib/utils';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';
import { Button, ButtonProps } from '@/components/ui/button';

type GlowingButtonProps = ButtonProps & {
  glowColor?: string;
  hoverScale?: boolean;
  pulseEffect?: boolean;
  movingBorder?: boolean;
  className?: string;
  children: React.ReactNode;
  borderRadius?: string;
};

const GlowingButton = ({
  glowColor = "rgba(155, 135, 245, 0.5)",
  hoverScale = true,
  pulseEffect = false,
  movingBorder = false,
  borderRadius = "0.75rem",
  className,
  children,
  ...props
}: GlowingButtonProps) => {
  if (movingBorder) {
    return (
      <MovingBorderButton
        borderRadius={borderRadius}
        className={cn(
          "relative z-10 transition-all duration-300",
          hoverScale && "group-hover:scale-105",
          className
        )}
        {...props}
      >
        {children}
      </MovingBorderButton>
    );
  }

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
