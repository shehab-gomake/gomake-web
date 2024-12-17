import { useGomakeAxios, useSnackBar } from "@/hooks";
import { useTranslation } from "react-i18next";
const useSettingsPreferences = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  return {};
};

export { useSettingsPreferences };
