import { motion } from 'framer-motion';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  const shimmer = {
    animate: {
      x: ['-100%', '100%']
    },
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear'
    }
  };

  const CardSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden">
      <div className="h-32 bg-gray-200 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          {...shimmer}
        />
      </div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            {...shimmer}
          />
        </div>
        <div className="h-3 bg-gray-200 rounded-full w-1/2 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            {...shimmer}
          />
        </div>
        <div className="flex gap-2">
          <div className="h-8 bg-gray-200 rounded-full w-16 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              {...shimmer}
            />
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-20 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              {...shimmer}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const AssetSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-3">
      <div className="aspect-square bg-gray-200 rounded-xl mb-3 relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          {...shimmer}
        />
      </div>
      <div className="h-3 bg-gray-200 rounded-full w-full relative overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          {...shimmer}
        />
      </div>
    </div>
  );

  const ListSkeleton = () => (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-4">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            {...shimmer}
          />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded-full w-3/4 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              {...shimmer}
            />
          </div>
          <div className="h-3 bg-gray-200 rounded-full w-1/2 relative overflow-hidden">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
              {...shimmer}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const SkeletonComponent = () => {
    switch (type) {
      case 'asset':
        return <AssetSkeleton />;
      case 'list':
        return <ListSkeleton />;
      default:
        return <CardSkeleton />;
    }
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <SkeletonComponent />
        </motion.div>
      ))}
    </div>
  );
};

export default SkeletonLoader;