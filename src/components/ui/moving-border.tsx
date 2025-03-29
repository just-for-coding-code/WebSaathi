
import React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  borderRadius?: string;
  children: React.ReactNode;
  as?: string;
  containerClassName?: string;
  borderClassName?: string;
  duration?: number;
  className?: string;
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

      <div
        className={cn(
          "relative z-10 bg-gray-900 rounded-lg text-white flex items-center justify-center",
          className
        )}
        style={{ borderRadius: `calc(${borderRadius} - 1px)` }}
        {...otherProps}
      >
        {children}
      </div>

      <style jsx>{`
        @keyframes moving-gradient {
          0% {
            --moving-gradient-angle: 0deg;
          }
          100% {
            --moving-gradient-angle: 360deg;
          }
        }
      `}</style>
    </div>
  );
};
