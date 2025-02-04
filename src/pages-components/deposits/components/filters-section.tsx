import { useTranslation } from "react-i18next";
import { useStyle } from "../style";
import { GoMakeAutoComplate } from "@/components/auto-complete/auto-complete";
import { GomakePrimaryButton } from "@/components";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { useDeposits } from "../use-deposits";

const DepositsFiltersWidget = ({onClickSearch}) => {
    const { classes } = useStyle();
    const { t } = useTranslation();
    const {
        onSelectDateRange,
        resetDatePicker,
        typeOfDeposit,
        depositPaymentType,
        handleDepositTypeChange,
        onClickSearchFilter,
        onClickClearFilter,
    } = useDeposits();

   
    return (
        <div style={classes.filtersContainer}>
            <div style={classes.selectedFilterContainer}>
                <div style={classes.filterContainerStyle}>
                    <label style={classes.filterLabelStyle}>
                        {t("deposits.typeOfDeposit")}
                    </label>
                    <GoMakeAutoComplate
                        key={depositPaymentType?.value}
                        options={typeOfDeposit}
                        style={classes.textInputStyle}
                        getOptionLabel={(option: any) => option.label}
                        placeholder={t("deposits.typeOfDeposit")}
                        onChange={handleDepositTypeChange}
                        value={depositPaymentType}
                    />
                </div>
                <div style={classes.filterContainerStyle}>
                    <label style={classes.filterLabelStyle}>{t("boardMissions.dateRange")}</label>
                    <GoMakeDatepicker onChange={onSelectDateRange} placeholder={t("boardMissions.chooseDate")} reset={resetDatePicker} style={{width:"100%"}} />
                </div>
                <div style={classes.filterButtonContainerStyle}>
                    <div style={classes.filterLabelStyle} />
                    <GomakePrimaryButton
                        style={classes.searchBtnStyle}
                        onClick={onClickSearchFilter}
                    >
                        {t("sales.quote.search")}
                    </GomakePrimaryButton>
                </div>
                <div style={classes.filterButtonContainerStyle}>
                    <div style={classes.filterLabelStyle} />
                    <GomakePrimaryButton
                        style={classes.clearBtnStyle}
                        onClick={onClickClearFilter}>
                        {t("sales.quote.clear")}
                    </GomakePrimaryButton>
                </div>
            </div>
            <SearchInputComponent onChange={onClickSearch} />
        </div>
    )
}
export { DepositsFiltersWidget }