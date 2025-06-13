import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  onClick = null,
  ...props 
}) => {
  const baseClasses = 'bg-white rounded-2xl shadow-card border border-gray-100 overflow-hidden';
  const hoverClasses = hover ? 'hover:shadow-float hover:-translate-y-1 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';
  
  const cardClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`.trim();

  const CardContent = (
    <div className={cardClasses} onClick={onClick} {...props}>
      {children}
    </div>
  );

  if (hover || onClick) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        {CardContent}
      </motion.div>
    );
  }

  return CardContent;
};

export default Card;