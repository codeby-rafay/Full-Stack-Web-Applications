import { Star } from "lucide-react";

const CustomerReview = ({ product }) => {
  return (
    <div>
      {product && product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h2
            className="text-xl font-bold text-gray-900 mb-6"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Customer Reviews ({product.reviews.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm text-gray-800">
                    {review.reviewerName}
                  </span>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, i) => (
                      <span
                        key={i}
                        className={`text-xs ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        <Star strokeWidth={3} fill="currentColor" size={12} />
                      </span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-500 text-sm">{review.comment}</p>
                <p className="text-gray-400 text-xs mt-2">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerReview;
