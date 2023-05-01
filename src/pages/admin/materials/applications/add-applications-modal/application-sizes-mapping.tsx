import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialApplicationsState } from "../store/applications";
import { useStyle } from "./style";

const ApplicationSizesMapping = ({
  index,
  applicationThickness,
  applicationsize,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
  );

  return (
    <>
      <div key={index} style={clasess.addSizesInputsSecondSelection}>
        <div style={clasess.inputSizesContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.applications.admin.code")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.applications.admin.enterCode")}
              style={clasess.textInputStyle}
              value={applicationsize[index]["code"]}
              onChange={(e: any) => {
                materialApplicationsStateValue?.changeItemsApplicationThickness(
                  applicationThickness,
                  index,
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
              value={applicationsize[index]["defaultPricePerSquareMeter"]}
              onChange={(e: any) => {
                materialApplicationsStateValue?.changeItemsApplicationThickness(
                  applicationThickness,
                  index,
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
              value={applicationsize[index]["height"]}
              onChange={(e: any) => {
                materialApplicationsStateValue?.changeItemsApplicationThickness(
                  applicationThickness,
                  index,
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
              value={applicationsize[index]["name"]}
              onChange={(e: any) => {
                materialApplicationsStateValue?.changeItemsApplicationThickness(
                  applicationThickness,
                  index,
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
              value={applicationsize[index]["width"]}
              onChange={(e: any) => {
                materialApplicationsStateValue?.changeItemsApplicationThickness(
                  applicationThickness,
                  index,
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
export { ApplicationSizesMapping };
