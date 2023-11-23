import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { RateIcon } from "../icons/rate-icon";
import { WallSectionCard } from "./card";
import { Stack } from "@mui/material";
import { TotalPartnersIcon } from "../icons/total-partners-icon";
import { ActivePartnersIcon } from "../icons/active-partners-icon";
import { TotalOrdersIcon } from "../icons/total-orders-icon";
import { WaitingRequestIcon } from "../icons/waiting-request-icon";

const WallSectionWidget = () => {
 
  return (
    <Stack direction={"row"} gap={"20px"}>
    <WallSectionCard number={"92.6k"} desc={"Total partners"} Icon={ <TotalPartnersIcon/>}/>
    <WallSectionCard number={"85.5k"} desc={"Active partners"} Icon={ <ActivePartnersIcon/>}/>
    <WallSectionCard number={"36%"} desc={"success rate"} Icon={ <RateIcon/>}/>
    <WallSectionCard number={"38.4k"} desc={"Total Orders"} Icon={ <TotalOrdersIcon/>}/>
    <WallSectionCard number={"38.4k"} desc={"Waiting Requests"} Icon={ <WaitingRequestIcon/>}/>
    </Stack>
    )
};
export { WallSectionWidget };