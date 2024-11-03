import React, { useCallback, useEffect, useState } from "react";
import { GoMakeMenu } from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";
import { quoteItemState } from "@/store";
import { useGomakeAxios, useSnackBar } from "@/hooks";
import { getAllClientActiveBudgetsApi } from "@/services/api-service/generic-doc/documents-api";
import { Divider } from "@mui/material";
import { EHttpMethod } from "@/services/api-service/enums";

const BudgetsMenuForClient = ({ handleClose, open, anchorEl, documentType }) => {

  const { t } = useTranslation();
  const quoteStateValue = useRecoilValue<any>(quoteItemState);
  const { callApi } = useGomakeAxios();
  const { alertSuccessUpdate, alertFaultUpdate } = useSnackBar();
  const [allClientActiveBudgets, setAllClientActiveBudgets] = useState([]);
  const getAllClientActiveBudgets = async () => {
    const callBack = (res) => {
      if (res?.success) {
        setAllClientActiveBudgets(res.data);
      }
    };
    await getAllClientActiveBudgetsApi(callApi, callBack, {
      clientId: quoteStateValue?.client?.id,
    });
  };

  useEffect(() => {
    if (quoteStateValue?.client?.id) {
      getAllClientActiveBudgets()
    }
  }, [quoteStateValue?.client?.id])

  const { classes } = useStyle();

  const updateDocumentBudget = useCallback(async (budget) => {
    const res = await callApi(
      EHttpMethod.PUT,
      `/v1/erp-service/budgets/update-document-budget`,
      {
        documentType: documentType,
        documentId: quoteStateValue?.id,
        budgetId: budget.id
      }
    );
    if (res?.success) {
      alertSuccessUpdate();
    } else {
      alertFaultUpdate();
    }
  }, [documentType, quoteStateValue]);

  const onclickSelectBudget = (budget) => {
    updateDocumentBudget(budget)
    handleClose()
  }
  return (
    <GoMakeMenu
      handleClose={handleClose}
      open={open}
      anchorEl={anchorEl}
      style={classes.mainContainer}
    >
      <div style={classes.bodyContainer}>
        {allClientActiveBudgets.length > 0 ? (
          allClientActiveBudgets.map((budget) => (
            <div key={budget.id}>
              <div style={classes.menuTabStyle} onClick={() => onclickSelectBudget(budget)}>{budget.name}({budget.amount})</div>
              <Divider />
            </div>
          ))
        ) : (
          <div style={classes.menuTabStyle}>
            {t('sales.quote.noBudgetsAvailableFor')} {quoteStateValue?.client?.name}
          </div>
        )}
      </div>
    </GoMakeMenu>
  );
};

export { BudgetsMenuForClient };
