import Stack from "@mui/material/Stack";
import { useStyle } from "@/widgets/product-pricing-widget/style";
import { Divider, IconButton } from "@mui/material";
import { IOutput } from "@/widgets/product-pricing-widget/interface";
import { useEffect, useState } from "react";
import { UpdateValueInput } from "@/components/text-input/update-value-input";
import Button from "@mui/material/Button";
import {
  EWorkSource,
  HtmlElementType,
} from "@/widgets/product-pricing-widget/enums";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import { Permissions } from "@/components/CheckPermission/enum";
import { EditIcon, PlusIcon } from "@/icons";
import { NotesForActionModal } from "./notes-for-action-modal";
import {
  updateBoardMissionActionOutputApi,
  updateProductItemDraftActionData,
  updateProductItemValueOutsourceSupplierCost,
} from "@/services/api-service/product-item-value-draft/product-item-draft-endpoints";
import { useGomakeAxios } from "@/hooks";
import { useRecoilValue } from "recoil";
import { currentCalculationConnectionId, permissionsState } from "@/store";
import { removeTags } from "@/utils/helpers";
import { EOutSoucrceUpdateKey } from "@/enums";
import { formatValueWithUnit, isCurrency } from "@/utils/is-currency";

interface IKeyValueViewProps extends IOutput {
  valueColor?: string;
  key?: string;
  onUpdate?: (v: string) => void;
  source?: EWorkSource;
}

interface IParametersMappingProps {
  parameters: IKeyValueViewProps[];
  source?: EWorkSource;
  isWorkFlows?: boolean;
  isProductionFloor?: boolean;
  changeWorkFlowOutputDTO?: [{ Value: string; orginalName: string }];
  setChangeWorkFlowOutputDTO?: (
    changeWorkFlowOutputDTO: [{ Value: string; orginalName: string }]
  ) => void;
}

const ParametersMapping = ({
  parameters,
  source,
  isWorkFlows = false,
  isProductionFloor = false,
  changeWorkFlowOutputDTO,
  setChangeWorkFlowOutputDTO,
}: IParametersMappingProps) => {
  return (
    <>
      {parameters?.flatMap((parameter, index, array) => {
        const keyValueComponent = (
          <KeyValueViewComponent
            key={`key-value-${index}`}
            changeWorkFlowOutputDTO={changeWorkFlowOutputDTO}
            setChangeWorkFlowOutputDTO={setChangeWorkFlowOutputDTO}
            source={source}
            {...parameter}
          />
        );
        const isLastElement = index >= array.length - 1;
        const unitType = parameter?.unitType;
        const parameterKey = parameter?.key;
        if (isProductionFloor && unitType === 2) {
          return (
            <PermissionCheck
              userPermission={Permissions.SHOW_COSTS_IN_PRODUCTION_FLOOR}
            >
              {isLastElement
                ? keyValueComponent
                : [
                  keyValueComponent,
                  <Divider
                    key={`divider-${index}`}
                    orientation="vertical"
                    flexItem
                  />,
                ]}
            </PermissionCheck>
          );
        } else if (isWorkFlows) {
          if (parameterKey === "totalCost" || parameterKey === "profit") {
            return (
              <PermissionCheck
                userPermission={Permissions.SHOW_COSTS_IN_CALCULATIONS}
              >
                {isLastElement
                  ? keyValueComponent
                  : [
                    keyValueComponent,
                    <Divider
                      key={`divider-${index}`}
                      orientation="vertical"
                      flexItem
                    />,
                  ]}
              </PermissionCheck>
            );
          } else {
            return isLastElement
              ? keyValueComponent
              : [
                keyValueComponent,
                <Divider
                  key={`divider-${index}`}
                  orientation="vertical"
                  flexItem
                />,
              ];
          }
        } else if (unitType === 2 && !isWorkFlows) {
          return (
            <PermissionCheck
              userPermission={Permissions.SHOW_COSTS_IN_CALCULATIONS}
            >
              {isLastElement
                ? keyValueComponent
                : [
                  keyValueComponent,
                  <Divider
                    key={`divider-${index}`}
                    orientation="vertical"
                    flexItem
                  />,
                ]}
            </PermissionCheck>
          );
        } else {
          return isLastElement
            ? keyValueComponent
            : [
              keyValueComponent,
              <Divider
                key={`divider-${index}`}
                orientation="vertical"
                flexItem
              />,
            ];
        }
      })}
    </>
  );
};

const TextAreaActionsMapping = ({
  parameters,
  actionId,
  currentProductItemValue,
  productType,
  orderItemId,
  isOutSource,
  supplierId,
}: any) => {
  return (
    <>
      {parameters?.flatMap((parameter, index, array) => {
        const keyValueComponent = (
          <KeyValueViewComponent
            key={`key-value-${index}`}
            {...parameter}
            actionId={actionId}
            currentProductItemValue={currentProductItemValue}
            productType={productType}
            orderItemId={orderItemId}
            isOutSource={isOutSource}
            supplierId={supplierId}
          />
        );
        const isLastElement = index >= array.length - 1;
        return isLastElement
          ? keyValueComponent
          : [
            keyValueComponent,
            <Divider
              key={`divider-${index}`}
              orientation="vertical"
              flexItem
            />,
          ];
      })}
    </>
  );
};

