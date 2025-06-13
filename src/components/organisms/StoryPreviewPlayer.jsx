import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import DecisionPoint from '@/components/molecules/DecisionPoint';
import ApperIcon from '@/components/ApperIcon';
import { audioService } from '@/services';

const StoryPreviewPlayer = ({ story, onExit }) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showDecisions, setShowDecisions] = useState(false);
  const [playbackHistory, setPlaybackHistory] = useState([]);

  const currentScene = story?.scenes?.[currentSceneIndex];
  const totalScenes = story?.scenes?.length || 0;

  useEffect(() => {
    if (currentScene) {
      // Auto-show decisions after a delay if scene has them
      if (currentScene.decisions && currentScene.decisions.length > 0) {
        const timer = setTimeout(() => {
          setShowDecisions(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [currentScene]);

  const playAudio = async () => {
    if (!currentScene?.audioUrl) return;
    
    try {
      setIsPlaying(true);
      await audioService.playAudio(currentScene.audioUrl);
      setIsPlaying(false);
    } catch (error) {
      setIsPlaying(false);
      toast.error('Failed to play audio');
    }
  };

  const handleDecisionSelect = (decision) => {
    if (!decision.targetSceneId) {
      toast.warning('This decision path is not connected yet');
      return;
    }

    // Find target scene index
    const targetIndex = story.scenes.findIndex(scene => scene.id === decision.targetSceneId);
    
    if (targetIndex === -1) {
      toast.error('Target scene not found');
      return;
    }

    // Add to playback history
    setPlaybackHistory(prev => [...prev, {
      sceneIndex: currentSceneIndex,
      decision: decision.text
    }]);

    // Navigate to next scene
    setCurrentSceneIndex(targetIndex);
    setShowDecisions(false);
  };

  const nextScene = () => {
    if (currentSceneIndex < totalScenes - 1) {
      setCurrentSceneIndex(currentSceneIndex + 1);
      setShowDecisions(false);
    }
  };

  const previousScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(currentSceneIndex - 1);
      setShowDecisions(false);
    }
  };

  const restartStory = () => {
    setCurrentSceneIndex(0);
    setShowDecisions(false);
    setPlaybackHistory([]);
  };

  const goBack = () => {
    if (playbackHistory.length > 0) {
      const lastEntry = playbackHistory[playbackHistory.length - 1];
      setCurrentSceneIndex(lastEntry.sceneIndex);
      setPlaybackHistory(prev => prev.slice(0, -1));
      setShowDecisions(false);
    }
  };

  if (!story || !currentScene) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <ApperIcon name="AlertCircle" className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <Text variant="heading" size="xl" className="mb-2">Story not found</Text>
          <Text variant="body" color="gray-600">The story could not be loaded for preview.</Text>
          <Button
            variant="primary"
            size="lg"
            icon="ArrowLeft"
            onClick={onExit}
            className="mt-4"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Header Controls */}
      <div className="flex items-center justify-between p-4 bg-black/80 text-white z-50">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            icon="ArrowLeft"
            onClick={onExit}
            className="text-white hover:bg-white/20"
          >
            Exit Preview
          </Button>
          
          <Text variant="heading" size="lg" className="text-white">
            {story.title}
          </Text>
        </div>

        <div className="flex items-center gap-3">
          {/* Scene Progress */}
          <div className="flex items-center gap-2">
            <Text variant="body" size="sm" className="text-white/80">
              Scene {currentSceneIndex + 1} of {totalScenes}
            </Text>
            <div className="w-24 h-2 bg-white/20 rounded-full">
              <div 
                className="h-full bg-white rounded-full transition-all duration-300"
                style={{ width: `${((currentSceneIndex + 1) / totalScenes) * 100}%` }}
              />
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-2">
            {currentScene.audioUrl && (
              <Button
                variant="ghost"
                size="sm"
                icon={isPlaying ? "Pause" : "Volume2"}
                onClick={playAudio}
                disabled={isPlaying}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? 'Playing...' : 'Play Audio'}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              icon="RotateCcw"
              onClick={restartStory}
              className="text-white hover:bg-white/20"
            >
              Restart
            </Button>
          </div>
        </div>
      </div>

      {/* Scene Display */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            {/* Background */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: currentScene.background 
                  ? `url(${currentScene.background})` 
                  : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
              }}
            />

            {/* Scene Assets */}
            <div className="absolute inset-0">
              {currentScene.assets?.map((sceneAsset, index) => (
                <motion.div
                  key={sceneAsset.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  style={{
                    position: 'absolute',
                    left: sceneAsset.position.x,
                    top: sceneAsset.position.y
                  }}
                  className={sceneAsset.animation ? `character-${sceneAsset.animation}` : ''}
                >
                  <div className="w-24 h-24 rounded-xl overflow-hidden shadow-lg">
                    {sceneAsset.asset?.imageUrl ? (
                      <img
                        src={sceneAsset.asset.imageUrl}
                        alt={sceneAsset.asset.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-white/80 flex items-center justify-center">
                        <ApperIcon name="Image" className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Scene Decisions Overlay */}
            {showDecisions && currentScene.decisions && currentScene.decisions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-8"
              >
                <div className="max-w-2xl mx-auto">
                  <div className="space-y-3">
                    <Text variant="heading" size="lg" className="text-white mb-4">
                      What happens next?
                    </Text>
                    {currentScene.decisions.map((decision, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Button
                          variant="outline"
                          size="lg"
                          className="w-full justify-start text-left p-4 bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50"
                          onClick={() => handleDecisionSelect(decision)}
                        >
                          <ApperIcon name="ArrowRight" className="w-5 h-5 mr-3" />
                          {decision.text}
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-between p-4 bg-black/80">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon="ChevronLeft"
            onClick={playbackHistory.length > 0 ? goBack : previousScene}
            disabled={currentSceneIndex === 0 && playbackHistory.length === 0}
            className="text-white hover:bg-white/20"
          >
            {playbackHistory.length > 0 ? 'Go Back' : 'Previous'}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {!showDecisions && currentScene.decisions && currentScene.decisions.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              icon="GitBranch"
              onClick={() => setShowDecisions(true)}
            >
              Show Choices
            </Button>
          )}
          
          {(!currentScene.decisions || currentScene.decisions.length === 0) && (
            <Button
              variant="ghost"
              size="sm"
              icon="ChevronRight"
              onClick={nextScene}
              disabled={currentSceneIndex >= totalScenes - 1}
              className="text-white hover:bg-white/20"
            >
              Next Scene
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryPreviewPlayer;