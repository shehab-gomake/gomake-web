import { useTranslation } from "react-i18next";

const useQuotes = () => {
  const { t } = useTranslation();
  return {
    t,
  };
};

export { useQuotes };
