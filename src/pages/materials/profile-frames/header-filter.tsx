import { useTranslation } from "react-i18next";

import { GoMakeAutoComplate } from "@/components";
import { useSupplier } from "@/hooks";

import { useProfileFrames } from "./use-profile-frames";
import { useEffect } from "react";
import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderFilter = ({
  setProfileFrameSizes,
  profileFrameSizes,
  categoryName,
  profileFrameCategores,
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
    setProfileFrameSizes(profileFrameSizes);
  }, [profileFrameSizes]);
  return (
    <div style={clasess.filterContainer}>
      {profileFrameCategores?.length > 0 ? (
        <GoMakeAutoComplate
          options={profileFrameCategores}
          style={clasess.autoComplateStyle}
          placeholder={t("materials.profileFrames.category")}
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
          placeholder={t("materials.profileFrames.supplier")}
          onChange={onChangeSupplier}
        />
      ) : (
        <Skeleton variant="rectangular" width={200} height={40} />
      )}
    </div>
  );
};
export { HeaderFilter };
