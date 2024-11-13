import { GoMakeAutoComplate } from "@/components";
import { ActionMenu } from "@/widgets/materials-widget/components/actions-menu/action-menu";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useMaterialFilters } from "@/widgets/materials-widget/components/filters/use-material-filters";
import Button from "@mui/material/Button";
import { Menu, MenuItem } from "@mui/material";
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
import { updateSupplierPriorityApi } from "@/services/api-service/materials/materials-endpoints";

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
    materialTableFilters,
    setFilterValue,
    getFilterValue,
    materialCategory,
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
  }, [materialSuppliers])

  const [anchorEl, setAnchorEl] = useState<any>(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };


  const updateMaterialsImages = async (list) => {
    const callBack = (res) => {
      if (res.success) {

      } else {

      }
    };
    await updateSupplierPriorityApi(callApi, callBack, {
      MaterialTypeKey: "",
      CategoryKey: "",
      List: list
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedItems = Array.from(items);
    const [movedItem] = reorderedItems.splice(result.source.index, 1);
    reorderedItems.splice(result.destination.index, 0, movedItem);
    updateMaterialsImages(reorderedItems?.map((item, index) => {
      return {
        supplierId: item.value,
        order: index + 1
      }
    }))
    setItems(reorderedItems);
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
          <button
            onClick={(e) => handleOpen(e)}
            style={{
              width: "fit-content",
              height: "40px",
              border: "1px solid #E0E0E0",
              borderRadius: "5px",
              padding: "5px",
              backgroundColor: "#FFF",
              minWidth: "140px",
              boxShadow: "0px 1px 10px rgba(0, 0, 0, 0.08)",
              borderBottom: "2px solid rgb(237, 2, 140)",
              paddingLeft: "12px",
              cursor: 'pointer',
              textAlign: "left"
            }}>
            <div
              style={{ ...FONT_FAMILY.Lexend(500, 16) }}>
              {supplierName?.label}
            </div>
          </button>
        ) : (
          <></>
        )}
        <ActionMenu isAdmin={props.isAdmin} />
        <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="menu-droppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((item, index) => (
                    <Draggable key={item.value} draggableId={item.value} index={index}>
                      {(provided) => (
                        <MenuItem
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          onClick={() => {
                            onSelectSupplier(item.value);
                            handleClose();
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            ...provided.draggableProps.style,
                          }}
                        >
                          <DragIndicatorIcon style={{ marginRight: 8 }} />
                          {item.label}
                        </MenuItem>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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
        </Menu>
      </Stack>

    </Stack>
  );
};
export { FiltersActionsBar };
