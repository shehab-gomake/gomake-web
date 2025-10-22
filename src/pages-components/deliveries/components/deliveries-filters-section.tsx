import {
  FilterSectionComponent,
  GoMakeAutoComplate,
  GomakeTextInput,
  GoMakeTextInputIcon,
  IFilterItem,
} from "@/components";
import { useTranslation } from "react-i18next";
import { SearchIcon } from "@/icons";
import { InputAdornment } from "@mui/material";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";
import { CLIENT_TYPE } from "@/pages/customers/enums";
import { SecondaryButton } from "@/components/button/secondary-button";

interface IDeliveriesFiltersSectionProps {
  // Customer filter
  customer: any;
  renderOptions: () => any[];
  checkWhatRenderArray: any;
  isFetching: boolean;
  handleCustomerChange: (e: any, value: any) => void;

  // Agent filter
  agent: any;
  agentsCategories: any[];
  handleAgentChange: (e: any, value: any) => void;

  // Shipment type filter
  deliveryTypeValue: any;
  setDeliveryTypeValue: (value: any) => void;
  shipmentTypes: any[];

  // Search
  patternSearch: string;
  onChangeDocumentSearch: (value: string) => void;

  // Actions
  onClickClearFilter: () => void;
  onClickSearchFilter: () => void;

  // Styles
  classes: any;
}

const DeliveriesFiltersSection = ({
  // Customer filter
  customer,
  renderOptions,
  checkWhatRenderArray,
  handleCustomerChange,
  isFetching,
  // Agent filter
  agent,
  agentsCategories,
  handleAgentChange,
  // Shipment type filter
  deliveryTypeValue,
  setDeliveryTypeValue,
  shipmentTypes,
  // Search
  patternSearch,
  onChangeDocumentSearch,
  // Actions
  onClickClearFilter,
  onClickSearchFilter,
  // Styles
  classes,
}: IDeliveriesFiltersSectionProps) => {
  const { t } = useTranslation();

  const filters: IFilterItem[] = [
    {
      id: "search",
      label: t("header.search"),
      component: (
        <GoMakeTextInputIcon
          onChange={(e) => {
            const trimmedValue = e.target.value.trimStart();
            onChangeDocumentSearch(trimmedValue);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onClickSearchFilter();
            }
          }}
          sx={{
            "& .MuiInputAdornment-root": {
              marginRight: "0px",
            },
          }}
          style={classes.searchInputStyle}
          placeholder={t("header.search")}
          value={patternSearch}
          startAdornment={
            <InputAdornment position="start">
              <div style={classes.iconStyle}>
                <SearchIcon width={20} height={20} />
              </div>
            </InputAdornment>
          }
        />
      ),
    },
    {
      id: "customer",
      label: t("productionFloor.customer"),
      component: (
        <ClientAutocomplete
          key={customer?.id}
          options={renderOptions() ? renderOptions() : []}
          getOptionLabel={(option: any) => `${option.name}`}
          onChangeTextField={checkWhatRenderArray}
          style={classes.textInputStyle}
          onChange={handleCustomerChange}
          value={customer}
          loading={isFetching}
        />
      ),
    },
    {
      id: "agent",
      label: t("sales.quote.agent"),
      component: (
        <GoMakeAutoComplate
          key={agent?.id}
          options={agentsCategories}
          style={classes.textInputStyle}
          getOptionLabel={(option: any) => option.label}
          placeholder={t("sales.quote.ChooseAgent")}
          onChange={handleAgentChange}
          value={agent}
        />
      ),
    },
    {
      id: "shipmentType",
      label: t("customers.modal.shipmentType"),
      component: (
        <GoMakeAutoComplate
          options={shipmentTypes}
          value={deliveryTypeValue}
          placeholder={t("customers.modal.selectShipmentType")}
          style={classes.textInputStyle}
          onChange={(e: any, value: any) => {
            setDeliveryTypeValue(value);
          }}
        />
      ),
    },
  ];

  const actionButtons = (
    <>
      <SecondaryButton variant="contained" onClick={onClickSearchFilter}>
        {t("sales.quote.search")}
      </SecondaryButton>
      <SecondaryButton variant="outlined" onClick={onClickClearFilter}>
        {t("sales.quote.clear")}
      </SecondaryButton>
    </>
  );

  return (
    <FilterSectionComponent filters={filters} actionButtons={actionButtons} />
  );
};

export { DeliveriesFiltersSection };
