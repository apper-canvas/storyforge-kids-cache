import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SceneTimeline = ({ 
  scenes = [], 
  currentSceneIndex = 0, 
  onSceneSelect, 
  onSceneAdd, 
  onSceneDelete,
  onSceneReorder 
}) => {
  const [draggedSceneIndex, setDraggedSceneIndex] = useState(null);

  const handleSceneClick = (index) => {
    onSceneSelect && onSceneSelect(index);
  };

  const handleAddScene = () => {
    onSceneAdd && onSceneAdd();
  };

  const handleDragStart = (e, index) => {
    setDraggedSceneIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    
    if (draggedSceneIndex !== null && draggedSceneIndex !== dropIndex) {
      onSceneReorder && onSceneReorder(draggedSceneIndex, dropIndex);
    }
    
    setDraggedSceneIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedSceneIndex(null);
  };

  const getScenePreview = (scene) => {
    if (scene.background) {
      return scene.background;
    }
    if (scene.assets && scene.assets.length > 0) {
      return scene.assets[0].asset?.imageUrl;
    }
    return null;
  };

  const hasDecisions = (scene) => {
    return scene.decisions && scene.decisions.length > 0;
  };

  const hasAudio = (scene) => {
    return scene.audioUrl;
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Scene Timeline</h3>
        <Button
          variant="primary"
          size="sm"
          icon="Plus"
          onClick={handleAddScene}
        >
          Add Scene
        </Button>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-6 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-30" />
        
        {/* Scenes */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <AnimatePresence>
            {scenes.map((scene, index) => (
              <motion.div
                key={scene.id || index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <div
                  className={`
                    relative w-24 h-24 rounded-2xl border-4 cursor-pointer transition-all duration-200
                    ${index === currentSceneIndex 
                      ? 'border-primary shadow-button scale-110' 
                      : 'border-gray-200 hover:border-primary/50'
                    }
                    ${draggedSceneIndex === index ? 'opacity-50' : ''}
                  `}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  onClick={() => handleSceneClick(index)}
                >
                  {/* Scene Preview */}
                  <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {getScenePreview(scene) ? (
                      <img
                        src={getScenePreview(scene)}
                        alt={`Scene ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ApperIcon name="Image" className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* Scene Number */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>

                  {/* Scene Features */}
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    {hasAudio(scene) && (
                      <div className="w-5 h-5 bg-success rounded-full flex items-center justify-center">
                        <ApperIcon name="Volume2" className="w-3 h-3 text-white" />
                      </div>
                    )}
                    {hasDecisions(scene) && (
                      <div className="w-5 h-5 bg-secondary rounded-full flex items-center justify-center">
                        <ApperIcon name="GitBranch" className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Delete Button (on hover) */}
                  {scenes.length > 1 && (
                    <button
                      className="absolute -top-2 -right-2 w-6 h-6 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center hover:scale-110"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSceneDelete && onSceneDelete(index);
                      }}
                    >
                      <ApperIcon name="X" className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {/* Scene Title */}
                <p className="mt-2 text-xs text-center text-gray-600 font-medium">
                  Scene {index + 1}
                  {index === currentSceneIndex && (
                    <span className="block text-primary">Current</span>
                  )}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Add Scene Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: scenes.length * 0.1 + 0.2 }}
            className="flex-shrink-0"
          >
            <button
              onClick={handleAddScene}
              className="w-24 h-24 border-4 border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all duration-200 hover:scale-105"
            >
              <ApperIcon name="Plus" className="w-8 h-8" />
            </button>
            <p className="mt-2 text-xs text-center text-gray-600 font-medium">
              Add Scene
            </p>
          </motion.div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span>Has Audio</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-secondary rounded-full" />
            <span>Has Decisions</span>
          </div>
          <div className="flex items-center gap-1">
            <ApperIcon name="Move" className="w-3 h-3" />
            <span>Drag to Reorder</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SceneTimeline;