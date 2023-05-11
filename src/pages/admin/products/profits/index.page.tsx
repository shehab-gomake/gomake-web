import { useTranslation } from "react-i18next";

import { AdminAuthLayout } from "@/layouts";
import PriceListWidget from "./widgets/pricing-list-widget";

("./widgets/price-list-widget");
export default function Profits() {
  const { t } = useTranslation();

  return (
    <AdminAuthLayout>
      <PriceListWidget />
    </AdminAuthLayout>
  );
}
