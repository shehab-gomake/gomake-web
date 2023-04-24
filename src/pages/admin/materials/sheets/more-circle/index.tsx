import Image from "next/image";
import { useRecoilValue } from "recoil";

import moreCircle from "@/icons/more-circle.png";
import { IconButton, Tooltip } from "@mui/material";

import { useSheetModal } from "./use-sheet-modal";
import { UpdateSheetModal } from "../update-sheet-modal";
import { materialSheetsState } from "../store/sheets";
import { GoMakeDeleteMaterialModal } from "@/widgets";

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

      <GoMakeDeleteMaterialModal
        openModal={openDeleteModal}
        onOpen={onOpenDeleteModal}
        onClose={onCloseDeleteModal}
        onClickDelete={deleteSheetByCategoryName}
        subTitle={`Are you sure you delete sheet by categoryName ${item?.categoryName} ?`}
      />
      <UpdateSheetModal />
    </>
  );
};
export { SheetPageMoreCircle };
