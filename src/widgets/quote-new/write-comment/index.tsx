import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";
import { useWriteCommentComp } from "./use-character-details";
import { useButtonsConfirmContainer } from "../buttons-cofirm-container/use-buttons-container";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { useUserPermission } from "@/hooks/use-permission";
import { DocumentPermission } from "@/components/CheckPermission/enum";


interface IProps {
  isQuoteConfirmation?: boolean;
  getQuote?: any;
  documentType?: DOCUMENT_TYPE;
  documentState?:any;
}
const WriteCommentComp = ({ isQuoteConfirmation, getQuote, documentType , documentState }: IProps) => {
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

  const canEditComments = documentState?.isEditable && CheckDocumentPermission(documentType.toString(), DocumentPermission.EDIT_DOCUMENT);

  return (
    <div style={classes.writeCommentContainer}>
      <div style={{ width: "49%" }}>
        <GomakeTextInput
          style={classes.textInputStyle}
          placeholder={t("sales.quote.writeCommentHere")}
          value={isQuoteConfirmation ? quoteComments : data}
          onChange={isQuoteConfirmation ? (e) => setQuoteComments(e.target.value) : handleChange}
          onBlur={isQuoteConfirmation ? onUpdateComments : handleBlur}
          disabled={!canEditComments}
        />
      </div>
      <div style={{ width: "49%" }}>
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
