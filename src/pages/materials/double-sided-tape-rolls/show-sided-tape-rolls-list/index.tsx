import { useRecoilValue } from "recoil";
import Image from "next/image";

import { refetchMaterialDataState } from "@/store/refetch-material-data";
import moreCircle from "@/icons/more-circle.png";
import { IconButton } from "@mui/material";

import { ShowListWidgetForDoubleSidedTapeRolls } from "./show-sided-tape-rolls-list-widget";
import { useShowList } from "./use-show-list";

const ShowSubTableForDoubleSidedTapeRolls = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowList();
  const refetchMaterialData = useRecoilValue(refetchMaterialDataState);
  const onClickInsideDoubleSidedTapeRollsStock = (item: any) => {
    refetchMaterialData?.refetch();
    setShowUnderRowWidget({
      stateShow: true,
      widget: <ShowListWidgetForDoubleSidedTapeRolls item={item} />,
      item,
      key: "code",
    });
  };
  return (
    <>
      <IconButton onClick={() => onClickInsideDoubleSidedTapeRollsStock(item)}>
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForDoubleSidedTapeRolls };
