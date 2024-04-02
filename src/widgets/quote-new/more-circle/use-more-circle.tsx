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
import { useRouter } from "next/router";
import { DuplicateType } from "@/enums";

const useMoreCircle = ({
  quoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickDeleteQouteItem,
  documentType
}) => {
  const router = useRouter();
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

  const onClickEditQuoteItem = (quoteItem, documentType) => {
    navigate(
      `/products/edit?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${quoteItem?.productID}&documentItemId=${quoteItem?.id}&documentType=${documentType}${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""}`
    );
  };

  const onClickDuplicateQuoteItem = (quoteItem, documentType) => {
    navigate(
      `/products/duplicate?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${quoteItem?.productID}&documentItemId=${quoteItem?.id}&documentType=${documentType}${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""}&duplicateType=${DuplicateType.SameOrder}`
    );
  };

  const menuList = [
    quoteItem.productType === 0 && !router.query.isNewCreation && !router.query.Id && {
      name: "edit",
      icon: <EditMenuIcon />,
      onclick: () => onClickEditQuoteItem(quoteItem, documentType),
    },
    quoteItem.productType === 0 && !router.query.isNewCreation && documentType === DOCUMENT_TYPE.purchaseInvoice && {
      name: "duplicate",
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickDuplicateQuoteItem(quoteItem, documentType),
    },
    quoteItem.productType === 0 && documentType === DOCUMENT_TYPE.quote && !router.query.isNewCreation && {
      name: "duplicateItemWithDifferentQTY",
      icon: <DuplicateWithDifferentMenuIcon />,
      onclick: () => onClickDuplicateWithDifferentQTY(quoteItem),
    },
    // !router.query.isNewCreation && {
    //   name: "negotiateRequest",
    //   icon: <NegotiateRequestIcon />,
    //   // onclick: () => onOpenNegotiateRequest(),
    // },
    !router.query.isNewCreation && quoteItem.productType === 0 && {
      name: "analysis",
      icon: <AnalysisIcon />,
      onclick: () => null,
    },
    (router.query.isNewCreation || quoteItem?.isDeletable) &&
    {
      name: "delete",
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