import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import { GoMakeAutoComplate, GoMakeModal, GomakePrimaryButton, GomakeTextInput } from "@/components";
import { useState } from "react";

const ScheduleSendWidget = ({ openModal, onCloseModal }) => {
    const { t } = useTranslation();
    const { classes } = useStyle();
    const [mail, setMail] = useState("")
    const [scheduleType, setScheduleType] = useState<any>()
    const [dayOfMonth, setDayOfMonth] = useState()
    const [dayOfWeek, setDayOfWeek] = useState()
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
        <GoMakeModal openModal={openModal} onClose={onCloseModal} insideStyle={classes.insideStyle}>
            <div style={classes.mainContainer}>
                <div style={{ width: "50%" }}>
                    <GomakeTextInput
                        style={{ height: "40px", width: "100%" }}
                        placeholder={t("login.email")}
                        onChange={(e) => setMail(e.target.value)}
                        value={mail}
                    />
                </div>
                <div style={{ width: "50%" }}>
                    <GoMakeAutoComplate
                        options={scheduleTypeList}
                        style={{ height: "40px", width: "100%", border: "none" }}
                        placeholder={t("customers.selectCustomerType")}
                        onChange={(e: any, item: any) => {
                            setScheduleType(item)
                        }}
                        value={scheduleType}
                    />
                </div>
                {_renderScheduleType(scheduleType?.id)}
                <div style={{ position: "absolute", right: 10, bottom: 10 }}>
                    <GomakePrimaryButton
                        style={classes.sendBtn}
                    >
                        {t("properties.schedule")}
                    </GomakePrimaryButton>
                </div>
            </div>
        </GoMakeModal>
    )
}
export { ScheduleSendWidget }