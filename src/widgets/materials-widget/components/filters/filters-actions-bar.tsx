import { GoMakeAutoComplate } from "@/components";
import { ActionMenu } from "@/widgets/materials-widget/components/actions-menu/action-menu";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMaterialFilters } from "@/widgets/materials-widget/components/filters/use-material-filters";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  materialsClientsState,
  materialsMachinesState,
  showMoreFiltersState,
} from "@/widgets/materials-widget/state";
import { Stack, Box } from "@mui/material";
import { productsForDropDownList, userState } from "@/store";
import { UNIT_TYPE } from "@/enums";
import { convertTitleUnits, convertValueToImperial } from "@/utils/helpers";

interface FiltersActionsBarProps {
  isAdmin: boolean;
  subCategory?: string;
  isFetchingSupplier?: boolean;
  renderOptionsSupplier?: any;
  checkWhatRenderArraySupplier?: any;
  onHeightChange?: (height: number) => void;
}

const FiltersActionsBar = (props: FiltersActionsBarProps) => {
  const { t } = useTranslation();
  const {
    onActiveFilterChange,
    activeFilterLabel,
    activeFilterOptions,
    materialSuppliers,
    onSuppliersIdsChange,
    materialTableFilters,
    setFilterValue,
    getFilterValue,
    materialCategory,
  } = useMaterialFilters();

  const dir: "rtl" | "ltr" = t("direction");
  const isRTL = dir === "rtl";

  const [selectedOption, setSelectedOptions] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [showMore, setShowMore] = useRecoilState(showMoreFiltersState);

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

  const INITIAL_FILTERS_COUNT = 2;
  const displayedFilters = showMore
    ? materialTableFilters
    : materialTableFilters?.slice(0, INITIAL_FILTERS_COUNT);
  const hasMoreFilters = materialTableFilters && materialTableFilters.length > INITIAL_FILTERS_COUNT;

  const filterContainerRef = useRef<HTMLDivElement>(null);

  // Measure and report filter bar height changes
  useEffect(() => {
    if (filterContainerRef.current && props.onHeightChange) {
      const height = filterContainerRef.current.offsetHeight;
      props.onHeightChange(height);
    }
  }, [showMore, materialTableFilters, props.onHeightChange]);

  return (
    <Stack ref={filterContainerRef} direction={"row"} gap={"10px"} alignItems={"center"} flexWrap={"wrap"}>
      {displayedFilters && materialTableFilters?.length > 0 && props.subCategory &&
        displayedFilters.map(({ key, values, unit, name }) => {
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
                style={{ width: "180px" }}
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

      {!props.isAdmin && materialSuppliers?.length > 0 && props.subCategory && (
        <GoMakeAutoComplate
          key={`${materialCategory}-suppliers-${selectedSuppliers?.length || 0}`}
          onChange={(e, v) => {
            if (!v) {
              setSelectedSuppliers([]);
              onSuppliersIdsChange([]);
            } else {
              const validSuppliers = Array.isArray(v) ? v : [v];
              setSelectedSuppliers(validSuppliers);
              onSuppliersIdsChange(validSuppliers.map((item) => item.value || item.id));
            }
          }}
          onChangeTextField={props.checkWhatRenderArraySupplier}
          value={selectedSuppliers || []}
          style={{ width: "180px", height: 40, overflow: "scroll", }}
          options={props.renderOptionsSupplier || []}
          placeholder={t("home.admin.pleaseSelectSupplier")}
          multiple={true}
          loading={props.isFetchingSupplier}
          getOptionLabel={(option: any) => {
            if (!option) return "";
            return option?.label || option?.name || "";
          }}
          defaultFiltering={false}
        />
      )}
      {!props.isAdmin && props.subCategory ? (
        <Box
          sx={{
            width: "100px",
            [isRTL ? 'marginLeft' : 'marginRight']: !hasMoreFilters ? "38px" : "0px"
          }}
        >
          <GoMakeAutoComplate
            style={{ width: "100%" }}
            options={activeFilterOptions}
            value={activeFilterLabel()}
            onChange={(e: any, value: any) => onActiveFilterChange(value?.value)}
            disableClearable={true}
          />
        </Box>
      ) : (
        <></>
      )}

      {hasMoreFilters && props.subCategory && (
        <Box
          onClick={() => setShowMore(!showMore)}
          sx={{
            padding: "3px 6px",
            backgroundColor: "#f8f9fa",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "12px",
            color: "#374151",
            fontWeight: 500,
            transition: "all 0.2s ease",
            display: "flex",
            alignItems: "center",
            gap: "4px",
            minHeight: "32px",
            whiteSpace: "nowrap",
            [isRTL ? 'marginLeft' : 'marginRight']: "32px",
            "&:hover": {
              backgroundColor: "#e9ecef",
            },
          }}
        >
          {showMore ? (
            <>
              <span>{t("sales.quote.showLess")}</span>
              <span style={{ fontSize: 10 }}>▲</span>
            </>
          ) : (
            <>
              <span>{t("sales.quote.showMore")}</span>
              <span
                style={{
                  fontSize: 10,
                  backgroundColor: "#d1d5db",
                  color: "#6b7280",
                  padding: "1px 4px",
                  borderRadius: 3,
                  fontWeight: 500,
                }}
              >
                +{materialTableFilters.length - INITIAL_FILTERS_COUNT}
              </span>
              <span style={{ fontSize: 10 }}>▼</span>
            </>
          )}
        </Box>
      )}

      <Stack direction={"row"} alignItems={"center"} sx={{ padding: 0, position: "absolute", [isRTL ? 'left' : 'right']: 10, top: 80 }}>
        {<ActionMenu isAdmin={props.isAdmin} subCategory={props.subCategory} />}
      </Stack>
    </Stack>
  );
};
export { FiltersActionsBar };
