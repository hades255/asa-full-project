import { useState } from "react";
import { Modal } from "./Modal";

export const CancelBookingModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  loading = false 
}) => {
  const [cancelReason, setCancelReason] = useState("");

  const handleClose = () => {
    setCancelReason("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(cancelReason);
    setCancelReason("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Cancel Booking"
    >
      <div className="space-y-4">
        <p className="text-body1 text-semantic-content-contentSecondary">
          Are you sure you want to cancel this booking? This action cannot be undone.
        </p>
        
        <div>
          <label className="block text-body2 font-medium text-semantic-content-contentPrimary mb-2">
            Reason for cancellation (optional)
          </label>
          <textarea
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Please provide a reason for cancelling this booking..."
            className="w-full h-20 px-3 py-2 border border-semantic-background-backgroundTertionary rounded-lg bg-semantic-background-backgroundSecondary text-body1 text-semantic-content-contentPrimary placeholder-semantic-content-contentTertionary focus:outline-none focus:ring-2 focus:ring-semantic-content-contentPrimary resize-none"
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            onClick={handleClose}
            className="flex-1 py-2 px-4 bg-semantic-background-backgroundSecondary text-semantic-content-contentPrimary rounded-lg font-medium hover:bg-semantic-background-backgroundTertionary transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Cancel Booking"}
          </button>
        </div>
      </div>
    </Modal>
  );
};
