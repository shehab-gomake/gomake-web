import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import Stack from "@mui/material/Stack";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAddMaterialSupplier } from "@/widgets/materials-widget/components/add-supplier/use-add-material-supplier";
import { useMaterials } from "../../use-materials";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import {
  CLIENT_TYPE,
  CLIENT_TYPE_Id,
  CUSTOMER_ACTIONS,
} from "@/pages/customers/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal/customer-card";
import { useClientTypesList } from "@/hooks/use-client-types";
import { useCustomerDropDownList } from "@/hooks/use-customer-drop-down-list";
import { ClientAutocomplete } from "@/widgets/Clients-Autocomplete/clients-list";

const AddSupplierModal = () => {
  const {
    onSelectSupplier,
    onAddSupplier,
    setOpenModal,
    openModal,
    supplier,
    setSupplier,
    openSupplierModal,
    setNewSupplier,
    newSupplier,
    onSupplierAdd,
    onClickAddSupplier,
    onCloseSupplierModal,
  } = useAddMaterialSupplier();
  const { materialCategories } = useMaterials(false);
  const { t } = useTranslation();
  const { } = useClientTypesList(true, CLIENT_TYPE_Id.SUPPLIER);
  const { renderOptions, checkWhatRenderArray, isFetching } =
    useCustomerDropDownList({
      clientType: CLIENT_TYPE.SUPPLIER,
    });

  return (
    <>
      <GoMakeModal
        modalTitle={t("materials.sheetPaper.chooseOrAddSupplier")}
        insideStyle={{
          width: "500px",
          height: "fit-content",
          padding: "20px",
          gap: "50px",
        }}
        openModal={openModal}
        onClose={() => {
          setOpenModal(false), setNewSupplier(null);
        }}
        modalTitleStyle={{
          ...FONT_FAMILY.Inter(600, 20),
          color: "#494045",
        }}
      >
        <Stack
          gap={2}
          justifyContent={"center"}
          height={"100%"}
          width={"90%"}
          margin={"auto"}
        >
          <Stack direction="row" alignItems="center" gap={1}>
            <ClientAutocomplete
              key={newSupplier?.value}
              clientType={CLIENT_TYPE.SUPPLIER}
              onChange={onSelectSupplier}
              options={renderOptions() ? renderOptions() : []}
              placeholder={t("materials.sheetPaper.selectASupplier")}
              style={{ minWidth: "180px" }}
              value={newSupplier}
              onChangeTextField={checkWhatRenderArray}
              getOptionLabel={(option: any) => `${option.name}`}
              loading={isFetching}
            />

            <Tooltip title={t("materials.sheetPaper.addNewSupplier")}>
              <IconButton onClick={onClickAddSupplier}>
                <AddIcon sx={{ color: "#f50057" }} />
              </IconButton>
            </Tooltip>
          </Stack>
          <SecondaryButton
            onClick={() => onAddSupplier(materialCategories)}
            variant={"contained"}
            sx={{ width: "100%" }}
          >
            {t("materials.modals.update")}
          </SecondaryButton>
        </Stack>
      </GoMakeModal>
      <CustomerCardWidget
        customerAction={CUSTOMER_ACTIONS.Add}
        typeClient={CLIENT_TYPE.SUPPLIER}
        onCustomerAdd={onSupplierAdd}
        openModal={openSupplierModal}
        onClose={onCloseSupplierModal}
        customer={supplier}
        setCustomer={setSupplier}
      />
    </>
  );
};

export { AddSupplierModal };
