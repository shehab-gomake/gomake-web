import { useTranslation } from "react-i18next";
import { GoMakeModal, GomakePrimaryButton } from "@/components";
import { Button, Stack } from "@mui/material";

import { useStyle } from "./style";
import { UpdateTypes } from "../parameters/widgets/section-mapping";
import { CircleCheckbox } from "@/components/check-box/circle-check-box";
import { useState } from "react";
import {
  copyActionsToProductsApi,
  copyProductHotFolderRulesApi,
} from "@/services/api-service/products/product-endpoints";
import { useRouter } from "next/router";
import { useGomakeAxios } from "@/hooks";
const CopyAnotherProductsModal = ({
  openModal,
  onClose,
  isHotFolderWidget,
}: any) => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const router = useRouter();
  const { callApi } = useGomakeAxios();

  const [selectedUpdateType, setSelectedUpdateType] = useState<UpdateTypes>(
    UpdateTypes.SAME_PRICING_TYPE
  );
  const copyActionsToProducts = async () => {
    const productId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        onClose();
      }
    };
    await copyActionsToProductsApi(callApi, callBack, {
      productId: productId,
      updateType: selectedUpdateType,
    });
  };

  const copyProductHotFolderRules = async () => {
    const productId = Array.isArray(router.query.id)
      ? router.query.id[0]
      : router.query.id;
    const callBack = (res) => {
      if (res.success) {
        onClose();
      }
    };
    await copyProductHotFolderRulesApi(callApi, callBack, {
      productId: productId,
      duplicateType: selectedUpdateType,
    });
  };
  return (
    <>
      <GoMakeModal
        openModal={openModal}
        modalTitle={"Where would you like to copy this product?"}
        onClose={onClose}
        insideStyle={classes.insideStyle}
      >
        <Stack direction={"column"} gap={"5px"} paddingBottom={"20px"}>
          {/* <Stack direction={"row"} width={"100%"} alignItems={"center"}>
            <CircleCheckbox
              checked={selectedUpdateType === UpdateTypes.PRODUCT_ONLY}
              onChange={() => setSelectedUpdateType(UpdateTypes.PRODUCT_ONLY)}
            />
            <span style={classes.optionsTitle}>
              {t("products.parameters.productOnly")}
            </span>
          </Stack> */}
          <Stack direction={"row"} width={"100%"} alignItems={"center"}>
            <CircleCheckbox
              checked={selectedUpdateType === UpdateTypes.SAME_PRICING_TYPE}
              onChange={() =>
                setSelectedUpdateType(UpdateTypes.SAME_PRICING_TYPE)
              }
            />
            <span style={classes.optionsTitle}>
              {t("products.parameters.samePricingType")}
            </span>
          </Stack>

          <Stack direction={"row"} width={"100%"} alignItems={"center"}>
            <CircleCheckbox
              checked={selectedUpdateType === UpdateTypes.ALL_PRODUCTS}
              onChange={() => setSelectedUpdateType(UpdateTypes.ALL_PRODUCTS)}
            />
            <span style={classes.optionsTitle}>
              {t("products.parameters.allProducts")}
            </span>
          </Stack>
        </Stack>
        <Stack direction={"row"} gap={"10px"}>
          <Button style={classes.cancelButton} onClick={onClose}>
            {t("modal.cancel")}
          </Button>
          <GomakePrimaryButton
            style={{
              width: "50%",
              borderRadius: "8px",
              height: "44px",
            }}
            onClick={
              isHotFolderWidget
                ? copyProductHotFolderRules
                : copyActionsToProducts
            }
          >
            {t("sales.quote.duplicate")}
          </GomakePrimaryButton>
        </Stack>
      </GoMakeModal>
    </>
  );
};
export { CopyAnotherProductsModal };
