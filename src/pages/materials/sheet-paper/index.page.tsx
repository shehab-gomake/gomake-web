import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";
import { useStyle } from "./style";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.sheetPaper.title")} />
      <div style={clasess.filterContainer}>
        <GoMakeAutoComplate
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.sheetPaper.category")}
        />
        <GoMakeAutoComplate
          options={[]}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.sheetPaper.supplier")}
        />
        <GoMakeAutoComplate
          options={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.sheetPaper.search")}
        />
      </div>
      <div style={{ marginTop: 20 }}></div>
    </CustomerAuthLayout>
  );
}
