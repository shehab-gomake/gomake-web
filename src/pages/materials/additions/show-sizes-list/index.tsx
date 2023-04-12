import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowThicknesList } from "./use-show-thicknes-list";
import { ShowSizesListWidgetForAdditions } from "./show-sizes-list-widget";
import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { useRecoilValue, useSetRecoilState } from "recoil";

const ShowSubTableForAdditions = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowThicknesList();

  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const onClickGetSheetSizesInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowSizesListWidgetForAdditions item={item} />,
      item,
      key: "code",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickGetSheetSizesInside(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForAdditions };
