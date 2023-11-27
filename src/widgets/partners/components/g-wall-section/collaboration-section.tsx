import { WallSectionCard } from "./card";
import { Stack } from "@mui/material";
import { ActivePartnersIcon } from "../icons/active-partners-icon";
import { TotalOrdersIcon } from "../icons/total-orders-icon";
import { WaitingRequestIcon } from "../icons/waiting-request-icon";
import { useTranslation } from "react-i18next";
import { DeclinedIcon } from "../icons/declined-icon";

const WallSectionWidget = () => {
  const { t } = useTranslation();

  return (
    <Stack direction={"row"} justifyContent={"space-between"} width={"99%"} >
    <WallSectionCard numberHeader={"35k"} desc={t("partners.totalOrdersQuote")} Icon={ <TotalOrdersIcon/>}/>
    <WallSectionCard numberHeader={"100+"} desc={t("partners.waitingForReview")}  Icon={ <WaitingRequestIcon/>}/>
    <WallSectionCard numberHeader={"86%"} desc={t("partners.approved")} Icon={ <ActivePartnersIcon/>}/>
    <WallSectionCard numberHeader={"14%"} desc={t("partners.declined")}  Icon={ <DeclinedIcon/>}/>
    </Stack>
    )
};
export { WallSectionWidget };