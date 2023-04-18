import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowList } from "./use-show-list";
import { ShowListWidgetForVarnishs } from "./show-varnishs-list-widget";
import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { useRecoilValue } from "recoil";

const ShowSubTableForVarnishs = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowList();
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const onClickGetVarnishsInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowListWidgetForVarnishs item={item} />,
      item,
      key: "code",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickGetVarnishsInside(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForVarnishs };
