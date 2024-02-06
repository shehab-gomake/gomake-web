import { useStyle } from "./style";
import { GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";
import { useWriteComment } from "./use-write-comment";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store/quote-item";

interface IProps {
  documentType:any;
  isQuoteConfirmation?: boolean;
}
const WriteCommentComp = ({isQuoteConfirmation , documentType} : IProps) => {
  const { t } = useTranslation();
  const { classes } = useStyle(isQuoteConfirmation);
  const quoteItemValue: any = useRecoilValue(quoteItemState);


  return (
    <div style={classes.writeCommentContainer}>
      <GomakeTextInput
        style={classes.textInputStyle}
        placeholder={t("sales.quote.writeCommentHere")}
        value={ quoteItemValue?.notes}
      />
    </div>
  );
};

export { WriteCommentComp };
