import { Tooltip, tooltipClasses, TooltipProps } from "@mui/material";
import { styled } from "@mui/system";

// Styled Tooltip for Custom Width
const CustomWidthTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 600,
  },
});

export const getTruncatedLabel = (
  text: string,
  limit: number = 15,
  spanStyle: React.CSSProperties = {}
): JSX.Element | string => {
  if (text && text.length > limit) {
    const shortText = `${text.substring(0, limit - 3)}...`;

    return (
      <div>
        <CustomWidthTooltip
          title={text}
          placement="right"
          arrow
          style={{ maxWidth: 500 }}
        >
          <span style={spanStyle}>{shortText}</span>
        </CustomWidthTooltip>
      </div>
    );
  }
  return <span style={spanStyle}>{text}</span>;
};
