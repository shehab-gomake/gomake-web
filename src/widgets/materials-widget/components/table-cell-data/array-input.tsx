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
import { ModalType } from "@/enums";
import { DotsLoader } from "@/components/dots-loader/dots-Loader";
import { useSnackBar } from "@/hooks";

const ArrayInput = ({ valueArray, isEditable, parameterKey, id, isAdmin, isInventoryTable, isPurchasePricingTable }: IRowData) => {
  const { classes } = useStyle();
  const [isUpdate, setIsUpdate] = useState<number | null>(null);
  const [updateValue, setUpdateValue] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const materialSuppliers = useRecoilValue(materialCategorySuppliersState)
  const isHaveMorethanMaterialSuppliers = materialSuppliers?.length > 1
  const { t } = useTranslation();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();

  const [openDeleteTableRowModal, setOpenDeleteTableRowModal] = useState<boolean>(false);

  const onClickCloseDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(false);
  };

  const onClickOpenDeleteTableRowModal = () => {
    setOpenDeleteTableRowModal(true);
  };

  const { updateCellData, } = useTableCellData(isAdmin, isInventoryTable, isPurchasePricingTable);
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
      setIsLoading(true);

      try {
        if (isInventoryTable) {
          // Determine pricingType based on the parameter key for inventory
          let pricingType = 1; // Default to PurchasePrice
          if (parameterKey.includes('sale') || parameterKey.toLowerCase().includes('sale')) {
            pricingType = 2; // SalesPrice
          }

          await updateCellData(id, parameterKey?.split(' ! ')[0], updateValue, isUpdate, pricingType);
          setIsUpdate(null);
        } else {
          // Use original logic for main table
          if (isHaveMorethanMaterialSuppliers && !parameterKey.includes("price")) {
            setIsLoading(false);
            onClickOpenDeleteTableRowModal()
          } else {
            await updateCellData(id, parameterKey?.split(' ! ')[0], updateValue, isUpdate);
            setIsUpdate(null);
            alertSuccessUpdate();
          }
        }
      } catch (error) {
        alertFaultUpdate();
      } finally {
        setIsLoading(false);
      }
    } else {
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
        {isLoading ? (
          <DotsLoader />
        ) : (
          valueArray?.flatMap((value, index, array) => {
            if (index < array.length - 1) {
              return [
                isUpdate === index ? (
                  isLoading ? (
                    <DotsLoader />
                  ) : (
                    <UpdateValueInput
                      clickedOut={() => onBlur()?.then()}
                      onInputChange={onInputChange}
                      onCancel={() => setIsUpdate(null)}
                      onUpdate={() => onBlur()?.then()}
                      value={updateValue}
                    />
                  )
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
                  isLoading ? (
                    <DotsLoader />
                  ) : (
                    <UpdateValueInput
                      clickedOut={onBlur}
                      onInputChange={onInputChange}
                      onUpdate={onBlur}
                      onCancel={() => setIsUpdate(null)}
                      value={updateValue}
                    />
                  )
                ) : (
                  <PrimaryButton
                    sx={classes.clickableData}
                    onClick={() => onClick(index)}
                    variant={"text"}
                    style={{ minWidth: "max-content" }}
                  >
                    {value}
                  </PrimaryButton>
                ),
              ];
            }
          })
        )}
      </Stack>
      <GoMakeDeleteModal
        modalType={ModalType.EDIT}
        openModal={openDeleteTableRowModal}
        onClose={onClickCloseDeleteTableRowModal}
        hideIcon
        title={t("materials.modals.updateModalTitle")}
        yesBtn={t("documentingSettings.update")}
        onClickDelete={async () => {
          setIsLoading(true);

          try {
            if (isInventoryTable) {
              // Determine pricingType based on the parameter key for inventory
              let pricingType = 1; // Default to PurchasePrice
              if (parameterKey.includes('sale') || parameterKey.toLowerCase().includes('sale')) {
                pricingType = 2; // SalesPrice
              }

              await updateCellData(id, "price Unit / ton", updateValue, isUpdate, pricingType);
            } else {
              await updateCellData(id, parameterKey, updateValue, isUpdate);
            }
            setIsUpdate(null);
            alertSuccessUpdate();
          } catch (error) {
            alertFaultUpdate();
            console.error("Error updating array input:", error);
          } finally {
            setIsLoading(false);
          }
        }}
      />


    </>

  );
};

export { ArrayInput };
