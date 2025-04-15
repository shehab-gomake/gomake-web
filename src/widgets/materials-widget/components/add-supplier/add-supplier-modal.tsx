import { GoMakeAutoComplate, GoMakeModal } from "@/components";
import Stack from "@mui/material/Stack";
import { SecondaryButton } from "@/components/button/secondary-button";
import { useAddMaterialSupplier } from "@/widgets/materials-widget/components/add-supplier/use-add-material-supplier";
import { useMaterials } from "../../use-materials";
import { useTranslation } from "react-i18next";
import { FONT_FAMILY } from "@/utils/font-family";
import { IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { isValidCustomer } from "@/utils/helpers";
import { CLIENT_TYPE_Id, CUSTOMER_ACTIONS } from "@/pages/customers/enums";
import { CustomerCardWidget } from "@/widgets/customer-card-modal/customer-card";
import { useClientTypesList } from "@/hooks/use-client-types";
import { useCustomerDropDownList } from "@/hooks/use-customer-drop-down-list";

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
  const {} = useClientTypesList(true, CLIENT_TYPE_Id.SUPPLIER);
  const { supplierList } = useCustomerDropDownList({
    shouldRenderCustomersOnMount: false,
    shouldRenderSuppliersOnMount: true,
  });

  const renderSuppliersOptions = () => {
    return supplierList.map((supplier) => ({
      value: supplier.id,
      label: supplier.name,
    }));
  };

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
            <GoMakeAutoComplate
              key={newSupplier?.value}
              onChange={onSelectSupplier}
              options={renderSuppliersOptions()}
              placeholder={t("materials.sheetPaper.selectASupplier")}
              style={{ minWidth: "180px" }}
              value={newSupplier}
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
        isValidCustomer={isValidCustomer}
        customerAction={CUSTOMER_ACTIONS.Add}
        typeClient={"S"}
        onCustomerAdd={onSupplierAdd}
        openModal={openSupplierModal}
        modalTitle={t("suppliers.addModalTitle")}
        onClose={onCloseSupplierModal}
        showAddButton={true}
        customer={supplier}
        setCustomer={setSupplier}
      />
    </>
  );
};

export { AddSupplierModal };
