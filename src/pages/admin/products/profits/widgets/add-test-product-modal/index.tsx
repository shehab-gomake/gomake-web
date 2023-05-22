import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";

import { useStyle } from "./style";
import { profitsState } from "../../store/profits";
import { useRecoilValue } from "recoil";
import { AddIcon } from "@/icons";

const AddTestProductModal = () => {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const profitsStateValue = useRecoilValue<any>(profitsState);

  return (
    <>
      <GoMakeModal
        openModal={profitsStateValue?.openAddTestProductModal}
        modalTitle={t("products.profits.addNewTestProduct")}
        onClose={() => profitsStateValue?.setOpenAddTestProductModal(false)}
        insideStyle={clasess.insideStyle}
      >
        <div style={clasess.mainCointainer}>
          <div style={clasess.selectTypeStyle}>
            {t("products.profits.selectProduct")}
          </div>
          <div style={clasess.insideCointaner}>
            <GoMakeAutoComplate
              options={profitsStateValue?.productsStateValue}
              placeholder={t("products.profits.selectProduct")}
              getOptionLabel={(value: any) => value.name}
              onChange={(e: any, item: any) => {
                profitsStateValue?.onChangeAddNewTestProduct(
                  item?.name,
                  item?.id
                );
              }}
            />
            <div style={clasess.btnCointainer}>
              <div style={clasess.addBtnStyle}>
                <GomakePrimaryButton
                  style={clasess.btnStyle}
                  onClick={profitsStateValue?.onClickSendNewProduct}
                >
                  {t("products.profits.startTest")}
                </GomakePrimaryButton>
              </div>
            </div>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddTestProductModal };
