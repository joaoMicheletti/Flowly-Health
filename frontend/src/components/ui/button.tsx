import { ButtonHTMLAttributes } from 'react';

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;

  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
  children,
  className = '',
  variant = 'primary',
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      'bg-blue-600 hover:bg-blue-700 text-white',

    secondary:
      'bg-slate-200 hover:bg-slate-300 text-slate-700',

    danger:
      'bg-red-600 hover:bg-red-700 text-white',
  };

  return (
    <button
      className={`
        rounded-xl
        px-5
        py-3
        font-semibold
        transition
        disabled:opacity-50
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}