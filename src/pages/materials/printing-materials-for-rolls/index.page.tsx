import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { useState } from "react";
import { Table } from "@/widgets/table/table";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [printingMaterialsSizes, setPrintingMaterialsSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.printingMaterials.title")} />
      <HeaderFilter setPrintingMaterialsSizes={setPrintingMaterialsSizes} />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.printingMaterials.code"),
            t("materials.printingMaterials.height"),
            t("materials.printingMaterials.width"),
            t("materials.printingMaterials.stock"),
            t("materials.printingMaterials.pricePerSquareMeter"),
            t("materials.printingMaterials.weightPerSquareMeter"),
            t("materials.printingMaterials.withPremier"),
            t("materials.printingMaterials.settings"),
          ]}
          tableRows={printingMaterialsSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
