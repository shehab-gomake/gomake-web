import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { QuoteWidget } from "./widgets/quote-widget/quote-widget";

export default function HomePageComponentForAdmin() {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div>
      <QuoteWidget />
    </div>
  );
}
