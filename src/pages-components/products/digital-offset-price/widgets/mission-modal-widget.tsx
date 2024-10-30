import React, { useState } from 'react';
import { Tooltip, IconButton, Checkbox } from '@mui/material';
import { GomakePrimaryButton } from '@/components';
import { RoundedCloseIcon } from '@/components/modal/icon/close';
import { useTranslation } from 'react-i18next';
import { CheckboxCheckedIcon, CheckboxIcon } from '@/icons';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';

const MissionModalWidget = ({ onClickCloseCurrentStationModal, missionsListForEdit, clasess, updateQuoteItem }) => {
  const { t } = useTranslation();
  const { primaryColor, errorColor } = useGomakeTheme();
  const [disabledBtns, setDisabledBtns] = useState(false)
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
        {missionsListForEdit?.map((mission, index) => (
          <div
            key={index}
            style={clasess.missionItemContainer}
          >
            <div style={clasess.missionText1}>{mission?.number}</div> -
            {mission?.productType && <>
              <div style={clasess.missionText}>{mission?.productType}</div>:</>}
            <div style={clasess.missionText}>{mission?.station?.actionName}</div>
            {mission?.station?.employeeName && (
              <div
                style={clasess.missionText2}
              >
                | {mission?.station?.employeeName}
              </div>
            )}
            {mission?.station?.machineName && (
              <div
                style={clasess.missionText2}
              >
                | {mission?.station?.machineName}
              </div>
            )}
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
          </div>
        ))}
      </div>
      <div style={clasess.checkboxModalContainer} onClick={() => setDisabledBtns(!disabledBtns)}>
        <Checkbox
          onChange={(e, checked) => setDisabledBtns(checked)}
          icon={<CheckboxIcon />}
          checkedIcon={<CheckboxCheckedIcon />}
          checked={disabledBtns}
        />
        <div style={clasess.checkboxLabelStyle}>Yes, I have read it very carefully</div>
      </div>

      <div style={clasess.btnsContainer}>
        <GomakePrimaryButton
          style={{ ...clasess.confirmBtn, backgroundColor: disabledBtns ? primaryColor(500) : "#36208E33" }}
          onClick={() => updateQuoteItem(true)}
          disabled={!disabledBtns}
        >
          {t("sales.quote.saveCurrentJopStation")}
        </GomakePrimaryButton>{" "}
        <GomakePrimaryButton
          style={{ ...clasess.cancelBtn, backgroundColor: disabledBtns ? errorColor(500) : "#B9363633" }}
          onClick={() => updateQuoteItem(false)}
          disabled={!disabledBtns}>
          {t("sales.quote.revertJopStation")}
        </GomakePrimaryButton>
      </div>

    </>
  );
};

export { MissionModalWidget };
