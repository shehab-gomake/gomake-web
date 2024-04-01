import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";

const FinancesTableWidget = ({ getAccountRows }) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();


  return (
    <PrimaryTable
      rows={getAccountRows()}
      headers={[t("financesWidget.accountCode"), t("financesWidget.accountName"), t("financesWidget.cpaAccountCode")]}
      maxHeight={400}
    />
  );
};
export { FinancesTableWidget };
