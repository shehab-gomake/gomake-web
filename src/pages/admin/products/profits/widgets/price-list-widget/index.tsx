import { useTranslation } from "react-i18next";
import { useStyle } from "./style";
import Header from "./header";
import { AdminProductTable } from "@/widgets";
import Edit from "./edit";

const PriceListWidget = () => {
  return (
    <>
      <Header />
      <AdminProductTable
        tableHeaders={[
          "Quantity",
          "Cost",
          "Profit",
          "Meter Price",
          "Exp.meter",
          "price",
          "Total price",
          "More",
        ]}
        tableRows={[
          {
            Quantity: 134,
            Cost: 443,
            Profit: 21,
            MeterPrice: 468,
            Exp: 55,
            total: 445,
            price: 52,
            more: <Edit />,
          },
          {
            Quantity: 134,
            Cost: 443,
            Profit: 21,
            MeterPrice: 468,
            Exp: 55,
            total: 445,
            price: 52,
            more: <Edit />,
          },
        ]}
      />
    </>
  );
};
export default PriceListWidget;
