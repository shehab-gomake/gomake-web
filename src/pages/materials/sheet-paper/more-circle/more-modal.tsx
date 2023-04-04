import { GoMakeModal } from "@/components";

const SheetPageMoreModal = ({ openModal, setOpenModal }: any) => {
  return (
    <GoMakeModal
      openModal={openModal}
      modalTitle="Test"
      onClose={() => setOpenModal(false)}
      insideStyle={{ width: "100%" }}
    >
      <div>"ggggg</div>
    </GoMakeModal>
  );
};
export { SheetPageMoreModal };
