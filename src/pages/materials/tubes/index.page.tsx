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
  const [tubesSizes, settubesSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.tubes.title")} />
      <HeaderFilter setKernelsSizes={settubesSizes} />
      <div style={clasess.tableContainer}>
        <Table
          tableHeaders={[
            t("materials.tubes.code"),
            t("materials.tubes.lenght"),
            t("materials.tubes.diameter"),
            t("materials.tubes.weight"),
            t("materials.tubes.stock"),
            t("materials.tubes.price"),
            t("materials.tubes.settings"),
          ]}
          tableRows={tubesSizes}
        />
      </div>
    </CustomerAuthLayout>
  );
}
