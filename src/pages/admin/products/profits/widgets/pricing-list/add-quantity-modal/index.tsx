import {
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useStyle } from "./style";
import { useTranslation } from "react-i18next";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  actionExceptionProfitId,
  actionProfitLists,
  actionProfitRowsState,
} from "@/store";
import { useEffect } from "react";

const AddQuantityModal = ({
  openModal,
  onCloseModal,
  profitsStateValue,
}: any) => {
  const { t } = useTranslation();
  const actionExceptionProfitIdValue = useRecoilValue<any>(
    actionExceptionProfitId
  );
  const [actionProfitRowsNew, setActionProfitRowsNew] = useRecoilState<any>(
    actionProfitRowsState
  );
  const { clasess } = useStyle();

  useEffect(() => {
    actionProfitRowsNew &&
      profitsStateValue?.onChangeAddPricingListRow(
        "cost",
        actionProfitRowsNew[actionProfitRowsNew?.length - 1]?.cost
      );
    setTimeout(() => {
      profitsStateValue?.onChangeAddPricingListRow(
        "profit",
        actionProfitRowsNew[actionProfitRowsNew?.length - 1]?.profit
      );
    }, 500);
  }, [actionProfitRowsNew]);
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle="Add quantity"
        onClose={onCloseModal}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainContainer}>
          <GomakeTextInput
            placeholder="Quantity"
            style={clasess.textInputStyle}
            value={profitsStateValue?.pricingListRowState?.quantity}
            onChange={(e: any) => {
              profitsStateValue?.onChangeAddPricingListRow(
                "quantity",
                e.target.value
              );
            }}
          />
          <div style={clasess.btnContainer}>
            <GomakePrimaryButton
              style={clasess.btnStyle}
              // onClick={async () => {
              //   await profitsStateValue?.onClickSaveNewActionProfitRow();
              //   onCloseModal();
              // }}
              onClick={
                actionExceptionProfitIdValue
                  ? profitsStateValue?.onClickSaveNewActionExceptionProfitRow
                  : profitsStateValue?.onClickSaveNewActionProfitRow
              }
            >
              Add
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};

export { AddQuantityModal };
