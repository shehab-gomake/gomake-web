import { AdminAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useActions } from "./use-actions";

import { useStyle } from "./style";

export default function Profits() {
  const { clasess } = useStyle();
  const { t } = useActions();

  return (
    <AdminAuthLayout>
      <div style={clasess.mainContainer}>
        <HeaderTitle title={t("products.actions.admin.title")} />
      </div>
    </AdminAuthLayout>
  );
}