const KeyValueViewComponent = ({
  name,
  id,
  values,
  valueColor,
  defaultUnit,
  outSourceValues,
  source,
  htmlElementType,
  isEditable,
  actionId,
  currentProductItemValue,
  productType,
  orderItemId,
  isOutSource,
  supplierId,
  orginalName,
  changeWorkFlowOutputDTO,
  setChangeWorkFlowOutputDTO,
}: any) => {
  const { callApi } = useGomakeAxios();
  const connectionId = useRecoilValue(currentCalculationConnectionId);

  const [value, setValue] = useState<string>("");
  const [openModal, setOpenModal] = useState<boolean>(false);
  useEffect(() => {
    if (isOutSource && outSourceValues && outSourceValues.length > 0) {
      setValue(outSourceValues[0]);
    } else {
      if (values && values.length > 0) {
        if (values.length > 1) {
          const formattedValues = values
            .map((item) => (item ? item.replace(/\s+/g, "") : "")) // Remove spaces within each item
            .join(" "); // Join items with a space between them
          setValue(formattedValues);
        } else {
          setValue(values[0]);
        }
      }
    }
  }, [values, outSourceValues]);
  const handleOnClose = () => {
    setOpenModal(false);
  };
  const handleOnOpen = () => {
    setOpenModal(true);
  };

  const onClickSaveNoteForAction = async (comment: string) => {
    if (isOutSource) {
      const callBack = (res) => {
        if (res.success) {
          setValue(comment);
          handleOnClose();
        }
      };

      await updateProductItemValueOutsourceSupplierCost(callApi, callBack, {
        productItemValueId: currentProductItemValue?.productItemValueId,
        signalRConnectionId: connectionId,
        actionId,
        supplierId,
        key: EOutSoucrceUpdateKey.Outputs,
        value: comment,
        OutputId: id,
      });
    } else {
      const callBack = (res) => {
        if (res.success) {
          setValue(comment);
          handleOnClose();
        }
      };
      await updateProductItemDraftActionData(callApi, callBack, {
        productItemValueId: currentProductItemValue?.productItemValueId,
        actionId: actionId,
        value: comment,
        fieldName: name,
        productType: productType,
        signalRConnectionId: connectionId,
        OutputId: id,
      });
    }
  };

  const onClickSaveNoteBoardMissionActionOutput = async (comment: string) => {
    const callBack = (res) => {
      if (res.success) {
        setValue(comment);
        handleOnClose();
      }
    };
    await updateBoardMissionActionOutputApi(callApi, callBack, {
      orderItemId: orderItemId,
      actionId: actionId,
      outputId: id,
      comment,
    });
  };

  const { classes } = useStyle();
  const truncateText = (text, maxLength = 30) => {
    if (text.length > 100 && htmlElementType === HtmlElementType.TEXT_AREA) {
      return `${text.substring(0, maxLength)} ......`;
    }
    return text;
  };
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>("");
  // ... existing code ...

  const handleEditClick = () => {
    setIsEditing(true);
    setEditValue(value);
  };

  const handleValueUpdate = () => {
    // When clicking the check mark (✓)
    setValue(editValue);
    setIsEditing(false);

    // Save the current value even if it wasn't changed
    const currentDTO = changeWorkFlowOutputDTO || [];
    const existingItemIndex = currentDTO.findIndex(
      (item) => item?.orginalName === orginalName
    );

    let newChangeWorkFlowOutputDTO;
    if (existingItemIndex >= 0) {
      newChangeWorkFlowOutputDTO = currentDTO.map((item, index) =>
        index === existingItemIndex
          ? { ...item, Value: editValue, orginalName: orginalName }
          : item
      );
    } else {
      newChangeWorkFlowOutputDTO = [
        ...currentDTO,
        { Value: editValue, orginalName: orginalName },
      ];
    }

    setChangeWorkFlowOutputDTO(newChangeWorkFlowOutputDTO);
  };

  const handleValueUpdateWhenClickedOut = () => {
    setIsEditing(false);

    // Only update array if value has changed
    if (editValue !== value) {
      const currentDTO = changeWorkFlowOutputDTO || [];
      const existingItemIndex = currentDTO.findIndex(
        (item) => item?.orginalName === orginalName
      );

      let newChangeWorkFlowOutputDTO;
      if (existingItemIndex >= 0) {
        newChangeWorkFlowOutputDTO = currentDTO.map((item, index) =>
          index === existingItemIndex
            ? { ...item, Value: editValue, orginalName: orginalName }
            : item
        );
      } else {
        newChangeWorkFlowOutputDTO = [
          ...currentDTO,
          { Value: editValue, orginalName: orginalName },
        ];
      }

      setChangeWorkFlowOutputDTO(newChangeWorkFlowOutputDTO);
      setValue(editValue);
    } else {
      setEditValue(value); // Reset to original value if no change
    }
  };

  const handleCancel = () => {
    // When clicking X button
    setIsEditing(false);
    setEditValue(value); // Reset to original value
    // Don't update changeWorkFlowOutputDTO
  };

  const handleInputChange = (newValue: string) => {
    // Real-time input changes
    setEditValue(newValue);

    const currentDTO = changeWorkFlowOutputDTO || [];
    const existingItemIndex = currentDTO.findIndex(
      (item) => item?.orginalName === orginalName
    );

    let newChangeWorkFlowOutputDTO;
    if (existingItemIndex >= 0) {
      newChangeWorkFlowOutputDTO = currentDTO.map((item, index) =>
        index === existingItemIndex
          ? { ...item, Value: newValue, orginalName: orginalName }
          : item
      );
    } else {
      newChangeWorkFlowOutputDTO = [
        ...currentDTO,
        { Value: newValue, orginalName: orginalName },
      ];
    }

    setChangeWorkFlowOutputDTO(newChangeWorkFlowOutputDTO);
  };

  return (
    <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
      <span style={classes.detailTitle}>{name}</span>
      {isEditing && htmlElementType !== HtmlElementType.TEXT_AREA ? (
        <UpdateValueInput
          value={editValue}
          onUpdate={handleValueUpdate}
          onInputChange={handleInputChange}
          clickedOut={handleValueUpdateWhenClickedOut}
          onCancel={handleCancel}
        />
      ) : (
        <span
          style={
            valueColor
              ? {
                ...(htmlElementType === HtmlElementType.TEXT_AREA
                  ? classes.textAreaDetailValue
                  : classes.detailValue),
                color: valueColor,
              }
              : htmlElementType === HtmlElementType.TEXT_AREA
                ? classes.textAreaDetailValue
                : classes.detailValue
          }
        >
          {formatValueWithUnit(truncateText(removeTags(value)), defaultUnit)}
        </span>
      )}

      {htmlElementType === HtmlElementType.TEXT_AREA &&
        !value &&
        isEditable && (
          <IconButton onClick={handleOnOpen}>
            <PlusIcon />
          </IconButton>
        )}
      {htmlElementType === HtmlElementType.TEXT_AREA && value && isEditable && (
        <IconButton onClick={handleOnOpen}>
          <EditIcon />
        </IconButton>
      )}
      {htmlElementType !== HtmlElementType.TEXT_AREA &&
        value &&
        isEditable &&
        !isEditing && (
          <IconButton onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        )}
      {openModal && (
        <NotesForActionModal
          openModal={openModal}
          onClose={handleOnClose}
          value={value}
          setValue={setValue}
          onSend={
            orderItemId
              ? onClickSaveNoteBoardMissionActionOutput
              : onClickSaveNoteForAction
          }
        />
      )}
    </Stack>
  );
};

