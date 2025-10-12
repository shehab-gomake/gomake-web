import { GomakeTextInput } from "@/components";
import { GoMakeDialog } from "@/components/dialog/go-make-dialog";
import { useAddMaterialCategory } from "./use-add-material-category";
import { FormControlLabel, MenuItem, Stack, TextField } from "@mui/material";
import { ImageUploadComponent } from "@/components/form-inputs/image-input";
import { PrimaryCheckbox } from "@/components/check-box/primary-check-box";
import { useStyle } from "./style";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";

interface IAddCategoryModalProps {
  isAdmin: boolean;
}

export enum EAttributeType {
  Text = 0,
  Number = 1,
  Boolean = 2,
  PriceObject = 3,
  TranslatedText = 4,
  Enum = 5,
  SelectFixedValues = 6,
  Image = 7,
  MachinesList = 8,
  ClientsList = 9,
  ProductSelect = 10,
  MachineCategorySelect = 11,
  MultiSelect = 12,
  FromParameters = 13,
}

const AddCategoryModal = (props: IAddCategoryModalProps) => {
  const { classes } = useStyle();
  const { primaryColor } = useGomakeTheme();
  const {
    openModal,
    editCategoryModalState,
    duplicateCategoryModalState,
    selectedCategoryModal,
    newCategory,
    setOpenModal,
    onAddCategory,
    onSetCategory,
    setEditCategoryModalState,
    setDuplicateCategoryModalState,
    setSelectedCategoryModal,
    uploadPrintHouseMaterialImage,
    t,
    imgUrl,
    setSelectedImgForAdded,
    materialTypeTable,
    updatePrintHouseMaterialCategoryName,
    duplicatePrintHouseMaterialCategoryName,
    handleAttributeChange,
    setAttributeValues,
    attributeValues,
    additionalAttributes,
  } = useAddMaterialCategory(props.isAdmin);

  const actionLabel = duplicateCategoryModalState
    ? t("navigationButtons.duplicate")
    : editCategoryModalState
      ? t("materials.buttons.edit")
      : t("materials.buttons.addNew");

  const actionHandler = duplicateCategoryModalState
    ? duplicatePrintHouseMaterialCategoryName
    : editCategoryModalState
      ? updatePrintHouseMaterialCategoryName
      : onAddCategory;

  const modalTitle = duplicateCategoryModalState
    ? t("navigationButtons.duplicate")
    : editCategoryModalState
      ? t("materials.buttons.edit")
      : t("materials.buttons.addNew");

  const handleClose = () => {
    setEditCategoryModalState(false);
    setDuplicateCategoryModalState(false);
    setSelectedCategoryModal({});
    setOpenModal(false);
    setAttributeValues({});
  };

  return (
    <GoMakeDialog
      open={openModal}
      onClose={handleClose}
      title={modalTitle}
      onPrimaryAction={actionHandler}
      primaryButtonLabel={actionLabel}
      maxWidth="sm"
      fullWidth
      customStyles={{
        paper: { width: 400 },
      }}
    >
      <Stack
        gap={5}
        justifyContent={"flex-start"}
        width={"100%"}
        paddingTop={"10px"}
      >
        <GomakeTextInput
          value={newCategory}
          onChange={onSetCategory}
          placeholder={t("materials.inputs.addCategory")}
          style={{ width: "100%", height: "40px" }}
        />

        {!duplicateCategoryModalState &&
          additionalAttributes?.map((attr, index) => {
            const value = attr?.defaultValue ?? "";
            const isRequired = attr?.isRequired;
            const label = t(`materials.attributes.${attr?.name}`);
            const key = `${attr.name}-${index}`;

            switch (attr.type) {
              case EAttributeType.SelectFixedValues:
              case EAttributeType.Enum:
              case EAttributeType.MultiSelect:
                return (
                  <TextField
                    key={key}
                    select
                    label={label}
                    // required={isRequired}
                    fullWidth
                    defaultValue={value}
                    SelectProps={{
                      multiple: attr.type === EAttributeType.MultiSelect,
                    }}
                    value={
                      attributeValues[attr.name] ??
                      (editCategoryModalState ? value : "")
                    }
                    onChange={(e) =>
                      handleAttributeChange(attr.name, e.target.value)
                    }
                    sx={{
                      ...classes.inputContainer,
                      "& label": {
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: "12px",
                        backgroundColor: "white",
                        padding: "0 4px",
                        color: !(
                          attributeValues[attr.name] ??
                          (editCategoryModalState ? value : "")
                        )
                          ? undefined
                          : primaryColor(500),
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  >
                    {attr.values?.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                );
              case EAttributeType.Boolean:
                return (
                  <FormControlLabel
                    key={key}
                    control={
                      <PrimaryCheckbox
                        // defaultChecked={value}
                        checked={
                          attributeValues[attr.name] ??
                          (editCategoryModalState ? value : false)
                        }
                        onChange={(e) =>
                          handleAttributeChange(attr.name, e.target.checked)
                        }
                      />
                    }
                    label={label}
                  />
                );
              case EAttributeType.Number:
                return (
                  <TextField
                    key={key}
                    label={label}
                    // required={isRequired}
                    fullWidth
                    type="number"
                    defaultValue={value}
                    value={
                      attributeValues[attr.name] ??
                      (editCategoryModalState ? value : "")
                    }
                    onChange={(e) =>
                      handleAttributeChange(
                        attr.name,
                        parseFloat(e.target.value)
                      )
                    }
                    sx={{
                      ...classes.inputContainer,
                      "& label": {
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: "12px",
                        backgroundColor: "white",
                        padding: "0 4px",
                        color: !(
                          attributeValues[attr.name] ??
                          (editCategoryModalState ? value : "")
                        )
                          ? undefined
                          : primaryColor(500),
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  />
                );
              default:
                return (
                  <TextField
                    key={key}
                    label={label}
                    // required={isRequired}
                    fullWidth
                    defaultValue={value}
                    value={
                      attributeValues[attr.name] ??
                      (editCategoryModalState ? value : "")
                    }
                    onChange={(e) =>
                      handleAttributeChange(attr.name, e.target.value)
                    }
                    sx={{
                      ...classes.inputContainer,
                      "& label": {
                        top: "50%",
                        transform: "translateY(-50%)",
                        left: "12px",
                        backgroundColor: "white",
                        padding: "0 4px",
                        color: !(
                          attributeValues[attr.name] ??
                          (editCategoryModalState ? value : "")
                        )
                          ? undefined
                          : primaryColor(500),
                        transition: "all 0.2s ease-in-out",
                      },
                    }}
                  />
                );
            }
          })}

        {(editCategoryModalState
          ? selectedCategoryModal?.isCanUploadImage
          : materialTypeTable?.isCanUploadImage) && (
            <ImageUploadComponent
              onChange={(value) =>
                editCategoryModalState
                  ? uploadPrintHouseMaterialImage(value)
                  : setSelectedImgForAdded(value)
              }
              value={imgUrl}
            />
          )}
      </Stack>
    </GoMakeDialog>
  );
};

export { AddCategoryModal };
