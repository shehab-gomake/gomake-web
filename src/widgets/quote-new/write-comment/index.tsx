import { useStyle } from "./style";
import { GoMakeAutoComplate, GomakeTextInput } from "@/components";
import { useWriteCommentComp } from "./use-character-details";
import { useButtonsConfirmContainer } from "../buttons-cofirm-container/use-buttons-container";
import { DOCUMENT_TYPE, QUOTE_STATUSES } from "@/pages-components/quotes/enums";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";
import { useSetRecoilState } from "recoil";
import { quoteConfirmationState, quoteItemState } from "@/store";
import { renderDocumentTypeForSourceDocumentNumber } from "@/widgets/settings-documenting/documentDesign/enums/document-type";

interface IProps {
  isQuoteConfirmation?: boolean;
  getQuote?: any;
  documentType?: DOCUMENT_TYPE;
  documentState?: any;
  onClickOpenRelatedDocumentsModal?: () => void;
}

const WriteCommentComp = ({ isQuoteConfirmation, getQuote, documentType, onClickOpenRelatedDocumentsModal, documentState }: IProps) => {
  const { classes } = useStyle(isQuoteConfirmation);
  const { CheckDocumentPermission } = useUserPermission();
  const setQuoteState = useSetRecoilState<any>(quoteItemState);
  const setQuoteConfirm = useSetRecoilState<any>(quoteConfirmationState);
  const setQuoteItemValue = isQuoteConfirmation ? setQuoteConfirm : setQuoteState;

  const {
    onUpdateComments,
    quoteComments,
    setQuoteComments
  } = useButtonsConfirmContainer();

  const {
    handleChange,
    handleBlur,
    t,
    data,
    dataForInternalNotes,
    handleBlurForInternalNotes,
    handleChangeForInternalNotes
  } = useWriteCommentComp({ getQuote, documentType, quoteItemValue : documentState, setQuoteItemValue })

  const mergeDocumentNumbers = (quoteItemValue) => {
    const groupedDocuments = {};

    quoteItemValue?.documentNumbers?.forEach(doc => {
      const { documentType, documentId, documentNumber } = doc;
      const title = t(renderDocumentTypeForSourceDocumentNumber(documentType));

      if (!groupedDocuments[title]) {
        groupedDocuments[title] = [];
      }

      groupedDocuments[title].push({
        documentId,
        documentNumber,
        label: `${documentNumber}`,
        title,
        value: documentId,
        documentType
      });
    });

    return groupedDocuments;
  };

  const relatedDocuments = mergeDocumentNumbers(documentState);
  const canEditComments = documentState?.isEditable && CheckDocumentPermission(documentType.toString(), DocumentPermission.EDIT_DOCUMENT);
  const canNotEditConfirmationComments = documentState?.isConfirmed || documentState?.documentStatus === QUOTE_STATUSES.Canceled;

  return (
    <div style={classes.writeCommentContainer}>
      {
        !isQuoteConfirmation &&
        <div style={classes.itemContainer}>
          <div style={classes.labelTextStyle}>{t("sales.quote.relatedDocuments")}</div>
          <GoMakeAutoComplate
            options={Object.keys(relatedDocuments).flatMap(key => [
              { title: key, isHeader: true },
              ...relatedDocuments[key]
            ])}
            style={classes.autoComplateStyle}
            placeholder={t("sales.quote.selectDocuments")}
            onChange={(e, item) => {
              if (!item.isHeader && item?.value) {
                if (item?.documentType === 12) {
                  const url = `/quotes?documentNumber=${item.documentNumber}`;
                  window.open(url, '_blank');
                }
                else {
                  const url = `/${item.title.charAt(0).toLowerCase() + item.title.slice(1)}?Id=${item.documentId}`;
                  window.open(url, '_blank');
                }

              }
            }}
            withArrow={true}
            renderOption={(props, option) => {
              if (option.isHeader) {
                return (
                  <li {...props} key={option.title} style={{ fontWeight: 'bold', color: 'blue' }} onClick={() => null}>
                    {option.title}
                  </li>
                );
              }

              return (
                <li {...props} key={option.documentId}>
                  {option.label}
                </li>
              );
            }}
          />
        </div>
      }
      <div style={classes.item2Container}>
        <div style={classes.labelTextStyle}>{t("sales.quote.notes")}</div>
        <GomakeTextInput
          style={classes.textInputStyle}
          placeholder={t("sales.quote.writeNotes")}
          value={isQuoteConfirmation ? quoteComments : data}
          onChange={isQuoteConfirmation ? (e) => setQuoteComments(e.target.value) : handleChange}
          onBlur={isQuoteConfirmation ? onUpdateComments : handleBlur}
          disabled={isQuoteConfirmation ? canNotEditConfirmationComments : !canEditComments}
        />
      </div>
      {!isQuoteConfirmation && (documentType === DOCUMENT_TYPE.quote || documentType === DOCUMENT_TYPE.order) && <div style={classes.item2Container}>
        <div style={classes.labelTextStyle}>{t("sales.quote.internalNotes")}</div>
        <GomakeTextInput
          style={classes.textInputStyle}
          placeholder={t("sales.quote.writeInternalNotes")}
          value={dataForInternalNotes}
          onChange={handleChangeForInternalNotes}
          onBlur={handleBlurForInternalNotes}
          disabled={!canEditComments}
        />
      </div>}
    </div>
  );
};

export { WriteCommentComp };