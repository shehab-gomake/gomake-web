import React from "react";
import { IconButton, Tooltip, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { ViewList, ViewAgenda } from "@mui/icons-material";
import { useRecoilState } from "recoil";
import { gmailUIState } from "@/store/frontdesk/providers/gmail";

export const DensityToggle: React.FC = () => {
  const [uiState, setUiState] = useRecoilState(gmailUIState);

  const handleDensityChange = (
    event: React.MouseEvent<HTMLElement>,
    newDensity: 'comfortable' | 'compact' | null
  ) => {
    if (newDensity !== null) {
      setUiState(prev => ({
        ...prev,
        listDensity: newDensity
      }));
    }
  };

  return (
    <ToggleButtonGroup
      value={uiState.listDensity}
      exclusive
      onChange={handleDensityChange}
      aria-label="list density"
      size="small"
      sx={{
        backgroundColor: 'background.paper',
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        '& .MuiToggleButton-root': {
          px: 1,
          py: 0.5,
          border: 0,
          '&.Mui-selected': {
            backgroundColor: 'primary.main',
            color: 'primary.contrastText',
            '&:hover': {
              backgroundColor: 'primary.dark',
            }
          }
        }
      }}
    >
      <ToggleButton value="comfortable" aria-label="comfortable view">
        <Tooltip title="Comfortable">
          <ViewList fontSize="small" />
        </Tooltip>
      </ToggleButton>
      <ToggleButton value="compact" aria-label="compact view">
        <Tooltip title="Compact">
          <ViewAgenda fontSize="small" />
        </Tooltip>
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export const DensityToggleIcon: React.FC = () => {
  const [uiState, setUiState] = useRecoilState(gmailUIState);

  const toggleDensity = () => {
    setUiState(prev => ({
      ...prev,
      listDensity: prev.listDensity === 'comfortable' ? 'compact' : 'comfortable'
    }));
  };

  return (
    <Tooltip title={`Switch to ${uiState.listDensity === 'comfortable' ? 'compact' : 'comfortable'} view`}>
      <IconButton
        onClick={toggleDensity}
        size="small"
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          p: 0.5,
        }}
      >
        {uiState.listDensity === 'comfortable' ? (
          <ViewAgenda fontSize="small" />
        ) : (
          <ViewList fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  );
};