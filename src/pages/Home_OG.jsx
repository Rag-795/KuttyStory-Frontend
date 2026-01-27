import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Paperclip, Plus, ArrowRight, ChevronDown, Check, Play, BookOpen } from 'lucide-react';
import Card from '../components/ui/Card';
import { useGenerationStore } from '../stores/generationStore';
import { useAuthStore } from '../stores/authStore';
import { VISUAL_STYLES, QUICK_ACTIONS } from '../config/visualStyles';

export default function HomeOG() {
    const navigate = useNavigate();
    const { hash } = useLocation();
    const { isAuthenticated } = useAuthStore();
    const { prompt, setPrompt, style, setStyle } = useGenerationStore();
    const [isStyleOpen, setIsStyleOpen] = useState(false);

    const selectedStyle = VISUAL_STYLES.find(s => s.id === style);

    // Handle scroll to hash
    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.replace('#', ''));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [hash]);

    const handleSubmit = (e) => {
        e?.preventDefault();
        if (!prompt.trim()) return;

        if (isAuthenticated) {
            navigate('/create');
        } else {
            navigate('/login', { state: { from: '/create' } });
        }
    };

    const handleQuickAction = (action) => {
        setPrompt(action.prompt + ' ');
        document.querySelector('input[type="text"]')?.focus();
    };

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full bg-linear-to-br from-gray-100/50 to-gray-200/30 blur-3xl" />
                <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-linear-to-tr from-gray-100/50 to-gray-200/30 blur-3xl" />
            </div>

            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="flex justify-center mb-8"
                >
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm text-muted">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        Your AI Video Starts Here
                    </span>
                </motion.div>

                {/* Hero Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-center mb-6"
                >
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-primary leading-tight">
                        Create Videos Instantly
                        <br />
                        with a <span className="text-muted">Single Prompt</span>
                    </h1>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-center text-muted max-w-2xl mx-auto mb-12"
                >
                    Type your idea, and our AI instantly turns it into a realistic video.
                    Preview in real-time, customize styles, and export with a single click—
                    perfect for creators, marketers, and teams.
                </motion.p>

                {/* Prompt Input Bar */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    onSubmit={handleSubmit}
                    className="max-w-3xl mx-auto mb-12"
                >
                    <div className="relative flex items-center bg-white rounded-2xl border border-border shadow-lg p-2">
                        <input
                            type="text"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Type your video idea here..."
                            className="flex-1 px-4 py-3 bg-transparent text-primary placeholder:text-muted-light focus:outline-none"
                        />

                        {/* Attach Button */}
                        <button
                            type="button"
                            className="p-2 rounded-lg text-muted hover:text-primary hover:bg-secondary transition-colors"
                        >
                            <Paperclip className="w-5 h-5" />
                        </button>

                        {/* Style Dropdown */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsStyleOpen(!isStyleOpen)}
                                className="flex items-center gap-2 px-3 py-2 mx-1 rounded-lg text-sm font-medium text-muted hover:text-primary hover:bg-secondary transition-colors"
                            >
                                <span>{selectedStyle?.icon}</span>
                                <span>{selectedStyle?.name || 'Cinematic'}</span>
                                <ChevronDown className={`w-4 h-4 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {isStyleOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl border border-border shadow-lg py-2 z-50"
                                >
                                    {VISUAL_STYLES.map((s) => (
                                        <button
                                            key={s.id}
                                            type="button"
                                            onClick={() => {
                                                setStyle(s.id);
                                                setIsStyleOpen(false);
                                            }}
                                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-secondary transition-colors ${style === s.id ? 'bg-secondary text-accent' : 'text-primary'
                                                }`}
                                        >
                                            <span>{s.icon}</span>
                                            <span>{s.name}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </div>

                        {/* Add Button */}
                        <button
                            type="button"
                            className="p-2 rounded-lg text-muted hover:text-primary hover:bg-secondary transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                        </button>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={!prompt.trim()}
                            className="ml-1 p-3 rounded-xl bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.form>

                {/* Quick Action Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
                >
                    {QUICK_ACTIONS.map((action) => (
                        <Card
                            key={action.id}
                            variant="interactive"
                            padding="md"
                            onClick={() => handleQuickAction(action)}
                            className="text-center hover:shadow-md cursor-pointer"
                        >
                            <div className="text-3xl mb-3">{action.icon}</div>
                            <h3 className="text-sm font-medium text-primary mb-1">{action.title}</h3>
                            <p className="text-xs text-muted">{action.subtitle}</p>
                        </Card>
                    ))}
                </motion.div>

                {/* Features Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-24 scroll-mt-24"
                    id="features"
                >
                    <h2 className="text-3xl font-semibold text-center text-primary mb-12">
                        Powerful Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: '🎙️',
                                title: 'AI Narration',
                                description: 'Natural voice-over generated from your story',
                            },
                            {
                                icon: '🎵',
                                title: 'Background Music',
                                description: 'Mood-matched soundtracks for every scene',
                            },
                            {
                                icon: '🎨',
                                title: 'Multiple Styles',
                                description: 'From anime to cinematic, choose your visual style',
                            },
                        ].map((feature, index) => (
                            <Card key={index} variant="surface" padding="lg" className="text-center">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold text-primary mb-2">{feature.title}</h3>
                                <p className="text-sm text-muted">{feature.description}</p>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                Pricing Section
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-24 scroll-mt-24"
                    id="pricing"
                >
                    <h2 className="text-3xl font-semibold text-center text-primary mb-12">
                        Simple Pricing
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Free',
                                price: '$0',
                                features: ['3 videos per month', 'Standard quality', 'Watermarked'],
                            },
                            {
                                name: 'Pro',
                                price: '$19',
                                features: ['Unlimited videos', 'HD quality', 'No watermark', 'Priority generation'],
                                popular: true,
                            },
                            {
                                name: 'Team',
                                price: '$49',
                                features: ['Everything in Pro', 'Team collaboration', 'API access', 'Custom styles'],
                            },
                        ].map((plan, index) => (
                            <Card
                                key={index}
                                variant={plan.popular ? 'elevated' : 'surface'}
                                padding="lg"
                                className={`relative ${plan.popular ? 'border-accent' : ''}`}
                            >
                                {plan.popular && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                                        Most Popular
                                    </span>
                                )}
                                <h3 className="text-xl font-semibold text-primary mb-2">{plan.name}</h3>
                                <div className="text-3xl font-bold text-primary mb-6">
                                    {plan.price}<span className="text-base font-normal text-muted">/mo</span>
                                </div>
                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center gap-2 text-sm text-muted">
                                            <Check className="w-4 h-4 text-success" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                                <button className={`w-full py-2 rounded-lg font-medium transition-colors ${plan.popular
                                    ? 'bg-primary text-white hover:bg-primary-hover'
                                    : 'bg-secondary text-primary hover:bg-border'
                                    }`}>
                                    Choose {plan.name}
                                </button>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                {/* Animation Showcase */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-24 scroll-mt-24"
                    id="animation"
                >
                    <div className="bg-primary rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-semibold mb-4">
                                    Bring Stories to Life
                                </h2>
                                <p className="text-white/70 mb-8">
                                    Our advanced AI animation engine understands physics, lighting, and movement
                                    to create fluid, cinematic videos that captivate your audience.
                                </p>
                                <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary rounded-xl font-medium hover:bg-gray-100 transition-colors">
                                    <Play className="w-4 h-4" />
                                    Watch Demo
                                </button>
                            </div>
                            <div className="aspect-video bg-white/10 rounded-xl flex items-center justify-center border border-white/10">
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                                        <Play className="w-6 h-6 text-white ml-1" />
                                    </div>
                                    <p className="text-sm text-white/50">Preview Animation</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Resources Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-24 scroll-mt-24"
                    id="resources"
                >
                    <h2 className="text-3xl font-semibold text-center text-primary mb-12">
                        Resources & Guides
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                title: 'Prompt Engineering Guide',
                                category: 'Guide',
                                image: 'bg-blue-100',
                            },
                            {
                                title: 'Storytelling Masterclass',
                                category: 'Video Course',
                                image: 'bg-purple-100',
                            },
                            {
                                title: 'Community Showcase',
                                category: 'Inspiration',
                                image: 'bg-orange-100',
                            },
                        ].map((resource, index) => (
                            <Card key={index} variant="interactive" padding="none" className="overflow-hidden cursor-pointer">
                                <div className={`h-40 ${resource.image} flex items-center justify-center`}>
                                    <BookOpen className="w-8 h-8 text-primary/20" />
                                </div>
                                <div className="p-6">
                                    <span className="text-xs font-medium text-accent mb-2 block">
                                        {resource.category}
                                    </span>
                                    <h3 className="font-semibold text-primary mb-2">
                                        {resource.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-muted mt-4">
                                        <span>Read more</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </motion.section>

                {/* CTA Section */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-24 text-center"
                >
                    <h2 className="text-3xl font-semibold text-primary mb-4">
                        Ready to Create Your Story?
                    </h2>
                    <p className="text-muted mb-8">
                        Join thousands of creators making stunning videos with AI
                    </p>
                    <button
                        onClick={handleSubmit}
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-white rounded-2xl font-medium hover:bg-primary-hover transition-colors"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.section>
            </div>
        </div>
    );
}
