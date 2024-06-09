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
import { Permissions } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";

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
  const { CheckPermission } = useUserPermission();

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

  const onClickAnalysisQuoteItem = (quoteItem, documentType) => {
    navigate(
      `/products/edit?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID}&productId=${quoteItem?.productID}&documentItemId=${quoteItem?.id}&documentType=${documentType}${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""}&isAnalysis=true`
    );
  };

  const menuList = [
    {
      name: "edit",
      icon: <EditMenuIcon />,
      onclick: () => onClickEditQuoteItem(quoteItem, documentType),
      condition: quoteItem.productType === 0 && (documentType === DOCUMENT_TYPE.quote || documentType === DOCUMENT_TYPE.order)
    },
    {
      name: "duplicate",
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickDuplicateQuoteItem(quoteItem, documentType),
      condition: quoteItem.productType === 0 && !router.query.isNewCreation && documentType !== DOCUMENT_TYPE.purchaseInvoice && documentType !== DOCUMENT_TYPE.purchaseOrder && documentType !== DOCUMENT_TYPE.purchaseInvoiceRefund
    },
    {
      name: "duplicateItemWithDifferentQTY",
      icon: <DuplicateWithDifferentMenuIcon />,
      onclick: () => onClickDuplicateWithDifferentQTY(quoteItem),
      condition:false,
      //condition:quoteItem.productType === 0 && documentType === DOCUMENT_TYPE.quote && !router.query.isNewCreation
    },
    {
      name: "negotiateRequest",
      icon: <NegotiateRequestIcon />,
      //onclick: () => onOpenNegotiateRequest(),
      condition: false,
      //condition:!router.query.isNewCreation
    },
    {
      name: "analysis",
      icon: <AnalysisIcon />,
      onclick: () => onClickAnalysisQuoteItem(quoteItem, documentType),
      condition: !router.query.isNewCreation && quoteItem.productType === 0
    },
    {
      name: "delete",
      icon: <DeleteMenuIcon />,
      onclick: () => onClickDeleteQouteItem(quoteItem),
    //  condition: router.query.isNewCreation || quoteItem?.isDeletable 
      condition: (
        router.query.isNewCreation ||
        (quoteItem?.isDeletable &&
          (
            (documentType === DOCUMENT_TYPE.quote && CheckPermission(Permissions.DELETE_QUOTE_ITEM)) ||
            (documentType === DOCUMENT_TYPE.order && CheckPermission(Permissions.DELETE_ORDER_ITEM)) ||
            (documentType === DOCUMENT_TYPE.purchaseOrder && CheckPermission(Permissions.DELETE_PURCHASE_ORDER_ITEM)) ||
            (documentType !== DOCUMENT_TYPE.quote && documentType !== DOCUMENT_TYPE.order && documentType !== DOCUMENT_TYPE.purchaseOrder)        
          )
        )
      )
    }
  ].filter(item => item.condition);

  return {
    open,
    anchorEl,
    menuList,
    handleClose,
    handleClick,
  };
};

export { useMoreCircle };