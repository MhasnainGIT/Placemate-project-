import React from 'react';

const Textarea = React.forwardRef(({ className = '', ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={[
        'block w-full rounded-md border border-gray-300 bg-white px-3 py-2',
        'text-sm text-gray-900 placeholder:text-gray-400',
        'focus:outline-none focus:ring-2 focus:ring-[#6A38C2] focus:border-transparent',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      ].join(' ')}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export { Textarea };
