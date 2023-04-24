import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetRecoilState } from "recoil";
import { ShowSupplierList } from "@/store";
import { getAndSetLaminatioThicknes } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";

const useLaminationModal = ({ item }: any) => {
  const { t } = useTranslation();
  const setShowUnderRowWidget = useSetRecoilState(ShowSupplierList);
  const [openModal, setOpenModal] = useState(false);
  const [laminationThickness, setLaminationThickness] = useState([]);
  const [categoryName] = useState();
  const { callApi } = useGomakeAxios();

  const headerTable = useMemo(
    () => [
      t("materials.lamination.modal.code"),
      t("materials.lamination.modal.thickness"),
      t("materials.lamination.modal.cold/hot"),
      t("materials.lamination.modal.price"),
      t("materials.lamination.modal.stock"),
      t("materials.lamination.settings"),
    ],
    []
  );
  const OnClickGetLaminationThickness = useCallback(async () => {
    const data = await getAndSetLaminatioThicknes(
      callApi,
      setLaminationThickness,
      {
        categoryName: item?.categoryName,
        sizeId: item?.sizeId,
        supplierId: item?.supplierId || "",
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [item]);
  const getLaminationThickness = useCallback(async (item: any) => {
    const data = await getAndSetLaminatioThicknes(callApi, undefined, {
      categoryName: item?.categoryName,
      sizeId: item?.sizeId,
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
    laminationThickness,
    categoryName,
    headerTable,
    openModal,
    OnClickGetLaminationThickness,
    setOpenModal,
    onCloseModal,
    getLaminationThickness,
  };
};

export { useLaminationModal };
