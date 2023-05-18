import { usePricingListMenu } from "./use-menu-modal";

import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useRecoilState, useRecoilValue } from "recoil";
import { profitsState } from "../../../store/profits";
import { editPriceListState } from "../../../store/edit-price-list";

const PricingListMenuWidget = ({ item }: any) => {
  const { open, handleClose, handleClick, anchorEl } = usePricingListMenu();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const [editPriceListStateValue, setEditPriceListState] =
    useRecoilState<any>(editPriceListState);

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        <MenuItem
          onClick={() => {
            setEditPriceListState({
              isEdit: true,
              state: { ...item },
              id: item.id,
            });
            handleClose();
          }}
        >
          Edit
        </MenuItem>
        <MenuItem
          onClick={() => profitsStateValue?.deleteActionProfitRow(item?.id)}
        >
          Delete
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { PricingListMenuWidget };
