import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    leftIcon,
    rightIcon,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-primary mb-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                {leftIcon && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted">
                        {leftIcon}
                    </span>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-2.5 rounded-lg
            bg-white border border-border
            text-primary placeholder:text-muted-light
            focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent
            transition-all duration-200
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon ? 'pr-10' : ''}
            ${error ? 'border-error focus:ring-error/20 focus:border-error' : ''}
            ${className}
          `}
                    {...props}
                />
                {rightIcon && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted">
                        {rightIcon}
                    </span>
                )}
            </div>
            {error && (
                <p className="mt-1 text-sm text-error">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
