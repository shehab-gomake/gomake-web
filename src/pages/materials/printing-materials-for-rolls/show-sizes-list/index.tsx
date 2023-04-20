import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowThicknesList } from "./use-show-thicknes-list";
import { ShowSizesListWidgetForPrintingMaterials } from "./show-sizes-list-widget";
import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { useRecoilValue } from "recoil";

const ShowSubTableForPrintingMaterials = ({ item }: any) => {
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const { setShowUnderRowWidget } = useShowThicknesList();
  const onClickGetProfileFramesInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowSizesListWidgetForPrintingMaterials item={item} />,
      item,
      key: "code",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickGetProfileFramesInside(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForPrintingMaterials };
