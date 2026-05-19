import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Cards = ({ categoryIcons, categories, formatName }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {categories.map((slug) => (
        <Link key={slug} to={`/category/${slug}`}>
          <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-xl hover:-translate-y-2 transition-all duration-200 text-center group cursor-pointer flex flex-col items-center justify-center min-h-30">
            {/* Emoji icon */}
            <div className="text-4xl mb-3 mt-6">
              {categoryIcons[slug] || "📦"}
            </div>
            {/* Category name */}
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors">
              {formatName(slug)}
            </h3>
            {/* Arrow */}
            <div className="text-orange-400 flex items-center gap-1 text-xs mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              Browse <ArrowRight size={14} strokeWidth={2} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Cards;
