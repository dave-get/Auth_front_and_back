import React from "react";
import NavbarSession from "@/components/navbar/navbarSession";

const HomePage = async () => {
  return (
    <div className="bg-black/50 h-screen">
      <NavbarSession />
      <h1 className="text-white">Welcome to the HomePage</h1>
    </div>
  );
};

export default HomePage;
