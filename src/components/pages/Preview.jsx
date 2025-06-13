import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import StoryPreviewPlayer from '@/components/organisms/StoryPreviewPlayer';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import { storyService } from '@/services';

const Preview = () => {
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentStory();
  }, []);

  const loadCurrentStory = async () => {
    setLoading(true);
    setError(null);
    try {
      const currentStoryId = storyService.getCurrentStoryId();
      if (!currentStoryId) {
        throw new Error('No story selected for preview');
      }
      
      const loadedStory = await storyService.getById(currentStoryId);
      setStory(loadedStory);
    } catch (err) {
      setError(err.message || 'Failed to load story');
      toast.error('Failed to load story for preview');
    } finally {
      setLoading(false);
    }
  };

  const handleExit = () => {
    navigate('/editor');
  };

  if (loading) {
    return (
      <div className="h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full mb-4 animate-pulse" />
          <p className="text-white text-lg">Loading story preview...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full bg-gray-100 flex items-center justify-center">
        <ErrorState
          title="Failed to load preview"
          message={error}
          onRetry={loadCurrentStory}
        />
      </div>
    );
  }

  return (
    <div className="h-full">
      <StoryPreviewPlayer
        story={story}
        onExit={handleExit}
      />
    </div>
  );
};

export default Preview;