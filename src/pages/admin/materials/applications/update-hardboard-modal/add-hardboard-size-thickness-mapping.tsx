import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { GomakePrimaryButton } from "@/components";

import { materialApplicationsState } from "../store/applications";
import { useStyle } from "./style";
import { AddAplicationSizesMapping } from "./add-application-size-mapping";

const AddApplicationThicknessSizeMapping = ({
  index,
  selectedItem,
  applicationSize,
}) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialApplicationsStateValue = useRecoilValue<any>(
    materialApplicationsState
  );

  return (
    <>
      <div style={clasess.tableSecondSections}>
        {materialApplicationsStateValue?.items[index]["applicationSizes"]?.map(
          (item: any, index2: number) => {
            return (
              <AddAplicationSizesMapping
                key={`AddAplicationSizesMapping_${index2}`}
                index={index2}
                applicationThicknessIndex={index}
                applicationSize={
                  materialApplicationsStateValue?.items[index][
                    "applicationSizes"
                  ]
                }
              />
            );
          }
        )}
        <div style={clasess.btnsWightSheetContainer}>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialApplicationsStateValue?.isAddNeApplicationThicknessSize(
                  false
                )
              }
              style={clasess.cancelBtnStyle}
            >
              {t("materials.applications.admin.cancel")}
            </GomakePrimaryButton>
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={() =>
                materialApplicationsStateValue?.addNewApplicationThicknesSizeByCategoryName(
                  selectedItem?.categoryName,
                  applicationSize?.id
                )
              }
              style={clasess.addBtnStyle}
            >
              {t("materials.applications.admin.save")}
            </GomakePrimaryButton>
          </div>
        </div>
      </div>
    </>
  );
};
export { AddApplicationThicknessSizeMapping };
