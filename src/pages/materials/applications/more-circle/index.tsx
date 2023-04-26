import { useSetRecoilState } from "recoil";
import Image from "next/image";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import moreCircle from "@/icons/more-circle.png";
import { IconButton } from "@mui/material";

import { useApplicationModal } from "./use-application-modal";
import { SheetPageMoreModal } from "./more-modal";

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
