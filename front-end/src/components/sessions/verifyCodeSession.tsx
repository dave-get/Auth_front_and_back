import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import React from "react";
import VerifyAccount from "../form/verification/verifyWithcode";

const VerifySession = async () => {
  const data = await getServerSession(authOptions);
  return <VerifyAccount token={data?.user?.token} />;
};

export default VerifySession;
