import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Text from '@/components/atoms/Text';
import StoryCard from '@/components/molecules/StoryCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { storyService } from '@/services';

const MyStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filterTheme, setFilterTheme] = useState('all');
  const navigate = useNavigate();

  const themes = [
    { id: 'all', label: 'All Themes', icon: 'Sparkles' },
    { id: 'fantasy', label: 'Fantasy', icon: 'Crown' },
    { id: 'space', label: 'Space', icon: 'Rocket' },
    { id: 'underwater', label: 'Underwater', icon: 'Fish' },
    { id: 'adventure', label: 'Adventure', icon: 'Mountain' }
  ];

  const sortOptions = [
    { id: 'updatedAt', label: 'Recently Updated' },
    { id: 'createdAt', label: 'Recently Created' },
    { id: 'title', label: 'Title A-Z' }
  ];

  useEffect(() => {
    loadStories();
  }, []);

  const loadStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await storyService.getAll();
      setStories(result);
    } catch (err) {
      setError(err.message || 'Failed to load stories');
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async () => {
    try {
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
      
      storyService.setCurrentStory(newStory.id);
      navigate('/editor');
      toast.success('New story created!');
    } catch (error) {
      toast.error('Failed to create story');
    }
  };

  const handleStoryDelete = (storyId) => {
    setStories(prev => prev.filter(story => story.id !== storyId));
  };

  const handleStoryDuplicate = (duplicatedStory) => {
    setStories(prev => [duplicatedStory, ...prev]);
  };

  const getFilteredStories = () => {
    let filtered = stories;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.theme.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by theme
    if (filterTheme !== 'all') {
      filtered = filtered.filter(story => story.theme === filterTheme);
    }

    // Sort stories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'createdAt':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'updatedAt':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });

    return filtered;
  };

  const filteredStories = getFilteredStories();

  if (loading) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="h-8 bg-gray-200 rounded-full w-48 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <SkeletonLoader count={8} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="max-w-7xl mx-auto p-6">
          <div className="h-full flex items-center justify-center">
            <ErrorState
              title="Failed to load stories"
              message={error}
              onRetry={loadStories}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <Text variant="display" size="3xl" weight="bold" className="text-gray-900 mb-2">
              My Stories
            </Text>
            <Text variant="body" size="lg" color="gray-600">
              Create magical adventures and bring your imagination to life
            </Text>
          </div>
          
          <Button
            variant="primary"
            size="lg"
            icon="Plus"
            onClick={handleCreateStory}
            className="self-start sm:self-auto"
          >
            Create New Story
          </Button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="md:col-span-1">
              <Input
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon="Search"
              />
            </div>

            {/* Theme Filter */}
            <div className="md:col-span-1">
              <select
                value={filterTheme}
                onChange={(e) => setFilterTheme(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:bg-white focus:outline-none transition-all duration-200"
              >
                {themes.map(theme => (
                  <option key={theme.id} value={theme.id}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div className="md:col-span-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-2xl focus:border-primary focus:bg-white focus:outline-none transition-all duration-200"
              >
                {sortOptions.map(option => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        {filteredStories.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-12">
            <EmptyState
              title={searchTerm || filterTheme !== 'all' ? "No stories match your search" : "No stories yet"}
              description={searchTerm || filterTheme !== 'all' ? "Try adjusting your search terms or filters" : "Start creating your first magical adventure"}
              actionLabel="Create Your First Story"
              onAction={handleCreateStory}
              icon="BookOpen"
            />
          </div>
        ) : (
          <>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <Text variant="body" size="base" color="gray-600">
                {filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found
              </Text>
              
              <div className="flex items-center gap-2">
                <ApperIcon name="Grid3x3" className="w-4 h-4 text-gray-400" />
                <Text variant="body" size="sm" color="gray-500">
                  Grid view
                </Text>
              </div>
            </div>

            {/* Stories Grid */}
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <StoryCard
                      story={story}
                      onDelete={handleStoryDelete}
                      onDuplicate={handleStoryDuplicate}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyStories;