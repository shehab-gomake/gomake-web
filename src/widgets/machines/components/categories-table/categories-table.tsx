import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { EditIcon } from "@/components/icons/edit-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { useCallback, useState } from "react";
import { SecondaryButton } from "@/components/button/secondary-button";
import AddIcon from "@mui/icons-material/Add";
import { ICategoriesTableProps } from "./interface";
import { PrimaryTable } from "@/components/tables/primary-table";
import { PrimaryButton } from "@/components/button/primary-button";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";
import {useTranslation} from "react-i18next";
import { PermissionCheck } from "@/components/CheckPermission/check-permission";
import {Permissions} from "@/components/CheckPermission/enum";
import { useUserPermission } from "@/hooks/use-permission";

const CategoriesTable = ({ isAdmin }: ICategoriesTableProps) => {
  const [filter, setFilter] = useState<string>("");
  const {t} = useTranslation();
  const { primaryColor } = useGomakeTheme();
  const categoriesList = useRecoilValue(machineCategoriesState); 
  const { CheckPermission } = useUserPermission();
  const { classes } = useStyle();
  const categories = useCallback(() => {
    if (!!filter) {
      return categoriesList.filter((category) =>
        t(category.name).toLowerCase().includes(filter.toLowerCase())
      );
    }
    return categoriesList;
  }, [filter, categoriesList]);

  const tableHeaders = [
    t('machineAttributes.category'),
    CheckPermission(Permissions.EDIT_MACHINE) ? t('machineAttributes.editMachine') : null,
  ];
  const tableRows = categories()?.map((category) => [
    <>{t(category.name)}</>,
    <PermissionCheck userPermission={Permissions.EDIT_MACHINE} >
    <PrimaryButton
      startIcon={<EditIcon color={primaryColor(500)} width={20} height={20} />}
      href={
        isAdmin
          ? `/machines-admin/category/${category.id}`
          : `/machines/category/${category.id}`
      }
      variant={"text"}
    >
      {t('machineAttributes.edit')}
    </PrimaryButton>
    </PermissionCheck>,
  ]);

  return (
    <div style={classes.mainContainer}>
      <HeaderTitleWithSearch title={t('machineAttributes.machines')} onChange={(e) => setFilter(e)} />
      {!!isAdmin && (
        <SecondaryButton
          style={classes.addMachineBtn}
          variant={"contained"}
          href={`/machines-admin/add-machine`}
          startIcon={<AddIcon />}
        >
          Add Machine
        </SecondaryButton>
      )}
      <PrimaryTable stickyFirstCol={false} stickyHeader={false} rows={tableRows} headers={tableHeaders} />
    </div>
  );
};
export { CategoriesTable };
