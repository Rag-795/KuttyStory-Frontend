import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

function LoaderComponent({ size = 'md', text, className = '' }) {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`flex flex-col items-center justify-center gap-3 ${className}`}
        >
            <Loader2 className={`${sizes[size]} text-accent animate-spin`} />
            {text && (
                <p className="text-sm text-muted animate-pulse">{text}</p>
            )}
        </motion.div>
    );
}

export function FullPageLoader({ text = 'Loading...' }) {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
            <LoaderComponent size="lg" text={text} />
        </div>
    );
}

// Support both default and named imports
export const Loader = LoaderComponent;
export default LoaderComponent;
