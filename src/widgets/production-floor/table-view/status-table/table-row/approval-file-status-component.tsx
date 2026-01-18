import { Stack } from "@mui/material";
import { RejectedIcon } from "./more-circle/icons/rejected";
import { WaitingIcon } from "./more-circle/icons/waiting";
import { ApprovedIcon } from "./more-circle/icons/approved";

interface IProps {
  fileStatus: 0 | 1 | 2;
  width?: string;
  height?: string;
  t?: any;
  onClick?: () => void;
  boardMissionId?: string;
}

const ApprovalFileStatusComponent = ({
  fileStatus,
  height,
  width,
  t,
  onClick,
  boardMissionId,
}: IProps) => {
  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  return (
    <Stack
      alignItems={"center"}
      justifyContent={"center"}
      onClick={onClick}
      onMouseDown={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
      style={{
        paddingLeft: isRTL ? "10px" : undefined,
        paddingRight: !isRTL ? "10px" : undefined,
        cursor: onClick ? "pointer" : "default",
      }}
      sx={{
        "& svg": {
          pointerEvents: "none",
        },
      }}
    >
      {fileStatus === 0 && <WaitingIcon height={height} width={width} />}
      {fileStatus === 1 && <ApprovedIcon height={height} width={width} />}
      {fileStatus === 2 && <RejectedIcon height={height} width={width} />}
    </Stack>
  );
};

export { ApprovalFileStatusComponent };
