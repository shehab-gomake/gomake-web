import { useTranslation } from "react-i18next";
import { useStyle } from "@/widgets/settings/style";
import { MachineLayout } from "@/widgets/machines/components/layout/machine-layout";
import { SideList } from "@/widgets/machines/components/side-list/side-list";
import { list } from "@/widgets/settings/side-list";
import { useState } from "react";
import { IListItem } from "@/widgets/machines/components/side-list/interface";

const SettingsWidget = () => {
  const { t } = useTranslation();
  const { classes } = useStyle();
  const [selected, setSelected] = useState<IListItem>();
  const onSelectItem = (value: string) => {
    const selectedItem = list.find((item) => item.value === value);
    setSelected(selectedItem);
  };
  const Side = () => {
    return (
      <SideList
        list={list.map((item) => ({ ...item, text: t(item.text) }))}
        selectedItem={selected?.value}
        onSelect={onSelectItem}
        title={t("settings.settings")}
      />
    );
  };
  return (
    <MachineLayout side={Side()} header={""} subHeader={""}>
      {selected && <selected.component />}
    </MachineLayout>
  );
};

export { SettingsWidget };
