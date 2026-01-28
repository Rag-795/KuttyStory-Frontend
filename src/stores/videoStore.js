import { create } from 'zustand';
import {
    getUserVideos,
    getVideoById,
    deleteVideoDocument,
} from '../services/firebase';

export const useVideoStore = create((set, get) => ({
    videos: [],
    currentVideo: null,
    isLoading: false,
    error: null,

    // Fetch all videos for a user
    fetchVideos: async (userId) => {
        set({ isLoading: true, error: null });
        try {
            console.log('Fetching videos for user:', userId);
            const videos = await getUserVideos(userId);
            console.log('Videos fetched:', videos);
            set({ videos, isLoading: false });
        } catch (error) {
            console.error('Error fetching videos:', error);
            set({ error: error.message, isLoading: false, videos: [] });
            throw error;
        }
    },

    // Fetch single video by ID
    fetchVideoById: async (videoId) => {
        set({ isLoading: true, error: null });
        try {
            const video = await getVideoById(videoId);
            set({ currentVideo: video, isLoading: false });
            return video;
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Delete a video
    deleteVideo: async (videoId) => {
        set({ isLoading: true, error: null });
        try {
            await deleteVideoDocument(videoId);
            set((state) => ({
                videos: state.videos.filter((v) => v.id !== videoId),
                isLoading: false,
            }));
        } catch (error) {
            set({ error: error.message, isLoading: false });
            throw error;
        }
    },

    // Add a video to the list
    addVideo: (video) => {
        set((state) => ({
            videos: [video, ...state.videos],
        }));
    },

    // Update a video in the list
    updateVideo: (videoId, updates) => {
        set((state) => ({
            videos: state.videos.map((v) =>
                v.id === videoId ? { ...v, ...updates } : v
            ),
            currentVideo:
                state.currentVideo?.id === videoId
                    ? { ...state.currentVideo, ...updates }
                    : state.currentVideo,
        }));
    },

    // Clear current video
    clearCurrentVideo: () => set({ currentVideo: null }),

    // Clear error
    clearError: () => set({ error: null }),
}));
