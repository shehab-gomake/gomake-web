import { PrimaryButton } from "@/components/button/primary-button";
import { EditIcon } from "@/components/icons/edit-icon";

const ShowDocumentData = (document, primaryColor, setOpenModal, setDocument, textEdit) => {

  const handleEditClick = async () => {
    setDocument(document)
    setOpenModal(true)
  };

  return (
  <PrimaryButton
    startIcon={
      <EditIcon color={primaryColor} width={18} height={18} />
    }
    onClick={handleEditClick}
    variant={"text"}
  >
    {textEdit}
  </PrimaryButton>
  );
};
export { ShowDocumentData };

