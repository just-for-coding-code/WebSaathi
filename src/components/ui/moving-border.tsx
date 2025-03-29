
import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: "button" | "div" | "a";
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
  href?: string; // Added for anchor elements
}

export const Button = ({
  borderRadius = "1.75rem",
  children,
  as: Component = "button",
  containerClassName,
  borderClassName,
  duration = 2500,
  className,
  ...otherProps
}: ButtonProps) => {
  // Create a type-safe component renderer based on the 'as' prop
  const renderComponent = () => {
    if (Component === "button") {
      return (
        <button
          className={cn(
            "relative z-10 bg-gray-900 rounded-lg text-white flex items-center justify-center",
            className
          )}
          style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
          {...otherProps as React.ButtonHTMLAttributes<HTMLButtonElement>}
        >
          {children}
        </button>
      );
    } else if (Component === "a") {
      // Extract only the props that are valid for anchor elements
      const { href, target, rel, onClick, ...anchorProps } = otherProps as any;
      const anchorSpecificProps = { href, target, rel, onClick };
      
      return (
        <a
          className={cn(
            "relative z-10 bg-gray-900 rounded-lg text-white flex items-center justify-center",
            className
          )}
          style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
          {...anchorSpecificProps}
        >
          {children}
        </a>
      );
    } else {
      // Extract only the props that are valid for div elements
      const { onClick, onKeyDown, tabIndex, role, ...divProps } = otherProps as any;
      const divSpecificProps = { onClick, onKeyDown, tabIndex, role };
      
      return (
        <div
          className={cn(
            "relative z-10 bg-gray-900 rounded-lg text-white flex items-center justify-center",
            className
          )}
          style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
          {...divSpecificProps}
        >
          {children}
        </div>
      );
    }
  };

  return (
    <div
      className={cn(
        "relative p-[1px] overflow-hidden rounded-lg",
        containerClassName
      )}
      style={{ borderRadius: borderRadius }}
    >
      <div
        className={cn(
          "absolute inset-0 z-0",
          borderClassName
        )}
        style={{
          background:
            "linear-gradient(var(--moving-gradient-angle, 0deg), var(--primary-color, #9b87f5), var(--secondary-color, #61a1f8), var(--primary-color, #9b87f5))",
          backgroundSize: "200% 200%",
          animation: `moving-gradient ${duration}ms linear infinite`,
        }}
      ></div>

      {renderComponent()}

      <style>
        {`
          @keyframes moving-gradient {
            0% {
              --moving-gradient-angle: 0deg;
            }
            100% {
              --moving-gradient-angle: 360deg;
            }
          }
        `}
      </style>
    </div>
  );
};
