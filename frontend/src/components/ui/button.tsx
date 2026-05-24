import { ButtonHTMLAttributes } from 'react';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        rounded-xl
        bg-blue-600
        px-5
        py-3
        font-semibold
        text-white
        transition
        hover:bg-blue-700
        disabled:opacity-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}