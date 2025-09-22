import { IListItem } from "@/components/containers/interface";
import { ProductsSettingsWidget } from "@/widgets/products-settings-widget/products-settings-widget";
import { ProfileIcon } from "@/components/icons/profile-icon";
import { SmsIcon } from "@/components/icons/sms-icon";
import { ProductsSettingsIcon } from "@/components/icons/products-settings-icon";
import { DocumentIcon } from "@/components/icons/document-icon";
import { PeopleIcon } from "@/components/icons/people-icon";
import { DollarCircleIcon } from "@/components/icons/dollar-circle-icon";
import { SettingsUsersWidget } from "@/widgets/settings-users/settings-users-widget";
import { EditProductWidget } from "../products-settings-widget/widget/edit-product";
import { SettingsCompanyProfileWidget } from "@/widgets/settings-profile-widget/settings-company-profile-widget";
import { SettingsMailingWidget } from "../settings-mailing/settings-mailing-widget";
import { SettingsDocumentingWidget } from "../settings-documenting/settings-documenting-widget";
import { TranslationsWidget } from "../translation-widget/translation-widget";
import { Permissions } from "@/components/CheckPermission/enum";
import { FinancesWidget } from "../finances";

import { BudgetIcon } from "@/icons";
import { PriceProfitWidget } from "../price-profit-widge";
import { PreferencesIcon } from "@/components/icons/preferences-icons";
import { SettingsPreferencesWidget } from "../settings-preferences/preferences";
import { SettingsMyProfileWidget } from "../settings-profile-widget/settings-my-profile-widget";
import { CompanyProfileIcon } from "@/components/icons/company-profile";
import { SettingsFileApiWidget } from "../settings-file-api/settings-file-api-widget";
import { FileApiIcon } from "@/components/icons/file-api-icon";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { SettingsSubscriptionWidget } from "@/widgets/settings-subscription-widget/settings-subscription-widget";

export const list: IListItem[] = [
  {
    component: SettingsMyProfileWidget,
    text: "settings.profile",
    value: "4",
    icon: ProfileIcon,
    path: "profile",
  },
  {
    component: SettingsCompanyProfileWidget,
    text: "profileSettings.businessProfile",
    value: "1",
    icon: CompanyProfileIcon,
    path: "company-profile",
    dataTour: "settingsProfile",
    permission: Permissions.SHOW_PROFILE_COMPANY,
  },
  {
    component: PriceProfitWidget,
    text: "settings.priceProfit",
    value: "8",
    permission: Permissions.SHOW_PRICING_PROFILE,
    icon: BudgetIcon,
    path: "price-profit",
  },
  {
    component: ProductsSettingsWidget,
    text: "settings.products",
    value: "2",
    icon: ProductsSettingsIcon,
    path: "products",
    editComponent: EditProductWidget,
    subProductComponent: ProductsSettingsWidget,
    dataTour: "settingsProductsLink",
    permission: Permissions.SHOW_PRODUCTS,
  },
  {
    component: SettingsMailingWidget,
    text: "settings.mailing",
    value: "3",
    icon: SmsIcon,
    path: "mailing",
    permission: Permissions.SHOW_MAILING_TEMPLATES,
  },
  {
    component: SettingsDocumentingWidget,
    text: "settings.documenting",
    value: "5",
    icon: DocumentIcon,
    path: "documents",
    permission: [
      Permissions.SHOW_DOCUMENT_NUMBERING,
      Permissions.SHOW_DOCUMENT_DESIGN,
    ],
  },
  {
    component: SettingsUsersWidget,
    text: "settings.users",
    value: "6",
    icon: PeopleIcon,
    path: "users",
    dataTour: "usersSettingsLink",
    permission: [Permissions.SHOW_EMPLOYEES, Permissions.SHOW_PERMISSIONS],
  },
  {
    component: SettingsFileApiWidget,
    text: "settings.fileApiSettings",
    value: "11",
    icon: FileApiIcon,
    path: "file-api-settings",
  },
  {
    component: SettingsPreferencesWidget,
    text: "settings.preferences",
    value: "10",
    icon: PreferencesIcon,
    path: "preferences",
    permission: Permissions.SHOW_PREFERENCES,
  },
  {
    component: SettingsSubscriptionWidget,
    text: "settings.subscriptions",
    value: "11",
    icon: DollarCircleIcon,
    path: "subscriptions",
  },
  {
    component: TranslationsWidget,
    text: "settings.translations",
    value: "9",
    permission: Permissions.TRANSLATION_ADMIN,
    icon: DocumentIcon,
    path: "translations",
  },
];
