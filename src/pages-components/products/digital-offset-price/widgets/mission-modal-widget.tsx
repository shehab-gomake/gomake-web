import React, { useEffect, useState } from 'react';
import { Tooltip, IconButton, Checkbox } from '@mui/material';
import { GomakePrimaryButton } from '@/components';
import { RoundedCloseIcon } from '@/components/modal/icon/close';
import { useTranslation } from 'react-i18next';
import { CheckboxCheckedIcon, CheckboxIcon } from '@/icons';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { FONT_FAMILY } from '@/utils/font-family';

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
  console.log("missionsListForEdit", missionsListForEdit)
  return (
    <>
      <div>
        <div style={clasess.modalTitleForMission}>
          {t('sales.quote.currentStatioTitle')}
        </div>
        <div onClick={onClickCloseCurrentStationModal} style={clasess.modalCloseForMission}>
          <Tooltip title={t("modal.close")}>
            <IconButton>
              <RoundedCloseIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div style={clasess.mainContainerForMission}>
        {missionsListForEdit?.map((mission, index) => {
          console.log("mission", mission)
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
          icon={<CheckboxIcon />}
          checkedIcon={<CheckboxCheckedIcon />}
          checked={disabledBtns}
        />
        <div style={clasess.checkboxLabelStyle}>{t("sales.quote.missionLabelCheclbox")}</div>
      </div>

      <div style={clasess.btnsContainer}>
        <GomakePrimaryButton
          style={{ ...clasess.confirmBtn, backgroundColor: disabledBtns ? primaryColor(500) : "#36208E33" }}
          onClick={() => updateQuoteItem(true)}
          disabled={!disabledBtns}
        >
          {t("sales.quote.saveCurrentJopStation", {
            stationName: currentStation
          })}
        </GomakePrimaryButton>{" "}
        <GomakePrimaryButton
          style={{ ...clasess.cancelBtn, backgroundColor: disabledBtns ? errorColor(500) : "#B9363633" }}
          onClick={() => updateQuoteItem(false)}
          disabled={!disabledBtns}>
          {t("sales.quote.revertJopStation")}
        </GomakePrimaryButton>
        <GomakePrimaryButton
          style={{
            height: 35,
            borderRadius: "10px",
            ...FONT_FAMILY.Lexend(500, 12),
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
