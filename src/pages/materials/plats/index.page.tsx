import { useEffect, useState } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useSupplier } from "@/hooks";

export default function Braces() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [braceSizes, setbraceSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.plat.title")} />
      <HeaderFilter setbraceSizes={setbraceSizes} />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.plat.code"),
            t("materials.plat.height"),
            t("materials.plat.width"),
            t("materials.plat.stock"),
            t("materials.plat.price"),
            t("materials.plat.settings"),
          ]}
          tableRows={braceSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
