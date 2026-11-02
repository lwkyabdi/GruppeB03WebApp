import type { ComponentPropsWithoutRef } from "react";

type ButtonProps = ComponentPropsWithoutRef<"button">;

export function Button({
  type = "button",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button type={type} className={`button ${className}`} {...props}>
      {children}
    </button>
  );
}
