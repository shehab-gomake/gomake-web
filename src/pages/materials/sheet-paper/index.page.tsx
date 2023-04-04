import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useStyle } from "./style";
import { useSupplier } from "@/hooks";
import { useSheetPaper } from "./use-sheet-paper";
import { Table } from "@/widgets/table/table";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { suppliers } = useSupplier();
  const {
    sheetCategories,
    categoryName,
    allWeights,
    onChangeCategory,
    onChangeSupplier,
  } = useSheetPaper();
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.sheetPaper.title")} />
      <div style={clasess.filterContainer}>
        {sheetCategories?.length > 0 && (
          <GoMakeAutoComplate
            options={sheetCategories}
            style={clasess.autoComplateStyle}
            placeholder={t("materials.sheetPaper.category")}
            onChange={onChangeCategory}
            value={categoryName}
          />
        )}
        {suppliers?.length > 0 && (
          <GoMakeAutoComplate
            options={suppliers}
            style={clasess.autoComplateStyle}
            placeholder={t("materials.sheetPaper.supplier")}
            onChange={onChangeSupplier}
          />
        )}
        {/* <GoMakeAutoComplate
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.sheetPaper.search")}
        /> */}
      </div>
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.sheetPaper.weight"),
            t("materials.sheetPaper.thickness"),
            t("materials.sheetPaper.pricePerTon"),
            t("materials.sheetPaper.settings"),
          ]}
          tableRows={allWeights}
        />
      </div>
    </CustomerAuthLayout>
  );
}
