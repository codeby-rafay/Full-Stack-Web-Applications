import { useEffect, useState } from "react";
import { getCategoryList } from "../api/products";
import { Loading, ErrorMessage } from "../components/LoadingError";
import { CategoriesSkeletonLoader } from "../components/SkeletonLoader";
import {
  ShoppingCart,
  Armchair,
  House,
  CookingPot,
  Laptop,
  Shirt,
  Watch,
  Smartphone,
  Motorbike,
  Tablet,
  Gem,
  Handbag,
  SoapDispenserDroplet,
  WandSparkles,
  ArrowRight,
} from "lucide-react";
import Cards from "../components/CategoriesCardComponents/Cards";

const categoryIcons = {
  "beauty": <WandSparkles size={38} strokeWidth={1.75} />,
  "fragrances": ( <img className="size-10" src="https://www.svgrepo.com/show/180246/perfume-fashion.svg" alt="Fragrances" /> ),
  "furniture": <Armchair size={38} strokeWidth={1.75} />,
  "groceries": <ShoppingCart size={38} strokeWidth={1.75} />,
  "home-decoration": <House size={38} strokeWidth={1.75} />,
  "kitchen-accessories": <CookingPot size={38} strokeWidth={1.75} />,
  "laptops": <Laptop size={38} strokeWidth={1.75} />,
  "mens-shirts": <Shirt size={38} strokeWidth={1.75} />,
  "mens-shoes": ( <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 32 32" alt="Men's Shoes"><path fill="#000000" d="M4.725 6.175a1.01 1.01 0 0 0-.172.138l-2.91 2.91a2.183 2.183 0 0 0-.018 3.066l.019.02l.09.099l.346.374c.3.323.731.788 1.263 1.354a285.44 285.44 0 0 0 4.129 4.308c3.168 3.233 6.973 6.932 9.24 8.456c2.553 1.724 4.873 2.695 6.567 3.236c.848.27 1.538.434 2.025.53a11.638 11.638 0 0 0 .728.121l.035.004c.675.107 1.272.126 1.803.015a2.661 2.661 0 0 0 1.377-.739l.7-.7c.052-.052.097-.109.136-.169a3.048 3.048 0 0 0 1-2.262c-.117-1.293-1.337-2.04-2.417-2.7a4.624 4.624 0 0 1-1.428-1.1l-.795-1.856h.007a1.05 1.05 0 1 0 0-2.1h-.907l-.644-1.504a1.05 1.05 0 0 0-.39-2.026h-.478l-.532-1.241a1.05 1.05 0 0 0-.05-2.099H22.6l-.411-.96c-.062-.15-.1-.258-.132-.35a2.538 2.538 0 0 0-.72-1.137l-.52-.521a2.147 2.147 0 0 0-.847-.502v-.45c-.625-1.885-2.905-2.542-4.434-1.395l-2.128-2.17a2.063 2.063 0 0 0-.021-2.925a3.113 3.113 0 0 0-4.395 0L4.725 6.175Zm9.462 9.18l.003-.745c0-1.7-.66-3.32-1.84-4.53L8.04 5.684l2.365-2.368a1.058 1.058 0 0 1 1.587.1a2.056 2.056 0 0 0 0 2.9l4.43 4.442a2.147 2.147 0 0 0 2.98 0l.52.52a.689.689 0 0 1 .245.379l.003.01c.043.124.096.274.18.469l.074.174h-.944c-.58 0-1.05.47-1.05 1.05a1.061 1.061 0 0 0 1.05 1.05h1.844l.531 1.24h-.785c-.58 0-1.05.47-1.05 1.05a1.061 1.061 0 0 0 1.05 1.05h1.685l.612 1.43h-.977c-.58 0-1.05.47-1.05 1.05c0 .29.12.55.31.74c.19.19.45.3.74.31h1.877l1.133 2.646a5.09 5.09 0 0 0 2.227 2.012l.003.002c.503.307 1.438.877 1.463 1.162c0 .056-.055.227-.305.507a21.638 21.638 0 0 1-4.997-1.242c-2.942-1.132-5.983-3.143-7.118-6.701l-.001-.002c-.405-1.26-1.318-2.727-2.376-4.163a34.308 34.308 0 0 0-.109-.146ZM3.055 10.891a.17.17 0 0 1 0-.215L5.29 8.44a98.61 98.61 0 0 1 3.93 4.08c1.207 1.33 2.446 2.785 3.465 4.167c1.034 1.403 1.781 2.652 2.082 3.587a11 11 0 0 0 .148.435L3.057 10.893l-.002-.002Z"/></svg> ) ,
  "mens-watches": <Watch size={38} strokeWidth={1.75} />,
  "mobile-accessories": <Smartphone size={38} strokeWidth={1.75} />,
  "motorcycle": <Motorbike size={38} strokeWidth={1.75} />,
  "skin-care": <SoapDispenserDroplet size={38} strokeWidth={1.75} />,
  "smartphones": ( <img className="size-10" src="https://www.svgrepo.com/show/499623/mobile.svg" alt="Smartphones" /> ),
  "sports-accessories": ( <img className="size-10" src="https://www.svgrepo.com/show/446025/sports-soccer.svg" alt="Sports Accessories" />),
  "sunglasses": ( <img className="size-10" src="https://www.svgrepo.com/show/488212/glasses.svg" alt="Sunglasses" /> ),
  "tablets": <Tablet size={38} strokeWidth={1.75} />,
  "tops": ( <img className="size-10" src="https://www.svgrepo.com/show/482584/dress-4.svg" alt="Tops" /> ),
  "vehicle": ( <img className="size-10" src="https://www.svgrepo.com/show/490616/car-hatchback.svg" alt="Vehicle" /> ),
  "womens-bags": <Handbag size={38} strokeWidth={1.75} />,
  "womens-dresses": ( <svg xmlns="http://www.w3.org/2000/svg" width="38" height="38" viewBox="0 0 24 24" fill="#000000" alt="Womens Dresses"><g fill="none" stroke="#000000" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" color="currentColor"><path d="m15 4l-3 2l-3-2c-.586.51-1.93 1.293-1.997 2.146c-.029.37.126.571.435.975C8.112 8.002 9 8.521 9 10h6c0-1.48.888-1.998 1.562-2.879c.31-.404.464-.606.434-.975C16.93 5.293 15.587 4.509 15 4M9 4V2m6 2V2m-5.5 8h5m3.5 9c2 0 3-2.173 3-2.173c-2.825-1.836-4.5-3.993-5.413-5.622c-.347-.62-.521-.93-.755-1.068C14.598 10 14.285 10 13.659 10H10.34c-.626 0-.939 0-1.173.137s-.408.447-.755 1.068C7.5 12.834 5.825 14.99 3 16.827C3 16.827 4 19 6 19"/><path d="M13.706 14c.34.796 1.815 2.671 3.435 4.31c.597.605.896.907.855 1.42c-.04.512-.29.683-.79 1.025C16.07 21.53 14.336 22 12 22s-4.07-.469-5.207-1.245c-.5-.342-.75-.513-.79-1.025c-.04-.513.259-.815.856-1.42c1.62-1.639 3.096-3.514 3.435-4.31"/></g></svg> ),
  "womens-jewellery": <Gem size={38} strokeWidth={1.75} />,
  "womens-shoes": ( <img className="size-10" src="https://www.svgrepo.com/show/482644/glass-shoe.svg" alt="Womens Shoes" /> ) ,
  "womens-watches": <Watch size={38} strokeWidth={1.75} />,
};

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    // Fetch category list when component loads
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getCategoryList();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const formatName = (slug) => {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-gray-900"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          Product <span className="text-orange-500">Categories</span>
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {categories.length} categories available
        </p>
      </div>

      {loading && <CategoriesSkeletonLoader />}
      {error && <ErrorMessage message={error} />}

     {!loading && !error && (
      <Cards categoryIcons={categoryIcons} categories={categories} formatName={formatName} />
      )}
    </div>
  );
}

export default Categories;
