import { useTranslation } from "react-i18next";

import { useStyle } from "../../style";
import { Checkbox } from "@mui/material";

const HeaderTableWidget = ({ setSheetCheckStore, sheetCheckStore, index }) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();

  return (
    <div
      style={{
        ...clasess.header,
      }}
    >
      <div style={clasess.checkboxHeaderContainer}>
        <Checkbox
          onChange={() => {
            setSheetCheckStore(!sheetCheckStore);
          }}
          checked={sheetCheckStore}
        />
      </div>
      <div style={clasess.weightContainer}>Weight</div>
      <div style={clasess.rowWeightContainer}>
        <div style={index % 2 == 0 ? clasess.bodyRow : clasess.secondRow}>
          <div style={clasess.sizeContainer}>Size</div>
          <div style={clasess.thiknessContainer}>Thickness</div>
          <div style={clasess.costsContainer}>cost ($) per unit/ton</div>
          <div style={clasess.directionContainer}>Directions</div>
          <div style={clasess.activeContainer}>Active</div>
          <div style={clasess.currencyContainer}>Currency</div>
          <div style={clasess.stokContainer}>Stock</div>
        </div>
      </div>
    </div>
  );
};
export { HeaderTableWidget };
