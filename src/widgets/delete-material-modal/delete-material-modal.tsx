import { GoMakeDeleteModal } from "@/components";
import { IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const GoMakeDeleteMaterialModal = ({
  onOpen,
  onClose,
  openModal,
  onClickDelete,
  subTitle,
  isOpen,
}: any) => {
  return (
    <>
      <Tooltip title={"Delete"}>
        <IconButton onClick={onOpen}>
          <DeleteIcon style={{ color: "#a1a2cd" }} />
        </IconButton>
      </Tooltip>
      {isOpen && (
        <GoMakeDeleteModal
          title={"Delete Sheet"}
          yesBtn={"Delete"}
          openModal={openModal}
          onClose={onClose}
          subTitle={subTitle}
          onClickDelete={() => {
            onClickDelete();
            onClose();
          }}
        />
      )}
    </>
  );
};
export { GoMakeDeleteMaterialModal };
