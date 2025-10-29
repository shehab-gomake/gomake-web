import React from "react";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";
import { CustomTooltip } from "@/widgets/header";
import DashboardCustomizeOutlinedIcon from "@mui/icons-material/DashboardCustomizeOutlined";

const FrontdeskV2Nav = () => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/frontdesk-v2");
  };

  return (
    <CustomTooltip title="FrontDesk V2" arrow>
      <IconButton style={{ backgroundColor: "#f6f6f6", padding: "8px" }} onClick={handleClick}>
        <DashboardCustomizeOutlinedIcon style={{ color: "#2e3092", width: 22, height: 22 }} />
      </IconButton>
    </CustomTooltip>
  );
};

export { FrontdeskV2Nav };
