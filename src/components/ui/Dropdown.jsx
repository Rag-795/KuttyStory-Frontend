import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

export default function Dropdown({
    options = [],
    value,
    onChange,
    placeholder = 'Select...',
    className = '',
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="
          flex items-center gap-2 px-3 py-2 rounded-lg
          bg-white border border-border
          text-sm font-medium text-primary
          hover:bg-secondary transition-colors
        "
            >
                {selectedOption?.icon && <span className="w-4 h-4">{selectedOption.icon}</span>}
                <span>{selectedOption?.label || placeholder}</span>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="
              absolute top-full left-0 mt-1 w-48 z-50
              bg-white border border-border rounded-lg shadow-lg
              py-1 overflow-hidden
            "
                    >
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`
                  w-full flex items-center gap-2 px-3 py-2 text-sm
                  hover:bg-secondary transition-colors
                  ${value === option.value ? 'bg-secondary text-accent' : 'text-primary'}
                `}
                            >
                                {option.icon && <span className="w-4 h-4">{option.icon}</span>}
                                <span className="flex-1 text-left">{option.label}</span>
                                {value === option.value && <Check className="w-4 h-4" />}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
