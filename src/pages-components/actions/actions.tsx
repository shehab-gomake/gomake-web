import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useActions } from "./use-actions";
import { PrimaryTable } from "@/components/tables/primary-table";

const ActionPageWidget = () => {
  const { clasess } = useStyle();
  const { tableHeaders, allActions, t } = useActions();
  return (
    <div style={clasess.mainContainer}>
      <HeaderTitle
        title={t("products.actions.admin.title")}
        marginTop={1}
        marginBottom={20}
      />
      <PrimaryTable rows={allActions} headers={tableHeaders} />
    </div>
  );
};

export { ActionPageWidget };
