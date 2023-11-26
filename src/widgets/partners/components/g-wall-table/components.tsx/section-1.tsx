import { MemberCard } from "./member-card";
import { useStyle } from "./style";
import { Stack } from "@mui/material";

interface IProps {
    title: string;
    subTitle: string;
}
const GeneralSection = ({ title, subTitle}: IProps) => {
    const { classes } = useStyle();

    return (
        <Stack direction={'column'} gap={"10px"} justifyContent={"flex-start"} >
                <h1 style={classes.sectionTitle}>{title}</h1>
                <h1 style={classes.sectionSubTitle}>{subTitle}</h1>
        </Stack>
    )
};
export { GeneralSection };