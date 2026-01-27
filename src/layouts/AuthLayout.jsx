import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Film, LayoutDashboard, PlusCircle, Video, Settings, Menu, X, LogOut } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';

const navLinks = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Create', path: '/create', icon: PlusCircle },
    { label: 'My Videos', path: '/my-videos', icon: Video },
    { label: 'Settings', path: '/settings', icon: Settings },
];

export default function AuthLayout() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header Navigation */}
            <nav className="sticky top-0 z-40 w-full bg-white border-b border-border-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/dashboard" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <Film className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-semibold text-primary">Kutty Story</span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => {
                                const Icon = link.icon;
                                const active = isActive(link.path);

                                return (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className="relative px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                    >
                                        {active && (
                                            <motion.span
                                                layoutId="active-nav"
                                                className="absolute inset-0 bg-primary/5 rounded-lg"
                                                transition={{
                                                    type: 'spring',
                                                    stiffness: 400,
                                                    damping: 30,
                                                }}
                                            />
                                        )}
                                        <span className={`relative flex items-center gap-2 ${active ? 'text-primary' : 'text-muted hover:text-primary'}`}>
                                            <Icon className="w-4 h-4" />
                                            {link.label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>

                        {/* User Menu */}
                        <div className="hidden md:flex items-center gap-3">
                            {/* <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary">
                                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-xs font-semibold text-primary">
                                        {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <span className="text-sm font-medium text-primary">{user?.displayName || 'User'}</span>
                            </div> */}
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="w-4 h-4 text-error" />
                                <span className="text-error">LogOut</span>
                            </Button>
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
                                {/* User Info
                                <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary mb-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-sm font-semibold text-primary">
                                            {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-primary">{user?.displayName || 'User'}</p>
                                        <p className="text-xs text-muted">{user?.email}</p>
                                    </div>
                                </div> */}

                                {/* Navigation Links */}
                                {navLinks.map((link) => {
                                    const Icon = link.icon;
                                    const active = isActive(link.path);

                                    return (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors
                                                ${active ? 'bg-primary text-white' : 'text-muted hover:bg-secondary'}
                                            `}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {link.label}
                                        </Link>
                                    );
                                })}

                                {/* Logout Button */}
                                <div className="pt-2 border-t border-border-light">
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-error hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Main Content */}
            <main className="flex-1">
                <Outlet />
            </main>
        </div>
    );
}
