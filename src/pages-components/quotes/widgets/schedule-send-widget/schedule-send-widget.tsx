import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useState } from "react";
import { DateRangePicker } from "rsuite";
import { predefinedRanges } from "@/utils/dateRanges";
import { ScheduleFrequencyEnum, DateRangeTypeEnum, DayOfWeek } from "@/enums/scheduled-reports-enums";
import { EStatementCategory } from "@/pages-components/products/profits-new/enums/profites-enum";
import { DocumentTypeEnums } from "@/enums/document-type-enum";

const ScheduleSendWidget = ({
    openModal,
    onCloseModal,
    documentType,
    availableDateFilters = [],
    createScheduledReport,
    filterData = {},
    boardMissionTableFilterDTO = {},
    rules,
    propertieValue

}: {
    openModal: boolean;
    onCloseModal: () => void;
    documentType: number;
    availableDateFilters?: Array<{ label: string; value: string }>;
    createScheduledReport?: (data: any) => void;
    filterData?: any;
    boardMissionTableFilterDTO?: any;
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
    const [dateRange, setDateRange] = useState<any>(null)

    // Specific date fields for jobs table
    const [creationDateRange, setCreationDateRange] = useState<any>(null)
    const [dueDateRange, setDueDateRange] = useState<any>(null)
    const [readyDateRange, setReadyDateRange] = useState<any>(null)

    // Function to clear all form values
    const clearFormValues = () => {
        setReportName("");
        setMail("");
        setScheduleType(undefined);
        setDayOfMonth(undefined);
        setDayOfWeek(undefined);
        setDateRange(null);
        setCreationDateRange(null);
        setDueDateRange(null);
        setReadyDateRange(null);
    };

    // Handle modal close with form reset
    const handleCloseModal = () => {
        clearFormValues();
        onCloseModal();
    };

    // Predefined date options for jobs table
    const getPredefinedDateOptions = () => {
        return [
            { label: t("sales.list.today"), value: DateRangeTypeEnum.Today },
            { label: t("sales.list.yesterday"), value: DateRangeTypeEnum.Yesterday },
            { label: t("sales.list.last7Days"), value: DateRangeTypeEnum.Last7Days },
            { label: t("sales.list.last30Days"), value: DateRangeTypeEnum.Last30Days },
            { label: t("sales.list.thisWeek"), value: DateRangeTypeEnum.ThisWeek },
            { label: t("sales.list.lastWeek"), value: DateRangeTypeEnum.LastWeek },
            { label: t("sales.list.thisMonth"), value: DateRangeTypeEnum.ThisMonth },
            { label: t("sales.list.lastMonth"), value: DateRangeTypeEnum.LastMonth },
        ];
    };
    const daysArray = Array.from({ length: 31 }, (v, k) => ({
        label: k + 1,
        id: k + 1
    }));

    // Generate hours array (0-23)
    const hoursArray = Array.from({ length: 24 }, (v, k) => ({
        label: `${k.toString().padStart(2, '0')}:00`,
        id: k
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
        // For jobs table, show specific date options instead of generic date range
        if (availableDateFilters && availableDateFilters.length > 0) {
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

            // Add specific date filters for jobs table
            const specificFilters = availableDateFilters.map(filter => ({
                label: filter.label,
                value: filter.value
            }));

            return [...baseOptions, ...specificFilters];
        }

        // Default behavior for other document types
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

        return baseOptions;
    };
    const _renderScheduleType = (type) => {
        switch (type) {
            case ScheduleFrequencyEnum.Daily:
                return null;
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
            onClose={handleCloseModal}
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

                {/* Show specific date fields for jobs table */}
                {availableDateFilters && availableDateFilters.length > 0 ? (
                    <>
                        <div style={classes.inputRow}>
                            <div style={classes.inputContainer}>
                                <label style={classes.labelStyle}>{t("boardMissions.creationDate")}</label>
                                <GoMakeAutoComplate
                                    options={getPredefinedDateOptions()}
                                    style={{ height: "40px", width: "100%", border: "none" }}
                                    placeholder={t("boardMissions.creationDate")}
                                    onChange={(e: any, item: any) => {
                                        setCreationDateRange(item)
                                    }}
                                    value={creationDateRange}
                                />
                            </div>
                        </div>

                        <div style={classes.inputRow}>
                            <div style={classes.inputContainer}>
                                <label style={classes.labelStyle}>{t("boardMissions.dueDate")}</label>
                                <GoMakeAutoComplate
                                    options={getPredefinedDateOptions()}
                                    style={{ height: "40px", width: "100%", border: "none" }}
                                    placeholder={t("boardMissions.dueDate")}
                                    onChange={(e: any, item: any) => {
                                        setDueDateRange(item)
                                    }}
                                    value={dueDateRange}
                                />
                            </div>
                        </div>

                        <div style={classes.inputRow}>
                            <div style={classes.inputContainer}>
                                <label style={classes.labelStyle}>{t("boardMissions.readyDate")}</label>
                                <GoMakeAutoComplate
                                    options={getPredefinedDateOptions()}
                                    style={{ height: "40px", width: "100%", border: "none" }}
                                    placeholder={t("boardMissions.readyDate")}
                                    onChange={(e: any, item: any) => {
                                        setReadyDateRange(item)
                                    }}
                                    value={readyDateRange}
                                />
                            </div>
                        </div>
                    </>
                ) : (
                    <div style={classes.inputRow}>
                        <div style={classes.inputContainer}>
                            <label style={classes.labelStyle}>{t("sales.list.dateRange")}</label>
                            <GoMakeAutoComplate
                                options={getDateFilterOptions()}
                                style={{ height: "40px", width: "100%", border: "none" }}
                                placeholder={t("sales.list.dateRange")}
                                onChange={(e: any, item: any) => {
                                    setDateRange(item)
                                }}
                                value={dateRange}
                            />
                        </div>
                    </div>
                )}


                <div style={classes.buttonContainer}>
                    <GomakePrimaryButton
                        style={classes.sendBtn}
                        onClick={() => {
                            if (createScheduledReport) {
                                // Prepare the payload based on document type
                                const basePayload = {
                                    reportName,
                                    email: mail,
                                    documentType: documentType,
                                    frequency: scheduleType?.id,
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
                                        ...(documentType === DocumentTypeEnums.BoardMission
                                            ? { boardMissionTableFilterDTO: boardMissionTableFilterDTO }
                                            : { filterDTO: filterData }
                                        ),
                                    },
                                };

                                // Add date range types based on document type
                                if (documentType === DocumentTypeEnums.BoardMission && availableDateFilters && availableDateFilters.length > 0) {
                                    // For jobs: send separate date range types (enum values, not dates)
                                    createScheduledReport({
                                        ...basePayload,
                                        dateRangeType: creationDateRange?.value, // Creation date enum value
                                        dueDateRangeType: dueDateRange?.value, // Due date enum value
                                        readyDateRangeType: readyDateRange?.value, // Ready date enum value
                                    });
                                } else {
                                    // For documents: send single date range type (enum value, not date)
                                    createScheduledReport({
                                        ...basePayload,
                                        dateRangeType: dateRange?.value,
                                    });
                                }
                            }
                            handleCloseModal();
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