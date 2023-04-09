import Image from "next/image";

import { IconButton } from "@mui/material";

import moreCircle from "@/icons/more-circle.png";

import { useShowThicknesList } from "./use-show-thicknes-list";
import { ShowThicknesListWidgetForLamination } from "./show-thicknes-list-widget";

const ShowSubTableForLamination = ({ item, categoryName, sizeId }: any) => {
  const { setShowUnderRowWidget } = useShowThicknesList();

  return (
    <>
      <IconButton
        onClick={() =>
          setShowUnderRowWidget({
            stateShow: true,
            widget: (
              <ShowThicknesListWidgetForLamination
                item={item}
                categoryName={categoryName}
                sizeId={sizeId}
              />
            ),
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
export { ShowSubTableForLamination };
