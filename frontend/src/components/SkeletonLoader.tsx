import React from 'react';

interface SkeletonLoaderProps {
  type?: 'code' | 'text' | 'card' | 'table'; // Add all possible types here
  count?: number; // Optional: Number of skeletons to render
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type = 'text', count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case 'code':
        return (
          <div className="animate-pulse bg-gray-800 rounded-md p-4">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
          </div>
        );
      case 'card':
        return (
          <div className="animate-pulse bg-gray-800 rounded-lg p-6">
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-5/6 mb-2"></div>
          </div>
        );
      case 'table':
        return (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-700 rounded w-full mb-4"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex space-x-2 mb-3">
                <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        );
      case 'text':
      default:
        return (
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-full mb-2"></div>
            <div className="h-6 bg-gray-700 rounded w-full mb-2"></div>
          </div>
        );
    }
  };

  return (
    <>
      {[...Array(count)].map((_, index) => (
        <React.Fragment key={index}>{renderSkeleton()}</React.Fragment>
      ))}
    </>
  );
};

export default SkeletonLoader;
