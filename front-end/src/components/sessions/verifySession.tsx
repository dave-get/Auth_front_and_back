import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import React from "react";
import VerifyAccountEmail from "../form/verification/sendEmial";

const VerifySession = async () => {
  const data = await getServerSession(authOptions);
  return <VerifyAccountEmail token={data?.user?.token} />;
};

export default VerifySession;
