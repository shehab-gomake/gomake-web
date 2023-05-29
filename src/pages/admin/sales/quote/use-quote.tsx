import { useGomakeAxios } from "@/hooks";
import { useTranslation } from "react-i18next";

const useQuote = () => {
  const { callApi } = useGomakeAxios();
  const { t } = useTranslation();

  return { t };
};

export { useQuote };
