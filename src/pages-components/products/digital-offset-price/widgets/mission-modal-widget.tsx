import React, { useEffect, useState } from 'react';
import { Tooltip, IconButton, Checkbox, Stack } from '@mui/material';
import { GomakePrimaryButton } from '@/components';
import { RoundedCloseIcon } from '@/components/modal/icon/close';
import { useTranslation } from 'react-i18next';
import { CheckboxCheckedIcon, CheckboxIcon, WarningModalIcon } from '@/icons';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { FONT_FAMILY } from '@/utils/font-family';
import { OrderNowIcon } from '@/widgets/quote-new/total-price-and-vat/order-now-modal/icons';

const MissionModalWidget = ({ onClickCloseCurrentStationModal, missionsListForEdit, clasess, updateQuoteItem }) => {
  const { t } = useTranslation();
  const { primaryColor, errorColor } = useGomakeTheme();
  const [disabledBtns, setDisabledBtns] = useState(false)
  const [currentStation, setCurrentStation] = useState()
  useEffect(() => {
    if (missionsListForEdit && missionsListForEdit.length > 0) {
      setCurrentStation(missionsListForEdit[0]?.station?.actionName)
    }
  }, [missionsListForEdit])
  return (
    <>
      <div>
        <OrderNowIcon />
        <Stack alignItems={"center"} gap={"5px"} marginBottom={5}>
          <span style={clasess.modalTitleForMission}>
            {t("sales.quote.currentStatioTitle")}
          </span>

          <span style={clasess.modalSubTitleForMission}>
            {t("sales.quote.currentStationSubTitle")}
          </span>
        </Stack>
        {/* <div onClick={onClickCloseCurrentStationModal} style={clasess.modalCloseForMission}>
          <Tooltip title={t("modal.close")}>
            <IconButton>
              <RoundedCloseIcon />
            </IconButton>
          </Tooltip>
        </div> */}
      </div>
      <div style={clasess.mainContainerForMission}>
        {missionsListForEdit?.map((mission, index) => {
          return (
            <div
              key={index}
              style={clasess.missionItemContainer}
            >
              <div style={clasess.missionText1}>{mission?.number}</div> -
              {mission?.productType &&
                <>
                  <div style={clasess.missionText}>{mission?.productType}</div>:
                </>
              }
              {
                mission?.station?.actionName && (
                  <div style={clasess.missionText}>{mission?.station?.actionName}</div>
                )
              }
              {mission?.station?.employeeName && (
                <div
                  style={clasess.missionText2}
                >
                  | {mission?.station?.employeeName}
                </div>
              )}
              {mission?.station?.machineName !== "" || mission?.station?.machineName !== "-" && (
                <div
                  style={clasess.missionText2}
                >
                  | {mission?.station?.machineName}
                </div>
              )}
              {
                mission?.boardMissionStatus?.name && (
                  <>
                    <span style={clasess.deviderContainer}> | </span>
                    <div
                      style={{
                        background: mission?.boardMissionStatus?.backgroundColor,
                        color: mission?.boardMissionStatus?.textColor,
                        padding: 5,
                        width: "fit-content",
                        minWidth: 100,
                      }}
                    >
                      {mission?.boardMissionStatus?.name}
                    </div>
                  </>
                )
              }

            </div>
          )
        })}
      </div>
      <div style={clasess.checkboxModalContainer} onClick={() => setDisabledBtns(!disabledBtns)}>
        <Checkbox
          onChange={(e, checked) => setDisabledBtns(checked)}
          icon={<CheckboxIcon width={18} height={18} />}
          checkedIcon={<CheckboxCheckedIcon width={18} height={18} />}
          checked={disabledBtns}
        />
        <div style={clasess.checkboxLabelStyle}>{t("sales.quote.missionLabelCheclbox")}</div>
      </div>

      <div style={clasess.btnsContainer}>
        <GomakePrimaryButton
          style={{ ...clasess.confirmBtn, backgroundColor: disabledBtns ? primaryColor(500) : "#36208E33", height: 40 }}
          onClick={() => updateQuoteItem(true)}
          disabled={!disabledBtns}
        >
          {t("sales.quote.saveCurrentJopStation", {
            stationName: currentStation
          })}
        </GomakePrimaryButton>{" "}
        <GomakePrimaryButton
          style={{ ...clasess.cancelBtn, backgroundColor: disabledBtns ? primaryColor(500) : "#36208E33", height: 40 }}
          onClick={() => updateQuoteItem(false)}
          disabled={!disabledBtns}>
          {t("sales.quote.revertJopStation")}
        </GomakePrimaryButton>
        <GomakePrimaryButton
          style={{
            height: 40,
            borderRadius: "10px",
            ...FONT_FAMILY.Lexend(500, 16),
            backgroundColor: "#FFF",
            color: "#344054",
            border: `1px solid #D0D5DD`,
          }}
          onClick={onClickCloseCurrentStationModal}
        >
          {t("sales.quote.cancel")}
        </GomakePrimaryButton>
      </div>

    </>
  );
};

export { MissionModalWidget };
