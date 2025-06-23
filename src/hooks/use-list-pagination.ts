import { useState } from "react";
import { usePrintHousePreferences } from "./use-print-house-preferences";
import { DEFAULT_VALUES } from "@/pages/customers/enums";
import { EPreferences } from "@/enums/prefernces";

const useListPagination = () => {
  const { CheckPreferenceValue } = usePrintHousePreferences();

  const rawPageSize = CheckPreferenceValue(
    EPreferences.DEFAULT_NUMBER_OF_ROWS_IN_TABLES
  );

  const parsedPageSize =
    typeof rawPageSize === "string" && !isNaN(Number(rawPageSize))
      ? parseInt(rawPageSize, 10)
      : undefined;

  const initialPageSize =
    parsedPageSize && parsedPageSize > 0
      ? parsedPageSize
      : DEFAULT_VALUES.PageSize;

  const [pageSize, setPageSize] = useState<number>(initialPageSize);
  const [pagesCount, setPagesCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);

  return {
    pageSize,
    setPageSize,
    pagesCount,
    setPagesCount,
    pageNumber,
    setPageNumber,
    parsedPageSize,
    initialPageSize,
  };
};

export { useListPagination };
