import { IconButton, Tooltip } from "@mui/material";
import { HiddenIcon, NotHiddenIcon } from "../../add-product";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { findParameterByCode } from "@/utils/helpers";

const GalleryModalMapping = ({
  index,
  item,
  selectedShape,
  createParameterForCalculation,
  onClickChoosParameter,
  createParameterForCalculationHidden,
  isParameterSettings,
  template,
  isDiesParameter
}) => {
  const { clasess } = useStyle();
  const { t } = useTranslation();
  return (
    <div
      key={index}
      style={
        item.id != selectedShape?.id
          ? clasess.shapeContainer
          : clasess.shapeSelectedContainer
      }
      onClick={() => createParameterForCalculation(item)}
      onDoubleClick={onClickChoosParameter}

    >
      <div style={{ width: "100%" }}>
        <img
          src={item?.rowData?.image?.value}
          alt="shape"
          style={{ width: 250, height: 210, padding: 5 }}
        />
      </div>
      <div style={clasess.shapeNameStyle}>{item?.rowData?.name?.value}</div>
      {
        item?.rowData?.width?.value && item?.rowData?.length?.value ?
          <div style={clasess.shapeWidthHeightStyle}>
            {t("products.galleryModal.dieSize")}: {item?.rowData?.width?.value}x{item?.rowData?.length?.value}
          </div> : <></>
      }

      {
        item?.rowData?.dieUnitWidth?.value && item?.rowData?.dieUnitLength?.value ?
          <div style={clasess.shapeWidthHeightStyle}>
            {t("products.galleryModal.dieUnitSize")}: {item?.rowData?.dieUnitWidth?.value}x{item?.rowData?.dieUnitLength?.value}
          </div> : <></>
      }
      {
        item?.rowData?.unitWidth?.value && item?.rowData?.unitWidth?.value ?
          <div style={clasess.shapeWidthHeightStyle}>
            {t("products.galleryModal.unitSize")}: {item?.rowData?.unitWidth?.value}x{item?.rowData?.unitLength?.value}
          </div> : <></>
      }
      {
        item?.rowData?.finalUnitWidth?.value && item?.rowData?.finalUnitLength?.value && item?.rowData?.finalUnitHeight?.value ?
          <div style={clasess.shapeWidthHeightStyle}>
            {t("products.galleryModal.finalUnitSize")}: {item?.rowData?.finalUnitWidth?.value}x{item?.rowData?.finalUnitLength?.value}x{item?.rowData?.finalUnitHeight?.value}
          </div> : <></>
      }
      {
        item?.rowData?.type?.value && Array.isArray(item?.rowData?.type?.value) ?
          <div style={clasess.shapeWidthHeightStyle}>
            {t("products.galleryModal.type")}: {item?.rowData?.type?.value?.join(', ')}
          </div> : <></>

      }
      {
        item?.rowData?.code?.value ?
          <div style={clasess.shapeWidthHeightStyle}>
            {t("login.code")}: {String(parseFloat(item?.rowData?.code?.value) || item?.rowData?.code?.value)}
          </div> : <></>

      }
      {
        isParameterSettings && <div style={{
          position: "absolute",
          bottom: 0,
          right: 10,
          zIndex: 1000
        }}>
          <Tooltip title={isDiesParameter?.valuesConfigs.find(config => config.id === item?.id)?.isHidden ? "visible" : "hidden"}>
            <IconButton onClick={(event) => {
              event.stopPropagation();
              createParameterForCalculationHidden(item)
            }}>
              {isDiesParameter?.valuesConfigs.find(config => config.id === item?.id) ? (
                isDiesParameter.valuesConfigs.find(config => config.id === item?.id).isHidden ? <HiddenIcon /> : <NotHiddenIcon />
              ) : (
                <NotHiddenIcon />
              )}

            </IconButton>
          </Tooltip>
        </div>
      }

    </div>
  );
};
export { GalleryModalMapping };
