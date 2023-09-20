import {Avatar, Badge} from "@mui/material";
import {useStyle} from "@/widgets/settings-profile-widget/components/avatar/style";
import {CameraMenu} from "@/widgets/settings-profile-widget/components/avatar/camera-menu";
import {IProfileAvatar} from "@/widgets/settings-profile-widget/components/avatar/interface";

const ProfileAvatar = ({
                           title,
                           src,
                           onUploadImage,
                           changeInitials,
                           onChangeInitials,
                           initials,
                           bgColor
                       }: IProfileAvatar) => {
    const {classes} = useStyle();
    return (
        <div style={{
            display: 'flex',
            alignItems: "center",
            gap: 16,
        }}>
            <Badge
                overlap="circular"
                anchorOrigin={{vertical: 'bottom', horizontal: 'right'}}
                badgeContent={<CameraMenu onUploadImage={onUploadImage} changeInitials={changeInitials}
                                          onChangeInitials={onChangeInitials}/>}>
                {
                  !changeInitials && <Avatar src={src} sx={classes.avatar}/>
                }
                {
                    changeInitials && src && <Avatar src={src} sx={classes.avatar}/>
                }
                {
                    changeInitials && !src &&  <Avatar  sx={{...classes.avatar, bgcolor: bgColor}}>{initials?.toUpperCase()}</Avatar>
                }
            </Badge>
            <span style={classes.avatarTitle}>{title}</span>
        </div>

    );
}

export {ProfileAvatar}