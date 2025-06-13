import { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Input = ({ 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder = '', 
  error = '', 
  icon = null,
  disabled = false,
  className = '',
  ...props 
}) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const hasValue = value && value.length > 0;
  const showFloatingLabel = focused || hasValue;

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <ApperIcon name={icon} className="w-5 h-5" />
          </div>
        )}

        {/* Input */}
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 bg-gray-50 border-2 rounded-2xl transition-all duration-200
            ${icon ? 'pl-12' : 'pl-4'}
            ${type === 'password' ? 'pr-12' : 'pr-4'}
            ${focused ? 'border-primary bg-white' : 'border-gray-200'}
            ${error ? 'border-error' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            focus:outline-none focus:ring-0
          `}
          placeholder={showFloatingLabel ? '' : placeholder}
          {...props}
        />

        {/* Floating Label */}
        {label && (
          <motion.label
            animate={{
              top: showFloatingLabel ? '0px' : '50%',
              fontSize: showFloatingLabel ? '0.75rem' : '1rem',
              color: focused ? '#7C3AED' : error ? '#EF4444' : '#6B7280'
            }}
            transition={{ duration: 0.2 }}
            className={`
              absolute left-4 transform -translate-y-1/2 px-2 bg-white pointer-events-none
              ${icon && !showFloatingLabel ? 'left-12' : 'left-4'}
            `}
            style={{
              transformOrigin: 'left center'
            }}
          >
            {label}
          </motion.label>
        )}

        {/* Password Toggle */}
        {type === 'password' && (
          <button
            type="button"
            onClick={handlePasswordToggle}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ApperIcon name={showPassword ? 'EyeOff' : 'Eye'} className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-error flex items-center gap-1"
        >
          <ApperIcon name="AlertCircle" className="w-4 h-4" />
          {error}
        </motion.p>
      )}
    </div>
  );
};

export default Input;