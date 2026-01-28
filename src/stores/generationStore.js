import { create } from 'zustand';
import { createStory, getStory, pollStoryStatus, cancelStory } from '../services/api';
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

// Map backend status to frontend stage index
const STATUS_TO_STAGE_MAP = {
    'pending': 0,
    'writing_story': 0,
    'generating_scenes': 1,
    'generating_images': 2,
    'generating_video': 3,
    'generating_voice': 4,
    'adding_sfx': 5,
    'adding_music': 6,
    'composing_final': 7,
    'completed': 7,
    'failed': -1,
};

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

    // Scene-level progress tracking
    scenes: [], // Array of scene objects from backend
    currentSceneIndex: 0,
    generationPhase: 'initializing', // initializing, generating_audio, generating_video, composing

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

        let firebaseDocId = null;

        try {
            // Create story via backend API with correct field names
            const response = await createStory({
                title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
                baseline_text: prompt,
                style_preset: style,
                aspect_ratio: aspectRatio,
                duration,
            });

            const storyId = response.data.id;
            set({ storyId });

            // Create video document in Firebase for user's library
            firebaseDocId = await createVideoDocument(userId, {
                title: prompt.slice(0, 50) + (prompt.length > 50 ? '...' : ''),
                prompt,
                style,
                duration,
                aspectRatio,
                backendStoryId: storyId,
            });

            // Poll for completion with scene-level progress tracking
            await pollStoryStatus(
                storyId,
                (story) => {
                    const scenes = story.scenes || [];
                    const totalScenes = scenes.length;

                    if (totalScenes === 0) {
                        // Still initializing - no scenes yet
                        set({
                            progress: 5,
                            currentStage: 0,
                            scenes: [],
                            generationPhase: 'initializing',
                        });
                        return;
                    }

                    // Count completed audio and video for each scene
                    let audioCompleted = 0;
                    let videoCompleted = 0;
                    let currentPhase = 'generating_audio';

                    scenes.forEach((scene, index) => {
                        if (scene.audio_path) {
                            audioCompleted++;
                        }
                        if (scene.video_path) {
                            videoCompleted++;
                        }
                    });

                    // Determine current phase
                    if (audioCompleted < totalScenes) {
                        currentPhase = 'generating_audio';
                    } else if (videoCompleted < totalScenes) {
                        currentPhase = 'generating_video';
                    } else {
                        currentPhase = 'composing';
                    }

                    // Calculate progress:
                    // - Story creation: 10%
                    // - Audio generation: 30% (10-40%)
                    // - Video generation: 50% (40-90%)
                    // - Final composition: 10% (90-100%)
                    let progress = 10; // Base for story created

                    if (totalScenes > 0) {
                        // Audio progress (30% of total)
                        progress += Math.round((audioCompleted / totalScenes) * 30);

                        // Video progress (50% of total)
                        progress += Math.round((videoCompleted / totalScenes) * 50);
                    }

                    // Find current scene being processed
                    let currentSceneIndex = 0;
                    if (currentPhase === 'generating_audio') {
                        currentSceneIndex = audioCompleted;
                    } else if (currentPhase === 'generating_video') {
                        currentSceneIndex = videoCompleted;
                    } else {
                        currentSceneIndex = totalScenes - 1;
                    }

                    // Map phase to stage
                    const stageMap = {
                        'initializing': 0,
                        'generating_audio': 4, // "Adding Voice"
                        'generating_video': 3, // "Animating Scenes"
                        'composing': 7, // "Final Touches"
                    };

                    set({
                        progress: Math.min(progress, 99),
                        currentStage: stageMap[currentPhase] || 0,
                        scenes,
                        currentSceneIndex: Math.min(currentSceneIndex, totalScenes - 1),
                        generationPhase: currentPhase,
                    });
                },
                3000 // Poll every 3 seconds
            );

            // Get final story data
            const finalStory = await getStory(storyId);
            let videoUrl = finalStory.data.video_url;

            // Construct full URL if backend returns relative path
            if (videoUrl && videoUrl.startsWith('/')) {
                const baseUrl = import.meta.env.VITE_API_URL || 'https://proindustry-expansible-terina.ngrok-free.dev';
                videoUrl = `${baseUrl}${videoUrl}`;
            }

            // Update Firebase document with completed video
            if (firebaseDocId) {
                await updateVideoDocument(firebaseDocId, {
                    status: 'completed',
                    videoUrl,
                    backendStoryId: storyId,
                });
            }

            set({
                status: 'completed',
                progress: 100,
                currentStage: GENERATION_STAGES.length - 1,
                videoUrl,
            });

            return { storyId, videoUrl };
        } catch (error) {
            // Update Firebase document with failed status
            if (firebaseDocId) {
                await updateVideoDocument(firebaseDocId, {
                    status: 'failed',
                    error: error.message,
                });
            }

            set({
                status: 'failed',
                error: error.message || 'Failed to generate video',
            });
            return null;
        }
    },

    // Cancel ongoing generation
    cancelGeneration: async () => {
        const { storyId, status } = get();

        if (status !== 'generating' || !storyId) {
            return false;
        }

        try {
            await cancelStory(storyId);
            set({
                status: 'idle',
                progress: 0,
                currentStage: 0,
                storyId: null,
                error: null,
                scenes: [],
                currentSceneIndex: 0,
                generationPhase: 'initializing',
            });
            return true;
        } catch (error) {
            console.error('Failed to cancel generation:', error);
            return false;
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
            scenes: [],
            currentSceneIndex: 0,
            generationPhase: 'initializing',
        });
    },

    // Clear error
    clearError: () => set({ error: null }),
}));
