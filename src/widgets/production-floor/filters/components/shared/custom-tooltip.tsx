import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { styled } from "@mui/system";

export const CustomWidthTooltip = styled(
  ({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  )
)({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 600,
  },
});
