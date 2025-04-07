import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const LoginDemoWidget = dynamic(
  () => import("@/widgets/login-demo/login-demo-widget"),
  {
    ssr: false,
  }
);

export default function LoginDemo() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div>
      <LoginDemoWidget userId={id} />
    </div>
  );
}
