import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialHardboardsState } from "../store/hardboards";
import { useStyle } from "./style";

const AddHardboardThicknessMapping = ({
  index,
  hardboardSizeIndex,
  hardboardThickness,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialHardboardsStateValue = useRecoilValue<any>(
    materialHardboardsState
  );
  return (
    <>
      {hardboardThickness?.length > 0 && (
        <>
          <div key={index} style={clasess.addSizesInputsSecondSelection}>
            <div style={clasess.inputSizesContainer}>
              <div>
                <div style={clasess.lableTextStyle}>code</div>
                <GomakeTextInput
                  placeholder="code"
                  style={clasess.textInputStyle}
                  value={hardboardThickness[index]["code"]}
                  onChange={(e: any) => {
                    materialHardboardsStateValue?.changeItemsHardboardnSize(
                      hardboardSizeIndex,
                      index,
                      "code",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>
                  defaultPricePerSquareMeter
                </div>
                <GomakeTextInput
                  placeholder="defaultPricePerSquareMeter"
                  style={clasess.textInputStyle}
                  value={
                    hardboardThickness[index]["defaultPricePerSquareMeter"]
                  }
                  onChange={(e: any) => {
                    materialHardboardsStateValue?.changeItemsHardboardnSize(
                      hardboardSizeIndex,
                      index,
                      "defaultPricePerSquareMeter",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>index</div>
                <GomakeTextInput
                  placeholder="index"
                  style={clasess.textInputStyle}
                  value={hardboardThickness[index]["index"]}
                  onChange={(e: any) => {
                    materialHardboardsStateValue?.changeItemsHardboardnSize(
                      hardboardSizeIndex,
                      index,
                      "index",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>name</div>
                <GomakeTextInput
                  placeholder="name"
                  style={clasess.textInputStyle}
                  value={hardboardThickness[index]["name"]}
                  onChange={(e: any) => {
                    materialHardboardsStateValue?.changeItemsHardboardnSize(
                      hardboardSizeIndex,
                      index,
                      "name",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>thickness</div>
                <GomakeTextInput
                  placeholder="thickness"
                  style={clasess.textInputStyle}
                  value={hardboardThickness[index]["thickness"]}
                  onChange={(e: any) => {
                    materialHardboardsStateValue?.changeItemsHardboardnSize(
                      hardboardSizeIndex,
                      index,
                      "thickness",
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
export { AddHardboardThicknessMapping };
