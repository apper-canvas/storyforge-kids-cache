import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import AssetPanel from '@/components/organisms/AssetPanel';
import SceneCanvas from '@/components/organisms/SceneCanvas';
import SceneTimeline from '@/components/organisms/SceneTimeline';
import RecordingControl from '@/components/molecules/RecordingControl';
import DecisionPoint from '@/components/molecules/DecisionPoint';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import { storyService } from '@/services';

const Editor = () => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedBackground, setSelectedBackground] = useState(null);
  const [activePanel, setActivePanel] = useState('assets');
  const [autoSaving, setAutoSaving] = useState(false);
  const navigate = useNavigate();

  const panels = [
    { id: 'assets', label: 'Assets', icon: 'Package' },
    { id: 'audio', label: 'Audio', icon: 'Mic' },
    { id: 'decisions', label: 'Decisions', icon: 'GitBranch' }
  ];

  useEffect(() => {
    loadCurrentStory();
  }, []);

  useEffect(() => {
    // Auto-save story changes
    if (story) {
      const timer = setTimeout(() => {
        autoSaveStory();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [story]);

  const loadCurrentStory = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentStoryId = storyService.getCurrentStoryId();
      if (!currentStoryId) {
        // Create a new story if none is selected
        const newStory = await storyService.create({
          title: 'New Story',
          theme: 'fantasy',
          scenes: [{
            id: 'scene1',
            background: null,
            assets: [],
            audioUrl: null,
            decisions: [],
            nextSceneId: null
          }]
        });
        setStory(newStory);
        storyService.setCurrentStory(newStory.id);
      } else {
        const loadedStory = await storyService.getById(currentStoryId);
        setStory(loadedStory);
      }
    } catch (err) {
      setError(err.message || 'Failed to load story');
      toast.error('Failed to load story');
    } finally {
      setLoading(false);
    }
  };

  const autoSaveStory = async () => {
    if (!story) return;
    
    setAutoSaving(true);
    try {
      await storyService.update(story.id, story);
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setAutoSaving(false);
    }
  };

  const handleStoryTitleChange = (newTitle) => {
    setStory(prev => ({
      ...prev,
      title: newTitle
    }));
  };

  const handleSceneUpdate = (updatedScene) => {
    setStory(prev => ({
      ...prev,
      scenes: prev.scenes.map((scene, index) => 
        index === currentSceneIndex ? updatedScene : scene
      )
    }));
    
    // Update selected background if scene background changed
    if (updatedScene.background !== story.scenes[currentSceneIndex].background) {
      setSelectedBackground(updatedScene.background);
    }
  };

  const handleSceneSelect = (sceneIndex) => {
    setCurrentSceneIndex(sceneIndex);
    const scene = story.scenes[sceneIndex];
    setSelectedBackground(scene.background);
  };

  const handleSceneAdd = () => {
    const newScene = {
      id: `scene${Date.now()}`,
      background: null,
      assets: [],
      audioUrl: null,
      decisions: [],
      nextSceneId: null
    };
    
    setStory(prev => ({
      ...prev,
      scenes: [...prev.scenes, newScene]
    }));
    
    // Switch to the new scene
    setCurrentSceneIndex(story.scenes.length);
    toast.success('New scene added');
  };

  const handleSceneDelete = (sceneIndex) => {
    if (story.scenes.length <= 1) {
      toast.error('Cannot delete the last scene');
      return;
    }
    
    if (window.confirm('Are you sure you want to delete this scene?')) {
      setStory(prev => ({
        ...prev,
        scenes: prev.scenes.filter((_, index) => index !== sceneIndex)
      }));
      
      // Adjust current scene index if needed
      if (currentSceneIndex >= sceneIndex && currentSceneIndex > 0) {
        setCurrentSceneIndex(currentSceneIndex - 1);
      }
      
      toast.success('Scene deleted');
    }
  };

  const handleSceneReorder = (fromIndex, toIndex) => {
    const newScenes = [...story.scenes];
    const [removed] = newScenes.splice(fromIndex, 1);
    newScenes.splice(toIndex, 0, removed);
    
    setStory(prev => ({
      ...prev,
      scenes: newScenes
    }));
    
    // Update current scene index
    if (currentSceneIndex === fromIndex) {
      setCurrentSceneIndex(toIndex);
    } else if (currentSceneIndex > fromIndex && currentSceneIndex <= toIndex) {
      setCurrentSceneIndex(currentSceneIndex - 1);
    } else if (currentSceneIndex < fromIndex && currentSceneIndex >= toIndex) {
      setCurrentSceneIndex(currentSceneIndex + 1);
    }
    
    toast.success('Scene order updated');
  };

  const handleAssetSelect = (asset) => {
    if (asset.type === 'background') {
      // Set as scene background
      const updatedScene = {
        ...story.scenes[currentSceneIndex],
        background: asset.imageUrl
      };
      handleSceneUpdate(updatedScene);
      setSelectedBackground(asset.imageUrl);
      toast.success('Background updated');
    }
  };

  const handleRecordingComplete = (recording) => {
    const updatedScene = {
      ...story.scenes[currentSceneIndex],
      audioUrl: recording?.url || null
    };
    handleSceneUpdate(updatedScene);
    
    if (recording) {
      toast.success('Audio recording saved');
    }
  };

  const handleDecisionChange = (decisionId, updates) => {
    const updatedScene = {
      ...story.scenes[currentSceneIndex],
      decisions: story.scenes[currentSceneIndex].decisions.map(decision =>
        decision.id === decisionId ? { ...decision, ...updates } : decision
      )
    };
    handleSceneUpdate(updatedScene);
  };

  const handleDecisionAdd = (newDecision) => {
    const updatedScene = {
      ...story.scenes[currentSceneIndex],
      decisions: [...(story.scenes[currentSceneIndex].decisions || []), newDecision]
    };
    handleSceneUpdate(updatedScene);
    toast.success('Decision point added');
  };

  const handleDecisionRemove = (decisionId) => {
    const updatedScene = {
      ...story.scenes[currentSceneIndex],
      decisions: story.scenes[currentSceneIndex].decisions.filter(decision => decision.id !== decisionId)
    };
    handleSceneUpdate(updatedScene);
    toast.success('Decision point removed');
  };

  const handlePreview = () => {
    navigate('/preview');
  };

  const handleSave = async () => {
    if (!story) return;
    
    try {
      await storyService.update(story.id, story);
      toast.success('Story saved successfully');
    } catch (error) {
      toast.error('Failed to save story');
    }
  };

  const getCurrentScene = () => {
    return story?.scenes?.[currentSceneIndex] || null;
  };

  if (loading) {
    return (
      <div className="h-full flex">
        <div className="w-80 bg-gray-100 border-r border-gray-200">
          <SkeletonLoader count={3} />
        </div>
        <div className="flex-1 bg-gray-50 flex items-center justify-center">
          <SkeletonLoader count={1} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState
          title="Failed to load editor"
          message={error}
          onRetry={loadCurrentStory}
        />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="h-full flex items-center justify-center">
        <ErrorState
          title="No story selected"
          message="Please select or create a story to edit"
          onRetry={() => navigate('/my-stories')}
          icon="BookOpen"
        />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Editor Header */}
      <div className="flex-shrink-0 bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="sm"
              icon="ArrowLeft"
              onClick={() => navigate('/my-stories')}
            >
              Back to Stories
            </Button>
            
            <div className="flex-1 max-w-md">
              <Input
                value={story.title}
                onChange={(e) => handleStoryTitleChange(e.target.value)}
                placeholder="Story title..."
                className="text-lg font-semibold"
              />
            </div>
            
            {autoSaving && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <ApperIcon name="Loader2" className="w-4 h-4 animate-spin" />
                Saving...
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              icon="Save"
              onClick={handleSave}
            >
              Save
            </Button>
            
            <Button
              variant="primary"
              size="sm"
              icon="Play"
              onClick={handlePreview}
            >
              Preview
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Assets/Controls */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Panel Tabs */}
          <div className="flex-shrink-0 border-b border-gray-200">
            <div className="flex">
              {panels.map(panel => (
                <button
                  key={panel.id}
                  onClick={() => setActivePanel(panel.id)}
                  className={`
                    flex-1 flex items-center justify-center gap-2 py-3 px-4 text-sm font-medium transition-colors
                    ${activePanel === panel.id 
                      ? 'bg-primary text-white' 
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                    }
                  `}
                >
                  <ApperIcon name={panel.icon} className="w-4 h-4" />
                  {panel.label}
                </button>
              ))}
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {activePanel === 'assets' && (
              <AssetPanel
                currentTheme={story.theme}
                onAssetSelect={handleAssetSelect}
              />
            )}
            
            {activePanel === 'audio' && (
              <div className="p-4">
                <RecordingControl
                  onRecordingComplete={handleRecordingComplete}
                  currentRecording={getCurrentScene()?.audioUrl ? { url: getCurrentScene().audioUrl } : null}
                />
              </div>
            )}
            
            {activePanel === 'decisions' && (
              <div className="p-4 overflow-y-auto">
                <DecisionPoint
                  decisions={getCurrentScene()?.decisions || []}
                  onDecisionChange={handleDecisionChange}
                  onDecisionAdd={handleDecisionAdd}
                  onDecisionRemove={handleDecisionRemove}
                />
              </div>
            )}
          </div>
        </div>

        {/* Center - Scene Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <SceneCanvas
            scene={getCurrentScene()}
            onSceneUpdate={handleSceneUpdate}
            backgroundImage={selectedBackground}
          />
        </div>
      </div>

      {/* Bottom - Scene Timeline */}
      <div className="flex-shrink-0">
        <SceneTimeline
          scenes={story.scenes}
          currentSceneIndex={currentSceneIndex}
          onSceneSelect={handleSceneSelect}
          onSceneAdd={handleSceneAdd}
          onSceneDelete={handleSceneDelete}
          onSceneReorder={handleSceneReorder}
        />
      </div>
    </div>
  );
};

export default Editor;