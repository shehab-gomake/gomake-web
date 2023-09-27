import { PrimaryButton } from "@/components/button/primary-button";
import { EditIcon } from "@/components/icons/edit-icon";

const ShowDocumentData = ({ item }: any) => {

  return (
<PrimaryButton
      startIcon={<EditIcon color="#8283BE" width={20} height={20} />}
      variant={"text"}
      onClick={()=>alert("Hello World!")}
    >
      {'Edit'}
    </PrimaryButton>

  );
};
export { ShowDocumentData };

