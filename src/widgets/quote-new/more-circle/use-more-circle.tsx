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
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";

const useMoreCircle = ({
  quoteItem,
  onClickDuplicateWithDifferentQTY,
  onClickQuickDuplicate,
  onClickDeleteQouteItem,
  documentType,
  onClickUndoItemIntake,
}) => {
  const router = useRouter();
  const { navigate } = useGomakeRouter();
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { CheckDocumentPermission } = useUserPermission();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Construct the href for editing a quote item
  const getEditDocumentItemHref = (quoteItem, documentType) =>
    `/products/edit?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID
    }&customerName=${quoteItemValue?.client?.name}&productId=${quoteItem?.productID
    }&documentItemId=${quoteItem?.id
    }&documentType=${documentType}&documentNumber=${quoteItemValue?.number}${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""
    }`;

  // Construct the href for duplicating a quote item
  const getDuplicateDocumentItemHref = (quoteItem, documentType) =>
    `/products/duplicate?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID
    }&customerName=${quoteItemValue?.client?.name}&productId=${quoteItem?.productID
    }&documentItemId=${quoteItem?.id
    }&documentType=${documentType}&documentNumber=${quoteItemValue?.number}${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""
    }&duplicateType=${DuplicateType.SameOrder}`;

  // Construct the href for analysis
  const getAnalysisDocumentItemHref = (quoteItem, documentType) =>
    `/products/edit?clientTypeId=${quoteItem?.clientTypeId}&customerId=${quoteItemValue?.customerID
    }&customerName=${quoteItemValue?.client?.name}&productId=${quoteItem?.productID
    }&documentItemId=${quoteItem?.id
    }&documentType=${documentType}&documentNumber=${quoteItemValue?.number}${router?.query?.Id ? `&documentId=${router?.query?.Id}` : ""
    }&isAnalysis=true`;
  const menuList = [
    {
      name: "edit",
      icon: <EditMenuIcon />,
      onclick: () => navigate(getEditDocumentItemHref(quoteItem, documentType)),
      href: getEditDocumentItemHref(quoteItem, documentType),
      condition:
        quoteItem?.isShowEdit &&
        !router.query.isNewCreation &&
        CheckDocumentPermission(
          documentType,
          DocumentPermission.UPDATE_DOCUMENT_ITEM
        ),
    },
    {
      name: "addQuantity",
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickQuickDuplicate(quoteItem, true),
      condition: quoteItem?.isShowAdvancedDuplicate
    },
    {
      name: "advancedDuplicate",
      icon: <DuplicateMenuIcon />,
      onclick: () => onClickQuickDuplicate(quoteItem, false),
      condition: quoteItem?.isShowAdvancedDuplicate
    },
    {
      name: "duplicate",
      icon: <DuplicateMenuIcon />,
      onclick: () =>
        navigate(getDuplicateDocumentItemHref(quoteItem, documentType)),
      href: getDuplicateDocumentItemHref(quoteItem, documentType),
      condition:
        quoteItem.productType === 0 &&
        !router.query.isNewCreation &&
        documentType !== DOCUMENT_TYPE.purchaseInvoice &&
        documentType !== DOCUMENT_TYPE.purchaseOrder &&
        documentType !== DOCUMENT_TYPE.purchaseInvoiceRefund,
    },
    {
      name: "duplicateItemWithDifferentQTY",
      icon: <DuplicateWithDifferentMenuIcon />,
      onclick: () => onClickDuplicateWithDifferentQTY(quoteItem),
      condition: false,
    },
    {
      name: "negotiateRequest",
      icon: <NegotiateRequestIcon />,
      //onclick: () => onOpenNegotiateRequest(),
      condition: false,
    },
    {
      name: "analysis",
      icon: <AnalysisIcon />,
      onclick: () =>
        navigate(getAnalysisDocumentItemHref(quoteItem, documentType)),
      href: getAnalysisDocumentItemHref(quoteItem, documentType),
      condition:
        quoteItem?.isShowAnalytics &&
        CheckDocumentPermission(
          documentType,
          DocumentPermission.UPDATE_DOCUMENT_ITEM
        ),
    },
    {
      name: "delete",
      icon: <DeleteMenuIcon />,
      onclick: () => onClickDeleteQouteItem(quoteItem),
      condition:
        router.query.isNewCreation ||
        (quoteItem?.isDeletable &&
          CheckDocumentPermission(
            documentType,
            DocumentPermission.DELETE_DOCUMENT_ITEM
          )) ||
        (documentType === DOCUMENT_TYPE.purchaseOrder && quoteItem?.isDeletable),
    },
    {
      name: "undoItemIntake",
      icon: <DeleteMenuIcon />,
      onclick: () => onClickUndoItemIntake?.(quoteItem),
      condition: quoteItem?.isIntake === true && documentType === DOCUMENT_TYPE.purchaseOrder,
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
