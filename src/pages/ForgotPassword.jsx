import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Film, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useAuthStore } from '../stores/authStore';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email'),
});

export default function ForgotPassword() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const { sendPasswordReset, isLoading, error, clearError } = useAuthStore();

    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
    } = useForm({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data) => {
        clearError();
        try {
            await sendPasswordReset(data.email);
            setIsSubmitted(true);
            toast.success('Password reset email sent!');
        } catch (err) {
            toast.error(err.message || 'Failed to send reset email');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-surface p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                        <Film className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-semibold text-primary">Kutty Story</span>
                </div>

                <Card padding="lg">
                    {!isSubmitted ? (
                        <>
                            <div className="text-center mb-6">
                                <h1 className="text-2xl font-bold text-primary mb-2">Forgot password?</h1>
                                <p className="text-muted">
                                    No worries, we'll send you reset instructions.
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="Enter your email"
                                    leftIcon={<Mail className="w-5 h-5" />}
                                    error={errors.email?.message}
                                    {...register('email')}
                                />

                                {error && (
                                    <p className="text-sm text-error bg-error/10 p-3 rounded-lg">{error}</p>
                                )}

                                <Button type="submit" fullWidth isLoading={isLoading}>
                                    Reset password
                                </Button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center">
                            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-success" />
                            </div>
                            <h2 className="text-xl font-bold text-primary mb-2">Check your email</h2>
                            <p className="text-muted mb-6">
                                We sent a password reset link to
                                <br />
                                <span className="font-medium text-primary">{getValues('email')}</span>
                            </p>
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={() => setIsSubmitted(false)}
                            >
                                Didn't receive the email? Click to resend
                            </Button>
                        </div>
                    )}

                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to login
                        </Link>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
}
