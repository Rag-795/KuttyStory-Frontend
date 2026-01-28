import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Download, Share2, RotateCcw, X, Mic, Film, AlertCircle } from 'lucide-react';
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
        scenes, currentSceneIndex, generationPhase,
        startGeneration, resetGeneration, cancelGeneration,
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

    const handleCancel = async () => {
        const cancelled = await cancelGeneration();
        if (cancelled) {
            toast.success('Generation cancelled');
            setCurrentStep(2);
        } else {
            toast.error('Could not cancel generation');
        }
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
                            <Card padding="lg">
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-semibold text-primary mb-2">Creating your video</h2>
                                    <p className="text-muted">Please wait while we work our magic...</p>
                                </div>

                                <ProgressBar progress={progress} size="lg" className="mb-6" />

                                {/* Phase indicator */}
                                <div className="text-center mb-6">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-sm font-medium text-primary">
                                        {generationPhase === 'initializing' && 'Initializing story...'}
                                        {generationPhase === 'generating_audio' && (
                                            <><Mic className="w-4 h-4 text-accent" /> Generating audio narration...</>
                                        )}
                                        {generationPhase === 'generating_video' && (
                                            <><Film className="w-4 h-4 text-accent" /> Generating video scenes...</>
                                        )}
                                        {generationPhase === 'composing' && 'Composing final video...'}
                                    </span>
                                </div>

                                {/* Scene-level progress */}
                                {scenes.length > 0 && (
                                    <div className="space-y-3 max-h-64 overflow-y-auto">
                                        {scenes.map((scene, index) => (
                                            <div
                                                key={scene.scene || index}
                                                className={`p-4 rounded-xl border transition-all ${index === currentSceneIndex && status === 'generating'
                                                    ? 'border-accent bg-accent/5'
                                                    : 'border-border bg-secondary/30'
                                                    }`}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <span className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-primary">
                                                            {scene.scene || index + 1}
                                                        </span>
                                                        <div className="text-left">
                                                            <p className="text-sm font-medium text-primary truncate max-w-xs">
                                                                {(typeof scene.visual_description === 'string' ? scene.visual_description : scene.narration || `Scene ${index + 1}`)?.slice(0, 50)}...
                                                            </p>
                                                            <p className="text-xs text-muted">
                                                                {scene.duration}s duration
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {/* Audio status */}
                                                        {/* <div
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${scene.audio_path
                                                                ? 'bg-success/10 text-success'
                                                                : 'bg-secondary text-muted'
                                                                }`}
                                                        >
                                                            <Mic className="w-3 h-3" />
                                                            {scene.audio_path ? 'Done' : 'Pending'}
                                                        </div> */}
                                                        {/* Video status */}
                                                        <div
                                                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${scene.video_path
                                                                ? 'bg-success/10 text-success'
                                                                : scene.video_error
                                                                    ? 'bg-error/10 text-error'
                                                                    : 'bg-secondary text-muted'
                                                                }`}
                                                        >
                                                            {scene.video_error ? (
                                                                <AlertCircle className="w-3 h-3" />
                                                            ) : (
                                                                <Film className="w-3 h-3" />
                                                            )}
                                                            {scene.video_path ? 'Done' : scene.video_error ? 'Error' : 'Pending'}
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Show error message if any */}
                                                {scene.video_error && (
                                                    <p className="text-xs text-error mt-2 text-left">
                                                        {scene.video_error}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Fallback stage progress when no scenes yet */}
                                {scenes.length === 0 && (
                                    <StageProgress stages={stages} currentStage={currentStage} />
                                )}

                                {/* Cancel Button */}
                                {status === 'generating' && !error && (
                                    <div className="mt-8 text-center">
                                        <Button
                                            variant="ghost"
                                            onClick={handleCancel}
                                            className="text-muted hover:text-error"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancel Generation
                                        </Button>
                                    </div>
                                )}

                                {error && (
                                    <div className="mt-6 p-4 bg-error/10 rounded-xl text-center">
                                        <p className="text-error">{error}</p>
                                        <Button variant="secondary" className="mt-4" onClick={() => setCurrentStep(2)}>
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
