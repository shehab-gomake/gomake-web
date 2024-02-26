import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";
import { useWriteCommentComp } from "./use-character-details";
import { useButtonsConfirmContainer } from "../buttons-cofirm-container/use-buttons-container";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";

interface IProps {
    isQuoteConfirmation?: boolean;
    getQuote?:any;
    documentType?: DOCUMENT_TYPE;
}
const WriteCommentComp = ({ isQuoteConfirmation,getQuote,documentType }: IProps) => {
    const { classes } = useStyle(isQuoteConfirmation);
    const { onUpdateComments, quoteComments, setQuoteComments } = useButtonsConfirmContainer();
    const { handleChange, handleBlur, t, data } = useWriteCommentComp({ getQuote , documentType })

    return (
    <div style={classes.writeCommentContainer}>
      <GomakeTextInput
        style={classes.textInputStyle}
        placeholder={t("sales.quote.writeCommentHere")}
        value={isQuoteConfirmation ? quoteComments : data}
        onChange={isQuoteConfirmation ? (e) => setQuoteComments(e.target.value) : handleChange}
        onBlur={isQuoteConfirmation ? onUpdateComments : handleBlur}
      />
    </div>
  );
};

export { WriteCommentComp };
