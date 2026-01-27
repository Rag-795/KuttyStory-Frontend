import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Film, Eye, Clock, ArrowRight } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { Loader } from '../components/common/Loader';
import { useAuthStore } from '../stores/authStore';
import { useVideoStore } from '../stores/videoStore';

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { videos, isLoading, fetchVideos } = useVideoStore();

    useEffect(() => {
        if (user?.uid) {
            fetchVideos(user.uid);
        }
    }, [user?.uid, fetchVideos]);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning';
        if (hour < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const recentVideos = videos.slice(0, 6);
    const completedVideos = videos.filter(v => v.status === 'completed');
    const generatingVideos = videos.filter(v => v.status === 'generating' || v.status === 'pending');

    return (
        <div className="min-h-screen bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-2xl font-bold text-primary mb-2">
                        {getGreeting()}, {user?.displayName || 'Creator'}! 👋
                    </h1>
                    <p className="text-muted">Ready to create your next masterpiece?</p>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
                >
                    <Card padding="lg" className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Film className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-sm text-muted">Videos Created</p>
                            <p className="text-2xl font-bold text-primary">{videos.length}</p>
                        </div>
                    </Card>

                    <Card padding="lg" className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-muted">In Progress</p>
                            <p className="text-2xl font-bold text-primary">{generatingVideos.length}</p>
                        </div>
                    </Card>
                </motion.div>

                {/* Quick Create Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                >
                    <Card
                        variant="interactive"
                        padding="lg"
                        onClick={() => navigate('/create')}
                        className="bg-linear-to-r from-primary to-gray-800 text-white cursor-pointer"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <Plus className="w-8 h-8" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold mb-1">Create New Story</h2>
                                    <p className="text-white/70">Transform your ideas into stunning videos</p>
                                </div>
                            </div>
                            <ArrowRight className="w-6 h-6" />
                        </div>
                    </Card>
                </motion.div>

                {/* Generation Queue */}
                {generatingVideos.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mb-8"
                    >
                        <h2 className="text-lg font-semibold text-primary mb-4">Currently Generating</h2>
                        <div className="space-y-3">
                            {generatingVideos.map((video) => (
                                <Card key={video.id} padding="md" className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                                            <Film className="w-5 h-5 text-accent" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-primary">{video.title}</p>
                                            <p className="text-sm text-muted">{video.currentStage || 'Processing...'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-accent rounded-full transition-all"
                                                style={{ width: `${video.progress || 0}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-muted w-10">{video.progress || 0}%</span>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Recent Videos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-primary">Recent Videos</h2>
                        {videos.length > 6 && (
                            <Link to="/my-videos" className="text-sm text-accent hover:underline">
                                View all
                            </Link>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center py-12">
                            <Loader text="Loading videos..." />
                        </div>
                    ) : recentVideos.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {recentVideos.map((video) => (
                                <Card
                                    key={video.id}
                                    variant="interactive"
                                    padding="none"
                                    onClick={() => navigate(`/video/${video.id}`)}
                                    className="overflow-hidden cursor-pointer"
                                >
                                    <div className="aspect-video bg-gray-200 relative">
                                        {video.thumbnailUrl ? (
                                            <img
                                                src={video.thumbnailUrl}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200">
                                                <Film className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                        <Badge
                                            variant={video.status === 'completed' ? 'success' : 'warning'}
                                            className="absolute top-2 right-2"
                                        >
                                            {video.status}
                                        </Badge>
                                        <Badge className="absolute bottom-2 left-2">
                                            {video.duration}s
                                        </Badge>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium text-primary truncate">{video.title}</h3>
                                        <p className="text-sm text-muted mt-1">
                                            {video.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                                        </p>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card padding="lg" className="text-center">
                            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Film className="w-8 h-8 text-muted" />
                            </div>
                            <h3 className="font-semibold text-primary mb-2">No videos yet</h3>
                            <p className="text-muted mb-4">Create your first story to get started!</p>
                            <Button onClick={() => navigate('/create')}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Story
                            </Button>
                        </Card>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
