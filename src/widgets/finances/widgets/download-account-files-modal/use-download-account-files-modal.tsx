import { CpaFileType } from "@/enums";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { downloadCpaFileApi } from "@/services/api-service/settings/finance-api";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDateFormat } from "@/hooks/use-date-format";
interface FileType {
  id: number;
  label: string;
}
const useDownloadAccountFilesModal = () => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const {
    alertSuccessUpdate,
    alertFaultUpdate,
    alertFaultGetData,
    alertSuccess,
  } = useSnackBar();
  const { GetDateFormat } = useDateFormat();
  const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const [fileType, setFileType] = useState<FileType>();

  const onSelectDeliveryTimeDates = (value) => {
    setFromDate(value[0]);
    setToDate(value[1]);
  };
  const onChangeFileTypeState = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: FileType
  ) => {
    setFileType(value);
  };
  const fileTypeList: FileType[] = [
    { id: CpaFileType.ALL, label: t("financesWidget.moveIn") },
    { id: CpaFileType.Incoming, label: t("financesWidget.openFormat") },
    { id: CpaFileType.Payments, label: t("financesWidget.openFormatSuppOnly") },
    { id: CpaFileType.Deposits, label: t("financesWidget.deposits") },
    { id: CpaFileType.MoveInPriority, label: t("financesWidget.moveInPriority") },
  ];

  const onClickDownloadTable = async (onClose) => {
    const callBack = (res) => {
      if (res.success) {
        alertSuccess("financesWidget.filesSentSuccessfully");
        onClose();
      } else {
        alertFaultGetData();
      }
    };

    await downloadCpaFileApi(callApi, callBack, {
      exportType: fileType?.id,
      startDate: GetDateFormat(fromDate),
      endDate: GetDateFormat(toDate),
    });
  };

  return {
    resetDatePicker,
    fileType,
    fileTypeList,
    onSelectDeliveryTimeDates,
    onChangeFileTypeState,
    onClickDownloadTable,
  };
};

export { useDownloadAccountFilesModal };
