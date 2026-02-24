import { CloseCircle } from "iconsax-react";
import { useEffect } from "react";

export const Modal = ({ isOpen, onClose, title, children }) => {
  // Prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="max-h-[90vh] overflow-y-auto relative bg-semantic-background-backgroundPrimary rounded-2xl shadow-lg w-full max-w-md mx-4 animate-fadeIn z-10">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-semantic-background-backgroundSecondary px-5 py-3">
          <h2 className="text-heading4 font-semibold text-semantic-content-contentPrimary">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <CloseCircle
              size={24}
              className="text-semantic-content-contentPrimary"
            />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};
