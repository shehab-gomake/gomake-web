import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Box, Rating, Stack } from "@mui/material";
import { ReactNode } from "react";
import { LocationIcon } from "../../icons/location-icon";
import { TiraBigIcon } from "../../icons/company-big-icon";
import StarIcon from '@mui/icons-material/Star';

interface IProps {
    title?: string;
    subTitle?: string;
    Icon?: ReactNode;
}
const GeneralCard = ({ title, subTitle, Icon }: IProps) => {
    const { classes } = useStyle();

    return (
        <Stack direction={'row'} gap={"6px"} alignItems={"center"}>
            <TiraBigIcon />
            <Stack direction={'column'} >
                <h6 style={classes.titleStyle}>Company name</h6>
                <Stack direction={'row'} alignItems={"center"} gap={"4px"}>
                    <LocationIcon />
                    <h1 style={classes.subTitleStyle}>Tira, Palestine</h1>
                </Stack>
            </Stack>
            <Box
                sx={{
                    width: 200,
                    display: 'flex',
                    alignItems: 'center',
                    paddingLeft: "10px"
                }} >
                <Rating
                    name="text-feedback"
                    value={1}
                    readOnly
                    precision={0.5}
                    max={1}
                    emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                <Box sx={{ ml: 0.5 }}>4.9</Box>
            </Box>
        </Stack>
    )
};
export { GeneralCard };