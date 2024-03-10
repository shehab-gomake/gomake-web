import { QuantityTypesComponent } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/quantity-types-component";
import { useQuantityParameter } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/use-quantity-parameter";
import { SettingsIcon } from "@/icons/settings";
import { GoMakeModal } from "@/components";
import { IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";

const QuantityParameter = () => {
  const { openModal, setOpenModal, productTypesNumber, productSetsParam, t } = useQuantityParameter();
  return (
    <Stack direction={"row"}>
      {productTypesNumber > 1 && productSetsParam != "true" && (
        <IconButton
          onClick={() => {
            setOpenModal(true);
          }}
        >
          <SettingsIcon
            stroke={"rgba(237, 2, 140, 1)"}
            width={24}
            height={24}
          />
        </IconButton>
      )}
      {openModal && <GoMakeModal
        insideStyle={{
          width: 420,
          height: 680,
        }}
        modalTitle={t("quantityTypes.title")}
        openModal={openModal}
        onClose={() => setOpenModal(false)}
      >
        <QuantityTypesComponent />
      </GoMakeModal>}
    </Stack>
  );
};

export { QuantityParameter };
