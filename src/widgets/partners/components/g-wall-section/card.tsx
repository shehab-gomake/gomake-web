import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { Stack } from "@mui/material";
import { ReactNode } from "react";

interface IProps {
    numberHeader: string;
    desc: string;
    Icon: ReactNode;
}
const WallSectionCard = ({numberHeader,desc,Icon} : IProps ) => {
  const { t } = useTranslation();
  const { classes } = useStyle();

  return (
    <div style={classes.cardStyle}>
        <Stack direction={'column'} alignItems={"flex-start"}>
          <h6 style={classes.numberStyle}>
            {numberHeader}
          </h6>
          <h1 style={classes.descStyle}>
            {desc}
          </h1>
        </Stack>
        {Icon}
    </div>
  )
};
export { WallSectionCard };