import { motion } from 'framer-motion';

function ProgressBarComponent({
    progress = 0,
    showLabel = true,
    size = 'md',
    className = '',
}) {
    const sizes = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3',
    };

    return (
        <div className={`w-full ${className}`}>
            {showLabel && (
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted">Progress</span>
                    <span className="text-sm font-medium text-primary">{Math.round(progress)}%</span>
                </div>
            )}
            <div className={`w-full bg-secondary rounded-full overflow-hidden ${sizes[size]}`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="h-full bg-linear-to-r from-accent to-accent-hover rounded-full"
                />
            </div>
        </div>
    );
}

export function StageProgress({ stages, currentStage }) {
    return (
        <div className="space-y-3">
            {stages.map((stage, index) => {
                const isCompleted = index < currentStage;
                const isActive = index === currentStage;

                return (
                    <div key={stage.id || index} className="flex items-center gap-3">
                        <div
                            className={`
                shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-medium transition-colors
                ${isCompleted ? 'bg-success text-white' : ''}
                ${isActive ? 'bg-accent text-white' : ''}
                ${!isCompleted && !isActive ? 'bg-secondary text-muted' : ''}
              `}
                        >
                            {isCompleted ? '✓' : index + 1}
                        </div>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${isActive ? 'text-primary' : 'text-muted'}`}>
                                {stage.name}
                            </p>
                            {isActive && stage.description && (
                                <p className="text-xs text-muted-light mt-0.5">{stage.description}</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// Support both default and named imports
export const ProgressBar = ProgressBarComponent;
export default ProgressBarComponent;
