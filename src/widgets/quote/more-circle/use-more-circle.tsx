import { useState } from "react";
import { EditMenuIcon } from "./icons/edit-menu";
import { DuplicateMenuIcon } from "./icons/duplicate-menu";
import { DuplicateWithDifferentMenuIcon } from "./icons/duplicate-with-different-menu";
import { NegotiateRequestIcon } from "./icons/negotiate-request";
import { AnalysisIcon } from "./icons/analysis";
import { DeleteMenuIcon } from "./icons/delete-menu";
import { useRecoilValue } from "recoil";
import { useGomakeRouter } from "@/hooks";
import { quoteItemState } from "@/store";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

const useMoreCircle = ({
  quoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickDeleteQouteItem,
  documentType
}) => {
  const { navigate } = useGomakeRouter();
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const onClickEditQuoteItem = (quoteItem , documentType) => {
    navigate(
      `/products/edit?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${quoteItem?.productID}&quoteItem=${quoteItem?.id}&documentType=${documentType}`
    );
  };
  const onClickDuplicateQuoteItem = (quoteItem , documentType) => {
    navigate(
      `/products/duplicate?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${quoteItem?.productID}&quoteItem=${quoteItem?.id}&documentType=${documentType}`
    );
  };
  const menuList = [
    {
      name: "Edits",
      icon: <EditMenuIcon />,
      onclick: () => onClickEditQuoteItem(quoteItem , documentType),
    },
    {
      name: "Duplicate", 
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickDuplicateQuoteItem(quoteItem , documentType),
    },
    documentType===DOCUMENT_TYPE.quote && {
      name: "Duplicate with different QTY",
      icon: <DuplicateWithDifferentMenuIcon />,
      onclick: () => onClickDuplicateWithDifferentQTY(quoteItem),
    },
    {
      name: "Negotiate request",
      icon: <NegotiateRequestIcon />,
      // onclick: () => onOpenNegotiateRequest(),
    },
    {
      name: "Analysis",
      icon: <AnalysisIcon />,
      onclick: () => null,
    },
    {
      name: "Delete",
      icon: <DeleteMenuIcon />,
      onclick: () => onClickDeleteQouteItem(quoteItem),
    },
  ].filter(Boolean);;

  return {
    open,
    anchorEl,
    menuList,
    handleClose,
    handleClick,
  };
};

export { useMoreCircle };
