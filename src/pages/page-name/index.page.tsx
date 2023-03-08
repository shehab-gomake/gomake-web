import { ComponentName } from "@/components";
import { WidgetName } from "@/widgets";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <WidgetName />
      <ComponentName text={t("pageName.welcome")} />
    </div>
  );
}
