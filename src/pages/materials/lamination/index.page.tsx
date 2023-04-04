import { GoMakeAutoComplate } from "@/components";
import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useTranslation } from "react-i18next";
import { Table } from "@/widgets/table/table";
import { useStyle } from "./style";
import { useLamination } from "./use-lamination";
import { useCallback } from "react";
import { MoreCircle } from "@/pages/materials/lamination/moreCircle";
export default function SheetPaper() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    laminationSizes,
    laminationCategores,
    categoryName,
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
      <Table
        tableHeaders={[
          t("materials.lamination.category"),
          t("materials.lamination.height"),
          t("materials.lamination.width"),
          t("materials.lamination.settings"),
        ]}
        tableRows={laminationSizes}
      />
    </CustomerAuthLayout>
  );
}
