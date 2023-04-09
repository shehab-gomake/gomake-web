import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";

import { useTubess } from "./use-kernels";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useSupplier } from "@/hooks";

const HeaderFilter = ({ setKernelsSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    categoryName,
    tubesCategores,
    tubesSuppliers,
    tubesSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useTubess();
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setKernelsSizes(tubesSizes);
  }, [tubesSizes]);

  return (
    <div style={clasess.filterContainer}>
      {tubesCategores?.length > 0 && (
        <GoMakeAutoComplate
          options={tubesCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.tubes.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      )}
      {tubesSuppliers?.length > 0 && (
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.tubes.supplier")}
          onChange={onChangeSupplier}
        />
      )}
    </div>
  );
};
export { HeaderFilter };
