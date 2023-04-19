import { useTranslation } from "react-i18next";

import { GoMakeModal, GomakeTextInput } from "@/components";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Tooltip } from "@mui/material";

import { SheetWeightsMapping } from "./sheet-weight-mapping";
import { useStyle } from "./style";

const AddSheetModal = ({
  openModal,
  onCloseModal,
  changeItems,
  setItems,
  items,
}: any) => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("materials.sheetPaper.admin.addNewSheet")}
        onClose={onCloseModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.firstSectionContainer}>
          <div>
            <div style={clasess.lableTextStyle}>
              {t("materials.sheetPaper.admin.categoryName")}
            </div>
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.categoryName")}
              style={clasess.textInputStyle}
            />
          </div>
        </div>
        <div style={clasess.secondSectionContainer}>
          <div style={clasess.titlePlusContainer}>
            <div style={clasess.firstSectionTitleStyle}>
              {t("materials.sheetPaper.admin.sheetWeightsSection")}
            </div>
            <Tooltip title={t("materials.sheetPaper.admin.addSheetWeight")}>
              <IconButton
                onClick={() => {
                  const temp = [...items];
                  temp.push({
                    weight: "",
                    name: "",
                    thickness: "",
                    index: "",
                  });
                  setItems(temp);
                }}
              >
                <AddIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title={t("materials.sheetPaper.admin.removeSheetWeight")}>
              <IconButton
                onClick={() => {
                  const temp = [...items];
                  temp.pop();
                  setItems(temp);
                }}
              >
                <RemoveIcon />
              </IconButton>
            </Tooltip>
          </div>
          {items?.map((item: any, index: number) => {
            return (
              <SheetWeightsMapping
                index={index}
                items={items}
                changeItems={changeItems}
              />
            );
          })}
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddSheetModal };
