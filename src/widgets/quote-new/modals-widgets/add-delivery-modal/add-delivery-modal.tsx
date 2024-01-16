import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";
import { useEffect, useState } from "react";
import { useStyle } from "../style";
import { useQuoteGetData } from "@/pages-components/quote-new/use-quote-get-data";

const AddDeliveryModal = ({ openModal, onClose, onClickAdd }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const { getAllShipmentTypes, shipmentTypes } = useQuoteGetData();
  const [deliveryTypeValue, setDeliveryTypeValue] = useState<{ label: string, value: string }>();

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
        modalTitle={t("sales.quote.addDeliveryTitle")}
        onClose={handleModalClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.autoComplateRowContainer}>
            <div style={{ width: "100%", marginTop: 15 }}>
              <GoMakeAutoComplate
                options={shipmentTypes}
                value={deliveryTypeValue}
                placeholder={t("sales.quote.selectDelivery")}
                style={classes.selectTypeContainer}
                onChange={(e: any, value: any) => {
                  setDeliveryTypeValue(value);
                }}
              />
            </div>
          </div>
          <div style={classes.btnContainer}>
            <GomakePrimaryButton
              style={classes.sendBtn}
              onClick={() => onClickAdd(deliveryTypeValue?.value)}
            >
              {t("sales.quote.add")}
            </GomakePrimaryButton>
          </div>
        </div>
      </GoMakeModal>
    </>
  );
};
export { AddDeliveryModal };