import { useStyle } from "./style";
import { useActions } from "./use-actions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";

const ActionPageWidget = () => {
  const { clasess } = useStyle();
  const { tableHeaders, allActions, materilasSearched, term, setTerm, t } =
    useActions();
  return (
    <div style={clasess.mainContainer}>
      <HeaderTitleWithSearch
        title={t("products.actions.admin.title")}
        onChange={(e) => setTerm(e)}
      />
      {term ? (
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={materilasSearched}
          headers={tableHeaders}
        />
      ) : (
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={allActions}
          headers={tableHeaders}
          
        />
      )}
    </div>
  );
};

export { ActionPageWidget };