const EditableKeyValueViewComponent = ({
  name,
  values,
  valueColor,
  defaultUnit,
  onUpdate,
  outSourceValues,
  source,
  orginalName,
}: IKeyValueViewProps) => {
  const permissions = useRecoilValue(permissionsState);
  const { classes } = useStyle();
  let value = "0";
  //source === EWorkSource.OUT ? !!outSourceValues && outSourceValues[0] ? outSourceValues[0] : '0' : values[0]
  if (Array.isArray(values)) {
    if (
      source === EWorkSource.OUT &&
      outSourceValues &&
      outSourceValues.length > 0
    ) {
      value = outSourceValues[0];
    } else if (values && values.length > 0) {
      value = values[0];
    }
  } else {
    value = isNaN(values) || !isFinite(values) ? "0.00" : values?.toFixed(2);
  }

  const [edit, setEdit] = useState<boolean>(false);
  const [editValue, setEditValue] = useState<string>(value);
  const handleValueClick = (e) => {
    if (permissions.includes(Permissions.UPDATE_CALCULATED_PRICE)) {
      e.stopPropagation();
      setEditValue(value);
      setEdit(true);
    }
  };

  const handleCancelUpdate = () => {
    setEdit(false);
    setEditValue(value);
  };

  const onInputChange = (v: string) => {
    setEditValue(v);
  };

  const handleValueUpdate = () => {
    onUpdate(editValue);
    setEdit(false);
  };

  return (
    <Stack
      direction={"row"}
      gap={"10px"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <span style={classes.detailTitle}>{name}</span>
      {edit ? (
        <UpdateValueInput
          value={editValue}
          onUpdate={handleValueUpdate}
          onInputChange={onInputChange}
          clickedOut={handleValueUpdate}
          onCancel={handleCancelUpdate}
        />
      ) : (
        <Button
          onClick={handleValueClick}
          variant={"text"}
          style={
            valueColor
              ? {
                ...classes.detailValue,
                color: valueColor,
              }
              : classes.detailValue
          }
        >
          {formatValueWithUnit(value, defaultUnit)}
        </Button>
      )}
    </Stack>
  );
};

export {
  KeyValueViewComponent,
  ParametersMapping,
  EditableKeyValueViewComponent,
  TextAreaActionsMapping,
};
