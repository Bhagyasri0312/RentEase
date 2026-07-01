export const LoadingSkeleton = ({ variant = 'card', count = 1 }) => {
  const skeletonClasses = 'animate-pulse bg-gray-200 rounded';

  if (variant === 'card') {
    return (
      <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white p-4 rounded-lg shadow">
            <div className={`${skeletonClasses} h-40 mb-4`} />
            <div className={`${skeletonClasses} h-4 w-3/4 mb-2`} />
            <div className={`${skeletonClasses} h-4 w-1/2`} />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${skeletonClasses} h-4 w-full`} />
        ))}
      </div>
    );
  }

  if (variant === 'avatar') {
    return <div className={`${skeletonClasses} w-12 h-12 rounded-full`} />;
  }

  if (variant === 'product-grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg overflow-hidden shadow">
            <div className={`${skeletonClasses} h-48 w-full`} />
            <div className="p-4 space-y-3">
              <div className={`${skeletonClasses} h-4 w-full`} />
              <div className={`${skeletonClasses} h-4 w-2/3`} />
              <div className={`${skeletonClasses} h-6 w-1/3`} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <div className={`${skeletonClasses} h-10 w-full`} />;
};
