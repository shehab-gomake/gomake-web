import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";
import { useWriteCommentComp } from "./use-character-details";
import { useButtonsConfirmContainer } from "../buttons-cofirm-container/use-buttons-container";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface IProps {
  isQuoteConfirmation?: boolean;
  getQuote?: any;
  documentType?: DOCUMENT_TYPE;
}
const WriteCommentComp = ({ isQuoteConfirmation, getQuote, documentType }: IProps) => {
  const { classes } = useStyle(isQuoteConfirmation);
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

  return (
    <div style={classes.writeCommentContainer}>
      <div style={{ width: "49%" }}>
        <GomakeTextInput
          style={classes.textInputStyle}
          placeholder={t("sales.quote.writeCommentHere")}
          value={isQuoteConfirmation ? quoteComments : data}
          onChange={isQuoteConfirmation ? (e) => setQuoteComments(e.target.value) : handleChange}
          onBlur={isQuoteConfirmation ? onUpdateComments : handleBlur}
        />
      </div>
      <div style={{ width: "49%" }}>
        <GomakeTextInput
          style={classes.textInputStyle}
          placeholder={t("sales.quote.writeInternalNotes")}
          value={isQuoteConfirmation ? quoteInternalNotes : dataForInternalNotes}
          onChange={isQuoteConfirmation ? (e) => setQuoteInternalNotes(e.target.value) : handleChangeForInternalNotes}
          onBlur={isQuoteConfirmation ? onUpdateInternalNotes : handleBlurForInternalNotes}
        />
      </div>
    </div>
  );
};

export { WriteCommentComp };
