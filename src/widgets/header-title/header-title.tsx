import { Skeleton } from "@mui/material";
import { useStyle } from "./style";

const HeaderTitle = ({ marginTop, marginBottom, ...props }: any) => {
  const { clasess } = useStyle({ marginTop, marginBottom });

  return (
    <div style={clasess.container}>
      {props?.title?.length > 0 ? (
        <div style={clasess.titleStyle}>{props.title}</div>
      ) : (
        <Skeleton variant="text" sx={{ fontSize: "2rem", width: "20%" }} />
      )}
    </div>
  );
};
export { HeaderTitle };
