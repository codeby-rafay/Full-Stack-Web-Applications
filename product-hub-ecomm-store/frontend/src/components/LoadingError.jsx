// Loading Spinner Component
export function Loading() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
      <p className="mt-4 text-gray-500 text-sm">Loading products...</p>
    </div>
  );
}

// Error Message Component
export function ErrorMessage({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-5xl mb-4">
        <img
          className="size-12"
          src="https://www.svgrepo.com/show/444337/gui-check-no.svg"
          alt="Error-Icon"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Something went wrong
      </h3>
      <p className="text-gray-500 text-sm">
        {message || "Failed to load data. Please try again."}
      </p>
    </div>
  );
}

// No Results Component
export function NoResults({ message }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="text-5xl mb-4">
        <img
          className="size-12"
          src="https://www.svgrepo.com/show/55183/search.svg"
          alt="Search-Icon"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        No results found
      </h3>
      <p className="text-gray-500 text-sm">
        {message || "Try a different search term."}
      </p>
    </div>
  );
}
