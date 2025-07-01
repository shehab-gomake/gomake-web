import { Divider } from "@mui/joy";
import { VatReportHeaderWidget } from "./widgets/header-widget";
import { VatReportButtonWidget } from "./widgets/button-widget";

import { HeaderTitle } from "@/widgets/header-title/header-title";
import { useStyle } from "./style";
import { useVatReport } from "./use-vat-report";
import { GomakeTextInput } from "@/components";

const VatReportWidget = () => {
    const {
        t,
        onClickBtn1,
        onClickBtn2,
        showTable,
        fromDate,
        toDate,
        setFromDate,
        setToDate,
        handleFromDateChange,
        handleToDateChange,
        vatData
    } = useVatReport();
    const { classes } = useStyle();

    return (
        <div style={classes.mainContainer}>
            <HeaderTitle
                title={t("tabs.vatReport")}
                marginTop={"0px"}
                marginBottom={"0px"}
            />
            <VatReportHeaderWidget
                handleFromDateChange={handleFromDateChange}
                handleToDateChange={handleToDateChange}
                fromDate={fromDate}
                toDate={toDate}
                setFromDate={setFromDate}
                setToDate={setToDate}
            />
            <Divider />
            <VatReportButtonWidget
                onClickBtn1={onClickBtn1}
                onClickBtn2={onClickBtn2}
            />
            {showTable && (
                <div style={classes.vatReportContainer}>
                    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                        <div style={classes.vatReportItem}>
                            <div style={classes.vatReportItemTitle}>{t("reports.taxOnTransactions")}</div>
                            <GomakeTextInput value={vatData?.taxOnTransactions} disabled={true} />
                        </div>
                        <div style={classes.vatReportItem}>
                            <div style={classes.vatReportItemTitle}>{t("reports.vatMustTransactions")}</div>
                            <GomakeTextInput value={vatData?.vatMustTransactions} disabled={true} />
                        </div>
                        <div style={classes.vatReportItem}>
                            <div style={classes.vatReportItemTitle}>{t("reports.vatExemptTransactions")}</div>
                            <GomakeTextInput value={vatData?.vatExemptTransactions} disabled={true} />
                        </div>
                    </div>
                    <div style={classes.vatReportItem}>
                        <div style={classes.vatReportItemTitle}>{t("reports.vatOnHoldings")}</div>
                        <GomakeTextInput value={vatData?.vatOnHoldings} disabled={true} />
                    </div>
                    <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
                        <div style={classes.vatReportItem}>
                            <div style={classes.vatReportItemTitle}>{t("reports.vatOnOtherPurchases")}</div>
                            <GomakeTextInput value={vatData?.vatOnOtherPurchases} disabled={true} />
                        </div>
                        <div style={classes.vatReportItem}      >
                            <div style={classes.vatReportItemTitle}>{t("reports.vatPercents")}</div>
                            <GomakeTextInput value={vatData?.vatPercents} disabled={true} />
                        </div>
                    </div>

                    <div style={classes.vatReportItem}>
                        <div style={classes.vatReportItemTitle}>{t("reports.totalVatToPay")}</div>
                        <GomakeTextInput value={vatData?.totalVatToPay} disabled={true} />
                    </div>

                </div>
            )}
        </div>
    );
};

export { VatReportWidget }; 