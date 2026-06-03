import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ProductCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 p-0">
    <Skeleton height={192} borderRadius={0} />
    <div className="p-4 space-y-2">
      <Skeleton height={16} width="80%" />
      <Skeleton height={14} width="55%" />
      <div className="flex justify-between items-center pt-1">
        <Skeleton height={20} width="35%" />
        <Skeleton height={34} width="38%" borderRadius={12} />
      </div>
    </div>
  </div>
);

/** 4-column product grid skeleton */
const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(count)].map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

// HOME PAGE
export const HomeSkeletonLoader = () => (
  <div>
    {/* Hero section */}
    <section className="bg-linear-to-br from-orange-50 to-amber-50 py-16 px-4">
      <div className="max-w-7xl mx-auto text-center space-y-4 flex flex-col items-center">
        <Skeleton height={24} width={160} borderRadius={99} />
        <Skeleton height={56} width="60%" />
        <Skeleton height={56} width="45%" />
        <Skeleton height={20} width="50%" className="mt-2" />
        <div className="flex gap-4 justify-center mt-4">
          <Skeleton height={44} width={160} borderRadius={12} />
          <Skeleton height={44} width={160} borderRadius={12} />
        </div>
      </div>
    </section>

    {/* Stats bar */}
    <section className="bg-orange-500 py-4">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <Skeleton
              height={24}
              width={60}
              baseColor="#fb923c"
              highlightColor="#fed7aa"
            />
            <Skeleton
              height={12}
              width={70}
              baseColor="#fb923c"
              highlightColor="#fed7aa"
            />
          </div>
        ))}
      </div>
    </section>

    {/* Featured products */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-2">
          <Skeleton height={32} width={220} />
          <Skeleton height={14} width={140} />
        </div>
        <Skeleton height={20} width={80} />
      </div>
      <ProductGridSkeleton count={8} />
    </section>
  </div>
);

// PRODUCTS PAGE
export const ProductsSkeletonLoader = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header */}
    <div className="mb-8 space-y-2">
      <Skeleton height={36} width={220} />
      <Skeleton height={14} width={200} />
    </div>

    {/* Search bar */}
    <div className="mb-8">
      <Skeleton height={44} borderRadius={12} />
    </div>

    {/* Grid */}
    <ProductGridSkeleton count={12} />

    {/* Pagination */}
    <div className="flex justify-center gap-2 mt-10">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} height={36} width={36} borderRadius={8} />
      ))}
    </div>
  </div>
);

// SINGLE PRODUCT PAGE
export const SingleProductSkeletonLoader = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-6">
      <Skeleton height={14} width={40} />
      <Skeleton height={14} width={10} />
      <Skeleton height={14} width={70} />
      <Skeleton height={14} width={10} />
      <Skeleton height={14} width={90} />
      <Skeleton height={14} width={10} />
      <Skeleton height={14} width={140} />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left – images */}
      <div>
        <Skeleton height={384} borderRadius={16} className="mb-4" />
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={64} width={64} borderRadius={8} />
          ))}
        </div>
      </div>

      {/* Right – details */}
      <div className="space-y-4">
        <Skeleton height={14} width={100} borderRadius={99} />
        <Skeleton height={36} width="85%" />
        <Skeleton height={36} width="60%" />
        <div className="flex gap-1 mt-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} height={18} width={18} borderRadius={4} />
          ))}
          <Skeleton height={14} width={80} className="ml-2" />
        </div>
        <Skeleton height={40} width={120} />
        <div className="border-t border-gray-100 pt-4 space-y-2">
          <Skeleton height={14} width="90%" />
          <Skeleton height={14} width="80%" />
          <Skeleton height={14} width="70%" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton height={14} width={160} />
          <Skeleton height={14} width={140} />
          <Skeleton height={14} width={150} />
        </div>
        <div className="flex gap-3 pt-4">
          <Skeleton height={48} width={200} borderRadius={12} />
          <Skeleton height={48} width={48} borderRadius={12} />
        </div>
      </div>
    </div>

    {/* Reviews section */}
    <div className="mt-12">
      <Skeleton height={28} width={180} className="mb-4" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-xl p-4 space-y-2"
          >
            <div className="flex items-center gap-3">
              <Skeleton circle height={40} width={40} />
              <div className="space-y-1">
                <Skeleton height={14} width={120} />
                <Skeleton height={12} width={80} />
              </div>
            </div>
            <Skeleton height={13} width="95%" />
            <Skeleton height={13} width="80%" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// CATEGORIES PAGE
