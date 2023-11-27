import { MemberCard } from "./member-card";
import { useStyle } from "./style";
import { Stack } from "@mui/material";

interface IProps {
    title: string;
}
const MembersSection = ({ title}: IProps) => {
    const { classes } = useStyle();

    return (
        <Stack direction={'column'} gap={"10px"} justifyContent={"flex-start"} >
                <h1 style={classes.sectionTitle}>{title}</h1>
                <Stack direction={'row'} gap={"10px"} justifyContent={"flex-start"} >
                <MemberCard imagePath="https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/image1.png" name="Andre Noah" job="CEO" ></MemberCard>
                <MemberCard imagePath="https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/image2.png"  name="Shery Alfy" job="CTO" ></MemberCard>
                <MemberCard imagePath="https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/Rectangle+23799+(3).png" name="Ali Ismail" job="CFO"></MemberCard>
                <MemberCard imagePath="https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/Rectangle+23799+(4).png" name="Adele Noah" job="Team Lead"></MemberCard>
                <MemberCard imagePath="https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/Rectangle+23799+(2).png" name="Elly Hoor" job="Senior Developer"></MemberCard>
                <MemberCard imagePath="https://gomake-dev.s3.eu-west-3.amazonaws.com/partners-demo/%E2%80%8F%E2%80%8FRectangle+23799+(1)+-+%D7%A2%D7%95%D7%AA%D7%A7.png" name="Elly Hoor" job="Senior Designer"></MemberCard>
                </Stack>

        </Stack>
    )
};
export { MembersSection };