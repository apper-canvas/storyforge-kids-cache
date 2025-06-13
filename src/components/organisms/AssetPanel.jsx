import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';
import AssetCard from '@/components/molecules/AssetCard';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import EmptyState from '@/components/molecules/EmptyState';
import ApperIcon from '@/components/ApperIcon';
import { assetService } from '@/services';

const AssetPanel = ({ currentTheme = 'fantasy', onAssetSelect }) => {
  const [assets, setAssets] = useState({
    characters: [],
    backgrounds: [],
    props: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('characters');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const categories = [
    { id: 'characters', label: 'Characters', icon: 'User' },
    { id: 'backgrounds', label: 'Backgrounds', icon: 'Image' },
    { id: 'props', label: 'Props', icon: 'Package' }
  ];

  const themes = [
    { id: 'fantasy', label: 'Fantasy', color: 'from-purple-400 to-pink-400' },
    { id: 'space', label: 'Space', color: 'from-blue-400 to-indigo-400' },
    { id: 'underwater', label: 'Underwater', color: 'from-teal-400 to-cyan-400' },
    { id: 'adventure', label: 'Adventure', color: 'from-orange-400 to-red-400' }
  ];

  useEffect(() => {
    loadAssets();
  }, [currentTheme]);

  const loadAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await assetService.getAllAssets(currentTheme);
      setAssets(result);
    } catch (err) {
      setError(err.message || 'Failed to load assets');
      toast.error('Failed to load assets');
    } finally {
      setLoading(false);
    }
  };

  const handleAssetSelect = (asset) => {
    setSelectedAsset(asset);
    onAssetSelect && onAssetSelect(asset);
  };

  const handleAssetDragStart = (asset) => {
    setSelectedAsset(asset);
  };

  const filterAssets = (assetList) => {
    if (!searchTerm) return assetList;
    return assetList.filter(asset => 
      asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.theme.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getCurrentAssets = () => {
    return filterAssets(assets[activeCategory] || []);
  };

  if (loading) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <div className="h-8 bg-gray-200 rounded-full mb-4" />
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-8 bg-gray-200 rounded-full flex-1" />
            ))}
          </div>
        </div>
        <div className="flex-1 p-4">
          <SkeletonLoader count={6} type="asset" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Asset Library</h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <ErrorState
            title="Failed to load assets"
            message={error}
            onRetry={loadAssets}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Asset Library</h2>
        
        {/* Search */}
        <Input
          placeholder="Search assets..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon="Search"
          className="mb-4"
        />

        {/* Category Tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200
                ${activeCategory === category.id 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-gray-600 hover:text-primary'
                }
              `}
            >
              <ApperIcon name={category.icon} className="w-4 h-4" />
              <span className="hidden sm:block">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Assets Grid */}
      <div className="flex-1 overflow-y-auto asset-panel">
        <div className="p-4">
          <AnimatePresence mode="wait">
            {getCurrentAssets().length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EmptyState
                  title="No assets found"
                  description={searchTerm ? "Try adjusting your search terms" : "No assets available for this category"}
                  icon={categories.find(c => c.id === activeCategory)?.icon || 'Package'}
                  showAction={false}
                />
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-3"
              >
                {getCurrentAssets().map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <AssetCard
                      asset={asset}
                      selected={selectedAsset?.id === asset.id}
                      onDragStart={handleAssetDragStart}
                      onClick={handleAssetSelect}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Theme Selector */}
      <div className="p-4 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Theme</h3>
        <div className="grid grid-cols-2 gap-2">
          {themes.map(theme => (
            <button
              key={theme.id}
              onClick={() => {
                // Theme changing would be handled by parent component
                console.log('Theme selected:', theme.id);
              }}
              className={`
                p-3 rounded-xl bg-gradient-to-br ${theme.color} text-white text-sm font-medium
                ${currentTheme === theme.id ? 'ring-2 ring-primary ring-offset-2' : ''}
                transition-all duration-200 hover:scale-105
              `}
            >
              {theme.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssetPanel;