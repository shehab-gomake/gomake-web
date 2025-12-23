import Stack from "@mui/material/Stack";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { IconButton } from "@mui/material";
import { IOutput } from "@/widgets/product-pricing-widget/interface";
import { useEffect, useState, useMemo } from "react";
import { EditIcon } from "@/icons";
import { GoMakeAutoComplate } from "@/components";
import { useTranslation } from "react-i18next";

interface IBooleanOutputComponentProps extends IOutput {
  changeWorkFlowOutputDTO?: Array<{ Value: string; orginalName: string }>;
  setChangeWorkFlowOutputDTO?: (
    changeWorkFlowOutputDTO: Array<{ Value: string; orginalName: string }>
  ) => void;
}

const BooleanOutputComponent = ({
  name,
  id,
  values,
  orginalName,
  changeWorkFlowOutputDTO,
  setChangeWorkFlowOutputDTO,
  isEditable,
}: IBooleanOutputComponentProps) => {
  const { classes } = useStyle();
  const { t } = useTranslation();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<any>(null);

  const yesNoOptions = useMemo(
    () => [
      { id: "true", label: t("modal.yes") },
      { id: "false", label: t("modal.no") },
    ],
    [t]
  );

  useEffect(() => {
    // Check if value is in changeWorkFlowOutputDTO first (most recent)
    const dtoValue = changeWorkFlowOutputDTO?.find(
      (item) => item?.orginalName === orginalName
    )?.Value;

    let valueToCheck = dtoValue;
    if (!valueToCheck && values && values.length > 0) {
      valueToCheck = values[0];
    }

    if (valueToCheck) {
      const valueStr = String(valueToCheck).toLowerCase();
      if (valueStr === "true" || valueStr === "yes" || valueStr === "1") {
        setSelectedValue(yesNoOptions[0]);
      } else if (valueStr === "false" || valueStr === "no" || valueStr === "0") {
        setSelectedValue(yesNoOptions[1]);
      } else {
        setSelectedValue(null);
      }
    } else {
      setSelectedValue(null);
    }
  }, [values, changeWorkFlowOutputDTO, orginalName, yesNoOptions]);

  const handleEditClick = () => {
    if (isEditable) {
      setIsEditing(true);
    }
  };

  const handleValueChange = (newValue: any) => {
    if (!newValue) return;

    setSelectedValue(newValue);
    const booleanValue = newValue?.id === "true" ? "true" : "false";

    const currentDTO = changeWorkFlowOutputDTO || [];
    const existingItemIndex = currentDTO.findIndex(
      (item) => item?.orginalName === orginalName
    );

    let newChangeWorkFlowOutputDTO;
    if (existingItemIndex >= 0) {
      newChangeWorkFlowOutputDTO = currentDTO.map((item, index) =>
        index === existingItemIndex
          ? { ...item, Value: booleanValue, orginalName: orginalName }
          : item
      );
    } else {
      newChangeWorkFlowOutputDTO = [
        ...currentDTO,
        { Value: booleanValue, orginalName: orginalName },
      ];
    }

    setChangeWorkFlowOutputDTO?.(newChangeWorkFlowOutputDTO);
    setIsEditing(false);
  };

  const displayValue = selectedValue?.label || "";

  return (
    <Stack direction={"row"} gap={"10px"} alignItems={"center"} padding={"0px 10px"}>
      <span style={classes.detailTitle}>{name}</span>
      {isEditing && isEditable ? (
        <GoMakeAutoComplate
          value={selectedValue}
          onChange={(e, newValue) => {
            if (newValue) {
              handleValueChange(newValue);
            }
          }}
          options={yesNoOptions}
          getOptionLabel={(option) => option?.label || ""}
          style={{ width: "120px", height: "40px" }}
          disableClearable={false}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
        />
      ) : (
        <>
          <span style={classes.detailValue}>{displayValue}</span>
          {isEditable && (
            <IconButton onClick={handleEditClick} size="small">
              <EditIcon />
            </IconButton>
          )}
        </>
      )}
    </Stack>
  );
};

export { BooleanOutputComponent };

