import Image from "next/image";
import { useRecoilValue } from "recoil";

import DeleteIcon from "@mui/icons-material/Delete";
import moreCircle from "@/icons/more-circle.png";
import { IconButton, Tooltip } from "@mui/material";

import { useSheetModal } from "./use-sheet-modal";
import { GoMakeDeleteModal } from "@/components";
import { UpdateSheetModal } from "../update-sheet-modal";
import { materialSheetsState } from "../store/sheets";

const SheetPageMoreCircle = ({ item }: any) => {
  const {
    openDeleteModal,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteSheetByCategoryName,
    t,
  } = useSheetModal({
    item,
  });
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <Tooltip title={"Edit"}>
        <IconButton
          onClick={() => {
            materialSheetsStateValue?.onOpnUpdateModal(item);
          }}
        >
          <Image src={moreCircle} width={24} height={24} alt="More" />
        </IconButton>
      </Tooltip>
      <Tooltip title={"Delete"}>
        <IconButton onClick={onOpenDeleteModal}>
          <DeleteIcon style={{ color: "#a1a2cd" }} />
        </IconButton>
      </Tooltip>

      <GoMakeDeleteModal
        title={"Delete Sheet"}
        yesBtn={"Delete"}
        openModal={openDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle={`Are you sure you delete sheet by categoryName ${item?.categoryName} ?`}
        onClickDelete={deleteSheetByCategoryName}
      />
      <UpdateSheetModal />
    </>
  );
};
export { SheetPageMoreCircle };
