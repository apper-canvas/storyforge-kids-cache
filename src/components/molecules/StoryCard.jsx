import { motion } from 'framer-motion';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { storyService } from '@/services';

const StoryCard = ({ story, onDelete, onDuplicate }) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEdit = () => {
    storyService.setCurrentStory(story.id);
    navigate('/editor');
  };

  const handlePreview = () => {
    storyService.setCurrentStory(story.id);
    navigate('/preview');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this story?')) return;
    
    setLoading(true);
    try {
      await storyService.delete(story.id);
      onDelete && onDelete(story.id);
      toast.success('Story deleted successfully');
    } catch (error) {
      toast.error('Failed to delete story');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async () => {
    setLoading(true);
    try {
      const duplicated = await storyService.duplicate(story.id);
      onDuplicate && onDuplicate(duplicated);
      toast.success('Story duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate story');
    } finally {
      setLoading(false);
    }
  };

  const getThemeColor = (theme) => {
    const colors = {
      fantasy: 'from-purple-400 to-pink-400',
      space: 'from-blue-400 to-indigo-400',
      underwater: 'from-teal-400 to-cyan-400',
      adventure: 'from-orange-400 to-red-400'
    };
    return colors[theme] || 'from-gray-400 to-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
    >
      <Card hover className="overflow-hidden">
        {/* Thumbnail */}
        <div className={`h-32 bg-gradient-to-br ${getThemeColor(story.theme)} relative`}>
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="text-center text-white">
              <ApperIcon name="BookOpen" className="w-8 h-8 mx-auto mb-2" />
              <Text variant="caption" size="sm" className="text-white/90">
                {story.scenes?.length || 0} scenes
              </Text>
            </div>
          </div>
          
          {/* Theme Badge */}
          <div className="absolute top-3 right-3">
            <span className="px-2 py-1 bg-white/90 text-gray-700 text-xs rounded-full font-medium">
              {story.theme}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <Text variant="heading" size="lg" weight="semibold" className="mb-2 break-words">
            {story.title}
          </Text>
          
          <Text variant="body" size="sm" color="gray-600" className="mb-3">
            Updated {formatDistanceToNow(new Date(story.updatedAt), { addSuffix: true })}
          </Text>

          {/* Actions */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="primary"
              size="sm"
              icon="Edit3"
              onClick={handleEdit}
              disabled={loading}
            >
              Edit
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              icon="Play"
              onClick={handlePreview}
              disabled={loading}
            >
              Preview
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Copy"
              onClick={handleDuplicate}
              disabled={loading}
            >
              Duplicate
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              icon="Trash2"
              onClick={handleDelete}
              disabled={loading}
              className="text-error hover:bg-error/10 hover:text-error ml-auto"
            >
              Delete
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StoryCard;