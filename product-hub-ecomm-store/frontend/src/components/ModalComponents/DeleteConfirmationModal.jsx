import { useState, useEffect } from "react";
import { X, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DeleteConfirmationModal = ({
  showDeleteModal,
  handleCancelDelete,
  handleConfirmDelete,
  title = "Remove Order",
  description = "You sure you want to remove this order?",
  buttonLabel = "Delete",
}) => {
  const [confirmDisabled, setConfirmDisabled] = useState(false);

  // Wrap the provided handler to prevent double clicks
  const onConfirm = async () => {
    if (confirmDisabled) return;
    setConfirmDisabled(true);

    try {
      const result = handleConfirmDelete && handleConfirmDelete();
      if (result && typeof result.then === "function") {
        await result;
      }
    } catch (err) {
      throw err || new Error("An error occurred while confirming the action.");
    } finally {
      setConfirmDisabled(false);
    }
  };

  // Re-enable confirm button when modal closes or after handler finishes
  useEffect(() => {
    if (!showDeleteModal) {
      setConfirmDisabled(false);
    }
  }, [showDeleteModal]);

  const titleParts = title.split(" ");
  const firstWord = titleParts[0];
  const restWords = titleParts.slice(1).join(" ");

  return (
    <AnimatePresence>
      {showDeleteModal && (
        <motion.div
          className="fixed inset-0 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex justify-end p-4">
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-full p-2 transition-colors cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="py-4 sm:py-12 px-8 sm:px-12 flex flex-col items-center justify-center gap-7">
              <div className="bg-red-100 rounded-full p-4">
                <Trash2 size={48} className="text-red-600" />
              </div>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {firstWord}
                  <span className="font-light"> {restWords}</span>
                </h2>
                <p className="text-gray-600 text-sm font-semibold opacity-60">
                  {description}
                </p>
              </div>

              <div className="flex justify-center gap-3 w-full">
                <button
                  onClick={handleCancelDelete}
                  className="flex-1 px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={confirmDisabled}
                  className={`flex-1 px-6 py-2 text-white cursor-pointer font-semibold rounded-lg transition-colors ${
                    confirmDisabled
                      ? "bg-red-400 opacity-70 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {buttonLabel}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;
