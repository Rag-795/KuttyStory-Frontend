import {
    Clapperboard,
    Zap,
    Brush,
    Hourglass,
    Wand2,
    Tv,
    MessageSquare,
    Maximize,
    BookOpen,
    Ghost,
    GraduationCap,
    Rocket
} from 'lucide-react';

// Note: Ensure your mapping component imports these icons from lucide-react
// and renders them dynamically, e.g., const Icon = Icons[style.icon];

export const VISUAL_STYLES = [
    {
        id: 'cinematic',
        name: 'Cinematic',
        description: 'Photorealistic movie-like visuals',
        icon: 'Clapperboard',
    },
    {
        id: 'anime',
        name: 'Anime',
        description: 'Japanese animation style with vibrant colors',
        icon: 'Zap',
    },
    {
        id: 'watercolor',
        name: 'Watercolor',
        description: 'Soft, artistic painted look',
        icon: 'Brush',
    },
    {
        id: 'noir',
        name: 'Noir',
        description: 'Black and white with dramatic shadows',
        icon: 'Hourglass',
    },
    {
        id: 'fantasy',
        name: 'Fantasy',
        description: 'Magical and ethereal visuals',
        icon: 'Wand2',
    },
    {
        id: 'vintage',
        name: 'Vintage',
        description: 'Retro film look with warm tones',
        icon: 'Tv',
    },
    {
        id: 'comic',
        name: 'Comic Book',
        description: 'Bold lines and pop art colors',
        icon: 'MessageSquare',
    },
    {
        id: 'minimalist',
        name: 'Minimalist',
        description: 'Clean, simple, modern visuals',
        icon: 'Maximize',
    },
];

export const DURATION_OPTIONS = [
    { value: 15, label: '15s', description: 'Quick Tale' },
    { value: 30, label: '30s', description: 'Short Story' },
    { value: 60, label: '60s', description: 'Mini Movie' },
];

export const ASPECT_RATIO_OPTIONS = [
    { value: '9:16', label: '9:16', description: 'Vertical (Reels/Shorts)' },
    { value: '1:1', label: '1:1', description: 'Square (Instagram)' },
];

export const QUICK_ACTIONS = [
    {
        id: 'bedtime',
        title: 'Bedtime Story',
        subtitle: 'For Kids',
        icon: 'BookOpen',
        prompt: 'Create a magical bedtime story for children about',
    },
    {
        id: 'horror',
        title: 'Spooky Tale',
        subtitle: 'Ghost Stories',
        icon: 'Ghost',
        prompt: 'Create a suspenseful and spooky ghost story about',
    },
    {
        id: 'fable',
        title: 'Moral Fable',
        subtitle: 'Educational',
        icon: 'GraduationCap',
        prompt: 'Create a short fable with a moral lesson regarding',
    },
    {
        id: 'scifi',
        title: 'Sci-Fi Adventure',
        subtitle: 'Futuristic',
        icon: 'Rocket',
        prompt: 'Create a futuristic science fiction adventure story involving',
    },
];

// Icon mapping for use in components
export const iconMap = {
    // Visual Styles
    Clapperboard,
    Zap,
    Brush,
    Hourglass,
    Wand2,
    Tv,
    MessageSquare,
    Maximize,
    // Quick Actions
    BookOpen,
    Ghost,
    GraduationCap,
    Rocket,
};
