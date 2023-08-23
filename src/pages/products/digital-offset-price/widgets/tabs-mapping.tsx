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
            <img
              src={item.icon}
              style={{
                width: 24,
                height: 24,
              }}
            />
          ) : index >= activeIndex ? (
            <img
              src={item.icon}
              style={{
                width: 24,
                height: 24,
              }}
            />
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
      {index === activeIndex && <div style={clasess.selectedTabLine} />}
    </div>
  );
};

export { TabsMappingWidget };
