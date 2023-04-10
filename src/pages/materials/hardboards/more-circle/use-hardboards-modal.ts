import { useMemo } from "react";
import { useTranslation } from "react-i18next";

const useHardboardsModal = () => {
  const { t } = useTranslation();

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

  return {
    headerTable,
  };
};

export { useHardboardsModal };
