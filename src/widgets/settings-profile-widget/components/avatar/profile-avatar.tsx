import { Avatar, Badge } from "@mui/material";
import { useStyle } from "@/widgets/settings-profile-widget/components/avatar/style";
import { CameraMenu } from "@/widgets/settings-profile-widget/components/avatar/camera-menu";
import { IProfileAvatar } from "@/widgets/settings-profile-widget/components/avatar/interface";
import { useTranslation } from "react-i18next";
import { useThemeComponent } from "@/contexts/theme/useThemeComponent";

const BaseProfileAvatar = ({
  title,
  src,
  onUploadImage,
  changeInitials,
  onChangeInitials,
  initials,
  bgColor,
}: IProfileAvatar) => {
  const { classes } = useStyle();
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
      <Badge
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
          <Avatar src={`${src}?${new Date().toString()}`} sx={classes.avatar} />
        )}
        {changeInitials && src && (
          <Avatar src={`${src}?${new Date().toString()}`} sx={classes.avatar} />
        )}
        {changeInitials && !src && (
          <Avatar sx={{ ...classes.avatar, bgcolor: bgColor }}>
            {initials?.toUpperCase()}
          </Avatar>
        )}
      </Badge>
      <span style={classes.avatarTitle}>{title}</span>
    </div>
  );
};

const ProfileAvatar = (props: IProfileAvatar) => {
  const ThemedProfileAvatar = useThemeComponent(
    "ProfileAvatar",
    BaseProfileAvatar
  );
  return <ThemedProfileAvatar {...props} />;
};

export { ProfileAvatar };
