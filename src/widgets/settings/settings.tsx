import { useTranslation } from "react-i18next";
import { SideList } from "@/components/containers/side-container/side-list/side-list";
import { list } from "@/widgets/settings/side-list";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { SideBarContainer } from "@/components/containers/side-container/side-bar-container";
import { IListItem } from "@/components/containers/interface";
import { useUserPermission } from "@/hooks/use-permission";
import {StepType} from "@reactour/tour";
import {useGoMakeTour} from "@/hooks/use-go-make-tour";

const SettingsWidget = () => {
  const { t } = useTranslation();
  const { push, query } = useRouter();
  const { settingsRoute, id, productId } = query;
  const [selected, setSelected] = useState<IListItem>();
  const { CheckPermission } = useUserPermission();

  const onSelectItem = (value: string) => {
    const selectedItem = list.find((item) => item.value === value);
    push("/settings/" + selectedItem.path).then();
  };
  const dir: "rtl" | "ltr" = t("direction");
  useEffect(() => {
    if (settingsRoute) {
      const item = list.find((item) => item.path === settingsRoute);
      if (id && !item.editComponent) {
        push("/settings/" + item.path).then();
      }
      setSelected(!!item ? item : list[0]);
    }
  }, [settingsRoute, id]);
  const settingsSteps: StepType[] = [
    {
      selector: '[data-tour="profileSettings"]',
      content: 'Here, you can update all your personal and business details.\n',
      position: 'center'
    },
    {
      selector: '[data-tour="usersSettingsLink"]',
      content: 'Go to "Users" to manage your employees.',
      position: 'bottom'
    },
    {
      selector: '[data-tour="settingUsersWidget"]',
      content: 'Add and update all system users includes:\n Username and passward\n personal information\n working hours\n',
      position: 'center',
      styles: {
        maskWrapper: props => ({...props, maxHeight: '300px'})
      }
    },
    {
      selector: '[data-tour="settingsProductsLink"]',
      content: 'Add and update all system users includes:\n Username and passward\n personal information\n working hours\n',
      position: 'bottom'
    },
    {
      selector: '[data-tour="productsSettingsWidget"]',
      content: 'Add and update all system users includes:\n Username and passward\n personal information\n working hours\n',
      position: 'center',
      action: elem => elem?.scrollIntoView({block: 'start', behavior: "smooth"}),
      styles: {
        maskWrapper: props => ({...props,})
      }
    },
  ]

  const {} = useGoMakeTour(settingsSteps, []);
  const Side = () => {
    return (
      <>
        <SideList
          list={list
            .filter((x) => !x.permission || CheckPermission(x.permission))
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
