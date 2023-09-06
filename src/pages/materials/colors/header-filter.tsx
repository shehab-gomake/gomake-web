import { useTranslation } from "react-i18next";
import { useEffect } from "react";

import { GoMakeAutoComplate } from "@/components";
import { Skeleton } from "@mui/material";
import { useSupplier } from "@/hooks";

import { useStyle } from "./style";

const HeaderFilter = ({ setAllColors, onChangeSupplier, allColors }: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { getSupplier, getSupplierCurrencies, suppliers } = useSupplier();
  useEffect(() => {
    getSupplier();
    getSupplierCurrencies();
  }, []);
  useEffect(() => {
    setAllColors(allColors);
  }, [allColors]);
  
  return (
    <div style={clasess.filterContainer}>
      {suppliers?.length > 0 ? (
        <GoMakeAutoComplate
          options={suppliers}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.colors.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
