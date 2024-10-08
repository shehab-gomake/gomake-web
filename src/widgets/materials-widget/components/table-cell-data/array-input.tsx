import { IRowData } from "@/widgets/materials-widget/interface";
import { useState } from "react";
import Stack from "@mui/material/Stack";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "@/widgets/materials-widget/style";
import { useRecoilValue } from "recoil";
import { materialCategorySuppliersState } from "../../state";
import { GoMakeDeleteModal } from "@/components";
import { useTranslation } from "react-i18next";

const ArrayInput = ({ valueArray, isEditable, parameterKey, id, isAdmin }: IRowData) => {
  const { classes } = useStyle();
  const [isUpdate, setIsUpdate] = useState<number | null>(null);
  const [updateValue, setUpdateValue] = useState("");
  const materialSuppliers = useRecoilValue(materialCategorySuppliersState)
  const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1
  const { t } = useTranslation();

  const [openDeleteTableRowModal, setOpenDeleteTableRowModal] = useState<boolean>(false);
  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
  };

  const onClickOpenDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(true);
  };
  const { updateCellData } = useTableCellData(isAdmin);
  const onClick = (index) => {
    if (isEditable) {
      setIsUpdate(index);
      setUpdateValue(valueArray[index]);
    }
  };

  const onInputChange = (v: string) => {
    setUpdateValue(v);
  };

  const onBlur = async () => {
    if (updateValue !== valueArray[isUpdate]) {
      if (isHaveMorethanMaterialSuppliers) {
        onClickOpenDeleteTableRowModal()
      }
      else {
        await updateCellData(id, parameterKey, updateValue, isUpdate);
        setIsUpdate(null);
      }
    }
    else {
      setIsUpdate(null);
    }

  };
  return (
    <>
      <Stack
        direction={"row"}
        justifyContent={"center"}
        gap={"2px"}
        alignItems={"center"}
      >
        {valueArray?.flatMap((value, index, array) => {
          if (index < array.length - 1) {
            return [
              isUpdate === index ? (
                <UpdateValueInput
                  clickedOut={() => onBlur().then()}
                  onInputChange={onInputChange}
                  onCancel={() => setIsUpdate(null)}
                  onUpdate={() => onBlur().then()}
                  value={updateValue}
                />
              ) : (
                <PrimaryButton
                  sx={classes.clickableData}
                  onClick={() => onClick(index)}
                  variant={"text"}
                >
                  {value}
                </PrimaryButton>
              ),
              <span>/</span>,
            ];
          } else {
            return [
              isUpdate === index ? (
                <UpdateValueInput
                  clickedOut={onBlur}
                  onInputChange={onInputChange}
                  onUpdate={onBlur}
                  onCancel={() => setIsUpdate(null)}
                  value={updateValue}
                />
              ) : (
                <PrimaryButton
                  sx={classes.clickableData}
                  onClick={() => onClick(index)}
                  variant={"text"}
                >
                  {value}
                </PrimaryButton>
              ),
            ];
          }
        })}
      </Stack>
      <GoMakeDeleteModal
        openModal={openDeleteTableRowModal}
        onClose={onClickCloseDeleteTableRowModal}
        hideIcon
        title="Updating this row will effect the material for other suppliers"
        yesBtn={t("documentingSettings.update")}
        onClickDelete={async () => {
          await updateCellData(id, parameterKey, updateValue, isUpdate);
          setIsUpdate(null);
        }}
      />
    </>

  );
};

export { ArrayInput };
