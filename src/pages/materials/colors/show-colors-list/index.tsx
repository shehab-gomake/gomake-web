import { useRecoilValue } from "recoil";
import Image from "next/image";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import moreCircle from "@/icons/more-circle.png";
import { IconButton } from "@mui/material";

import { ShowListWidgetForColors } from "./show-colors-list-widget";
import { useShowList } from "./use-show-list";

const ShowSubTableForColors = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowList();
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const onClickGetColorsInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowListWidgetForColors item={item} />,
      item,
      key: "code",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickGetColorsInside(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForColors };
