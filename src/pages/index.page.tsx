import { useGomakeAuth, useGomakeRouter } from "@/hooks";
import { AuthLayout } from "@/layouts";
// import { Inter } from "next/font/google";
import { useEffect } from "react";

export default function Home() {
  return (
    <AuthLayout>
      <>home screen</>
    </AuthLayout>
  );
}
