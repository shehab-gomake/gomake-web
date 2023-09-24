import { PrimaryTable } from "@/components/tables/primary-table";
import { useMaterials } from "./use-materials";
import { useStyle } from "./style";
import { HeaderTitleWithSearch } from "../header-title-with-search";

const CategoriesTable = ({ admin = false }) => {
  const { clasess } = useStyle();
  const { tableHeaders, tableRows, materilasSearched, term, setTerm } =
    useMaterials({
      admin,
    });
  return (
    <div style={clasess.mainConainer}>
      <HeaderTitleWithSearch title="Materials" onChange={(e) => setTerm(e)} />
      {term ? (
        <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={materilasSearched} headers={tableHeaders} />
      ) : (
        <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={tableRows} headers={tableHeaders} />
      )}
    </div>
  );
};
export { CategoriesTable };
