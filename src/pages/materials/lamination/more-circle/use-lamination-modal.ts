import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useLaminationModal = () => {
  const { t } = useTranslation();

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

  return {
    headerTable,
  };
};

export { useLaminationModal };
