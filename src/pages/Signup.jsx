import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, User, Film } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuthStore } from '../stores/authStore';

const signupSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export default function Signup() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const { signup, loginWithGoogle, isLoading, error, clearError } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signupSchema),
    });

    const onSubmit = async (data) => {
        clearError();
        try {
            await signup(data.name, data.email, data.password);
            toast.success('Account created successfully!');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Failed to create account');
        }
    };

    const handleGoogleSignup = async () => {
        clearError();
        try {
            await loginWithGoogle();
            toast.success('Welcome!');
            navigate('/dashboard', { replace: true });
        } catch (err) {
            toast.error(err.message || 'Failed to sign up with Google');
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary via-primary to-gray-800" />
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-8">
                        <Film className="w-10 h-10" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-center">Join Kutty Story</h2>
                    <p className="text-white/70 text-center max-w-md">
                        Start creating amazing AI-powered videos today.
                        Turn your imagination into stunning visual stories.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-20 right-20 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-white/5 rounded-full blur-2xl" />
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-background">
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md"
                >
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center justify-center gap-2 mb-8">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <Film className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-semibold text-primary">Kutty Story</span>
                    </div>

                    <h1 className="text-2xl font-bold text-primary mb-2">Create account</h1>
                    <p className="text-muted mb-8">Get started with your free account today.</p>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="Enter your name"
                            leftIcon={<User className="w-5 h-5" />}
                            error={errors.name?.message}
                            {...register('name')}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            leftIcon={<Mail className="w-5 h-5" />}
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div className="relative">
                            <Input
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Create a password"
                                leftIcon={<Lock className="w-5 h-5" />}
                                error={errors.password?.message}
                                {...register('password')}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-9 text-muted hover:text-primary"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <Input
                            label="Confirm Password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            leftIcon={<Lock className="w-5 h-5" />}
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <label className="flex items-start gap-2 text-sm text-muted">
                            <input type="checkbox" className="mt-1 rounded border-border" required />
                            <span>
                                I agree to the{' '}
                                <a href="#" className="text-accent hover:underline">Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                            </span>
                        </label>

                        {error && (
                            <p className="text-sm text-error bg-error/10 p-3 rounded-lg">{error}</p>
                        )}

                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Create account
                        </Button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-background text-muted">or continue with</span>
                        </div>
                    </div>

                    <Button
                        variant="secondary"
                        fullWidth
                        onClick={handleGoogleSignup}
                        isLoading={isLoading}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Continue with Google
                    </Button>

                    <p className="text-center text-sm text-muted mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-accent hover:underline font-medium">
                            Sign in
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
