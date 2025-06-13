import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import SceneAsset from '@/components/molecules/SceneAsset';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const SceneCanvas = ({ 
  scene, 
  onSceneUpdate, 
  backgroundImage = null,
  className = "" 
}) => {
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [draggedAsset, setDraggedAsset] = useState(null);
  const canvasRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      const rect = canvasRef.current.getBoundingClientRect();
      
      const position = {
        x: e.clientX - rect.left - 48, // Center the asset (48px = half of asset width)
        y: e.clientY - rect.top - 48
      };

      // Ensure asset stays within canvas bounds
      position.x = Math.max(0, Math.min(position.x, rect.width - 96));
      position.y = Math.max(0, Math.min(position.y, rect.height - 96));

      const newAsset = {
        id: Date.now().toString(),
        type: data.type,
        assetId: data.assetId,
        asset: data.asset,
        position: position,
        animation: null
      };

      const updatedScene = {
        ...scene,
        assets: [...(scene.assets || []), newAsset]
      };

      onSceneUpdate && onSceneUpdate(updatedScene);
      
      // Add sparkle effect
      createSparkles(position.x + 48, position.y + 48);
      
      toast.success('Asset added to scene!');
    } catch (error) {
      console.error('Error adding asset:', error);
      toast.error('Failed to add asset');
    }
  }, [scene, onSceneUpdate]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  }, []);

  const handleAssetMove = useCallback((assetId, newPosition) => {
    const updatedAssets = (scene.assets || []).map(asset => 
      asset.id === assetId 
        ? { ...asset, position: newPosition }
        : asset
    );

    const updatedScene = {
      ...scene,
      assets: updatedAssets
    };

    onSceneUpdate && onSceneUpdate(updatedScene);
  }, [scene, onSceneUpdate]);

  const handleAssetDelete = useCallback((assetId) => {
    const updatedAssets = (scene.assets || []).filter(asset => asset.id !== assetId);
    
    const updatedScene = {
      ...scene,
      assets: updatedAssets
    };

    onSceneUpdate && onSceneUpdate(updatedScene);
    setSelectedAsset(null);
    toast.success('Asset removed');
  }, [scene, onSceneUpdate]);

  const handleAssetAnimate = useCallback((assetId, animation) => {
    const updatedAssets = (scene.assets || []).map(asset => 
      asset.id === assetId 
        ? { ...asset, animation: animation }
        : asset
    );

    const updatedScene = {
      ...scene,
      assets: updatedAssets
    };

    onSceneUpdate && onSceneUpdate(updatedScene);
    
    // Reset animation after it completes
    setTimeout(() => {
      const resetAssets = updatedAssets.map(asset => 
        asset.id === assetId 
          ? { ...asset, animation: null }
          : asset
      );
      
      onSceneUpdate && onSceneUpdate({
        ...scene,
        assets: resetAssets
      });
    }, 1000);
  }, [scene, onSceneUpdate]);

  const handleAssetSelect = useCallback((asset) => {
    setSelectedAsset(asset);
  }, []);

  const handleCanvasClick = useCallback((e) => {
    // Deselect asset if clicking on empty canvas
    if (e.target === canvasRef.current) {
      setSelectedAsset(null);
    }
  }, []);

  const createSparkles = (x, y) => {
    const sparkleContainer = document.createElement('div');
    sparkleContainer.style.position = 'absolute';
    sparkleContainer.style.left = x + 'px';
    sparkleContainer.style.top = y + 'px';
    sparkleContainer.style.pointerEvents = 'none';
    sparkleContainer.style.zIndex = '1000';

    canvasRef.current.appendChild(sparkleContainer);

    // Create multiple sparkle particles
    for (let i = 0; i < 6; i++) {
      const sparkle = document.createElement('div');
      sparkle.className = 'sparkle-particle';
      sparkle.style.left = (Math.random() - 0.5) * 40 + 'px';
      sparkle.style.top = (Math.random() - 0.5) * 40 + 'px';
      sparkleContainer.appendChild(sparkle);
    }

    // Remove sparkles after animation
    setTimeout(() => {
      if (sparkleContainer.parentNode) {
        sparkleContainer.parentNode.removeChild(sparkleContainer);
      }
    }, 1000);
  };

  const clearScene = () => {
    if (window.confirm('Are you sure you want to clear all assets from this scene?')) {
      const updatedScene = {
        ...scene,
        assets: []
      };
      onSceneUpdate && onSceneUpdate(updatedScene);
      setSelectedAsset(null);
      toast.success('Scene cleared');
    }
  };

  return (
    <div className={`flex-1 flex flex-col ${className}`}>
      {/* Canvas Controls */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-900">Scene Canvas</h3>
          <span className="text-sm text-gray-500">
            {(scene.assets || []).length} assets
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          {selectedAsset && (
            <Button
              variant="ghost"
              size="sm"
              icon="Target"
              onClick={() => setSelectedAsset(null)}
            >
              Deselect
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            icon="Trash2"
            onClick={clearScene}
            disabled={!scene.assets || scene.assets.length === 0}
            className="text-error hover:bg-error/10"
          >
            Clear Scene
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden">
        <div
          ref={canvasRef}
          className="w-full h-full relative drop-zone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleCanvasClick}
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Default background when no background is set */}
          {!backgroundImage && (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <ApperIcon name="Image" className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Drop a background here</p>
                <p className="text-sm">Or drag characters and props to start building your scene</p>
              </div>
            </div>
          )}

          {/* Scene Assets */}
          <AnimatePresence>
            {(scene.assets || []).map((sceneAsset) => (
              <SceneAsset
                key={sceneAsset.id}
                sceneAsset={sceneAsset}
                selected={selectedAsset?.id === sceneAsset.id}
                onSelect={handleAssetSelect}
                onMove={handleAssetMove}
                onDelete={handleAssetDelete}
                onAnimate={handleAssetAnimate}
              />
            ))}
          </AnimatePresence>

          {/* Drag overlay */}
          {draggedAsset && (
            <div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-2xl flex items-center justify-center pointer-events-none">
              <div className="text-center text-primary">
                <ApperIcon name="Plus" className="w-8 h-8 mx-auto mb-2" />
                <p className="font-medium">Drop to add to scene</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Asset Info */}
      {selectedAsset && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-t border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <ApperIcon name="Target" className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {selectedAsset.asset?.name || 'Unknown Asset'}
                </p>
                <p className="text-sm text-gray-500">
                  Position: {Math.round(selectedAsset.position.x)}, {Math.round(selectedAsset.position.y)}
                </p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              icon="X"
              onClick={() => setSelectedAsset(null)}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SceneCanvas;