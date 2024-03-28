import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { PrimaryTable } from "@/components/tables/primary-table";

const FinancesTableWidget = () => {
  const { clasess } = useStyle();
  const { t } = useTranslation();


  return (
    <PrimaryTable
      rows={[]}
      headers={["Account Code", "Account Name", "Accounting Code"]}
      maxHeight={610}
    />
  );
};
export { FinancesTableWidget };
