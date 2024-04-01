import { CpaFileType } from "@/enums";
import { useState } from "react";
import { useTranslation } from "react-i18next";


interface FileType {
    id: number;
    label: string;
}
const useDownloadAccountFilesModal = () => {
    const { t } = useTranslation()
    const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
    const [fromDate, setFromDate] = useState<Date>();
    const [toDate, setToDate] = useState<Date>();
    const [fileType, setFileType] = useState<FileType>();

    const onSelectDeliveryTimeDates = (fromDate: Date, toDate: Date) => {
        setResetDatePicker(false);
        setFromDate(fromDate);
        setToDate(toDate);
    };
    const onChangeFileTypeState = (event: React.ChangeEvent<HTMLInputElement>, value: FileType) => {
        setFileType(value);
    }
    const fileTypeList: FileType[] = [
        { id: CpaFileType.ALL, label: t("financesWidget.all") },
        { id: CpaFileType.Incoming, label: t("financesWidget.incoming") },
        { id: CpaFileType.Payments, label: t("financesWidget.payments") },
        { id: CpaFileType.Deposits, label: t("financesWidget.deposits") },
    ]
    return {
        resetDatePicker,
        fileType,
        fileTypeList,
        onSelectDeliveryTimeDates,
        onChangeFileTypeState
    };
};

export { useDownloadAccountFilesModal };
