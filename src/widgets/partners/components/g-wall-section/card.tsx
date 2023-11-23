import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Stack } from "@mui/material";
import { ReactNode } from "react";

interface IProps {
    number: string;
    desc: string;
    Icon: ReactNode;
}
const WallSectionCard = ({number,desc,Icon} : IProps ) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  return (
    <div style={classes.cardStyle}>
      <Stack direction={'row'} justifyContent={"space-between"} paddingRight={"30px"} paddingLeft={"20px"}>
        <Stack direction={'column'} alignItems={"flex-start"}>
          <h6 style={classes.numberStyle}>
            {number}
          </h6>
          <h1 style={classes.descStyle}>
            {desc}
          </h1>
        </Stack>
        {Icon}
      </Stack>
    </div>
  )
};
export { WallSectionCard };