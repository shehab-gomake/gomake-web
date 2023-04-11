import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";

import { getAndSetApplicationThickness } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";
import { ShowSupplierList } from "@/store";

const useApplicationModal = ({ item }: any) => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();
  const setShowUnderRowWidget = useSetRecoilState(ShowSupplierList);
  const [openModal, setOpenModal] = useState(false);
  const [applicationThickness, setApplicationThickness] = useState([]);
  const [categoryName] = useState();
  const headerTable = useMemo(
    () => [
      t("materials.applications.code"),
      t("materials.applications.thickness"),
      t("materials.applications.sizeName"),
      t("materials.applications.pricePerSquareMeter"),
      t("materials.applications.stock"),
      t("materials.applications.settings"),
    ],
    []
  );
  const OnClickGetApplicationThickness = useCallback(async () => {
    const data = await getAndSetApplicationThickness(
      callApi,
      setApplicationThickness,
      {
        categoryName: item?.categoryName,
        thicknessId: item?.thicknessId,
        supplierId: item?.supplierId || "",
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [item]);
  const getApplicationThickness = useCallback(async (item: any) => {
    const data = await getAndSetApplicationThickness(callApi, undefined, {
      categoryName: item?.categoryName,
      thicknessId: item?.thicknessId,
      supplierId: item?.supplierId || "",
    });

    return data;
  }, []);
  const onCloseModal = () => {
    setOpenModal(false);
    setShowUnderRowWidget({
      stateShow: false,
      widget: "",
      item: "",
      key: "",
    });
  };

  return {
    applicationThickness,
    categoryName,
    headerTable,
    openModal,
    OnClickGetApplicationThickness,
    setOpenModal,
    onCloseModal,
    getApplicationThickness,
  };
};

export { useApplicationModal };
