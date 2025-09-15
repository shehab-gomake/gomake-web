import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useState } from "react";
import { DateRangePicker } from "rsuite";
import { predefinedRanges } from "@/utils/dateRanges";
import { ScheduleFrequencyEnum, DateRangeTypeEnum, DayOfWeek } from "@/enums/scheduled-reports-enums";
import { EStatementCategory } from "@/pages-components/products/profits-new/enums/profites-enum";

const ScheduleSendWidget = ({
    openModal,
    onCloseModal,
    documentType,
    availableDateFilters = [],
    createScheduledReport,
    filterData = {},
    rules,
    propertieValue

}: {
    openModal: boolean;
    onCloseModal: () => void;
    documentType: number;
    availableDateFilters?: Array<{ label: string; value: string }>;
    createScheduledReport?: (data: any) => void;
    filterData?: any;
    rules?: any;
    propertieValue?: any;
}) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [mail, setMail] = useState("")
    const [reportName, setReportName] = useState("")
    const [scheduleType, setScheduleType] = useState<any>()
    const [dayOfMonth, setDayOfMonth] = useState<any>()
    const [dayOfWeek, setDayOfWeek] = useState<any>()
    const [selectedDateFilter, setSelectedDateFilter] = useState<any>()
    const [dateRange, setDateRange] = useState<any>(null)
    const daysArray = Array.from({ length: 31 }, (v, k) => ({
        label: k + 1,
        id: k + 1
    }));
    const getStatementId = (item) => {
        if (typeof item?.statement === "object") {
            //material input
            if (
                (item.statement2 && item.statement2.type === 5) ||
                (item.statement2 && item.statement2.type === 10) ||
                (item.statement2 && item.statement2.type === 11)
            ) {
                return item?.statement?.code;
            }
            return item?.statement?.id || item?.statement?.value;
        }
        return item?.statement;
    };
    const daysOfWeekList = [
        { value: DayOfWeek.Sunday, label: t("profileSettings.sunday") },
        { value: DayOfWeek.Monday, label: t("profileSettings.monday") },
        { value: DayOfWeek.Tuesday, label: t("profileSettings.tuesday") },
        { value: DayOfWeek.Wednesday, label: t("profileSettings.wednesday") },
        { value: DayOfWeek.Thursday, label: t("profileSettings.thursday") },
        { value: DayOfWeek.Friday, label: t("profileSettings.friday") },
        { value: DayOfWeek.Saturday, label: t("profileSettings.saturday") },
    ];
    const scheduleTypeList = [
        {
            label: "Daily",
            id: ScheduleFrequencyEnum.Daily
        },
        {
            label: "Weekly",
            id: ScheduleFrequencyEnum.Weekly
        },
        {
            label: "Monthly",
            id: ScheduleFrequencyEnum.Monthly
        }
    ]

    // Date filter options based on document type
    const getDateFilterOptions = () => {
        const baseOptions = [
            { label: t("sales.list.today"), value: DateRangeTypeEnum.Today },
            { label: t("sales.list.yesterday"), value: DateRangeTypeEnum.Yesterday },
            { label: t("sales.list.last7Days"), value: DateRangeTypeEnum.Last7Days },
            { label: t("sales.list.last30Days"), value: DateRangeTypeEnum.Last30Days },
            { label: t("sales.list.thisWeek"), value: DateRangeTypeEnum.ThisWeek },
            { label: t("sales.list.lastWeek"), value: DateRangeTypeEnum.LastWeek },
            { label: t("sales.list.thisMonth"), value: DateRangeTypeEnum.ThisMonth },
            { label: t("sales.list.lastMonth"), value: DateRangeTypeEnum.LastMonth },
        ];

        // Add specific date filters based on document type (excluding creationDate)
        const specificFilters = availableDateFilters
            .filter(filter => filter.value !== "creationDate")
            .map(filter => ({
                label: `${t("sales.list.dateFilter")}: ${filter.label}`,
                value: filter.value
            }));

        return [...baseOptions, ...specificFilters];
    };
    const _renderScheduleType = (type) => {
        switch (type) {
            case ScheduleFrequencyEnum.Daily:
                return null
            case ScheduleFrequencyEnum.Weekly:
                return <div style={{ width: "50%" }}>
                    <GoMakeAutoComplate
                        options={daysOfWeekList}
                        style={{ height: "40px", width: "100%", border: "none" }}
                        placeholder={t("profileSettings.dayOfWork")}
                        onChange={(e: any, item: any) => {
                            setDayOfWeek(item)
                        }}
                        value={dayOfWeek}
                    />
                </div>
            case ScheduleFrequencyEnum.Monthly:
                return <div style={{ width: "50%" }}>
                    <GoMakeAutoComplate
                        options={daysArray}
                        style={{ height: "40px", width: "100%", border: "none" }}
                        placeholder={t("financesWidget.selectDayOfMonth")}
                        onChange={(e: any, item: any) => {
                            setDayOfMonth(item)
                        }}
                        value={dayOfMonth}
                    />
                </div>

        }
    }
    return (
        <GoMakeModal
            openModal={openModal}
            onClose={onCloseModal}
            modalTitle={t("sales.list.scheduleReport")}
            insideStyle={classes.insideStyle}
        >
            <div style={classes.mainContainer}>
                <div style={classes.inputRow}>
                    <div style={classes.inputContainer}>
                        <label style={classes.labelStyle}>{t("sales.list.reportName")}</label>
                        <GomakeTextInput
                            style={{ height: "40px", width: "100%" }}
                            placeholder={t("sales.list.reportName")}
                            onChange={(e) => setReportName(e.target.value)}
                            value={reportName}
                        />
                    </div>
                </div>

                <div style={classes.inputRow}>
                    <div style={classes.inputContainer}>
                        <label style={classes.labelStyle}>{t("login.email")}</label>
                        <GomakeTextInput
                            style={{ height: "40px", width: "100%" }}
                            placeholder={t("login.email")}
                            onChange={(e) => setMail(e.target.value)}
                            value={mail}
                        />
                    </div>
                    <div style={classes.inputContainer}>
                        <label style={classes.labelStyle}>{t("sales.list.scheduleType")}</label>
                        <GoMakeAutoComplate
                            options={scheduleTypeList}
                            style={{ height: "40px", width: "100%", border: "none" }}
                            placeholder={t("sales.list.scheduledReports")}
                            onChange={(e: any, item: any) => {
                                setScheduleType(item)
                            }}
                            value={scheduleType}
                        />
                    </div>
                </div>

                {_renderScheduleType(scheduleType?.id)}

                <div style={classes.inputRow}>
                    <div style={classes.inputContainer}>
                        <label style={classes.labelStyle}>{t("sales.list.dateRange")}</label>
                        <GoMakeAutoComplate
                            options={getDateFilterOptions()}
                            style={{ height: "40px", width: "100%", border: "none" }}
                            placeholder={t("sales.list.dateRange")}
                            onChange={(e: any, item: any) => {
                                setSelectedDateFilter(item)
                            }}
                            value={selectedDateFilter}
                        />
                    </div>
                </div>


                <div style={classes.buttonContainer}>
                    <GomakePrimaryButton
                        style={classes.sendBtn}
                        onClick={() => {
                            if (createScheduledReport) {
                                // Convert dateRangeType to actual fromDate/toDate if needed
                                const getDateRange = () => {
                                    if (!selectedDateFilter?.value) return {};

                                    const now = new Date();
                                    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

                                    switch (selectedDateFilter.value) {
                                        case DateRangeTypeEnum.Today:
                                            return {
                                                fromDate: today.toISOString(),
                                                toDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
                                            };
                                        case DateRangeTypeEnum.Yesterday:
                                            const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
                                            return {
                                                fromDate: yesterday.toISOString(),
                                                toDate: new Date(yesterday.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
                                            };
                                        case DateRangeTypeEnum.Last7Days:
                                            const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                                            return {
                                                fromDate: last7Days.toISOString(),
                                                toDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
                                            };
                                        case DateRangeTypeEnum.Last30Days:
                                            const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                                            return {
                                                fromDate: last30Days.toISOString(),
                                                toDate: new Date(today.getTime() + 24 * 60 * 60 * 1000 - 1).toISOString()
                                            };
                                        case DateRangeTypeEnum.ThisMonth:
                                            const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                                            const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
                                            return {
                                                fromDate: thisMonthStart.toISOString(),
                                                toDate: thisMonthEnd.toISOString()
                                            };
                                        case DateRangeTypeEnum.LastMonth:
                                            const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                                            const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
                                            return {
                                                fromDate: lastMonthStart.toISOString(),
                                                toDate: lastMonthEnd.toISOString()
                                            };
                                        default:
                                            return { dateRange: selectedDateFilter.value };
                                    }
                                };

                                const dateRangeData = getDateRange();

                                createScheduledReport({
                                    reportName,
                                    email: mail,
                                    documentType: documentType,
                                    frequency: scheduleType?.id,
                                    dateRangeType: selectedDateFilter?.value,
                                    startDayOfWeek: dayOfWeek?.value,
                                    startDayOfMonth: dayOfMonth?.id,
                                    reportConfiguration: {
                                        groupBy: propertieValue, // Default group by
                                        exceptionConditionProperties: rules.map((item) => {
                                            return {
                                                statementId: getStatementId(item),
                                                // statementValue: item.statement2.id,
                                                statementValue:
                                                    item?.category?.id === "MATERIALTYPE"
                                                        ? item.statement2.enumCode
                                                        : item.statement2.id,
                                                operator: item.condition.id,
                                                conditionBetweenStatements: item.linkCondition
                                                    ? item.linkCondition.id
                                                    : "",
                                                statementCategory: EStatementCategory[item.category.id],
                                            };
                                        }),
                                        filterDTO: {
                                            ...filterData,
                                        }
                                    },
                                });
                            }
                            onCloseModal();
                        }}
                    >
                        {t("properties.schedule")}
                    </GomakePrimaryButton>
                </div>
            </div>
        </GoMakeModal>
    )
}
export { ScheduleSendWidget }