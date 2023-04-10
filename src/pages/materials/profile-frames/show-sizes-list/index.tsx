import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowThicknesList } from "./use-show-thicknes-list";
import { ShowSizesListWidgetForProfileFrame } from "./show-sizes-list-widget";

const ShowSubTableForProfileFrame = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowThicknesList();
  return (
    <>
      <IconButton
        onClick={() =>
          setShowUnderRowWidget({
            stateShow: true,
            widget: <ShowSizesListWidgetForProfileFrame item={item} />,
            item,
            key: "code",
          })
        }
      >
        <Image src={moreCircle} width={24} height={24} alt="More" />
      </IconButton>
    </>
  );
};
export { ShowSubTableForProfileFrame };