export const CategoriesSkeletonLoader = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
    {/* Header */}
    <div className="mb-8 space-y-2">
      <Skeleton height={36} width={260} />
      <Skeleton height={14} width={160} />
    </div>

    {/* Category cards grid */}
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col items-center gap-3"
        >
          <Skeleton circle height={56} width={56} />
          <Skeleton height={14} width={80} />
          <Skeleton height={12} width={50} />
        </div>
      ))}
    </div>
  </div>
);

// CATEGORY PRODUCTS PAGE
export const CategoryProductsSkeletonLoader = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Breadcrumb */}
    <div className="flex items-center gap-2 mb-6">
      <Skeleton height={14} width={40} />
      <Skeleton height={14} width={10} />
      <Skeleton height={14} width={80} />
      <Skeleton height={14} width={10} />
      <Skeleton height={14} width={100} />
    </div>

    {/* Header */}
    <div className="mb-8 space-y-2">
      <Skeleton height={36} width={200} />
      <Skeleton height={14} width={130} />
    </div>

    <ProductGridSkeleton count={8} />

    {/* Back link */}
    <div className="mt-10">
      <Skeleton height={24} width={180} />
    </div>
  </div>
);

// NOTIFICATIONS PAGE
export const NotificationsSkeletonLoader = () => (
  <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4 sm:p-6">
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <Skeleton height={40} width={220} />
          <Skeleton height={32} width={90} borderRadius={99} />
        </div>
        <Skeleton height={14} width={280} />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mb-6 justify-end">
        <Skeleton height={36} width={140} borderRadius={8} />
        <Skeleton height={36} width={100} borderRadius={8} />
      </div>

      {/* Notification cards */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white border-l-4 border-gray-200 p-4 rounded-lg"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton height={16} width={180} />
                  {i % 2 === 0 && (
                    <Skeleton height={20} width={90} borderRadius={99} />
                  )}
                </div>
                <Skeleton height={13} width="90%" />
                <Skeleton height={13} width="70%" />
                {/* Order details box for some */}
                {i % 3 === 0 && (
                  <div className="mt-3 bg-gray-50 p-2 rounded space-y-1">
                    <Skeleton height={12} width="60%" />
                    <Skeleton height={12} width="50%" />
                    <Skeleton height={12} width="55%" />
                    <Skeleton height={12} width="45%" />
                  </div>
                )}
                <Skeleton height={11} width={140} />
              </div>
              <Skeleton height={30} width={32} borderRadius={8} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// SAVED ITEMS PAGE
export const SavedSkeletonLoader = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Header */}
    <div className="mb-8 space-y-2">
      <Skeleton height={40} width={200} />
      <Skeleton height={14} width={100} />
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl overflow-hidden border border-gray-100"
        >
          <Skeleton height={192} borderRadius={0} />
          <div className="p-4 space-y-2">
            <Skeleton height={15} width="75%" />
            <Skeleton height={22} width="40%" />
            <Skeleton height={36} borderRadius={12} className="mt-3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// USER PROFILE PAGE
export const UserProfileSkeletonLoader = () => (
  <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 py-8 px-4">
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Avatar + name card */}
      <div className="bg-white rounded-2xl p-6 flex items-center gap-5 border border-gray-100">
        <Skeleton circle height={80} width={80} />
        <div className="space-y-2">
          <Skeleton height={24} width={180} />
          <Skeleton height={14} width={220} />
          <Skeleton height={20} width={80} borderRadius={99} />
        </div>
      </div>

      {/* Edit form card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-5">
        <Skeleton height={22} width={160} />

        {["Full Name", "Phone Number", "Gender"].map((label) => (
          <div key={label} className="space-y-1">
            <Skeleton height={13} width={100} />
            <Skeleton height={44} borderRadius={10} />
          </div>
        ))}

        <Skeleton height={44} borderRadius={10} />
      </div>

      {/* Account info card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-4">
        <Skeleton height={22} width={150} />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton circle height={36} width={36} />
            <div className="space-y-1">
              <Skeleton height={12} width={80} />
              <Skeleton height={14} width={180} />
            </div>
          </div>
        ))}
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-2xl p-6 border border-red-100 space-y-3">
        <Skeleton height={20} width={130} />
        <Skeleton height={14} width="80%" />
        <Skeleton height={40} width={160} borderRadius={10} />
      </div>
    </div>
  </div>
);

// REVIEW ORDERS (USER) PAGE
const OrderCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
    {/* Top row */}
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-3">
        <Skeleton circle height={40} width={40} />
        <div className="space-y-1">
          <Skeleton height={15} width={160} />
          <Skeleton height={12} width={110} />
        </div>
      </div>
      <Skeleton height={26} width={90} borderRadius={99} />
    </div>

    {/* Meta row */}
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-1">
          <Skeleton height={11} width={60} />
          <Skeleton height={14} width={80} />
        </div>
      ))}
    </div>

    {/* Buttons */}
    <div className="flex gap-2 justify-end pt-1">
      <Skeleton height={34} width={100} borderRadius={8} />
      <Skeleton height={34} width={80} borderRadius={8} />
    </div>
  </div>
);

export const ReviewOrdersSkeletonLoader = () => (
  <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4 sm:p-6">
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <Skeleton height={40} width={200} />
        <Skeleton height={14} width={160} />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} height={34} width={90} borderRadius={99} />
        ))}
      </div>

      {/* Order cards */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

// MANAGE ORDERS (ADMIN) PAGE
export const ManageOrdersSkeletonLoader = () => (
  <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4 sm:p-6">
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton height={36} width={220} />
          <Skeleton height={14} width={160} />
        </div>
        <Skeleton height={40} width={120} borderRadius={10} />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 space-y-1"
          >
            <Skeleton height={32} width={60} />
            <Skeleton height={14} width={100} />
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2 flex-wrap">
        {[...Array(6)].map((_, i) => (
          <div key={i}>
            <Skeleton height={32} width={60} />
          </div>
        ))}
      </div>

      {/* Order cards */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton circle height={40} width={40} />
                <div className="space-y-1">
                  <Skeleton height={15} width={180} />
                  <Skeleton height={12} width={130} />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton height={30} width={110} borderRadius={8} />
                <Skeleton height={30} width={34} borderRadius={8} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[...Array(4)].map((_, j) => (
                <div key={j} className="space-y-1">
                  <Skeleton height={11} width={55} />
                  <Skeleton height={14} width={75} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// USER FEEDBACK (ADMIN) PAGE
export const UserFeedbackSkeletonLoader = () => (
  <div className="min-h-screen bg-linear-to-br from-orange-50 to-amber-50 p-4 sm:p-6">
    <div className="max-w-5xl mx-auto">
      {/* Header + stats */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton height={36} width={200} />
          <Skeleton height={36} width={110} borderRadius={10} />
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 p-4 space-y-1"
            >
              <Skeleton height={28} width={50} />
              <Skeleton height={13} width={80} />
            </div>
          ))}
        </div>
      </div>

      {/* Feedback cards */}
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Skeleton circle height={40} width={40} />
                <div className="space-y-1">
                  <Skeleton height={15} width={150} />
                  <Skeleton height={12} width={200} />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton height={28} width={80} borderRadius={8} />
                <Skeleton height={28} width={60} borderRadius={8} />
                <Skeleton height={28} width={34} borderRadius={8} />
              </div>
            </div>
            <Skeleton height={13} width="90%" />
            <Skeleton height={13} width="75%" />
            <div className="flex gap-2">
              <Skeleton height={22} width={60} borderRadius={99} />
              <Skeleton height={22} width={80} borderRadius={99} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ADMIN PAGE (Users Table)
export const AdminPageSkeletonLoader = () => (
  <div className="w-full bg-linear-to-br from-orange-50 to-amber-50 py-8 px-4">
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton height={52} width={52} borderRadius={10} />
          <div className="space-y-2">
            <Skeleton height={28} width={220} />
            <Skeleton height={14} width={160} />
          </div>
        </div>
        <Skeleton height={40} width={130} borderRadius={10} />
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[...Array(1)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-gray-100 p-5 space-y-1"
          >
            <Skeleton height={32} width={60} />
            <Skeleton height={14} width={100} />
          </div>
        ))}
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <Skeleton height={44} borderRadius={10} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {/* Table head */}
        <div className="grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-100">
          {[
            "Name",
            "Email",
            "Gender",
            "Joined",
            "Phone",
            "Status",
            "Actions",
          ].map((col) => (
            <Skeleton key={col} height={14} width="70%" />
          ))}
        </div>
        {/* Table rows */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`grid grid-cols-7 gap-4 px-6 py-4 border-b border-gray-50 ${i % 2 !== 0 ? "bg-gray-50" : "bg-white"}`}
          >
            <Skeleton height={14} width="80%" />
            <Skeleton height={14} width="90%" />
            <Skeleton height={14} width="50%" />
            <Skeleton height={14} width="70%" />
            <Skeleton height={14} width="60%" />
            <Skeleton height={22} width={60} borderRadius={99} />
            <div className="flex justify-center">
              <Skeleton height={32} width={32} borderRadius={8} />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ABOUT PAGE
export const AboutSkeletonLoader = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Header */}
    <div className="text-center mb-12 flex flex-col items-center gap-3">
      <Skeleton height={22} width={120} />
      <Skeleton height={64} width={560} />
      <Skeleton height={24} width={600} />
      <Skeleton height={24} width={570} />
      <Skeleton height={26} width={500} />
    </div>

    {/* Features grid */}
    <div className="mb-12">
      <Skeleton height={24} width={140} className="mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-xl p-4 space-y-2"
          >
            <Skeleton height={22} width={110} borderRadius={99} />
            <Skeleton height={12} width="85%" />
            <Skeleton height={12} width="70%" />
          </div>
        ))}
      </div>
    </div>

    {/* Mission box */}
    <div className="bg-orange-50 border border-orange-100 rounded-2xl p-6 space-y-3">
      <Skeleton height={22} width={130} />
      <Skeleton height={14} width="95%" />
      <Skeleton height={14} width="90%" />
      <Skeleton height={14} width="75%" />
    </div>
  </div>
);

// CONTACT PAGE
export const ContactSkeletonLoader = () => (
  <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Header */}
    <div className="text-center mb-10 flex flex-col items-center gap-3">
      <Skeleton height={44} width={240} />
      <Skeleton height={16} width={260} />
    </div>

    {/* Form card */}
    <div className="bg-white rounded-2xl border border-gray-100 p-8 space-y-6">
      {["Your Name", "Email Address", "Message"].map((label, i) => (
        <div key={label} className="space-y-2">
          <Skeleton height={13} width={100} />
          <Skeleton height={i === 2 ? 120 : 44} borderRadius={10} />
        </div>
      ))}
      <Skeleton height={48} borderRadius={12} />
    </div>

    {/* Contact info cards */}
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-xl p-4 text-center"
        >
          <Skeleton circle height={40} width={40} />
          <div className="space-y-1">
            <Skeleton height={13} width={80} />
            <Skeleton height={14} width={130} />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// LEGACY — kept for backward compatibility
export const SkeletonLoader = () => (
  <div className="min-h-screen w-full bg-white p-6">
    <div className="mb-8 space-y-4">
      <Skeleton height={40} className="mb-4" />
      <div className="flex gap-4">
        <Skeleton width="25%" height={32} />
        <Skeleton width="25%" height={32} />
        <Skeleton width="25%" height={32} />
      </div>
    </div>
    <ProductGridSkeleton count={8} />
  </div>
);

export const SkeletonLoaderMinimal = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
    <Skeleton height={48} width={48} circle className="mb-4" />
    <Skeleton height={20} width={120} />
  </div>
);
