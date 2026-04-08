import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200",
        variant === "primary" &&
          "bg-gradient-to-r from-violet-500 to-cyan-400 text-slate-950 hover:opacity-90",
        variant === "secondary" &&
          "border border-white/10 bg-white/6 text-white hover:bg-white/10",
        variant === "ghost" && "text-white/70 hover:text-white",
        className,
      )}
      {...props}
    />
  );
}
