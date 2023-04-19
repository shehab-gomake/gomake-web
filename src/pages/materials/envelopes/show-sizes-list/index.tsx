import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowThicknesList } from "./use-show-thicknes-list";
import { ShowSizesListWidgetForEnvelopes } from "./show-sizes-list-widget";
import { refetchMaterialDataState } from "@/store/refetch-material-data";
import { useRecoilValue } from "recoil";

const ShowSubTableForEnvelopes = ({ item }: any) => {
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const { setShowUnderRowWidget } = useShowThicknesList();
  const onClickGetEnvelopesInside = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowSizesListWidgetForEnvelopes item={item} />,
      item,
      key: "categoryName",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickGetEnvelopesInside(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForEnvelopes };
