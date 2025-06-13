const Text = ({ 
  children, 
  variant = 'body',
  size = 'base',
  weight = 'normal',
  color = 'gray-900',
  className = '',
  ...props 
}) => {
  const variants = {
    display: 'font-display',
    heading: 'font-heading',
    body: 'font-sans',
    caption: 'font-sans'
  };

  const sizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  };

  const weights = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const textClasses = `
    ${variants[variant]} 
    ${sizes[size]} 
    ${weights[weight]} 
    text-${color}
    ${className}
  `.trim();

  return (
    <span className={textClasses} {...props}>
      {children}
    </span>
  );
};

export default Text;