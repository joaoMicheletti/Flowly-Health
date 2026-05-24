import { InputHTMLAttributes } from 'react';

interface InputProps
  extends InputHTMLAttributes<HTMLInputElement> {}

export function Input({
  className = '',
  ...props
}: InputProps) {
  return (
    <input
      className={`
        w-full
        rounded-lg
        border
        border-slate-300
        p-3
        outline-none
        transition
        focus:border-blue-500
        ${className}
      `}
      {...props}
    />
  );
}