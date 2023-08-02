import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialApplicationsState } from "../store/applications";
import { useStyle } from "./style";

const AddAplicationSizesMapping = ({
  index,
  applicationThicknessIndex,
  applicationSize,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
  );
  return (
    <>
      {applicationSize?.length > 0 && (
        <>
          <div key={index} style={clasess.addSizesInputsSecondSelection}>
            <div style={clasess.inputSizesContainer}>
              <div>
                <div style={clasess.lableTextStyle}>Code</div>
                <GomakeTextInput
                  placeholder="Code"
                  style={clasess.textInputStyle}
                  value={applicationSize[index]["code"]}
                  onChange={(e: any) => {
                    materialApplicationsStateValue?.changeItemsApplicationThickness(
                      applicationThicknessIndex,
                      index,
                      "code",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>
                  Default price per square meter
                </div>
                <GomakeTextInput
                  placeholder="Default price per square meter"
                  style={clasess.textInputStyle}
                  value={applicationSize[index]["defaultPricePerSquareMeter"]}
                  onChange={(e: any) => {
                    materialApplicationsStateValue?.changeItemsApplicationThickness(
                      applicationThicknessIndex,
                      index,
                      "defaultPricePerSquareMeter",
                      e.target.value
                    );
                  }}
                />
              </div>

              <div>
                <div style={clasess.lableTextStyle}>Name</div>
                <GomakeTextInput
                  placeholder="Name"
                  style={clasess.textInputStyle}
                  value={applicationSize[index]["name"]}
                  onChange={(e: any) => {
                    materialApplicationsStateValue?.changeItemsApplicationThickness(
                      applicationThicknessIndex,
                      index,
                      "name",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>Width (cm)</div>
                <GomakeTextInput
                  placeholder="Width"
                  style={clasess.textInputStyle}
                  value={applicationSize[index]["width"]}
                  onChange={(e: any) => {
                    materialApplicationsStateValue?.changeItemsApplicationThickness(
                      applicationThicknessIndex,
                      index,
                      "width",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>Height (m)</div>
                <GomakeTextInput
                  placeholder="Height"
                  style={clasess.textInputStyle}
                  value={applicationSize[index]["height"]}
                  onChange={(e: any) => {
                    materialApplicationsStateValue?.changeItemsApplicationThickness(
                      applicationThicknessIndex,
                      index,
                      "height",
                      e.target.value
                    );
                  }}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export { AddAplicationSizesMapping };
