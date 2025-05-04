"use client";

import BusinessRegister from "@/app/(user)/businessRegister/page";
import { useSearchParams } from "next/navigation";

const Page = () => {

  const searchParams = useSearchParams();
  const ownerId = searchParams.get("ownerId");
  console.log({ownerId})
  return <BusinessRegister ownerId={ownerId}/>;
};

export default Page;
