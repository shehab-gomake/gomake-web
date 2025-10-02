import { GoMakeAutoComplate } from "@/components";
import { ActionMenu } from "@/widgets/materials-widget/components/actions-menu/action-menu";
import { useEffect, useState } from "react";
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
import { productsForDropDownList, userState } from "@/store";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { updateSupplierPriorityApi } from "@/services/api-service/materials/materials-endpoints";
import { SortIcon } from "@/icons";
import { UNIT_TYPE } from "@/enums";
import { convertTitleUnits, convertValueToImperial } from "@/utils/helpers";

interface FiltersActionsBarProps {
  isAdmin: boolean;
  subCategory?: string;
}

const FiltersActionsBar = (props: FiltersActionsBarProps) => {
  const { t } = useTranslation();
  const { callApi } = useGomakeAxios();
  const [anchorEl, setAnchorEl] = useState<any>(null);
  const setOpenAddSupplierModal = useSetRecoilState(openAddSupplierModalState);
  const { primaryColor, secondColor } = useGomakeTheme();
  const {
    onActiveFilterChange,
    activeFilterLabel,
    activeFilterOptions,
    materialSuppliers,
    setMaterialsSuppliers,
    supplierId,
    onSelectSupplier,
    materialTableFilters,
    setFilterValue,
    getFilterValue,
    materialCategory,
    materialType,
  } = useMaterialFilters();

  const [selectedOption, setSelectedOptions] = useState([]);
  const [items, setItems] = useState(materialSuppliers);
  const [supplierName, setSupplierName] = useState<{
    value: string;
    label: string;
    isDefault: boolean;
    name?: string;
    id?: string;
  } | null>({ value: "", label: "", isDefault: false });
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const updateMaterialsImages = async (list) => {
    const callBack = (res) => {
      if (res.success) {
        const updatedList = materialSuppliers.map((item) => {
          // Find the corresponding new list entry
          const match = list.find(
            (newItem) => newItem?.supplierId === item.value
          );
          // Update the order if a match is found
          return match ? { ...item, order: match.order } : item;
        });

        setMaterialsSuppliers(updatedList);
      }
    };
    await updateSupplierPriorityApi(callApi, callBack, {
      materialTypeKey: materialType,
      categoryKey: materialCategory,
      suppliers: list,
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const sortedItems = [...items].sort((a, b) => a.order - b.order);
    const reorderedItems = [...sortedItems];

    const movedItem = reorderedItems[result.source.index];

    reorderedItems.splice(result.source.index, 1);

    reorderedItems.splice(result.destination.index, 0, movedItem);

    const updatedItems = reorderedItems.map((item, index) => ({
      ...item,
      order: index + 1,
    }));

    updateMaterialsImages(
      updatedItems.map((item) => ({
        supplierId: item.value,
        order: item?.order,
      }))
    );

    // Update the local state
    setItems(updatedItems);
  };

  useEffect(() => {
    if (materialSuppliers?.length > 0) {
      setItems(materialSuppliers);
    } else {
      setItems([]);
    }
  }, [materialSuppliers]);

  useEffect(() => {
    if (materialSuppliers?.length > 0) {
      const firstSupplier =
        materialSuppliers.find((s) => s.order === 1) || materialSuppliers[0];

      setSupplierName(firstSupplier);
      onSelectSupplier(firstSupplier?.value || firstSupplier?.id);
    } else {
      setSupplierName(null);
      onSelectSupplier("");
    }
  }, [materialSuppliers]);

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

  const productValue = useRecoilValue(productsForDropDownList);

  const productsOptions = productValue?.map((product) => ({
    ...product,
    value: product.id,
    label: product.name,
  }));
  const user = useRecoilValue<any>(userState);
  const unitType = user?.printHouseProfile?.unitType || 0;
  return (
    <Stack direction={"row"} gap={2} alignItems={"center"}>
      {materialTableFilters &&
        materialTableFilters.map(({ key, values, unit, name }) => {
          console.log('name', { name, values });
          const convertedUnitText =
            unitType === UNIT_TYPE.IMPERIAL ? convertTitleUnits(unit) : unit;
          const convertedValues = unit
            ? values.map((value) => {
              if (value.includes("X")) {
                const [width, height] = value.split("X");

                const convertedWidth = convertValueToImperial(unit, width);
                const convertedHeight = convertValueToImperial(unit, height);
                return `${convertedWidth}X${convertedHeight}`;
              } else {
                return convertValueToImperial(unit, value);
              }
            })
            : values;
          const convertedUnit =
            unitType === UNIT_TYPE.IMPERIAL ? convertedValues : values;

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
                  setSelectedOptions(v);
                  setFilterValue(
                    key,
                    v.map((item) => item.id)
                  );
                }}
                value={selectedOption?.map((item: any) => {
                  return {
                    label: item?.label,
                    id: item?.id,
                  };
                })}
                style={{ width: "300px", height: 40, overflow: "scroll" }}
                options={options}
                placeholder={name}
                multiple={true}
              />
            );
          } else {
            return (
              <GoMakeAutoComplate
                key={materialCategory + "-" + key}
                onChange={(e, v) => setFilterValue(key, v, unit)}
                style={{ width: "200px" }}
                value={getFilterValue(key)}
                options={convertedUnit}
                placeholder={
                  convertedUnitText
                    ? name + " " + "(" + convertedUnitText + ")"
                    : name
                }
              />
            );
          }
        })}
      {!props.isAdmin ? (
        <GoMakeAutoComplate
          style={{ width: "150px" }}
          options={activeFilterOptions}
          value={activeFilterLabel()}
          onChange={(e: any, value: any) => onActiveFilterChange(value?.value)}
          disableClearable={true}
        />
      ) : (
        <></>
      )}
      <Stack direction={"row"} gap={"5px"} alignItems={"center"}>
        {/* {props.isAdmin === false ? (
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
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <div style={{ ...FONT_FAMILY.Lexend(500, 16) }}>
              {supplierName?.name || supplierName?.label
                ? supplierName?.name || supplierName?.label
                : t("materials.sheetPaper.selectSupplier")}
            </div>
          </button>
        ) : (
          <></>
        )} */}
        <ActionMenu isAdmin={props.isAdmin} />
        {/* <Menu
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="menu-droppable">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {items
                    .slice()
                    .sort((a, b) => a?.order - b?.order)
                    .map((item, index) => (
                      <Draggable
                        key={item.value || item.id}
                        draggableId={item.value || item.id}
                        index={index}
                      >
                        {(provided) => (
                          <MenuItem
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => {
                              setSupplierName(item); //?new
                              onSelectSupplier(item?.value || item?.id);
                              handleClose();
                            }}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              ...provided.draggableProps.style,
                            }}
                          >
                            <SortIcon />
                            {item.name || item.label}
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
            {t("materials.sheetPaper.chooseNewSupplier")}
          </Button>
        </Menu> */}
      </Stack>
    </Stack>
  );
};
export { FiltersActionsBar };
