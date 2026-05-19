import { Link } from "react-router-dom";

const ViewAllLink = () => {
  return (
    <div>
      <Link
        to="/products"
        className="text-orange-500 hover:text-orange-700 text-lg font-bold flex items-center gap-1 hover:translate-x-2 transition-all"
      >
        View all
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </div>
  );
};

export default ViewAllLink;
