import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import React from "react";
import NavBar from "../navbar/navbar";
import jwt from "jsonwebtoken";

const NavbarSession = async () => {
  const data = await getServerSession(authOptions);
  const decoded = await jwt.decode(data?.user?.token);

  console.log("data with token", data?.user);
  console.log("decoded", decoded);
  if (!data) {
    return null;
  }
  return <NavBar session={decoded} token={data?.user?.token} />;
};

export default NavbarSession;
