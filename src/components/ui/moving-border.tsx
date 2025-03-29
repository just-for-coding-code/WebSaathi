
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button as BaseButton, ButtonProps as BaseButtonProps } from "@/components/ui/button";

export interface ButtonProps extends BaseButtonProps {
  borderRadius?: string;
  children: React.ReactNode;
  className?: string;
  duration?: number;
  backgroundOpacity?: number;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      borderRadius = "0.5rem",
      children,
      className,
      duration = 8000,
      backgroundOpacity = 0.2,
      ...props
    },
    ref
  ) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [borderGradient, setBorderGradient] = useState("45deg, #8B5CF6, #4F46E5, #9b87f5, #6E59A5");

    useEffect(() => {
      const intervalId = setInterval(() => {
        const angle = Math.random() * 360;
        setPosition({
          x: Math.cos(angle * (Math.PI / 180)),
          y: Math.sin(angle * (Math.PI / 180)),
        });
        
        // Randomly change the gradient colors for a dynamic effect
        const gradients = [
          "45deg, #8B5CF6, #4F46E5, #9b87f5, #6E59A5",
          "60deg, #9b87f5, #6E59A5, #8B5CF6, #4F46E5",
          "120deg, #6E59A5, #8B5CF6, #4F46E5, #9b87f5"
        ];
        setBorderGradient(gradients[Math.floor(Math.random() * gradients.length)]);
      }, duration);

      return () => clearInterval(intervalId);
    }, [duration]);

    return (
      <div
        className="group relative"
        style={{
          borderRadius: borderRadius,
        }}
      >
        <div
          className="absolute inset-0 rounded-[inherit] bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `linear-gradient(${borderGradient})`,
            borderRadius: borderRadius,
            zIndex: 0,
            opacity: backgroundOpacity,
          }}
        />

        <div
          className="absolute -inset-[2px] rounded-[inherit] animate-spin-slow [animation-play-state:paused] group-hover:[animation-play-state:running]"
          style={{
            background: `linear-gradient(${borderGradient})`,
            backgroundSize: "400% 400%",
            backgroundPosition: `${position.x * 50 + 50}% ${position.y * 50 + 50}%`,
            transition: `all ${duration}ms linear`,
            borderRadius: `calc(${borderRadius} + 2px)`,
            zIndex: -1,
          }}
        />

        <BaseButton
          ref={ref}
          className={cn(
            "relative z-10 border border-transparent rounded-[inherit] transition-all duration-300 bg-background group-hover:text-white",
            className
          )}
          {...props}
        >
          {children}
        </BaseButton>
      </div>
    );
  }
);

Button.displayName = "MovingBorderButton";
