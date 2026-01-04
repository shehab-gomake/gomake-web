import { useTranslation } from "react-i18next";
import { EnumVATStatus } from "@/enums/accounting-enums";
import { quoteItemState } from "@/store";
import { useRecoilValue } from "recoil";
import { useEffect, useState } from "react";

const useSttingsVatListMenu = () => {
  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const vatStatusList: { value: number; text: string }[] = Object.values(
    EnumVATStatus
  )
    .filter((value) => typeof value === "number")
    .map((value) => ({
      value: value as number,
      text: t(`accounting.${EnumVATStatus[value]}`),
    }));
  const vatStatus = vatStatusList.find(
    (status) => status.value === quoteStateValue?.vatStatus
  )?.text;

  const [exchangeRate, setExchangeRate] = useState(
    quoteStateValue?.exchangeRate || "-"
  );

  useEffect(() => {
    setExchangeRate(quoteStateValue?.exchangeRate || "-");
  }, [quoteStateValue?.exchangeRate]);

  return {
    quoteStateValue,
    vatStatus,
    vatStatusList,
    exchangeRate,
    setExchangeRate,
    t,
  };
};

export { useSttingsVatListMenu };
