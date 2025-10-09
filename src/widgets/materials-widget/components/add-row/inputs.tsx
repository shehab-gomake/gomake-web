import { EDataTypeEnum } from "@/widgets/materials-widget/components/table-cell-data/data-type-enum";

const rowInputs = (
  state,
  isFetching,
  materialHeaders?,
  currencies?,
  machinesCategories?,
  clientsCategories?,
  newMaterialHeaders?
) => {
  const newHeaders = newMaterialHeaders ? newMaterialHeaders : materialHeaders;
  const inputArray = newHeaders
    ?.filter((header) => header.key !== "Active")
    .map((header) => {
      switch (EDataTypeEnum[header?.inputType]) {
        case "CURRENCY":
          return {
            name: "Currency",
            label: newMaterialHeaders ? null : "materials.inputs.currency",
            type: "select",
            placeholder: "materials.inputs.currency",
            required: header?.isRequired,
            parameterKey: "currency",
            options: currencies.map((currency) => ({
              value: currency.value,
              text: currency.label,
            })),
            value: state?.parameterKey,
            isValid: true,
            unit: header?.unit,
            isPriceObject: header?.isPriceObject,
          };
        case "ARRAY_INPUT":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : "materials.inputs.unitPrice",
            type: "number",
            placeholder: "materials.inputs.unitPrice",
            required: header?.isRequired,
            parameterKey: header?.key,
            options: [],
            value: state["unitPrice"],
            isValid: true,
            unit: header?.unit,
            isPriceObject: header?.isPriceObject,
          };
        case "LIST":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : header?.value,
            type: "select",
            placeholder: header?.value,
            required: header?.isRequired,
            parameterKey: header?.key,
            options: header.values
              ? header.values.map((value) => ({
                value: value.key,
                text: value.value,
              }))
              : [],
            value: "",
            isValid: true,
            unit: header?.unit,
            isPriceObject: header?.isPriceObject,
          };
        case "MULTI_SELECATION_LIST":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : header?.value,
            type: "select",
            multiple: true,
            placeholder: header?.value,
            required: header?.isRequired,
            parameterKey: header?.key,
            options: header.values
              ? header.values.map((value) => ({
                value: value.key,
                text: value.value,
              }))
              : [],
            value: "",
            isValid: true,
            unit: header?.unit,
            isPriceObject: header?.isPriceObject,
          };
        case "MACHINES_LIST":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : header?.value,
            type: "select",
            placeholder: header?.value,
            required: header?.isRequired,
            parameterKey: header?.key,
            options: machinesCategories.map((machine) => ({
              value: machine.id,
              text: `${machine.manufacturer} - ${machine.model}`,
            })),
            values:
              state?.machine || state?.machines
                ? state?.machine || state?.machines
                : [],
            isValid: true,
            multiple: true,
            unit: header?.unit,
            isPriceObject: header?.isPriceObject,
          };

        case "CLIENTS_LIST":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : header?.value,
            type: "select",
            placeholder: header?.value,
            required: header?.isRequired,
            parameterKey: header?.key,
            options: clientsCategories.map((client) => ({
              value: client.id,
              text: `${client.name} - ${client.code}`,
            })),
            values: state?.clients ? state?.clients : [],
            isValid: true,
            multiple: true,
            loading: isFetching,
            unit: header?.unit,
            isPriceObject: header?.isPriceObject,
          };
        case "NOTE_BOOK_TYPES":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : header?.value,
            type: "select",
            multiple: true,
            placeholder: header?.value,
            required: header?.isRequired,
            parameterKey: header?.key,
            options: [],
            value: "",
            isValid: true,
            unit: header?.unit,
            isPriceObject: header?.isPriceObject,
          };
        case "SUPPLIERS":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : header?.value,
            type: "text",
            placeholder: header?.value,
            required: header?.isRequired,
            parameterKey: header?.key,
            options: [],
            value: "Fares, mohand, Aous",
            isValid: true,
            unit: header?.unit,
            disabled: true,
            isPriceObject: header?.isPriceObject,
          };
        case "INVENTORY":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : header?.value,
            type: "button",
            placeholder: header?.value,
            required: header?.isRequired,
            parameterKey: header?.key,
            options: [],
            value: "Open",
            isValid: true,
            unit: header?.unit,
            disabled: true,
            isPriceObject: header?.isPriceObject,
          };
        case "PURCHASE_PRICING":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : header?.value,
            type: "button",
            placeholder: header?.value,
            required: header?.isRequired,
            parameterKey: header?.key,
            options: [],
            value: "Open",
            isValid: true,
            unit: header?.unit,
            disabled: true,
            isPriceObject: header?.isPriceObject,
          };
        case "SELECT_FIXED_VALUES_ADD_NEW":
          return {
            name: header?.key,
            label: newMaterialHeaders ? null : header?.value,
            type: "select",
            placeholder: header?.value,
            required: header?.isRequired,
            parameterKey: header?.key,
            options: header.values
              ? header.values.map((value) => ({
                value: value.key,
                text: value.value,
              }))
              : [],
            value: "",
            isValid: true,
            unit: header?.unit,
            isPriceObject: header?.isPriceObject,
          };
        default:
          if (EDataTypeEnum[header?.inputType] === "IMAGE") return null;
          else
            return {
              name: header?.key,
              label: newMaterialHeaders ? null : header?.value,
              type:
                EDataTypeEnum[header?.inputType] == "BOOLEAN"
                  ? "switch"
                  : EDataTypeEnum[header?.inputType]?.toLowerCase(),
              placeholder: header?.value,
              required: header?.isRequired,
              parameterKey: header?.key,
              options: [],
              value: state[header?.key],
              isValid: true,
              unit: header?.unit,
              isPriceObject: header?.isPriceObject,
            };
      }
    })
    .filter((input) => input !== null);


  const imageCase = newHeaders.find(
    (header) => header.inputType === EDataTypeEnum.IMAGE
  );
  if (imageCase) {
    inputArray.push({
      name: imageCase.key,
      label: newMaterialHeaders ? null : imageCase.value,
      type: "image",
      required: imageCase?.isRequired,
      parameterKey: imageCase.key,
      options: [],
      value: state?.[imageCase.key],
      isValid: true,
      isPriceObject: imageCase?.isPriceObject,
    });
  }

  return inputArray;
};

export { rowInputs };
