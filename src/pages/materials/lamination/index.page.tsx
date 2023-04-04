import { GoMakeAutoComplate } from "@/components";
import { MoreCircleIcon } from "@/icons";
import { CustomerAuthLayout } from "@/layouts";
import { HeaderTitle } from "@/widgets";

import { useTranslation } from "react-i18next";
import moreCircle from "@/icons/more-circle.png";
import Image from "next/image";
import { Table } from "@/widgets/table/table";
export default function SheetPaper() {
  const { t } = useTranslation();

  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.lamination.title")} />
      <Table
        tableHeaders={["category", "street", "length", "definitions"]}
        tableRows={[
          {
            category: "brilliant",
            street: 10,
            lLength: 10,
            definitions: (
              <Image src={moreCircle} width={24} height={24} alt="More" />
            ),
          },
          {
            category: "brilliant",
            street: 10,
            length: 10,
            definitions: (
              <Image src={moreCircle} width={24} height={24} alt="More" />
            ),
          },
          {
            category: "brilliant",
            street: 10,
            length: 10,
            definitions: (
              <Image src={moreCircle} width={24} height={24} alt="More" />
            ),
          },
        ]}
      />
    </CustomerAuthLayout>
  );
}
