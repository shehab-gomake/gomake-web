import { GoMakeModal } from "@/components";
import { useTranslation } from "react-i18next";
import { useStyle } from "../../style";
import { GoMakeTextEditor } from "@/components/text-editor/go-make-text-editor";

const NotesForActionModal = ({
  onClose,
  openModal,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const addComment = (comment: string) => {
    console.log("fffff", comment)
  }

  return (
    <GoMakeModal
      openModal={openModal}
      onClose={onClose}
      modalTitle={"Notes for Action"}
      insideStyle={classes.modalStyle}
    >
      <GoMakeTextEditor onSend={addComment} containerStyle={{ marginTop: 10, marginBottom: 20 }} />
    </GoMakeModal>
  );
};

export { NotesForActionModal };
