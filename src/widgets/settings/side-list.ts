import { IListItem } from "@/widgets/machines/components/side-list/interface";
import { ProductsSettingsWidget } from "@/widgets/products-settings-widget/products-settings-widget";
import { EmptyComponent } from "@/widgets/settings/empty-component";
import { ProfileIcon } from "@/components/icons/profile-icon";
import { CubeIcon } from "@/components/icons/cube-icon";
import { SmsIcon } from "@/components/icons/sms-icon";
import { ProductsSettingsIcon } from "@/components/icons/products-settings-icon";
import { DocumentIcon } from "@/components/icons/document-icon";
import { PeopleIcon } from "@/components/icons/people-icon";
import { DollarCircleIcon } from "@/components/icons/dollar-circle-icon";
import { SettingsUsersWidget } from "@/widgets/settings-users/settings-users-widget";
import { EditProductWidget } from "../products-settings-widget/widget/edit-product";

export const list: IListItem[] = [
  {
    component: EmptyComponent,
    text: "settings.profile",
    value: "1",
    icon: ProfileIcon,
    path: "profits",
  },
  {
    component: ProductsSettingsWidget,
    text: "settings.products",
    value: "2",
    icon: ProductsSettingsIcon,
    path: "products",
    editComponent: EditProductWidget,
  },
  {
    component: EmptyComponent,
    text: "settings.mailing",
    value: "3",
    icon: SmsIcon,
    path: "mailing",
  },
  {
    component: EmptyComponent,
    text: "settings.materials",
    value: "4",
    icon: CubeIcon,
    path: "materials",
  },
  {
    component: EmptyComponent,
    text: "settings.documenting",
    value: "5",
    icon: DocumentIcon,
    path: "documents",
  },
  {
    component: SettingsUsersWidget,
    text: "settings.users",
    value: "6",
    icon: PeopleIcon,
    path: "users",
  },
  {
    component: EmptyComponent,
    text: "settings.finances",
    value: "7",
    icon: DollarCircleIcon,
    path: "finances",
  },
];
