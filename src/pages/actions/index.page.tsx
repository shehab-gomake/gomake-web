import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useActions } from "./use-actions";

import { useStyle } from "./style";
import { Row } from "./widget/row";
import { PrimaryTable } from "@/components/tables/primary-table";

export default function Profits() {
  const { clasess } = useStyle();
  const { tableHeaders, allActions, t } = useActions();

  return (
    <CustomerAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle
          title={t("products.actions.admin.title")}
          marginTop={1}
          marginBottom={20}
        />
        <PrimaryTable rows={allActions} headers={tableHeaders} />
      </div>
    </CustomerAuthLayout>
  );
}
