import { IconButton } from "@mui/material";
import HeadsetMicOutlinedIcon from "@mui/icons-material/HeadsetMicOutlined";
import { useRouter } from "next/router";
import { CustomTooltip } from "../header";

const FrontdeskNav = () => {
  const { push } = useRouter();

  const handleClick = async () => {
    await push("/frontdesk/inbox");
  };

  return (
    <CustomTooltip title={"Frontdesk"} arrow>
      <IconButton
        style={{ backgroundColor: "#f6f6f6", padding: "8px" }}
        onClick={handleClick}
      >
        <HeadsetMicOutlinedIcon
          style={{ color: "#2e3092", width: 22, height: 22 }}
        />
      </IconButton>
    </CustomTooltip>
  );
};

export { FrontdeskNav };
