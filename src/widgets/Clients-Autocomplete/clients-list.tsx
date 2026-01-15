import { AutoCompleteUpdatedValue } from "../quote-new/auto-complete-updated";
import { GoMakeAutoComplate } from "@/components/auto-complete/auto-complete";
import { CLIENT_TYPE, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { lazy, Suspense, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomerCardWidget } from "../customer-card-modal/customer-card";
import { useCustomerDropDownList } from "@/hooks/use-customer-drop-down-list";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
// import { CustomerCardWidget } from "../customer-card-modal";

interface ClientAutocompleteProps {
  uiType?: "default" | "updated";
  clientType?: CLIENT_TYPE;
  onAddCustomer?: any;
  onChangeSelectBusiness?: any;
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
  disableClearable?: boolean;
  withArrow?: boolean;
  isFromCartPage?: boolean;
  customStyle?: any;
}

export const ClientAutocomplete = ({
  uiType = "default",
  clientType = CLIENT_TYPE.CUSTOMER,
  onAddCustomer,
  ...props
}: ClientAutocompleteProps) => {
  const { t } = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const isCustomer = clientType === CLIENT_TYPE.CUSTOMER;
  const [customerOfAdd, setCustomerOfAdd] = useState<any>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [searchText, setSearchText] = useState<string>("");
  const { getAllClients } = useCustomerDropDownList({
    clientType,
    shouldRenderOnMount: false,
  });
  const handleOpenModal = () => setOpen(true);
  const handleCloseModal = () => setOpen(false);

  const handleTextFieldChange = (e: any) => {
    const value = e.target.value.trim();
    setSearchText(value);
    props.onChangeTextField?.(e);
  };

  const handleChange = (event: any, value: any) => {
    if (value?.id === "addClient") {
      setCustomerOfAdd({ name: searchText });
      handleOpenModal();
    } else if (value?.id) {
      setCustomerOfAdd(value);
      props.onChange?.(event, value);
    } else {
      setCustomerOfAdd([]);
      props.onChange?.(event, null);
    }
  };

  const getOptionLabel = (option: any) => {
    if (option?.id === "addClient") return ""; // Prevent display of "+ Add Customer" as selected value
    return props.getOptionLabel ? props.getOptionLabel(option) : option.name;
  };
  const mergedOptions = useMemo(() => {
    const addClientOption = {
      name: `+ ${
        clientType === CLIENT_TYPE.CUSTOMER
          ? t("customers.buttons.addCustomer")
          : t("suppliers.buttons.addSupplier")
      } "${searchText}"`,
      id: "addClient",
      isInfo: true,
    };

    if (props.options.length === 0 && searchText) {
      return [addClientOption];
    }
    return props.options;
  }, [props.options, searchText, t]);

  // const handleChange = (event: any, value: any) => {
  //   if (value?.id === "addClient") {
  //     setCustomerOfAdd({ name: searchText });
  //     handleOpenModal();
  //   } else {
  //     props.onChange?.(event, value);
  //   }
  // };

  const handleCustomerAdd = (newCustomer: any) => {
    setCustomerOfAdd(newCustomer);
    handleCloseModal();
    if (onAddCustomer) {
      onAddCustomer(newCustomer);
    }
    if (newCustomer?.id) {
      getAllClients(newCustomer?.name);
    }
  };

  const renderOption = (props: any, option: any) => {
    if (option.isInfo) {
      return (
        <li
          {...props}
          style={{
            pointerEvents: option.id === "addClient" ? "auto" : "none",
            color: `var(--theme-secondary-color, ${primaryColor(500)})`,
            fontWeight: 500,
            fontSize: "14px",
            cursor: option.id === "addClient" ? "pointer" : "default",
          }}
        >
          {option.name}
        </li>
      );
    }
    return <li {...props}>{getOptionLabel(option)}</li>;
  };

  return (
    <>
      {uiType === "updated" ? (
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
          onChange={handleChange}
          onChangeTextField={handleTextFieldChange}
          isFetching={props.isFetching}
          defaultFiltering={false}
        />
      ) : (
        <GoMakeAutoComplate
          options={mergedOptions}
          onChangeTextField={handleTextFieldChange}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          style={{ ...props.style, ...props.customStyle }}
          placeholder={
            isCustomer
              ? t("home.admin.selectCustomer")
              : t("materials.childTable.searchOrSelectSupplier")
          }
          onChange={handleChange}
          value={props.value}
          loading={props.loading}
          disableClearable={props.disableClearable}
          withArrow={props.withArrow}
          defaultFiltering={false}
        />
      )}

      {/* Add Customer Modal */}
      {open && (
        <CustomerCardWidget
          customerAction={CUSTOMER_ACTIONS.Add}
          codeFlag={false}
          typeClient={clientType}
          onCustomerAdd={handleCustomerAdd}
          openModal={open}
          onClose={handleCloseModal}
          customer={customerOfAdd}
          setCustomer={setCustomerOfAdd}
          onChangeSelectBusiness={props?.onChangeSelectBusiness}
          isFromCartPage={props?.isFromCartPage}
        />
      )}
    </>
  );
};
