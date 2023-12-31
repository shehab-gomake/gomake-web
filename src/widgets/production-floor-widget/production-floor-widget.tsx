import { useProductionFloor } from "@/widgets/production-floor-widget/use-production-floor";
import { useCallback, useEffect, useState } from "react";
import { SecondaryTable } from "@/components/tables/secondary-table";
import { Button, ButtonGroup } from "@mui/material";
import Stack from "@mui/material/Stack";
import { SearchInputComponent } from "@/components/form-inputs/search-input-component";
import { SelectComponent } from "@/widgets/production-floor-widget/components/select";
import { GoMakeModal } from "@/components";
import { useRouter } from "next/router";
import { ProductId } from "@/widgets/production-floor-widget/product-id-widget/product-id";
import { StatusesButtonsComponent } from "@/widgets/production-floor-widget/production-statuses/production-statuses";
import { GoMakeDatepicker } from "@/components/date-picker/date-picker-component";
import { useProductionFloorSignalr } from "@/hooks/signalr/use-production-floor-signalr";

const ProductionFloorWidget = () => {
  const { tableHeaders, getWorkJobs, getWorkJobsRows, demo, product } =
    useProductionFloor();

  const [viewType, setViewType] = useState<1 | 2>(1);
  const { query, replace } = useRouter();
  const productId = query?.productId;
  const openModal = useCallback(() => {
    return !!productId;
  }, [productId]);
  useEffect(() => {
    getWorkJobs().then();
  }, []);
  const handleModalClose = () => {
    replace("/production-floor").then();
  };

  const handleScroll = () => {
    getWorkJobs().then();
  };

  return (
    <Stack
      direction={"column"}
      gap={"5px"}
      paddingLeft={"20px"}
      paddingRight={"20px"}
    >
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        padding={"10px 0"}
      >
        <ButtonGroup>
          <Button
            variant={viewType === 1 ? "contained" : "text"}
            onClick={() => setViewType(1)}
          >
            table
          </Button>
          <Button
            variant={viewType === 2 ? "contained" : "text"}
            onClick={() => setViewType(2)}
          >
            kanban
          </Button>
        </ButtonGroup>
        <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
          <SelectComponent buttonLabel={"employee"} list={demo} />
          <GoMakeDatepicker />
          <SearchInputComponent onChange={() => {}} />
        </Stack>
      </Stack>
      <StatusesButtonsComponent />
      <Stack>
        {viewType === 1 && (
          <SecondaryTable
            onScrolledBottom={handleScroll}
            rows={getWorkJobsRows()}
            headers={tableHeaders}
          />
        )}
        {viewType === 2 && <div>coming soon ...</div>}
      </Stack>
      <GoMakeModal
        insideStyle={{ width: "80vw" }}
        openModal={openModal() && !!product()}
        onClose={handleModalClose}
        modalTitle={"title"}
      >
        <ProductId product={product()} />
      </GoMakeModal>
    </Stack>
  );
};

export { ProductionFloorWidget };
