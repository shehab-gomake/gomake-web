import { usePricingListMenu } from "./use-menu-modal";

import { IconButton, MenuItem } from "@mui/material";
import { MoreCircleIcon } from "@/icons";
import { GoMakeMenu } from "@/components";
import { useRecoilState, useRecoilValue } from "recoil";
import { profitsState } from "../../../store/profits";
import { editPriceListState } from "../../../store/edit-price-list";
import { actionExceptionProfitId } from "@/store";
import DeleteIcon from "@mui/icons-material/Delete";

const PricingListMenuWidget = ({ item }: any) => {
  const { open, handleClose, handleClick, anchorEl } = usePricingListMenu();
  const profitsStateValue = useRecoilValue<any>(profitsState);
  const [, setEditPriceListState] = useRecoilState<any>(editPriceListState);
  const actionExceptionProfitIdValue = useRecoilValue<any>(
    actionExceptionProfitId
  );

  return (
    <>
      <IconButton onClick={handleClick}>
        <MoreCircleIcon />

        {/* <DeleteIcon style={{ color: "#a1a2cd" }} /> */}
      </IconButton>
      <GoMakeMenu handleClose={handleClose} open={open} anchorEl={anchorEl}>
        {/* <MenuItem
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
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            actionExceptionProfitIdValue
              ? profitsStateValue?.deleteActionExceptionProfitRow(item?.id)
              : profitsStateValue?.deleteActionProfitRow(item?.id);
            handleClose();
          }}

          // onClick={() => profitsStateValue?.deleteActionProfitRow(item?.id)}
        >
          Delete
        </MenuItem>
      </GoMakeMenu>
    </>
  );
};
export { PricingListMenuWidget };
