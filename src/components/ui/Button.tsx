import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'text' | 'success' | 'error';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
}

const variantClasses = {
  primary: 'bg-primary hover:bg-primary/90 text-white border-transparent',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-transparent',
  outline: 'bg-transparent hover:bg-gray-100 text-gray-800 border-gray-300',
  text: 'bg-transparent hover:bg-gray-100 text-gray-800 border-transparent',
  success: 'bg-green-600 hover:bg-green-700 text-white border-transparent',
  error: 'bg-red-600 hover:bg-red-700 text-white border-transparent',
};

const sizeClasses = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-base px-4 py-2',
  lg: 'text-lg px-6 py-3',
};

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  leftIcon,
  rightIcon,
  className = '',
  onClick,
  type = 'button',
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md border transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2';
  
  return (
    <button
      type={type}
      className={`
        ${baseClasses} 
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${disabled ? 'opacity-60 cursor-not-allowed' : ''} 
        ${className}
      `}
      disabled={disabled}
      onClick={onClick}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};