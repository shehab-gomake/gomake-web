import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store/quote-item";
import { useButtonsConfirmContainer } from "../buttons-cofirm-container/use-buttons-container";

interface IProps {
  isQuoteConfirmation?: boolean;
}
const WriteCommentComp = ({ isQuoteConfirmation }: IProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle(isQuoteConfirmation);
  const quoteItemValue: any = useRecoilValue(quoteItemState);
  const { onUpdateComments, quoteComments, setQuoteComments } = useButtonsConfirmContainer();

  return (
    <div style={classes.writeCommentContainer}>
      <GomakeTextInput
        style={classes.textInputStyle}
        placeholder={t("sales.quote.writeCommentHere")}
        value={isQuoteConfirmation ? quoteComments : quoteItemValue?.notes}
        onChange={isQuoteConfirmation ? (e) => setQuoteComments(e.target.value) : () => null}
        onBlur={isQuoteConfirmation && onUpdateComments}
      />
    </div>
  );
};

export { WriteCommentComp };
