import { WallSectionCard } from "./card";
import { Stack } from "@mui/material";
import { TotalPartnersIcon } from "../icons/total-partners-icon";
import { ActivePartnersIcon } from "../icons/active-partners-icon";
import { BlockedIcon, WaitingRequestIcon } from "../icons/waiting-request-icon";
import { useTranslation } from "react-i18next";

const MyPartnersSectionWidget = () => {
  const { t } = useTranslation();

  return (
    <Stack direction={"row"} justifyContent={"space-between"} width={"99%"} >
    <WallSectionCard numberHeader={"1500"} desc={t("partners.totalPartners")} Icon={ <TotalPartnersIcon/>}/>
    <WallSectionCard numberHeader={"1400"} desc={t("partners.activePartners")} Icon={ <ActivePartnersIcon/>}/>
    <WallSectionCard numberHeader={"100"} desc={t("partners.blocked")}  Icon={ <BlockedIcon/>}/>
    <WallSectionCard numberHeader={"38.4k"} desc={t("partners.waitingToApprove")} Icon={ <WaitingRequestIcon/>}/>
    </Stack>
    )
};
export { MyPartnersSectionWidget };