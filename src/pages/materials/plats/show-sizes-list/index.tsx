import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowThicknesList } from "./use-show-thicknes-list";
import { ShowSizesListWidgetForPlats } from "./show-sizes-list-widget";
import { useRecoilValue } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

const ShowSubTableForPlats = ({ item }: any) => {
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const { setShowUnderRowWidget } = useShowThicknesList();
  const onClickGetProfileFramesInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowSizesListWidgetForPlats item={item} />,
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
export { ShowSubTableForPlats };
