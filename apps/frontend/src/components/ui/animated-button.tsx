import { motion } from 'framer-motion';
import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedButtonProps {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export function AnimatedButton({
  children,
  variant = 'default',
  size = 'md',
  isLoading = false,
  className,
  disabled,
  onClick,
  type = 'button',
}: AnimatedButtonProps) {
  const baseStyles = 'font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 relative overflow-hidden';

  const variants = {
    default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
    primary: 'bg-gradient-to-r from-[#FFC107] to-[#FFB300] text-black hover:from-[#FFB300] hover:to-[#FFA000] focus:ring-[#FFC107] shadow-md font-semibold',
    success: 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 focus:ring-green-500 shadow-md',
    danger: 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800 focus:ring-red-500 shadow-md',
    outline: 'border-2 border-gray-300 text-gray-700 hover:border-[#FFC107] hover:bg-yellow-50 focus:ring-[#FFC107]',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
    >
      {/* Shimmer effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
        whileHover={{
          opacity: [0, 0.1, 0],
          x: ['-100%', '100%'],
        }}
        transition={{ duration: 0.6 }}
      />

      {/* Ripple effect on tap */}
      <motion.div
        className="absolute inset-0 bg-white rounded-lg"
        initial={{ scale: 0, opacity: 0.5 }}
        whileTap={{
          scale: 2,
          opacity: 0,
        }}
        transition={{ duration: 0.4 }}
      />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading && (
          <motion.div
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
        )}
        {children}
      </span>
    </motion.button>
  );
}
