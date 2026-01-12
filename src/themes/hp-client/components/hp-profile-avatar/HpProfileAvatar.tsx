import { Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CameraMenu } from "@/widgets/settings-profile-widget/components/avatar/camera-menu";
import { IProfileAvatar } from "@/widgets/settings-profile-widget/components/avatar/interface";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";

const HpAvatar = styled(Avatar)(() => {
  return {
    width: "100px",
    height: "100px",
    border: "none",
  };
});

const HpBadge = styled(Badge)(() => {
  return {
    "& .MuiBadge-badge": {
      border: "2px solid #FFFFFF",
      backgroundColor: "transparent",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      padding: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      // Style the IconButton inside
      "& .MuiIconButton-root": {
        backgroundColor: "var(--theme-primary-color, #024AD8)", // Different background color
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        "&:hover": {
          backgroundColor: "var(--theme-primary-hover, #1A5FFF)",
        },
      },
    },
  };
});

const HpProfileAvatar = ({
  title,
  src,
  onUploadImage,
  changeInitials,
  onChangeInitials,
  initials,
  bgColor,
}: IProfileAvatar) => {
  const { t } = useTranslation();
  const dir: "rtl" | "ltr" = t("direction");

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <HpBadge
        overlap="circular"
        anchorOrigin={{
          vertical: "bottom",
          horizontal: dir === "rtl" ? "left" : "right",
        }}
        badgeContent={
          <CameraMenu
            onUploadImage={onUploadImage}
            changeInitials={changeInitials}
            onChangeInitials={onChangeInitials}
          />
        }
      >
        {!changeInitials && (
          <HpAvatar src={`${src}?${new Date().toString()}`} />
        )}
        {changeInitials && src && (
          <HpAvatar src={`${src}?${new Date().toString()}`} />
        )}
        {changeInitials && !src && (
          <HpAvatar sx={{ bgcolor: bgColor }}>
            {initials?.toUpperCase()}
          </HpAvatar>
        )}
      </HpBadge>
      <span
        style={{
          ...FONT_FAMILY.Lexend(500, 20),
          color: "var(--theme-text-primary, #1A1A1A)",
          textTransform: "capitalize" as "capitalize",
        }}
      >
        {title}
      </span>
    </div>
  );
};

export { HpProfileAvatar };
