import { useState } from "react";
import { EditMenuIcon } from "./icons/edit-menu";
import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { DuplicateWithDifferentMenuIcon } from "./icons/duplicate-with-different-menu";
import { NegotiateRequestIcon } from "./icons/negotiate-request";
import { AnalysisIcon } from "./icons/analysis";
import { DeleteMenuIcon } from "./icons/delete-menu";
import { useRecoilValue } from "recoil";
import { quoteState } from "@/pages-components/quote/store/quote";
import { useGomakeRouter } from "@/hooks";
import { quoteItemState } from "@/store";

const useMoreCircle = ({ quoteItem }) => {
  const { navigate } = useGomakeRouter();
  const quoteStateValue = useRecoilValue<any>(quoteState);
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onClickEditQuoteItem = (quoteItem) => {
    navigate(
      `/products/edit?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${quoteItem?.productID}&quoteItem=${quoteItem?.id}`
    );
  };
  const onClickDuplicateQuoteItem = (quoteItem) => {
    navigate(
      `/products/duplicate?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${quoteItem?.productID}&quoteItem=${quoteItem?.id}`
    );
  };
  const menuList = [
    {
      name: "Edits",
      icon: <EditMenuIcon />,
      onclick: () => onClickEditQuoteItem(quoteItem),
    },
    {
      name: "Duplicate",
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickDuplicateQuoteItem(quoteItem),
    },
    {
      name: "Duplicate with different QTY",
      icon: <DuplicateWithDifferentMenuIcon />,
      onclick: () => quoteStateValue.onClickDuplicateWithDifferentQTY(quoteItem),
    },
    {
      name: "Negotiate request",
      icon: <NegotiateRequestIcon />,
      onclick: () => quoteStateValue.onOpenNegotiateRequest(),
    },
    {
      name: "Analysis",
      icon: <AnalysisIcon />,
      onclick: () => null,
    },
    {
      name: "Delete",
      icon: <DeleteMenuIcon />,
      onclick: () => quoteStateValue.onClickDeleteQouteItem(quoteItem),
    },
  ];

  return {
    open,
    anchorEl,
    menuList,
    handleClose,
    handleClick,
  };
};

export { useMoreCircle };
