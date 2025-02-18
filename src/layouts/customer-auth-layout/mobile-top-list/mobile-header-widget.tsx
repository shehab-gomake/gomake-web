import Image from "next/image";
import { useEffect, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TopListLayout } from "./mobile-top-list";
import { useStyle } from "./style";
import { convertHeightToVH } from "@/utils/adapter";
import { HEADER_HEIGHT } from "@/utils/layout-config";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";

const MobileHeaderWidget = () => {
  const { classes } = useStyle();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [myProfileLogo, setMyProfileLogo] = useState("");
  const logoSize = parseFloat(convertHeightToVH(HEADER_HEIGHT)) * 0.8;

  useEffect(() => {
    setMyProfileLogo(localStorage.getItem("systemLogo"));
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* Header */}
      <div style={classes.mobileHeaderContainer}>
        {myProfileLogo && (
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
        )}
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
          position: "absolute",
          top: "100%",
          left: 0,
          width: "100%",
          backgroundColor: "#333",
          color: "#fff",
          overflow: "hidden",
          height: isSidebarOpen ? "500px" : "0px",
          transition: "height 0.3s ease-in-out",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999999999999999,
        }}
      >
        <TopListLayout />
      </div>
    </div>
  );
};

export { MobileHeaderWidget };
