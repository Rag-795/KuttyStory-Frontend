import { motion } from 'framer-motion';

const variants = {
    default: 'bg-white border border-border',
    elevated: 'bg-white shadow-lg',
    interactive: 'bg-white border border-border hover:shadow-md hover:border-muted-light cursor-pointer',
    surface: 'bg-surface border border-border-light',
};

export default function Card({
    variant = 'default',
    padding = 'md',
    children,
    className = '',
    onClick,
    animate = true,
    ...props
}) {
    const paddingClasses = {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    const Component = animate ? motion.div : 'div';
    const animationProps = animate && onClick ? {
        whileHover: { y: -2 },
        whileTap: { scale: 0.98 },
    } : {};

    return (
        <Component
            className={`
        rounded-xl transition-all duration-200
        ${variants[variant]}
        ${paddingClasses[padding]}
        ${className}
      `}
            onClick={onClick}
            {...animationProps}
            {...props}
        >
            {children}
        </Component>
    );
}
