import { useRecoilValue } from "recoil";
import Image from "next/image";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import moreCircle from "@/icons/more-circle.png";
import { IconButton } from "@mui/material";

import { ShowListWidgetForMagnets } from "./show-magnets-list-widget";
import { useShowList } from "./use-show-list";

const ShowSubTableForMagnets = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowList();
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const onClickGetMagnetsInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowListWidgetForMagnets item={item} />,
      item,
      key: "code",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickGetMagnetsInside(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForMagnets };
