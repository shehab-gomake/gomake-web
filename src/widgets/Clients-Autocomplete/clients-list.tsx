import { AutoCompleteUpdatedValue } from "../quote-new/auto-complete-updated";
import { GoMakeAutoComplate } from "@/components/auto-complete/auto-complete";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

//!here new component
interface ClientAutocompleteProps {
  uiType?: "default" | "updated";
  clientType?: CLIENT_TYPE;
  options: any[];
  defaultFiltering?: boolean;
  onChangeTextField?: (event: any) => void;
  getOptionLabel?: (option: any) => string;
  style?: any;
  placeholder?: string;
  onChange?: (event: any, value: any) => void;
  value?: any;
  loading?: boolean;
  label?: string;
  isFetching?: boolean;
  isUpdate?: boolean;
  setIsUpdate?: (value: boolean) => void;
  onBlur?: () => void;
  onClickOpenChangeClientModal?: (value: any) => void;
  disableClearable?: boolean;
  withArrow?: boolean;
}

export const ClientAutocomplete = ({
  uiType = "default",
  clientType = CLIENT_TYPE.CUSTOMER,
  ...props
}: ClientAutocompleteProps) => {
  const { t } = useTranslation();
  const isCustomer = clientType === CLIENT_TYPE.CUSTOMER;

  const getOptionLabel = (option: any) => {
    if (option.isInfo) return option.name;
    return props.getOptionLabel ? props.getOptionLabel(option) : option.name;
  };

  // include the selected client if not searching and the value is valid
  const mergedOptions = useMemo(() => {
    // if (
    //   props.value &&
    //   !props.options.some((opt) => opt.id === props.value.id)
    // ) {
    //   return [props.value, ...props.options];
    // }
    return props.options;
  }, [props.value, props.options]);

  const renderOption = (props: any, option: any) => {
    if (option.isInfo) {
      return (
        <li
          {...props}
          style={{
            pointerEvents: "none",
            color: "#2e3092",
            fontWeight: 400,
            fontSize: "14px",
          }}
        >
          {option.name}
        </li>
      );
    }
    return (
      <li {...props}>
        {props.getOptionLabel ? props.getOptionLabel(option) : option.name}
      </li>
    );
  };

  if (uiType === "updated") {
    return (
      <AutoCompleteUpdatedValue
        label={
          isCustomer
            ? t("sales.quote.businessName")
            : t("sales.quote.supplierName")
        }
        value={props.value}
        options={mergedOptions}
        renderOption={renderOption}
        onBlur={props.onBlur}
        isUpdate={props.isUpdate}
        setIsUpdate={props.setIsUpdate}
        getOptionLabel={props.getOptionLabel}
        onChange={props.onClickOpenChangeClientModal}
        onChangeTextField={props.onChangeTextField}
        isFetching={props.isFetching}
        defaultFiltering={false}
      />
    );
  }

  return (
    <GoMakeAutoComplate
      options={mergedOptions}
      onChangeTextField={props.onChangeTextField}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
      style={props.style}
      placeholder={
        isCustomer
          ? t("home.admin.selectCustomer")
          : t("materials.sheetPaper.selectASupplier")
      }
      onChange={props.onChange}
      value={props.value}
      loading={props.loading}
      disableClearable={props.disableClearable}
      withArrow={props.withArrow}
      defaultFiltering={false}
    />
  );
};
