import { Skeleton } from "@mui/material";
import { useStyle } from "./style";
import { getTitleTypography } from "@/utils/typography-utils";

const HeaderTitle = ({ marginTop, marginBottom, color, ...props }: any) => {
  const { classes } = useStyle({ marginTop, marginBottom });

  return (
    <div style={classes.container}>
      {props?.title?.length > 0 ? (
        <div style={getTitleTypography({ color })}>{props.title}</div>
      ) : (
        <Skeleton variant="text" sx={{ fontSize: "2rem", width: "20%" }} />
      )}
    </div>
  );
};
export { HeaderTitle };
