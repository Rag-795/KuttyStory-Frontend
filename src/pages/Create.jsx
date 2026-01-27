import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Download, Share2, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { ProgressBar, StageProgress } from '../components/common/ProgressBar';
import { useAuthStore } from '../stores/authStore';
import { useGenerationStore } from '../stores/generationStore';
import { VISUAL_STYLES, DURATION_OPTIONS, ASPECT_RATIO_OPTIONS, iconMap } from '../config/visualStyles';

const STEPS = [
    { id: 'prompt', title: 'Your Story' },
    { id: 'style', title: 'Visual Style' },
    { id: 'settings', title: 'Settings' },
    { id: 'generate', title: 'Generate' },
    { id: 'complete', title: 'Complete' },
];

export default function Create() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const {
        prompt, setPrompt,
        style, setStyle,
        duration, setDuration,
        aspectRatio, setAspectRatio,
        status, progress, currentStage, stages,
        videoUrl, error,
        startGeneration, resetGeneration,
    } = useGenerationStore();

    const [currentStep, setCurrentStep] = useState(0);

    const canProceed = () => {
        switch (currentStep) {
            case 0: return prompt.trim().length >= 10;
            case 1: return !!style;
            case 2: return true;
            default: return true;
        }
    };

    const handleNext = async () => {
        if (currentStep === 2) {
            // Start generation
            setCurrentStep(3);
            const result = await startGeneration(user?.uid);
            if (result) {
                setCurrentStep(4);
                toast.success('Video generated successfully!');
            } else {
                toast.error(error || 'Failed to generate video');
            }
        } else if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleDownload = async () => {
        if (videoUrl) {
            window.open(videoUrl, '_blank');
            toast.success('Download started!');
        }
    };

    const handleShare = async () => {
        if (navigator.share && videoUrl) {
            await navigator.share({
                title: 'My Kutty Story Video',
                url: videoUrl,
            });
        } else {
            navigator.clipboard.writeText(videoUrl || '');
            toast.success('Link copied to clipboard!');
        }
    };

    const handleCreateAnother = () => {
        resetGeneration();
        setCurrentStep(0);
    };

    return (
        <div className="min-h-screen bg-surface py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6">
                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div
                                    className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${index < currentStep ? 'bg-success text-white' : ''}
                    ${index === currentStep ? 'bg-primary text-white' : ''}
                    ${index > currentStep ? 'bg-secondary text-muted' : ''}
                  `}
                                >
                                    {index < currentStep ? <Check className="w-4 h-4" /> : index + 1}
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div
                                        className={`w-16 sm:w-24 h-1 mx-2 rounded ${index < currentStep ? 'bg-success' : 'bg-secondary'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-2">
                        {STEPS.map((step, index) => (
                            <span
                                key={step.id}
                                className={`text-xs ${index === currentStep ? 'text-primary font-medium' : 'text-muted'
                                    }`}
                            >
                                {step.title}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* Step 1: Prompt */}
                        {currentStep === 0 && (
                            <Card padding="lg">
                                <h2 className="text-xl font-semibold text-primary mb-2">Tell us your story</h2>
                                <p className="text-muted mb-6">Describe the video you want to create in detail.</p>

                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Once upon a time, in a magical forest..."
                                    className="w-full h-40 p-4 rounded-xl border border-border bg-white text-primary placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent resize-none"
                                />
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-muted">{prompt.length} characters</p>
                                    <p className="text-sm text-muted">Minimum 10 characters</p>
                                </div>

                                {/* Example Prompts */}
                                <div className="mt-6">
                                    <p className="text-sm font-medium text-muted mb-3">Need inspiration?</p>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            'A curious cat exploring a space station',
                                            'A day in the life of a busy coffee shop',
                                            'An epic battle between robots and dinosaurs',
                                        ].map((example) => (
                                            <button
                                                key={example}
                                                onClick={() => setPrompt(example)}
                                                className="px-3 py-1.5 text-sm bg-secondary hover:bg-border-light rounded-full text-muted hover:text-primary transition-colors hover:cursor-pointer"
                                            >
                                                {example}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Step 2: Style */}
                        {currentStep === 1 && (
                            <Card padding="lg">
                                <h2 className="text-xl font-semibold text-primary mb-2">Choose your style</h2>
                                <p className="text-muted mb-6">Select the visual style for your video.</p>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {VISUAL_STYLES.map((s) => {
                                        const IconComponent = iconMap[s.icon];
                                        
                                        return (
                                            <div
                                                key={s.id}
                                                onClick={() => setStyle(s.id)}
                                                className={`
                        p-4 rounded-xl border-2 cursor-pointer transition-all text-center
                        ${style === s.id
                                                        ? 'border-accent bg-accent/5 shadow-md'
                                                        : 'border-border hover:border-muted-light'
                                                    }
                      `}
                                            >
                                                <div className="flex justify-center mb-2">
                                                    {IconComponent && <IconComponent className="w-8 h-8 text-primary" />}
                                                </div>
                                                <p className="font-medium text-primary text-sm">{s.name}</p>
                                                <p className="text-xs text-muted mt-1">{s.description}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </Card>
                        )}

                        {/* Step 3: Settings */}
                        {currentStep === 2 && (
                            <Card padding="lg">
                                <h2 className="text-xl font-semibold text-primary mb-2">Configure settings</h2>
                                <p className="text-muted mb-6">Choose duration and format for your video.</p>

                                {/* Duration */}
                                <div className="mb-8">
                                    <h3 className="font-medium text-primary mb-4">Duration</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {DURATION_OPTIONS.map((opt) => (
                                            <div
                                                key={opt.value}
                                                onClick={() => setDuration(opt.value)}
                                                className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all text-center
                          ${duration === opt.value
                                                        ? 'border-accent bg-accent/5'
                                                        : 'border-border hover:border-muted-light'
                                                    }
                        `}
                                            >
                                                <p className="text-2xl font-bold text-primary">{opt.label}</p>
                                                <p className="text-sm text-muted mt-1">{opt.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Aspect Ratio */}
                                <div>
                                    <h3 className="font-medium text-primary mb-4">Aspect Ratio</h3>
                                    <div className="grid grid-cols-3 gap-4">
                                        {ASPECT_RATIO_OPTIONS.map((opt) => (
                                            <div
                                                key={opt.value}
                                                onClick={() => setAspectRatio(opt.value)}
                                                className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all text-center
                          ${aspectRatio === opt.value
                                                        ? 'border-accent bg-accent/5'
                                                        : 'border-border hover:border-muted-light'
                                                    }
                        `}
                                            >
                                                <p className="text-xl font-bold text-primary">{opt.label}</p>
                                                <p className="text-sm text-muted mt-1">{opt.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                <div className="mt-8 p-4 bg-secondary rounded-xl">
                                    <h3 className="font-medium text-primary mb-3">Summary</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted">Style</span>
                                            <span className="text-primary font-medium">
                                                {VISUAL_STYLES.find(s => s.id === style)?.name}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted">Duration</span>
                                            <span className="text-primary font-medium">{duration}s</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted">Aspect Ratio</span>
                                            <span className="text-primary font-medium">{aspectRatio}</span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        )}

                        {/* Step 4: Generating */}
                        {currentStep === 3 && (
                            <Card padding="lg" className="text-center">
                                <h2 className="text-xl font-semibold text-primary mb-2">Creating your video</h2>
                                <p className="text-muted mb-8">Please wait while we work our magic...</p>

                                <ProgressBar progress={progress} size="lg" className="mb-8" />

                                <StageProgress stages={stages} currentStage={currentStage} />

                                {error && (
                                    <div className="mt-6 p-4 bg-error/10 rounded-xl">
                                        <p className="text-error">{error}</p>
                                        <Button variant="secondary" className="mt-4\" onClick={() => setCurrentStep(2)}>
                                            Try Again
                                        </Button>
                                    </div>
                                )}
                            </Card>
                        )}

                        {/* Step 5: Complete */}
                        {currentStep === 4 && (
                            <Card padding="lg" className="text-center">
                                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Check className="w-8 h-8 text-success" />
                                </div>
                                <h2 className="text-xl font-semibold text-primary mb-2">Your video is ready!</h2>
                                <p className="text-muted mb-6">Your story has been brought to life.</p>

                                {/* Video Preview */}
                                {videoUrl && (
                                    <div className="aspect-video bg-black rounded-xl overflow-hidden mb-6">
                                        <video
                                            src={videoUrl}
                                            controls
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Button onClick={handleDownload}>
                                        <Download className="w-4 h-4 mr-2" />
                                        Download
                                    </Button>
                                    <Button variant="secondary" onClick={handleShare}>
                                        <Share2 className="w-4 h-4 mr-2" />
                                        Share
                                    </Button>
                                    <Button variant="ghost" onClick={handleCreateAnother}>
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        Create Another
                                    </Button>
                                </div>
                            </Card>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                {currentStep < 3 && (
                    <div className="flex justify-between mt-6">
                        <Button
                            variant="ghost"
                            onClick={handleBack}
                            disabled={currentStep === 0}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <Button
                            onClick={handleNext}
                            disabled={!canProceed()}
                        >
                            {currentStep === 2 ? 'Generate Video' : 'Next'}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
