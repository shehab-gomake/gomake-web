import Image from "next/image";
import { useSetRecoilState } from "recoil";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import DeleteIcon from "@mui/icons-material/Delete";
import moreCircle from "@/icons/more-circle.png";
import { IconButton } from "@mui/material";

import { SheetPageMoreModal } from "./more-modal";
import { useSheetModal } from "./use-sheet-modal";
import { GoMakeDeleteModal } from "@/components";

const SheetPageMoreCircle = ({ item }: any) => {
  const {
    sheetSizes,
    openModal,
    openDeleteModal,
    OnClickGetSheetSizes,
    onCloseModal,
    getSheetSizes,
    onCloseDeleteModal,
    onOpenDeleteModal,
    deleteSheetByCategoryName,
  } = useSheetModal({
    item,
  });
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  const onClickGetSheetSizesInside = () => {
    OnClickGetSheetSizes();
    setRefetchMaterialDataState({
      refetch: () => getSheetSizes(item),
    });
  };
  return (
    <>
      <IconButton onClick={onClickGetSheetSizesInside}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
      <IconButton onClick={onOpenDeleteModal}>
        <DeleteIcon style={{ color: "#a1a2cd" }} />
      </IconButton>
      <SheetPageMoreModal
        openModal={openModal}
        onCloseModal={onCloseModal}
        sheetSizes={sheetSizes}
      />
      <GoMakeDeleteModal
        title={"Delete"}
        yesBtn={"Delete"}
        openModal={openDeleteModal}
        onClose={onCloseDeleteModal}
        subTitle="Are you sure you delete sheet?"
        onClickDelete={deleteSheetByCategoryName}
      />
    </>
  );
};
export { SheetPageMoreCircle };
