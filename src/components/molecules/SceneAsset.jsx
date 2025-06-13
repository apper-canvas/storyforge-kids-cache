import { motion } from 'framer-motion';
import { useState } from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const SceneAsset = ({ 
  sceneAsset, 
  onMove, 
  onDelete, 
  onAnimate, 
  selected = false,
  onSelect 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    onSelect && onSelect(sceneAsset);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const container = e.currentTarget.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    const newPosition = {
      x: e.clientX - containerRect.left - dragOffset.x,
      y: e.clientY - containerRect.top - dragOffset.y
    };
    
    onMove && onMove(sceneAsset.id, newPosition);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleAnimate = (animationType) => {
    onAnimate && onAnimate(sceneAsset.id, animationType);
  };

  const getAvailableAnimations = () => {
    const animations = sceneAsset.asset?.animations || ['walk', 'jump', 'wave'];
    return animations;
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: sceneAsset.position.x,
        top: sceneAsset.position.y,
        zIndex: selected ? 20 : 10
      }}
      animate={{
        scale: selected ? 1.1 : 1,
        rotate: sceneAsset.animation === 'wave' ? [0, 10, -10, 0] : 0,
        y: sceneAsset.animation === 'jump' ? [0, -30, 0] : 0
      }}
      transition={{ duration: 0.6 }}
      className={`
        drag-handle cursor-pointer group
        ${selected ? 'ring-2 ring-primary' : ''}
        ${sceneAsset.animation ? `character-${sceneAsset.animation}` : ''}
      `}
    >
      {/* Asset Image */}
      <div
        className="relative w-24 h-24 bg-white rounded-xl shadow-card border-2 border-white overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onClick={() => onSelect && onSelect(sceneAsset)}
      >
        {sceneAsset.asset?.imageUrl ? (
          <img
            src={sceneAsset.asset.imageUrl}
            alt={sceneAsset.asset.name}
            className="w-full h-full object-cover"
            draggable={false}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
            <ApperIcon name="Image" className="w-8 h-8 text-gray-400" />
          </div>
        )}
        
        {/* Selection Indicator */}
        {selected && (
          <div className="absolute inset-0 bg-primary/20 border-2 border-primary rounded-xl">
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full"></div>
          </div>
        )}
      </div>

      {/* Controls (shown when selected) */}
      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex items-center gap-1 bg-white rounded-full shadow-card px-2 py-1 border border-gray-200"
        >
          {/* Animation Buttons */}
          {getAvailableAnimations().map(animation => (
            <button
              key={animation}
              onClick={() => handleAnimate(animation)}
              className="w-6 h-6 rounded-full bg-primary/10 hover:bg-primary/20 flex items-center justify-center transition-colors"
              title={`${animation} animation`}
            >
              <ApperIcon 
                name={
                  animation === 'walk' ? 'ArrowRight' :
                  animation === 'jump' ? 'ArrowUp' :
                  animation === 'wave' ? 'Hand' : 'Play'
                } 
                className="w-3 h-3 text-primary" 
              />
            </button>
          ))}
          
          {/* Delete Button */}
          <button
            onClick={() => onDelete && onDelete(sceneAsset.id)}
            className="w-6 h-6 rounded-full bg-error/10 hover:bg-error/20 flex items-center justify-center transition-colors"
            title="Delete asset"
          >
            <ApperIcon name="Trash2" className="w-3 h-3 text-error" />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SceneAsset;