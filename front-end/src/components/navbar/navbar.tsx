"use client";
import React from "react";
import { BadgeAlert, BadgeCheck } from "lucide-react";
import SignOut from "../form/authform/signout";
import Link from "next/link";

const NavBar = ({ session, token }: { session: any; token: string }) => {
  if (!session) {
    return null;
  }
  const data = session;
  return (
    <div className="flex justify-between items-center py-4 px-10 bg-slate-700 text-white">
      <h1>HomePage</h1>
      <div className="flex space-x-5  items-center">
        <div className="space-y-2 w-full">
          <p>{data?.user_id}</p>
          <p>{data?.email}</p>
          <div className="flex items-center w-full">
            {data?.verified ? (
              <div className="flex items-center space-x-2">
                <p className="w-full">You are Verified:</p>
                <BadgeCheck color="#00fa32" />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <p className="w-full">Verify Your account:</p>
                <Link href="/api/verifyAccount/verifyEmail">
                  <BadgeAlert color="#fab700" />
                </Link>
              </div>
            )}
          </div>
        </div>
        <SignOut token={token} />
      </div>
    </div>
  );
};

export default NavBar;
