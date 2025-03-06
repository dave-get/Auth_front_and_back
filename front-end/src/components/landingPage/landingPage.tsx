import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <Link
      href="/api/auth/signin"
      className="flex item-center justify-center w-32 bg-blue-400 border-2 border-blue-500 rounded-lg"
    >
      Home
    </Link>
  );
};

export default LandingPage;
