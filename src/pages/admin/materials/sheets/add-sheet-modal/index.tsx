import { GoMakeModal, GomakeTextInput } from "@/components";
import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { IconButton } from "@mui/material";
const AddSheetModal = ({
  openModal,
  onCloseModal,
  changeItems,
  setItems,
  items,
}: any) => {
  console.log("item", items);
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
            <GomakeTextInput
              placeholder={t("materials.sheetPaper.admin.categoryName")}
              style={clasess.textInputStyle}
            />
          </div>
        </div>
        <div style={clasess.secondSectionContainer}>
          <div style={clasess.titlePlusContainer}>
            <div style={clasess.firstSectionTitleStyle}>
              Sheet Weights Section
            </div>
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
            <IconButton
              onClick={() => {
                const temp = [...items];
                temp.pop();
                setItems(temp);
              }}
            >
              <RemoveIcon />
            </IconButton>
          </div>
          {items?.map((item: any, index: number) => {
            return (
              <div
                style={
                  index & 1
                    ? clasess.tableSecondSections
                    : clasess.tableSections
                }
              >
                <div>
                  <div style={clasess.lableTextStyle}>Weight</div>
                  <GomakeTextInput
                    placeholder="Enter Weight"
                    style={clasess.textInputStyle}
                    value={items[index]["weight"]}
                    onChange={(e: any) => {
                      changeItems(index, "weight", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <div style={clasess.lableTextStyle}>Name</div>
                  <GomakeTextInput
                    placeholder="Enter Name"
                    style={clasess.textInputStyle}
                    value={items[index]["name"]}
                    onChange={(e: any) => {
                      changeItems(index, "name", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <div style={clasess.lableTextStyle}>Thickness</div>
                  <GomakeTextInput
                    placeholder="Enter Thickness"
                    style={clasess.textInputStyle}
                    value={items[index]["thickness"]}
                    onChange={(e: any) => {
                      changeItems(index, "thickness", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <div style={clasess.lableTextStyle}>Index</div>
                  <GomakeTextInput
                    placeholder="Enter Index"
                    style={clasess.textInputStyle}
                    value={items[index]["index"]}
                    onChange={(e: any) => {
                      changeItems(index, "index", e.target.value);
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddSheetModal };
