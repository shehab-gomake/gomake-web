import { useTranslation } from "react-i18next";

const useActions = () => {
  const { t } = useTranslation();
  return { t };
};

export { useActions };
