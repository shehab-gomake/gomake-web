import React from 'react';
import { Tooltip, IconButton } from '@mui/material';
import { GomakePrimaryButton } from '@/components';
import { FONT_FAMILY } from '@/utils/font-family';
import { useGomakeTheme } from '@/hooks/use-gomake-thme';
import { RoundedCloseIcon } from '@/components/modal/icon/close';
import { useTranslation } from 'react-i18next';

const MissionModalWidget = ({ onClickCloseCurrentStationModal, missionsListForEdit, clasess, updateQuoteItem }) => {
  const { primaryColor } = useGomakeTheme();
  const { t } = useTranslation();
  return (
    <>
      <div>
        <div style={{
          margin: 15, marginTop: 0, ...FONT_FAMILY.Lexend(700, 16),
          color: primaryColor(500),
        }}>
          {t('sales.quote.currentStatioTitle')}
        </div>
        <div onClick={onClickCloseCurrentStationModal} style={{ position: "absolute", right: 0, top: 0 }}>
          <Tooltip title={t("modal.close")}>
            <IconButton>
              <RoundedCloseIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {missionsListForEdit?.map((mission, index) => (
          <div
            key={index}
            style={{
              ...FONT_FAMILY.Lexend(500, 14),
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ width: "fit-content", minWidth: 80 }}>{mission?.number}</div> -
            <div style={{ width: "fit-content", minWidth: 100 }}>{mission?.productType}</div>:
            <div style={{ width: "fit-content", minWidth: 100 }}>{mission?.station?.actionName}</div>
            {mission?.clientName && (
              <div
                style={{
                  width: "fit-content",
                  maxWidth: "fit-content",
                  minWidth: 100,
                  whiteSpace: "nowrap",
                }}
              >
                | {mission?.clientName}
              </div>
            )}
            {mission?.station?.machineName && (
              <div
                style={{
                  width: "fit-content",
                  maxWidth: "fit-content",
                  minWidth: 100,
                  whiteSpace: "nowrap",
                }}
              >
                | {mission?.station?.machineName}
              </div>
            )}
            <span style={{ paddingLeft: 5, paddingRight: 5 }}> | </span>
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
