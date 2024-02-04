import { useStyle } from "./style";

const GalleryModalMapping = ({
  index,
  item,
  selectedShape,
  createParameterForCalculation,
}) => {
  const { clasess } = useStyle();

  return (
    <div
      key={index}
      style={
        item.id != selectedShape?.id
          ? clasess.shapeContainer
          : clasess.shapeSelectedContainer
      }
      onClick={() => createParameterForCalculation(item)}
    >
      <div style={{ width: "100%" }}>
        <img
          src={item?.rowData?.image?.value}
          alt="shape"
          style={{ width: 250, height: 210, padding: 5 }}
        />
      </div>
      <div style={clasess.shapeNameStyle}>{item?.rowData?.name?.value}</div>
      <div style={clasess.shapeWidthHeightStyle}>
        {item?.rowData?.width?.value}
      </div>
      <div style={clasess.shapeWidthHeightStyle}>
        {item?.rowData?.length?.value}
      </div>
      <div style={clasess.shapeWidthHeightStyle}>
        {item?.rowData.type.value.join(', ')}
      </div>
    </div>
  );
};
export { GalleryModalMapping };
