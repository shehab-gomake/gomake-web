import { PrimaryButton } from "@/components/button/primary-button";
import { EditIcon } from "@/components/icons/edit-icon";
import { IDocument } from "../interface/document";

const ShowDocumentData = (document : IDocument , primaryColor : string, setOpenModal : (value: boolean) => void, setDocument :  (document: IDocument) => void, textEdit : string) => {

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