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
  const [envelopsSizes, setEnvelopsSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.envelops.title")} />
      <HeaderFilter setEnvelopsSizes={setEnvelopsSizes} />

      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.envelops.category"),
            t("materials.envelops.height"),
            t("materials.envelops.width"),
            t("materials.envelops.quantityInPackage"),
            t("materials.envelops.withWindow"),
            t("materials.envelops.stock"),
            t("materials.envelops.price"),
            t("materials.envelops.settings"),
          ]}
          tableRows={envelopsSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
