import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowThicknesList } from "./use-show-thicknes-list";
import { ShowSizesListWidgetForPlats } from "./show-sizes-list-widget";

const ShowSubTableForPlats = ({ item }: any) => {
  const { setShowUnderRowWidget } = useShowThicknesList();

  return (
    <>
      <IconButton
        onClick={() =>
          setShowUnderRowWidget({
            stateShow: true,
            widget: <ShowSizesListWidgetForPlats item={item} />,
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
export { ShowSubTableForPlats };
