import { useTranslation } from "react-i18next";

import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useStyle } from "./style";
import { HeaderFilter } from "./header-filter";
import { useState } from "react";

export default function SheetPaper() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const [kernelsSizes, setKernelsSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.kernels.title")} />
      <HeaderFilter setKernelsSizes={setKernelsSizes} />
    </CustomerAuthLayout>
  );
}
