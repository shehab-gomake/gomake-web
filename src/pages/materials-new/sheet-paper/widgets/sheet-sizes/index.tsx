import { useStyle } from "../../style";
import { Switch } from "@mui/material";

const SheetSizesWidget = ({ index2, size }) => {
  const { clasess } = useStyle();

  return (
    <div style={index2 % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
      <div style={clasess.sizeContainer}>{size?.name}</div>
      <div style={clasess.thiknessContainer}>{size?.thickness}</div>
      <div style={clasess.costsContainer}>
        {size?.pricePerUnit}/{size?.pricePerTon}
      </div>
      <div style={clasess.directionContainer}>{size?.direction}</div>
      <div style={clasess.activeContainer}>
        <Switch checked={size?.isActive} />
      </div>
      <div style={clasess.currencyContainer}>{size?.currency}</div>
      <div style={clasess.stokContainer}>{size?.stock}</div>
    </div>
  );
};
export { SheetSizesWidget };
