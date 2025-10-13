import { useTranslationsTable } from "@/widgets/translation-widget/components/translation-table/hooks/use-translations-table";
import { useEffect } from "react";
import { PrimaryTable } from "@/components/tables/primary-table";
import Pagination from "@mui/material/Pagination";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";

const TranslationTable = () => {
  const {
    getTranslationsTable,
    totalPages,
    translationsTableHeaders,
    translationsTableRows,
    currentPage,
    setCurrentPage,
    setSearchTerm,
    searchTerm,
    debouncedSearchTerm,
    setDebouncedSearchTerm,
  } = useTranslationsTable();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    getTranslationsTable();
  }, [debouncedSearchTerm, currentPage]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <SearchInputComponent
        searchInputStyle={{
          height: 40,
          width: "30%",
          minWidth: 300,
        }}
        onChange={(e) => setSearchTerm(e)}
      />
      <PrimaryTable
        stickyFirstCol={false}
        stickyHeader={false}
        rows={translationsTableRows}
        headers={translationsTableHeaders}
      />
      <div style={{ marginBottom: "8px" }}>
        <Pagination
          count={totalPages}
          variant="outlined"
          color="primary"
          page={currentPage}
          onChange={(event, value) => setCurrentPage(value)}
        />
      </div>
    </div>
  );
};
export { TranslationTable };
