import { useEffect, useState } from "react";

import { HeaderTitle } from "@/widgets";
import { Table } from "@/widgets/table/table";
import { CustomerAuthLayout } from "@/layouts";

import { useTranslation } from "react-i18next";
import { HeaderFilter } from "./header-filter";
import { useStyle } from "./style";
import { useProfileFrames } from "./use-profile-frames";

export default function Braces() {
  const { t } = useTranslation();
  const { clasess } = useStyle();
  const { tabelHeaders } = useProfileFrames();
  const [profileFrameSizes, setProfileFramSizes] = useState([]);
  return (
    <CustomerAuthLayout>
      <HeaderTitle title={t("materials.profileFrames.title")} />
      <HeaderFilter setProfileFramSizes={setProfileFramSizes} />
      <Table tableHeaders={tabelHeaders} tableRows={profileFrameSizes} />
    </CustomerAuthLayout>
  );
}
