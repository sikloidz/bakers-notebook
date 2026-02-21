import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, id, className = "", ...props }: InputProps) {
  return (
    <div>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-brown">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full rounded-md border border-wheat bg-white px-3 py-2 text-sm text-brown-dark placeholder:text-brown-light/50 focus:border-crust focus:ring-1 focus:ring-crust focus:outline-none ${className}`}
        {...props}
      />
    </div>
  );
}
