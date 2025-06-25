import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";
import { useStyle } from "./style";
import { GoMakeDatepicker } from "@/components/datepicker/datepicker";
import { useDownloadAccountFilesModal } from "./use-download-account-files-modal";
import { DateRangePicker } from "rsuite";
import { predefinedRanges } from "@/utils/dateRanges";

interface DownloadAccountFilesModalProps {
  openModal: boolean;
  onClose: () => void;
}
const DownloadAccountFilesModal: React.FC<DownloadAccountFilesModalProps> = ({
  openModal,
  onClose,
}) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const {
    resetDatePicker,
    fileType,
    fileTypeList,
    onSelectDeliveryTimeDates,
    onChangeFileTypeState,
    onClickDownloadTable,
  } = useDownloadAccountFilesModal();

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("financesWidget.downloadAccountFiles")}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <>
          <div style={classes.mainContainer}>
            <div style={classes.date1FilterContainer}>
              <h3 style={classes.filterLabelStyle}>
                {t("boardMissions.dateRange")}
              </h3>
              ff
              <div style={{ width: 300 }}>
                <DateRangePicker
                  onChange={onSelectDeliveryTimeDates}
                  ranges={predefinedRanges}
                />
              </div>
            </div>
            <div style={classes.date1FilterContainer}>
              <h3 style={classes.filterLabelStyle}>
                {t("financesWidget.fileType")}
              </h3>
              <GoMakeAutoComplate
                options={fileTypeList}
                style={classes.dropDownListStyle}
                placeholder={t("financesWidget.selectFileType")}
                onChange={onChangeFileTypeState}
                value={fileType}
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <GomakePrimaryButton
              onClick={() => onClickDownloadTable(onClose)}
              style={classes.btnContainer}
            >
              {t("financesWidget.downloadTable")}
            </GomakePrimaryButton>
          </div>
        </>
      </GoMakeModal>
    </>
  );
};
export { DownloadAccountFilesModal };
