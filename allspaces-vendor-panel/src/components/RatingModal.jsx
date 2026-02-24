import { useState } from "react";
import { Star1, CloseCircle } from "iconsax-react";
import AppButton from "./new/AppButton";

export const RatingModal = ({ isOpen, onClose, onSubmit, isSubmitting = false }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }
    
    try {
      await onSubmit(rating, comment);
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Error submitting rating:", error);
    }
  };

  const handleClose = () => {
    setRating(0);
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-semantic-border-borderPrimary">
          <h2 className="text-heading3 font-semibold text-semantic-content-contentPrimary">
            Rate Your Experience
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-semantic-background-backgroundSecondary rounded-lg transition-colors"
          >
            <CloseCircle size={20} className="text-semantic-content-contentTertionary" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Star Rating */}
          <div className="mb-6">
            <label className="block text-body1 font-medium text-semantic-content-contentPrimary mb-3">
              How would you rate this booking?
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-colors"
                >
                  <Star1
                    size={32}
                    className={
                      star <= rating
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-body2 text-semantic-content-contentSecondary mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-body1 font-medium text-semantic-content-contentPrimary mb-3">
              Share your experience (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              className="w-full p-3 border border-semantic-border-borderPrimary rounded-lg focus:ring-2 focus:ring-semantic-color-colorPrimary focus:border-transparent outline-none resize-none"
              rows={4}
              maxLength={500}
            />
            <p className="text-body2 text-semantic-content-contentTertionary mt-1">
              {comment.length}/500 characters
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <AppButton
              type="button"
              title="Cancel"
              variant="textBtn"
              className="flex-1 border border-semantic-border-borderPrimary hover:bg-semantic-background-backgroundSecondary transition-colors"
              onClick={handleClose}
            />
            <AppButton
              type="submit"
              title="Submit Rating"
              className="flex-1"
              disabled={rating === 0 || isSubmitting}
              loading={isSubmitting}
            />
          </div>
        </form>
      </div>
    </div>
  );
};
