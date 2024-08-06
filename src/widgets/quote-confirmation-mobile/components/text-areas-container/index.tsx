import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import Textarea from '@mui/joy/Textarea';
import { useButtonsConfirmContainer } from "@/widgets/quote-new/buttons-cofirm-container/use-buttons-container";
import { QUOTE_STATUSES } from "@/pages-components/quotes/enums";


const TextAreasContainer = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const { quoteConfirm , onUpdateComments , quoteComments, setQuoteComments} = useButtonsConfirmContainer(); 
  const canNotEditConfirmationComments = quoteConfirm?.isConfirmed || quoteConfirm?.documentStatus === QUOTE_STATUSES.Canceled;

  return (
    <div style={classes.mainContainer}>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" , width:"70%"}}>
        <h3 style={classes.headerStyle}>{t("sales.quote.notes")}</h3>
        <Textarea
          color="neutral"
          disabled={canNotEditConfirmationComments}
          minRows={4}
          placeholder={t("sales.quote.writeNotes")}
          variant="outlined"
          sx={{ width: "100%", background: "#FFFFFF", borderRadius: "8px", boxShadow: "none" }}
          value={quoteComments}
          onChange={(e) => setQuoteComments(e.target.value)}
          onBlur={onUpdateComments}
        />
      </div>
    </div>
  );
};

export { TextAreasContainer };
