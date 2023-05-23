import { useTranslation } from "react-i18next";

import { useStyle } from "./style";
import { useRecoilValue } from "recoil";
import { chartDataByActionProfitRow } from "@/store";

const ChartVidget = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const chartDataValue = useRecoilValue<any>(chartDataByActionProfitRow);

  return (
    <div style={clasess.mainCointainer}>
      <></>
    </div>
  );
};
export { ChartVidget };
