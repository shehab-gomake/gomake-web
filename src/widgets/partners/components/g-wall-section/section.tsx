import { RateIcon } from "../icons/rate-icon";
import { WallSectionCard } from "./card";
import { Stack } from "@mui/material";
import { TotalPartnersIcon } from "../icons/total-partners-icon";
import { ActivePartnersIcon } from "../icons/active-partners-icon";
import { TotalOrdersIcon } from "../icons/total-orders-icon";
import { WaitingRequestIcon } from "../icons/waiting-request-icon";
import { useTranslation } from "react-i18next";

const WallSectionWidget = () => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

  return (
    <Stack direction={"row"} justifyContent={"space-between"} width={"99%"} >
    <WallSectionCard numberHeader={dir =="ltr" ?"225+":"٢٢٥+"} desc={t("partners.totalPartners")} Icon={ <TotalPartnersIcon/>}/>
    <WallSectionCard numberHeader={dir =="ltr" ?"85.5k": "٨٥.٥ ألف"} desc={t("partners.activePartners")} Icon={ <ActivePartnersIcon/>}/>
    <WallSectionCard numberHeader={dir =="ltr" ?"36%": "٣٦٪"} desc={t("partners.successRate")}  Icon={ <RateIcon/>}/>
    <WallSectionCard numberHeader={dir =="ltr" ?"38.4k":"٣٨.٤ ألف"} desc={t("partners.totalOrders")} Icon={ <TotalOrdersIcon/>}/>
    <WallSectionCard numberHeader={dir =="ltr" ?"38.4k":"٣٨.٤ ألف"} desc={t("partners.waitingRequests")}  Icon={ <WaitingRequestIcon/>}/>
    </Stack>
    )
};
export { WallSectionWidget };