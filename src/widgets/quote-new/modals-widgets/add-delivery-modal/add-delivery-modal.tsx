import { useTranslation } from "react-i18next";
import {
  GoMakeAutoComplate,
  GoMakeModal,
  GomakePrimaryButton,
} from "@/components";
import { useEffect, useState } from "react";
import { useStyle } from "../style";

const AddDeliveryModal = ({ openModal, onClose , onClickAdd }) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [deliveryTypeValue, setDeliveryTypeValue] = useState<{label: string, value: string}>();


  useEffect(() => {
   // getAllDeliveryTypes();
  }, []);

  const deliveries = [
    { label: t("delivery type 1"), value: "true" },
    { label: t("delivery type 2"), value: "false" },
  ];

  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={t("sales.quote.addDeliveryTitle")}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <div style={classes.mainContainer}>
          <div style={classes.autoComplateRowContainer}>
            <div style={{ width: "100%", marginTop: 15 }}>
              <GoMakeAutoComplate
                options={deliveries}
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
              onClick={()=>onClickAdd(deliveryTypeValue?.label)}
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
