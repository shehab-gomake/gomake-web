/**
 * Chatwoot Test Page Route
 * Accessible at: /frontdesk/chatwoot-test
 * Super basic layout - no authentication wrapper
 */

import dynamic from "next/dynamic";
import { Box } from "@mui/material";

const ChatwootTestPage = dynamic(() => import("@/widgets/frontdesk/providers/chatwoot-test/chatwoot-test-page"), {
  ssr: false,
  loading: () => null,
});

export default function ChatwootTestRoute() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      <ChatwootTestPage />
    </Box>
  );
}
