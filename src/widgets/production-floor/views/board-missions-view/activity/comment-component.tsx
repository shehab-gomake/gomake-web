import { Avatar, Stack } from "@mui/material";
import { IBoardMissionsActivity } from "@/widgets/production-floor/interfaces/board-missions-activity";
import { FONT_FAMILY } from "@/utils/font-family";
import { UserIcon } from "@/components/icons/user-icon";

const CommentComponent = ({
  userName,
  userImages,
  text,
}: IBoardMissionsActivity) => {
  return (
    <Stack direction={"row"} gap={"12px"} alignItems={"flex-start"}>
      {/* <Avatar src={userImages} /> */}
      <Avatar
        sx={{
          width: 40,
          height: 40,
          flexShrink: 0,
          borderRadius: "var(--radius-full, 9999px)",
          border:
            "0.75px solid var(--Component-colors-Components-Avatars-avatar-contrast-border, rgba(0, 0, 0, 0.08))",
          backgroundColor: "#F2F4F7",
        }}
      >
        {userImages ? (
          <img
            src={userImages}
            alt="User"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <UserIcon />
        )}
      </Avatar>

      <Stack style={{ width: "100%", ...FONT_FAMILY.Inter(400, 16) }}>
        <span>{userName}</span>
        <span
          style={{
            borderRadius: "0 8px 8px 8px",
            padding: "10px 14px 10px 14px",

            // display: "flex",
            // flexDirection: "row",
            // justifyContent: "space-between",
            // alignItems: "flex-end",
            // width: "100%",
            border: "1px solid #EAECF0",
            backgroundColor: "#F9FAFB",
          }}
          dangerouslySetInnerHTML={{ __html: text }}
        ></span>
      </Stack>
    </Stack>
  );
};

export { CommentComponent };
