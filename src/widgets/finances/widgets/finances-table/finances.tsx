import { useTranslation } from "react-i18next";
import { PrimaryTable } from "@/components/tables/primary-table";

const FinancesTableWidget = ({ getAccountRows }) => {
  const { t } = useTranslation();

  return (
    <PrimaryTable
      rows={getAccountRows()}
      headers={[t("financesWidget.accountCode"), t("reports.accountName"), t("financesWidget.cpaAccountCode")]}
      maxHeight={600}
      stickyHeader={true}
    />
  );
};
export { FinancesTableWidget };
