import { useEffect, useState } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useProfileFrames } from "./use-profile-frames";
import { useSetRecoilState } from "recoil";
import { refetchMaterialDataState } from "@/store/refetch-material-data";

export default function Braces() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const {
    supplierId,
    tabelHeaders,
    profileFrameCategores,
    categoryName,
    profileFrameSizes,
    getProfileFrameSizes,
    setProfileFrameSizes,
    onChangeCategory,
    onChangeSupplier,
  } = useProfileFrames();
  const setRefetchMaterialDataState = useSetRecoilState(
    refetchMaterialDataState
  );
  useEffect(() => {
    setRefetchMaterialDataState({
      refetch: () => getProfileFrameSizes(),
    });
  }, [supplierId, categoryName]);

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.profileFrames.title")} />
      <HeaderFilter
        setProfileFrameSizes={setProfileFrameSizes}
        profileFrameSizes={profileFrameSizes}
        categoryName={categoryName}
        profileFrameCategores={profileFrameCategores}
        onChangeCategory={onChangeCategory}
        onChangeSupplier={onChangeSupplier}
      />
      <Table tableHeaders={tabelHeaders} tableRows={profileFrameSizes} />
    </CustomerAuthLayout>
  );
}
