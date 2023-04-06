import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";

import { useEnvelops } from "./use-envelops";
import { useStyle } from "./style";
import { useEffect } from "react";

const HeaderFilter = ({ setEnvelopsSizes }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    categoryName,
    envelopsCategores,
    envelopsSuppliers,
    envelopsSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useEnvelops();
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
      {envelopsSuppliers?.length > 0 && (
        <GoMakeAutoComplate
          options={envelopsSuppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.brace.supplier")}
          onChange={onChangeSupplier}
        />
      )}
    </div>
  );
};
export { HeaderFilter };
