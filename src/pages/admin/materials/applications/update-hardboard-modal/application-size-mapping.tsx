import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { ControlIconsWidget } from "./control-icons-widget";
import { materialApplicationsState } from "../store/applications";
import { useStyle } from "./style";

const ApplicationSizeesMapping = ({
  index,
  applicationSize,
  applicationThickness,
  selectedItem,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
  );
  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <ControlIconsWidget
          t={t}
          onClickDelete={() =>
            materialApplicationsStateValue.deleteApplicationThicknessSize(
              selectedItem?.categoryName,
              applicationSize?.id,
              applicationThickness?.id
            )
          }
          item={applicationSize}
          onClickUpdate={() =>
            materialApplicationsStateValue.updateApplicationThicknessSize(
              selectedItem?.categoryName,
              applicationSize?.id,
              applicationThickness?.id
            )
          }
          title={t(
            "materials.applications.admin.deleteApplicationThicknessSizeTitle"
          )}
          subTitle={t(
            "materials.applications.admin.deleteHApplicationThicknessSizeSubTitle"
          )}
        />
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.applications.admin.enterCode")}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.updateState[applicationSize?.id]
                  ?.code
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.onChangeUpdateStateApplicationThickness(
                  applicationSize?.id,
                  "code",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.defaultPricePerSquareMeter")}
            </div>
            <GomakeTextInput
              placeholder={t(
                "materials.applications.admin.enterDefaultPricePerSquareMeter"
              )}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.updateState[applicationSize?.id]
                  ?.defaultPricePerSquareMeter
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.onChangeUpdateStateApplicationThickness(
                  applicationSize?.id,
                  "defaultPricePerSquareMeter",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.height")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.applications.admin.enterHeight")}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.updateState[applicationSize?.id]
                  ?.height
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.onChangeUpdateStateApplicationThickness(
                  applicationSize?.id,
                  "height",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.name")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.applications.admin.enterName")}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.updateState[applicationSize?.id]
                  ?.name
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.onChangeUpdateStateApplicationThickness(
                  applicationSize?.id,
                  "name",
                  e.target.value
                );
              }}
            />
          </div>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.width")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.applications.admin.enterWidth")}
              style={clasess.textInputStyle}
              value={
                materialApplicationsStateValue?.updateState[applicationSize?.id]
                  ?.width
              }
              onChange={(e: any) => {
                materialApplicationsStateValue?.onChangeUpdateStateApplicationThickness(
                  applicationSize?.id,
                  "width",
                  e.target.value
                );
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export { ApplicationSizeesMapping };
