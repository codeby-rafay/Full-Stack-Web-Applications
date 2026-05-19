import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export const SkeletonLoader = () => {
  return (
    <div className="min-h-screen w-full bg-white p-6">
      {/* Header Skeleton */}
      <div className="mb-8 space-y-4">
        <Skeleton height={40} className="mb-4" />
        <div className="flex gap-4">
          <Skeleton width="25%" height={32} />
          <Skeleton width="25%" height={32} />
          <Skeleton width="25%" height={32} />
        </div>
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="space-y-4">
            {/* Image Skeleton */}
            <Skeleton height={250} className="rounded-lg" />
            {/* Title Skeleton */}
            <Skeleton height={24} />
            {/* Description Skeleton */}
            <Skeleton height={16} />
            <Skeleton height={16} width="80%" />
            {/* Price and Button Skeleton */}
            <div className="flex justify-between items-center pt-2">
              <Skeleton width="40%" height={20} />
              <Skeleton width="40%" height={36} className="rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SkeletonLoaderMinimal = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <Skeleton height={48} width={48} className="rounded-full mb-4" />
      <Skeleton height={20} width={120} />
    </div>
  );
};
