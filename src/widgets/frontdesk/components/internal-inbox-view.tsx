import React from "react";
import { Stack, Paper, Typography } from "@mui/material";

const InternalInboxView: React.FC = () => {
  return (
    <Stack sx={{ width: "100%", gap: 2, height: "100%" }}>
      {/* Two-pane area */}
      <Stack direction="row" gap={2} sx={{ width: "100%", flex: 1, height: "100%" }}>
        {/* Left: internal messages list */}
        <div style={{ width: 360, minWidth: 320, height: "100%" }}>
          <Paper
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid #EAECF0",
              borderRadius: 2,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div style={{ padding: 16 }}>
              <Typography variant="h6" color="#667085">
                Internal Messages
              </Typography>
              <Typography variant="body2" color="#667085" sx={{ mt: 1 }}>
                Team communications coming soon...
              </Typography>
            </div>
          </Paper>
        </div>

        {/* Right: message view */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            border: "1px solid #EAECF0",
            borderRadius: 2,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
            height: "100%",
          }}
        >
          <div style={{ padding: 16, flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Typography variant="body2" color="#667085">
              Internal messaging system coming soon
            </Typography>
          </div>
        </Paper>
      </Stack>
    </Stack>
  );
};

export { InternalInboxView };