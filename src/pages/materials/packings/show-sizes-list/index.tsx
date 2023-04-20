import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowList } from "./use-show-list";
import { ShowSupplierListWidgetForPackings } from "./show-sizes-list-widget";
import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { useRecoilValue } from "recoil";

const ShowSubTableForPackings = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowList();
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const onClickGetPackingsVolumesInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowSupplierListWidgetForPackings item={item} />,
      item,
      key: "code",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickGetPackingsVolumesInside(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForPackings };
