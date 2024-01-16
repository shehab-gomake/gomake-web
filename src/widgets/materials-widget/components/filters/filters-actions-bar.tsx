import { GoMakeAutoComplate, SecondSwitch } from "@/components";
import { ActionMenu } from "@/widgets/materials-widget/components/actions-menu/action-menu";
import Stack from "@mui/material/Stack";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMaterialFilters } from "@/widgets/materials-widget/components/filters/use-material-filters";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  materialsClientsState,
  materialsMachinesState,
  openAddSupplierModalState,
} from "@/widgets/materials-widget/state";
import { FONT_FAMILY } from "@/utils/font-family";
import { useGomakeTheme } from "@/hooks/use-gomake-thme";
interface FiltersActionsBarProps {
  isAdmin: boolean;
}
const FiltersActionsBar = (props: FiltersActionsBarProps) => {
  const { t } = useTranslation();
  const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);
  const { primaryColor, secondColor } = useGomakeTheme();

  const {
    onActiveFilterChange,
    activeFilterLabel,
    activeFilterOptions,
    materialSuppliers,
    supplierId,
    onSelectSupplier,
    onSetDefaultSupplier,
    materialTableFilters,
    setFilterValue,
  } = useMaterialFilters();
  const [supplierName, setSupplierName] = useState<{
    value: string;
    label: string;
    isDefault: boolean;
  } | null>({ value: "", label: "", isDefault: false });

  useEffect(() => {
    const index = materialSuppliers.map((s) => s.value).indexOf(supplierId);
    setSupplierName(index !== -1 ? materialSuppliers[index] : null);
  }, [supplierId, materialSuppliers]);
  const machinesCategories = useRecoilValue<any>(materialsMachinesState);

  const options = machinesCategories.map((machine) => ({
    ...machine,
    value: machine.id,
    label: `${machine.manufacturer} - ${machine.model}`,
  }));

  const clientsCategories = useRecoilValue<any>(materialsClientsState);
  const clientsOptions = clientsCategories.map((client) => ({
    ...client,
    value: client.id,
    label: `${client.name} - ${client.code}`,
  }));
  return (
    <Stack direction={"row"} gap={2} alignItems={"center"}>
      {materialTableFilters &&
        materialTableFilters.map(({ key, values }) => {
          if (key === "clients") {
            return (
              <GoMakeAutoComplate
                key={key}
                onChange={(e, v) =>
                  setFilterValue(
                    key,
                    v.map((item) => item.id)
                  )
                }
                style={{ width: "300px", height: 40, overflow: "scroll" }}
                options={clientsOptions}
                placeholder={key}
                multiple
              />
            );
          }
          if (key === "machines") {
            return (
              <GoMakeAutoComplate
                key={key}
                onChange={(e, v) =>
                  setFilterValue(
                    key,
                    v.map((item) => item.id)
                  )
                }
                style={{ width: "300px", height: 40, overflow: "scroll" }}
                options={options}
                placeholder={key}
                multiple
              />
            );
          } else {
            return (
              <GoMakeAutoComplate
                key={key}
                onChange={(e, v) => setFilterValue(key, v)}
                style={{ width: "200px" }}
                options={values}
                placeholder={key}
              />
            );
          }
        })}
      {/* {materialTableFilters &&
        materialTableFilters.map(({ key, values }) => {
          return (
            <GoMakeAutoComplate
              onChange={(e, v) => setFilterValue(key, v)}
              style={{ width: "200px" }}
              options={values}
              placeholder={key}
            />
          );
        })} */}
      <GoMakeAutoComplate
        style={{ width: "150px" }}
        options={activeFilterOptions}
        value={activeFilterLabel()}
        onChange={(e: any, value: any) => onActiveFilterChange(value?.value)}
        disableClearable={true}
      />
      <Stack direction={"row"} gap={"5px"} alignItems={"center"}>
        {props.isAdmin === false ? (
          <GoMakeAutoComplate
            style={{ width: "200px" }}
            options={materialSuppliers}
            placeholder={t("materials.sheetPaper.selectSupplier")}
            onChange={(e: any, value: any) => {
              onSelectSupplier(value.value);
            }}
            value={supplierName ? supplierName : ""}
            disableClearable={true}
            renderOption={(props: any, option: any) => {
              return (
                <Stack direction={"row"}>
                  <div {...props} style={{ width: "100%" }}>
                    {option.label}
                  </div>
                  <div>
                    <SecondSwitch
                      checked={option?.isDefault}
                      onChange={() => {
                        onSetDefaultSupplier(option.value).then();
                      }}
                    />
                  </div>
                </Stack>
              );
            }}
            PaperComponent={(props) => {
              return (
                <Paper elevation={8} {...props}>
                  {props?.children}
                  <Button
                    sx={{
                      width: "100%",
                      backgroundColor: primaryColor(10),
                      color: secondColor(500),
                      ...FONT_FAMILY.Lexend(500, 16),
                    }}
                    onMouseDown={() => {
                      setOpenAddSupplierModal(true);
                    }}
                  >
                    {t("materials.sheetPaper.addNewSupplier")}
                  </Button>
                </Paper>
              );
            }}
          />
        ) : (
          <></>
        )}
        <ActionMenu isAdmin={props.isAdmin} />
      </Stack>
    </Stack>
  );
};
export { FiltersActionsBar };
