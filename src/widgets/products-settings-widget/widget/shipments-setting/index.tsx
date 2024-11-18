import { PrimaryTable } from "@/components/tables/primary-table";
import { useEffect } from "react";

interface IProps {
  getAllShipmentTypes: any;
  tableHeaders: any;
  allShipmentTypes: any;
}

const ShipmentsSetting = ({
  tableHeaders,
  allShipmentTypes,
  getAllShipmentTypes,
}: IProps) => {
  useEffect(() => {
    getAllShipmentTypes();
  }, []);

  return (
    <div>
      <PrimaryTable
        rows={allShipmentTypes}
        headers={tableHeaders}
        maxHeight={"calc(100vh - 303px)"}
        // maxHeight={"calc(100vh - 213px)"}
        stickyFirstCol={false}
        stickyHeader={true}
      />
    </div>
  );
};

export { ShipmentsSetting };
