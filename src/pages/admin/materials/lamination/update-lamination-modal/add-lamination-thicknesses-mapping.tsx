import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakeTextInput } from "@/components";

import { materialLaminationsState } from "../store/lamination";
import { useStyle } from "./style";

const AddLaminationThicknessMapping = ({
  index,
  laminationSizeIndex,
  laminationThickness,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialLaminationsStateValue = useRecoilValue<any>(
    materialLaminationsState
  );
  return (
    <>
      {laminationThickness?.length > 0 && (
        <>
          <div key={index} style={clasess.addSizesInputsSecondSelection}>
            <div style={clasess.inputSizesContainer}>
              <div>
                <div style={clasess.lableTextStyle}>code</div>
                <GomakeTextInput
                  placeholder="code"
                  style={clasess.textInputStyle}
                  value={laminationThickness[index]["code"]}
                  onChange={(e: any) => {
                    materialLaminationsStateValue?.changeItemsSheetSize(
                      laminationSizeIndex,
                      index,
                      "code",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>coldOrHot</div>
                <GomakeTextInput
                  placeholder="coldOrHot"
                  style={clasess.textInputStyle}
                  value={laminationThickness[index]["coldOrHot"]}
                  onChange={(e: any) => {
                    materialLaminationsStateValue?.changeItemsSheetSize(
                      laminationSizeIndex,
                      index,
                      "coldOrHot",
                      e.target.value
                    );
                  }}
                />
              </div>
              <div>
                <div style={clasess.lableTextStyle}>defaultPrice</div>
                <GomakeTextInput
                  placeholder="defaultPrice"
                  style={clasess.textInputStyle}
                  value={laminationThickness[index]["defaultPrice"]}
                  onChange={(e: any) => {
                    materialLaminationsStateValue?.changeItemsSheetSize(
                      laminationSizeIndex,
                      index,
                      "defaultPrice",
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
                  value={laminationThickness[index]["thickness"]}
                  onChange={(e: any) => {
                    materialLaminationsStateValue?.changeItemsSheetSize(
                      laminationSizeIndex,
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
export { AddLaminationThicknessMapping };
