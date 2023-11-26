import { EarthIcon } from "../../icons/earth-icon";
import { EnvelopeIcon } from "../../icons/envelope-icon";
import { LocationIcon } from "../../icons/location-info-icon";
import { PhoneIcon } from "../../icons/phone-icon";
import { useStyle } from "./style";
import { Stack } from "@mui/material";

const InfoSection = () => {
    const { classes } = useStyle();

    return (
        <Stack direction={'column'} gap={"10px"} >
            <h1 style={classes.sectionTitle}>Contact information</h1>
            <Stack direction={'row'} gap={"10px"}  >
                <PhoneIcon />
                <h1 style={classes.infoStyle}>+972 893 42343</h1>
            </Stack>
            <Stack direction={'row'} gap={"10px"}  >
                <EnvelopeIcon />
                <h1 style={classes.infoStyle}>Company@info.com</h1>
            </Stack>
            <Stack direction={'row'} gap={"10px"}  >
                <EarthIcon />
                <h1 style={classes.infoStyle}>www.compwebsite@domain.com</h1>
            </Stack>
            <Stack direction={'row'} gap={"10px"}  >
                <LocationIcon />
                <h1 style={classes.infoStyle}>Tira, Palestine</h1>
            </Stack>

        </Stack>
    )
};
export { InfoSection };