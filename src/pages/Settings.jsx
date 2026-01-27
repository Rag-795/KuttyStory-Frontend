import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Camera, Trash2, Save, Settings as SettingsIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/common/Modal';
import { useAuthStore } from '../stores/authStore';
import { useVideoStore } from '../stores/videoStore';
import { VISUAL_STYLES, DURATION_OPTIONS, ASPECT_RATIO_OPTIONS, iconMap } from '../config/visualStyles';

export default function Settings() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const { videos } = useVideoStore();

    const [activeTab, setActiveTab] = useState('account');
    const [deleteModal, setDeleteModal] = useState(false);

    // Form states
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [defaultStyle, setDefaultStyle] = useState('cinematic');
    const [defaultDuration, setDefaultDuration] = useState(30);
    const [defaultAspectRatio, setDefaultAspectRatio] = useState('9:16');

    const tabs = [
        { id: 'account', label: 'Account', icon: User },
        { id: 'preferences', label: 'Preferences', icon: SettingsIcon },
    ];

    const handleSaveProfile = () => {
        // Would update Firebase user profile
        toast.success('Profile updated successfully!');
    };

    const handleSavePreferences = () => {
        // Would save to local storage or Firestore
        localStorage.setItem('kuttyStoryPreferences', JSON.stringify({
            defaultStyle,
            defaultDuration,
            defaultAspectRatio,
        }));
        toast.success('Preferences saved!');
    };

    const handleDeleteAccount = async () => {
        // Would delete user account and all data
        toast.error('Account deletion is not implemented yet');
        setDeleteModal(false);
    };

    return (
        <div className="min-h-screen bg-surface py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-2xl font-bold text-primary mb-8">Settings</h1>

                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Sidebar Tabs */}
                        <div className="md:w-48 shrink-0">
                            <nav className="space-y-1">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium hover:cursor-pointer transition-colors
                        ${activeTab === tab.id
                                                    ? 'bg-primary text-white'
                                                    : 'text-muted hover:bg-secondary hover:text-primary'
                                                }
                      `}
                                        >
                                            <Icon className="w-5 h-5" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                            {/* Account Tab */}
                            {activeTab === 'account' && (
                                <div className="space-y-6">
                                    {/* Profile Settings */}
                                    <Card padding="lg">
                                        <h2 className="text-lg font-semibold text-primary mb-6">Profile Settings</h2>

                                        {/* Avatar */}
                                        <div className="flex items-center gap-6 mb-6">
                                            <div className="relative">
                                                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-white text-2xl font-semibold overflow-hidden">
                                                    {user?.photoURL ? (
                                                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        user?.displayName?.charAt(0)?.toUpperCase() || 'U'
                                                    )}
                                                </div>
                                                <button className="absolute bottom-0 right-0 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center shadow-lg hover:bg-accent-hover transition-colors">
                                                    <Camera className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div>
                                                <p className="font-medium text-primary">{user?.displayName || 'User'}</p>
                                                <p className="text-sm text-muted">{user?.email}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <Input
                                                label="Display Name"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                leftIcon={<User className="w-5 h-5" />}
                                            />

                                            <Input
                                                label="Email"
                                                value={user?.email || ''}
                                                disabled
                                                leftIcon={<Mail className="w-5 h-5" />}
                                            />

                                            <Button onClick={handleSaveProfile}>
                                                Save Changes
                                            </Button>
                                        </div>
                                    </Card>

                                    {/* Reset Password */}
                                    <Card padding="lg">
                                        <h2 className="text-lg font-semibold text-primary mb-4">Password</h2>
                                        <p className="text-sm text-muted mb-4">
                                            Need to change your password? We'll send you a reset link.
                                        </p>
                                        <Button variant="secondary" onClick={() => navigate('/forgot-password')}>
                                            <Lock className="w-4 h-4 mr-2" />
                                            Reset Password
                                        </Button>
                                    </Card>

                                    {/* Danger Zone */}
                                    <Card padding="lg" className="border-error/20">
                                        <h2 className="text-lg font-semibold text-error mb-4">Danger Zone</h2>
                                        <p className="text-sm text-muted mb-4">
                                            Once you delete your account, there is no going back. Please be certain.
                                        </p>
                                        <Button variant="danger" onClick={() => setDeleteModal(true)}>
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Account
                                        </Button>
                                    </Card>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <Card padding="lg">
                                    <h2 className="text-lg font-semibold text-primary mb-6">Default Preferences</h2>

                                    <div className="space-y-6">
                                        {/* Default Style */}
                                        <div>
                                            <label className="block text-sm font-medium text-primary mb-3">Default Visual Style</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {VISUAL_STYLES.slice(0, 4).map((style) => {
                                                    const IconComponent = iconMap[style.icon];
                                                    
                                                    return (
                                                        <button
                                                            key={style.id}
                                                            onClick={() => setDefaultStyle(style.id)}
                                                            className={`
                              p-3 rounded-lg border-2 text-center transition-all
                              ${defaultStyle === style.id
                                                                    ? 'border-accent bg-accent/5'
                                                                    : 'border-border hover:border-muted-light'
                                                                }
                            `}
                                                        >
                                                            <div className="flex justify-center mb-1">
                                                                {IconComponent && <IconComponent className="w-6 h-6 text-primary" />}
                                                            </div>
                                                            <p className="text-xs font-medium mt-1">{style.name}</p>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* Default Duration */}
                                        <div>
                                            <label className="block text-sm font-medium text-primary mb-3">Default Duration</label>
                                            <div className="flex gap-3">
                                                {DURATION_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setDefaultDuration(opt.value)}
                                                        className={`
                              flex-1 p-3 rounded-lg border-2 text-center transition-all
                              ${defaultDuration === opt.value
                                                                ? 'border-accent bg-accent/5'
                                                                : 'border-border hover:border-muted-light'
                                                            }
                            `}
                                                    >
                                                        <p className="text-lg font-bold">{opt.label}</p>
                                                        <p className="text-xs text-muted">{opt.description}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Default Aspect Ratio */}
                                        <div>
                                            <label className="block text-sm font-medium text-primary mb-3">Default Aspect Ratio</label>
                                            <div className="flex gap-3">
                                                {ASPECT_RATIO_OPTIONS.map((opt) => (
                                                    <button
                                                        key={opt.value}
                                                        onClick={() => setDefaultAspectRatio(opt.value)}
                                                        className={`
                              flex-1 p-3 rounded-lg border-2 text-center transition-all
                              ${defaultAspectRatio === opt.value
                                                                ? 'border-accent bg-accent/5'
                                                                : 'border-border hover:border-muted-light'
                                                            }
                            `}
                                                    >
                                                        <p className="text-lg font-bold">{opt.label}</p>
                                                        <p className="text-xs text-muted">{opt.description}</p>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <Button onClick={handleSavePreferences}>
                                            Save Preferences
                                        </Button>
                                    </div>
                                </Card>
                            )}

                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Delete Account Modal */}
            <Modal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                title="Delete Account"
            >
                <p className="text-muted mb-4">
                    Are you sure you want to delete your account? This will permanently delete:
                </p>
                <ul className="list-disc list-inside text-sm text-muted mb-6 space-y-1">
                    <li>Your profile and settings</li>
                    <li>All your generated videos ({videos.length} videos)</li>
                    <li>Your usage history</li>
                </ul>
                <div className="flex gap-3 justify-end">
                    <Button variant="ghost" onClick={() => setDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteAccount}>
                        Delete Account
                    </Button>
                </div>
            </Modal>
        </div>
    );
}
