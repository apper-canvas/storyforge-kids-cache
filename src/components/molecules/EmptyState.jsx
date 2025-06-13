import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const EmptyState = ({ 
  title = "Nothing here yet",
  description = "Get started by adding your first item",
  actionLabel = "Get Started",
  onAction,
  icon = "Plus",
  className = "",
  showAction = true
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-16 px-6 ${className}`}
    >
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="mb-6"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} className="w-12 h-12 text-primary" />
        </div>
      </motion.div>

      <Text variant="heading" size="2xl" weight="semibold" className="mb-3">
        {title}
      </Text>
      
      <Text variant="body" size="lg" color="gray-600" className="mb-8 max-w-md mx-auto">
        {description}
      </Text>

      {showAction && onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="primary"
            size="lg"
            icon={icon}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}

      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 10}%`
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.7, 0.3]
            }}
            transition={{
              duration: 2,
              delay: i * 0.5,
              repeat: Infinity
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default EmptyState;