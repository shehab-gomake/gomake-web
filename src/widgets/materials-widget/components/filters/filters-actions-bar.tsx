import { GoMakeAutoComplate, SecondSwitch } from "@/components";
import { ActionMenu } from "@/widgets/materials-widget/components/actions-menu/action-menu";
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
import { useGomakeAxios } from "@/hooks";
import { Stack } from "@mui/material";
import { productsForDropDownList } from "@/store";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';

interface FiltersActionsBarProps {
  isAdmin: boolean;
  subCategory?: string;
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
    getFilterValue,
    materialCategory,
    filters
  } = useMaterialFilters();
  const { callApi } = useGomakeAxios();
  const [selectedOption, setSelectedOptions] = useState([])
  const [supplierName, setSupplierName] = useState<{
    value: string;
    label: string;
    isDefault: boolean;
  } | null>({ value: "", label: "", isDefault: false });

  const [items, setItems] = useState(materialSuppliers);

  useEffect(() => {
    if (materialSuppliers?.length > 0) {
      setItems(materialSuppliers)
    }
  }, [])


  const onDragEnd = (result) => {
    console.log("result", result)
    if (!result.destination) return; // Exit if dropped outside the list

    const reorderedItems = Array.from(items);
    console.log("reorderedItems", reorderedItems)
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);

    setItems(reorderedItems); // Update the options with the new order
  };

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

  const productValue = useRecoilValue(productsForDropDownList)

  function filterItemsById(options, values) {
    // Create a Set from values array for quick lookup
    const valuesSet = new Set(values?.values);

    // Filter options array by checking if the id exists in the values set
    return options.filter(option => valuesSet.has(option.id));
  }
  const productsOptions = productValue?.map((product) => ({
    ...product,
    value: product.id,
    label: product.name,
  }));
  return (
    <Stack direction={"row"} gap={2} alignItems={"center"}>
      {materialTableFilters &&
        materialTableFilters.map(({ key, values }) => {
          if (key === "productId") {
            return (
              <GoMakeAutoComplate
                key={materialCategory + "-" + key}
                onChange={(e, v) => setFilterValue(key, v?.id)}
                style={{ width: "300px", height: 40, overflow: "scroll" }}
                options={productsOptions}
                placeholder={key}
              />
            );
          }
          if (key === "clients") {
            return (
              <GoMakeAutoComplate
                key={materialCategory + "-" + key}
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
            let filtersTemp = filters.find((item) => item.key === key)
            const filteredItems = filterItemsById(options, filtersTemp)
            return (
              <GoMakeAutoComplate
                key={materialCategory + "-" + key}
                onChange={(e, v) => {
                  setSelectedOptions(v)
                  setFilterValue(
                    key,
                    v.map((item) => item.id)
                  )
                }
                }
                value={selectedOption?.map((item: any) => {
                  return {
                    label: item?.label,
                    id: item?.id,
                  };
                })}
                style={{ width: "300px", height: 40, overflow: "scroll" }}
                options={options}
                placeholder={key}
                multiple={true}
              />
            );
          } else {
            return (
              <GoMakeAutoComplate
                key={materialCategory + "-" + key}
                onChange={(e, v) => setFilterValue(key, v)}
                style={{ width: "200px" }}
                value={getFilterValue(key)}
                options={values}
                placeholder={key}
              />
            );
          }
        })}
      {
        !props.isAdmin ? <GoMakeAutoComplate
          style={{ width: "150px" }}
          options={activeFilterOptions}
          value={activeFilterLabel()}
          onChange={(e: any, value: any) => onActiveFilterChange(value?.value)}
          disableClearable={true}
        /> : <></>
      }
      <Stack direction={"row"} gap={"5px"} alignItems={"center"}>
        {props.isAdmin === false ? (
          <GoMakeAutoComplate
            key={`supplier_${props?.subCategory + supplierName}`}
            style={{ width: "200px" }}
            options={items}
            placeholder={t("materials.sheetPaper.selectSupplier")}
            onChange={(e: any, value: any) => {
              onSelectSupplier(value.value);
            }}
            value={supplierName ? supplierName : ""}
            disableClearable={true}
            renderOption={(props, option, { index }) => {
              return (
                <div style={{ width: '100%' }}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          style={{ width: '100%' }}
                        >
                          <Draggable draggableId={option.value} index={index}>
                            {(provided) => (
                              <div
                                {...props}
                                {...provided.draggableProps}
                                ref={provided.innerRef}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  width: '100%',
                                  ...props.style,
                                  ...provided.draggableProps.style,
                                }}
                              >
                                <div {...provided.dragHandleProps} style={{ paddingRight: 8 }}>
                                  <DragIndicatorIcon />
                                </div>
                                {option.label}
                              </div>
                            )}
                          </Draggable>
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                </div>
              )
            }
            }
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
