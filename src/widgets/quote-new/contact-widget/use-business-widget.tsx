import { useGomakeAxios, useSnackBar } from "@/hooks";
import { quoteItemState } from "@/store";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

const useBusinessNeWidget = ({ getQuote }) => {
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const quoteItemValue = useRecoilValue<any>(quoteItemState);

  return {
    t,
  };
};

export { useBusinessNeWidget };
