import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { useEffect } from "react";
import { PrimaryTable } from "@/components/tables/primary-table";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import { useTranslation } from "react-i18next";
import { useMaterialsTypes } from "@/widgets/materials-widget/components/materials-table/use-materials-types";
interface IMaterialsTableComponentProps{
    isAdmin:boolean;
}
const MaterialsTableComponent = (props:IMaterialsTableComponentProps) => {
  const { getAllMaterials, getTableRows, onFilterChange } = useMaterialsTypes(props.isAdmin);
  const { t } = useTranslation();
  const { classes } = useStyle();
  const tableHeaders = [t("materials.materialsType"), t("materials.edit")];

  useEffect(() => {
    getAllMaterials().then();
  }, []);

  return (
    <div style={classes.mainContainer}>
      <HeaderTitleWithSearch title={props.isAdmin ? t("tabs.materialsAdmin") : t("tabs.materials")} onChange={onFilterChange} />
        <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={false}
        rows={getTableRows()}
        headers={tableHeaders}
        dataTour={'materialsTable'}
      />
    </div>
  );
};
export { MaterialsTableComponent };
