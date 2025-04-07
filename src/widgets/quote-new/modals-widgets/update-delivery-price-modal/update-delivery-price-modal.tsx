import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
  GomakeTextInput,
} from "@/components";
import { useEffect, useState } from "react";
import { useStyle } from "../style";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";
import { quoteItemState } from "@/store/quote-item";
import { useRecoilState } from "recoil";

const UpdateDeliveryPriceModal = ({ openModal, onClose, onClickAdd }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { getAllShipmentTypes, shipmentTypes } = useQuoteGetData();
  const [deliveryTypeValue, setDeliveryTypeValue] = useState<{ label: string, value: string }>();
  const [quoteItemValue, setQuoteItemValue] = useRecoilState<any>(quoteItemState);
  const [deliveryPriceValue, setDeliveryPriceValue] = useState<string>(quoteItemValue?.deliveryPrice);
  useEffect(() => {
    if (quoteItemValue?.deliveryPrice) {
      setDeliveryPriceValue(quoteItemValue?.deliveryPrice);
    }
  }, [quoteItemValue?.deliveryPrice, openModal]);
  useEffect(() => {
    getAllShipmentTypes();
  }, []);

  const handleModalClose = () => {
    setDeliveryTypeValue(undefined);
    onClose();
  };

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.updateDelivery")}
        onClose={() => {
          setDeliveryPriceValue(undefined);
          handleModalClose()
        }}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.autoComplateRowContainer}>
            <div style={{ width: "100%", marginTop: 15 }}>
              <div style={{ width: "100%", marginTop: 15 }}>
                <GomakeTextInput
                  placeholder={t("sales.quote.deliveryPrice")}
                  value={deliveryPriceValue}
                  onChange={(e: any, value: any) => {
                    setDeliveryPriceValue(e.target.value);
                  }}
                />
              </div>

            </div>
          </div>
          <div style={classes.btnContainer}>
            <GomakePrimaryButton
              style={classes.sendBtn}
              onClick={() => onClickAdd(null, deliveryPriceValue)}
            >
              {t("sales.quote.updateDelivery")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { UpdateDeliveryPriceModal };