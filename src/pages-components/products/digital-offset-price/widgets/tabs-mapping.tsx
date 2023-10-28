import { FinishingIcon, PricingIcon, PrintingDetailsIcon } from "@/icons";
import { _renderActiveIcon, _renderUnActiveIcon } from "@/utils/constants";
import { DoneIcon } from "@/widgets";

const TabsMappingWidget = ({
  clasess,
  index,
  handleTabClick,
  activeIndex,
  item,
}: any) => {
  return (
    <div>
      <div
        style={clasess.tabContainer}
        key={index}
        onClick={() => handleTabClick(index)}
      >
        <div style={{ height: 24, minWidth: 24 }}>
          {index === activeIndex ? (
            _renderActiveIcon(item.icon)
          ) : index >= activeIndex ? (
            _renderUnActiveIcon(item.icon)
          ) : (
            <DoneIcon />
          )}
        </div>
        <div
          style={
            index === activeIndex
              ? clasess.tabNameActiveStyle
              : clasess.tabNameStyle
          }
        >
          {item.name}
        </div>
      </div>
      {index === activeIndex ? (
        <div style={clasess.selectedTabLine} />
      ) : (
        <div style={clasess.selectedTabNotLine} />
      )}
    </div>
  );
};

export { TabsMappingWidget };
