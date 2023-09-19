import { PrimaryTable } from "@/components/tables/primary-table";
import { useMaterials } from "./use-materials";
import { useStyle } from "./style";
import { HeaderTitleWithSearch } from "../header-title-with-search";

const CategoriesTable = ({ admin = false }) => {
  const { clasess } = useStyle();
  const { tableHeaders, tableRows } = useMaterials({ admin });
  return (
    <div style={clasess.mainConainer}>
      <HeaderTitleWithSearch
        title="Materials"
        onChange={(e) => console.log(e)}
      />
      <PrimaryTable rows={tableRows} headers={tableHeaders} />
    </div>
  );
};
export { CategoriesTable };
