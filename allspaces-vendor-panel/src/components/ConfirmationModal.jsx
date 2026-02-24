import { Modal } from "./Modal";
import { Warning2 } from "iconsax-react";
import AppButton from "./new/AppButton";

export const ConfirmationModal = ({
  modalOpen,
  setModalOpen,
  setState,
  title,
  subtitle,
  onYesPress,
  onNoPress,
  loading,
}) => {
  return (
    <Modal
      isOpen={modalOpen}
      onClose={() => {
        setModalOpen((prev) => !prev);
        setState();
      }}
      title={title}
    >
      <div className="flex flex-1 items-center justify-center flex-col gap-y-6">
        <Warning2 className="text-core-warning w-16 h-16" />
        <p className="font-semibold text-body1 text-semantic-content-contentPrimary">{`${subtitle}`}</p>
        <div className="w-full gap-x-2 flex items-center justify-between">
          <AppButton
            loading={loading}
            title={`Continue`}
            onClick={onYesPress}
          />
          <AppButton variant="textBtn" title={`Cancel`} onClick={onNoPress} />
        </div>
      </div>
    </Modal>
  );
};
