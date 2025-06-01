import { useState } from "react";
import { useTranslation } from "react-i18next";

const useAddStuckReason = () => {
  const { t } = useTranslation();
 

  const [selectedReason, setSelectedReason] = useState("");
  const predefinedReasons = [
    t("boardMissions.predefReasons.fileDamaged"),
  ];
  return {
    selectedReason,
    setSelectedReason,
    predefinedReasons,
    t,
  };
};

export { useAddStuckReason };
