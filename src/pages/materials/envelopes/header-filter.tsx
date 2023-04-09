import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";

import { useEnvelops } from "./use-envelops";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useSupplier } from "@/hooks";

const HeaderFilter = ({ setEnvelopsSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    categoryName,
    envelopsCategores,
    envelopsSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useEnvelops();
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setEnvelopsSizes(envelopsSizes);
  }, [envelopsSizes]);

  return (
    <div style={clasess.filterContainer}>
      {envelopsCategores?.length > 0 && (
        <GoMakeAutoComplate
          options={envelopsCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.envelops.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      )}
      {suppliers?.length > 0 && (
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.plat.supplier")}
          onChange={onChangeSupplier}
        />
      )}
    </div>
  );
};
export { HeaderFilter };
