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
  const [kernelsSizes, setKernelsSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.kernels.title")} />
      <HeaderFilter setKernelsSizes={setKernelsSizes} />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.kernels.code"),
            t("materials.kernels.lenght"),
            t("materials.kernels.diameter"),
            t("materials.kernels.weight"),
            t("materials.kernels.stock"),
            t("materials.kernels.price"),
            t("materials.kernels.settings"),
          ]}
          tableRows={kernelsSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
