import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-black transition-all duration-300 rounded-[1.25rem] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-tight';
  
  const variants = {
    primary: 'bg-[var(--accent)] text-[var(--accent-text)] hover:shadow-[0_8px_25px_-5px_var(--accent)] shadow-opacity-40',
    secondary: 'bg-black bg-opacity-10 text-heading hover:bg-opacity-20 border border-[var(--border)]',
    outline: 'border border-[var(--border)] text-heading hover:bg-[var(--accent)] hover:text-[var(--accent-text)] hover:border-[var(--accent)]',
    ghost: 'text-main hover:text-heading hover:bg-black hover:bg-opacity-10',
  };

  const sizes = {
    sm: 'px-5 py-2.5 text-[10px]',
    md: 'px-8 py-3.5 text-xs',
    lg: 'px-10 py-4.5 text-sm',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!isLoading && leftIcon && <span className="mr-3">{leftIcon}</span>}
      <span className="flex-1 text-center">{children}</span>
      {!isLoading && rightIcon && <span className="ml-3">{rightIcon}</span>}
    </button>
  );
};

export default Button;