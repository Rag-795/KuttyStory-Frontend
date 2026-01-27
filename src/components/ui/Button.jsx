import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover hover:cursor-pointer',
    secondary: 'bg-secondary text-primary hover:bg-border-light border border-border hover:cursor-pointer',
    ghost: 'bg-transparent text-primary hover:bg-secondary hover:cursor-pointer',
    danger: 'bg-error text-white hover:bg-red-600 hover:cursor-pointer',
    accent: 'bg-accent text-white hover:bg-accent-hover hover:cursor-pointer',
};

const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

export default function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled = false,
    children,
    className = '',
    ...props
}) {
    return (
        <motion.button
            whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
            className={`
        inline-flex items-center justify-center gap-2
        font-medium rounded-lg transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : leftIcon ? (
                <span className="w-4 h-4">{leftIcon}</span>
            ) : null}
            {children}
            {rightIcon && !isLoading && <span className="w-4 h-4">{rightIcon}</span>}
        </motion.button>
    );
}
