import {
  SearchMissionListProps,
  MissionOption,
} from "./search-mission-list.types";
import {
  ScrollableDiv,
  SearchMissionPaper,
  MissionRowStyle,
  LabelListStyle,
} from "./search-mission-list.styles";
import { CustomWidthTooltip } from "../shared";

const renderMenuItem = (
  option: MissionOption,
  handleClick: (id: string, productType: string) => void,
  isRTL: boolean
) => (
  <MissionRowStyle
    key={option?.id}
    onClick={() => handleClick(option?.id, option?.productType)}
  >
    <CustomWidthTooltip
      title={`${option?.boardMissionNumber}\\${option?.orderNumber} - ${option?.clientName}`}
      placement={isRTL ? "left" : "right"}
      arrow
    >
      <span style={LabelListStyle}>
        {`${option?.boardMissionNumber}\\${option?.orderNumber} - ${option?.clientName}`}
      </span>
    </CustomWidthTooltip>
  </MissionRowStyle>
);

export const SearchMissionList = ({
  missionsList,
  handleMissionClick,
}: SearchMissionListProps) => {
  // For now, we'll use false for isRTL, but this could be passed as a prop if needed
  const isRTL = false;

  return (
    <SearchMissionPaper elevation={3}>
      <ScrollableDiv>
        {missionsList?.map((option) =>
          renderMenuItem(option, handleMissionClick, isRTL)
        )}
      </ScrollableDiv>
    </SearchMissionPaper>
  );
};
