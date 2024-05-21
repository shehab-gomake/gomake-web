import React, { SyntheticEvent, useCallback, useRef, useState } from "react";
import { GoMakeAutoComplate } from "@/components";
import {useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {
  currenciesState, isAllMaterialsCheckedState,
  materialCategoryDataState,
  selectedMaterialIdForUpdateState
} from "@/widgets/materials-widget/state";
import { useTableCellData } from "@/widgets/materials-widget/components/table-cell-data/use-table-cell-data";
import { ClickOutside } from "@/components/click-out-side/click-out-side";
import { Paper } from "@mui/material";
import { PrimaryButton } from "@/components/button/primary-button";
import { useStyle } from "@/widgets/materials-widget/style";
import { EMaterialsActions } from "../../enums";
import { actionMenuState } from "@/store";
import {IMaterialCategoryRow} from "@/widgets/materials-widget/interface";

interface ICurrencyInputProps {
  value: string;
  id: string;
  isAdmin: boolean;
  onChangeRowCheckBox?: any;
}

const CurrencyInput = ({
  value,
  id,
  isAdmin,
  onChangeRowCheckBox,
}: ICurrencyInputProps) => {
  const { classes } = useStyle();
  const [isUpdate, setIsUpdate] = useState<boolean>(false);
  const currencies = useRecoilValue(currenciesState);
  const { updateCellData } = useTableCellData(isAdmin);
  const setSelectedMaterialIdForUpdate = useSetRecoilState(selectedMaterialIdForUpdateState);
  const [materialCategoryData, setMaterialCategoryData] = useRecoilState<
      IMaterialCategoryRow[]
  >(materialCategoryDataState);
  const [isAllMaterialsChecked, setIsAllMaterialsChecked] =
      useRecoilState<boolean>(isAllMaterialsCheckedState);
  const popUpRef = useRef(null);
  const onSelectLanguage = async (event: SyntheticEvent, value) => {
    await updateCellData(id, "currency", value?.value);
    setIsUpdate(false);
  };
  const currencyName = useCallback(() => {
    return currencies?.find(
      (c) => c.value.toLowerCase() === value.toLowerCase()
    )?.label;
  }, [value, currencies]);

  const [action, setAction] = useRecoilState<{
    action: EMaterialsActions;
    key: string;
  } | null>(actionMenuState);
  const onClickActionModal = () => {
    //onChangeRowCheckBox(id, true);
    setIsAllMaterialsChecked(false)
    setMaterialCategoryData(materialCategoryData.map(x=> {return {...x,checked:false}}))
    setSelectedMaterialIdForUpdate(id)
    setAction({
      key: "UpdateCurrency",
      action: 0,
    });
  };
  return (
    <>
      {isUpdate ? (
        <div style={{ minWidth: "80px" }}>
          <ClickOutside
            exceptionRef={popUpRef}
            onClick={() => setIsUpdate(false)}
          >
            <GoMakeAutoComplate
              disableClearable={true}
              value={value}
              options={currencies}
              onChange={onClickActionModal}
              PaperComponent={(props) => {
                return (
                  <Paper ref={popUpRef} elevation={8} {...props}>
                    {props?.children}
                  </Paper>
                );
              }}
            />
          </ClickOutside>
        </div>
      ) : (
        <PrimaryButton
          sx={classes.clickableData}
          onClick={() => onClickActionModal()}
          variant={"text"}
        >
          {currencyName()}
        </PrimaryButton>
      )}
    </>
  );
};

export { CurrencyInput };
