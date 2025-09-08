import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useState } from "react";
import { DateRangePicker } from "rsuite";
import { predefinedRanges } from "@/utils/dateRanges";

const ScheduleSendWidget = ({
    openModal,
    onCloseModal,
    documentType,
    availableDateFilters = []
}) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [mail, setMail] = useState("")
    const [reportName, setReportName] = useState("")
    const [scheduleType, setScheduleType] = useState<any>()
    const [dayOfMonth, setDayOfMonth] = useState()
    const [dayOfWeek, setDayOfWeek] = useState()
    const [selectedDateFilter, setSelectedDateFilter] = useState<any>()
    const [dateRange, setDateRange] = useState<any>(null)
    const daysArray = Array.from({ length: 31 }, (v, k) => ({
        label: k + 1,
        id: k + 1
    }));
    const daysOfWeekList = [
        { value: '0', label: t("profileSettings.sunday") },
        { value: '1', label: t("profileSettings.monday") },
        { value: '2', label: t("profileSettings.tuesday") },
        { value: '3', label: t("profileSettings.wednesday") },
        { value: '4', label: t("profileSettings.thursday") },
        { value: '5', label: t("profileSettings.friday") },
        { value: '6', label: t("profileSettings.saturday") },
    ];
    const scheduleTypeList = [
        {
            label: "Daily",
            id: 1
        },
        {
            label: "Weekly",
            id: 2
        },
        {
            label: "Monthly",
            id: 3
        }
    ]

    // Date filter options based on document type
    const getDateFilterOptions = () => {
        const baseOptions = [
            { label: t("sales.list.today"), value: "today" },
            { label: t("sales.list.yesterday"), value: "yesterday" },
            { label: t("sales.list.last7Days"), value: "last7days" },
            { label: t("sales.list.last30Days"), value: "last30days" },
            { label: t("sales.list.thisMonth"), value: "thisMonth" },
            { label: t("sales.list.lastMonth"), value: "lastMonth" },
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
            case 1:
                return null
            case 2:
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
            case 3:
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
                            // Handle schedule report logic here
                            console.log({
                                reportName,
                                mail,
                                scheduleType,
                                dayOfMonth,
                                dayOfWeek,
                                selectedDateFilter,
                                dateRange
                            });
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