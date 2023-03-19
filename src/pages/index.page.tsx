import { useGomakeAuth, useGomakeRouter } from "@/hooks";
import { CustomerAuthLayout } from "@/layouts";
import { Outfit } from "next/font/google";
import { useEffect } from "react";

export default function Home() {
  return (
    <CustomerAuthLayout>
      <>home screen</>
    </CustomerAuthLayout>
  );
}
