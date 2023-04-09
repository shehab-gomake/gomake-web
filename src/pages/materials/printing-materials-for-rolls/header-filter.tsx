import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";

import { usePrintingMaterials } from "./use-printing-materials-for-rolls";
import { useStyle } from "./style";
import { useEffect } from "react";

const HeaderFilter = ({ setPrintingMaterialsSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    categoryName,
    printingMaterialsCategores,
    printingMaterialsSuppliers,
    printingMaterialsSizes,
    onChangeCategory,
    onChangeSupplier,
  } = usePrintingMaterials();
  useEffect(() => {
    setPrintingMaterialsSizes(printingMaterialsSizes);
  }, [printingMaterialsSizes]);

  return (
    <div style={clasess.filterContainer}>
      {printingMaterialsCategores?.length > 0 && (
        <GoMakeAutoComplate
          options={printingMaterialsCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.printingMaterials.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      )}
      {printingMaterialsSuppliers?.length > 0 && (
        <GoMakeAutoComplate
          options={printingMaterialsSuppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.printingMaterials.supplier")}
          onChange={onChangeSupplier}
        />
      )}
    </div>
  );
};
export { HeaderFilter };
