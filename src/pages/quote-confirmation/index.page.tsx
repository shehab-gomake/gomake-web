import { DOCUMENT_TYPE } from "@/pages-components/quotes/enums";
import { QuoteNewPageWidget } from "@/pages-components/quote-new/quote";
import { GoMakeIcon } from "@/components/icons/go-make-icon";

export default function QuoteConfirmation() {
  return (
    <div style={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column" as "column", background: "#FFFFFF" }}>
      <div style={{ width: "100%", height: "7%", display: "flex", background: "#F4F1F6" , padding:"10px"}}>
        <GoMakeIcon/>
      </div>
      <QuoteNewPageWidget documentType={DOCUMENT_TYPE.quote} isQuoteConfirmation={true} />
    </div>
  );
}
