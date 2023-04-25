import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import { GoMakeAutoComplate } from "@/components";
import { Skeleton } from "@mui/material";
import { useSupplier } from "@/hooks";

import { useAdditions } from "./use-additions";
import { useStyle } from "./style";

const HeaderFilter = ({ setAllAdditions }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { allAdditions, onChangeSupplier } = useAdditions({});
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setAllAdditions(allAdditions);
  }, [allAdditions]);
  return (
    <div style={clasess.filterContainer}>
      {suppliers?.length > 0 ? (
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.additions.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
