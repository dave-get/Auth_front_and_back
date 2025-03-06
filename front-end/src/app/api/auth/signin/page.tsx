import SigninForm from "@/components/form/authform/signinForm";
import Link from "next/link";
import React from "react";

const Signin = () => {
  return (
    <div className="flex item-center justify-center h-screen pt-20">
      <div className="w-[50%] h-[50%]">
        <SigninForm />
        <div className="mt-5">
          <Link href="/api/forgotPassword/forgotPass" className="text-blue-400">
            forgot account?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link href="/api/auth/signup" className="text-blue-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
