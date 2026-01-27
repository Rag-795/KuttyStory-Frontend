import { create } from 'zustand';
import { createStory, getStory, pollStoryStatus } from '../services/api';
import { createVideoDocument, updateVideoDocument } from '../services/firebase';

const GENERATION_STAGES = [
    { id: 'story', name: 'Writing Your Story', description: 'Crafting the narrative...' },
    { id: 'scenes', name: 'Setting the Scene', description: 'Breaking down into scenes...' },
    { id: 'images', name: 'Painting Frames', description: 'Generating images for each scene...' },
    { id: 'video', name: 'Animating Scenes', description: 'Converting images to video...' },
    { id: 'voice', name: 'Adding Voice', description: 'Generating narration...' },
    { id: 'sfx', name: 'Adding Atmosphere', description: 'Adding ambient sounds...' },
    { id: 'music', name: 'Composing Score', description: 'Selecting background music...' },
    { id: 'final', name: 'Final Touches', description: 'Assembling the final video...' },
];

export const useGenerationStore = create((set, get) => ({
    // Form state
    prompt: '',
    style: 'cinematic',
    duration: 30,
    aspectRatio: '9:16',

    // Generation state
    status: 'idle', // idle, generating, completed, failed
    progress: 0,
    currentStage: 0,
    storyId: null,
    videoUrl: null,
    error: null,
    stages: GENERATION_STAGES,

    // Form setters
    setPrompt: (prompt) => set({ prompt }),
    setStyle: (style) => set({ style }),
    setDuration: (duration) => set({ duration }),
    setAspectRatio: (aspectRatio) => set({ aspectRatio }),

    // Start generation
    startGeneration: async (userId) => {
        const { prompt, style, duration, aspectRatio } = get();

        if (!prompt.trim()) {
            set({ error: 'Please enter a story prompt' });
            return null;
        }

        set({
            status: 'generating',
            progress: 0,
            currentStage: 0,
            error: null,
            videoUrl: null,
        });

        try {
            // Create story via backend API
            const response = await createStory({
                prompt,
                style,
                duration,
                aspectRatio,
            });

            const storyId = response.data.id || response.data.story_id;
            set({ storyId });

            // Create video document in Firebase
            await createVideoDocument(userId, {
                title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
                prompt,
                style,
                duration,
                aspectRatio,
            });

            // Poll for completion
            await pollStoryStatus(
                storyId,
                (story) => {
                    // Update progress based on story status
                    const progress = story.progress || 0;
                    const stageIndex = Math.floor((progress / 100) * GENERATION_STAGES.length);

                    set({
                        progress,
                        currentStage: Math.min(stageIndex, GENERATION_STAGES.length - 1),
                    });
                },
                2000
            );

            // Get final story data
            const finalStory = await getStory(storyId);
            const videoUrl = finalStory.data.video_url || finalStory.data.videoUrl;

            set({
                status: 'completed',
                progress: 100,
                currentStage: GENERATION_STAGES.length - 1,
                videoUrl,
            });

            return { storyId, videoUrl };
        } catch (error) {
            set({
                status: 'failed',
                error: error.message || 'Failed to generate video',
            });
            return null;
        }
    },

    // Reset generation state
    resetGeneration: () => {
        set({
            prompt: '',
            style: 'cinematic',
            duration: 30,
            aspectRatio: '9:16',
            status: 'idle',
            progress: 0,
            currentStage: 0,
            storyId: null,
            videoUrl: null,
            error: null,
        });
    },

    // Clear error
    clearError: () => set({ error: null }),
}));
