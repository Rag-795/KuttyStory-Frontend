import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Play, Youtube } from 'lucide-react';
import { Vortex } from "../components/ui/vortex";
import Card from '../components/ui/Card';
import { useGenerationStore } from '../stores/generationStore';
import { useAuthStore } from '../stores/authStore';
import { VISUAL_STYLES, QUICK_ACTIONS, DURATION_OPTIONS, ASPECT_RATIO_OPTIONS, iconMap } from '../config/visualStyles';
import ShinyText from '../components/ui/ShinyText';

export default function Home() {
    const navigate = useNavigate();
    const { hash } = useLocation();
    const { isAuthenticated } = useAuthStore();
    const {
        prompt, setPrompt,
        style, setStyle,
        duration, setDuration,
        aspectRatio, setAspectRatio
    } = useGenerationStore();

    const [isStyleOpen, setIsStyleOpen] = useState(false);
    const [isRatioOpen, setIsRatioOpen] = useState(false);
    const [isDurationOpen, setIsDurationOpen] = useState(false);

    const selectedStyle = VISUAL_STYLES.find(s => s.id === style);
    const SelectedStyleIcon = selectedStyle ? iconMap[selectedStyle.icon] : null;

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

            <div id="home" className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
                <Vortex
                    backgroundColor="transparent"
                    rangeY={800}
                    particleCount={500}
                    baseHue={120}
                    className="flex items-center flex-col justify-center -mt-8 px-2 md:px-10 py-4 w-full h-full"
                    containerClassName="w-full h-auto"
                >
                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="flex justify-center mb-8"
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border text-sm text-muted">
                            <Youtube className="w-4 h-4 text-red-500" />
                            <ShinyText
                                text="Your AI Video Starts Here"
                                speed={3}
                                delay={0}
                                color="#0f0f0f"
                                shineColor="#ffffff"
                                spread={120}
                                direction="left"
                                yoyo={true}
                                pauseOnHover={false}
                                disabled={false}
                            />
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
                        className="max-w-3xl mx-auto mb-12 w-full"
                    >
                        <div className="bg-white rounded-2xl border border-border shadow-lg p-4">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Type your video idea here..."
                                className="w-full h-24 bg-transparent text-primary placeholder:text-muted-light focus:outline-none focus:ring-0 resize-none text-lg"
                            />

                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-2">
                                    {/* Ratio Dropdown */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsRatioOpen(!isRatioOpen);
                                                setIsDurationOpen(false);
                                                setIsStyleOpen(false);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-full border border-border text-sm font-medium text-muted hover:text-primary hover:bg-secondary transition-colors"
                                        >
                                            <span>{aspectRatio}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isRatioOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isRatioOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-border shadow-lg py-2 z-50"
                                            >
                                                {ASPECT_RATIO_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setAspectRatio(opt.value);
                                                            setIsRatioOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${aspectRatio === opt.value ? 'bg-secondary text-accent' : 'text-primary'
                                                            }`}
                                                    >
                                                        <span className="font-medium">{opt.label}</span>
                                                        <span className="block text-xs text-muted">{opt.description}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Duration Dropdown */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsDurationOpen(!isDurationOpen);
                                                setIsRatioOpen(false);
                                                setIsStyleOpen(false);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-full border border-border text-sm font-medium text-muted hover:text-primary hover:bg-secondary transition-colors"
                                        >
                                            <span>{duration}s</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isDurationOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isDurationOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl border border-border shadow-lg py-2 z-50"
                                            >
                                                {DURATION_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => {
                                                            setDuration(opt.value);
                                                            setIsDurationOpen(false);
                                                        }}
                                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-secondary transition-colors ${duration === opt.value ? 'bg-secondary text-accent' : 'text-primary'
                                                            }`}
                                                    >
                                                        <span className="font-medium">{opt.label}</span>
                                                        <span className="block text-xs text-muted">{opt.description}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Style Dropdown */}
                                    <div className="relative">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsStyleOpen(!isStyleOpen);
                                                setIsRatioOpen(false);
                                                setIsDurationOpen(false);
                                            }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-full border border-border text-sm font-medium text-muted hover:text-primary hover:bg-secondary transition-colors"
                                        >
                                            {SelectedStyleIcon && <SelectedStyleIcon className="w-4 h-4" />}
                                            <span>{selectedStyle?.name || 'Cinematic'}</span>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${isStyleOpen ? 'rotate-180' : ''}`} />
                                        </button>

                                        {isStyleOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl border border-border shadow-lg py-2 z-50"
                                            >
                                                {VISUAL_STYLES.map((s) => {
                                                    const StyleIcon = iconMap[s.icon];
                                                    return (
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
                                                            {StyleIcon && <StyleIcon className="w-4 h-4" />}
                                                            <span>{s.name}</span>
                                                        </button>
                                                    );
                                                })}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={!prompt.trim()}
                                    className="p-3 rounded-full bg-primary text-white hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl hover:scale-105 transform duration-200"
                                >
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </motion.form>

                    {/* Quick Action Cards */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto w-full"
                    >
                        {QUICK_ACTIONS.map((action) => {
                            const IconComponent = iconMap[action.icon];
                            return (
                                <Card
                                    key={action.id}
                                    variant="interactive"
                                    padding="md"
                                    onClick={() => handleQuickAction(action)}
                                    className="flex flex-col justify-between min-h-[140px] hover:shadow-md cursor-pointer"
                                >
                                    <div>
                                        <h3 className="text-sm font-medium text-primary">{action.title}</h3>
                                        <p className="text-xs text-muted">{action.subtitle}</p>
                                    </div>
                                    {IconComponent && <IconComponent className={`w-6 h-6 text-${action.color} mt-4`} strokeWidth={1.5} />}
                                </Card>
                            );
                        })}
                    </motion.div>
                </Vortex>

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

                {/* Styles Showcase */}
                <motion.section
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mt-24 scroll-mt-24"
                    id="styles"
                >
                    <h2 className="text-3xl font-semibold text-center text-primary mb-4">
                        Visual Styles
                    </h2>
                    <p className="text-center text-muted mb-8 max-w-xl mx-auto">
                        Explore our stunning visual styles that bring your stories to life
                    </p>

                    {/* Infinite Marquee Container */}
                    <div className="relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-background to-transparent z-10" />
                        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-background to-transparent z-10" />
                        <div className="flex animate-marquee">
                            {[
                                { id: 'cinematic', name: 'Cinematic', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop' },
                                { id: 'anime', name: 'Anime', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop' },
                                { id: 'watercolor', name: 'Watercolor', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=600&fit=crop' },
                                { id: 'noir', name: 'Noir', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop' },
                                { id: 'fantasy', name: 'Fantasy', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop' },
                                { id: 'vintage', name: 'Vintage', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop' },
                                { id: 'comic', name: 'Comic Book', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop' },
                                { id: 'minimalist', name: 'Minimalist', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=600&fit=crop' },
                            ].map((styleItem) => (
                                <div key={styleItem.id} className="shrink-0 w-48 mx-2">
                                    <div className="relative h-72 rounded-2xl overflow-hidden">
                                        <img src={styleItem.image} alt={styleItem.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-white font-semibold text-lg">{styleItem.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* Duplicate set for seamless loop */}
                            {[
                                { id: 'cinematic-2', name: 'Cinematic', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop' },
                                { id: 'anime-2', name: 'Anime', image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400&h=600&fit=crop' },
                                { id: 'watercolor-2', name: 'Watercolor', image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=600&fit=crop' },
                                { id: 'noir-2', name: 'Noir', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=600&fit=crop' },
                                { id: 'fantasy-2', name: 'Fantasy', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=600&fit=crop' },
                                { id: 'vintage-2', name: 'Vintage', image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&h=600&fit=crop' },
                                { id: 'comic-2', name: 'Comic Book', image: 'https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400&h=600&fit=crop' },
                                { id: 'minimalist-2', name: 'Minimalist', image: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=400&h=600&fit=crop' },
                            ].map((styleItem) => (
                                <div key={styleItem.id} className="shrink-0 w-48 mx-2">
                                    <div className="relative h-72 rounded-2xl overflow-hidden">
                                        <img src={styleItem.image} alt={styleItem.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-4">
                                            <h3 className="text-white font-semibold text-lg">{styleItem.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
                                image: 'https://bestarion.com/wp-content/uploads/2024/06/prompt-engineering.jpg',
                                link: 'https://www.promptingguide.ai/',
                            },
                            {
                                title: 'Storytelling Masterclass',
                                category: 'Video Course',
                                image: 'https://tagmango.com/publicassets/-final-tsm-be41510df81934383be45e73d0a251da.png',
                                link: 'https://youtu.be/hNuAv-42jzY?si=LDhwIRyIFr8tEmeC',
                            },
                            {
                                title: 'Create a Youtube Channel',
                                category: 'Tutorial',
                                image: 'https://t3.ftcdn.net/jpg/06/34/31/96/360_F_634319630_txtgmPLEEQ8o4zaxec2WKrLWUBqdBBQn.jpg',
                                link: 'https://youtu.be/Lk_4GUymeOI?si=ndzfeWXUTEUFaUzO',
                            },
                        ].map((resource, index) => (
                            <Card key={index} variant="interactive" padding="none" className="overflow-hidden cursor-pointer" onClick={() => window.open(resource.link, '_blank')}>
                                <div className="h-40 overflow-hidden">
                                    <img
                                        src={resource.image}
                                        alt={resource.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <span className="text-xs font-medium text-accent mb-2 block">
                                        {resource.category}
                                    </span>
                                    <h3 className="font-semibold text-primary mb-2">
                                        {resource.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-sm text-muted mt-4">
                                        <span>View more</span>
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
                        className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:cursor-pointer text-white rounded-2xl font-medium hover:bg-primary-hover transition-colors"
                    >
                        Get Started
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.section>
            </div>
        </div>
    );
}
