import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";

import { useEnvelops } from "./use-envelops";
import { useStyle } from "./style";
import { useEffect } from "react";
import { useSupplier } from "@/hooks";
import { Skeleton } from "@mui/material";

const HeaderFilter = ({
  setEnvelopsSizes,
  envelopsSizes,
  categoryName,
  envelopsCategores,
  onChangeCategory,
  onChangeSupplier,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

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
      {envelopsCategores?.length > 0 ? (
        <GoMakeAutoComplate
          options={envelopsCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.envelops.category")}
          onChange={onChangeCategory}
          value={categoryName}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
      {suppliers?.length > 0 ? (
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.plat.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
