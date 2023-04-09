import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useSupplier } from "@/hooks";

import { useLamination } from "./use-lamination";
import { useStyle } from "./style";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { suppliers, getSupplier, getSupplierCurrencies } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  const {
    laminationSizes,
    laminationCategores,
    categoryName,
    headerTable,
    onChangeCategory,
  } = useLamination();

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.lamination.title")} />

      {laminationCategores?.length > 0 && (
        <div style={clasess.filterContainer}>
          <GoMakeAutoComplate
            options={laminationCategores}
            style={clasess.autoComplateStyle}
            placeholder={t("materials.sheetPaper.category")}
            onChange={onChangeCategory}
            value={categoryName}
          />
        </div>
      )}
      <Table tableHeaders={headerTable} tableRows={laminationSizes} />
    </CustomerAuthLayout>
  );
}
