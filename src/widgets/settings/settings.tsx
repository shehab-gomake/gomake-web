import { useTranslation } from "react-i18next";
import { SideList } from "@/components/containers/side-container/side-list/side-list";
import { list } from "@/widgets/settings/side-list";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SideBarContainer } from "@/components/containers/side-container/side-bar-container";
import { IListItem } from "@/components/containers/interface";
import { useUserPermission } from "@/hooks/use-permission";
import { useSetRecoilState } from "recoil";
import {
  EWidgetProductSettingsTabs,
  selectedProductsTabState,
} from "@/widgets/products-settings-widget/enums";

const SettingsWidget = () => {
  const { t } = useTranslation();
  const { push, query } = useRouter();
  const { settingsRoute, id, productId } = query;
  const [selected, setSelected] = useState<IListItem>();
  const { CheckPermission } = useUserPermission();
  const setProductsTab = useSetRecoilState(selectedProductsTabState);
  const onSelectItem = (value: string) => {
    const selectedItem = list.find((item) => item.value === value);
    if (selectedItem?.path === "products") {
      setProductsTab(EWidgetProductSettingsTabs.PRODUCT_MANAGMENT);
    }
    push("/settings/" + selectedItem.path).then();
  };

  useEffect(() => {
    if (settingsRoute) {
      const item = list.find((item) => item.path === settingsRoute);
      if (id && !item?.editComponent) {
        push("/settings/" + item.path).then();
      }
      if (item?.path === "products") {
        setProductsTab(EWidgetProductSettingsTabs.PRODUCT_MANAGMENT);
      }
      setSelected(item ?? list[0]);
    }
  }, [settingsRoute, id, push, setProductsTab]);

  const Side = () => {
    return (
      <>
        <SideList
          list={list
            .filter(
              (x) =>
                !x.permission ||
                (Array.isArray(x.permission)
                  ? x.permission.some((perm) => CheckPermission(perm))
                  : CheckPermission(x.permission))
            )
            .map((item) => ({ ...item, text: t(item.text) }))}
          selectedItem={selected?.value}
          onSelect={onSelectItem}
          title={t("settings.settings")}
        />
      </>
    );
  };

  return (
    <SideBarContainer side={Side()} header={""} subHeader={""}>
      {selected && selected.component && !id && <selected.component />}
      {selected && selected.component && selected.editComponent && id && (
        <selected.editComponent />
      )}
      {selected &&
        selected.component &&
        selected.subProductComponent &&
        productId && <selected.subProductComponent /> &&
        !id}
    </SideBarContainer>
  );
};

export { SettingsWidget };
