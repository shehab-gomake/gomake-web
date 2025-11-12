import React from "react";
import { Box, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";

interface HuddleControlsProps {
  isConnected: boolean;
  isMuted: boolean;
  error: string | null;
  onToggleMute: () => void;
  onEndHuddle: () => void;
  remoteAudioRef?: React.RefObject<HTMLAudioElement>;
}

export const HuddleControls: React.FC<HuddleControlsProps> = ({
  isConnected,
  isMuted,
  error,
  onToggleMute,
  onEndHuddle,
  remoteAudioRef,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        mb: 2,
        bgcolor: "#f5f5f5",
        borderRadius: 2,
        border: "1px solid #e0e0e0",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              bgcolor: isConnected ? "#4caf50" : "#9e9e9e",
            }}
          />
          <Box sx={{ fontSize: "0.875rem", color: "#666" }}>
            {isConnected ? "Huddle Connected" : "Connecting..."}
          </Box>
          {error && (
            <Box sx={{ fontSize: "0.875rem", color: "#f44336" }}>{error}</Box>
          )}
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Button
            onClick={onToggleMute}
            variant={isMuted ? "contained" : "outlined"}
            color={isMuted ? "error" : "primary"}
            size="small"
            startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
            sx={{ minWidth: 100 }}
          >
            {isMuted ? "Unmute" : "Mute"}
          </Button>
          <Button
            onClick={onEndHuddle}
            variant="contained"
            color="error"
            size="small"
            startIcon={<PhoneDisabledIcon />}
          >
            End
          </Button>
        </Box>
      </Box>
      {/* Hidden audio element for WebRTC */}
      {remoteAudioRef && <audio ref={remoteAudioRef} autoPlay />}
    </Box>
  );
};

