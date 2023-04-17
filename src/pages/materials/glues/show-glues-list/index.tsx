import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowList } from "./use-show-list";
import { ShowListWidgetForGlues } from "./show-glues-list-widget";
import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { useRecoilValue } from "recoil";

const ShowSubTableForGlues = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowList();
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const onClickGetGluesInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowListWidgetForGlues item={item} />,
      item,
      key: "code",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickGetGluesInside(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForGlues };
