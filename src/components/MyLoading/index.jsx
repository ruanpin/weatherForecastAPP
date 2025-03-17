import React from 'react';
import Loading from '@/components/Loading';

// 根據 isFetching 狀態顯示 Loading 或 children
function MyLoading({ isFetching, children, className = '', size = 'w-8 h-8' }) {
  return (
    <div className={className}>
      {isFetching ? (
        <div className="flex justify-center items-center">
          <Loading size={size} />
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export default MyLoading; 