import {Avatar, Badge} from "@mui/material";
import {useStyle} from "@/widgets/settings-profile-widget/components/avatar/style";
import {CameraMenu} from "@/widgets/settings-profile-widget/components/avatar/camera-menu";

const ProfileAvatar = ({title}: {title: string;}) => {
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
                badgeContent={<CameraMenu/>}>
                <Avatar sx={classes.avatar}>rf</Avatar>
            </Badge>
            <span style={classes.avatarTitle}>{title}</span>
        </div>

    );
}

export {ProfileAvatar}