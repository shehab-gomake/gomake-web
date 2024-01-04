import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { HeaderTitle } from "@/widgets";
import { useMissions } from "./use-misssions";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeAutoComplate, GomakePrimaryButton } from "@/components";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useEffect } from "react";
import { GoMakeMultiSelect } from "@/components/auto-complete/multi-select";


const BoardMissionsListWidget = () => {
  const { classes } = useStyle();
  const { t } = useTranslation();
  const {
    tableHeader,
    getAllCustomers,
    renderOptions,
    setCustomerId,
    customerId,
    setAgentId,
    agentId,
    setStatus,
    status,
    agentsCategories,
    getAgentCategories,
    productionStatuses,
    selectedValues,
    handleMultiSelectChange,
    getAllProducts,
    productsList
  } = useMissions();

  useEffect(() => {
    getAllCustomers();
    getAgentCategories(true);
    getAllProducts();
  }, [])


  return (
    <>
      <div style={classes.mainContainer}>
        <HeaderTitle title={t("boardMissions.title")} marginTop={1} marginBottom={1} />
        <div style={classes.filtersContainer}>
          <div style={classes.selectedFilterContainer}>
            <div style={classes.statusFilterContainer}>
              <h3 style={classes.filterLabelStyle}>{t("sales.quote.agent")}</h3>
              <GoMakeAutoComplate
                options={agentsCategories}
                style={classes.textInputStyle}
                getOptionLabel={(option: any) => option.label}
                placeholder={t("sales.quote.ChooseAgent")}
                onChange={(e: any, value: any) => {
                  setAgentId(value);
                }}
                value={agentId}
              />
            </div>
            <div style={classes.statusFilterContainer}>
              <h3 style={classes.filterLabelStyle}>{t("sales.quote.customer")}</h3>
              <GoMakeAutoComplate
                options={renderOptions()}
                getOptionLabel={(option: any) => `${option.name}`}
                style={classes.textInputStyle}
                placeholder={t("sales.quote.chooseCustomer")}
                onChange={(e: any, value: any) => {
                  setCustomerId(value);
                }}
                value={customerId}
              />
            </div>
            <div style={classes.statusFilterContainer}>
              <h3 style={classes.filterLabelStyle}>{t("boardMissions.productionStatus")}</h3>
              <GoMakeAutoComplate
                options={productionStatuses}
                style={classes.textInputStyle}
                placeholder={t("boardMissions.productionStatus")}
                onChange={(e: any, value: any) => {
                  setStatus(value);
                }}
                value={status}
              />
            </div>
            <div style={classes.statusFilterContainer}>
              <h3 style={classes.filterLabelStyle}>{t("Products")}</h3>
              <GoMakeMultiSelect
                onChange={handleMultiSelectChange}
                style={classes.textInputStyle}
                options={productsList}
                values={selectedValues}
                placeholder="Select products" />
            </div>

            
            <GomakePrimaryButton
              style={classes.searchBtnStyle}
              onClick={() => null}
            >{t("sales.quote.search")}
            </GomakePrimaryButton>
            <GomakePrimaryButton
              style={classes.clearBtnStyle}
              onClick={() => null}
            >{t("sales.quote.clear")}
            </GomakePrimaryButton>
      

          </div>
          <SearchInputComponent onChange={(e) => alert(e)} />
        </div>
        <PrimaryTable
          stickyFirstCol={false}
          stickyHeader={false}
          rows={null}
          headers={tableHeader}
        />
      </div>
    </>
  );
};

export { BoardMissionsListWidget };
