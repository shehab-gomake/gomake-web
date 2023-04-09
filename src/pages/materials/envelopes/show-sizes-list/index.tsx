import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowThicknesList } from "./use-show-thicknes-list";
import { ShowSizesListWidgetForEnvelopes } from "./show-sizes-list-widget";

const ShowSubTableForEnvelopes = ({ item }: any) => {
  console.log("item2", item);
  const { setShowUnderRowWidget } = useShowThicknesList();
  return (
    <>
      <IconButton
        onClick={() =>
          setShowUnderRowWidget({
            stateShow: true,
            widget: <ShowSizesListWidgetForEnvelopes item={item} />,
            item,
            key: "categoryName",
          })
        }
      >
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForEnvelopes };
