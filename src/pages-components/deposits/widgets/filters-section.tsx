import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { GoMakeAutoComplate } from "@/components/auto-complete/auto-complete";
import { GomakePrimaryButton } from "@/components";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useDeposits } from "../use-deposits";
import { useEffect } from "react";

const DepositsFiltersWidget = () => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const {
        renderOptions,
        checkWhatRenderArray,
        customerId,
        handleCustomerChange,
        getAllCustomersCreateQuote,
        getAllCustomersCreateOrder,
        agentsCategories,
        agentId,
        handleAgentChange,
        onSelectDateRange,
        resetDatePicker,
        typeOfDeposit,
        typeId,
        handleDepositTypeChange,
        onClickClearFilter
    } = useDeposits();

    useEffect(() => {
        getAllCustomersCreateQuote();
        getAllCustomersCreateOrder();
    }, []);

    return (

        <div style={classes.filtersContainer}>
            <div style={classes.selectedFilterContainer}>
                <div style={classes.statusFilterContainer}>
                    <div style={classes.filterLabelStyle}>
                        {t("sales.quote.customer")}
                    </div>
                    <GoMakeAutoComplate
                        key={customerId?.id}
                        options={renderOptions()}
                        getOptionLabel={(option: any) => `${option.name}`}
                        onChangeTextField={checkWhatRenderArray}
                        style={classes.textInputStyle}
                        placeholder={t("sales.quote.chooseCustomer")}
                        onChange={handleCustomerChange}
                        value={customerId}
                    />
                </div>
                <div style={classes.statusFilterContainer}>
                    <div style={classes.filterLabelStyle}>
                        {t("sales.quote.agent")}
                    </div>
                    <GoMakeAutoComplate
                        key={agentId?.id}
                        options={agentsCategories}
                        style={classes.textInputStyle}
                        getOptionLabel={(option: any) => option.label}
                        placeholder={t("sales.quote.ChooseAgent")}
                        onChange={handleAgentChange}
                        value={agentId}
                    />
                </div>

                <div style={classes.statusFilterContainer}>
                    <div style={classes.filterLabelStyle}>
                        {t("deposits.typeOfDeposit")}
                    </div>
                    <GoMakeAutoComplate
                        key={typeId?.value}
                        options={typeOfDeposit}
                        style={classes.textInputStyle}
                        getOptionLabel={(option: any) => option.label}
                        placeholder={t("deposits.typeOfDeposit")}
                        onChange={handleDepositTypeChange}
                        value={typeId}
                    />
                </div>

                <div style={classes.statusFilterContainer}>
                    <h3 style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</h3>
                    <GoMakeDatepicker onChange={onSelectDateRange} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} />
                </div>

                <div style={classes.statusFilterContainer}>
                    <div style={classes.filterLabelStyle} />
                    <GomakePrimaryButton
                        style={classes.searchBtnStyle}
                        onClick={() => alert("loading...")}
                    >
                        {t("sales.quote.search")}
                    </GomakePrimaryButton>
                </div>

                <div style={classes.statusFilterContainer}>
                    <div style={classes.filterLabelStyle} />
                    <GomakePrimaryButton
                        style={classes.clearBtnStyle}
                        onClick={onClickClearFilter}
                    >
                        {t("sales.quote.clear")}
                    </GomakePrimaryButton>
                </div>
            </div>
            <SearchInputComponent onChange={() => alert("loading...")} />
        </div>

    )
}
export { DepositsFiltersWidget }