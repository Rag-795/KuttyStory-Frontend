import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Film, ArrowRightFromLine } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuthStore } from '../stores/authStore';

const navLinks = [
    { label: 'Home', path: '/#home' },
    { label: 'Features', path: '/#features' },
    { label: 'Styles', path: '/#styles' },
    { label: 'Resources', path: '/#resources' },
];

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuthStore();

    const isActive = (path) => {
        // Special handling for Home to be active on both '/' and '/#home'
        if (path === '/#home') {
            return location.pathname === '/' && (location.hash === '#home' || location.hash === '');
        }

        // Standard handling for other hash links
        const [, hash] = path.split('#');
        return location.hash === `#${hash}`;
    };

    const handleTryDemo = () => {
        if (isAuthenticated) {
            navigate('/dashboard');
        } else {
            navigate('/login');
        }
    };

    return (
        <nav className="sticky top-0 z-40 w-full bg-white/50 backdrop-blur-sm border-b border-border-light/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/#home" className="flex items-center gap-2 min-w-[120px]">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <Film className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-semibold text-primary">Kutty Story</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center justify-center">
                        <div className="flex items-center gap-1 p-1 bg-white rounded-full shadow-sm">
                            {navLinks.map((link) => {
                                const active = isActive(link.path);

                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="relative px-6 py-2 rounded-full text-sm font-medium z-10"
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="active-pill"
                                                className="absolute inset-0 bg-black rounded-full z-[-1]"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 32,
                                                }}
                                            />
                                        )}

                                        <span className={`relative flex items-center justify-center gap-2 ${active ? 'text-white' : 'text-black'}`}>
                                            {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Desktop CTA */}
                    <div className="hidden md:flex items-center justify-end gap-3 min-w-[120px]">
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-sm font-medium text-muted hover:text-primary transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Button variant="secondary" size="sm" onClick={logout}>
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <Button size="sm" onClick={handleTryDemo}>
                                Try Demo
                                <ArrowRightFromLine className="w-4 h-4" />
                            </Button>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
                    >
                        {isMobileMenuOpen ? (
                            <X className="w-5 h-5" />
                        ) : (
                            <Menu className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-border-light bg-white overflow-hidden"
                    >
                        <div className="px-4 py-4 space-y-2">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className={`
                                        block px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                        ${isActive(link.path)
                                            ? 'bg-primary text-white'
                                            : 'text-muted hover:bg-secondary'
                                        }
                                    `}
                                >
                                    {link.label}
                                </Link>
                            ))}
                            <div className="pt-2 border-t border-border-light space-y-2">
                                {isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/dashboard"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-2 rounded-lg text-sm font-medium text-muted hover:bg-secondary"
                                        >
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                logout();
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className="w-full px-4 py-2 rounded-lg text-sm font-medium text-left text-error hover:bg-red-50"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block px-4 py-2 rounded-lg text-sm font-medium text-muted hover:bg-secondary"
                                        >
                                            Login
                                        </Link>
                                        <Button
                                            fullWidth
                                            onClick={() => {
                                                handleTryDemo();
                                                setIsMobileMenuOpen(false);
                                            }}
                                        >
                                            Try Demo <ArrowRightFromLine className="w-4 h-4" />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}