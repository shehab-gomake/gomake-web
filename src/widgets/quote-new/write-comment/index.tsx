import { useStyle } from "./style";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useWriteCommentComp } from "./use-character-details";
import { useButtonsConfirmContainer } from "../buttons-cofirm-container/use-buttons-container";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";

import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { useGomakeRouter } from "@/hooks";

interface IProps {
  isQuoteConfirmation?: boolean;
  getQuote?: any;
  documentType?: DOCUMENT_TYPE;
  documentState?:any;
  onClickOpenRelatedDocumentsModal?: () => void;
}
const WriteCommentComp = ({ isQuoteConfirmation, getQuote, documentType, onClickOpenRelatedDocumentsModal , documentState}: IProps) => {
  const { classes } = useStyle(isQuoteConfirmation);
  const { CheckDocumentPermission } = useUserPermission();

  const { onUpdateComments,
    quoteComments,
    setQuoteComments,
    onUpdateInternalNotes,
    quoteInternalNotes,
    setQuoteInternalNotes
  } = useButtonsConfirmContainer();

  const {
    handleChange,
    handleBlur,
    t,
    data,
    dataForInternalNotes,
    handleBlurForInternalNotes,
    handleChangeForInternalNotes
  } = useWriteCommentComp({ getQuote, documentType })
  const quoteItemValue = useRecoilValue<any>(quoteItemState);
  const { navigate } = useGomakeRouter();

  const mergeDocumentNumbers = (quoteItemValue) => {
    let mergedArray = [];

    // Add documentNumbers with titleDocumentNumber
    quoteItemValue?.documentNumbers?.forEach(doc => {
      mergedArray.push({
        documentId: doc.documentId,
        documentNumber: doc.documentNumber,
        title: quoteItemValue.titleDocumentNumber,
        label: `${quoteItemValue.titleDocumentNumber}  ${doc.documentNumber}`,
        value: doc.documentId
      });
    });

    // Add secondDocumentNumbers with titleSecondDocumentNumber
    quoteItemValue?.secondDocumentNumbers?.forEach(doc => {
      mergedArray.push({
        documentId: doc.documentId,
        documentNumber: doc.documentNumber,
        title: quoteItemValue.titleSecondDocumentNumber,
        label: `${quoteItemValue.titleSecondDocumentNumber}  ${doc.documentNumber}`,
        value: doc.documentId
      });
    });

    return mergedArray;
  };

  const relatedDocuments = mergeDocumentNumbers(quoteItemValue)
  const canEditComments = documentState?.isEditable && CheckDocumentPermission(documentType.toString(), DocumentPermission.EDIT_DOCUMENT);

  return (
    <div style={classes.writeCommentContainer}>
      {
        !isQuoteConfirmation &&
        <div style={classes.itemContainer}>
          <div style={classes.labelTextStyle}>{t("sales.quote.relatedDocuments")}</div>
          <GoMakeAutoComplate
            options={[{ value: 'new', label: t("sales.quote.addRelatedDocument") }, ...relatedDocuments]}
            style={classes.autoComplateStyle}
            placeholder={t("sales.quote.selectDocuments")}
            onChange={(e: any, item: any) => {
              if (item?.value === "new") {
                onClickOpenRelatedDocumentsModal()
              }
              else {
                navigate(`/${item.title.charAt(0).toLowerCase() + item.title.slice(1)}?Id=${item.documentId}`)
              }
            }}
            withArrow={true}
          // value={dayOfWeek}
          />
        </div>
      }
      <div style={classes.item2Container}>
        <div style={classes.labelTextStyle}>{t("sales.quote.comments")}</div>
        <GomakeTextInput
          style={classes.textInputStyle}
          placeholder={t("sales.quote.writeCommentHere")}
          value={isQuoteConfirmation ? quoteComments : data}
          onChange={isQuoteConfirmation ? (e) => setQuoteComments(e.target.value) : handleChange}
          onBlur={isQuoteConfirmation ? onUpdateComments : handleBlur}
          disabled={!canEditComments}
        />
      </div>
      <div style={classes.item2Container}>
        <div style={classes.labelTextStyle}>{t("sales.quote.notes")}</div>
        <GomakeTextInput
          style={classes.textInputStyle}
          placeholder={t("sales.quote.writeInternalNotes")}
          value={isQuoteConfirmation ? quoteInternalNotes : dataForInternalNotes}
          onChange={isQuoteConfirmation ? (e) => setQuoteInternalNotes(e.target.value) : handleChangeForInternalNotes}
          onBlur={isQuoteConfirmation ? onUpdateInternalNotes : handleBlurForInternalNotes}
          disabled={!canEditComments}
        />
      </div>
    </div>
  );
};

export { WriteCommentComp };