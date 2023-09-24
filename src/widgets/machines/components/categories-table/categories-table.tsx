import { styled } from "@mui/material/styles";
import {
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FONT_FAMILY } from "@/utils/font-family";
import { useRecoilValue } from "recoil";
import { machineCategoriesState } from "@/store/machine-categories";
import { EditIcon } from "@/components/icons/edit-icon";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
import { useStyle } from "@/widgets/machines/components/categories-table/style";
import { GomakeTextInput } from "@/components";
import { useCallback, useState } from "react";
import { SecondaryButton } from "@/components/button/secondary-button";
import AddIcon from "@mui/icons-material/Add";
import { ICategoriesTableProps } from "./interface";
import { PrimaryTable } from "@/components/tables/primary-table";
import { PrimaryButton } from "@/components/button/primary-button";
import { HeaderTitleWithSearch } from "@/widgets/header-title-with-search";

const CategoriesTable = ({ isAdmin }: ICategoriesTableProps) => {
  const [filter, setFilter] = useState<string>("");
  const { primaryColor } = useGomakeTheme();
  const categoriesList = useRecoilValue(machineCategoriesState);
  const { classes } = useStyle();
  const categories = useCallback(() => {
    if (!!filter) {
      return categoriesList.filter((category) =>
        category.name.toLowerCase().includes(filter.toLowerCase())
      );
    }
    return categoriesList;
  }, [filter, categoriesList]);

  const tableHeaders = [
    "Category",
    "internal/Out source",
    "active",
    "edit machine",
  ];
  const tableRows = categories()?.map((category) => [
    category.name,
    " ",
    " ",
    <PrimaryButton
      startIcon={<EditIcon color={primaryColor(500)} width={20} height={20} />}
      href={
        isAdmin
          ? `/admin/machine/category/${category.id}`
          : `/machines/category/${category.id}`
      }
      variant={"text"}
    >
      Edit
    </PrimaryButton>,
  ]);

  return (
    <div style={classes.mainContainer}>
      <HeaderTitleWithSearch title="Machines" onChange={(e) => setFilter(e)} />
      {!!isAdmin && (
        <SecondaryButton
          style={classes.addMachineBtn}
          variant={"contained"}
          href={`/admin/machine/add-machine`}
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
