import { useRecoilValue } from "recoil";

import { useStyle } from "../style";
import { profitsState } from "../store/profits";
import { AddIcon, MoreCircleIcon } from "@/icons";
import { IconButton } from "@mui/material";

const ProductList = () => {
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const array = [
    {
      name: "Flyer",
      details:
        "this is text for product new of this current available details  this is text for product new of this current available details ",
      more: (
        <IconButton>
          <MoreCircleIcon />
        </IconButton>
      ),
    },
    {
      name: "Test 1",
      details:
        "this is text for product new of this current available details  this is text for product new of this current available details ",
      more: (
        <IconButton>
          <MoreCircleIcon />
        </IconButton>
      ),
    },
  ];
  return (
    <div style={clasess.mainContainerForProductTable}>
      <div style={clasess.titleHeadersTale}>
        <div style={clasess.titleHederTextStyle}>Item name</div>
        <div style={clasess.titleHederTextStyle}>Details</div>
        <div style={clasess.titleHederTextStyle}>More</div>
      </div>
      <div style={{ width: "100%" }}>
        {array?.map((item, index) => {
          return (
            <div
              style={
                index & 1
                  ? clasess.bodyTableEvenContainer
                  : clasess.bodyTableOddContainer
              }
            >
              <div style={clasess.nameStyle}>{item?.name}</div>
              <div style={clasess.detailsStyle}>{item?.details}</div>
              <div style={clasess.moreStyle}>{item?.more}</div>
            </div>
          );
        })}
      </div>
      <div style={clasess.addNewProductContainer}>
        <AddIcon />
        <div style={clasess.addProductStyle}>Add test product</div>
      </div>
    </div>
  );
};
export { ProductList };
