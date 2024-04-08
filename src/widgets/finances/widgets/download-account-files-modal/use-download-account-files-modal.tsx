import { CpaFileType } from "@/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { downloadCpaFileApi } from "@/services/api-service/settings/finance-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
interface FileType {
    id: number;
    label: string;
}
const useDownloadAccountFilesModal = () => {
    const { t } = useTranslation();
    const { callApi } = useGomakeAxios();
    const { alertSuccessUpdate , alertFaultUpdate , alertFaultGetData } = useSnackBar();

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

    const onClickDownloadTable = async (onClose) => {
        const callBack = (res) => {
          if (res.success) {
            const downloadLink = document.createElement("a");
            downloadLink.href = res.data; 
            downloadLink.download =  "Account_Files.xlsx"; 
            downloadLink.click();
            onClose();
          }
          else {
            alertFaultGetData();
          }
        };
        await downloadCpaFileApi(callApi, callBack, {
            exportType: fileType?.id,
            startDate: fromDate,
            endDate: toDate
          });
      };

    return {
        resetDatePicker,
        fileType,
        fileTypeList,
        onSelectDeliveryTimeDates,
        onChangeFileTypeState,
        onClickDownloadTable
    };
};

export { useDownloadAccountFilesModal };
