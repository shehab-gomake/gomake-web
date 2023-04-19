import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getAndSetHardboardsThicknes } from "@/services/hooks";
import { useGomakeAxios } from "@/hooks";
import { ShowSupplierList } from "@/store";
import { useSetRecoilState } from "recoil";

const useHardboardsModal = ({ item }: any) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [openModal, setOpenModal] = useState(false);
  const [hardboardThickness, setHardboardsThicknes] = useState([]);
  const setShowUnderRowWidget = useSetRecoilState(ShowSupplierList);
  const [categoryName] = useState();

  const headerTable = useMemo(
    () => [
      t("materials.hardboards.modal.code"),
      t("materials.hardboards.modal.thicknessName"),
      t("materials.hardboards.modal.pricePerSquareMeter"),
      t("materials.hardboards.modal.height"),
      t("materials.hardboards.modal.width"),
      t("materials.hardboards.modal.stock"),
      t("materials.hardboards.modal.settings"),
    ],
    []
  );
  const onClickHardboardsThickness = useCallback(async () => {
    const data = await getAndSetHardboardsThicknes(
      callApi,
      setHardboardsThicknes,
      {
        categoryName: item.categoryName,
        sizeId: item.sizeId,
        supplierId: "",
      }
    );
    if (data) {
      setOpenModal(true);
    }
  }, [item]);

  const getHardboardsThickness = useCallback(async (item: any) => {
    const data = await getAndSetHardboardsThicknes(
      callApi,
      setHardboardsThicknes,
      {
        categoryName: item.categoryName,
        sizeId: item.sizeId,
        supplierId: "",
      }
    );
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
    hardboardThickness,
    categoryName,
    openModal,
    headerTable,
    onClickHardboardsThickness,
    setOpenModal,
    onCloseModal,
    getHardboardsThickness,
  };
};

export { useHardboardsModal };
