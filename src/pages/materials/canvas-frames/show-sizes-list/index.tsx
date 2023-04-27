import { useRecoilValue } from "recoil";
import Image from "next/image";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import moreCircle from "@/icons/more-circle.png";
import { IconButton } from "@mui/material";

import { ShowSizesListWidgetForCanvasFrames } from "./show-sizes-list-widget";
import { useShowList } from "./use-show-list";

const ShowSubTableForCanvasFrames = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowList();

  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const onClickGetCanvasFrameSizesInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowSizesListWidgetForCanvasFrames item={item} />,
      item,
      key: "code",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickGetCanvasFrameSizesInside(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForCanvasFrames };
