import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Grid, List, Film, MoreVertical, Trash2, Download, Share2, AlertCircle } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import Modal from '../components/common/Modal';
import { Loader } from '../components/common/Loader';
import { useAuthStore } from '../stores/authStore';
import { useVideoStore } from '../stores/videoStore';
import toast from 'react-hot-toast';

const FILTERS = ['All', 'Completed', 'In Progress', 'Failed'];
const SORTS = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'views', label: 'Most Viewed' },
];

export default function MyVideos() {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const { videos, isLoading, fetchVideos, deleteVideo, error } = useVideoStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [sortBy, setSortBy] = useState('newest');
    const [viewMode, setViewMode] = useState('grid');
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, video: null });

    useEffect(() => {
        if (user?.uid) {
            console.log('Fetching videos for user:', user.uid);
            fetchVideos(user.uid).catch(err => {
                console.error('Failed to fetch videos:', err);
                toast.error('Failed to load videos');
            });
        }
    }, [user?.uid, fetchVideos]);

    const getFilteredVideos = () => {
        let filtered = [...videos];

        // Filter by status
        if (activeFilter !== 'All') {
            const statusMap = {
                'Completed': 'completed',
                'In Progress': 'generating',
                'Failed': 'failed',
            };
            filtered = filtered.filter(v =>
                activeFilter === 'In Progress'
                    ? v.status === 'generating' || v.status === 'pending'
                    : v.status === statusMap[activeFilter]
            );
        }

        // Filter by search
        if (searchQuery) {
            filtered = filtered.filter(v =>
                v.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.prompt?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Sort
        filtered.sort((a, b) => {
            if (sortBy === 'newest') {
                return (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0);
            } else if (sortBy === 'oldest') {
                return (a.createdAt?.toMillis?.() || 0) - (b.createdAt?.toMillis?.() || 0);
            } else if (sortBy === 'views') {
                return (b.views || 0) - (a.views || 0);
            }
            return 0;
        });

        return filtered;
    };

    const handleDelete = async () => {
        if (deleteModal.video) {
            try {
                await deleteVideo(deleteModal.video.id);
                toast.success('Video deleted successfully');
                setDeleteModal({ isOpen: false, video: null });
            } catch (err) {
                toast.error('Failed to delete video');
            }
        }
    };

    const filteredVideos = getFilteredVideos();

    return (
        <div className="min-h-screen bg-surface py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-2xl font-bold text-primary">My Videos</h1>
                        <p className="text-muted">{videos.length} videos created</p>
                    </div>
                    <Button onClick={() => navigate('/create')}>
                        Create New
                    </Button>
                </motion.div>

                {/* Filters and Search */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="space-y-4 mb-6"
                >
                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        {FILTERS.map((filter) => (
                            <button
                                key={filter}
                                onClick={() => setActiveFilter(filter)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === filter
                                    ? 'bg-primary text-white'
                                    : 'bg-secondary text-muted hover:text-primary'
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}
                    </div>

                    {/* Search and Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search videos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                leftIcon={<Search className="w-5 h-5" />}
                            />
                        </div>
                        <div className="flex gap-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-border bg-white text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent/20"
                            >
                                {SORTS.map((sort) => (
                                    <option key={sort.value} value={sort.value}>
                                        {sort.label}
                                    </option>
                                ))}
                            </select>
                            <div className="flex border border-border rounded-lg overflow-hidden">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-muted hover:bg-secondary'}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-muted hover:bg-secondary'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Videos Grid/List */}
                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <Loader size="lg" text="Loading your videos..." />
                    </div>
                ) : error ? (
                    <Card padding="lg" className="text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-error" />
                        </div>
                        <h3 className="font-semibold text-primary mb-2">
                            Failed to load videos
                        </h3>
                        <p className="text-muted mb-4">
                            {error}
                        </p>
                        <Button onClick={() => fetchVideos(user?.uid)}>
                            Try Again
                        </Button>
                    </Card>
                ) : filteredVideos.length > 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className={viewMode === 'grid'
                            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
                            : 'space-y-3'
                        }
                    >
                        {filteredVideos.map((video) => (
                            viewMode === 'grid' ? (
                                <Card
                                    key={video.id}
                                    variant="interactive"
                                    padding="none"
                                    className="overflow-hidden group"
                                >
                                    <div
                                        onClick={() => navigate(`/video/${video.id}`)}
                                        className="cursor-pointer"
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
                                                variant={
                                                    video.status === 'completed' ? 'success' :
                                                        video.status === 'failed' ? 'error' : 'warning'
                                                }
                                                className="absolute top-2 right-2"
                                            >
                                                {video.status}
                                            </Badge>
                                            <div className="absolute bottom-2 left-2 flex gap-2">
                                                <Badge>{video.duration}s</Badge>
                                                <Badge>{video.aspectRatio}</Badge>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-primary truncate">{video.title}</h3>
                                                <p className="text-sm text-muted">
                                                    {video.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'}
                                                </p>
                                            </div>
                                            <div className="relative group/menu">
                                                <button
                                                    className="p-1 rounded hover:bg-secondary"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                    }}
                                                >
                                                    <MoreVertical className="w-5 h-5 text-muted" />
                                                </button>
                                                <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-border rounded-lg shadow-lg py-1 opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10">
                                                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2">
                                                        <Download className="w-4 h-4" /> Download
                                                    </button>
                                                    <button className="w-full px-3 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2">
                                                        <Share2 className="w-4 h-4" /> Share
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal({ isOpen: true, video })}
                                                        className="w-full px-3 py-2 text-left text-sm text-error hover:bg-red-50 flex items-center gap-2"
                                                    >
                                                        <Trash2 className="w-4 h-4" /> Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card
                                    key={video.id}
                                    padding="md"
                                    className="flex items-center gap-4 cursor-pointer hover:bg-secondary/50 transition-colors"
                                    onClick={() => navigate(`/video/${video.id}`)}
                                >
                                    <div className="w-20 h-14 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                                        {video.thumbnailUrl ? (
                                            <img src={video.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Film className="w-6 h-6 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-primary truncate">{video.title}</h3>
                                        <p className="text-sm text-muted">
                                            {video.createdAt?.toDate?.()?.toLocaleDateString() || 'Recently'} • {video.duration}s
                                        </p>
                                    </div>
                                    <Badge
                                        variant={
                                            video.status === 'completed' ? 'success' :
                                                video.status === 'failed' ? 'error' : 'warning'
                                        }
                                    >
                                        {video.status}
                                    </Badge>
                                </Card>
                            )
                        ))}
                    </motion.div>
                ) : (
                    <Card padding="lg" className="text-center">
                        <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Film className="w-8 h-8 text-muted" />
                        </div>
                        <h3 className="font-semibold text-primary mb-2">
                            {searchQuery || activeFilter !== 'All' ? 'No videos found' : 'No videos yet'}
                        </h3>
                        <p className="text-muted mb-4">
                            {searchQuery || activeFilter !== 'All'
                                ? 'Try adjusting your filters or search query'
                                : 'Create your first story to get started!'
                            }
                        </p>
                        {!searchQuery && activeFilter === 'All' && (
                            <Button onClick={() => navigate('/create')}>
                                Create Story
                            </Button>
                        )}
                    </Card>
                )}
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, video: null })}
                title="Delete Video"
            >
                <p className="text-muted mb-6">
                    Are you sure you want to delete "{deleteModal.video?.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={() => setDeleteModal({ isOpen: false, video: null })}>
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
