import Image from "next/image";
import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TopListLayout } from "./mobile-top-list";
import { useStyle } from "./style";
import { convertHeightToVH } from "@/utils/adapter";
import { HEADER_HEIGHT } from "@/utils/layout-config";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const MobileHeaderWidget = () => {
  const { classes } = useStyle();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const logoSize = parseFloat(convertHeightToVH(HEADER_HEIGHT)) * 0.8;

  return (
    <div style={{ position: "relative" }}>
      {/* Header */}
      <div style={classes.mobileHeaderContainer}>
        <Image
          src={
            "https://gomake-printhouses-logos.s3.amazonaws.com/default_generalLogo.jpeg"
          }
          alt="logo"
          width={logoSize}
          height={logoSize}
          style={{
            objectFit: "contain",
            borderRadius: "4px",
            width: `${logoSize}vh`,
            height: `${logoSize}vh`,
          }}
        />

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          {isSidebarOpen ? (
            <CloseIcon fontSize="large" sx={{ color: "#f6f6f6" }} />
          ) : (
            <MenuRoundedIcon fontSize="large" sx={{ color: "#f6f6f6" }} />
          )}
        </button>
      </div>

      <div
        style={{
          ...classes.drawerContainer,
          height: isSidebarOpen ? "60vh" : "0px",
        }}
      >
        <TopListLayout />
      </div>
    </div>
  );
};

export { MobileHeaderWidget };
