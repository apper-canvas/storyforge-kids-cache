import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import Text from '@/components/atoms/Text';
import ApperIcon from '@/components/ApperIcon';

const ErrorState = ({ 
  title = "Oops! Something went wrong",
  message = "We're having trouble loading this content. Please try again.",
  onRetry,
  showRetry = true,
  icon = "AlertTriangle",
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`text-center py-12 px-6 ${className}`}
    >
      <motion.div
        animate={{ 
          rotate: [0, -5, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
          <ApperIcon name={icon} className="w-10 h-10 text-error" />
        </div>
      </motion.div>

      <Text variant="heading" size="xl" weight="semibold" className="mb-3">
        {title}
      </Text>
      
      <Text variant="body" size="base" color="gray-600" className="mb-6 max-w-md mx-auto">
        {message}
      </Text>

      {showRetry && onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="primary"
            size="md"
            icon="RefreshCw"
            onClick={onRetry}
          >
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ErrorState;