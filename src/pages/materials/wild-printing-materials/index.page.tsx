import { useState } from "react";
import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { Table } from "@/widgets/table/table";
import { HeaderTitle } from "@/widgets";

import { useWildPrintingMaterials } from "./use-wild-printing-materials";
import { HeaderFilter } from "./header-filter";

export default function WildPrintingMaterials() {
  const { t } = useTranslation();
  const { headerTable } = useWildPrintingMaterials();
  const [allWeights, setAllWeights] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.wildPrintingMaterials.title")} />
      <HeaderFilter setAllWeights={setAllWeights} />
      <Table tableHeaders={headerTable} tableRows={allWeights} />
    </CustomerAuthLayout>
  );
}
