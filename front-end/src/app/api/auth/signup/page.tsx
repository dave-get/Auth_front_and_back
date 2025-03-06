import SignupForm from "@/components/form/authform/signupForm";
import Link from "next/link";
import React from "react";

const Signup = () => {
  return (
    <div className="flex item-center justify-center w-full h-screen pt-20">
      <div className="w-[50%] h-[50%]">
        <SignupForm />
        <div className="mt-5">
          <p>
            I do have an account{" "}
            <Link href="/api/auth/signin" className="text-blue-700">
              SignIn
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
