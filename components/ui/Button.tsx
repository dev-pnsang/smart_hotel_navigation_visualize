import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "line" | "ghost";
};

const variants = {
  primary: "bg-ink text-paper hover:bg-teal",
  line: "border border-line bg-paper text-ink hover:border-ink/30",
  ghost: "bg-transparent text-ink hover:bg-ink/5",
};

export function Button({ variant = "primary", className = "", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex min-h-12 items-center justify-center gap-2 px-5 text-[0.95rem] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}
