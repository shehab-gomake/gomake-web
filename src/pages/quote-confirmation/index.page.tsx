import { CustomerAuthLayout } from "@/layouts";
import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";

export default function QuoteConfirmation() {
  return (
    <div style={{ width: "100%",
    height: "100vh",
    display: "flex",
    flexDirection: "row" as "row",
    padding:"0px 80px 0px 80px",
    }}>
      <QuoteNewPageWidget documentType={DOCUMENT_TYPE.quote} isQuoteConfirmation={true} />
    </div>
  );
}
