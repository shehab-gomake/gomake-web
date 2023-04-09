import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";

import { useKernels } from "./use-kernels";
import { useStyle } from "./style";
import { useEffect } from "react";

const HeaderFilter = ({ setKernelsSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    categoryName,
    kernelsCategores,
    kernelsSuppliers,
    kernelsSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useKernels();
  useEffect(() => {
    setKernelsSizes(kernelsSizes);
  }, [kernelsSizes]);

  return (
    <div style={clasess.filterContainer}>
      {kernelsCategores?.length > 0 && (
        <GoMakeAutoComplate
          options={kernelsCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.kernels.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      )}
      {kernelsSuppliers?.length > 0 && (
        <GoMakeAutoComplate
          options={kernelsSuppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.kernels.supplier")}
          onChange={onChangeSupplier}
        />
      )}
    </div>
  );
};
export { HeaderFilter };
