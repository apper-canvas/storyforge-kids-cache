import { motion } from 'framer-motion';
import { useState } from 'react';
import Card from '@/components/atoms/Card';
import Text from '@/components/atoms/Text';

const AssetCard = ({ asset, onDragStart, onClick, selected = false }) => {
  const [imageError, setImageError] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify({
      type: asset.type || 'character',
      assetId: asset.id,
      asset: asset
    }));
    onDragStart && onDragStart(asset);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05, rotate: 1 }}
      whileTap={{ scale: 0.95 }}
      className="drag-handle"
    >
      <Card
        className={`
          p-3 cursor-grab active:cursor-grabbing transition-all duration-200
          ${selected ? 'ring-2 ring-primary bg-primary/5' : ''}
        `}
        draggable
        onDragStart={handleDragStart}
        onClick={() => onClick && onClick(asset)}
      >
        <div className="aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl mb-3 flex items-center justify-center overflow-hidden">
          {!imageError ? (
            <img
              src={asset.imageUrl}
              alt={asset.name}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
              <Text variant="display" size="2xl" color="primary">
                {asset.name?.charAt(0) || '?'}
              </Text>
            </div>
          )}
        </div>
        
        <Text 
          variant="body" 
          size="sm" 
          weight="medium" 
          className="text-center break-words"
        >
          {asset.name}
        </Text>
        
        {asset.theme && (
          <div className="mt-2 flex justify-center">
            <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
              {asset.theme}
            </span>
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default AssetCard;