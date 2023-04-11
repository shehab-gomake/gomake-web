import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";
import { SheetPageMoreModal } from "./more-modal";
import { useApplicationModal } from "./use-application-modal";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

const ApplicationsMoreCircle = ({ item }: any) => {
  const {
    openModal,
    OnClickGetApplicationThickness,
    getApplicationThickness,
    applicationThickness,
    onCloseModal,
  } = useApplicationModal({
    item,
  });
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  const onClickGetSheetSizesInside = () => {
    OnClickGetApplicationThickness();
    setRefetchMaterialDataState({
      refetch: () => getApplicationThickness(item),
    });
  };
  return (
    <>
      <IconButton onClick={onClickGetSheetSizesInside}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
      <SheetPageMoreModal
        openModal={openModal}
        onCloseModal={onCloseModal}
        applicationThickness={applicationThickness}
      />
    </>
  );
};
export { ApplicationsMoreCircle };
