import { QuantityTypesComponent } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/quantity-types/quantity-types-component";
import { useQuantityParameter } from "@/pages-components/products/digital-offset-price/widgets/render-parameter-widgets/quantity-parameter/use-quantity-parameter";
import { SettingsIcon } from "@/icons/settings";
import { GoMakeModal } from "@/components";
import { IconButton } from "@mui/material";
import Stack from "@mui/material/Stack";

const QuantityParameter = ({ subSection, section }) => {
  const { openModal, setOpenModal, productTypesNumber, productSetsParam, t } = useQuantityParameter();
  return (
    <Stack direction={"row"}>

      {<GoMakeModal
        insideStyle={{
          width: 420,
          height: 725,
        }}
        modalTitle={t("quantityTypes.title")}
        openModal={openModal}
        onClose={() => setOpenModal(false)}
      >
        <QuantityTypesComponent subSection={subSection} section={section} />
      </GoMakeModal>}
    </Stack>
  );
};

export { QuantityParameter };
