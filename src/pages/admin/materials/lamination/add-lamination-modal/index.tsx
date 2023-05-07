import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Tooltip } from "@mui/material";
import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";

import { SheetWeightsMapping } from "./lamination-size-mapping";
import { materialSheetsState } from "../store/lamination";
import { useStyle } from "./style";

const AddSheetModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const materialSheetsStateValue = useRecoilValue<any>(materialSheetsState);

  return (
    <>
      <GoMakeModal
        openModal={materialSheetsStateValue?.openAddSheetModal}
        modalTitle={t("materials.lamination.admin.addNewLamination")}
        onClose={materialSheetsStateValue?.onCloseModalAdded}
        insideStyle={clasess.insideStyle}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={clasess.firstSectionContainer}>
            <div>
              <div style={clasess.lableTextStyle}>
                {t("materials.sheetPaper.admin.categoryName")}
              </div>
              <GomakeTextInput
                placeholder={t("materials.sheetPaper.admin.categoryName")}
                style={clasess.textInputStyle}
                value={materialSheetsStateValue?.categoryName}
                onChange={(e: any) => {
                  materialSheetsStateValue?.setCategoryName(e.target.value);
                }}
              />
            </div>
          </div>
          <div style={clasess.secondSectionContainer}>
            <div style={clasess.titlePlusContainer}>
              <div style={clasess.firstSectionTitleStyle}>
                {t("materials.lamination.admin.laminationSizesSection")}
              </div>
              <Tooltip
                title={t("materials.lamination.admin.addNewLaminationSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialSheetsStateValue?.items];
                    temp.push({
                      code: "",
                      width: "",
                      height: "",
                      name: "",
                      laminationThicknesses: [
                        {
                          code: "",
                          thickness: "",
                          defaultPrice: "",
                          coldOrHot: "",
                        },
                      ],
                      fitToPrintType: [],
                    });
                    materialSheetsStateValue?.setItems(temp);
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={t("materials.lamination.admin.removeLaminationSize")}
              >
                <IconButton
                  onClick={() => {
                    const temp = [...materialSheetsStateValue?.items];
                    temp.pop();
                    materialSheetsStateValue?.setItems(temp);
                  }}
                >
                  <RemoveIcon />
                </IconButton>
              </Tooltip>
            </div>
            {materialSheetsStateValue?.items?.map(
              (item: any, index: number) => {
                return (
                  <SheetWeightsMapping
                    key={`SheetWeightsMapping_${index}`}
                    index={index}
                  />
                );
              }
            )}
          </div>
          <div style={clasess.addSheetBtnContainer}>
            <GomakePrimaryButton
              onClick={materialSheetsStateValue?.addNewSupplierSheet}
            >
              {t("materials.lamination.admin.addNewLamination")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddSheetModal };
