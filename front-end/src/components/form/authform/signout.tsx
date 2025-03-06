"use client";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { LogOut } from "lucide-react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/navigation";
import React from "react";

const SignOut = ({token}:{token: any}) => {
  const router = useRouter();
  
  const handleLogout = async () => {
    const uri = process.env.NEXT_PUBLIC_BASE_URL;
    try {
      const response = await fetch(`${uri}/signout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          client: "not-browser",
          authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("clicked");

      if (data.success) {
        router.push("api/auth/signin");
      } else {
        alert("Logout failed!");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed!");
    }
  };
  return (
    <button onClick={handleLogout} className="cursor-pointer z-50">
      <LogOut color="#00fad0" />
    </button>
  );
};

export default SignOut;
