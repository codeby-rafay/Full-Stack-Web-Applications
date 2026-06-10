import { useSavedItems } from "../../redux/hooks";
import { saveToast, unsaveToast } from "../../utils/toastUtils";

const SaveBtn = ({ product }) => {
  const { toggleSave, isSaved } = useSavedItems();

  const saved = isSaved(product?.id);

  const handleClick = () => {
    if (product) {
      toggleSave(product);
      {
        !saved ? saveToast() : unsaveToast();
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleClick}
        title={saved ? "Remove from saved" : "Save for later"}
        className={`py-3 px-4 flex items-center gap-2 cursor-pointer rounded-xl transition-colors ${
          saved
            ? "bg-red-100 hover:bg-red-200 text-red-600"
            : "bg-gray-200 hover:bg-gray-300 text-gray-900"
        }`}
      >
        <img
          className="size-4"
          src={
            saved
              ? "https://www.svgrepo.com/show/535436/heart.svg"
              : "https://www.svgrepo.com/show/447850/wishlist.svg"
          }
          alt="Wishlist"
        />
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
};

export default SaveBtn;
