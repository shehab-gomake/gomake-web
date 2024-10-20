import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { GomakePrimaryButton } from '@/components';
import { RoundedCloseIcon } from '@/components/modal/icon/close';
import { useTranslation } from 'react-i18next';

const MissionModalWidget = ({ onClickCloseCurrentStationModal, missionsListForEdit, clasess, updateQuoteItem }) => {
  const { t } = useTranslation();
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
            <div style={clasess.missionText}>{mission?.productType}</div>:
            <div style={clasess.missionText}>{mission?.station?.actionName}</div>
            {mission?.employeeName && (
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
      <div style={clasess.btnsContainer}>
        <GomakePrimaryButton
          style={clasess.confirmBtn}
          onClick={() => updateQuoteItem(true)}
        >
          {t("sales.quote.saveCurrentJopStation")}
        </GomakePrimaryButton>{" "}
        <GomakePrimaryButton style={clasess.cancelBtn} onClick={() => updateQuoteItem(false)}>
          {t("sales.quote.revertJopStation")}
        </GomakePrimaryButton>
      </div>

    </>
  );
};

export { MissionModalWidget };
