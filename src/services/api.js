import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true', // Required for ngrok free tier
    },
    timeout: 300000, // 5 minutes - video generation takes time
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Add auth token if available
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            // Server responded with error status
            console.error('API Error:', error.response.data);
        } else if (error.request) {
            // Request made but no response
            console.error('Network Error:', error.message);
        }
        return Promise.reject(error);
    }
);

// Health check
export const checkHealth = () => api.get('/health');

// Stories API
export const listStories = () => api.get('/api/stories');

export const createStory = (data) => api.post('/api/stories', data);

export const getStory = (storyId) => api.get(`/api/stories/${storyId}`);

// Cancel a running story generation
export const cancelStory = (storyId) => api.delete(`/api/stories/${storyId}`);

// Get the final video for a story
export const getStoryVideo = (storyId) => api.get(`/api/stories/${storyId}/video`);

// Polling helper for video generation
export const pollStoryStatus = async (storyId, onProgress, interval = 2000) => {
    return new Promise((resolve, reject) => {
        const poll = async () => {
            try {
                const response = await getStory(storyId);
                const story = response.data;

                if (onProgress) {
                    onProgress(story);
                }

                if (story.status === 'completed') {
                    resolve(story);
                } else if (story.status === 'failed') {
                    reject(new Error(story.error || 'Video generation failed'));
                } else {
                    setTimeout(poll, interval);
                }
            } catch (error) {
                reject(error);
            }
        };

        poll();
    });
};

export default api;
