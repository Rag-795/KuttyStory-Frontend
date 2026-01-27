import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Share2, Trash2, RotateCcw, Eye, Clock, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Modal from '../components/common/Modal';
import { Loader } from '../components/common/Loader';
import { useVideoStore } from '../stores/videoStore';
import { VISUAL_STYLES } from '../config/visualStyles';

export default function VideoView() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentVideo, isLoading, fetchVideoById, deleteVideo, clearCurrentVideo } = useVideoStore();

    const [showPrompt, setShowPrompt] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);

    useEffect(() => {
        if (id) {
            fetchVideoById(id);
        }
        return () => clearCurrentVideo();
    }, [id, fetchVideoById, clearCurrentVideo]);

    const handleDownload = () => {
        if (currentVideo?.videoUrl) {
            window.open(currentVideo.videoUrl, '_blank');
            toast.success('Download started!');
        }
    };

    const handleShare = async () => {
        const url = window.location.href;
        if (navigator.share) {
            await navigator.share({
                title: currentVideo?.title,
                url,
            });
        } else {
            navigator.clipboard.writeText(url);
            toast.success('Link copied to clipboard!');
        }
    };

    const handleDelete = async () => {
        try {
            await deleteVideo(id);
            toast.success('Video deleted');
            navigate('/my-videos');
        } catch (err) {
            toast.error('Failed to delete video');
        }
    };

    const handleRegenerate = () => {
        // Would pre-fill the create page with same settings
        navigate('/create');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <Loader size="lg" text="Loading video..." />
            </div>
        );
    }

    if (!currentVideo) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <Card padding="lg" className="text-center max-w-md">
                    <h2 className="text-xl font-semibold text-primary mb-2">Video not found</h2>
                    <p className="text-muted mb-4">The video you're looking for doesn't exist or has been deleted.</p>
                    <Button onClick={() => navigate('/my-videos')}>
                        Go to My Videos
                    </Button>
                </Card>
            </div>
        );
    }

    const videoStyle = VISUAL_STYLES.find(s => s.id === currentVideo.style);

    return (
        <div className="min-h-screen bg-surface py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-6"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-muted hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back
                    </button>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Video Player */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-2"
                    >
                        <Card padding="none" className="overflow-hidden">
                            <div
                                className={`bg-black ${currentVideo.aspectRatio === '9:16' ? 'aspect-9/16 max-h-[70vh] mx-auto' :
                                    currentVideo.aspectRatio === '1:1' ? 'aspect-square' :
                                        'aspect-video'
                                    }`}
                            >
                                {currentVideo.videoUrl ? (
                                    <video
                                        src={currentVideo.videoUrl}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white">
                                        <p>Video processing...</p>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-3 mt-4">
                            <Button onClick={handleDownload} disabled={!currentVideo.videoUrl}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                            <Button variant="secondary" onClick={handleShare}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                            <Button variant="ghost" onClick={handleRegenerate}>
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Regenerate
                            </Button>
                            <Button variant="danger" onClick={() => setDeleteModal(true)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </div>
                    </motion.div>

                    {/* Details Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-4"
                    >
                        {/* Title & Status */}
                        <Card padding="lg">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-xl font-semibold text-primary">{currentVideo.title}</h1>
                                <Badge
                                    variant={
                                        currentVideo.status === 'completed' ? 'success' :
                                            currentVideo.status === 'failed' ? 'error' : 'warning'
                                    }
                                >
                                    {currentVideo.status}
                                </Badge>
                            </div>

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3 text-muted">
                                    <Calendar className="w-4 h-4" />
                                    <span>{currentVideo.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted">
                                    <Clock className="w-4 h-4" />
                                    <span>{currentVideo.duration} seconds</span>
                                </div>
                                <div className="flex items-center gap-3 text-muted">
                                    <Eye className="w-4 h-4" />
                                    <span>{currentVideo.views || 0} views</span>
                                </div>
                            </div>
                        </Card>

                        {/* Settings */}
                        <Card padding="lg">
                            <h3 className="font-medium text-primary mb-4">Settings</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Style</span>
                                    <span className="text-primary font-medium flex items-center gap-1">
                                        {videoStyle?.icon} {videoStyle?.name || currentVideo.style}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Duration</span>
                                    <span className="text-primary font-medium">{currentVideo.duration}s</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted">Aspect Ratio</span>
                                    <span className="text-primary font-medium">{currentVideo.aspectRatio}</span>
                                </div>
                            </div>
                        </Card>

                        {/* Prompt */}
                        <Card padding="lg">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-medium text-primary">Original Prompt</h3>
                                <button
                                    onClick={() => setShowPrompt(!showPrompt)}
                                    className="text-sm text-accent hover:underline"
                                >
                                    {showPrompt ? 'Hide' : 'Show'}
                                </button>
                            </div>
                            {showPrompt && (
                                <p className="text-sm text-muted leading-relaxed">
                                    {currentVideo.prompt}
                                </p>
                            )}
                        </Card>

                        {/* Story */}
                        {currentVideo.story && (
                            <Card padding="lg">
                                <h3 className="font-medium text-primary mb-3">Generated Story</h3>
                                <p className="text-sm text-muted leading-relaxed">
                                    {currentVideo.story}
                                </p>
                            </Card>
                        )}
                    </motion.div>
                </div>
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Delete Video"
            >
                <p className="text-muted mb-6">
                    Are you sure you want to delete this video? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={() => setDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
