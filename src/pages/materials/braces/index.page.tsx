import { useState } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";

export default function Braces() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [braceSizes, setbraceSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.brace.title")} />
      <HeaderFilter setbraceSizes={setbraceSizes} />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.brace.code"),
            t("materials.brace.height"),
            t("materials.brace.width"),
            t("materials.brace.stock"),
            t("materials.brace.price"),
            t("materials.brace.settings"),
          ]}
          tableRows={braceSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
