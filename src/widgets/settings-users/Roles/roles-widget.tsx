import { useRoles } from "./use-roles";
import { useEffect } from "react";
import { PrimaryTable } from "@/components/tables/primary-table";
import { GoMakeModal } from "@/components";
import { AddUpdateRole } from "../Permissions/components/add-update-role";
import { EActions } from "../Permissions/enum/actions";
import { useStyle } from "./style";
import { FONT_FAMILY } from "@/utils/font-family";

const RolesWidget = () => {
  const { classes } = useStyle();
  const {
    t,
    getAllRoles,
    tableHeaders,
    allRoles,
    modalState,
    modalInputValue,
    setModalState,
    setModalInputValue,
    updateRoleName,
    deleteRole,
    deleteModalState,
    setDeleteModalState,
  } = useRoles();

  useEffect(() => {
    getAllRoles();
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <PrimaryTable
        stickyHeader={true}
        rows={allRoles}
        headers={tableHeaders}
        maxHeight={"calc(100vh - 280px)"}
        columnWidths={["50%", "50%"]}
      />
      <GoMakeModal
        insideStyle={classes.insideStyle}
        headerPadding={20}
        openModal={modalState}
        onClose={() => setModalState(false)}
        modalTitle={t("permissionsSettings.editRole")}
      >
        <AddUpdateRole
          onActionClick={updateRoleName}
          action={EActions.UPDATE}
          value={modalInputValue}
          onChange={(v) => {
            setModalInputValue(v);
          }}
        />
      </GoMakeModal>
      <GoMakeModal
        insideStyle={classes.insideStyle}
        headerPadding={20}
        openModal={deleteModalState}
        onClose={() => setDeleteModalState(false)}
        modalTitle={t("permissionsSettings.deleteRole")}
        modalTitleStyle={{ ...FONT_FAMILY.Inter(500, 22) }}
        withRoundedCloseIcon={false}
      >
        <AddUpdateRole
          onActionClick={deleteRole}
          action={EActions.DELETE}
          onClose={() => setDeleteModalState(false)}
        />
      </GoMakeModal>
    </div>
  );
};

export { RolesWidget };
