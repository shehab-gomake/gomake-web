import { LoginWidget } from "@/widgets";
import { useTranslation } from "react-i18next";

export default function Login() {
  const { t } = useTranslation();

  return <LoginWidget />;
}
