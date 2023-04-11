import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useEncapsulationRoll } from "./use-encapsulation-roll";
import { HeaderFilter } from "./header-filter";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { headerTable } = useEncapsulationRoll();
  const [allThickness, setAllThickness] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.encapsulationRoll.title")} />
      <HeaderFilter setAllThickness={setAllThickness} />
      <Table tableHeaders={headerTable} tableRows={allThickness} />
    </CustomerAuthLayout>
  );
}
